import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

// ─── Social button ────────────────────────────────────────────────────────────
function SocialButton({ onClick, icon, label, bgStyle, textColor = 'text-gray-800' }) {
  return (
    <button
      onClick={onClick}
      style={bgStyle}
      className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 no-select ${textColor}`}
    >
      {icon}
      {label}
    </button>
  );
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const VIEWS = { MAIN: 'main', EMAIL: 'email', VERIFY: 'verify', FORGOT: 'forgot', FORGOT_SENT: 'forgot_sent' };

export default function LoginScreen({ onAuthenticated }) {
  const [view, setView] = useState(VIEWS.MAIN);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const clearError = () => setError('');

  const handleSocial = (provider) => {
    base44.auth.loginWithProvider(provider, window.location.href);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      if (isLogin) {
        await base44.auth.loginViaEmailPassword(email.trim(), password);
        onAuthenticated();
      } else {
        await base44.auth.register({ email: email.trim(), password });
        setPendingEmail(email.trim());
        setPendingPassword(password);
        setView(VIEWS.VERIFY);
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    clearError();
    if (!otpCode.trim()) { setError('Enter the code from your email.'); return; }
    setLoading(true);
    try {
      await base44.auth.verifyOtp({ email: pendingEmail, otpCode: otpCode.trim() });
      await base44.auth.loginViaEmailPassword(pendingEmail, pendingPassword);
      onAuthenticated();
    } catch (err) {
      setError(err?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    clearError();
    try {
      await base44.auth.resendOtp(pendingEmail);
    } catch (err) {
      setError(err?.message || 'Failed to resend. Try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    clearError();
    if (!forgotEmail.trim()) { setError('Enter your email address.'); return; }
    setLoading(true);
    try {
      await base44.auth.forgotPassword(forgotEmail.trim());
      setView(VIEWS.FORGOT_SENT);
    } catch (err) {
      setError(err?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const TermsLine = () => (
    <p className="text-center text-xs leading-relaxed mt-auto pb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>
      By continuing you agree to our{' '}
      <span className="underline cursor-pointer" style={{ color: 'rgba(255,255,255,0.45)' }}>Terms of Service</span>
      {' '}and{' '}
      <span className="underline cursor-pointer" style={{ color: 'rgba(255,255,255,0.45)' }}>Privacy Policy</span>
    </p>
  );

  return (
    <div className="fixed inset-0 flex flex-col items-center overflow-y-auto" style={{ background: '#12082A' }}>
      <div className="w-full max-w-sm flex flex-col px-6 min-h-full" style={{ paddingTop: 'max(40px, env(safe-area-inset-top, 40px))', paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))' }}>

        <AnimatePresence mode="wait">

          {/* ── MAIN ─────────────────────────────────────────────────────── */}
          {view === VIEWS.MAIN && (
            <motion.div key="main" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-8 w-full flex-1">
              {/* Logo */}
              <div className="flex flex-col items-center pt-10 gap-4">
                <div className="w-18 h-18 rounded-3xl flex items-center justify-center text-4xl" style={{ width: 72, height: 72, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                  🏋️
                </div>
                <div className="text-center">
                  <h1 className="text-4xl font-grotesk font-black" style={{ color: '#fff' }}>
                    Quant<span style={{ color: '#9B6FE8' }}>Drill</span>
                  </h1>
                  <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Train like the top 1%</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <SocialButton
                  onClick={() => handleSocial('google')}
                  icon={<GoogleIcon />}
                  label="Continue with Google"
                  bgStyle={{ background: '#fff' }}
                  textColor="text-gray-800"
                />
                <SocialButton
                  onClick={() => handleSocial('apple')}
                  icon={<AppleIcon />}
                  label="Continue with Apple"
                  bgStyle={{ background: '#fff' }}
                  textColor="text-gray-800"
                />
                <SocialButton
                  onClick={() => handleSocial('facebook')}
                  icon={<FacebookIcon />}
                  label="Continue with Facebook"
                  bgStyle={{ background: '#1877F2' }}
                  textColor="text-white"
                />
                <button
                  onClick={() => { clearError(); setView(VIEWS.EMAIL); }}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 no-select text-white"
                  style={{ border: '1.5px solid #7C3AED', background: 'transparent' }}
                >
                  ✉️ Sign up / Log in with Email
                </button>
              </div>

              <TermsLine />
            </motion.div>
          )}

          {/* ── EMAIL ────────────────────────────────────────────────────── */}
          {view === VIEWS.EMAIL && (
            <motion.div key="email" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col gap-6 w-full flex-1">
              <div className="flex items-center gap-3 pt-6">
                <button onClick={() => { setView(VIEWS.MAIN); clearError(); }} className="no-select active:opacity-60">
                  <ArrowLeft size={22} color="white" />
                </button>
                <h2 className="text-xl font-grotesk font-bold text-white">{isLogin ? 'Log in' : 'Create account'}</h2>
              </div>

              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearError(); }}
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-white placeholder-white/30 outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                  autoComplete="email"
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); clearError(); }}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-white placeholder-white/30 outline-none pr-12"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 no-select" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {isLogin && (
                  <button type="button" onClick={() => { setForgotEmail(email); setView(VIEWS.FORGOT); clearError(); }} className="text-right text-xs no-select" style={{ color: '#9B6FE8' }}>
                    Forgot password?
                  </button>
                )}

                {error && <p className="text-xs text-red-400 px-1">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-grotesk font-bold text-base text-white transition-all active:scale-95 no-select disabled:opacity-60 mt-1"
                  style={{ background: '#7C3AED' }}
                >
                  {loading
                    ? <span className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /></span>
                    : (isLogin ? 'Log in' : 'Create account')}
                </button>
              </form>

              <button onClick={() => { setIsLogin(v => !v); clearError(); setPassword(''); }} className="text-center text-sm no-select" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span style={{ color: '#9B6FE8' }} className="font-semibold">{isLogin ? 'Sign up' : 'Log in'}</span>
              </button>

              <TermsLine />
            </motion.div>
          )}

          {/* ── VERIFY ───────────────────────────────────────────────────── */}
          {view === VIEWS.VERIFY && (
            <motion.div key="verify" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6 w-full pt-16 flex-1">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                📬
              </div>
              <div className="text-center">
                <h2 className="text-xl font-grotesk font-bold text-white mb-2">Check your inbox</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  We sent a verification code to<br />
                  <span className="text-white font-medium">{pendingEmail}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="flex flex-col gap-3 w-full">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit code"
                  value={otpCode}
                  onChange={e => { setOtpCode(e.target.value); clearError(); }}
                  maxLength={6}
                  className="w-full px-4 py-4 rounded-2xl text-center text-lg font-grotesk font-bold text-white placeholder-white/30 tracking-widest outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                {error && <p className="text-xs text-red-400 text-center">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-grotesk font-bold text-base text-white transition-all active:scale-95 no-select disabled:opacity-60"
                  style={{ background: '#7C3AED' }}
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Verify Email'}
                </button>
              </form>

              <button onClick={handleResendOtp} disabled={resendLoading} className="text-sm no-select disabled:opacity-50" style={{ color: '#9B6FE8' }}>
                {resendLoading ? 'Sending…' : 'Resend verification email'}
              </button>
            </motion.div>
          )}

          {/* ── FORGOT ───────────────────────────────────────────────────── */}
          {view === VIEWS.FORGOT && (
            <motion.div key="forgot" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col gap-6 w-full flex-1">
              <div className="flex items-center gap-3 pt-6">
                <button onClick={() => { setView(VIEWS.EMAIL); clearError(); }} className="no-select active:opacity-60">
                  <ArrowLeft size={22} color="white" />
                </button>
                <h2 className="text-xl font-grotesk font-bold text-white">Reset password</h2>
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleForgot} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={forgotEmail}
                  onChange={e => { setForgotEmail(e.target.value); clearError(); }}
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-white placeholder-white/30 outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-grotesk font-bold text-base text-white transition-all active:scale-95 no-select disabled:opacity-60" style={{ background: '#7C3AED' }}>
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Send reset link'}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── FORGOT SENT ──────────────────────────────────────────────── */}
          {view === VIEWS.FORGOT_SENT && (
            <motion.div key="forgot-sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 w-full pt-20 flex-1">
              <div className="text-5xl">📨</div>
              <div className="text-center">
                <h2 className="text-xl font-grotesk font-bold text-white mb-2">Email sent!</h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Check your inbox for the password reset link.</p>
              </div>
              <button onClick={() => { setView(VIEWS.EMAIL); clearError(); }} className="text-sm font-semibold no-select" style={{ color: '#9B6FE8' }}>
                Back to log in
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}