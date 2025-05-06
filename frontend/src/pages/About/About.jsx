/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './terresvg.svg';
import './About.css';
import AddMovieForm from '../../components/AddMovieForm/AddMovieForm';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]); // Liste complète des films
  const [filteredMovies, setFilteredMovies] = useState([]); // Liste des films filtrés
  const [searchTerm, setSearchTerm] = useState(''); // Terme de recherche
  const [genres, setGenres] = useState([]); // Liste des genres
  const [selectedGenre, setSelectedGenre] = useState(''); // Genre sélectionné
  const [sortByVotes, setSortByVotes] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); // Nouveau state pour le film sélectionné
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fonction pour gérer le clic sur un film
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fonction pour gérer l'ajout aux listes
  const handleAddToList = async (movieId, listType) => {
    if (!user) {
      alert('Veuillez vous connecter pour ajouter des films à vos listes');

      return;
    }

    try {
      let endpoint;
      switch (listType) {
        case 'liked':
          endpoint = `liked-movies`;
          break;
        case 'watchLater':
          endpoint = `watch-later-movies`;
          break;
        case 'watched':
          endpoint = `watched-movies`;
          break;
        default:
          return;
      }

      // On récupère d'abord la liste actuelle pour vérifier les doublons
      const currentList = await axios.get(
        `http://localhost:8080/api/users/${user.id}/${endpoint}`,
      );

      // Vérification des doublons
      if (currentList.data.some((movie) => movie.id === movieId)) {
        alert('Ce film est déjà dans votre liste');

        return;
      }

      // Si pas de doublon, on ajoute le film
      const response = await axios.post(
        `http://localhost:8080/api/users/${user.id}/${endpoint}/${movieId}`,
        {
          title: movies.find((m) => m.id === movieId).title,
          release_date: movies.find((m) => m.id === movieId).release_date,
          poster_path: movies.find((m) => m.id === movieId).poster_path,
          overview: movies.find((m) => m.id === movieId).overview,
        },
      );

      if (response.status === 201) {
        alert(`Film ajouté avec succès à votre liste "${listType}"`);
      }
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error);
      alert("Une erreur s'est produite lors de l'ajout du film à la liste");
    }
  };

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
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=17',
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=18',
      'https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&page=9',
    ];

    // Appels API en parallèle pour récupérer les films
    Promise.all(
      apiUrls.map((url) => fetch(url).then((response) => response.json())),
    )
      .then((results) => {
        const combinedMovies = results
          .flatMap((result) => result.results)
          .filter((movie) => movie && movie.id); // Vérifier que chaque film est valide
        const uniqueMovies = [
          ...new Map(combinedMovies.map((movie) => [movie.id, movie])).values(),
        ];
        setMovies(uniqueMovies);
        setFilteredMovies(uniqueMovies);
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
    // Créer une copie profonde du tableau original
    let filtered = [...movies];

    // Filtrer par genre
    if (selectedGenre) {
      filtered = filtered.filter((movie) =>
        movie.genre_ids?.includes(parseInt(selectedGenre)),
      );
    }

    // Filtrer par terme de recherche
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((movie) =>
        movie.title?.toLowerCase().includes(searchTermLower),
      );
    }

    // Trier par votes si activé
    if (sortByVotes) {
      // Création d'une nouvelle copie pour le tri
      filtered = [...filtered].sort((a, b) => b.vote_count - a.vote_count);
    }

    // Éliminer les doublons potentiels en utilisant les IDs
    filtered = filtered.filter(
      (movie, index, self) =>
        index === self.findIndex((m) => m.id === movie.id),
    );

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre, sortByVotes]);

  return (
    <div className="App">
      <div className="menu-container">
        <button className="btn" onClick={toggleMenu}>
          <span className="icon">
            <svg viewBox="0 0 175 80" width="40" height="40">
              <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
              <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
              <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
            </svg>
          </span>
          <span className="text">MENU</span>
        </button>

        <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="menu-item">Accueil</Link>
          <Link to="/users" className="menu-item">Mon Profil</Link>
          <Link to="/about" className="menu-item">À propos</Link>
        </div>
      </div>

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
          <button class="button">
            <div class="blob1"></div>
            <div class="blob2"></div>
            <div class="inner">Realism</div>
          </button>
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
            {sortByVotes ? 'Ordre initial' : 'Trier par popularité'}
          </button>
        </div>

        {/* Affichage des films populaires */}
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