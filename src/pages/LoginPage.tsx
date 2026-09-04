import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { dbService } from '@/services/dbService';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { useRive } from '@rive-app/react-webgl2';
import { Logo } from '@/components/Logo';
import { ShieldCheckIcon } from '@/components/icons';
import bgVideo from '@/assets/videos/ms.mp4';

// ── Video full-screen background ─────────────────────────────────────────────
function VideoBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      {/* Light & clean overlay — brightens slightly, keeps card readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(0px)',
      }} />
    </div>
  );
}

// ── Google "G" SVG icon ───────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.4673-.8064 5.9564-2.1805l-2.9087-2.2581c-.8064.54-1.8368.8591-3.0477.8591-2.3445 0-4.3282-1.5832-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.2827-1.1168-.2827-1.71s.1027-1.17.2827-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05"/>
      <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6555 3.5795 9 3.5795z" fill="#EA4335"/>
    </svg>
  );
}

// ── Main Login Page ──────────────────────────────────────────────────────────
export function LoginPage() {
  const { refreshProfile } = useAuth();
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userProfile = await dbService.getUserProfile(user.uid);
      if (userProfile) {
        await refreshProfile();
        navigate(`/dashboard/${userProfile.role}`);
      } else {
        navigate('/register');
      }
    } catch (err: any) {
      setError('Google Sign-In failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* ── Video Full-Screen Background ── */}
      <VideoBackground />

      {/* ── Centered Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '860px',
          background: 'rgba(255, 255, 255, 0.96)',
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 8px 32px rgba(0,0,0,0.10)',
          border: '1px solid rgba(255,255,255,0.8)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
        className="login-card"
      >

        {/* ── LEFT PANEL: Rive animation panel ── */}
        <div
          style={{
            position: 'relative',
            minHeight: '520px',
            overflow: 'hidden',
            borderRadius: '20px 0 0 20px',
            background: 'linear-gradient(160deg, #a8d8f0 0%, #c5e8f7 40%, #7ec8e3 100%)',
          }}
          className="left-panel"
        >
          {/* Inner Rive preview – mirrors the background but cropped to left panel */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <LeftPanelRive />
          </div>

          {/* Tagline overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '28px',
              zIndex: 2,
            }}
          >
            <p style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.2,
              textShadow: '0 2px 12px rgba(0,0,0,0.25)',
              fontFamily: "'Montserrat', 'Arial Black', sans-serif",
              letterSpacing: '-0.5px',
            }}>
              HEAL.<br />CONNECT.<br />CARE.
            </p>
          </div>

          {/* Subtle bottom gradient */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '160px',
            background: 'linear-gradient(to top, rgba(30,80,140,0.45) 0%, transparent 100%)',
            zIndex: 1,
          }} />
        </div>

        {/* ── RIGHT PANEL: Login Form ── */}
        <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* Logo + Brand */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Logo size="sm" />
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.5px',
              marginBottom: '6px',
              fontFamily: "'Montserrat', 'Arial Black', sans-serif",
              textTransform: 'uppercase',
            }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              Login to your secure healthcare dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: '16px',
                padding: '12px 16px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#dc2626',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {error}
            </motion.div>
          )}

          {/* ── Google Sign In ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                padding: '13px',
                background: '#fff',
                color: '#374151',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#f8fafc'); (e.currentTarget.style.borderColor = '#cbd5e1'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#fff'); (e.currentTarget.style.borderColor = '#e2e8f0'); }}
            >
              <GoogleIcon />
              Sign in with Google
            </button>

            {/* Register Link */}
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginTop: '4px' }}>
              New to MedRelief+?{' '}
              <button
                onClick={() => navigate('/register')}
                style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Footer trust badge */}
          <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0.5 }}>
            <ShieldCheckIcon style={{ width: '14px', height: '14px', color: '#64748b' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Secured by Firebase
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 640px) {
          .login-card {
            grid-template-columns: 1fr !important;
          }
          .left-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Left panel inner Rive (separate instance) ────────────────────────────────
function LeftPanelRive() {
  const { RiveComponent } = useRive({
    src: '/src/assets/animations/hero1.riv',
    stateMachines: 'MainStateMachine',
    autoplay: true,
  });
  return <RiveComponent style={{ width: '100%', height: '100%', display: 'block' }} />;
}