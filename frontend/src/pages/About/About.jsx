/* eslint-disable prettier/prettier */
/* eslint-disable padding-line-between-statements */
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
  const [language, setLanguage] = useState('fr'); // 'fr' pour français, 'en' pour anglais
  const pageTitles = {
  fr: "Découvrez Notre Sélection",
  en: "Discover Our Selection"
};
  // Fonction pour ajouter un film à une liste
  const handleAddToList = async (movie, listType) => {
    if (!user) {
      alert('Veuillez vous connecter pour ajouter des films à vos listes');
      return;
    }

    const endpoints = {
      liked: 'liked-movies',
      watchLater: 'watch-later-movies',
      watched: 'watched-movies',
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/${endpoints[listType]}/${movie.id}`,
        movie
      );
      alert(`Film ajouté à votre liste "${listType}"`);
    } catch (error) {
      alert("Erreur lors de l'ajout du film");
    }
  };

  // Récupération des films par catégorie
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const [trending, topRated, action, comedy, horror, romance, scifi] =
          await Promise.all([
            axios.get(
              `${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=${language}-${language.toUpperCase()}`,
            ),
            axios.get(
              `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${language}-${language.toUpperCase()}`,
            ),
            axios.get(
              `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=${language}-${language.toUpperCase()}`,
            ),
            axios.get(
              `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&language=${language}-${language.toUpperCase()}`,
            ),
            axios.get(
              `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&language=${language}-${language.toUpperCase()}`,
            ),
            axios.get(
              `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749&language=${language}-${language.toUpperCase()}`,
            ),
            axios.get(
              `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878&language=${language}-${language.toUpperCase()}`,
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
  }, [language]);

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
    fr: {
      trending: 'Tendances de la semaine',
      topRated: 'Les mieux notés',
      action: 'Action',
      comedy: 'Comédie',
      horror: 'Horreur',
      romance: 'Romance',
      scienceFiction: 'Science Fiction',
    },
    en: {
      trending: 'Trending this week',
      topRated: 'Top Rated',
      action: 'Action',
      comedy: 'Comedy',
      horror: 'Horror',
      romance: 'Romance',
      scienceFiction: 'Science Fiction',
    }
  };

  if (isLoading) {
    return (
      <div className="netflix-style">
        <h1 className="page-title">{pageTitles[language]}</h1>
        <div className="loading-container">
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="netflix-style">
      <h1 className="page-title">{pageTitles[language]}</h1>
      <div className="language-toggle" style={{ textAlign: 'right', padding: '20px' }}>
        <button
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
        >
          {language === 'fr' ? 'English' : 'Français'}
        </button>
      </div>
      <div className="content">
        {Object.entries(moviesByCategory).map(([category, movies]) => (
          <MovieRow
            key={category}
            title={categoryTitles[language][category]}
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
                {user && (
                  <div className="movie-actions" style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                    <button
                      className="action-button like"
                      title="Ajouter aux favoris"
                      onClick={() => handleAddToList(selectedMovie, 'liked')}
                    >
                      ❤️
                    </button>
                    <button
                      className="action-button watch-later"
                      title="À voir plus tard"
                      onClick={() => handleAddToList(selectedMovie, 'watchLater')}
                    >
                      🕒
                    </button>
                    <button
                      className="action-button watched"
                      title="Déjà vu"
                      onClick={() => handleAddToList(selectedMovie, 'watched')}
                    >
                      ✅
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default About;
