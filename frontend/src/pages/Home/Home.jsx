/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AddMovieForm from '../../components/AddMovieForm/AddMovieForm';
import bigfootLogo from './bigfoot.png';
import bigfootTitle from './bigfoottitle.png';
import './Home.css';

// Constantes
const API_KEY = '522d421671cf75c2cba341597d86403a';
const API_BASE_URL = 'https://api.themoviedb.org/3';

function Home() {
  // États
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortByVotes, setSortByVotes] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fonctions handlers
  const handleMovieClick = (movie) => setSelectedMovie(movie);

  const handleAddToList = async (movieId, listType) => {
    if (!user) {
      alert('Veuillez vous connecter pour ajouter des films à vos listes');

      return;
    }

    try {
      const endpoints = {
        liked: 'liked-movies',
        watchLater: 'watch-later-movies',
        watched: 'watched-movies',
      };

      const endpoint = endpoints[listType];
      if (!endpoint) {
        return;
      }

      const movie = movies.find((m) => m.id === movieId);
      const response = await axios.post(
        `http://localhost:8080/api/users/${user.id}/${endpoint}/${movieId}`,
        {
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          overview: movie.overview,
        },
      );

      if (response.status === 201) {
        alert(`Film ajouté avec succès à votre liste "${listType}"`);
      }
    } catch (error) {
      console.error('Erreur:', error.response?.data || error);
      alert("Une erreur s'est produite lors de l'ajout du film");
    }
  };

  // Effets
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const pages = [1, 2, 3, 4, 5, 6, 17, 18, 9];
        const responses = await Promise.all(
          pages.map((page) =>
            axios.get(
              `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,
            ),
          ),
        );

        const uniqueMovies = [
          ...new Map(
            responses
              .flatMap((response) => response.data.results)
              .filter((movie) => movie?.id)
              .map((movie) => [movie.id, movie]),
          ).values(),
        ];

        setMovies(uniqueMovies);
        setFilteredMovies(uniqueMovies);
      } catch (error) {
        console.error('Erreur récupération films:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Erreur récupération genres:', error);
      }
    };

    fetchMovies();
    fetchGenres();
  }, []);

  // Effet de filtrage
  useEffect(() => {
    let filtered = [...movies];

    if (selectedGenre) {
      filtered = filtered.filter((movie) =>
        movie.genre_ids?.includes(parseInt(selectedGenre)),
      );
    }

    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((movie) =>
        movie.title?.toLowerCase().includes(searchTermLower),
      );
    }

    if (sortByVotes) {
      filtered.sort((a, b) => b.vote_count - a.vote_count);
    }

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre, sortByVotes]);

  const renderFilters = () => (
    <div className="filters-container">
      <input
        type="text"
        placeholder="Rechercher un film ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        className="genre-dropdown"
      >
        <option value="">Tous les genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
      <button
        onClick={() => setSortByVotes(!sortByVotes)}
        className="sort-button"
      >
        {sortByVotes ? 'Ordre initial' : 'Trier par popularité'}
      </button>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <div className="content-container">
          <div className="header-banner">
            <img
              src={bigfootLogo}
              alt="Bigfoot Logo"
              className="bigfoot-logo"
            />
            <img
              src={bigfootTitle}
              alt="Bigfoot Title"
              className="bigfoot-title"
            />
          </div>
          <AddMovieForm />
          {renderFilters()}
          <h2>Films populaires</h2>
          <div className="movies-list">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="movie-card"
                  onClick={() => handleMovieClick(movie)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <h3>{movie.title}</h3>
                  <p>Date de sortie : {movie.release_date}</p>
                  <p>Note moyenne : {movie.vote_average} / 10</p>
                  <div
                    className="movie-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="action-button like"
                      onClick={() => handleAddToList(movie.id, 'liked')}
                      title="Ajouter aux favoris"
                    >
                      ❤️
                    </button>
                    <button
                      className="action-button watch-later"
                      onClick={() => handleAddToList(movie.id, 'watchLater')}
                      title="À voir plus tard"
                    >
                      🕒
                    </button>
                    <button
                      className="action-button watched"
                      onClick={() => handleAddToList(movie.id, 'watched')}
                      title="Déjà vu"
                    >
                      ✅
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Aucun film trouvé pour les critères sélectionnés.</p>
            )}
          </div>
        </div>

        {/* Modal des détails du film */}
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
                    <strong>Date de sortie :</strong>{' '}
                    {selectedMovie.release_date}
                  </p>
                  <p>
                    <strong>Note :</strong> {selectedMovie.vote_average}/10 (
                    {selectedMovie.vote_count} votes)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default Home;
