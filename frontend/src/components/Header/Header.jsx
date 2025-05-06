import { useEffect, useRef, useState } from 'react'; // Ajout de useEffect et useRef
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Référence pour le menu

  // Gestionnaire de clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Ajouter l'écouteur d'événements quand le menu est ouvert
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Nettoyage
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="Header-container">
      <div className="menu-container" ref={menuRef}>
        <button className="btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="icon">
            <svg viewBox="0 0 175 80" width="40" height="40">
              <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
              <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
              <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
            </svg>
          </span>
          <span className="text">MENU</span>
        </button>

        <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className="menu-item"
            onClick={() => setIsMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            to="/users"
            className="menu-item"
            onClick={() => setIsMenuOpen(false)}
          >
            {user ? `${user.firstname}` : 'Mon Profil'}
          </Link>
          <Link
            to="/about"
            className="menu-item"
            onClick={() => setIsMenuOpen(false)}
          >
            À propos
          </Link>
          <Link
            to="/counter"
            className="menu-item"
            onClick={() => setIsMenuOpen(false)}
          >
            Counter
          </Link>
          {user && (
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="menu-item logout-button"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
