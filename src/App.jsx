import { useState, useRef, useEffect } from 'react'

// Clean, professional palette
const COLORS = {
  pink: "#E91E63",
  coral: "#FF6B6B",
  yellow: "#FFB800",
  mint: "#00BFA5",
  sky: "#2196F3",
  lavender: "#7C4DFF",
  orange: "#FF9800",
  teal: "#009688",
  white: "#FFFFFF",
  offWhite: "#FAFAFA",
  dark: "#1A1A1A",
  gray: "#666666",
  lightGray: "#E0E0E0",
  gridBlue: "#E3F2FD",
}

const MONO = "'SF Mono', 'Fira Code', 'Monaco', monospace"

// Fabrication types with details
const FAB_TYPES = {
  "3d": {
    name: "3D Printing",
    color: COLORS.pink,
    formats: "STL · OBJ · 3MF",
    desc: "Layer by layer into reality",
    icon: "cube"
  },
  laser: {
    name: "Laser Cutting",
    color: COLORS.sky,
    formats: "SVG · DXF · AI",
    desc: "Precision cuts & engravings",
    icon: "laser"
  },
  vinyl: {
    name: "Vinyl Cutting",
    color: COLORS.mint,
    formats: "SVG · PNG",
    desc: "Stickers, decals & transfers",
    icon: "vinyl"
  },
  mill: {
    name: "Milling",
    color: COLORS.orange,
    formats: "G-code · SVG",
    desc: "Carve wood, metal & more",
    icon: "mill"
  },
  cnc: {
    name: "CNC Router",
    color: COLORS.lavender,
    formats: "G-code · DXF",
    desc: "Large scale fabrication",
    icon: "cnc"
  },
}

// Demo projects for each type
const DEMO_PROJECTS = {
  "3d": [
    { name: "Phone Stand", prompt: "A minimal phone stand", file: "phone-stand.stl" },
    { name: "Cable Organizer", prompt: "Desktop cable clips", file: "cable-clips.stl" },
    { name: "Plant Pot", prompt: "Geometric succulent planter", file: "planter.stl" },
  ],
  laser: [
    { name: "Custom Coasters", prompt: "Geometric coaster set", file: "coasters.svg" },
    { name: "Name Keychain", prompt: "Personalized keychain", file: "keychain.svg" },
    { name: "Box Enclosure", prompt: "Electronics project box", file: "box.svg" },
  ],
  vinyl: [
    { name: "Laptop Decal", prompt: "Minimal laptop sticker", file: "decal.svg" },
    { name: "Wall Quote", prompt: "Inspirational wall art", file: "quote.svg" },
    { name: "T-Shirt Design", prompt: "Custom shirt graphic", file: "tshirt.svg" },
  ],
  mill: [
    { name: "Wooden Sign", prompt: "Carved welcome sign", file: "sign.svg" },
    { name: "Relief Art", prompt: "3D carved artwork", file: "relief.svg" },
    { name: "Inlay Design", prompt: "Two-tone wood inlay", file: "inlay.svg" },
  ],
  cnc: [
    { name: "Furniture Joint", prompt: "Interlocking shelf joint", file: "joint.svg" },
    { name: "Large Sign", prompt: "Business signage", file: "large-sign.svg" },
    { name: "Cabinet Door", prompt: "Decorative panel", file: "panel.svg" },
  ],
}

// Dot grid background
function DotGrid() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }}>
      <defs>
        <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1" fill={COLORS.gridBlue} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={COLORS.white} />
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  )
}

// Mini icons for fab types
function FabIcon({ type, color, size = 24 }) {
  const icons = {
    cube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
        <path d="M12 22V12M12 12L2 7M12 12l10-5" />
      </svg>
    ),
    laser: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3" />
      </svg>
    ),
    vinyl: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" fill={color} />
      </svg>
    ),
    mill: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M12 3v18M8 7l4-4 4 4M6 12h12M8 17l4 4 4-4" />
      </svg>
    ),
    cnc: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 8h4v4H6zM14 8h4v4h-4zM6 14h12" />
      </svg>
    ),
  }
  return icons[type] || null
}

