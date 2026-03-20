'use client';

import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { INDIA_TOPOLOGY_URL } from '@/data/indiaTopoUrl';
import { ELECTION_BY_CODE, ELECTION_STATES } from '@/data/electionData';
import { getStateByCode, getStateByTopoName, ALL_STATES } from '@/data/statesData';
import { PARTY_COLORS } from '@/data/dummy';

const DEFAULT_FILL = '#1a2a4a';

// Map each party hex → gradient URL that lives inside this component's SVG
const PARTY_GRAD = {
  '#FF822D': 'url(#mg-orange)',
  '#ff822d': 'url(#mg-orange)',
  '#4271FE': 'url(#mg-blue)',
  '#4271fe': 'url(#mg-blue)',
  '#F04F5C': 'url(#mg-red)',
  '#f04f5c': 'url(#mg-red)',
  '#15B77E': 'url(#mg-green)',
  '#15b77e': 'url(#mg-green)',
  '#B261EC': 'url(#mg-purple)',
  '#b261ec': 'url(#mg-purple)',
  '#14C1D7': 'url(#mg-cyan)',
  '#14c1d7': 'url(#mg-cyan)',
  '#F5A623': 'url(#mg-amber)',
  '#f5a623': 'url(#mg-amber)',
  '#8E9CAE': 'url(#mg-gray)',
  '#8e9cae': 'url(#mg-gray)',
  '#20BFA9': 'url(#mg-teal)',
  '#20bfa9': 'url(#mg-teal)',
};

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

