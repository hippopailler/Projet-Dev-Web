/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Reviews.css';

const MovieSelector = ({
  movies,
  searchTerm,
  onSearchChange,
  onSelect,
  onClose,
}) => (
  <div className="movie-selector-modal">
    <div className="movie-selector-content">
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      <h3>Sélectionner un film</h3>
      <MovieSearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <div className="movies-grid">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-select-card"
            onClick={() => onSelect(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="movie-select-info">
              <h4>{movie.title}</h4>
              <p>{movie.vote_average}/10</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MovieSearchBar = ({ searchTerm, onSearchChange }) => (
  <div className="movie-search-bar">
    <input
      type="text"
      placeholder="Rechercher un film..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  </div>
);

function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newReview, setNewReview] = useState({
    content: '',
    rating: 5,
    movieId: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMovieSelector, setShowMovieSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Tentative de récupération des reviews...');
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reviews`,
        );
        console.log('Reviews reçues:', response.data);
        setReviews(response.data);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/movies`,
      );

      setMovies(response.data.movies);
    } catch (error) {
      console.error('Erreur chargement films:', error);
    }
  };

  // Ajoutez cette fonction pour sélectionner un film
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setNewReview((prev) => ({ ...prev, movie_id: movie.id }));
    setShowMovieSelector(false);
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(
        movies.filter((movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
  }, [searchTerm, movies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Veuillez vous connecter pour publier une critique');

      return;
    }
    if (!selectedMovie) {
      alert('Veuillez sélectionner un film');

      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reviews/new`, // Corrigé : pas de doublon /api
        {
          ...newReview,
          user_id: user.id,
          movie_id: selectedMovie.id,
        },
      );
      setReviews([
        {
          ...response.data,
          user: { firstname: user.firstname, lastname: user.lastname },
          movie: selectedMovie,
        },
        ...reviews,
      ]);
      setNewReview({ content: '', rating: 5, movie_id: null });
      setSelectedMovie(null);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (error) {
    return (
      <div className="reviews-container">
        <h1 className="page-title">Critiques de Films</h1>
        <div className="error-message">Une erreur est survenue: {error}</div>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <h1 className="page-title">Critiques de Films</h1>

      {user && (
        <div className="review-form-container">
          <h2>Écrire une critique</h2>
          <form onSubmit={handleSubmit} className="review-form">
            <button
              type="button"
              className="select-movie-btn"
              onClick={() => {
                setShowMovieSelector(true);
                fetchMovies();
              }}
            >
              {selectedMovie ? selectedMovie.title : 'Sélectionner un film'}
            </button>

            {showMovieSelector && (
              <MovieSelector
                movies={filteredMovies}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSelect={handleMovieSelect}
                onClose={() => setShowMovieSelector(false)}
              />
            )}

            <textarea
              value={newReview.content}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              placeholder="Écrivez votre critique ici..."
              required
            />

            <div className="rating-container">
              <label>Note :</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    rating: parseFloat(e.target.value),
                  })
                }
                required
              />
              <span>/10</span>
            </div>

            <button
              type="submit"
              className="submit-review-btn"
              disabled={!selectedMovie}
            >
              Publier la critique
            </button>
          </form>
        </div>
      )}

      <div className="reviews-list">
        {loading ? (
          <div className="loading">Chargement des critiques...</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <img
                  src={`https://image.tmdb.org/t/p/w92${review.movie?.poster_path}`}
                  alt={review.movie?.title}
                  className="movie-thumbnail"
                />
                <div className="review-info">
                  <h3>{review.movie?.title}</h3>
                  <p className="review-meta">
                    Par {review.user?.firstname} {review.user?.lastname} •{' '}
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  <div className="review-rating">⭐ {review.rating}/10</div>
                </div>
              </div>
              <p className="review-content">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reviews;
