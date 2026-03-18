'use client';

import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { INDIA_TOPOLOGY_URL } from '@/data/indiaTopoUrl';
import { ELECTION_BY_CODE, ELECTION_STATES } from '@/data/electionData';
import { getStateByCode, ALL_STATES } from '@/data/statesData';
import { PARTY_COLORS } from '@/data/dummy';

const DEFAULT_FILL = '#1e3a5f';

const OPTIONS = [
  { id: 'parties',  label: 'By Parties'  },
  { id: 'alliance', label: 'By Alliance' },
];

function getCodeFromStateItem(s, nameToCode) {
  if (s.id)    return s.id;
  if (s.code)  return s.code;
  if (s.state && nameToCode) return nameToCode[s.state];
  return null;
}

export default function IndiaMap({ onStateClick, highlightState, stateData = [] }) {
  const [hovered,  setHovered]  = useState(null);
  const [viewMode, setViewMode] = useState('parties');

  const nameToCode = useMemo(
    () => Object.fromEntries((ALL_STATES || []).map(s => [s.name, s.code])),
    []
  );

  const stateByCode = useMemo(() => {
    const fromElection = Object.fromEntries(ELECTION_STATES.map(s => [s.code, s]));
    const fromProps = {};
    (stateData || []).forEach(s => {
      const code = getCodeFromStateItem(s, nameToCode);
      if (code) fromProps[code] = { ...s, code };
    });
    return { ...fromElection, ...fromProps };
  }, [stateData, nameToCode]);

  const getStateCode = geo => {
    const id = geo.id ?? geo.properties?.id ?? geo.properties?.state_code;
    if (id && id !== '-99') return id;
    const info = getStateByCode ? getStateByCode(id) : null;
    return info?.code || id;
  };

  const getFill = geo => {
    const code = getStateCode(geo);
    if (hovered === code)      return '#fbbf24';
    if (highlightState === code) return '#2563eb';
    const s = stateByCode[code] || ELECTION_BY_CODE[code];
    if (!s) return DEFAULT_FILL;
    if (viewMode === 'alliance') return s.colorAlliance || DEFAULT_FILL;
    return s.colorParty || PARTY_COLORS[s.party] || PARTY_COLORS[s.winner] || DEFAULT_FILL;
  };

  const getClickPayload = geo => {
    const code  = getStateCode(geo);
    const s     = stateByCode[code] || ELECTION_BY_CODE[code] || {};
    const info  = getStateByCode ? getStateByCode(code) : null;
    const name  = s.name || s.state || info?.name || geo.properties?.name || code;
    const winner = s.party ?? s.winner ?? 'N/A';
    return { id: code, name, seats: s.rulingSeats ?? s.seats ?? 0, winner, colorParty: s.colorParty ?? PARTY_COLORS[winner], ...s };
  };

  const hoveredPayload = useMemo(() => {
    if (!hovered) return null;
    const s    = stateByCode[hovered] || ELECTION_BY_CODE[hovered] || {};
    const info = getStateByCode ? getStateByCode(hovered) : null;
    return {
      name:       s.name || s.state || info?.name || hovered,
      party:      s.party ?? s.winner ?? 'N/A',
      alliance:   s.alliance ?? 'N/A',
      rulingSeats: s.rulingSeats ?? s.seats ?? 0,
      totalSeats: s.totalSeats ?? 0,
      color:      s.colorParty || PARTY_COLORS[s.party] || '#fff',
    };
  }, [hovered, stateByCode]);

  const legendEntries = useMemo(() => {
    if (viewMode === 'alliance') {
      const map = {};
      ELECTION_STATES.forEach(s => { if (s.alliance && !map[s.alliance]) map[s.alliance] = s.colorAlliance; });
      return Object.entries(map).slice(0, 8);
    }
    const map = {};
    ELECTION_STATES.forEach(s => { if (s.party && !map[s.party]) map[s.party] = s.colorParty; });
    return Object.entries(map).slice(0, 8);
  }, [viewMode]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">

      {/* Toggle & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          {OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setViewMode(opt.id)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                viewMode === opt.id
                  ? 'bg-blue-600 text-white shadow shadow-blue-900/50'
                  : 'bg-[var(--t-bgCard)] border border-[var(--t-border)] text-[var(--t-textSec)] hover:border-blue-500 hover:text-[var(--t-text)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1 sm:ml-auto">
          {legendEntries.map(([p, c]) => (
            <div key={p} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />
              <span className="text-[9px] text-[var(--t-textSec)] whitespace-nowrap">{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map fills remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [82, 23], scale: 1000 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={INDIA_TOPOLOGY_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const code = getStateCode(geo);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getFill(geo)}
                    stroke="#0b1120"
                    strokeWidth={0.6}
                    style={{
                      default: { outline: 'none' },
                      hover:   { outline: 'none', fill: '#fbbf24', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={() => code && setHovered(code)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => code && onStateClick && onStateClick(getClickPayload(geo))}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Hover tooltip */}
        {hoveredPayload && (
          <div className="absolute top-2 left-2 bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] text-[var(--t-text)] px-3 py-2 rounded-lg text-[11px] shadow-xl pointer-events-none z-10">
            <div className="font-bold text-[var(--t-text)] mb-0.5">{hoveredPayload.name}</div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: hoveredPayload.color + '33', color: hoveredPayload.color }}>
                {viewMode === 'alliance' ? hoveredPayload.alliance : hoveredPayload.party}
              </span>
              {hoveredPayload.rulingSeats > 0 && (
                <span className="text-[var(--t-textSec)]">{hoveredPayload.rulingSeats}
                  {hoveredPayload.totalSeats > 0 && <span className="text-[var(--t-textMut)]">/{hoveredPayload.totalSeats}</span>} seats
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
