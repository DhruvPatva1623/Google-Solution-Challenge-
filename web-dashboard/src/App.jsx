import { useState, useEffect, useRef } from 'react'
import { AlertCircle, Mic, Heart, Compass, Award, User, Share2, MapPin, CheckCircle, ShieldCheck, Activity, Star, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/* ─── Animated Counter Hook ─── */
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let startTime = null;
        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return [count, ref];
}

/* ─── Toast Component ─── */
function Toast({ message, type = 'success', onClose }) {
  const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f97316' };
  const icons = { success: <CheckCircle size={20}/>, error: <AlertCircle size={20}/>, info: <ShieldCheck size={20}/>, warning: <AlertCircle size={20}/> };
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{opacity:0,y:50,scale:0.8}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:50,scale:0.8}}
      style={{position:'fixed',bottom:'30px',left:'50%',transform:'translateX(-50%)',zIndex:99999,background:colors[type],color:'white',padding:'0.8rem 1.5rem',borderRadius:'14px',display:'flex',alignItems:'center',gap:'0.8rem',boxShadow:`0 8px 30px ${colors[type]}66`,fontWeight:600,maxWidth:'90vw'}}>
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} style={{background:'transparent',border:'none',color:'white',cursor:'pointer',marginLeft:'0.5rem'}}><X size={16}/></button>
    </motion.div>
  );
}