export default function IndiaMap({ onStateClick, highlightState, stateData = [], externalViewMode, highlightParty }) {
  const [hovered,  setHovered]  = useState(null);
  const [viewMode, setViewMode] = useState('parties');

  const activeViewMode = externalViewMode || viewMode;

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
    // 1. Try direct ID or property (e.g. "RJ")
    let id = geo.id ?? geo.properties?.id ?? geo.properties?.state_code;
    if (id && id !== '-99' && getStateByCode(id)) return id;

    // 2. Try mapping by Name (e.g. "Rajasthan" -> "RJ")
    const nameStr = geo.properties?.name || geo.properties?.st_nm || id;
    const info = getStateByTopoName(nameStr) || (id ? getStateByCode(id) : null);
    
    return info?.code || id;
  };

  const getFill = geo => {
    const code = getStateCode(geo);
    if (hovered === code)        return 'url(#mg-hover)';    // warm orange glow on hover
    if (highlightState === code) return 'url(#mg-blue)';     // blue for active selected
    const s = stateByCode[code] || ELECTION_BY_CODE[code];
    if (!s) return DEFAULT_FILL;
    // Dim states that don't match the highlighted party
    if (highlightParty) {
      const stateParty = s.party ?? s.winner;
      if (stateParty !== highlightParty) return 'rgba(30,40,70,0.4)';
    }
    if (activeViewMode === 'alliance') {
      const aColor = s.colorAlliance || DEFAULT_FILL;
      return PARTY_GRAD[aColor] || aColor;
    }
    const flat = s.colorParty || PARTY_COLORS[s.party] || PARTY_COLORS[s.winner] || DEFAULT_FILL;
    // Convert any known hex to its named gradient
    return PARTY_GRAD[flat] || flat;
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
    const partyLabel = s.party ?? s.winner ?? 'N/A';
    
    // Generate deterministic rich mock data
    const charCode = hovered.charCodeAt(0) || 65;
    const turnout = (60 + (charCode % 25) + ((hovered.length * 3) % 10)).toFixed(1);
    const candidates = ['Narendra Modi', 'Rahul Gandhi', 'Amit Shah', 'Mamata Banerjee', 'Akhilesh Yadav', 'Nitish Kumar', 'TJS George'];
    const keyCandidate = candidates[charCode % candidates.length];

    return {
      name:        s.name || s.state || info?.name || hovered,
      party:       partyLabel,
      alliance:    s.alliance ?? 'N/A',
      rulingSeats: s.rulingSeats ?? s.seats ?? 0,
      totalSeats:  s.totalSeats ?? 0,
      color:       s.colorParty || PARTY_COLORS[partyLabel] || '#FF822D',
      turnout:     `${turnout}%`,
      candidate:   keyCandidate,
    };
  }, [hovered, stateByCode]);

  const legendEntries = useMemo(() => {
    if (activeViewMode === 'alliance') {
      const map = {};
      ELECTION_STATES.forEach(s => { if (s.alliance && !map[s.alliance]) map[s.alliance] = s.colorAlliance; });
      return Object.entries(map).slice(0, 8);
    }
    const map = {};
    ELECTION_STATES.forEach(s => { if (s.party && !map[s.party]) map[s.party] = s.colorParty; });
    return Object.entries(map).slice(0, 8);
  }, [activeViewMode]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Map */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 pointer-events-auto">
          {OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setViewMode(opt.id)}
              className="px-2.5 py-1 rounded text-[10px] font-semibold transition-all shadow-md"
              style={
                activeViewMode === opt.id
                  ? { background: 'rgba(255,107,0,0.15)', color: '#FF822D', border: '1px solid rgba(255,107,0,0.35)', boxShadow: '0 0 10px rgba(255,107,0,0.2)' }
                  : { background: 'var(--t-bgCard)', border: '1px solid var(--t-border)', color: 'var(--t-textSec)' }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 items-end pointer-events-auto max-h-[95%] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {legendEntries.map(([p, c]) => (
            <div key={p} className="flex items-center gap-1.5 px-2 py-1 rounded border shadow-sm" style={{ background: 'var(--t-bgCard)', borderColor: 'var(--t-border)' }}>
              <span className="text-[9px] text-[var(--t-textSec)] font-bold whitespace-nowrap">{p}</span>
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
            </div>
          ))}
        </div>
        {/* SVG filter + ALL gradient defs — MUST be in same SVG context as map paths */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="state-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Hover orange */}
            <linearGradient id="mg-hover"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FF5500"/><stop offset="100%" stopColor="#FFBE6A"/></linearGradient>
            {/* BJP / SS — orange */}
            <linearGradient id="mg-orange" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FF5500"/><stop offset="55%"  stopColor="#FF822D"/><stop offset="100%" stopColor="#FFBE6A"/></linearGradient>
            {/* INC / JDU — blue */}
            <linearGradient id="mg-blue"   x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1E50CC"/><stop offset="100%" stopColor="#78AAFF"/></linearGradient>
            {/* SP / CPI(M) — red */}
            <linearGradient id="mg-red"    x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#C82035"/><stop offset="100%" stopColor="#FF6E7A"/></linearGradient>
            {/* TMC / NC — green */}
            <linearGradient id="mg-green"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0A8055"/><stop offset="100%" stopColor="#3DE8A0"/></linearGradient>
            {/* DMK — purple */}
            <linearGradient id="mg-purple" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7E2ECC"/><stop offset="100%" stopColor="#CF9BFF"/></linearGradient>
            {/* TDP — cyan */}
            <linearGradient id="mg-cyan"   x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0894AA"/><stop offset="100%" stopColor="#5AE2F8"/></linearGradient>
            {/* NCP — amber */}
            <linearGradient id="mg-amber"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#C87A00"/><stop offset="100%" stopColor="#FFD060"/></linearGradient>
            {/* AIADMK — teal */}
            <linearGradient id="mg-teal"   x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0E8F82"/><stop offset="100%" stopColor="#59D3C0"/></linearGradient>
            {/* Others — gray */}
            <linearGradient id="mg-gray"   x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#506078"/><stop offset="100%" stopColor="#A8BCCC"/></linearGradient>
          </defs>
        </svg>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [82.5, 21], scale: 1000 }}
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
                    strokeWidth={isHov || isSelect ? 1.5 : 0.8}
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
            className="absolute top-20 left-2 text-[11px] pointer-events-none z-10 rounded-xl overflow-hidden min-w-[150px]"
            style={{
              background: 'var(--t-tip)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${hoveredPayload.color}50`,
              boxShadow: `0 8px 32px var(--t-shadow), 0 0 20px ${hoveredPayload.color}20`,
              padding: '10px 14px',
            }}
          >
            <div className="font-black text-[13px] mb-1.5 text-[var(--t-text)] border-b border-[var(--t-border)] pb-1.5">
              {hoveredPayload.name}
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex items-center justify-between">
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-black"
                  style={{
                    background: `${hoveredPayload.color}22`,
                    color: hoveredPayload.color,
                    border: `1px solid ${hoveredPayload.color}50`,
                    textShadow: `0 0 8px ${hoveredPayload.color}80`,
                  }}
                >
                  {activeViewMode === 'alliance' ? hoveredPayload.alliance : hoveredPayload.party}
                </span>
                {hoveredPayload.rulingSeats > 0 && (
                  <span className="text-[var(--t-textSec)] text-[11px] font-mono">
                    <span className="font-bold" style={{ color: hoveredPayload.color }}>{hoveredPayload.rulingSeats}</span>
                    {hoveredPayload.totalSeats > 0 && <span className="text-[var(--t-textMut)]">/{hoveredPayload.totalSeats}</span>}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-[var(--t-textMut)] uppercase tracking-wider font-bold">Turnout</span>
                <span className="text-[10px] text-green-500 font-bold">{hoveredPayload.turnout}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[9px] text-[var(--t-textMut)] uppercase tracking-wider font-bold">Key Lead</span>
                <span className="text-[10px] text-[var(--t-text)] font-semibold truncate max-w-[85px] text-right">{hoveredPayload.candidate}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
