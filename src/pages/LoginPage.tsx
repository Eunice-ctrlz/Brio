import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { LeafIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/services/errors';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectPath = params.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: cleanEmail, password });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : 'Unable to sign in. Please verify your credentials.',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDemoFill() {
    setEmail('amani.kariuki@example.com');
    setPassword('secret123');
    setErrorMessage(null);
  }

  return (
    <div className="container page">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="auth-card__icon" aria-hidden="true">
              <LeafIcon size={32} />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to access your Brio account and orders</p>
          </div>

          {errorMessage && (
            <div className="auth-alert auth-alert--error" role="alert">
              {errorMessage}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="form-group__row">
                <label htmlFor="login-password">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link has been sent to your email.'); }} className="auth-link auth-link--sm">
                  Forgot password?
                </a>
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <div className="form-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="auth-btn"
            >
              Sign In
            </Button>

            <button
              type="button"
              className="auth-demo-btn"
              onClick={handleDemoFill}
              disabled={loading}
            >
              Use Demo Account (Amani Kariuki)
            </button>
          </form>

          <div className="auth-card__footer">
            <p>
              Don’t have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one now →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

