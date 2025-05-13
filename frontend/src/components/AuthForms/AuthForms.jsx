import PropTypes from 'prop-types';
import './AuthForms.css';

const AuthForms = ({
  isRegistering,
  setIsRegistering,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  handleLogin,
  handleRegister,
  error
}) => {
  return (
    <div className="auth-container">
      <h2 className="auth-title">Bigfoot</h2>
      <div className="auth-forms">
        <div className="auth-toggle">
          <button
            className={!isRegistering ? 'active' : ''}
            onClick={() => setIsRegistering(false)}
          >
            Connexion
          </button>
          <button
            className={isRegistering ? 'active' : ''}
            onClick={() => setIsRegistering(true)}
          >
            Inscription
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!isRegistering ? (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button type="submit">Se connecter</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <input
              type="text"
              placeholder="Prénom"
              value={registerForm.firstname}
              onChange={(e) => setRegisterForm({ ...registerForm, firstname: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Nom"
              value={registerForm.lastname}
              onChange={(e) => setRegisterForm({ ...registerForm, lastname: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              required
            />
            <button type="submit">S'inscrire</button>
          </form>
        )}
      </div>
    </div>
  );
};

AuthForms.propTypes = {
  isRegistering: PropTypes.bool.isRequired,
  setIsRegistering: PropTypes.func.isRequired,
  loginForm: PropTypes.object.isRequired,
  setLoginForm: PropTypes.func.isRequired,
  registerForm: PropTypes.object.isRequired,
  setRegisterForm: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleRegister: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default AuthForms;