import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';

const router = express.Router();

// Route GET modifiée pour récupérer tous les films
router.get('/', function (req, res) {
  console.log('GET request received on /api/movies');

  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movies) {
      res.json({ movies: movies });
    })
    .catch(function (error) {
      console.error('Erreur lors de la récupération des films:', error);
      res
        .status(500)
        .json({ message: 'Erreur lors de la récupération des films' });
    });
});

// Nouvelle route POST modifiée
router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    release_date: req.body.release_date,
  });

  movieRepository
    .insert(newMovie)
    .then(function (newDocument) {
      res.status(201).json({
        message: 'Film ajouté avec succès',
        movie: newDocument,
      });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la création du film' });
    });
});

export default router;
