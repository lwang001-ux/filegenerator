import { useState, useRef } from 'react'

// Candy-bright vibrant palette
const COLORS = {
  pink: "#FF1493",      // Deep pink
  hotPink: "#FF69B4",   // Hot pink
  yellow: "#FFE135",    // Banana yellow
  mint: "#00D9A5",      // Bright mint
  sky: "#00BFFF",       // Deep sky blue
  lavender: "#9B59FF",  // Bright purple
  coral: "#FF6B6B",     // Coral
  orange: "#FF8C00",    // Dark orange
  lime: "#ADFF2F",      // Green yellow
  cyan: "#00FFFF",      // Cyan
  white: "#FFFFFF",
  offWhite: "#FEFEFE",
  dark: "#2D2D2D",
  gray: "#888888",
  lightGray: "#E8E8E8",
  gridCyan: "#B0E0E6",  // Very light cyan for grid
}

const MONO = "'SF Mono', 'Fira Code', 'Monaco', 'Consolas', monospace"

// Isometric triangle grid - very light
function IsometricGrid() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }}>
      <defs>
        <pattern id="isoTriangles" width="50" height="86.6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="50" y2="0" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="0" y1="28.87" x2="50" y2="28.87" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="0" y1="57.74" x2="50" y2="57.74" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="0" y1="86.6" x2="50" y2="86.6" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="0" y1="0" x2="25" y2="43.3" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="25" y1="0" x2="50" y2="43.3" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="0" y1="43.3" x2="25" y2="86.6" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="25" y1="43.3" x2="50" y2="86.6" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="25" y1="0" x2="0" y2="43.3" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="50" y1="0" x2="25" y2="43.3" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="25" y1="43.3" x2="0" y2="86.6" stroke={COLORS.gridCyan} strokeWidth="0.3" />
          <line x1="50" y1="43.3" x2="25" y2="86.6" stroke={COLORS.gridCyan} strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={COLORS.white} />
      <rect width="100%" height="100%" fill="url(#isoTriangles)" opacity="0.5" />
    </svg>
  )
}

