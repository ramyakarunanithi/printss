import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ── ASSETS (keep your own imports) ──────────────────────────────── */
// import image  from './assets/images/image.jpg'
// import image2 from './assets/images/image2.jpg'

/* ════════════════════════════════════════════════════════════════════
   DETECT TOUCH / MOBILE
══════════════════════════════════════════════════════════════════════ */
const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/* ════════════════════════════════════════════════════════════════════
   3-D SCENE
══════════════════════════════════════════════════════════════════════ */
function FloatingGeometry() {
  const meshRef  = useRef();
  const groupRef = useRef();
  const mouse    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isTouchDevice()) return;
    const handler = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      if (!isTouchDevice()) {
        groupRef.current.rotation.y += (mouse.current.x * 0.8 - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x += (-mouse.current.y * 0.5 - groupRef.current.rotation.x) * 0.05;
      } else {
        groupRef.current.rotation.y = t * 0.18;
        groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
      }
    }
    if (meshRef.current) {
      meshRef.current.rotation.z = t * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]}    intensity={2}   color="#7c3aed" />
      <pointLight position={[-5, -3, -5]}  intensity={1.2} color="#06b6d4" />
      <pointLight position={[0, -5, 3]}    intensity={0.8} color="#f59e0b" />
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.3, 3]} />
          <MeshDistortMaterial
            color="#4f46e5"
            attach="material"
            distort={0.45}
            speed={2.5}
            roughness={0}
            metalness={0.9}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>
      <Float speed={0.8} floatIntensity={0.3}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.1, 0.015, 8, 80]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[2.4, 0.01, 8, 80]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.25} />
        </mesh>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PARTICLE FIELD (footer bg)
══════════════════════════════════════════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.4 + 0.4,
    }));
    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,100,255,0.5)";
        ctx.fill();
      });
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
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
  );
}

/* ════════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════════ */
const IG_POSTS = [
  { id: 1,  src: "/Images/image6.jpg",  caption: "Custom figurine drop",       likes: "1.2k", tag: "FIGURINE"     },
  { id: 2,  src: "/Images/image9.jpg",  caption: "Architectural model series",  likes: "980",  tag: "ARCHITECTURE" },
  { id: 3,  src: "/Images/image5.jpg",  caption: "Neon lamp gift edition",      likes: "2.1k", tag: "DECOR"        },
  { id: 4,  src: "/Images/image4.jpg",  caption: "Geometric art piece",         likes: "856",  tag: "ART"          },
  { id: 5,  src: "/Images/image2.jpg",  caption: "Cleat prototype v2",          likes: "3.4k", tag: "COLLAB"       },
  { id: 6,  src: "/Images/image11.jpg", caption: "Personalised keychains",      likes: "770",  tag: "GIFTS"        },
  { id: 7,  src: "/Images/image3.jpg",  caption: "Abstract desk sculpture",     likes: "1.5k", tag: "DECOR"        },
  { id: 8,  src: "/Images/image.jpg",   caption: "Miniature city model",        likes: "2.8k", tag: "ARCHITECTURE" },
  { id: 9,  src: "/Images/image8.jpg",  caption: "Gradient resin finish",       likes: "1.1k", tag: "ART"          },
  { id: 10, src: "/Images/image10.jpg", caption: "Gradient resin finish",       likes: "1.1k", tag: "ART"          },
];

const STATS = [
  { value: 480, suffix: "+", label: "Projects Delivered" },
  { value: 12,  suffix: "k", label: "Happy Clients"      },
  { value: 99,  suffix: "%", label: "Satisfaction Rate"  },
  { value: 6,   suffix: "+", label: "Years Experience"   },
];

const SERVICES = [
  { icon: "◈", title: "Figurines & Characters",  desc: "Turn your concepts into tangible collectibles with sub-0.1mm precision." },
  { icon: "⬡", title: "Architectural Models",    desc: "Scale models for real-estate, education and exhibition."                },
  { icon: "◉", title: "Custom Gifts & Decor",    desc: "Personalised pieces that carry meaning beyond aesthetics."              },
  { icon: "⬟", title: "Prototype Engineering",   desc: "Rapid iteration for industrial and product design."                    },
];

const PRODUCTS = [
  { value: "Sculpture",           icon: "🗿" },
  { value: "Miniature",           icon: "🏛️" },
  { value: "Toys",                icon: "🧸" },
  { value: "Key Chains",          icon: "🔑" },
  { value: "Gifts",               icon: "🎁" },
  { value: "3D Photo Frames",     icon: "🖼️" },
  { value: "Wall Stand",          icon: "📐" },
  { value: "3D Science Projects", icon: "🔬" },
  { value: "All 3D Works",        icon: "✨" },
];

const NAV_LINKS  = ["Home", "Archive", "Services", "Contact"];
const FOOT_LINKS = ["Instagram", "Behance", "Twitter", "LinkedIn"];

/* ════════════════════════════════════════════════════════════════════
   MAGNETIC CURSOR (desktop only)
══════════════════════════════════════════════════════════════════════ */
function MagneticCursor() {
  const dotRef   = useRef();
  const ringRef  = useRef();
  const pos      = useRef({ x: -100, y: -100 });
  const ring     = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTouchDevice()) return;
    setVisible(true);
    const onMove  = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onEnter = () => { hovering.current = true; };
    const onLeave = () => { hovering.current = false; };
    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a,button,[data-cursor]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    let rafId;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${pos.current.x - 5}px, ${pos.current.y - 5}px)`;
      if (ringRef.current) {
        const s = hovering.current ? 2.2 : 1;
        ringRef.current.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px) scale(${s})`;
        ringRef.current.style.opacity   = hovering.current ? "0.6" : "1";
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("mousemove", onMove); };
  }, []);

  if (!visible) return null;
  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════════════════════════ */
