import { useState } from 'react';
import './AddMovieForm.css';

const DEFAULT_FORM_VALUES = {
  title: '',
  genre: '',
};

function AddMovieForm() {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);
  const [movies, setMovies] = useState([]);

  const addMovie = (event) => {
    event.preventDefault();

    if (formValues.title === '' || formValues.genre === '') {
      console.error('Il faut remplir tous les champs');
      return;
    }

    setMovies([...movies, formValues]);
    setFormValues(DEFAULT_FORM_VALUES);
  };

  return (
    <div>
      <form className="add-movie-form" onSubmit={addMovie}>
        <input
          className="add-movie-input"
          type="text"
          placeholder="Titre du film"
          value={formValues.title}
          onChange={(event) =>
            setFormValues({ ...formValues, title: event.target.value })
          }
        />
        <input
          className="add-movie-input"
          type="text"
          placeholder="Genre"
          value={formValues.genre}
          onChange={(event) =>
            setFormValues({ ...formValues, genre: event.target.value })
          }
        />
        <button className="add-movie-button" type="submit">
          Add Movie
        </button>
      </form>
      <div className="movie-list">
        <h3>Movies List</h3>
        <ul>
          {movies.map((movie, index) => (
            <li key={index}>
              {movie.title} - {movie.genre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddMovieForm;