import React, { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════
   PARTICLE FIELD  — lightweight canvas dots
══════════════════════════════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 55;
    const dots = Array.from({ length: count }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 1.4 + 0.4,
    }));

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width)  d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,100,255,0.5)";
        ctx.fill();
      });

      // connect nearby
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(100,80,255,${0.18 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   PRODUCT LIST
══════════════════════════════════════════════════════════ */
const PRODUCTS = [
  { value: "Sculpture",            icon: "🗿" },
  { value: "Miniature",            icon: "🏛️" },
  { value: "Toys",                 icon: "🧸" },
  { value: "Key Chains",           icon: "🔑" },
  { value: "Gifts",                icon: "🎁" },
  { value: "3D Photo Frames",      icon: "🖼️" },
  { value: "Wall Stand",           icon: "📐" },
  { value: "3D Science Projects",  icon: "🔬" },
  { value: "All 3D Works",         icon: "✨" },
];

/* ══════════════════════════════════════════════════════════
   INFO LINKS
══════════════════════════════════════════════════════════ */
const LINKS = ["Home", "Archive", "Services", "Gallery", "Contact"];

/* ══════════════════════════════════════════════════════════
   MAIN FOOTER
══════════════════════════════════════════════════════════ */
export default function Footer() {
  const [step,    setStep]    = useState(0);   // 0=name 1=phone 2=product 3=sent
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [product, setProduct] = useState("");
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(null);
  const inputRef = useRef();

  // auto-focus when step changes
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  const nextStep = () => {
    if (step === 0 && !name.trim())    return shake("nameField");
    if (step === 1 && phone.length < 10) return shake("phoneField");
    if (step < 2) setStep(s => s + 1);
  };

  const shake = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("shake");
    setTimeout(() => el.classList.remove("shake"), 500);
  };

  const openWhatsApp = () => {
    if (!product) return shake("productField");
    setSending(true);
    setTimeout(() => {
      const msg = `Hello VJ 3D Works! 👋\n\nI'd like to place an order.\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n🖨️ Product: ${product}\n\nPlease let me know the details!`;
      window.open(`https://wa.me/919159432954?text=${encodeURIComponent(msg)}`, "_blank");
      setSending(false);
      setStep(3);
    }, 1400);
  };

  const reset = () => {
    setStep(0); setName(""); setPhone(""); setProduct(""); setSending(false);
  };

  const openInstagram = () => window.open("https://instagram.com/vj_3d_works", "_blank");

  const STEP_LABELS = ["Your Name", "Phone No.", "Product"];

  return (
    <>
      {/* ─── Inject Google Font + animations ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --f-bg:      #06060f;
          --f-surface: #0e0e20;
          --f-border:  rgba(140,120,255,0.15);
          --f-accent:  #7c5fff;
          --f-accent2: #00e5ff;
          --f-green:   #25D366;
          --f-text:    #ddd8ff;
          --f-muted:   rgba(200,190,255,0.45);
          --ff-head:   'Bebas Neue', sans-serif;
          --ff-body:   'Outfit', sans-serif;
        }
          body{
          margin:0;
          overflow-x:hidden;
          }

        .ftr-root {
          font-family: var(--ff-body);
          background: var(--f-bg);
          color: var(--f-text);
          position: relative;
          overflow: hidden;
        }

        /* glow orbs */
        .ftr-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .ftr-orb--1 { width:420px;height:420px;background:rgba(124,95,255,.12);top:-80px;right:-60px; }
        .ftr-orb--2 { width:300px;height:300px;background:rgba(0,229,255,.07);bottom:60px;left:-80px; }

        /* top divider */
        .ftr-divider {
          width:100%; height:1px;
          background: linear-gradient(90deg, transparent, var(--f-accent), var(--f-accent2), transparent);
          opacity: 0.5;
        }

        /* ── top strip ── */
        .ftr-top {
        width:100%;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          padding: 64px clamp(20px,7vw,100px) 48px;
          position: relative; z-index:;
          left:28%;
        }
        @media(max-width:820px){
          .ftr-top { grid-template-columns:1fr; }
        }

        /* brand block */
        .ftr-brand__logo {
          font-family: var(--ff-head);
          font-size: clamp(42px,6vw,72px);
          letter-spacing: 4px;
          line-height:1;
          background: linear-gradient(120deg, #fff 30%, var(--f-accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ftr-brand__tagline {
          font-size: 12px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--f-muted);
          margin-top: 8px;
        }
        .ftr-brand__info {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 14px;
          color: var(--f-muted);
          line-height: 1.6;
        }
        .ftr-brand__info span { color: var(--f-text); font-weight:500; }
        .ftr-ig {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          padding: 10px 20px;
          border-radius: 40px;
          border: 1px solid rgba(168,85,247,.4);
          font-size: 13px;
          color: #c084fc;
          cursor: pointer;
          transition: background 0.3s, border-color 0.3s, transform 0.2s;
          width: fit-content;
          background: rgba(168,85,247,.06);
        }
        .ftr-ig:hover { background:rgba(168,85,247,.15); border-color:rgba(168,85,247,.7); transform:translateY(-2px); }
        .ftr-ig__dot {
          width:8px;height:8px;border-radius:50%;
          background:linear-gradient(135deg,#f09433,#bc1888);
          animation: igPulse 2s ease-in-out infinite;
        }
        @keyframes igPulse {
          0%,100%{box-shadow:0 0 0 0 rgba(188,24,136,.4);}
          50%{box-shadow:0 0 0 6px rgba(188,24,136,0);}
        }

        /* nav links block */
        .ftr-nav h4 {
          font-family: var(--ff-head);
          font-size:18px;
          letter-spacing:3px;
          color: var(--f-muted);
          margin-bottom: 24px;
        }
        .ftr-nav ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:14px; }
        .ftr-nav li {
          font-size:14px;
          cursor:pointer;
          color: var(--f-muted);
          transition: color 0.2s, transform 0.2s;
          display:flex; align-items:center; gap:8px;
        }
        .ftr-nav li::before { content:"—"; font-size:10px; color:var(--f-accent); }
        .ftr-nav li:hover { color: var(--f-text); transform:translateX(4px); }

        /* ── ORDER TERMINAL ── */
        .ftr-terminal {
          background: var(--f-surface);
          border: 1px solid var(--f-border);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 0 60px rgba(124,95,255,.08);
        }
        .ftr-terminal__bar {
          padding: 12px 18px;
          background: rgba(255,255,255,.03);
          border-bottom: 1px solid var(--f-border);
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .ftr-terminal__dot { width:10px;height:10px;border-radius:50%; }
        .ftr-terminal__dot:nth-child(1){background:#ff5f57;}
        .ftr-terminal__dot:nth-child(2){background:#febc2e;}
        .ftr-terminal__dot:nth-child(3){background:#28c840;}
        .ftr-terminal__label {
          margin-left: 8px;
          font-size: 11px;
          letter-spacing: 3px;
          color: var(--f-muted);
        }

        .ftr-terminal__body { padding: 28px; }

        /* step indicator */
        .ftr-steps {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 28px;
        }
        .ftr-step {
          display: flex; align-items:center; gap:6px;
          font-size: 11px; letter-spacing:2px; text-transform:uppercase;
          color: var(--f-muted);
          transition: color 0.3s;
        }
        .ftr-step--active { color: var(--f-text); }
        .ftr-step--done   { color: var(--f-accent2); }
        .ftr-step__num {
          width:22px;height:22px;border-radius:50%;
          border: 1px solid var(--f-border);
          display:flex;align-items:center;justify-content:center;
          font-size:10px; font-weight:600;
          transition: background 0.3s, border-color 0.3s;
        }
        .ftr-step--active .ftr-step__num { background:var(--f-accent); border-color:var(--f-accent); color:#fff; }
        .ftr-step--done   .ftr-step__num { background:var(--f-accent2); border-color:var(--f-accent2); color:#000; }
        .ftr-step__line { flex:1; height:1px; background: var(--f-border); margin:0 8px; min-width:16px; }

        /* field wrapper */
        .ftr-field { position:relative; }
        .ftr-label {
          display:block;
          font-size:11px;
          letter-spacing:3px;
          text-transform:uppercase;
          color: var(--f-muted);
          margin-bottom: 8px;
        }
        .ftr-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .ftr-input-icon {
          position:absolute; left:14px;
          font-size:16px; pointer-events:none;
          z-index:1;
        }
        .ftr-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background: rgba(255,255,255,.04);
          border: 1px solid var(--f-border);
          border-radius: 10px;
          color: var(--f-text);
          font-family: var(--ff-body);
          font-size: 15px;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .ftr-input:focus {
          border-color: var(--f-accent);
          box-shadow: 0 0 0 3px rgba(124,95,255,.18);
        }
        .ftr-input::placeholder { color: rgba(200,190,255,.25); }

        /* product grid */
        .ftr-products {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 8px;
          margin-top: 2px;
        }
        @media(max-width:400px){ .ftr-products { grid-template-columns:repeat(2,1fr); } }
        .ftr-product-btn {
          padding: 10px 6px;
          border: 1px solid var(--f-border);
          border-radius: 10px;
          background: rgba(255,255,255,.03);
          color: var(--f-muted);
          font-family: var(--ff-body);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display:flex;flex-direction:column;align-items:center;gap:5px;
        }
        .ftr-product-btn:hover { border-color:var(--f-accent); color:var(--f-text); background:rgba(124,95,255,.08); }
        .ftr-product-btn--selected {
          border-color: var(--f-accent);
          background: rgba(124,95,255,.18);
          color: #fff;
          box-shadow: 0 0 12px rgba(124,95,255,.3);
        }
        .ftr-product-btn span:first-child { font-size:20px; }

        /* CTA row */
        .ftr-cta-row {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }
        .ftr-btn-back {
          padding: 13px 18px;
          border-radius: 10px;
          border: 1px solid var(--f-border);
          background: transparent;
          color: var(--f-muted);
          font-family: var(--ff-body);
          font-size:14px;
          cursor:pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .ftr-btn-back:hover { border-color: var(--f-accent); color:var(--f-text); }
        .ftr-btn-next {
          flex:1;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, var(--f-accent), #5438db);
          color: #fff;
          font-family: var(--ff-body);
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          letter-spacing:0.5px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(124,95,255,.35);
        }
        .ftr-btn-next:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(124,95,255,.5); }

        .ftr-btn-wa {
          flex:1;
          padding: 15px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #25D366, #128C4A);
          color: #fff;
          font-family: var(--ff-body);
          font-size:15px;
          font-weight:700;
          cursor:pointer;
          display:flex;align-items:center;justify-content:center;gap:10px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(37,211,102,.25);
        }
        .ftr-btn-wa:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(37,211,102,.4); }
        .ftr-btn-wa:disabled { opacity:0.7; cursor:wait; }

        /* sending spinner */
        @keyframes spin { to { transform:rotate(360deg); } }
        .ftr-spinner {
          width:18px;height:18px;border:2px solid rgba(255,255,255,.3);
          border-top-color:#fff;border-radius:50%;
          animation:spin .7s linear infinite;
        }

        /* success state */
        .ftr-success {
          text-align:center;
          padding: 32px 0;
          animation: popIn 0.5s cubic-bezier(.22,1,.36,1);
        }
        @keyframes popIn {
          from{opacity:0;transform:scale(0.88);}
          to{opacity:1;transform:scale(1);}
        }
        .ftr-success__icon { font-size:52px; margin-bottom:16px; }
        .ftr-success__title {
          font-family:var(--ff-head);
          font-size:28px;letter-spacing:3px;
          background:linear-gradient(90deg,var(--f-green),var(--f-accent2));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          margin-bottom:8px;
        }
        .ftr-success__sub { font-size:13px;color:var(--f-muted);margin-bottom:24px; }
        .ftr-btn-reset {
          padding:10px 24px;border-radius:30px;
          border:1px solid var(--f-border);
          background:transparent;color:var(--f-muted);
          font-family:var(--ff-body);font-size:13px;cursor:pointer;
          transition:border-color 0.2s,color 0.2s;
        }
        .ftr-btn-reset:hover{border-color:var(--f-accent);color:var(--f-text);}

        /* bottom bar */
        .ftr-bottom {
          position:relative;z-index:2;
          padding:20px clamp(20px,7vw,100px);
          display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;
          border-top:1px solid var(--f-border);
          font-size:12px;color:var(--f-muted);
        }
        .ftr-bottom__pulse {
          display:flex;align-items:center;gap:6px;
        }
        .ftr-live-dot {
          width:7px;height:7px;border-radius:50%;background:#28c840;
          animation:livePulse 2s infinite;
        }
        @keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(40,200,64,.5);}50%{box-shadow:0 0 0 5px rgba(40,200,64,0);}}

        /* shake animation */
        @keyframes shake{0%,100%{transform:translateX(0);}20%{transform:translateX(-6px);}40%{transform:translateX(6px);}60%{transform:translateX(-4px);}80%{transform:translateX(4px);}}
        .shake{animation:shake 0.45s ease;}
      `}</style>

      <footer className="ftr-root">
        <ParticleField />
        <div className="ftr-orb ftr-orb--1" />
        <div className="ftr-orb ftr-orb--2" />
        <div className="ftr-divider" />

        {/* ── MAIN GRID ── */}
        <div className="ftr-top">

          

          {/* ORDER TERMINAL */}
          <div className="ftr-terminal">
            {/* title bar */}
            <div className="ftr-terminal__bar">
              <div className="ftr-terminal__dot" />
              <div className="ftr-terminal__dot" />
              <div className="ftr-terminal__dot" />
              <span className="ftr-terminal__label">ORDER.TERMINAL</span>
            </div>

            <div className="ftr-terminal__body">
              {step < 3 ? (
                <>
                  {/* step indicator */}
                  <div className="ftr-steps">
                    {STEP_LABELS.map((label, i) => (
                      <React.Fragment key={i}>
                        <div className={`ftr-step ${step === i ? "ftr-step--active" : step > i ? "ftr-step--done" : ""}`}>
                          <div className="ftr-step__num">
                            {step > i ? "✓" : i + 1}
                          </div>
                          {label}
                        </div>
                        {i < STEP_LABELS.length - 1 && <div className="ftr-step__line" />}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* STEP 0 – Name */}
                  {step === 0 && (
                    <div className="ftr-field" id="nameField">
                      <label className="ftr-label">Your Name</label>
                      <div className="ftr-input-wrap">
                        <span className="ftr-input-icon">👤</span>
                        <input
                          ref={inputRef}
                          className="ftr-input"
                          type="text"
                          placeholder="e.g. Vijay Kumar"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && nextStep()}
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                        />
                      </div>
                      <div className="ftr-cta-row">
                        <button className="ftr-btn-next" onClick={nextStep}>Continue →</button>
                      </div>
                    </div>
                  )}

                  {/* STEP 1 – Phone */}
                  {step === 1 && (
                    <div className="ftr-field" id="phoneField">
                      <label className="ftr-label">Phone Number</label>
                      <div className="ftr-input-wrap">
                        <span className="ftr-input-icon">📱</span>
                        <input
                          ref={inputRef}
                          className="ftr-input"
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          onKeyDown={e => e.key === "Enter" && nextStep()}
                        />
                      </div>
                      <div className="ftr-cta-row">
                        <button className="ftr-btn-back" onClick={() => setStep(0)}>← Back</button>
                        <button className="ftr-btn-next" onClick={nextStep}>Continue →</button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 – Product */}
                  {step === 2 && (
                    <div className="ftr-field" id="productField">
                      <label className="ftr-label">Select Product</label>
                      <div className="ftr-products">
                        {PRODUCTS.map(p => (
                          <button
                            key={p.value}
                            className={`ftr-product-btn ${product === p.value ? "ftr-product-btn--selected" : ""}`}
                            onClick={() => setProduct(p.value)}
                          >
                            <span>{p.icon}</span>
                            <span>{p.value}</span>
                          </button>
                        ))}
                      </div>
                      <div className="ftr-cta-row">
                        <button className="ftr-btn-back" onClick={() => setStep(1)}>← Back</button>
                        <button className="ftr-btn-wa" onClick={openWhatsApp} disabled={sending}>
                          {sending ? (
                            <><div className="ftr-spinner" /> Launching...</>
                          ) : (
                            <>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              Send on WhatsApp
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* SUCCESS */
                <div className="ftr-success">
                  <div className="ftr-success__icon">🚀</div>
                  <div className="ftr-success__title">ORDER SENT!</div>
                  <div className="ftr-success__sub">
                    WhatsApp opened for <strong style={{color:"#fff"}}>{name}</strong>.<br/>
                    We'll get back to you shortly!
                  </div>
                  <button className="ftr-btn-reset" onClick={reset}>Place Another Order ↺</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="ftr-bottom">
          <div className="ftr-bottom__pulse">
            <div className="ftr-live-dot" />
            Studio is active · Gingee, Tamil Nadu
          </div>
          <div>© 2025 VJ 3D Works. All rights reserved.</div>
          <div>Crafted with precision 🖨️</div>
        </div>
      </footer>
    </>
  );
}
