import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AddMovieForm from '../../components/AddMovieForm/AddMovieForm';
import MovieCard from '../../components/MovieCard/MovieCard';
import MovieModal from '../../components/MovieModal/MovieModal';
import FilterBar from '../../components/FilterBar/FilterBar';
import bigfootLogo from './bigfoot.png';
import bigfootTitle from './Bigfoot-2.png';
import './Home.css';

const API_KEY = '522d421671cf75c2cba341597d86403a';
const API_BASE_URL = 'https://api.themoviedb.org/3';

function Home() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortByVotes, setSortByVotes] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const handleRandomMovie = () => {
    // Animation de sélection aléatoire
    const duration = 1000; // 1 seconde
    const startTime = Date.now();

    const animate = () => {
      if (Date.now() - startTime < duration) {
        const randomIndex = Math.floor(Math.random() * filteredMovies.length);
        setSelectedMovie(filteredMovies[randomIndex]);
        requestAnimationFrame(animate);
      } else {
        // Sélection finale
        const finalIndex = Math.floor(Math.random() * filteredMovies.length);
        setSelectedMovie(filteredMovies[finalIndex]);
      }
    };

    animate();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, genresResponse] = await Promise.all([
          Promise.all(
            [1, 2, 3, 4, 5].map((page) =>
              axios.get(
                `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,
              ),
            ),
          ),
          axios.get(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`),
        ]);

        const uniqueMovies = [
          ...new Map(
            moviesResponse
              .flatMap((response) => response.data.results)
              .filter((movie) => movie?.id)
              .map((movie) => [movie.id, movie]),
          ).values(),
        ];

        setMovies(uniqueMovies);
        setFilteredMovies(uniqueMovies);
        setGenres(genresResponse.data.genres);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchData();
  }, []);

  // Ajout de l'effet pour le filtrage
  useEffect(() => {
    let result = [...movies];

    // Filtrage par recherche
    if (searchTerm) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtrage par genre
    if (selectedGenre) {
      result = result.filter((movie) =>
        movie.genre_ids.includes(parseInt(selectedGenre)),
      );
    }

    // Tri par votes
    if (sortByVotes) {
      result = result.sort((a, b) => b.vote_average - a.vote_average);
    }

    setFilteredMovies(result);
  }, [movies, searchTerm, selectedGenre, sortByVotes]);

  const handleAddToList = async (movieId, listType) => {
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
      const movie = movies.find((m) => m.id === movieId);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/${endpoints[listType]}/${movieId}`,
        movie,
      );

      if (response.status === 201) {
        alert(`Film ajouté avec succès à votre liste "${listType}"`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert("Une erreur s'est produite");
    }
  };

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
          {/* {<AddMovieForm /> && ( */}
          <button className="random-movie-button" onClick={handleRandomMovie}>
            🎲 Film Aléatoire
          </button>
          <FilterBar
            searchTerm={searchTerm}
            selectedGenre={selectedGenre}
            genres={genres}
            sortByVotes={sortByVotes}
            onSearchChange={setSearchTerm}
            onGenreChange={setSelectedGenre}
            onSortChange={setSortByVotes}
          />

          <h2>Parcourir les films populaires</h2>
          <div style={{ marginBottom: '20px' }}></div>
          <div className="movies-list">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onMovieClick={setSelectedMovie}
                onAddToList={handleAddToList}
                isAuthenticated={!!user}
              />
            ))}
          </div>
        </div>

        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </header>
    </div>
  );
}

export default Home;
