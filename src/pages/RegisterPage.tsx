import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { LeafIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/services/errors';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please accept the terms of service to create your account.');
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      navigate('/account', { replace: true });
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : 'Registration failed. Please check your information.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page">
      <div className="auth-wrap">
        <div className="auth-card auth-card--wide">
          <div className="auth-card__header">
            <div className="auth-card__icon" aria-hidden="true">
              <LeafIcon size={32} />
            </div>
            <h1>Create an Account</h1>
            <p>Join Brio for botanical wellness, order tracking and rewards</p>
          </div>

          {errorMessage && (
            <div className="auth-alert auth-alert--error" role="alert">
              {errorMessage}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="reg-first-name">First Name *</label>
                <input
                  id="reg-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Jane"
                  required
                  autoComplete="given-name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-last-name">Last Name *</label>
                <input
                  id="reg-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Wanjiku"
                  required
                  autoComplete="family-name"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address *</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.wanjiku@example.com"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number (Optional)</label>
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 700 000 000"
                autoComplete="tel"
                disabled={loading}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="reg-password">Password (min 6 characters) *</label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm-password">Confirm Password *</label>
                <input
                  id="reg-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={loading}
                />
                <span>
                  I agree to Brio’s <a href="#terms" onClick={(e) => e.preventDefault()} className="auth-link">Terms of Service</a> and <a href="#privacy" onClick={(e) => e.preventDefault()} className="auth-link">Privacy Policy</a>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="auth-btn"
            >
              Create Account
            </Button>
          </form>

          <div className="auth-card__footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

