/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Users.css';
import { useAuth } from '../../context/AuthContext';

function MovieList({ title, movies, onRemove }) {
  return (
    <div className="movie-list">
      <h3>{title}</h3>
      {movies.length === 0 ? (
        <p className="empty-list">Aucun film dans cette liste</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <button 
                className="remove-button"
                onClick={() => onRemove(movie.id)}
                title="Retirer de la liste"
              >
                ×
              </button>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="movie-info">
                <h4>{movie.title}</h4>
                <p>{new Date(movie.release_date).getFullYear()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Users() {
  const { user, login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Tentative de connexion avec:', loginForm);
      const response = await axios.post(
        'http://localhost:8080/api/users/login',
        loginForm,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.user) {
        login(response.data.user); // Utiliser login du context
        fetchUserMovies(response.data.user.id);
        setError('');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error);
      setError(error.response?.data?.message || 'Erreur de connexion');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:8080/api/users/new',
        registerForm,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Réponse complète:', response);

      if (response.status === 201) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsRegistering(false);
        setRegisterForm({
          email: '',
          password: '',
          firstname: '',
          lastname: '',
        });
      }
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur lors de l'inscription",
      );
    }
  };

  const fetchUserMovies = async (userId) => {
    try {
      console.log('Début fetchUserMovies pour userId:', userId);
      
      const [liked, watchLater, watched] = await Promise.all([
        axios.get(`http://localhost:8080/api/users/${userId}/liked-movies`),
        axios.get(`http://localhost:8080/api/users/${userId}/watch-later-movies`),
        axios.get(`http://localhost:8080/api/users/${userId}/watched-movies`)
      ]);

      // Récupération des détails des films depuis TMDB
      const fetchMovieDetails = async (movies) => {
        return Promise.all(movies.map(async (movie) => {
          try {
            const response = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=522d421671cf75c2cba341597d86403a&language=fr-FR`
            );

            return { ...movie, ...response.data };
          } catch (error) {
            console.error('Erreur récupération détails film:', error);

            return movie;
          }
        }));
      };

      const [likedWithDetails, watchLaterWithDetails, watchedWithDetails] = await Promise.all([
        fetchMovieDetails(liked.data),
        fetchMovieDetails(watchLater.data),
        fetchMovieDetails(watched.data)
      ]);

      setLikedMovies(likedWithDetails);
      setWatchLaterMovies(watchLaterWithDetails);
      setWatchedMovies(watchedWithDetails);
    } catch (error) {
      console.error('Erreur dans fetchUserMovies:', error.response?.data || error);
    }
  };

  const handleRemoveMovie = async (movieId, listType) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/users/${user.id}/${listType}-movies/${movieId}`
      );
      
      // Mettre à jour la liste appropriée
      fetchUserMovies(user.id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert("Erreur lors de la suppression du film");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserMovies(user.id);
    }
  }, [user]);

  return (
    <div className="users-page">
      {!user ? (
        <div className="auth-container">
          {!isRegistering ? (
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
              <button
                className="switch-auth-button"
                onClick={() => setIsRegistering(true)}
              >
                Pas encore de compte ? S'inscrire
              </button>
            </div>
          ) : (
            <div className="register-container">
              <h2>Inscription</h2>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleRegister} className="register-form">
                <input
                  type="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Prénom"
                  value={registerForm.firstname}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      firstname: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={registerForm.lastname}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      lastname: e.target.value,
                    })
                  }
                  required
                />
                <button type="submit">S'inscrire</button>
              </form>
              <button
                className="switch-auth-button"
                onClick={() => setIsRegistering(false)}
              >
                Déjà un compte ? Se connecter
              </button>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
      ) : (
        <div className="user-profile">
          <h2>Bienvenue {user.firstname} !</h2>

          <div className="movie-lists">
            <MovieList
              title="Films aimés"
              movies={likedMovies}
              onRemove={(id) => handleRemoveMovie(id, 'liked')}
            />
            <MovieList
              title="À voir plus tard"
              movies={watchLaterMovies}
              onRemove={(id) => handleRemoveMovie(id, 'watch-later')}
            />
            <MovieList
              title="Films vus"
              movies={watchedMovies}
              onRemove={(id) => handleRemoveMovie(id, 'watched')}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