function App() {
  const [theme, setTheme] = useState('dark')
  const cursorRef = useRef(null)
  const blobRef = useRef(null)
  const [sosActive, setSosActive] = useState(false)
  const [voiceActive, setVoiceActive] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [toasts, setToasts] = useState([])
  const [acceptedTasks, setAcceptedTasks] = useState({})
  const [showPortalModal, setShowPortalModal] = useState(false)
  const [showSchemeResult, setShowSchemeResult] = useState(false)

  // Animated counters
  const [livesCount, livesRef] = useCounter(50389, 2500);
  const [volCount, volRef] = useCounter(10245, 2000);
  const [taskCount, taskRef] = useCounter(8742, 2200);
  const [ngoCount, ngoRef] = useCounter(127, 1500);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleSos = () => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setSosActive(true);
    addToast('🚨 SOS signal broadcast to 32 nearby volunteers!', 'error');
    setTimeout(() => setSosActive(false), 5000);
  }

  const handleVoiceMsg = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    if (!voiceActive) {
      setVoiceActive(true);
      setVoiceText('Listening...');
      addToast('🎤 Voice interface activated — speak in Hindi or English', 'info');
      // Use Web Speech API if available
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setVoiceText(transcript);
        };
        recognition.onend = () => {
          setVoiceActive(false);
          if (voiceText && voiceText !== 'Listening...') {
            addToast(`Voice captured: "${voiceText}"`, 'success');
          }
        };
        recognition.onerror = () => {
          setVoiceActive(false);
          setVoiceText('');
          addToast('Voice recognition ended.', 'info');
        };
        recognition.start();
      } else {
        setTimeout(() => {
          setVoiceText('मुझे आज का काम दिखाओ');
          addToast('Simulated: "Show me today\'s tasks" — navigating to tasks', 'success');
          setTimeout(() => { setVoiceActive(false); setVoiceText(''); }, 2000);
        }, 2000);
      }
    } else {
      setVoiceActive(false);
      setVoiceText('');
    }
  }

  const handleAcceptMission = (taskTitle, index) => {
    if (navigator.vibrate) navigator.vibrate(50);
    setAcceptedTasks(prev => ({...prev, [index]: true}));
    addToast(`✅ Mission accepted: "${taskTitle}" — GPS routing started`, 'success');
  }

  const handleARNav = (taskTitle) => {
    if (navigator.vibrate) navigator.vibrate(50);
    addToast(`🧭 AR Navigation launching for: "${taskTitle}"`, 'info');
  }

  const handleAccessPortal = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    setShowPortalModal(true);
  }

  const handleScanScheme = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    setShowSchemeResult(true);
    addToast('🔍 Scanning beneficiary profile against 47 government schemes...', 'info');
    setTimeout(() => addToast('✅ 3 eligible schemes found! PM-KISAN, Ayushman Bharat, MGNREGA', 'success'), 2500);
  }

  const handleDeploySolution = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
    addToast('🚀 Scrolling to the Impact hub — find your first mission!', 'info');
  }

  const handleShareImpact = () => {
    if (navigator.share) {
      navigator.share({ title: 'CommunityConnect', text: 'I just helped 120 people on CommunityConnect!', url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast('📋 Impact link copied to clipboard!', 'success');
    }
  }

  // System Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Smooth scroll for nav links
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }, [])

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
      cursorX += (mouseX - cursorX) * 0.3;
      cursorY += (mouseY - cursorY) * 0.3;
      blobX += (mouseX - blobX) * 0.04;
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

  const impactData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Direct Beneficiaries Helped',
      data: [1200, 3100, 2800, 5020],
      borderColor: '#ec4899',
      backgroundColor: 'transparent',
      tension: 0.4,
      borderWidth: 3,
      pointBackgroundColor: '#ec4899',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5
    }]
  };

  const tasks = [
    { title: 'Emergency Medical Supply Drop', dist: '1.2 km', score: 98, type: 'CRITICAL', color: '#ef4444', skills: ['First Aid', 'Driving'] },
    { title: 'Elderly Food Assistance', dist: '3.4 km', score: 85, type: 'URGENT', color: '#f97316', skills: ['Cooking', 'Transport'] },
    { title: 'Local School Renovation Aid', dist: '5.0 km', score: 76, type: 'ROUTINE', color: '#10b981', skills: ['Painting', 'Carpentry'] }
  ];

  const leaderboard = [
    { name: 'Priya Sharma', city: 'Mumbai', pts: 4820, badge: '🥇' },
    { name: 'Rahul Verma', city: 'Delhi', pts: 3950, badge: '🥈' },
    { name: 'Ananya Iyer', city: 'Bangalore', pts: 3100, badge: '🥉' },
    { name: 'Dhruv Patva', city: 'Ahmedabad', pts: 1450, badge: '4' },
    { name: 'Kamal Singh', city: 'Jaipur', pts: 1200, badge: '5' },
  ];

  const testimonials = [
    { name: 'Meera Deshpande', role: 'Beneficiary', text: 'CommunityConnect helped me receive medical supplies within 15 minutes during an emergency. The volunteer was guided right to my doorstep.', rating: 5 },
    { name: 'Akshaya Patra NGO', role: 'Partner NGO', text: 'We mobilized 500 volunteers in 24 hours during the Gujarat floods. 3x faster volunteer coordination than any other platform.', rating: 5 },
    { name: 'Ravi Kumar', role: 'Volunteer', text: 'The gamification keeps me motivated. I have completed 120 hours and earned my blockchain certificate. It feels amazing to give back.', rating: 5 },
  ];

  const govtSchemes = [
    { name: 'PM-KISAN', benefit: '₹6,000/year', eligible: true, desc: 'Direct income support for farming families' },
    { name: 'Ayushman Bharat', benefit: '₹5 Lakh/year', eligible: true, desc: 'Health insurance for below-poverty families' },
    { name: 'MGNREGA', benefit: '100 days work', eligible: true, desc: 'Guaranteed rural employment scheme' },
    { name: 'PM Awas Yojana', benefit: 'Housing subsidy', eligible: false, desc: 'Affordable housing for urban poor' },
  ];

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
            <a href="#stories" style={{textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600}}>Stories</a>
          </nav>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} style={{background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer'}} aria-label="Toggle theme">
              {theme === 'dark' ? '🌑' : '☀️'}
            </button>
            <button onClick={handleSos} className="sos-btn" aria-label="Emergency SOS">
              <AlertCircle size={20} /> SOS
            </button>
            <button className="btn-magic" onClick={handleAccessPortal}>Access Portal</button>
          </div>
        </div>
      </header>

      {/* ─── Portal Modal ─── */}
      <AnimatePresence>
        {showPortalModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowPortalModal(false)}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)',zIndex:10000,display:'grid',placeItems:'center'}}>
            <motion.div initial={{scale:0.8,y:40}} animate={{scale:1,y:0}} exit={{scale:0.8,y:40}} onClick={e => e.stopPropagation()}
              className="glass-panel" style={{padding:'2.5rem',borderRadius:'24px',maxWidth:'460px',width:'90%',textAlign:'center'}}>
              <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔐</div>
              <h2 style={{fontSize:'1.8rem',marginBottom:'0.5rem'}}>Volunteer Portal</h2>
              <p style={{color:'var(--text-secondary)',marginBottom:'2rem'}}>Sign in to access your dashboard, accept missions, and track your impact.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                <button onClick={() => {setShowPortalModal(false); addToast('✅ Signed in with Google successfully!','success')}} style={{padding:'1rem',borderRadius:'12px',border:'1px solid var(--border-light)',background:'var(--bg-secondary)',color:'var(--text-primary)',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',fontSize:'1rem'}}>
                  <span style={{fontSize:'1.3rem'}}>G</span> Continue with Google
                </button>
                <button onClick={() => {setShowPortalModal(false); addToast('✅ Signed in with GitHub successfully!','success')}} style={{padding:'1rem',borderRadius:'12px',border:'1px solid var(--border-light)',background:'var(--bg-secondary)',color:'var(--text-primary)',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',fontSize:'1rem'}}>
                  <span style={{fontSize:'1.3rem'}}>💻</span> Continue with GitHub
                </button>
              </div>
              <button onClick={() => setShowPortalModal(false)} style={{marginTop:'1.5rem',background:'transparent',border:'none',color:'var(--text-secondary)',cursor:'pointer',fontWeight:600}}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main style={{position: 'relative', paddingTop: '160px', paddingBottom: '100px'}}>
        
        {/* Supreme Hero Section */}
        <section style={{minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem'}}>
          
          <div className="animate-float-fast" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem 1.2rem', borderRadius: '100px', border: '1px solid var(--border-light)', marginBottom: '2rem', fontWeight: 600, color: 'var(--text-secondary)'}}>
            <span style={{color: 'var(--accent-pink)'}}>●</span> AI Matching Engine V2 Now Live
          </div>

          <h1 className="hero-title reveal active">
            Turn Compassion Into <br/>
            <span className="text-gradient">Intelligent Action</span>
          </h1>
          
          <p className="hero-subtitle reveal active" style={{transitionDelay: '0.1s'}}>
            AI-powered platform matching 10,000+ volunteers with urgent social causes. Your next hour could change a life.
          </p>

          <div className="reveal active" style={{transitionDelay: '0.2s', display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center'}}>
            <button className="btn-magic" style={{padding: '1rem 2.5rem', fontSize: '1.1rem'}} onClick={handleDeploySolution}>Find Your First Mission</button>
            <button onClick={handleShareImpact} style={{padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '99px', border: '1px solid var(--border-light)', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Share2 size={18}/> Share Impact
            </button>
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

        {/* ─── Live Animated Counters ─── */}
        <section className="reveal" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 2rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1.5rem',textAlign:'center'}}>
            {[
              { ref: livesRef, val: livesCount, label: 'Lives Impacted', suffix: '+', icon: '❤️' },
              { ref: volRef, val: volCount, label: 'Active Volunteers', suffix: '+', icon: '🙋' },
              { ref: taskRef, val: taskCount, label: 'Tasks Completed', suffix: '+', icon: '✅' },
              { ref: ngoRef, val: ngoCount, label: 'NGO Partners', suffix: '+', icon: '🤝' },
            ].map((m,i) => (
              <div key={i} ref={m.ref} className="glass-panel" style={{padding:'2rem 1rem',borderRadius:'20px'}}>
                <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>{m.icon}</div>
                <div style={{fontSize:'2.5rem',fontWeight:800,fontFamily:'var(--font-display)'}}>{m.val.toLocaleString()}{m.suffix}</div>
                <div style={{color:'var(--text-secondary)',fontWeight:600,marginTop:'0.3rem'}}>{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Floating Actions */}
        <AnimatePresence>
          {sosActive && (
            <motion.div initial={{opacity: 0, y: -50, scale: 0.8}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, scale: 0.8}} 
              style={{position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: 'rgba(239, 68, 68, 0.95)', color: 'white', padding: '1rem 2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 30px rgba(239,68,68,0.5)', border: '1px solid #ef4444'}}>
              <AlertCircle size={24} />
              <div>
                <strong style={{display: 'block'}}>🚨 SOS Dispatched!</strong>
                <span style={{fontSize: '0.9rem'}}>32 volunteers alerted within 5km · Est. response: 4 min</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice FAB with active text */}
        <div style={{position:'fixed',bottom:'100px',right:'30px',zIndex:1000,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'0.5rem'}}>
          <AnimatePresence>
            {voiceActive && voiceText && (
              <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}
                className="glass-panel" style={{padding:'0.6rem 1rem',borderRadius:'12px',fontSize:'0.85rem',fontWeight:600,maxWidth:'250px'}}>
                🎤 {voiceText}
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={handleVoiceMsg} aria-label="Voice interface toggle" style={{width: 65, height: 65, borderRadius: '50%', background: voiceActive ? 'var(--accent-pink)' : 'var(--glass-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', display: 'grid', placeItems: 'center', color: voiceActive ? 'white' : 'var(--text-primary)', boxShadow: voiceActive ? '0 0 30px var(--accent-pink)' : 'var(--glass-shadow)', transition: 'all 0.3s', cursor: 'pointer'}}>
            <Mic size={30} />
          </button>
        </div>

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
                     <svg width="100%" height="100%" preserveAspectRatio="none"><path d="M0,150 L100,100 L200,120 L300,50 L400,60 L500,20" fill="none" stroke="var(--primary-500)" strokeWidth="4" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-3d glass-panel reveal">
              <div className="card-content">
                <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🏆</div>
                <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Gamified Growth</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: '1rem'}}>Rank up by aiding your community. Unlock exclusive blockchain badges.</p>
                <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-light)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                    <span style={{fontWeight: 700}}>Level 4: Hero</span>
                    <span style={{color: 'var(--primary-500)', fontWeight: 700}}>1450 pts</span>
                  </div>
                  <div style={{width: '100%', height: '8px', background: 'var(--border-light)', borderRadius: '99px', overflow: 'hidden'}}>
                    <div style={{width: '72%', height: '100%', background: 'linear-gradient(90deg, var(--accent-highlight), var(--accent-pink))'}}></div>
                  </div>
                </div>
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
               <div className="card-content" style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem'}}>
                 <div style={{flex: '1 1 500px'}}>
                    <h3 style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>Polygon Blockchain Identity</h3>
                    <p style={{color: 'var(--text-secondary)'}}>Your verified volunteer hours are securely minted as non-fungible certificates on the Polygon L2 network, preventing fraud and providing lifelong, transportable accreditation.</p>
                 </div>
                 <div style={{background: 'var(--bg-primary)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Award size={40} color="var(--primary-500)" />
                    <div>
                      <div style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Verified NFT Minted</div>
                      <div style={{fontWeight: 800, fontSize: '1.2rem'}}>120h Community Service</div>
                      <div style={{fontSize: '0.7rem', color: 'var(--accent-highlight)', fontFamily: 'monospace'}}>0x7f3a...b92e</div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* ─── Live Task Hub & Impact ─── */}
        <section id="impact" style={{marginTop: '100px'}}>
          <div style={{textAlign: 'center', margin: '0 auto 60px'}}>
            <h2 className="reveal" style={{fontSize: '3rem', marginBottom: '1rem'}}>Live Needs & Social Impact</h2>
            <p className="reveal" style={{color: 'var(--text-secondary)'}}>Real-time matching powered by TensorFlow.js and geospatial ML models.</p>
          </div>
          
          <div className="bento-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
            {/* Live Task Feed Panel */}
            <div className="card-3d glass-panel reveal" style={{display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem'}}>
              <h3 style={{fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                 <Activity color="var(--primary-500)"/> Active Action Requests
              </h3>
              
              {tasks.map((task, i) => (
                <div key={i} style={{background: 'var(--bg-secondary)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: acceptedTasks[i] ? 0.6 : 1, transition: 'opacity 0.3s'}}>
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <span style={{background: `${task.color}22`, color: task.color, padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700}}>{task.type}</span>
                     <span style={{color: 'var(--accent-highlight)', fontWeight: 800, fontSize: '0.9rem'}}>{task.score}% ML Match</span>
                   </div>
                   <h4 style={{fontSize: '1.2rem'}}>{task.title}</h4>
                   <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                     <MapPin size={14}/> {task.dist} away · Skills: {task.skills.join(', ')}
                   </p>
                   <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                     <button 
                       onClick={() => handleAcceptMission(task.title, i)} 
                       disabled={acceptedTasks[i]}
                       style={{flex: 1, padding: '0.5rem', border: 'none', background: acceptedTasks[i] ? '#10b981' : 'var(--primary-500)', color: 'white', borderRadius: '8px', fontWeight: 600, cursor: acceptedTasks[i] ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'}}>
                       {acceptedTasks[i] ? <><CheckCircle size={16}/> Accepted</> : 'Accept Mission'}
                     </button>
                     <button onClick={() => handleARNav(task.title)} style={{padding: '0.5rem 1rem', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer'}} title="Launch AR Navigation"><Compass size={18}/></button>
                   </div>
                </div>
              ))}
            </div>

            {/* Metrics & Government Subsidies */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
               <div className="card-3d glass-panel reveal" style={{padding: '2rem'}}>
                 <h3 style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>Community Impact Trajectory</h3>
                 <div style={{height: '250px'}}>
                   <Line data={impactData} options={{maintainAspectRatio: false, scales: {y: {beginAtZero: true}}, plugins: {legend: {display: false}}}} />
                 </div>
               </div>
               
               <div className="card-3d glass-panel reveal" style={{background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))'}}>
                  <div className="card-content">
                    <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🏛️</div>
                    <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Govt Scheme Eligibility AI</h3>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '1rem'}}>Our system automatically cross-references beneficiary needs with Direct Benefit Transfer (DBT) and Digital India portals.</p>
                    
                    <button onClick={handleScanScheme} style={{width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #3b82f6', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: showSchemeResult ? '1rem' : 0}}>
                      <ShieldCheck size={18}/> Scan Beneficiary Profile
                    </button>

                    <AnimatePresence>
                      {showSchemeResult && (
                        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden'}}>
                          <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                            {govtSchemes.map((s,i) => (
                              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.6rem 1rem',borderRadius:'10px',border:'1px solid var(--border-light)',background:'var(--bg-secondary)'}}>
                                <div>
                                  <div style={{fontWeight:700,fontSize:'0.95rem'}}>{s.name}</div>
                                  <div style={{fontSize:'0.75rem',color:'var(--text-secondary)'}}>{s.desc}</div>
                                </div>
                                <div style={{textAlign:'right'}}>
                                  <div style={{fontWeight:700,color:s.eligible ? '#10b981' : 'var(--text-secondary)',fontSize:'0.85rem'}}>{s.benefit}</div>
                                  <div style={{fontSize:'0.7rem',color:s.eligible?'#10b981':'#ef4444'}}>{s.eligible?'✅ Eligible':'❌ Not eligible'}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               </div>
            </div>

          </div>
        </section>

        {/* ─── Leaderboard ─── */}
        <section style={{marginTop:'100px',maxWidth:'1200px',margin:'100px auto 0',padding:'0 2rem'}}>
          <div style={{textAlign:'center',marginBottom:'60px'}}>
            <h2 className="reveal" style={{fontSize:'3rem',marginBottom:'1rem'}}>Volunteer Leaderboard</h2>
            <p className="reveal" style={{color:'var(--text-secondary)'}}>Top contributors making the most impact this month.</p>
          </div>
          <div className="card-3d glass-panel reveal" style={{borderRadius:'24px',overflow:'hidden'}}>
            {leaderboard.map((v,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 2rem',borderBottom:i<leaderboard.length-1?'1px solid var(--border-light)':'none',background:i===3?'rgba(249,115,22,0.06)':'transparent'}}>
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <span style={{fontSize:i<3?'1.8rem':'1.2rem',width:'40px',textAlign:'center',fontWeight:800,color:i>=3?'var(--text-secondary)':'inherit'}}>{v.badge}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:'1.05rem'}}>{v.name} {i===3 && <span style={{background:'var(--primary-500)',color:'white',padding:'0.1rem 0.5rem',borderRadius:'6px',fontSize:'0.7rem',marginLeft:'0.5rem'}}>YOU</span>}</div>
                    <div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>{v.city}</div>
                  </div>
                </div>
                <div style={{fontWeight:800,fontSize:'1.1rem',color:'var(--primary-500)'}}>{v.pts.toLocaleString()} pts</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Testimonials / Success Stories ─── */}
        <section id="stories" style={{marginTop:'100px',maxWidth:'1200px',margin:'100px auto 0',padding:'0 2rem'}}>
          <div style={{textAlign:'center',marginBottom:'60px'}}>
            <h2 className="reveal" style={{fontSize:'3rem',marginBottom:'1rem'}}>Success Stories</h2>
            <p className="reveal" style={{color:'var(--text-secondary)'}}>Real voices from the communities we serve.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'2rem'}}>
            {testimonials.map((t,i) => (
              <motion.div key={i} whileHover={{y:-5}} className="card-3d glass-panel reveal" style={{padding:'2rem',borderRadius:'24px',display:'flex',flexDirection:'column'}}>
                <div style={{display:'flex',gap:'0.3rem',marginBottom:'1rem'}}>
                  {Array.from({length:t.rating}).map((_,j) => <Star key={j} size={18} fill="#f97316" color="#f97316"/>)}
                </div>
                <p style={{color:'var(--text-secondary)',fontStyle:'italic',flex:1,lineHeight:1.7,marginBottom:'1.5rem'}}>"{t.text}"</p>
                <div style={{borderTop:'1px solid var(--border-light)',paddingTop:'1rem'}}>
                  <div style={{fontWeight:700}}>{t.name}</div>
                  <div style={{fontSize:'0.85rem',color:'var(--text-secondary)'}}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* ─── Footer ─── */}
      <footer style={{position:'relative',marginTop:'100px',borderTop:'1px solid var(--border-light)',padding:'4rem 2rem 2rem'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'3rem'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
              <span style={{fontSize:'1.5rem'}}>🌍</span>
              <span style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.2rem'}}>CommunityConnect</span>
            </div>
            <p style={{color:'var(--text-secondary)',maxWidth:'300px',lineHeight:1.7}}>AI-powered volunteer coordination platform built for Google Solution Challenge 2026. Making social impact measurable, transparent, and accessible to all.</p>
          </div>
          <div>
            <h4 style={{marginBottom:'1rem',fontWeight:700}}>Platform</h4>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
              <a href="#features" style={{color:'var(--text-secondary)',textDecoration:'none'}}>Features</a>
              <a href="#impact" style={{color:'var(--text-secondary)',textDecoration:'none'}}>Impact Hub</a>
              <a href="#stories" style={{color:'var(--text-secondary)',textDecoration:'none'}}>Success Stories</a>
            </div>
          </div>
          <div>
            <h4 style={{marginBottom:'1rem',fontWeight:700}}>Technology</h4>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',color:'var(--text-secondary)'}}>
              <span>TensorFlow.js</span>
              <span>Polygon L2</span>
              <span>Firebase</span>
              <span>Web Speech API</span>
            </div>
          </div>
          <div>
            <h4 style={{marginBottom:'1rem',fontWeight:700}}>UN SDGs</h4>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',color:'var(--text-secondary)'}}>
              <span>🎯 No Poverty</span>
              <span>🍽️ Zero Hunger</span>
              <span>❤️ Good Health</span>
              <span>📚 Quality Education</span>
            </div>
          </div>
        </div>
        <div style={{maxWidth:'1200px',margin:'3rem auto 0',borderTop:'1px solid var(--border-light)',paddingTop:'2rem',display:'flex',justifyContent:'space-between',alignItems:'center',color:'var(--text-secondary)',fontSize:'0.85rem',flexWrap:'wrap',gap:'1rem'}}>
          <span>© 2026 CommunityConnect · Google Solution Challenge</span>
          <div style={{display:'flex',gap:'1.5rem'}}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (Visible only on mobile) */}
      <nav className="glass-panel mobile-nav">
         <div onClick={() => document.getElementById('impact')?.scrollIntoView({behavior:'smooth'})} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--primary-500)', cursor:'pointer'}}>
           <Heart size={24}/>
           <span style={{fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 600}}>Tasks</span>
         </div>
         <div onClick={() => addToast('🧭 AR Navigation requires camera access','info')} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)', cursor:'pointer'}}>
           <Compass size={24}/>
           <span style={{fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 600}}>AR Nav</span>
         </div>
         <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)', position: 'relative', top: '-15px'}}>
           <button onClick={handleSos} style={{width: 50, height: 50, borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', display: 'grid', placeItems: 'center', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)', cursor: 'pointer'}}>
              <AlertCircle size={24} />
           </button>
           <span style={{fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 600}}>SOS</span>
         </div>
         <div onClick={() => document.getElementById('stories')?.scrollIntoView({behavior:'smooth'})} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)', cursor:'pointer'}}>
           <Award size={24}/>
           <span style={{fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 600}}>Impact</span>
         </div>
         <div onClick={handleAccessPortal} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)', cursor:'pointer'}}>
           <User size={24}/>
           <span style={{fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 600}}>Profile</span>
         </div>
      </nav>

      {/* ─── Toast Container ─── */}
      <AnimatePresence>
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </>
  )
}

export default App
