'use client';

import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { INDIA_TOPOLOGY_URL } from '@/data/indiaTopoUrl';
import { ELECTION_BY_CODE, ELECTION_STATES } from '@/data/electionData';
import { getStateByCode, ALL_STATES } from '@/data/statesData';
import { PARTY_COLORS } from '@/data/dummy';

const DEFAULT_FILL = '#1a2a4a';

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
    if (hovered === code)        return '#ff8c3a';
    if (highlightState === code) return '#4f8eff';
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
      name:        s.name || s.state || info?.name || hovered,
      party:       s.party ?? s.winner ?? 'N/A',
      alliance:    s.alliance ?? 'N/A',
      rulingSeats: s.rulingSeats ?? s.seats ?? 0,
      totalSeats:  s.totalSeats ?? 0,
      color:       s.colorParty || PARTY_COLORS[s.party] || '#ff6b00',
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
              className="px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all"
              style={
                viewMode === opt.id
                  ? {
                      background: 'rgba(255,107,0,0.15)',
                      color: '#ff6b00',
                      border: '1px solid rgba(255,107,0,0.35)',
                      boxShadow: '0 0 10px rgba(255,107,0,0.2)',
                    }
                  : {
                      background: 'var(--t-bgCard)',
                      border: '1px solid var(--t-border)',
                      color: 'var(--t-textSec)',
                    }
              }
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

      {/* Map */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {/* SVG filter for glow */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="state-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [82, 23], scale: 1000 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={INDIA_TOPOLOGY_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const code     = getStateCode(geo);
                const isHov    = hovered === code;
                const isSelect = highlightState === code;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getFill(geo)}
                    stroke={isHov ? 'rgba(255,140,58,0.9)' : isSelect ? 'rgba(79,142,255,0.9)' : 'var(--t-mapStroke)'}
                    strokeWidth={isHov || isSelect ? 1.2 : 0.4}
                    style={{
                      default: { outline: 'none', filter: isHov ? 'url(#state-glow)' : 'none', transition: 'fill 0.2s ease' },
                      hover:   { outline: 'none', fill: '#ff8c3a', cursor: 'pointer', filter: 'url(#state-glow)' },
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

        {/* Hover tooltip — glassmorphic */}
        {hoveredPayload && (
          <div
            className="absolute top-2 left-2 text-[11px] pointer-events-none z-10 rounded-xl overflow-hidden"
            style={{
              background: 'var(--t-tip)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${hoveredPayload.color}50`,
              boxShadow: `0 8px 32px var(--t-shadow), 0 0 20px ${hoveredPayload.color}20`,
              padding: '8px 12px',
            }}
          >
            <div
              className="font-black text-[12px] mb-1 text-[var(--t-text)]"
            >
              {hoveredPayload.name}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-black"
                style={{
                  background: `${hoveredPayload.color}22`,
                  color: hoveredPayload.color,
                  border: `1px solid ${hoveredPayload.color}50`,
                  textShadow: `0 0 8px ${hoveredPayload.color}80`,
                }}
              >
                {viewMode === 'alliance' ? hoveredPayload.alliance : hoveredPayload.party}
              </span>
              {hoveredPayload.rulingSeats > 0 && (
                <span className="text-[var(--t-textSec)] text-[10px]">
                  <span style={{ color: hoveredPayload.color }}>{hoveredPayload.rulingSeats}</span>
                  {hoveredPayload.totalSeats > 0 && (
                    <span className="text-[var(--t-textMut)]">/{hoveredPayload.totalSeats}</span>
                  )}
                  {' seats'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
