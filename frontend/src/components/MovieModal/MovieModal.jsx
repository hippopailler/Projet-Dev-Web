/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import './MovieModal.css';

const MovieModal = ({ movie, onClose }) => {
  return (
    <div className="movie-modal-overlay" onClick={onClose}>
      <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="modal-content">
          <div className="modal-image">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </div>
          <div className="modal-details">
            <h2>{movie.title}</h2>
            <p>
              <strong>Synopsis :</strong> {movie.overview}
            </p>
            <p>
              <strong>Date de sortie :</strong> {movie.release_date}
            </p>
            <p>
              <strong>Note :</strong> {movie.vote_average}/10 (
              {movie.vote_count} votes)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

MovieModal.propTypes = {
  movie: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MovieModal;
