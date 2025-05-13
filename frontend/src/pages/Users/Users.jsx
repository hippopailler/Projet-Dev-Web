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
      console.log('Login attempt with:', loginForm);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        loginForm
      );

      if (response.data.user) {
        console.log('Login successful:', response.data.user);
        login(response.data.user);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Register attempt with:', registerForm);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/new`,
        registerForm
      );

      if (response.data.user) {
        console.log('Registration successful:', response.data.user);
        login(response.data.user);
      }
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || "Erreur d'inscription");
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
          />
          <MovieList
            title="À voir plus tard"
            movies={movieLists.watchLater}
            onRemove={(movieId) => handleRemoveMovie(movieId, 'watch-later')}
          />
          <MovieList
            title="Films vus"
            movies={movieLists.watched}
            onRemove={(movieId) => handleRemoveMovie(movieId, 'watched')}
          />
        </div>
      </div>
    </div>
  );
}

export default Users;
