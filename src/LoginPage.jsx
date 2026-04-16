import { useState } from 'react';

function LoginPage({ onLogin, onOpenSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = onLogin({ email: email.trim(), password });
    if (!result.ok) {
      setErrorMessage(result.message || 'Invalid credentials.');
      return;
    }
    setErrorMessage('');
  };

  return (
    <main className="login-main">
      <section className="login-panel">
        <div className="login-brand">
          <img src="/assets/profile-picture.png" alt="" className="login-brand-logo" />
          <h1 className="login-brand-title">Automatic Student Attendance</h1>
          <p className="login-brand-subtitle">
            Sign in to manage classes, attendance, analytics, and support.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-heading">Welcome back</h2>
          <p className="login-helper">Use your tutor account credentials to continue.</p>


          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="mathew.ryan@uow.edu.au"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <div className="login-password-row">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="login-show-button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {errorMessage && <p className="login-error">{errorMessage}</p>}
          <div className="login-actions-row">
            <button type="submit" className="btn btn-primary login-submit">
              Sign in
            </button>
            <button
              type="button"
              className="btn btn-secondary login-submit"
              onClick={onOpenSignUp}
            >
              Sign up
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;


