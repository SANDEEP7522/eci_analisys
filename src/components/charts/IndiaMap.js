'use client';

import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { INDIA_TOPOLOGY_URL } from '@/data/indiaTopoUrl';
import { ELECTION_BY_CODE, ELECTION_STATES } from '@/data/electionData';
import { getStateByCode, ALL_STATES } from '@/data/statesData';
import { PARTY_COLORS } from '@/data/dummy';

const DEFAULT_FILL = '#94a3b8';

const OPTIONS = [
  { id: 'parties', label: 'State Legislatures by Parties' },
  { id: 'alliance', label: 'State Legislatures by Alliance' },
];

/** Resolve state code from stateData item (id, code, or state name lookup) */
function getCodeFromStateItem(s, nameToCode) {
  if (s.id) return s.id;
  if (s.code) return s.code;
  if (s.state && nameToCode) return nameToCode[s.state];
  return null;
}

export default function IndiaMap({
  onStateClick,
  highlightState,
  stateData = [],
  selectedYear,
}) {
  const [hovered, setHovered] = useState(null);
  const [viewMode, setViewMode] = useState('parties');

  const nameToCode = useMemo(
    () => Object.fromEntries((ALL_STATES || []).map((s) => [s.name, s.code])),
    []
  );

  const stateByCode = useMemo(() => {
    const fromElection = Object.fromEntries(
      ELECTION_STATES.map((s) => [s.code, s])
    );
    const fromProps = {};
    (stateData || []).forEach((s) => {
      const code = getCodeFromStateItem(s, nameToCode);
      if (code) fromProps[code] = { ...s, code };
    });
    return { ...fromElection, ...fromProps };
  }, [stateData, nameToCode]);

  const getStateCode = (geo) => {
    const id = geo.id ?? geo.properties?.id ?? geo.properties?.state_code;
    if (id && id !== '-99') return id;
    const name = geo.properties?.name || geo.properties?.ST_NM || geo.properties?.State;
    const fromStates = getStateByCode ? getStateByCode(id) : null;
    return fromStates?.code || id;
  };

  const getFill = (geo) => {
    const code = getStateCode(geo);
    if (hovered === code) return '#fbbf24';
    if (highlightState === code) return '#1e3a8a';
    const fromYear = stateByCode[code];
    const fromStatic = ELECTION_BY_CODE[code];
    const election = fromYear || fromStatic;
    if (viewMode === 'alliance') {
      if (fromStatic?.colorAlliance) return fromStatic.colorAlliance;
      return DEFAULT_FILL;
    }
    if (viewMode === 'parties') {
      if (fromYear?.winner && PARTY_COLORS[fromYear.winner]) return PARTY_COLORS[fromYear.winner];
      if (fromStatic?.colorParty) return fromStatic.colorParty;
      if (election?.colorParty) return election.colorParty;
      if (election?.winner && PARTY_COLORS[election.winner]) return PARTY_COLORS[election.winner];
    }
    return DEFAULT_FILL;
  };

  const getClickPayload = (geo) => {
    const code = getStateCode(geo);
    const fromYear = stateByCode[code];
    const fromStatic = ELECTION_BY_CODE[code];
    const election = fromYear || fromStatic;
    const info = getStateByCode ? getStateByCode(code) : null;
    const name = election?.name || election?.state || info?.name || geo.properties?.name || code;
    const winner = election?.party ?? election?.winner ?? 'N/A';
    return {
      id: code,
      name,
      seats: election?.rulingSeats ?? election?.seats ?? election?.totalSeats ?? 0,
      winner,
      colorParty: election?.colorParty ?? PARTY_COLORS[winner],
      ...election,
    };
  };

  const hoveredPayload = hovered ? (() => {
    const fromYear = stateByCode[hovered];
    const fromStatic = ELECTION_BY_CODE[hovered];
    const election = fromYear || fromStatic;
    const info = getStateByCode ? getStateByCode(hovered) : null;
    const name = election?.name || election?.state || info?.name || hovered;
    return {
      name,
      party: election?.party ?? election?.winner ?? 'N/A',
      alliance: election?.alliance ?? 'N/A',
      rulingSeats: election?.rulingSeats ?? election?.seats ?? 0,
    };
  })() : null;

  const legendEntries = useMemo(() => {
    if (viewMode === 'alliance') {
      const byAlliance = {};
      ELECTION_STATES.forEach((s) => {
        if (s.alliance && !byAlliance[s.alliance]) byAlliance[s.alliance] = s.colorAlliance;
      });
      return Object.entries(byAlliance).slice(0, 10);
    }
    const byParty = {};
    ELECTION_STATES.forEach((s) => {
      if (s.party && !byParty[s.party]) byParty[s.party] = s.colorParty;
    });
    return Object.entries(byParty).slice(0, 10);
  }, [viewMode]);

  return (
    <div className="relative w-full">
      {/* View mode toggle */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setViewMode(opt.id)}
            className={`w-full sm:w-auto px-3 py-2.5 sm:py-1.5 rounded-lg text-xs font-medium transition-colors text-left sm:text-center ${
              viewMode === opt.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [82, 23],
          scale: 900,
        }}
        className="w-full h-auto"
        style={{ minHeight: 320 }}
      >
        <Geographies geography={INDIA_TOPOLOGY_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const code = getStateCode(geo);
              const fill = getFill(geo);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill || DEFAULT_FILL}
                  stroke="#fff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: '#fbbf24' },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={() => code && setHovered(code)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    code &&
                    onStateClick &&
                    onStateClick(getClickPayload(geo))
                  }
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Legend from election data */}
      <div className="flex flex-wrap gap-2 mt-2">
        {legendEntries.map(([party, color]) => (
          <div key={party} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {party}
            </span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredPayload && (
        <div className="absolute top-2 left-2 bg-gray-900 dark:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs shadow-lg pointer-events-none z-10 border border-gray-700">
          <div className="font-bold">{hoveredPayload.name}</div>
          <div className="text-gray-300 mt-0.5">
            {viewMode === 'alliance'
              ? `${hoveredPayload.alliance} · ${hoveredPayload.rulingSeats} seats`
              : `${hoveredPayload.party} · ${hoveredPayload.rulingSeats} seats`}
          </div>
        </div>
      )}
    </div>
  );
}
