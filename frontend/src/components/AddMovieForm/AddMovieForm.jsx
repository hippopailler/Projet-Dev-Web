import { useState } from 'react';
import axios from 'axios';
import './AddMovieForm.css';

const DEFAULT_FORM_VALUES = {
  title: '',
  release_date: '',
};

function AddMovieForm() {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Appel à l'API TMDB pour rechercher le film
      const searchResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=522d421671cf75c2cba341597d86403a&query=${formValues.title}`,
      );

      if (searchResponse.data.results.length > 0) {
        const movieData = searchResponse.data.results[0];

        // Envoi des données au backend
        await axios.post(`${import.meta.env.VITE_BACKDEND_URL}/movies/new`, {
          title: movieData.title,
          release_date: movieData.release_date,
        });

        setMessage({
          text: 'Film ajouté avec succès à la base de données !',
          type: 'success',
        });
        setFormValues(DEFAULT_FORM_VALUES);
      } else {
        setMessage({
          text: "Film non trouvé dans l'API TMDB",
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({
        text: "Erreur lors de l'ajout du film",
        type: 'error',
      });
    }
  };

  return (
    <div className="add-movie-form-container">
      <form className="add-movie-form" onSubmit={handleSubmit}>
        <input
          className="add-movie-input"
          type="text"
          placeholder="Titre du film"
          value={formValues.title}
          onChange={(e) =>
            setFormValues({ ...formValues, title: e.target.value })
          }
          required
        />
        <button className="add-movie-button" type="submit">
          Ajouter le film
        </button>
      </form>
      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
}

export default AddMovieForm;
