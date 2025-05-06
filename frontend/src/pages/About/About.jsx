/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './About.css';

const API_KEY = '522d421671cf75c2cba341597d86403a';
const API_BASE_URL = 'https://api.themoviedb.org/3';

function About() {
  const { user } = useAuth();
  const [moviesByCategory, setMoviesByCategory] = useState({
    trending: [],
    topRated: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
    scienceFiction: [],
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Récupération des films par catégorie
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const [trending, topRated, action, comedy, horror, romance, scifi] =
          await Promise.all([
            axios.get(
              `${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR`,
            ),
            axios.get(
              `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR`,
            ),
            axios.get(
              `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=fr-FR`,
            ),
            axios.get(
              `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&language=fr-FR`,
            ),
            axios.get(
              `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&language=fr-FR`,
            ),
            axios.get(
              `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749&language=fr-FR`,
            ),
            axios.get(
              `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878&language=fr-FR`,
            ),
          ]);

        setMoviesByCategory({
          trending: trending.data.results,
          topRated: topRated.data.results,
          action: action.data.results,
          comedy: comedy.data.results,
          horror: horror.data.results,
          romance: romance.data.results,
          scienceFiction: scifi.data.results,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Composant pour une rangée de films
  const MovieRow = ({ title, movies }) => (
    <div className="movie-row">
      <h2>{title}</h2>
      <div className="movie-slider">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => setSelectedMovie(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{movie.vote_average.toFixed(1)}/10</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Traduction des catégories
  const categoryTitles = {
    trending: 'Tendances de la semaine',
    topRated: 'Les mieux notés',
    action: 'Action',
    comedy: 'Comédie',
    horror: 'Horreur',
    romance: 'Romance',
    scienceFiction: 'Science Fiction',
  };

  if (isLoading) {
    return (
      <div className="netflix-style">
        <h1 className="page-title">Découvrez Notre Sélection</h1>
        <div className="loading-container">
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="netflix-style">
      <h1 className="page-title">Découvrez Notre Sélection</h1>
      <div className="content">
        {Object.entries(moviesByCategory).map(([category, movies]) => (
          <MovieRow
            key={category}
            title={categoryTitles[category]}
            movies={movies}
          />
        ))}
      </div>

      {selectedMovie && (
        <div
          className="movie-modal-overlay"
          onClick={() => setSelectedMovie(null)}
        >
          <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setSelectedMovie(null)}
            >
              ×
            </button>
            <div className="modal-content">
              <div className="modal-image">
                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                />
              </div>
              <div className="modal-details">
                <h2>{selectedMovie.title}</h2>
                <p>
                  <strong>Synopsis :</strong> {selectedMovie.overview}
                </p>
                <p>
                  <strong>Date de sortie :</strong> {selectedMovie.release_date}
                </p>
                <p>
                  <strong>Note :</strong>{' '}
                  {selectedMovie.vote_average.toFixed(1)}/10
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default About;
