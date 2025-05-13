/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import './FilterBar.css';

const FilterBar = ({
  searchTerm,
  selectedGenre,
  genres,
  sortByVotes,
  onSearchChange,
  onGenreChange,
  onSortChange,
}) => {
  return (
    <div className="filters-container">
      <input
        type="text"
        placeholder="Rechercher un film..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <select
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
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
        onClick={() => onSortChange(!sortByVotes)}
        className="sort-button"
        title={sortByVotes ? "Revenir à l'ordre initial" : 'Trier par note'}
      >
        {sortByVotes ? '🔄 Ordre initial' : '⭐ Trier par note'}
      </button>
    </div>
  );
};

FilterBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  selectedGenre: PropTypes.string.isRequired,
  genres: PropTypes.array.isRequired,
  sortByVotes: PropTypes.bool.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onGenreChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default FilterBar;
