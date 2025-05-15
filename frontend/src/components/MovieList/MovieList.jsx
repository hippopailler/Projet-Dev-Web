/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import './MovieList.css';
import '../MovieCard/MovieCard.css';

const MovieList = ({ title, movies, onRemove }) => {
  return (
    <div className="movie-list">
      <h3>{title}</h3>
      {!movies || movies.length === 0 ? (
        <p className="empty-list">Aucun film dans cette liste</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <button
                className="remove-button"
                onClick={() => onRemove(movie.id)}
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
                <div className="no-poster">
                  <span>{movie.title[0]}</span>
                </div>
              )}
              <div className="movie-info">
                <h4>{movie.title}</h4>
                <p>
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : 'Date inconnue'}
                </p>
                <p className="movie-rating">
                  ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

MovieList.propTypes = {
  title: PropTypes.string.isRequired,
  movies: PropTypes.array,
  onRemove: PropTypes.func.isRequired,
};

export default MovieList;
