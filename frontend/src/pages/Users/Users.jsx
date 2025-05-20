/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AuthForms from '../../components/AuthForms/AuthForms';
import MovieList from '../../components/MovieList/MovieList';
import './Users.css';

function Users() {
  const { user, login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [movieLists, setMovieLists] = useState({
    liked: [],
    watchLater: [],
    watched: []
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔑 Tentative de connexion avec:', loginForm);

      // Validation côté client
      if (!loginForm.email || !loginForm.password) {
        setError('Email et mot de passe requis');
        setLoading(false);

        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        loginForm,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          // Ajout pour débugger
          validateStatus: (status) => {
            console.log('📡 Status reçu:', status);

            return true; // Pour voir toutes les réponses
          },
        }
      );

      console.log('📥 Réponse complète:', response);

      if (response.status !== 200) {
        throw new Error(`Erreur ${response.status}: ${response.data.message || 'Erreur inconnue'}`);
      }

      if (!response.data.user) {
        throw new Error('Aucune donnée utilisateur reçue');
      }

      console.log('✅ Connexion réussie:', response.data.user);
      login(response.data.user);
      setError('');

    } catch (err) {
      console.error('❌ Erreur détaillée:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError(
        err.response?.data?.message || 
        err.message || 
        'Erreur de connexion'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('📝 Tentative inscription avec:', registerForm);
      
      
      if (!registerForm.email || !registerForm.password || !registerForm.firstname || !registerForm.lastname) {
        setError('Tous les champs sont obligatoires');
        setLoading(false);

        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/new`,
        registerForm
      );

      console.log('✅ Réponse inscription:', response.data);

      if (response.data.user) {
        login(response.data.user);
        setError('');
      }
    } catch (err) {
      console.error('❌ Erreur inscription:', err.response?.data || err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMovie = async (movieId, listType) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/${listType}-movies/${movieId}`
      );
      const fetchUserLists = async () => {
        setLoading(true);
        try {
          const [liked, watchLater, watched] = await Promise.all([
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/liked-movies`),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/watch-later-movies`),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/watched-movies`)
          ]);

          setMovieLists({
            liked: liked.data,
            watchLater: watchLater.data,
            watched: watched.data
          });
        } catch (err) {
          setError('Erreur lors de la récupération des listes');
        } finally {
          setLoading(false);
        }
      };

      fetchUserLists();
    } catch (error) {
      setError("Erreur lors de la suppression du film");
    }
  };

  useEffect(() => {
    if (user) {
      const fetchUserLists = async () => {
        setLoading(true);
        try {
          const [liked, watchLater, watched] = await Promise.all([
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/liked-movies`),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/watch-later-movies`),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/watched-movies`)
          ]);

          setMovieLists({
            liked: liked.data,
            watchLater: watchLater.data,
            watched: watched.data
          });
        } catch (err) {
          console.error('Error fetching lists:', err);
          setError('Erreur lors de la récupération des listes');
        } finally {
          setLoading(false);
        }
      };

      fetchUserLists();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="users-container">
        <AuthForms
          isRegistering={isRegistering}
          setIsRegistering={setIsRegistering}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="users-container">
      {loading && <div className="loading">Chargement...</div>}
      {error && <div className="error">{error}</div>}
      
      <div className="user-profile">
        <h2>Bienvenue {user.firstname} !</h2>
        
        <div className="movie-lists">
          <MovieList
            title="Films favoris"
            movies={movieLists.liked}
            onRemove={(movieId) => handleRemoveMovie(movieId, 'liked')}
          >
            <div className="user-movie-list">
              <h3>Films favoris</h3>
              <div className="user-movies-scroll">
                {movieLists.liked.map(movie => (
                  <div key={movie.id} className="movie-card">
                    <button
                      className="remove-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMovie(movie.id, 'liked');
                      }}
                      title="Retirer de la liste"
                    >
                      ×
                    </button>
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        className="movie-poster"
                      />
                    ) : (
                      <div className="no-poster">{movie.title[0]}</div>
                    )}
                    <div className="movie-info">
                      <h3>{movie.title}</h3>
                      <p>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
                      <p>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MovieList>
          <MovieList
            title="À voir plus tard"
            movies={movieLists.watchLater}
            onRemove={(movieId) => handleRemoveMovie(movieId, 'watch-later')}
          >
            <div className="user-movie-list">
              <h3>À voir plus tard</h3>
              <div className="user-movies-scroll">
                {movieLists.watchLater.map(movie => (
                  <div key={movie.id} className="movie-card">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        className="movie-poster"
                      />
                    ) : (
                      <div className="no-poster">{movie.title[0]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </MovieList>
          <MovieList
            title="Films vus"
            movies={movieLists.watched}
            onRemove={(movieId) => handleRemoveMovie(movieId, 'watched')}
          >
            <div className="user-movie-list">
              <h3>Films vus</h3>
              <div className="user-movies-scroll">
                {movieLists.watched.map(movie => (
                  <div key={movie.id} className="movie-card">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        className="movie-poster"
                      />
                    ) : (
                      <div className="no-poster">{movie.title[0]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </MovieList>
        </div>
      </div>
    </div>
  );
}

export default Users;
