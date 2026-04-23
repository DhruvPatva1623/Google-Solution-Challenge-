import { useState, useEffect, useRef } from 'react'

function App() {
  const [theme, setTheme] = useState('dark') // Defaulting to dark for maximum aesthetic impact
  const cursorRef = useRef(null)
  const blobRef = useRef(null)

  // System Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Mouse interactivity (Trail, Blob, and Card Hover variables)
  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let blobX = mouseX;
    let blobY = mouseY;
    
    let isMoving = true;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update CSS variables for 3D Cards Radial Glow
      document.querySelectorAll('.card-3d').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animateLoop = () => {
      cursorX += (mouseX - cursorX) * 0.3; // Snappy
      cursorY += (mouseY - cursorY) * 0.3;
      
      blobX += (mouseX - blobX) * 0.04;   // Lazy and flowing
      blobY += (mouseY - blobY) * 0.04;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX - 7}px, ${cursorY - 7}px)`
      }
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(${blobX}px, ${blobY}px)`
      }

      if (isMoving) requestAnimationFrame(animateLoop)
    }
    animateLoop()

    return () => {
      isMoving = false;
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Interactive Cursor Artifacts */}
      <div className="cursor-trail" ref={cursorRef}></div>
      <div className="cursor-blob" ref={blobRef}></div>

      {/* Supreme Dynamic Backgrounds */}
      <div className="cosmic-layer"></div>
      <div className="particles"></div>
      
      {/* Ambient Pulsing Orbs */}
      <div className="aurora-blur" style={{top: '10%', left: '20%', width: '500px', height: '500px', background: 'var(--accent-highlight)'}}></div>
      <div className="aurora-blur" style={{bottom: '0%', right: '10%', width: '600px', height: '600px', background: 'var(--primary-500)', animationDelay: '-4s'}}></div>
      <div className="aurora-blur" style={{top: '40%', left: '60%', width: '400px', height: '400px', background: 'var(--accent-pink)', animationDelay: '-8s'}}></div>

      {/* SVG Flow Lines */}
      <svg className="bg-svg" preserveAspectRatio="none">
        <path d="M-100,500 Q400,100 900,600 T2000,300" className="path-line" />
        <path d="M-100,200 Q300,700 1000,100 T2000,500" className="path-line" style={{animationDuration: '12s', stroke: 'var(--accent-pink)'}} />
      </svg>

      {/* Navbar Structure */}
      <header className="navbar glass-panel">
        <div className="navbar-content">
          <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
            <span style={{fontSize: '1.8rem'}}>🌍</span>
            <span style={{fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.5px'}}>
              CommunityConnect
            </span>
          </div>
          <nav style={{display: 'flex', gap: '2rem'}}>
            <a href="#features" style={{textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600}}>Platform</a>
            <a href="#impact" style={{textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600}}>Impact</a>
          </nav>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} style={{background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer'}}>
              {theme === 'dark' ? '🌑' : '☀️'}
            </button>
            <button className="btn-magic">Access Portal</button>
          </div>
        </div>
      </header>

      <main style={{position: 'relative', paddingTop: '160px', paddingBottom: '100px'}}>
        
        {/* Supreme Hero Section */}
        <section style={{minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem'}}>
          
          <div className="animate-float-fast" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem 1.2rem', borderRadius: '100px', border: '1px solid var(--border-light)', marginBottom: '2rem', fontWeight: 600, color: 'var(--text-secondary)'}}>
            <span style={{color: 'var(--accent-pink)'}}>●</span> AI Engine Engine V2 Now Live
          </div>

          <h1 className="hero-title reveal active">
            Digital Empathy Through <br/>
            <span className="text-gradient">Intelligent Action</span>
          </h1>
          
          <p className="hero-subtitle reveal active" style={{transitionDelay: '0.1s'}}>
            Unifying resources, matching verified volunteers globally, and distributing critical aid with machine-learning accuracy.
          </p>

          <div className="reveal active" style={{transitionDelay: '0.2s', display: 'flex', gap: '1.5rem', marginTop: '2rem'}}>
            <button className="btn-magic" style={{padding: '1rem 2.5rem', fontSize: '1.1rem'}}>Deploy Solution Now</button>
          </div>

          {/* Floating UI Elements Around Hero */}
          <div className="glass-panel animate-float-slow" style={{position: 'absolute', top: '20%', left: '10%', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{width: 40, height: 40, background: 'var(--accent-highlight)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'white', fontWeight: 'bold'}}>94%</div>
            <div style={{textAlign: 'left'}}>
              <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Matching Accuracy</div>
              <div style={{fontWeight: 700}}>Algorithm V2</div>
            </div>
          </div>

          <div className="glass-panel animate-float-fast" style={{position: 'absolute', bottom: '20%', right: '10%', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', animationDelay: '1s'}}>
            <div style={{width: 40, height: 40, background: 'var(--primary-500)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'white', fontSize: '1.5rem'}}>⚡</div>
            <div style={{textAlign: 'left'}}>
              <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Response Network</div>
              <div style={{fontWeight: 700}}>30s Average Action</div>
            </div>
          </div>

        </section>

        {/* Dynamic 3D Bento Layout */}
        <section id="features" style={{marginTop: '100px'}}>
          <div style={{textAlign: 'center', margin: '0 auto 60px'}}>
            <h2 className="reveal" style={{fontSize: '3rem', marginBottom: '1rem'}}>Intelligent Ecosystem</h2>
            <p className="reveal" style={{color: 'var(--text-secondary)'}}>Powered by cutting-edge heuristics and empathy-driven UX.</p>
          </div>

          <div className="bento-grid">
            <div className="card-3d glass-panel reveal" style={{gridColumn: 'span 2', gridRow: 'span 2', display: 'flex', flexDirection: 'column'}}>
              <div className="card-content" style={{flex: 1}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔮</div>
                <h3 style={{fontSize: '2rem', marginBottom: '1rem'}}>Predictive Needs Graph</h3>
                <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '80%'}}>
                  Leveraging historical climatic anomalies and socioeconomic shifts, the Vertex AI engine scales anticipated supply shortages before they impact marginalized communities.
                </p>
                <div style={{marginTop: 'auto', paddingTop: '2rem'}}>
                  <div style={{height: 150, width: '100%', background: 'linear-gradient(0deg, var(--border-light) 1px, transparent 1px) 0 0 / 100% 30px', position: 'relative'}}>
                     {/* Mock graph line */}
                     <svg width="100%" height="100%" preserveAspectRatio="none"><path d="M0,150 L100,100 L200,120 L300,50 L400,60 L500,20" fill="none" stroke="var(--primary-500)" strokeWidth="4" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-3d glass-panel reveal">
              <div className="card-content">
                <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🛰️</div>
                <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Offline Resilience</h3>
                <p style={{color: 'var(--text-secondary)'}}>PWA architecture and SMS bridges allow coordination where signals fall.</p>
              </div>
            </div>

            <div className="card-3d glass-panel reveal" style={{background: 'linear-gradient(135deg, var(--bg-elevated) 0%, rgba(236,72,153,0.1) 100%)'}}>
              <div className="card-content">
                <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🌍</div>
                <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Multilingual Voice</h3>
                <p style={{color: 'var(--text-secondary)'}}>Real-time Dialogflow parsing across 15+ complex regional dialects bridging technological divide.</p>
              </div>
            </div>
            
            <div className="card-3d glass-panel reveal" style={{gridColumn: 'span 3'}}>
               <div className="card-content" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                 <div>
                    <h3 style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>Polygon Blockchain Verification</h3>
                    <p style={{color: 'var(--text-secondary)', maxWidth: '600px'}}>Immutable ledger tracing every penny of donation down directly to the beneficiary's wallet interface, creating untouchable transparency.</p>
                 </div>
                 <button className="btn-magic">View L2 Contracts</button>
               </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}

export default App
