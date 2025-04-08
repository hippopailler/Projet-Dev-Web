import { useEffect, useState } from 'react';
import logo from './terresvg.svg';
import './Home.css';
import AddMovieForm from '../../components/AddMovieForm/AddMovieForm';

function Home() {
  const [movies, setMovies] = useState([]); // Liste complète des films
  const [filteredMovies, setFilteredMovies] = useState([]); // Liste des films filtrés
  const [searchTerm, setSearchTerm] = useState(''); // Terme de recherche
  const [genres, setGenres] = useState([]); // Liste des genres
  const [selectedGenre, setSelectedGenre] = useState(''); // Genre sélectionné
  const [sortByVotes, setSortByVotes] = useState(false);

  useEffect(() => {
    console.log('Le composant Home est monté');

    // URLs des différentes APIs
    const apiUrls = [
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=1',
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=2',
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=3',
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=4',
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=5',
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=6',
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=7',
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=8',
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=9',
    ];

    // Appels API en parallèle pour récupérer les films
    Promise.all(
      apiUrls.map((url) => fetch(url).then((response) => response.json())),
    )
      .then((results) => {
        const combinedMovies = results.flatMap((result) => result.results);
        setMovies(combinedMovies); // Stocke la liste complète des films
        setFilteredMovies(combinedMovies); // Initialise la liste filtrée
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des films :', error);
      });

    // Appel API pour récupérer les genres
    fetch(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=522d421671cf75c2cba341597d86403a',
    )
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.genres); // Stocke la liste des genres
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des genres :', error);
      });
  }, []);

  // Filtrer les films en fonction du terme de recherche et du genre sélectionné
  useEffect(() => {
    let filtered = movies;

    // Filtrer par genre si un genre est sélectionné
    if (selectedGenre) {
      filtered = filtered.filter((movie) =>
        movie.genre_ids.includes(parseInt(selectedGenre)),
      );
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Trier par votes si activé
    if (sortByVotes) {
      filtered = [...filtered].sort((a, b) => b.vote_average - a.vote_average);
    }

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre, sortByVotes]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenue sur Bigfoot2</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <AddMovieForm />

        {/*on englobe le champ de recherche et le menu déroulant dans une div pour leur appliquer une mise en page particulière*/}
        <div className="filters-container">
          {/* Champ de recherche */}
          <input
            type="text"
            placeholder="Rechercher un film ..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="search-input"
          />

          {/* Menu déroulant pour les genres */}
          <select
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.target.value)}
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
            {sortByVotes ? 'Désactiver le tri par likes' : 'Trier par likes'}
          </button>
        </div>

        {/* Affichage des films populaires */}
        <h2>Films populaires</h2>
        <div className="movies-list">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <h3>{movie.title}</h3>
                <p>Date de sortie : {movie.release_date}</p>
                <p>Note moyenne : {movie.vote_average} / 10</p>
              </div>
            ))
          ) : (
            <p>Aucun film trouvé pour les critères sélectionnés.</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default Home;