// Dot matrix pattern (Rams-inspired)
function DotMatrix({ rows = 3, cols = 8, color = COLORS.pink, size = 4, gap = 6 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {Array(rows).fill(0).map((_, r) => (
        <div key={r} style={{ display: "flex", gap }}>
          {Array(cols).fill(0).map((_, c) => (
            <div key={c} style={{ width: size, height: size, borderRadius: "50%", background: color }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Dotted line separator
function DottedLine({ color = COLORS.hotPink, width = "100%" }) {
  return (
    <div style={{
      width,
      height: 2,
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: "8px 2px",
      backgroundRepeat: "repeat-x",
    }} />
  )
}

// Horizontal line circle (Rams-inspired)
function LineCircle({ size = 48, color = COLORS.dark }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" fill="none" stroke={color} strokeWidth="1" />
      {[12, 16, 20, 24, 28, 32, 36].map(y => (
        <line key={y} x1="6" y1={y} x2="42" y2={y} stroke={color} strokeWidth="0.8" />
      ))}
    </svg>
  )
}

// Rams-style dial/knob - toggles to point at dot when clicked
function Dial({ color, size = 40, defaultActive = false, onClick }) {
  const [active, setActive] = useState(defaultActive)
  const handleClick = () => {
    setActive(!active)
    onClick?.(!active)
  }

  return (
    <button onClick={handleClick} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill={COLORS.white} stroke={color} strokeWidth="2.5" />
        <circle cx="20" cy="20" r="12" fill={COLORS.offWhite} stroke={COLORS.lightGray} strokeWidth="0.5" />
        <line
          x1="20" y1="20" x2="20" y2="6"
          stroke={COLORS.dark}
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${active ? 90 : 0} 20 20)`}
          style={{ transition: "transform 200ms ease" }}
        />
      </svg>
    </button>
  )
}

// Control module (Unspool-style inner box)
function ControlModule({ title, desc, color, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.94)",
      borderRadius: 12,
      border: "1px solid rgba(0,0,0,0.10)",
      padding: "10px 12px",
      minWidth: 100,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.dark, letterSpacing: 0.3 }}>{title}</div>
        <div style={{ fontFamily: MONO, fontSize: 8, color: COLORS.gray, marginTop: 1 }}>{desc}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {children}
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      </div>
    </div>
  )
}

// Minimal line icons
function MiniIcon({ type, color, size = 24 }) {
  if (type === "3d") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
      <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z" />
      <path d="M12 2 L12 22" /><path d="M2 7 L12 12 L22 7" />
    </svg>
  )
  if (type === "laser") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <line x1="3" y1="10" x2="21" y2="10" /><circle cx="12" cy="15" r="2" />
    </svg>
  )
  if (type === "vinyl") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="1" fill={color} />
    </svg>
  )
  if (type === "upload") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
      <path d="M12 16 L12 4" /><path d="M7 8 L12 3 L17 8" /><path d="M3 14 L3 20 L21 20 L21 14" />
    </svg>
  )
  return null
}

// Tool card - Unspool-style inner box
function ToolCard({ icon, title, tagline, color, active, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: COLORS.white,
        borderRadius: 14,
        border: `${active ? "2px" : "1px"} solid ${active ? color : (hover ? color : "rgba(0,0,0,0.10)")}`,
        padding: 16,
        width: 180,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <MiniIcon type={icon} color={color} />
        <Dial color={color} size={32} defaultActive={active} />
      </div>
      <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 2 }}>{title}</div>
      <div style={{ fontFamily: MONO, fontSize: 8, color: color }}>{tagline}</div>
    </div>
  )
}

// Demo preview component - Dieter Rams inspired, line-only graphics
function DemoPreview({ type, color }) {
  const demos = {
    "3d": {
      title: "Game Controller Wall Mount",
      desc: "Ready for slicing",
      file: "controller-mount.stl",
      preview: (
        <svg viewBox="0 0 200 100" style={{ width: "100%", height: 80 }}>
          {/* Wall mount bracket */}
          <path d="M30 70 L30 50 L50 50 L50 30 L150 30 L150 50 L170 50 L170 70" fill="none" stroke={COLORS.dark} strokeWidth="1.5" />
          {/* Controller outline */}
          <path d="M60 45 Q60 35 75 35 L125 35 Q140 35 140 45 L145 55 Q148 65 140 70 L60 70 Q52 65 55 55 Z" fill="none" stroke={COLORS.dark} strokeWidth="1.5" />
          {/* D-pad */}
          <path d="M75 50 L75 45 L80 45 L80 50 L85 50 L85 55 L80 55 L80 60 L75 60 L75 55 L70 55 L70 50 Z" fill="none" stroke={COLORS.dark} strokeWidth="1" />
          {/* Buttons */}
          <circle cx="115" cy="48" r="3" fill="none" stroke={COLORS.dark} strokeWidth="1" />
          <circle cx="125" cy="52" r="3" fill="none" stroke={COLORS.dark} strokeWidth="1" />
          <circle cx="120" cy="58" r="3" fill="none" stroke={COLORS.dark} strokeWidth="1" />
          {/* Joysticks */}
          <circle cx="90" cy="58" r="6" fill="none" stroke={COLORS.dark} strokeWidth="1" />
          <circle cx="105" cy="58" r="6" fill="none" stroke={COLORS.dark} strokeWidth="1" />
        </svg>
      )
    },
    "laser": {
      title: "Custom Coaster Set",
      desc: "Vector cut paths",
      file: "coasters.svg",
      preview: (
        <svg viewBox="0 0 200 100" style={{ width: "100%", height: 80 }}>
          {/* Coaster 1 */}
          <circle cx="50" cy="50" r="35" fill="none" stroke={COLORS.dark} strokeWidth="1.5" />
          <circle cx="50" cy="50" r="28" fill="none" stroke={COLORS.dark} strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke={COLORS.dark} strokeWidth="0.5" />
          {/* Coaster 2 */}
          <circle cx="120" cy="50" r="35" fill="none" stroke={COLORS.dark} strokeWidth="1.5" />
          <rect x="100" y="40" width="40" height="20" rx="2" fill="none" stroke={COLORS.dark} strokeWidth="0.5" />
          {/* Coaster 3 partial */}
          <path d="M175 25 A35 35 0 0 1 175 75" fill="none" stroke={COLORS.dark} strokeWidth="1.5" />
        </svg>
      )
    },
    "vinyl": {
      title: "Laptop Decal",
      desc: "Cut-ready vinyl",
      file: "decal.svg",
      preview: (
        <svg viewBox="0 0 200 100" style={{ width: "100%", height: 80 }}>
          {/* Laptop outline */}
          <rect x="30" y="20" width="140" height="55" rx="3" fill="none" stroke={COLORS.dark} strokeWidth="1.5" />
          <path d="M20 75 L30 75 L30 78 L170 78 L170 75 L180 75 L180 82 L20 82 Z" fill="none" stroke={COLORS.dark} strokeWidth="1.5" />
          {/* Decal design - simple geometric */}
          <circle cx="100" cy="47" r="15" fill="none" stroke={COLORS.dark} strokeWidth="1" />
          <path d="M92 47 L100 40 L108 47 L100 54 Z" fill="none" stroke={COLORS.dark} strokeWidth="1" />
        </svg>
      )
    }
  }

  const demo = demos[type]
  if (!demo) return null

  return (
    <div style={{
      border: `1px solid ${color}`,
      background: COLORS.white,
      borderRadius: 8,
      padding: 16,
      marginTop: 16,
      maxWidth: 320,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 12, color: COLORS.dark }}>{demo.title}</div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: COLORS.gray }}>{demo.desc}</div>
      </div>
      <div style={{ borderTop: `1px solid ${COLORS.lightGray}`, borderBottom: `1px solid ${COLORS.lightGray}`, padding: "12px 0", marginBottom: 12 }}>
        {demo.preview}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: COLORS.gray }}>{demo.file}</div>
        <button style={{
          padding: "6px 12px", background: "transparent", color: COLORS.dark,
          border: `1px solid ${COLORS.dark}`, borderRadius: 4, fontWeight: 500, fontSize: 10, cursor: "pointer",
        }}>
          Download
        </button>
      </div>
    </div>
  )
}

// Upload area - compact to match input box
function UploadArea({ onFileSelect }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState(null)

  const handleFile = (file) => { if (file) { setFileName(file.name); onFileSelect?.(file) } }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
      style={{
        background: dragOver ? `${COLORS.sky}10` : COLORS.white,
        borderRadius: 10,
        border: `1px solid ${dragOver ? COLORS.sky : "rgba(0,0,0,0.10)"}`,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        transition: "all 0.15s ease",
        height: 52,
      }}>
      <input ref={inputRef} type="file" accept=".svg,.png,.jpg,.jpeg,.ai,.eps,.pdf" style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])} />
      <MiniIcon type="upload" color={COLORS.sky} size={20} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.dark }}>
          {fileName || "Drop file or click"}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 8, color: COLORS.gray }}>SVG · PNG · AI</div>
      </div>
    </div>
  )
}

function App() {
  const [prompt, setPrompt] = useState("")
  const [activePage, setActivePage] = useState("make")
  const [selectedTool, setSelectedTool] = useState(null)

  return (
    <div style={{ minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", position: "relative" }}>
      <IsometricGrid />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header with aligned dots */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <div
              onClick={() => setActivePage("make")}
              style={{ fontWeight: 800, fontSize: 20, color: COLORS.dark, letterSpacing: -0.5, cursor: "pointer" }}
            >FileGenerator</div>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", marginBottom: 3 }}>
              {[COLORS.pink, COLORS.yellow, COLORS.mint, COLORS.sky, COLORS.lavender, COLORS.coral, COLORS.orange].map((c, i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <nav style={{ display: "flex", gap: 8 }}>
              {[{ l: "Make", p: "make", c: COLORS.pink }, { l: "Learn", p: "learn", c: COLORS.sky }, { l: "About", p: "about", c: COLORS.lavender }].map((item) => (
                <div key={item.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <button
                    onClick={() => setActivePage(item.p)}
                    style={{
                      padding: "6px 14px", border: `1px solid ${activePage === item.p ? item.c : COLORS.lightGray}`, borderRadius: 4,
                      background: COLORS.white,
                      color: COLORS.dark, fontWeight: 600, fontSize: 11, cursor: "pointer",
                    }}>{item.l}</button>
                  {activePage === item.p && (
                    <div style={{
                      width: "100%",
                      height: 2,
                      backgroundImage: `radial-gradient(circle, ${item.c} 1px, transparent 1px)`,
                      backgroundSize: "6px 2px",
                      backgroundRepeat: "repeat-x",
                    }} />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </header>

        {/* MAKE PAGE */}
        {activePage === "make" && (
          <>
            {/* Hero */}
            <section style={{ marginBottom: 40 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.dark, lineHeight: 1.2, letterSpacing: -1, marginBottom: 8, maxWidth: 420 }}>
                Describe it. Upload it.<br />Get a file that works.
              </h1>
              <p style={{ fontSize: 14, color: COLORS.gray, maxWidth: 480, lineHeight: 1.5 }}>
                Turn ideas into files for 3D printing, laser cutting, or vinyl cutting.
              </p>
            </section>

        {/* Input section - Unspool-style window */}
        <section style={{
          marginTop: 32, marginBottom: 24,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.90)",
          borderRadius: 18,
          padding: 20,
        }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>

            {/* Text input with dial */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.dark }}>Describe</div>
                <div style={{ fontFamily: MONO, fontSize: 8, color: COLORS.gray }}>what you want to make</div>
              </div>
              <div style={{
                background: COLORS.white, borderRadius: 10, border: `1px solid rgba(0,0,0,0.10)`,
                display: "flex", alignItems: "center", gap: 8, padding: "4px 8px",
              }}>
                <input
                  type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A wall mount for my game controller..."
                  style={{
                    flex: 1, border: "none", padding: "10px 8px", fontSize: 13,
                    outline: "none", background: "transparent", color: COLORS.dark,
                  }}
                />
                <Dial color={COLORS.coral} size={36} onClick={() => console.log("Generate:", prompt)} />
              </div>
            </div>

            {/* Upload */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.dark }}>Upload</div>
                <div style={{ fontFamily: MONO, fontSize: 8, color: COLORS.gray }}>image or vector</div>
              </div>
              <UploadArea />
            </div>
          </div>
        </section>

        {/* Controls row - Unspool-style window */}
        <section style={{
          marginBottom: 24,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.90)",
          borderRadius: 18,
          padding: 16,
        }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ControlModule title="Output" desc="file format" color={COLORS.sky}>
              <Dial color={COLORS.sky} size={28} />
            </ControlModule>
            <ControlModule title="Size" desc="dimensions" color={COLORS.mint}>
              <Dial color={COLORS.mint} size={28} />
            </ControlModule>
            <ControlModule title="Detail" desc="resolution" color={COLORS.lavender}>
              <Dial color={COLORS.lavender} size={28} defaultActive={true} />
            </ControlModule>
            <ControlModule title="Preview" desc="before export" color={COLORS.orange}>
              <Dial color={COLORS.orange} size={28} />
            </ControlModule>
          </div>
        </section>

        {/* Tool Cards - Unspool-style window */}
        <section style={{
          marginBottom: 24,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.90)",
          borderRadius: 18,
          padding: 20,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 0.5, color: COLORS.gray, marginBottom: 16, textTransform: "uppercase" }}>
            What are you making? <span style={{ opacity: 0.6 }}>· click to see demo</span>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <ToolCard icon="3d" title="3D Printing" tagline="STL · OBJ · 3MF" color={COLORS.pink}
              active={selectedTool === "3d"} onClick={() => setSelectedTool(selectedTool === "3d" ? null : "3d")} />
            <ToolCard icon="laser" title="Laser Cutting" tagline="SVG · DXF · AI" color={COLORS.sky}
              active={selectedTool === "laser"} onClick={() => setSelectedTool(selectedTool === "laser" ? null : "laser")} />
            <ToolCard icon="vinyl" title="Vinyl Cutting" tagline="SVG · PNG" color={COLORS.mint}
              active={selectedTool === "vinyl"} onClick={() => setSelectedTool(selectedTool === "vinyl" ? null : "vinyl")} />
          </div>
          {selectedTool && (
            <DemoPreview
              type={selectedTool}
              color={selectedTool === "3d" ? COLORS.pink : selectedTool === "laser" ? COLORS.sky : COLORS.mint}
            />
          )}
        </section>

        {/* How it works - Unspool-style window */}
        <section style={{
          border: "1px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.90)",
          borderRadius: 18,
          padding: 20, marginBottom: 40,
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.dark }}>Three steps</div>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { n: "1", t: "Describe or Upload", d: "Type or drop an image", c: COLORS.pink },
              { n: "2", t: "Tweak", d: "Adjust size and format", c: COLORS.yellow },
              { n: "3", t: "Download", d: "Get your file", c: COLORS.mint },
            ].map((step) => (
              <div key={step.n} style={{ flex: 1, minWidth: 140, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", border: `2px solid ${step.c}`,
                  background: COLORS.white, color: COLORS.dark, display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0,
                }}>{step.n}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: COLORS.dark }}>{step.t}</div>
                  <div style={{ fontSize: 10, color: COLORS.gray, marginTop: 2 }}>{step.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
          </>
        )}

        {/* LEARN PAGE */}
        {activePage === "learn" && (
          <>
            <section style={{ marginBottom: 40 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.dark, lineHeight: 1.2, letterSpacing: -1, marginBottom: 8 }}>
                Learn to Make
              </h1>
              <p style={{ fontSize: 14, color: COLORS.gray, maxWidth: 480, lineHeight: 1.5 }}>
                Tutorials, tips, and guides for digital fabrication.
              </p>
            </section>

            {/* 3D Printing Guide */}
            <section style={{
              marginBottom: 24,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(255,255,255,0.90)",
              borderRadius: 18,
              padding: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <MiniIcon type="3d" color={COLORS.pink} size={28} />
                <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark }}>3D Printing Basics</div>
              </div>
              <div style={{ fontSize: 13, color: COLORS.gray, lineHeight: 1.6, marginBottom: 16 }}>
                3D printing turns digital models into physical objects by building them layer by layer. Perfect for prototypes, custom parts, and one-of-a-kind creations.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { t: "STL files", d: "The standard format for 3D printing. Describes the surface geometry of your model as triangles." },
                  { t: "Supports & rafts", d: "Temporary structures that hold up overhangs during printing. Remove them after the print is done." },
                  { t: "Infill settings", d: "The internal pattern and density inside your print. Higher infill = stronger but uses more material." },
                  { t: "Material choice", d: "PLA is easy and eco-friendly. PETG is stronger. ABS handles heat. TPU is flexible." },
                ].map((topic) => (
                  <div key={topic.t} style={{
                    padding: "12px", background: COLORS.white, borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.10)", borderLeft: `3px solid ${COLORS.pink}`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.dark, marginBottom: 4 }}>{topic.t}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray, lineHeight: 1.5 }}>{topic.d}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Laser Cutting Guide */}
            <section style={{
              marginBottom: 24,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(255,255,255,0.90)",
              borderRadius: 18,
              padding: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <MiniIcon type="laser" color={COLORS.sky} size={28} />
                <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark }}>Laser Cutting 101</div>
              </div>
              <div style={{ fontSize: 13, color: COLORS.gray, lineHeight: 1.6, marginBottom: 16 }}>
                Laser cutters use focused light to cut or engrave materials like wood, acrylic, and cardboard. Great for signs, jewelry, enclosures, and flat-pack designs.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { t: "Vector vs raster", d: "Vectors are lines the laser follows to cut. Rasters are images the laser engraves pixel by pixel." },
                  { t: "Kerf adjustment", d: "The laser beam has width. Kerf compensation adjusts your design so parts fit together perfectly." },
                  { t: "Material settings", d: "Power, speed, and passes vary by material. Too slow burns, too fast won't cut through." },
                  { t: "Living hinges", d: "Clever cut patterns that let rigid materials like wood or acrylic bend and flex." },
                ].map((topic) => (
                  <div key={topic.t} style={{
                    padding: "12px", background: COLORS.white, borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.10)", borderLeft: `3px solid ${COLORS.sky}`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.dark, marginBottom: 4 }}>{topic.t}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray, lineHeight: 1.5 }}>{topic.d}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Vinyl Cutting Guide */}
            <section style={{
              marginBottom: 24,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(255,255,255,0.90)",
              borderRadius: 18,
              padding: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <MiniIcon type="vinyl" color={COLORS.mint} size={28} />
                <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark }}>Vinyl Cutting Essentials</div>
              </div>
              <div style={{ fontSize: 13, color: COLORS.gray, lineHeight: 1.6, marginBottom: 16 }}>
                Vinyl cutters slice adhesive material into shapes for stickers, decals, heat transfers, and signage. Simple, fast, and satisfying.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { t: "Weeding tips", d: "Removing the excess vinyl around your design. Use a weeding tool and good lighting. Go slow." },
                  { t: "Transfer tape", d: "Sticky paper that lifts your weeded design and places it on the final surface. Press firmly, peel slowly." },
                  { t: "HTV basics", d: "Heat Transfer Vinyl is ironed or pressed onto fabric. Mirror your design before cutting!" },
                  { t: "Multi-layer designs", d: "Stack different colored vinyl for complex designs. Use registration marks to align layers perfectly." },
                ].map((topic) => (
                  <div key={topic.t} style={{
                    padding: "12px", background: COLORS.white, borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.10)", borderLeft: `3px solid ${COLORS.mint}`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.dark, marginBottom: 4 }}>{topic.t}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray, lineHeight: 1.5 }}>{topic.d}</div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ABOUT PAGE */}
        {activePage === "about" && (
          <>
            <section style={{ marginBottom: 40 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.dark, lineHeight: 1.2, letterSpacing: -1, marginBottom: 8 }}>
                About FileGenerator
              </h1>
              <p style={{ fontSize: 14, color: COLORS.gray, maxWidth: 480, lineHeight: 1.5 }}>
                The simplest way to go from idea to fabrication-ready file.
              </p>
            </section>

            <section style={{
              marginBottom: 24,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(255,255,255,0.90)",
              borderRadius: 18,
              padding: 24,
            }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark, marginBottom: 16 }}>Why we built this</div>
              <div style={{ fontSize: 14, color: COLORS.gray, lineHeight: 1.7, marginBottom: 20 }}>
                Making things should be accessible to everyone. But too often, the gap between having an idea and having a file ready for fabrication stops people in their tracks.
              </div>
              <div style={{ fontSize: 14, color: COLORS.gray, lineHeight: 1.7, marginBottom: 20 }}>
                FileGenerator bridges that gap. Describe what you want to make in plain language, or upload a sketch or image, and get a file that actually works with your machine.
              </div>
              <div style={{ fontSize: 14, color: COLORS.gray, lineHeight: 1.7 }}>
                Built for makers, students, educators, and anyone who wants to turn ideas into real things.
              </div>
            </section>

            <section style={{
              marginBottom: 24,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(255,255,255,0.90)",
              borderRadius: 18,
              padding: 24,
            }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark, marginBottom: 16 }}>Supported formats</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.pink, marginBottom: 8 }}>3D Printing</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: COLORS.gray }}>STL · OBJ · 3MF · STEP</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.sky, marginBottom: 8 }}>Laser Cutting</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: COLORS.gray }}>SVG · DXF · AI · PDF</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.mint, marginBottom: 8 }}>Vinyl Cutting</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: COLORS.gray }}>SVG · PNG · PDF</div>
                </div>
              </div>
            </section>

            <section style={{
              marginBottom: 24,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(255,255,255,0.90)",
              borderRadius: 18,
              padding: 24,
            }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark, marginBottom: 16 }}>Get in touch</div>
              <div style={{ fontSize: 14, color: COLORS.gray, lineHeight: 1.7 }}>
                Questions, feedback, or feature requests? We'd love to hear from you.
              </div>
              <div style={{ fontFamily: MONO, fontSize: 12, color: COLORS.lavender, marginTop: 12 }}>
                hello@filegenerator.app
              </div>
            </section>
          </>
        )}

        {/* Footer */}
        <footer style={{ textAlign: "right", padding: "20px 0" }}>
          <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 16, lineHeight: 1.5 }}>
            For makers, educators, students, and anyone who believes ideas are meant to be made real.
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: COLORS.gray, marginTop: 10 }}>
            Built with <a href="https://claude.ai/claude-code" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.lavender, textDecoration: "none" }}>Claude Code</a>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 4, marginTop: 8 }}>
            {[COLORS.pink, COLORS.yellow, COLORS.mint, COLORS.sky, COLORS.lavender].map((c, i) => (
              <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: c }} />
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