function Counter({ value, suffix }) {
  const [display, setDisplay] = useState(0);
  const ref     = useRef();
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step  = value / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= value) { setDisplay(value); clearInterval(timer); }
          else setDisplay(Math.floor(start));
        }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ════════════════════════════════════════════════════════════════════
   3-D TILT CARD (touch-aware)
══════════════════════════════════════════════════════════════════════ */
function IGCard({ post, index }) {
  const cardRef = useRef();
  const [hovered, setHovered] = useState(false);
  const touch = isTouchDevice();

  const onMove = useCallback((e) => {
    if (touch) return;
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - 0.5) * 22;
    const y = ((e.clientY - top)  / height - 0.5) * -22;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.04,1.04,1.04)`;
  }, [touch]);

  const onLeave = useCallback(() => {
    if (touch) return;
    if (cardRef.current) cardRef.current.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    setHovered(false);
  }, [touch]);

  return (
    <div
      ref={cardRef}
      className="igCard reveal"
      style={{ animationDelay: `${index * 70}ms`, transition: "transform 0.15s ease" }}
      onMouseMove={onMove}
      onMouseEnter={() => !touch && setHovered(true)}
      onMouseLeave={onLeave}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 800)}
      data-cursor
    >
      <div className="igCard__shine" />
      <img src={post.src} alt={post.caption} className="igCard__img" />
      <div className={`igCard__overlay ${hovered ? "igCard__overlay--show" : ""}`}>
        <span className="igCard__tag">{post.tag}</span>
        <p className="igCard__caption">{post.caption}</p>
        <span className="igCard__likes">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {post.likes}
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SERVICE CARD
══════════════════════════════════════════════════════════════════════ */
function ServiceCard({ service, index }) {
  return (
    <div className="serviceCard reveal" style={{ animationDelay: `${index * 100}ms` }} data-cursor>
      <div className="serviceCard__icon">{service.icon}</div>
      <h3 className="serviceCard__title">{service.title}</h3>
      <p className="serviceCard__desc">{service.desc}</p>
      <div className="serviceCard__arrow">→</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════════════════════════════ */
function MobileMenu({ open, onClose }) {
  return (
    <div className={`mobileMenu ${open ? "mobileMenu--open" : ""}`}>
      <button className="mobileMenu__close" onClick={onClose}>✕</button>
      {NAV_LINKS.map(l => (
        <span key={l} className="mobileMenu__link" onClick={onClose}>{l}</span>
      ))}
      <button className="mobileMenu__cta" onClick={onClose}>Get a Quote ↗</button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FOOTER WITH WHATSAPP ORDER TERMINAL
══════════════════════════════════════════════════════════════════════ */
function SiteFooter() {
  const [step,    setStep]    = useState(0);
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [product, setProduct] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef();

  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, [step]);

  const shake = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("ftr-shake");
    setTimeout(() => el.classList.remove("ftr-shake"), 500);
  };

  const nextStep = () => {
    if (step === 0 && !name.trim())       return shake("ftr-nameField");
    if (step === 1 && phone.length < 10)  return shake("ftr-phoneField");
    if (step < 2) setStep(s => s + 1);
  };

  const openWhatsApp = () => {
    if (!product) return shake("ftr-productField");
    setSending(true);
    setTimeout(() => {
      const msg = `Hello VJ 3D Works! 👋\n\nI'd like to place an order.\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n🖨️ Product: ${product}\n\nPlease let me know the details!`;
      window.open(`https://wa.me/919159432954?text=${encodeURIComponent(msg)}`, "_blank");
      setSending(false);
      setStep(3);
    }, 1400);
  };

  const reset = () => { setStep(0); setName(""); setPhone(""); setProduct(""); setSending(false); };
  const openInstagram = () => window.open("https://instagram.com/vj_3d_works", "_blank");

  const STEP_LABELS = ["Your Name", "Phone No.", "Product"];

  return (
    <footer className="ftr-root">
      <ParticleField />
      <div className="ftr-orb ftr-orb--1" />
      <div className="ftr-orb ftr-orb--2" />
      <div className="ftr-divider" />

      <div className="ftr-top">

        {/* ── BRAND ── */}
        <div className="ftr-brand">
          <div className="ftr-brand__logo">VJ 3D Works</div>
          <div className="ftr-brand__tagline">Precision · Creativity · 3D</div>
          <div className="ftr-brand__info">
            <div>📍 <span>Gingee, Tamil Nadu</span></div>
            <div>📞 <span>+91 91594 32954</span></div>
            <div>📧 <span>vj3dworks@gmail.com</span></div>
          </div>
          <div className="ftr-ig" onClick={openInstagram} data-cursor>
            <div className="ftr-ig__dot" />
            @vj_3d_works
          </div>
        </div>

        {/* ── ORDER TERMINAL ── */}
        <div className="ftr-terminal">
          <div className="ftr-terminal__bar">
            <div className="ftr-terminal__dot" />
            <div className="ftr-terminal__dot" />
            <div className="ftr-terminal__dot" />
            <span className="ftr-terminal__label">ORDER.TERMINAL</span>
          </div>

          <div className="ftr-terminal__body">
            {step < 3 ? (
              <>
                <div className="ftr-steps">
                  {STEP_LABELS.map((label, i) => (
                    <React.Fragment key={i}>
                      <div className={`ftr-step ${step === i ? "ftr-step--active" : step > i ? "ftr-step--done" : ""}`}>
                        <div className="ftr-step__num">{step > i ? "✓" : i + 1}</div>
                        <span className="ftr-step__label">{label}</span>
                      </div>
                      {i < STEP_LABELS.length - 1 && <div className="ftr-step__line" />}
                    </React.Fragment>
                  ))}
                </div>

                {step === 0 && (
                  <div className="ftr-field" id="ftr-nameField">
                    <label className="ftr-label">Your Name</label>
                    <div className="ftr-input-wrap">
                      <span className="ftr-input-icon">👤</span>
                      <input ref={inputRef} className="ftr-input" type="text" placeholder="e.g. Vijay Kumar"
                        value={name} onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && nextStep()} />
                    </div>
                    <div className="ftr-cta-row">
                      <button className="ftr-btn-next" onClick={nextStep} data-cursor>Continue →</button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="ftr-field" id="ftr-phoneField">
                    <label className="ftr-label">Phone Number</label>
                    <div className="ftr-input-wrap">
                      <span className="ftr-input-icon">📱</span>
                      <input ref={inputRef} className="ftr-input" type="tel" placeholder="10-digit mobile number"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        onKeyDown={e => e.key === "Enter" && nextStep()} />
                    </div>
                    <div className="ftr-cta-row">
                      <button className="ftr-btn-back" onClick={() => setStep(0)} data-cursor>← Back</button>
                      <button className="ftr-btn-next" onClick={nextStep} data-cursor>Continue →</button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="ftr-field" id="ftr-productField">
                    <label className="ftr-label">Select Product</label>
                    <div className="ftr-products">
                      {PRODUCTS.map(p => (
                        <button key={p.value} data-cursor
                          className={`ftr-product-btn ${product === p.value ? "ftr-product-btn--selected" : ""}`}
                          onClick={() => setProduct(p.value)}>
                          <span>{p.icon}</span>
                          <span>{p.value}</span>
                        </button>
                      ))}
                    </div>
                    <div className="ftr-cta-row">
                      <button className="ftr-btn-back" onClick={() => setStep(1)} data-cursor>← Back</button>
                      <button className="ftr-btn-wa" onClick={openWhatsApp} disabled={sending} data-cursor>
                        {sending ? (
                          <><div className="ftr-spinner" /> Launching...</>
                        ) : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
              <div className="ftr-success">
                <div className="ftr-success__icon">🚀</div>
                <div className="ftr-success__title">ORDER SENT!</div>
                <div className="ftr-success__sub">
                  WhatsApp opened for <strong style={{ color: "#fff" }}>{name}</strong>.<br />
                  We'll get back to you shortly!
                </div>
                <button className="ftr-btn-reset" onClick={reset} data-cursor>Place Another Order ↺</button>
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
        <div className="ftr-bottom__links">
          {FOOT_LINKS.map(l => (
            <span key={l} className="ftr-footLink" data-cursor>{l}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
export default function Demoone() {
  const carouselRef = useRef();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const t = setTimeout(() => document.documentElement.classList.add("smooth-ready"), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    let pos = 0, rafId;
    const animate = () => {
      pos += 0.6;
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(-${pos}px)`;
        if (pos >= carouselRef.current.scrollWidth / 2) pos = 0;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add("show"), i * 60);
      }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const h = () => {
      const y    = window.scrollY;
      const hero = document.querySelector(".heroText");
      if (hero) hero.style.transform = `translateY(${y * 0.28}px)`;
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [isMobile]);

  return (
    <div className="root">
      {!isTouchDevice() && <MagneticCursor />}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__logo">
          <span className="logo-bracket">[</span>3DPRINTSS<span className="logo-bracket">]</span>
        </div>
        <div className="navbar__links">
          {NAV_LINKS.map(l => <span key={l} className="navLink" data-cursor>{l}</span>)}
        </div>
        <button className="navbar__cta desktop-only" data-cursor>Get a Quote ↗</button>
        <button className="navbar__hamburger mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="grain" />
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="blob blob--3" />
        <Canvas className="hero__canvas" dpr={[1, isMobile ? 1 : 2]} camera={{ position: [0, 0, 4], fov: 55 }}>
          <FloatingGeometry />
        </Canvas>
        <div className="heroText">
          <div className="heroText__label">✦ Premium 3D Printing Studio</div>
          <h1 className="heroText__h1">
            <span className="line">IMAGINATION</span>
            <span className="line"><em>PERSONALIZED</em></span>
            <span className="line">REALITY</span>
          </h1>
          <p className="heroText__sub">From concept to tangible — we print the impossible.</p>
          <div className="heroText__actions">
            <button className="btn btn--primary" data-cursor>Explore Work ↓</button>
            <button className="btn btn--ghost"   data-cursor>View Process →</button>
          </div>
        </div>
        <div className="hero__scroll">
          <div className="scrollLine" />
          <span>SCROLL</span>
        </div>
      </section>

      {/* ── TICKER ── */}
      <section className="ticker">
        <div ref={carouselRef} className="ticker__track">
          {[...Array(4)].flatMap(() =>
            ["DECOR ✦", "ARCHITECTURE ✦", "GIFTS ✦", "COLLAB ✦", "ART ✦", "FIGURINES ✦", "PROTOTYPES ✦"]
          ).map((label, i) => <span key={i} className="ticker__item">{label}</span>)}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats">
        {STATS.map((s, i) => (
          <div key={i} className="statItem reveal" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="statItem__value"><Counter value={s.value} suffix={s.suffix} /></div>
            <div className="statItem__label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── SERVICES ── */}
      <section className="services">
        <div className="section__eyebrow reveal">✦ WHAT WE DO</div>
        <h2 className="section__title reveal">Crafted for <em>Every</em> Vision</h2>
        <div className="services__grid">
          {SERVICES.map((s, i) => <ServiceCard key={i} service={s} index={i} />)}
        </div>
      </section>

      {/* ── ARCHIVE ── */}
      <section className="archive">
        <div className="archive__header">
          <div>
            <div className="section__eyebrow reveal">✦ @VJ_3D_WORKS</div>
            <h2 className="section__title reveal">The <em>Archive</em></h2>
          </div>
          <a href="https://www.instagram.com/VJ_3D_WORKS/" target="_blank" rel="noreferrer" className="igBadge" data-cursor>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#ig)" strokeWidth="2">
              <defs>
                <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#f09433" />
                  <stop offset="50%"  stopColor="#dc2743" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Follow on Instagram ↗
          </a>
        </div>
        <div className="archive__grid">
          {IG_POSTS.map((post, i) => <IGCard key={post.id} post={post} index={i} />)}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="ctaBanner">
        <div className="grain" />
        <div className="ctaBanner__content">
          <h2 className="ctaBanner__title reveal">Ready to print your<br /><em>dream?</em></h2>
          <p className="ctaBanner__sub reveal">Send us your design. We'll handle the rest.</p>
          <button className="btn btn--white reveal" data-cursor
            onClick={() => document.querySelector(".ftr-root")?.scrollIntoView({ behavior: "smooth" })}>
            Order via WhatsApp →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <SiteFooter />

      {/* ════════════════════════════════════════════════════════════
          GLOBAL STYLES
      ═══════════════════════════════════════════════════════════ */}
      <style>{`
        /* ── NEW FONT IMPORTS ── */
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;500;600;700&family=Dela+Gothic+One&family=Figtree:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #04040f;
          --surface:  #0b0b1e;
          --border:   rgba(255,255,255,0.07);
          --accent:   #6d49fb;
          --accent2:  #06d6f5;
          --accent3:  #f59e0b;
          --text:     #e8e6ff;
          --muted:    rgba(232,230,255,0.45);

          /* NEW fonts */
          --ff-head:  'Unbounded', sans-serif;
          --ff-body:  'Manrope', sans-serif;
          --ff-display: 'Dela Gothic One', sans-serif;
          --radius:   16px;

          /* footer tokens */
          --f-bg:      #06060f;
          --f-surface: #0e0e20;
          --f-border:  rgba(140,120,255,0.15);
          --f-accent:  #7c5fff;
          --f-accent2: #00e5ff;
          --f-green:   #25D366;
          --f-text:    #ddd8ff;
          --f-muted:   rgba(200,190,255,0.45);
          --ff-fhead:  'Dela Gothic One', sans-serif;
          --ff-fbody:  'Figtree', sans-serif;
        }

        html { scroll-behavior: auto; }
        html.smooth-ready { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--ff-body);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        /* hide native cursor only on non-touch */
        @media (hover: hover) and (pointer: fine) {
          body { cursor: none; }
        }

        /* ── Cursor (desktop only) ── */
        .cursor-dot {
          position: fixed; width:10px; height:10px; border-radius:50%;
          background: var(--accent2); pointer-events:none; z-index:9999;
          mix-blend-mode:difference; will-change:transform;
        }
        .cursor-ring {
          position:fixed; width:40px; height:40px; border-radius:50%;
          border:1.5px solid var(--accent); pointer-events:none; z-index:9998;
          transition:opacity 0.3s, transform 0.15s ease; will-change:transform;
        }

        /* ── Scroll reveal ── */
        .reveal { opacity:0; transform:translateY(36px); transition:opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); }
        .reveal.show { opacity:1; transform:translateY(0); }

        /* ── Grain ── */
        .grain {
          position:absolute; inset:0; pointer-events:none; opacity:0.035;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat:repeat; background-size:200px; z-index:1;
        }

        /* ── Blobs ── */
        .blob { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; animation:blobFloat 12s ease-in-out infinite; }
        .blob--1 { width:500px;height:500px;background:rgba(109,73,251,0.18);top:-100px;right:-80px; }
        .blob--2 { width:380px;height:380px;background:rgba(6,214,245,0.1);bottom:0;left:-60px;animation-delay:-5s; }
        .blob--3 { width:280px;height:280px;background:rgba(245,158,11,0.07);top:40%;left:35%;animation-delay:-9s; }
        @keyframes blobFloat {
          0%,100%{transform:translate(0,0) scale(1);}
          33%{transform:translate(30px,-20px) scale(1.05);}
          66%{transform:translate(-20px,30px) scale(0.97);}
        }

        /* ── Navbar ── */
        .navbar {
          position:fixed; top:16px; left:50%; transform:translateX(-50%);
          width:min(92%,1100px); display:flex; align-items:center; justify-content:space-between;
          padding:12px 24px; border-radius:60px; background:rgba(4,4,15,0.4);
          border:1px solid var(--border); backdrop-filter:blur(16px); z-index:100;
          transition:background .4s, box-shadow .4s;
        }
        .navbar--scrolled { background:rgba(4,4,15,0.88); box-shadow:0 8px 40px rgba(0,0,0,0.5); }
        .navbar__logo { font-family:var(--ff-head); font-weight:900; font-size:clamp(11px,2vw,16px); letter-spacing:3px; }
        .logo-bracket { color:var(--accent); }
        .navbar__links { display:flex; gap:28px; font-size:13px; letter-spacing:1px; font-family:var(--ff-body); }
        .navLink { cursor:pointer; opacity:0.7; transition:opacity 0.2s; }
        .navLink:hover { opacity:1; }
        .navbar__cta {
          background:var(--accent); color:#fff; border:none; border-radius:30px;
          padding:9px 20px; font-size:13px; font-family:var(--ff-body); font-weight:600;
          cursor:pointer; transition:background .3s, transform .2s; letter-spacing:.3px;
        }
        .navbar__cta:hover { background:#5938e0; transform:translateY(-1px); }
        .desktop-only { display:flex; }
        .mobile-only  { display:none; }

        /* ── Hamburger ── */
        .navbar__hamburger {
          display:none; flex-direction:column; gap:5px; background:transparent;
          border:none; cursor:pointer; padding:6px; z-index:101;
        }
        .navbar__hamburger span {
          display:block; width:22px; height:2px; background:var(--text);
          border-radius:2px; transition:all .3s;
        }

        /* ── Mobile Menu ── */
        .mobileMenu {
          position:fixed; inset:0; background:rgba(4,4,15,0.97); backdrop-filter:blur(20px);
          z-index:200; display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:32px; transform:translateX(100%); transition:transform .4s cubic-bezier(.22,1,.36,1);
        }
        .mobileMenu--open { transform:translateX(0); }
        .mobileMenu__close {
          position:absolute; top:24px; right:24px; background:transparent; border:1px solid var(--border);
          color:var(--text); width:40px; height:40px; border-radius:50%; font-size:16px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
        }
        .mobileMenu__link {
          font-family:var(--ff-head); font-size:clamp(26px,8vw,42px); font-weight:900;
          letter-spacing:2px; cursor:pointer; opacity:0.8;
          transition:opacity .2s, color .2s;
        }
        .mobileMenu__link:hover { opacity:1; color:var(--accent2); }
        .mobileMenu__cta {
          margin-top:8px; background:var(--accent); color:#fff; border:none;
          border-radius:40px; padding:14px 32px; font-size:16px; font-family:var(--ff-body);
          font-weight:600; cursor:pointer;
        }

        /* ── Hero ── */
        .hero { position:relative; height:100svh; min-height:600px; overflow:hidden; display:flex; align-items:center; }
        .hero__canvas { position:absolute !important; inset:0; width:100% !important; height:100% !important; }
        .heroText { position:relative; z-index:10; padding-left:clamp(20px,7vw,140px); padding-right:clamp(20px,4vw,40px); max-width:700px; will-change:transform; }
        .heroText__label { font-size:clamp(10px,2vw,12px); letter-spacing:4px; color:var(--accent2); margin-bottom:20px; opacity:0; animation:fadeUp .8s .3s forwards; font-family:var(--ff-body); font-weight:600; }
        .heroText__h1 { font-family:var(--ff-head); font-weight:900; font-size:clamp(38px,8.5vw,108px); line-height:.92; display:flex; flex-direction:column; gap:4px; }
        .heroText__h1 .line { opacity:0; animation:slideInLine .9s cubic-bezier(.22,1,.36,1) forwards; }
        .heroText__h1 .line:nth-child(1){animation-delay:.45s;}
        .heroText__h1 .line:nth-child(2){animation-delay:.6s;}
        .heroText__h1 .line:nth-child(3){animation-delay:.75s;}
        .heroText__h1 em { font-style:normal; background:linear-gradient(95deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 3s linear infinite; background-size:200% auto; }
        @keyframes shimmer{0%{background-position:0% center;}100%{background-position:200% center;}}
        @keyframes slideInLine{from{opacity:0;transform:translateY(60px) skewY(3deg);}to{opacity:1;transform:translateY(0) skewY(0);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        .heroText__sub { margin-top:20px; font-size:clamp(13px,2.5vw,16px); color:var(--muted); opacity:0; animation:fadeUp .8s 1s forwards; font-family:var(--ff-body); font-weight:400; line-height:1.6; }
        .heroText__actions { display:flex; gap:12px; margin-top:28px; flex-wrap:wrap; opacity:0; animation:fadeUp .8s 1.2s forwards; }
        .btn { padding:13px 24px; border-radius:50px; font-size:clamp(12px,2vw,14px); font-family:var(--ff-body); font-weight:600; cursor:pointer; border:none; transition:transform .25s, box-shadow .25s; letter-spacing:.5px; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
        .btn:hover{transform:translateY(-2px);}
        .btn:active{transform:scale(.97);}
        .btn--primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;box-shadow:0 4px 24px rgba(109,73,251,.45);}
        .btn--primary:hover{box-shadow:0 8px 36px rgba(109,73,251,.6);}
        .btn--ghost{background:transparent;color:var(--text);border:1px solid var(--border);}
        .btn--ghost:hover{border-color:var(--accent);}
        .btn--white{background:#fff;color:#08081a;font-weight:700;}
        .btn--white:hover{box-shadow:0 8px 40px rgba(255,255,255,.25);}
        .hero__scroll{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;font-size:10px;letter-spacing:4px;color:var(--muted);opacity:0;animation:fadeUp .8s 1.6s forwards;font-family:var(--ff-body);}
        .scrollLine{width:1px;height:44px;background:linear-gradient(to bottom,transparent,var(--accent));animation:scrollPulse 2s ease-in-out infinite;}
        @keyframes scrollPulse{0%,100%{opacity:.4;transform:scaleY(.7);}50%{opacity:1;transform:scaleY(1);}
        }

        /* ── Ticker ── */
        .ticker{padding:16px 0;background:var(--accent);overflow:hidden;white-space:nowrap;}
        .ticker__track{display:inline-flex;gap:0;will-change:transform;}
        .ticker__item{padding:0 28px;font-family:var(--ff-head);font-size:clamp(10px,2vw,12px);letter-spacing:3px;font-weight:700;}

        /* ── Stats ── */
        .stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
        .statItem{padding:clamp(32px,6vw,52px) 20px;text-align:center;border-right:1px solid var(--border);position:relative;overflow:hidden;}
        .statItem:last-child{border-right:none;}
        .statItem::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at center,rgba(109,73,251,.06) 0%,transparent 70%);opacity:0;transition:opacity .4s;}
        .statItem:hover::before{opacity:1;}
        .statItem__value{font-family:var(--ff-head);font-size:clamp(32px,5vw,64px);font-weight:900;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;}
        .statItem__label{margin-top:8px;font-size:clamp(10px,1.5vw,12px);letter-spacing:2px;color:var(--muted);text-transform:uppercase;font-family:var(--ff-body);font-weight:500;}

        /* ── Services ── */
        .services{padding:clamp(48px,8vw,120px) clamp(16px,5vw,80px);}
        .section__eyebrow{font-size:clamp(10px,2vw,11px);letter-spacing:4px;color:var(--accent2);text-transform:uppercase;margin-bottom:12px;font-family:var(--ff-body);font-weight:600;}
        .section__title{font-family:var(--ff-head);font-size:clamp(28px,5vw,64px);font-weight:900;margin-bottom:40px;line-height:1.05;}
        .section__title em{font-style:normal;background:linear-gradient(95deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .services__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(260px,100%),1fr));gap:16px;}
        .serviceCard{padding:clamp(24px,4vw,36px) clamp(20px,3vw,28px) clamp(20px,3vw,32px);border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);cursor:pointer;position:relative;overflow:hidden;transition:border-color .35s,transform .35s;}
        .serviceCard::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at top left,rgba(109,73,251,.12),transparent 60%);opacity:0;transition:opacity .4s;}
        .serviceCard:hover{border-color:var(--accent);transform:translateY(-4px);}
        .serviceCard:active{transform:scale(.98);}
        .serviceCard:hover::before{opacity:1;}
        .serviceCard__icon{font-size:clamp(24px,4vw,32px);margin-bottom:16px;color:var(--accent2);}
        .serviceCard__title{font-family:var(--ff-head);font-size:clamp(15px,2.5vw,20px);font-weight:900;margin-bottom:10px;}
        .serviceCard__desc{font-size:clamp(13px,1.8vw,14px);color:var(--muted);line-height:1.65;font-family:var(--ff-body);}
        .serviceCard__arrow{position:absolute;bottom:24px;right:24px;font-size:20px;opacity:0;transform:translateX(-8px);transition:opacity .3s,transform .3s;color:var(--accent);}
        .serviceCard:hover .serviceCard__arrow{opacity:1;transform:translateX(0);}

        /* ── Archive ── */
        .archive{padding:clamp(48px,8vw,120px) clamp(16px,5vw,80px);}
        .archive__header{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:40px;}
        .igBadge{display:flex;align-items:center;gap:10px;padding:10px 18px;border-radius:40px;border:1px solid var(--border);background:rgba(255,255,255,.04);font-size:clamp(11px,2vw,13px);color:var(--muted);text-decoration:none;cursor:pointer;transition:border-color .3s,color .3s;white-space:nowrap;}
        .igBadge:hover{border-color:var(--accent);color:var(--text);}
        .archive__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
        .igCard{position:relative;border-radius:10px;overflow:hidden;aspect-ratio:1/1;cursor:pointer;background:#0d0d1e;transform-style:preserve-3d;}
        .igCard__shine{position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.06) 0%,transparent 50%);pointer-events:none;z-index:2;}
        .igCard__img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .55s cubic-bezier(.22,1,.36,1);}
        .igCard:hover .igCard__img{transform:scale(1.08);}
        .igCard__overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(4,4,15,.95) 0%,rgba(79,70,229,.2) 60%,transparent 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(10px,2vw,18px);opacity:0;transition:opacity .35s ease;z-index:3;}
        .igCard__overlay--show{opacity:1;}
        .igCard__tag{font-size:clamp(8px,1.5vw,10px);font-weight:700;letter-spacing:2px;color:var(--accent2);text-transform:uppercase;margin-bottom:3px;font-family:var(--ff-body);}
        .igCard__caption{font-size:clamp(11px,1.8vw,13px);color:rgba(255,255,255,.9);font-weight:500;margin-bottom:5px;font-family:var(--ff-body);}
        .igCard__likes{display:flex;align-items:center;gap:5px;font-size:clamp(10px,1.5vw,11px);color:var(--muted);}

        /* ── CTA Banner ── */
        .ctaBanner{position:relative;overflow:hidden;padding:clamp(64px,10vw,160px) clamp(20px,6vw,80px);text-align:center;background:linear-gradient(135deg,#10003f,#001433,#003333);}
        .ctaBanner__content{position:relative;z-index:2;}
        .ctaBanner__title{font-family:var(--ff-head);font-size:clamp(34px,7vw,88px);font-weight:900;line-height:1.05;margin-bottom:16px;}
        .ctaBanner__title em{font-style:normal;background:linear-gradient(95deg,var(--accent2),var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .ctaBanner__sub{font-size:clamp(13px,2vw,16px);color:var(--muted);margin-bottom:36px;font-family:var(--ff-body);}

        /* ══════════════════════════════════════════════════════════
           FOOTER STYLES
        ═══════════════════════════════════════════════════════════ */
        .ftr-root {
          font-family: var(--ff-fbody);
          background: var(--f-bg);
          color: var(--f-text);
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        .ftr-orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
        .ftr-orb--1 { width:420px;height:420px;background:rgba(124,95,255,.12);top:-80px;right:-60px; }
        .ftr-orb--2 { width:300px;height:300px;background:rgba(0,229,255,.07);bottom:60px;left:-80px; }
        .ftr-divider { width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--f-accent),var(--f-accent2),transparent);opacity:.5; }

        .ftr-top {
          display:grid;
          grid-template-columns:1fr 1.5fr;
          gap:40px;
          padding:clamp(40px,6vw,64px) clamp(16px,6vw,100px) clamp(32px,5vw,48px);
          position:relative;
          z-index:2;
        }

        .ftr-brand__logo { font-family:var(--ff-fhead); font-size:clamp(36px,6vw,72px); letter-spacing:4px; line-height:1; background:linear-gradient(120deg,#fff 30%,var(--f-accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .ftr-brand__tagline { font-size:clamp(10px,2vw,12px); letter-spacing:5px; text-transform:uppercase; color:var(--f-muted); margin-top:8px; font-family:var(--ff-fbody); }
        .ftr-brand__info { margin-top:24px; display:flex; flex-direction:column; gap:10px; font-size:clamp(12px,2vw,14px); color:var(--f-muted); line-height:1.6; font-family:var(--ff-fbody); }
        .ftr-brand__info span { color:var(--f-text); font-weight:500; }
        .ftr-ig { display:inline-flex; align-items:center; gap:8px; margin-top:20px; padding:10px 20px; border-radius:40px; border:1px solid rgba(168,85,247,.4); font-size:13px; color:#c084fc; cursor:pointer; transition:background .3s,border-color .3s,transform .2s; width:fit-content; background:rgba(168,85,247,.06); font-family:var(--ff-fbody); touch-action:manipulation; }
        .ftr-ig:hover { background:rgba(168,85,247,.15); border-color:rgba(168,85,247,.7); transform:translateY(-2px); }
        .ftr-ig__dot { width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#f09433,#bc1888);animation:igPulse 2s ease-in-out infinite;flex-shrink:0; }
        @keyframes igPulse{0%,100%{box-shadow:0 0 0 0 rgba(188,24,136,.4);}50%{box-shadow:0 0 0 6px rgba(188,24,136,0);}}

        .ftr-terminal { background:var(--f-surface); border:1px solid var(--f-border); border-radius:18px; overflow:hidden; box-shadow:0 0 60px rgba(124,95,255,.08); }
        .ftr-terminal__bar { padding:12px 18px; background:rgba(255,255,255,.03); border-bottom:1px solid var(--f-border); display:flex; align-items:center; gap:7px; }
        .ftr-terminal__dot { width:10px;height:10px;border-radius:50%;flex-shrink:0; }
        .ftr-terminal__dot:nth-child(1){background:#ff5f57;}
        .ftr-terminal__dot:nth-child(2){background:#febc2e;}
        .ftr-terminal__dot:nth-child(3){background:#28c840;}
        .ftr-terminal__label { margin-left:8px; font-size:clamp(9px,1.5vw,11px); letter-spacing:3px; color:var(--f-muted); font-family:var(--ff-fbody); }
        .ftr-terminal__body { padding:clamp(16px,3vw,28px); }

        .ftr-steps { display:flex; align-items:center; gap:0; margin-bottom:24px; overflow:hidden; }
        .ftr-step { display:flex; align-items:center; gap:5px; font-size:clamp(9px,1.5vw,11px); letter-spacing:1px; text-transform:uppercase; color:var(--f-muted); transition:color .3s; min-width:0; }
        .ftr-step__label { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ftr-step--active { color:var(--f-text); }
        .ftr-step--done { color:var(--f-accent2); }
        .ftr-step__num { width:22px;height:22px;border-radius:50%;border:1px solid var(--f-border);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;transition:background .3s,border-color .3s; }
        .ftr-step--active .ftr-step__num { background:var(--f-accent); border-color:var(--f-accent); color:#fff; }
        .ftr-step--done .ftr-step__num { background:var(--f-accent2); border-color:var(--f-accent2); color:#000; }
        .ftr-step__line { flex:1; height:1px; background:var(--f-border); margin:0 6px; min-width:6px; }

        .ftr-field { position:relative; }
        .ftr-label { display:block; font-size:clamp(9px,1.5vw,11px); letter-spacing:3px; text-transform:uppercase; color:var(--f-muted); margin-bottom:8px; font-family:var(--ff-fbody); }
        .ftr-input-wrap { position:relative; display:flex; align-items:center; }
        .ftr-input-icon { position:absolute; left:14px; font-size:16px; pointer-events:none; z-index:1; }
        .ftr-input { width:100%; padding:14px 16px 14px 44px; background:rgba(255,255,255,.04); border:1px solid var(--f-border); border-radius:10px; color:var(--f-text); font-family:var(--ff-fbody); font-size:clamp(14px,2.5vw,15px); outline:none; transition:border-color .25s,box-shadow .25s; -webkit-appearance:none; }
        .ftr-input:focus { border-color:var(--f-accent); box-shadow:0 0 0 3px rgba(124,95,255,.18); }
        .ftr-input::placeholder { color:rgba(200,190,255,.25); }

        .ftr-products { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:2px; }
        .ftr-product-btn { padding:clamp(8px,2vw,10px) 6px; border:1px solid var(--f-border); border-radius:10px; background:rgba(255,255,255,.03); color:var(--f-muted); font-family:var(--ff-fbody); font-size:clamp(10px,2vw,12px); cursor:pointer; transition:all .2s; display:flex; flex-direction:column; align-items:center; gap:5px; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
        .ftr-product-btn:hover { border-color:var(--f-accent); color:var(--f-text); background:rgba(124,95,255,.08); }
        .ftr-product-btn:active { transform:scale(.95); }
        .ftr-product-btn--selected { border-color:var(--f-accent); background:rgba(124,95,255,.18); color:#fff; box-shadow:0 0 12px rgba(124,95,255,.3); }
        .ftr-product-btn span:first-child { font-size:clamp(16px,3vw,20px); }

        .ftr-cta-row { display:flex; gap:10px; margin-top:20px; flex-wrap:wrap; }
        .ftr-btn-back { padding:13px 16px; border-radius:10px; border:1px solid var(--f-border); background:transparent; color:var(--f-muted); font-family:var(--ff-fbody); font-size:14px; cursor:pointer; transition:border-color .2s,color .2s; white-space:nowrap; touch-action:manipulation; }
        .ftr-btn-back:hover { border-color:var(--f-accent); color:var(--f-text); }
        .ftr-btn-next { flex:1; min-width:100px; padding:13px; border-radius:10px; border:none; background:linear-gradient(135deg,var(--f-accent),#5438db); color:#fff; font-family:var(--ff-fbody); font-size:clamp(13px,2.5vw,15px); font-weight:600; cursor:pointer; letter-spacing:.5px; transition:transform .2s,box-shadow .2s; box-shadow:0 4px 20px rgba(124,95,255,.35); touch-action:manipulation; }
        .ftr-btn-next:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(124,95,255,.5); }
        .ftr-btn-next:active { transform:scale(.97); }
        .ftr-btn-wa { flex:1; min-width:140px; padding:14px; border-radius:10px; border:none; background:linear-gradient(135deg,#25D366,#128C4A); color:#fff; font-family:var(--ff-fbody); font-size:clamp(13px,2.5vw,15px); font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:transform .2s,box-shadow .2s; box-shadow:0 4px 20px rgba(37,211,102,.25); touch-action:manipulation; }
        .ftr-btn-wa:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(37,211,102,.4); }
        .ftr-btn-wa:active { transform:scale(.97); }
        .ftr-btn-wa:disabled { opacity:.7; cursor:wait; }
        @keyframes spin{to{transform:rotate(360deg);}}
        .ftr-spinner { width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite; }

        .ftr-success { text-align:center; padding:24px 0; animation:popIn .5s cubic-bezier(.22,1,.36,1); }
        @keyframes popIn{from{opacity:0;transform:scale(.88);}to{opacity:1;transform:scale(1);}}
        .ftr-success__icon { font-size:48px; margin-bottom:14px; }
        .ftr-success__title { font-family:var(--ff-fhead); font-size:clamp(20px,4vw,28px); letter-spacing:3px; background:linear-gradient(90deg,var(--f-green),var(--f-accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:8px; }
        .ftr-success__sub { font-size:clamp(12px,2vw,13px); color:var(--f-muted); margin-bottom:20px; font-family:var(--ff-fbody); }
        .ftr-btn-reset { padding:10px 24px; border-radius:30px; border:1px solid var(--f-border); background:transparent; color:var(--f-muted); font-family:var(--ff-fbody); font-size:13px; cursor:pointer; transition:border-color .2s,color .2s; }
        .ftr-btn-reset:hover { border-color:var(--f-accent); color:var(--f-text); }

        .ftr-bottom { position:relative; z-index:2; padding:20px clamp(16px,6vw,100px); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; border-top:1px solid var(--f-border); font-size:clamp(11px,1.8vw,12px); color:var(--f-muted); font-family:var(--ff-fbody); }
        .ftr-bottom__pulse { display:flex; align-items:center; gap:6px; }
        .ftr-live-dot { width:7px;height:7px;border-radius:50%;background:#28c840;animation:livePulse 2s infinite;flex-shrink:0; }
        @keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(40,200,64,.5);}50%{box-shadow:0 0 0 5px rgba(40,200,64,0);}}
        .ftr-bottom__links { display:flex; gap:16px; flex-wrap:wrap; }
        .ftr-footLink { cursor:pointer; opacity:.5; transition:opacity .2s; font-size:12px; }
        .ftr-footLink:hover { opacity:1; }

        @keyframes ftr-shake{0%,100%{transform:translateX(0);}20%{transform:translateX(-6px);}40%{transform:translateX(6px);}60%{transform:translateX(-4px);}80%{transform:translateX(4px);}}
        .ftr-shake { animation:ftr-shake .45s ease; }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:var(--bg);}
        ::-webkit-scrollbar-thumb{background:var(--accent);border-radius:2px;}

        /* ════════════════════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ════════════════════════════════════════════════ */

        /* ── Tablet: 960px ── */
        @media(max-width:960px){
          .ftr-top { grid-template-columns:1fr; gap:32px; }
          .archive__grid { grid-template-columns:repeat(3,1fr); }
        }

        /* ── Large Mobile: 768px ── */
        @media(max-width:768px){
          .desktop-only { display:none !important; }
          .mobile-only  { display:flex !important; }
          .navbar__hamburger { display:flex; }
          .navbar__links { display:none; }
          .heroText { padding-left:20px; padding-right:20px; }
          .stats { grid-template-columns:repeat(2,1fr); }
          .statItem:nth-child(2){ border-right:none; }
          .archive__grid { grid-template-columns:repeat(2,1fr); gap:8px; }
          .igBadge { font-size:12px; padding:8px 14px; }
        }

        
        /* ── Small Mobile: 480px ── */
        @media(max-width:480px){
          .navbar { top:10px; padding:10px 16px; }
          .navbar__logo { font-size:11px; letter-spacing:2px; }
          .heroText__h1 { font-size:clamp(32px,10vw,48px); }
          .heroText__actions { flex-direction:column; align-items:flex-start; }
          .btn { width:100%; text-align:center; justify-content:center; display:block; }
           .heroText__actions btn{width:50%;}
          .stats { grid-template-columns:repeat(2,1fr); }
          .statItem { border-right:1px solid var(--border); padding:28px 12px; }
          .statItem:nth-child(2n){ border-right:none; }
          .statItem:nth-child(n+3){ border-top:1px solid var(--border); }
          .services { padding:40px 16px; }
          .archive { padding:40px 16px; }
          .archive__header { flex-direction:column; align-items:flex-start; gap:12px; }
          .archive__grid { grid-template-columns:repeat(2,1fr); gap:6px; }
          .ctaBanner { padding:56px 16px; }
          .ftr-top { padding:32px 16px 24px; gap:24px; }
          .ftr-terminal__body { padding:16px; }
          .ftr-products { grid-template-columns:repeat(3,1fr); gap:6px; }
          .ftr-cta-row { flex-direction:column; }
          .ftr-btn-back { width:100%; text-align:center; }
          .ftr-btn-next, .ftr-btn-wa { width:100%; }
          .ftr-bottom { flex-direction:column; align-items:flex-start; padding:16px; gap:10px; }
          .ftr-bottom__links { gap:14px; }
          .hero__scroll { display:none; }
          .mobileMenu__link { font-size:clamp(24px,9vw,38px); }
        }

        /* ── Extra Small: 360px ── */
        @media(max-width:360px){
          .archive__grid { grid-template-columns:1fr 1fr; }
          .ftr-products { grid-template-columns:repeat(3,1fr); }
          .heroText__h1 { font-size:28px; }
          .ftr-steps .ftr-step__label { display:none; }
        }
      `}</style>
    </div>
  );
}