// Animated loading dots
function LoadingDots({ color }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: color,
            animation: `pulse 1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// Live text preview - shows user's text in a design context
function LiveTextPreview({ text, fabType, color }) {
  const displayText = text || "Your Text"

  const previews = {
    "3d": (
      <svg viewBox="0 0 200 120" style={{ width: "100%", height: 120 }}>
        {/* 3D text block with perspective */}
        <defs>
          <linearGradient id="depth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={COLORS.dark} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Base platform */}
        <path d="M20 90 L100 110 L180 90 L100 70 Z" fill="none" stroke={COLORS.lightGray} strokeWidth="1" />
        {/* 3D text representation */}
        <rect x="40" y="40" width="120" height="35" rx="4" fill="none" stroke={color} strokeWidth="2" />
        <rect x="43" y="43" width="120" height="35" rx="4" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <text x="100" y="62" textAnchor="middle" fontSize="14" fontWeight="700" fill={COLORS.dark} fontFamily="system-ui">
          {displayText.slice(0, 12)}
        </text>
      </svg>
    ),
    laser: (
      <svg viewBox="0 0 200 120" style={{ width: "100%", height: 120 }}>
        {/* Coaster/keychain shape */}
        <rect x="40" y="20" width="120" height="80" rx="8" fill="none" stroke={color} strokeWidth="2" />
        <rect x="50" y="30" width="100" height="60" rx="4" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4 2" />
        {/* Engraved text */}
        <text x="100" y="68" textAnchor="middle" fontSize="16" fontWeight="700" fill={color} fontFamily="system-ui">
          {displayText.slice(0, 10)}
        </text>
        {/* Keychain hole */}
        <circle cx="160" cy="30" r="6" fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    vinyl: (
      <svg viewBox="0 0 200 120" style={{ width: "100%", height: 120 }}>
        {/* Laptop outline */}
        <rect x="30" y="15" width="140" height="85" rx="4" fill="none" stroke={COLORS.lightGray} strokeWidth="1.5" />
        <path d="M20 100 L30 100 L30 103 L170 103 L170 100 L180 100 L175 110 L25 110 Z" fill="none" stroke={COLORS.lightGray} strokeWidth="1.5" />
        {/* Vinyl decal */}
        <text x="100" y="65" textAnchor="middle" fontSize="20" fontWeight="800" fill={color} fontFamily="system-ui">
          {displayText.slice(0, 8)}
        </text>
      </svg>
    ),
    mill: (
      <svg viewBox="0 0 200 120" style={{ width: "100%", height: 120 }}>
        {/* Wood grain background */}
        <rect x="20" y="20" width="160" height="80" rx="4" fill="none" stroke={COLORS.lightGray} strokeWidth="2" />
        {[30, 45, 60, 75, 90].map(y => (
          <line key={y} x1="25" y1={y} x2="175" y2={y} stroke={COLORS.lightGray} strokeWidth="0.5" opacity="0.5" />
        ))}
        {/* Carved text */}
        <text x="100" y="68" textAnchor="middle" fontSize="18" fontWeight="800" fill={color} fontFamily="serif">
          {displayText.slice(0, 10)}
        </text>
      </svg>
    ),
    cnc: (
      <svg viewBox="0 0 200 120" style={{ width: "100%", height: 120 }}>
        {/* Large panel */}
        <rect x="15" y="15" width="170" height="90" rx="2" fill="none" stroke={color} strokeWidth="2" />
        {/* Routed text */}
        <text x="100" y="70" textAnchor="middle" fontSize="24" fontWeight="900" fill="none" stroke={color} strokeWidth="2" fontFamily="system-ui">
          {displayText.slice(0, 6)}
        </text>
      </svg>
    ),
  }

  return previews[fabType] || previews.laser
}

// Generation result preview with download
function ResultPreview({ fabType, prompt, userName, onClose }) {
  const fab = FAB_TYPES[fabType]
  const [downloading, setDownloading] = useState(false)

  // Generate SVG content based on type and user input
  const generateSVG = () => {
    const text = userName || "DEMO"

    const svgContent = {
      "3d": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect x="10" y="60" width="80" height="30" rx="5" fill="none" stroke="#333" stroke-width="2"/>
        <rect x="20" y="30" width="60" height="35" rx="3" fill="none" stroke="#333" stroke-width="2"/>
        <text x="50" y="52" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">${text}</text>
      </svg>`,
      laser: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" rx="10" fill="none" stroke="#333" stroke-width="2"/>
        <circle cx="85" cy="15" r="5" fill="none" stroke="#333" stroke-width="1.5"/>
        <text x="50" y="55" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${text}</text>
      </svg>`,
      vinyl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
        <text x="50" y="35" text-anchor="middle" font-size="24" font-weight="bold" fill="#333">${text}</text>
      </svg>`,
      mill: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 60">
        <rect x="5" y="5" width="140" height="50" rx="5" fill="none" stroke="#333" stroke-width="2"/>
        <text x="75" y="38" text-anchor="middle" font-size="20" font-weight="bold" fill="#333">${text}</text>
      </svg>`,
      cnc: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
        <rect x="5" y="5" width="190" height="70" rx="3" fill="none" stroke="#333" stroke-width="3"/>
        <text x="100" y="50" text-anchor="middle" font-size="28" font-weight="900" fill="none" stroke="#333" stroke-width="2">${text}</text>
      </svg>`,
    }

    return svgContent[fabType] || svgContent.laser
  }

  const handleDownload = () => {
    setDownloading(true)

    setTimeout(() => {
      const svg = generateSVG()
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${userName || 'design'}-${fabType}.svg`
      a.click()
      URL.revokeObjectURL(url)
      setDownloading(false)
    }, 500)
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: COLORS.white,
          borderRadius: 16,
          padding: 24,
          maxWidth: 400,
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FabIcon type={fab.icon} color={fab.color} size={28} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.dark }}>{fab.name}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: COLORS.gray }}>{fab.formats}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", fontSize: 24, cursor: "pointer", color: COLORS.gray,
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >×</button>
        </div>

        <div style={{
          background: COLORS.offWhite,
          borderRadius: 8,
          padding: 20,
          marginBottom: 16,
          border: `1px solid ${COLORS.lightGray}`,
        }}>
          <LiveTextPreview text={userName} fabType={fabType} color={fab.color} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: COLORS.gray, marginBottom: 4 }}>Generated from:</div>
          <div style={{ fontSize: 14, color: COLORS.dark, fontStyle: "italic" }}>"{prompt || `Custom ${fab.name.toLowerCase()} design`}"</div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              flex: 1,
              padding: "12px 20px",
              background: fab.color,
              color: COLORS.white,
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              cursor: downloading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {downloading ? <LoadingDots color={COLORS.white} /> : "Download SVG"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "12px 20px",
              background: "transparent",
              color: COLORS.dark,
              border: `1px solid ${COLORS.lightGray}`,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Fab type selector card
function FabCard({ type, active, onClick }) {
  const fab = FAB_TYPES[type]
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active ? `${fab.color}10` : COLORS.white,
        border: `2px solid ${active ? fab.color : (hover ? fab.color : COLORS.lightGray)}`,
        borderRadius: 12,
        padding: 16,
        cursor: "pointer",
        transition: "all 0.15s ease",
        textAlign: "left",
        minWidth: 140,
      }}
    >
      <FabIcon type={fab.icon} color={fab.color} size={28} />
      <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.dark, marginTop: 10 }}>{fab.name}</div>
      <div style={{ fontFamily: MONO, fontSize: 9, color: fab.color, marginTop: 2 }}>{fab.formats}</div>
    </button>
  )
}

// Input mode tabs
function InputModeTabs({ mode, setMode }) {
  const modes = [
    { id: "prompt", label: "Describe It", icon: "💭" },
    { id: "text", label: "Add Text", icon: "✏️" },
    { id: "upload", label: "Upload", icon: "📁" },
  ]

  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          style={{
            padding: "8px 16px",
            background: mode === m.id ? COLORS.dark : "transparent",
            color: mode === m.id ? COLORS.white : COLORS.gray,
            border: `1px solid ${mode === m.id ? COLORS.dark : COLORS.lightGray}`,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{m.icon}</span>
          {m.label}
        </button>
      ))}
    </div>
  )
}

// Main App
function App() {
  const [inputMode, setInputMode] = useState("prompt")
  const [prompt, setPrompt] = useState("")
  const [userName, setUserName] = useState("")
  const [selectedFab, setSelectedFab] = useState("laser")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [activePage, setActivePage] = useState("make")
  const fileInputRef = useRef(null)

  const fab = FAB_TYPES[selectedFab]

  const handleGenerate = () => {
    if (!prompt && !userName && !uploadedFile) return

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      setShowResult(true)
    }, 2000)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      setPrompt(`Convert ${file.name} for ${fab.name.toLowerCase()}`)
    }
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", position: "relative" }}>
      <DotGrid />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
          <div
            onClick={() => setActivePage("make")}
            style={{ cursor: "pointer" }}
          >
            <div style={{ fontWeight: 800, fontSize: 22, color: COLORS.dark, letterSpacing: -0.5 }}>
              FileGenerator
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: COLORS.gray }}>
              idea → fabrication-ready file
            </div>
          </div>

          <nav style={{ display: "flex", gap: 8 }}>
            {[
              { id: "make", label: "Make", color: COLORS.pink },
              { id: "learn", label: "Learn", color: COLORS.sky },
              { id: "about", label: "About", color: COLORS.lavender },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                style={{
                  padding: "8px 16px",
                  background: activePage === item.id ? item.color : "transparent",
                  color: activePage === item.id ? COLORS.white : COLORS.dark,
                  border: `1px solid ${activePage === item.id ? item.color : COLORS.lightGray}`,
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        {/* MAKE PAGE */}
        {activePage === "make" && (
          <>
            {/* Hero */}
            <section style={{ marginBottom: 40, textAlign: "center" }}>
              <h1 style={{
                fontSize: 40,
                fontWeight: 800,
                color: COLORS.dark,
                lineHeight: 1.1,
                letterSpacing: -1.5,
                marginBottom: 12,
              }}>
                From idea to<br />
                <span style={{ color: fab.color }}>fabrication-ready</span> file
              </h1>
              <p style={{ fontSize: 16, color: COLORS.gray, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
                Describe what you want to make, type some text, or upload an image.
                Get a file that works with your machine.
              </p>
            </section>

            {/* Fabrication Type Selector */}
            <section style={{ marginBottom: 32 }}>
              <div style={{
                fontFamily: MONO,
                fontSize: 10,
                color: COLORS.gray,
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}>
                What machine are you using?
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {Object.keys(FAB_TYPES).map(type => (
                  <FabCard
                    key={type}
                    type={type}
                    active={selectedFab === type}
                    onClick={() => setSelectedFab(type)}
                  />
                ))}
              </div>
            </section>

            {/* Main Input Section */}
            <section style={{
              background: COLORS.white,
              borderRadius: 16,
              border: `2px solid ${fab.color}30`,
              padding: 24,
              marginBottom: 32,
            }}>
              <InputModeTabs mode={inputMode} setMode={setInputMode} />

              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {/* Input Area */}
                <div style={{ flex: 1, minWidth: 280 }}>
                  {inputMode === "prompt" && (
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.dark, display: "block", marginBottom: 8 }}>
                        Describe what you want to make
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`e.g., "A phone stand with a slot for my charger" or "A keychain with my dog's name"`}
                        style={{
                          width: "100%",
                          height: 100,
                          padding: 12,
                          border: `1px solid ${COLORS.lightGray}`,
                          borderRadius: 8,
                          fontSize: 14,
                          resize: "none",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>
                  )}

                  {inputMode === "text" && (
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.dark, display: "block", marginBottom: 8 }}>
                        Enter your text (name, word, phrase)
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your name, a word, or short phrase..."
                        maxLength={20}
                        style={{
                          width: "100%",
                          padding: 16,
                          border: `1px solid ${COLORS.lightGray}`,
                          borderRadius: 8,
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                      />
                      <div style={{ fontFamily: MONO, fontSize: 10, color: COLORS.gray, marginTop: 8 }}>
                        This text will be turned into a {fab.name.toLowerCase()} design
                      </div>
                    </div>
                  )}

                  {inputMode === "upload" && (
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.dark, display: "block", marginBottom: 8 }}>
                        Upload an image or sketch
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: `2px dashed ${uploadedFile ? fab.color : COLORS.lightGray}`,
                          borderRadius: 8,
                          padding: 32,
                          textAlign: "center",
                          cursor: "pointer",
                          background: uploadedFile ? `${fab.color}10` : "transparent",
                        }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,.svg,.ai,.eps"
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
                        />
                        {uploadedFile ? (
                          <div>
                            <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
                            <div style={{ fontWeight: 600, color: COLORS.dark }}>{uploadedFile.name}</div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
                            <div style={{ fontWeight: 600, color: COLORS.dark }}>Drop file or click to browse</div>
                            <div style={{ fontFamily: MONO, fontSize: 10, color: COLORS.gray, marginTop: 4 }}>
                              PNG · JPG · SVG · AI
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || (!prompt && !userName && !uploadedFile)}
                    style={{
                      width: "100%",
                      marginTop: 16,
                      padding: "14px 24px",
                      background: isGenerating ? COLORS.gray : fab.color,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: 8,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: isGenerating ? "wait" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      opacity: (!prompt && !userName && !uploadedFile) ? 0.5 : 1,
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <LoadingDots color={COLORS.white} />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate {fab.name} File</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Live Preview */}
                <div style={{ flex: 1, minWidth: 280 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.dark, display: "block", marginBottom: 8 }}>
                    Live Preview
                  </label>
                  <div style={{
                    background: COLORS.offWhite,
                    borderRadius: 8,
                    padding: 16,
                    border: `1px solid ${COLORS.lightGray}`,
                    minHeight: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <LiveTextPreview
                      text={userName || (prompt ? prompt.split(" ").slice(0, 2).join(" ") : "")}
                      fabType={selectedFab}
                      color={fab.color}
                    />
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: COLORS.gray, marginTop: 8, textAlign: "center" }}>
                    Output: {fab.formats.split(" · ")[0]}
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Examples */}
            <section style={{
              background: COLORS.white,
              borderRadius: 16,
              border: `1px solid ${COLORS.lightGray}`,
              padding: 24,
              marginBottom: 32,
            }}>
              <div style={{
                fontFamily: MONO,
                fontSize: 10,
                color: COLORS.gray,
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}>
                Try an example · Click to load
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {DEMO_PROJECTS[selectedFab]?.map((project, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(project.prompt)
                      setInputMode("prompt")
                    }}
                    style={{
                      padding: "10px 16px",
                      background: "transparent",
                      border: `1px solid ${fab.color}`,
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      color: fab.color,
                      cursor: "pointer",
                    }}
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section style={{
              background: COLORS.white,
              borderRadius: 16,
              border: `1px solid ${COLORS.lightGray}`,
              padding: 24,
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.dark, marginBottom: 20 }}>
                How it works
              </h2>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {[
                  { num: "1", title: "Describe or Upload", desc: "Tell us what you want to make, or upload a sketch/image", color: COLORS.pink },
                  { num: "2", title: "Choose Your Machine", desc: "Select 3D printer, laser, vinyl cutter, mill, or CNC", color: COLORS.sky },
                  { num: "3", title: "Download & Make", desc: "Get a file that's ready for your machine", color: COLORS.mint },
                ].map(step => (
                  <div key={step.num} style={{ flex: 1, minWidth: 200, display: "flex", gap: 12 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `${step.color}15`,
                      border: `2px solid ${step.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      color: step.color,
                      flexShrink: 0,
                    }}>
                      {step.num}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.dark }}>{step.title}</div>
                      <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 4, lineHeight: 1.5 }}>{step.desc}</div>
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
              <h1 style={{ fontSize: 36, fontWeight: 800, color: COLORS.dark, letterSpacing: -1, marginBottom: 8 }}>
                Learn Digital Fabrication
              </h1>
              <p style={{ fontSize: 16, color: COLORS.gray, maxWidth: 500, lineHeight: 1.6 }}>
                Everything you need to know to start making.
              </p>
            </section>

            {Object.entries(FAB_TYPES).map(([key, fab]) => (
              <section key={key} style={{
                background: COLORS.white,
                borderRadius: 16,
                border: `1px solid ${COLORS.lightGray}`,
                padding: 24,
                marginBottom: 24,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <FabIcon type={fab.icon} color={fab.color} size={32} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.dark }}>{fab.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 11, color: fab.color }}>{fab.desc}</div>
                  </div>
                </div>
                <div style={{ fontSize: 14, color: COLORS.gray, lineHeight: 1.7 }}>
                  {key === "3d" && "3D printing builds objects layer by layer from digital models. Perfect for prototypes, custom parts, and one-of-a-kind creations. Common materials include PLA (easy, eco-friendly), PETG (stronger), and TPU (flexible)."}
                  {key === "laser" && "Laser cutters use focused light to cut or engrave materials like wood, acrylic, and cardboard. Great for signs, jewelry, enclosures, and precision parts. Vector files define cut paths, raster images create engravings."}
                  {key === "vinyl" && "Vinyl cutters slice adhesive material into shapes for stickers, decals, and heat transfers. Simple, fast, and satisfying. Remember to mirror your design for heat transfer vinyl!"}
                  {key === "mill" && "Milling machines use rotating cutting tools to carve material away. Ideal for wood signs, PCBs, and detailed relief carvings. CNC mills follow programmed toolpaths for precision results."}
                  {key === "cnc" && "CNC routers handle large-scale cutting and carving. Build furniture, signs, and architectural elements. Like a giant, precise robot carpenter that follows your digital designs."}
                </div>
              </section>
            ))}
          </>
        )}

        {/* ABOUT PAGE */}
        {activePage === "about" && (
          <>
            <section style={{ marginBottom: 40 }}>
              <h1 style={{ fontSize: 36, fontWeight: 800, color: COLORS.dark, letterSpacing: -1, marginBottom: 8 }}>
                Making Made Simple
              </h1>
              <p style={{ fontSize: 16, color: COLORS.gray, maxWidth: 500, lineHeight: 1.6 }}>
                We believe everyone should be able to turn ideas into real things.
              </p>
            </section>

            <section style={{
              background: COLORS.white,
              borderRadius: 16,
              border: `1px solid ${COLORS.lightGray}`,
              padding: 32,
              marginBottom: 24,
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.dark, marginBottom: 16 }}>
                The Problem
              </h2>
              <p style={{ fontSize: 15, color: COLORS.gray, lineHeight: 1.8, marginBottom: 16 }}>
                Digital fabrication tools are amazing, but there's a gap between having an idea and having a file that actually works with your machine. CAD software is complex. File formats are confusing. Settings are overwhelming.
              </p>
              <p style={{ fontSize: 15, color: COLORS.gray, lineHeight: 1.8 }}>
                Too many great ideas never get made because the technical hurdles are too high.
              </p>
            </section>

            <section style={{
              background: COLORS.white,
              borderRadius: 16,
              border: `1px solid ${COLORS.lightGray}`,
              padding: 32,
              marginBottom: 24,
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.dark, marginBottom: 16 }}>
                Our Solution
              </h2>
              <p style={{ fontSize: 15, color: COLORS.gray, lineHeight: 1.8 }}>
                FileGenerator bridges the gap. Describe what you want in plain language, upload a sketch, or just type some text — and get a file that's ready for your 3D printer, laser cutter, vinyl cutter, mill, or CNC router.
              </p>
            </section>

            <section style={{
              background: `linear-gradient(135deg, ${COLORS.pink}15, ${COLORS.lavender}15)`,
              borderRadius: 16,
              padding: 32,
              textAlign: "center",
            }}>
              <p style={{ fontSize: 18, fontWeight: 600, color: COLORS.dark, lineHeight: 1.6 }}>
                For makers, educators, students, and anyone who believes<br />
                <span style={{ color: COLORS.pink }}>ideas are meant to be made real</span>.
              </p>
            </section>
          </>
        )}

        {/* Footer */}
        <footer style={{ marginTop: 60, paddingTop: 24, borderTop: `1px solid ${COLORS.lightGray}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: COLORS.gray }}>
              Built with <a href="https://claude.ai" style={{ color: COLORS.lavender }}>Claude Code</a>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {Object.values(FAB_TYPES).map((f, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: f.color }} />
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* Result Modal */}
      {showResult && (
        <ResultPreview
          fabType={selectedFab}
          prompt={prompt}
          userName={userName}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  )
}

export default App
