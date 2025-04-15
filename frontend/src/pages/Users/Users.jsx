import { useState, useEffect } from 'react';
import axios from 'axios';
import './Users.css';

function Users() {
  const [user, setUser] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        loginForm,
      );
      setUser(response.data.user);
      // Récupérer les listes de films
      fetchUserMovies(response.data.user.id);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const fetchUserMovies = async (userId) => {
    try {
      const [liked, watchLater, watched] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/liked-movies`,
        ),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/watch-later-movies`,
        ),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/watched-movies`,
        ),
      ]);

      setLikedMovies(liked.data);
      setWatchLaterMovies(watchLater.data);
      setWatchedMovies(watched.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
    }
  };

  return (
    <div className="users-page">
      {!user ? (
        <div className="login-container">
          <h2>Connexion</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            <button type="submit">Se connecter</button>
          </form>
        </div>
      ) : (
        <div className="user-profile">
          <h2>Bienvenue {user.firstname} !</h2>

          <div className="movie-lists">
            <div className="movie-list">
              <h3>Films aimés</h3>
              <div className="movies-grid">
                {likedMovies.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <h4>{movie.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="movie-list">
              <h3>À voir plus tard</h3>
              <div className="movies-grid">
                {watchLaterMovies.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <h4>{movie.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="movie-list">
              <h3>Films vus</h3>
              <div className="movies-grid">
                {watchedMovies.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <h4>{movie.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
