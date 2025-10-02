import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RigvedaData, Mandala, Sukta, Verse } from '../types/rigveda';
import { Link, useNavigate } from 'react-router-dom';

interface TreeExplorerProps {
  data: RigvedaData;
}

type NodeKey = string;

const keyForMandala = (m: Mandala) => `m-${m.mandala}` as NodeKey;
const keyForSukta = (m: number, s: Sukta) => `m-${m}-s-${s.suktaNumber}` as NodeKey;
const keyForVerse = (m: number, s: number, v: Verse) => `m-${m}-s-${s}-v-${v.verseNumber}` as NodeKey;

const TreeExplorer: React.FC<TreeExplorerProps> = ({ data }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Record<NodeKey, boolean>>({});
  const [filter, setFilter] = useState('');
  const [mode, setMode] = useState<'list' | 'tree' | 'radial'>('tree');
  const [zoom, setZoom] = useState({ scale: 1, tx: 0, ty: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const toggle = (key: NodeKey) => setExpanded((e) => ({ ...e, [key]: !e[key] }));

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return data;
    const mandalas = data.mandalas
      .map((m) => {
        const suktas = m.suktas
          .map((s) => {
            const verses = s.verses.filter(
              (v) => v.sanskrit_deva.toLowerCase().includes(q) || v.transliteration.toLowerCase().includes(q) || v.translation.text.toLowerCase().includes(q)
            );
            return verses.length > 0 || `${s.deity} ${s.rsi} ${s.meter}`.toLowerCase().includes(q)
              ? { ...s, verses }
              : null;
          })
          .filter(Boolean) as Sukta[];
        return suktas.length > 0 ? { ...m, suktas } : null;
      })
      .filter(Boolean) as Mandala[];
    return { mandalas } as RigvedaData;
  }, [data, filter]);

  const goToHymn = (mandala: number, sukta: number) => navigate(`/mandala/${mandala}/hymn/${sukta}`);

  // Build a simple layout for an SVG tree (horizontal) when in tree mode.
  type TreeNode = { id: string; label: string; level: number; y: number; x: number; onClick?: () => void; tooltip?: string };
  type TreeEdge = { from: string; to: string };

  const radialContainerRef = useRef<HTMLDivElement | null>(null);

  const { nodes, edges, width, height } = useMemo(() => {
    if (mode === 'radial') {
      const nodes: TreeNode[] = [];
      const edges: TreeEdge[] = [];
      const W = 900;
      const H = 700;
      const cx = W / 2;
      const cy = H / 2;
      const rMandala = 90;
      const rHymn = 220;
      const rVerse = 330;
      const mandalas = filtered.mandalas;
      const mandalaCount = mandalas.length || 1;
      const TWO_PI = Math.PI * 2;
      const hymnCap = 6;
      const verseCap = 2;

      mandalas.forEach((m, mi) => {
        const baseAngle = (mi / mandalaCount) * TWO_PI;
        const mId = keyForMandala(m);
        const mx = cx + rMandala * Math.cos(baseAngle);
        const my = cy + rMandala * Math.sin(baseAngle);
        nodes.push({ id: mId, label: `Mandala ${m.mandala}`, level: 0, x: mx, y: my, onClick: () => toggle(mId), tooltip: `${m.suktas.length} hymns` });

        const hymnsShown = m.suktas.slice(0, hymnCap);
        const hymnAngleSpan = TWO_PI / mandalaCount * 0.8; // slight gap between sectors
        hymnsShown.forEach((s, si) => {
          const frac = (si + 1) / (hymnsShown.length + 1);
          const angle = baseAngle - hymnAngleSpan / 2 + hymnAngleSpan * frac;
          const sId = keyForSukta(m.mandala, s);
          const sx = cx + rHymn * Math.cos(angle);
          const sy = cy + rHymn * Math.sin(angle);
          nodes.push({ id: sId, label: `H ${s.suktaNumber}`, level: 1, x: sx, y: sy, onClick: () => navigate(`/mandala/${m.mandala}/hymn/${s.suktaNumber}`), tooltip: `${s.deity} · ${s.rsi} · ${s.meter}` });
          edges.push({ from: mId, to: sId });

          const verses = s.verses.slice(0, verseCap);
          verses.forEach((v, vi) => {
            const vFrac = (vi + 1) / (verses.length + 1);
            const vAngle = angle - 0.18 + 0.36 * vFrac;
            const vId = keyForVerse(m.mandala, s.suktaNumber, v);
            const vx = cx + rVerse * Math.cos(vAngle);
            const vy = cy + rVerse * Math.sin(vAngle);
            nodes.push({ id: vId, label: `v${v.verseNumber}`, level: 2, x: vx, y: vy, onClick: () => navigate(`/mandala/${m.mandala}/hymn/${s.suktaNumber}`), tooltip: v.translation.text.slice(0, 100) + (v.translation.text.length > 100 ? '…' : '') });
            edges.push({ from: sId, to: vId });
          });
        });

        if (m.suktas.length > hymnCap) {
          const moreId = `${mId}-more`;
          const moreAngle = baseAngle + hymnAngleSpan * 0.55;
          const mx2 = cx + rHymn * Math.cos(moreAngle);
          const my2 = cy + rHymn * Math.sin(moreAngle);
          nodes.push({ id: moreId, label: `+${m.suktas.length - hymnCap} more`, level: 1, x: mx2, y: my2, onClick: () => navigate(`/mandala/${m.mandala}`), tooltip: 'Open mandala to view all hymns' });
          edges.push({ from: mId, to: moreId });
        }
      });

      return { nodes, edges, width: W, height: H };
    }

    if (mode !== 'tree') return { nodes: [] as TreeNode[], edges: [] as TreeEdge[], width: 0, height: 0 };
    const spacingY = 28;
    const spacingX = 240;
    let currentY = 30;
    const nodes: TreeNode[] = [];
    const edges: TreeEdge[] = [];

    filtered.mandalas.forEach((m) => {
      const mId = keyForMandala(m);
      nodes.push({ id: mId, label: `Mandala ${m.mandala}`, level: 0, x: 40, y: currentY, onClick: () => toggle(mId) });
      const startYForMandala = currentY;
      currentY += spacingY;

      m.suktas.forEach((s) => {
        const sId = keyForSukta(m.mandala, s);
        nodes.push({ id: sId, label: `Hymn ${s.suktaNumber} · ${s.deity}`, level: 1, x: 40 + spacingX, y: currentY, onClick: () => navigate(`/mandala/${m.mandala}/hymn/${s.suktaNumber}`) });
        edges.push({ from: mId, to: sId });
        const startYForSukta = currentY;
        currentY += spacingY;

        const verses = s.verses.slice(0, 3); // cap for readability in diagram
        verses.forEach((v) => {
          const vId = keyForVerse(m.mandala, s.suktaNumber, v);
          nodes.push({ id: vId, label: `v.${v.verseNumber}`, level: 2, x: 40 + spacingX * 2, y: currentY, onClick: () => navigate(`/mandala/${m.mandala}/hymn/${s.suktaNumber}`) });
          edges.push({ from: sId, to: vId });
          currentY += spacingY;
        });

        if (verses.length === 0) {
          // ensure at least one row of space for empty hymns in diagram
          currentY += 4;
        }

        // add small gap between hymns
        currentY += 8;
      });

      // visually group mandalas
      currentY = Math.max(currentY, startYForMandala + spacingY);
      currentY += 16;
    });

    const width = 40 + spacingX * 2 + 240;
    const height = currentY + 40;
    return { nodes, edges, width, height };
  }, [filtered, mode, navigate]);

  const onWheel = (e: React.WheelEvent) => {
    if (mode !== 'radial') return;
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.1 : 0.9;
    setZoom((z) => ({ ...z, scale: Math.max(0.4, Math.min(3, z.scale * factor)) }));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'radial') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - zoom.tx, y: e.clientY - zoom.ty });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (mode !== 'radial' || !isDragging || !dragStart) return;
    setZoom((z) => ({ ...z, tx: e.clientX - dragStart.x, ty: e.clientY - dragStart.y }));
  };

  const onMouseUpLeave = () => {
    if (mode !== 'radial') return;
    setIsDragging(false);
  };

  const resetView = () => setZoom({ scale: 1, tx: 0, ty: 0 });

  // Auto-fit radial content to container on mode/filter change
  useEffect(() => {
    if (mode !== 'radial') return;
    const container = radialContainerRef.current;
    if (!container) return;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const fitScale = Math.min(containerWidth / Math.max(1, width), containerHeight / Math.max(1, height)) * 0.9;
    const tx = (containerWidth - width * fitScale) / 2;
    const ty = (containerHeight - height * fitScale) / 2;
    setZoom({ scale: isFinite(fitScale) ? fitScale : 1, tx: isFinite(tx) ? tx : 0, ty: isFinite(ty) ? ty : 0 });
  }, [mode, width, height, filtered]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-earth-800 dark:text-earth-200">Tree Explorer</h1>
        <Link to="/" className="text-saffron-700 dark:text-saffron-300 underline">Home</Link>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by text, deity, rishi, meter..."
          className="w-full px-4 py-2 text-earth-800 dark:text-earth-200 bg-earth-50 dark:bg-gray-700 border border-earth-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
        />
        <div className="flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 border border-earth-200 dark:border-gray-700">
            <button
              className={`px-3 py-1.5 rounded ${mode === 'tree' ? 'bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300' : 'text-earth-700 dark:text-earth-300'}`}
              onClick={() => setMode('tree')}
            >Tree</button>
            <button
              className={`px-3 py-1.5 rounded ${mode === 'list' ? 'bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300' : 'text-earth-700 dark:text-earth-300'}`}
              onClick={() => setMode('list')}
            >List</button>
            <button
              className={`px-3 py-1.5 rounded ${mode === 'radial' ? 'bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300' : 'text-earth-700 dark:text-earth-300'}`}
              onClick={() => setMode('radial')}
            >Radial</button>
          </div>
        </div>
      </div>

      {mode === 'radial' ? (
        <div className="rounded-xl border border-earth-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden" style={{ height: '70vh' }}>
          <div className="flex items-center justify-end gap-2 p-2 border-b border-earth-100 dark:border-gray-700">
            <button className="px-2 py-1 text-sm bg-earth-100 dark:bg-gray-700 rounded" onClick={() => setZoom((z) => ({ ...z, scale: Math.min(3, z.scale * 1.1) }))}>+</button>
            <button className="px-2 py-1 text-sm bg-earth-100 dark:bg-gray-700 rounded" onClick={() => setZoom((z) => ({ ...z, scale: Math.max(0.4, z.scale * 0.9) }))}>-</button>
            <button className="px-2 py-1 text-sm bg-earth-100 dark:bg-gray-700 rounded" onClick={resetView}>Reset</button>
          </div>
          <div ref={radialContainerRef} className="w-full h-[calc(70vh-40px)] cursor-grab active:cursor-grabbing relative"
               onWheel={onWheel}
               onMouseDown={onMouseDown}
               onMouseMove={onMouseMove}
               onMouseUp={onMouseUpLeave}
               onMouseLeave={onMouseUpLeave}>
            <svg width={width} height={height} style={{ transform: `translate(${zoom.tx}px, ${zoom.ty}px) scale(${zoom.scale})`, transformOrigin: 'center center' }}>
              {edges.map((e) => {
                const from = nodes.find((n) => n.id === e.from)!;
                const to = nodes.find((n) => n.id === e.to)!;
                return (
                  <g key={`${e.from}->${e.to}`}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="stroke-earth-200 dark:stroke-gray-700" strokeWidth={1.2} />
                  </g>
                );
              })}
              {nodes.map((n) => (
                <g key={n.id} transform={`translate(${n.x}, ${n.y})`} onClick={n.onClick} className="cursor-pointer">
                  <circle r={10} className={`${n.level === 0 ? 'fill-saffron-600' : n.level === 1 ? 'fill-saffron-500' : 'fill-saffron-400'}`} />
                  <text x={14} y={4} className="fill-earth-800 dark:fill-earth-200 text-sm">{n.label}</text>
                  {n.tooltip && <title>{n.tooltip}</title>}
                </g>
              ))}
            </svg>
            {/* Minimap */}
            <div className="absolute bottom-2 right-2 w-40 h-28 bg-white/70 dark:bg-gray-800/70 rounded border border-earth-200 dark:border-gray-700 overflow-hidden">
              <svg width={160} height={112}>
                {edges.map((e) => {
                  const from = nodes.find((n) => n.id === e.from)!;
                  const to = nodes.find((n) => n.id === e.to)!;
                  const sx = (from.x / width) * 160;
                  const sy = (from.y / height) * 112;
                  const ex = (to.x / width) * 160;
                  const ey = (to.y / height) * 112;
                  return <line key={`${e.from}->${e.to}`} x1={sx} y1={sy} x2={ex} y2={ey} stroke="#cbd5e1" className="dark:stroke-gray-600" strokeWidth={0.8} />;
                })}
                {nodes.map((n) => {
                  const nx = (n.x / width) * 160;
                  const ny = (n.y / height) * 112;
                  return <circle key={`mini-${n.id}`} cx={nx} cy={ny} r={2} fill="#f59e0b" />;
                })}
                {/* viewport rectangle */}
                {(() => {
                  const vw = (160 / (zoom.scale || 1));
                  const vh = (112 / (zoom.scale || 1));
                  const vx = (-zoom.tx / (width || 1)) * 160;
                  const vy = (-zoom.ty / (height || 1)) * 112;
                  return <rect x={vx} y={vy} width={vw} height={vh} fill="none" stroke="#ef4444" strokeWidth={1} />;
                })()}
              </svg>
            </div>
          </div>
        </div>
      ) : mode === 'tree' ? (
        <div className="rounded-xl border border-earth-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto" style={{ maxHeight: '70vh' }}>
          <svg width={width} height={height} className="block">
            {/* edges */}
            {edges.map((e) => {
              const from = nodes.find((n) => n.id === e.from)!;
              const to = nodes.find((n) => n.id === e.to)!;
              return (
                <g key={`${e.from}->${e.to}`}>
                  <path d={`M ${from.x + 100} ${from.y} C ${from.x + 150} ${from.y}, ${to.x - 50} ${to.y}, ${to.x - 10} ${to.y}`} stroke="#e2e8f0" className="dark:stroke-gray-700" fill="none" />
                </g>
              );
            })}
            {/* nodes */}
            {nodes.map((n) => (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`} className="cursor-pointer" onClick={n.onClick}>
                <circle r={10} className="fill-saffron-500" />
                <text x={16} y={5} className="fill-earth-800 dark:fill-earth-200 text-sm">{n.label}</text>
              </g>
            ))}
          </svg>
        </div>
      ) : (
        <div className="rounded-xl border border-earth-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {filtered.mandalas.map((m) => {
          const mKey = keyForMandala(m);
          const mOpen = !!expanded[mKey];
          return (
            <div key={m.mandala} className="border-b last:border-b-0 border-earth-100 dark:border-gray-700">
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-earth-50 dark:hover:bg-gray-700"
                onClick={() => toggle(mKey)}
                aria-expanded={mOpen}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-transform ${mOpen ? 'rotate-90' : ''}`}>▸</span>
                  <span className="font-semibold text-earth-800 dark:text-earth-200">Mandala {m.mandala}</span>
                  <span className="text-sm text-earth-500 dark:text-earth-400">{m.suktas.length} hymns</span>
                </div>
              </button>
              {mOpen && (
                <div className="pl-8 py-2">
                  {m.suktas.map((s) => {
                    const sKey = keyForSukta(m.mandala, s);
                    const sOpen = !!expanded[sKey];
                    return (
                      <div key={s.suktaId} className="border-l border-earth-100 dark:border-gray-700 ml-3">
                        <button
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-earth-50 dark:hover:bg-gray-700 rounded"
                          onClick={() => toggle(sKey)}
                          aria-expanded={sOpen}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`transition-transform ${sOpen ? 'rotate-90' : ''}`}>▸</span>
                            <span className="text-earth-800 dark:text-earth-200">Hymn {s.suktaNumber}</span>
                            <span className="text-sm text-earth-500 dark:text-earth-400">{s.deity} · {s.rsi} · {s.meter}</span>
                          </div>
                          <div>
                            <button
                              className="text-xs px-2 py-1 bg-saffron-600 text-white rounded hover:bg-saffron-700"
                              onClick={(e) => { e.stopPropagation(); goToHymn(m.mandala, s.suktaNumber); }}
                            >
                              Open
                            </button>
                          </div>
                        </button>
                        {sOpen && (
                          <div className="pl-6 py-2">
                            {s.verses.map((v) => {
                              const vKey = keyForVerse(m.mandala, s.suktaNumber, v);
                              return (
                                <div key={vKey} className="flex items-start gap-3 px-2 py-1 rounded hover:bg-earth-50 dark:hover:bg-gray-700">
                                  <div className="w-6 h-6 flex items-center justify-center text-xs bg-earth-100 dark:bg-gray-700 text-earth-700 dark:text-earth-300 rounded">
                                    {v.verseNumber}
                                  </div>
                                  <div className="flex-1 text-sm text-earth-700 dark:text-earth-300 line-clamp-3">
                                    {v.translation.text}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};

export default TreeExplorer;


