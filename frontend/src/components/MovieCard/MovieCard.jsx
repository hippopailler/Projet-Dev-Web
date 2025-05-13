/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import './MovieCard.css';

const MovieCard = ({ movie, onMovieClick, onAddToList, isAuthenticated }) => {
  const handleListAction = (e, listType) => {
    e.stopPropagation();
    onAddToList(movie.id, listType);
  };

  return (
    <div className="movie-card" onClick={() => onMovieClick(movie)}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <h3>{movie.title}</h3>
      <p>Date de sortie : {movie.release_date}</p>
      <p>Note moyenne : {movie.vote_average} / 10</p>

      {isAuthenticated && (
        <div className="movie-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="action-button like"
            onClick={(e) => handleListAction(e, 'liked')}
            title="Ajouter aux favoris"
          >
            ❤️
          </button>
          <button
            className="action-button watch-later"
            onClick={(e) => handleListAction(e, 'watchLater')}
            title="À voir plus tard"
          >
            🕒
          </button>
          <button
            className="action-button watched"
            onClick={(e) => handleListAction(e, 'watched')}
            title="Déjà vu"
          >
            ✅
          </button>
        </div>
      )}
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired,
  onMovieClick: PropTypes.func.isRequired,
  onAddToList: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default MovieCard;
