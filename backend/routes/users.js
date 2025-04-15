import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(User)
    .find({})
    .then(function (users) {
      res.json({ users: users });
    });
});

router.post('/new', function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  const newUser = userRepository.create({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });

  userRepository
    .insert(newUser)
    .then(function (newDocument) {
      res.status(201).json(newDocument);
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `User with email "${newUser.email}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the user' });
      }
    });
});

router.delete('/:userId', function (req, res) {
  appDataSource
    .getRepository(User)
    .delete({ id: req.params.userId })
    .then(function () {
      res.status(204).json({ message: 'User successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

// Route pour la connexion
router.post('/login', async function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (!user || user.password !== req.body.password) {
      return res
        .status(401)
        .json({ message: 'Email ou mot de passe incorrect' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Routes pour les listes de films
router.get('/:userId/liked-movies', async function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({
      where: { id: req.params.userId },
      relations: ['likedMovies'],
    });
    res.json(user.likedMovies);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des films aimés' });
  }
});

// Routes pour les listes de watch-later-movies
router.get('/:userId/watch-later-movies', async function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({
      where: { id: req.params.userId },
      relations: ['watchLaterMovies'],
    });
    res.json(user.watchLaterMovies);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des films à voir' });
  }
});

// Route pour les films déjà vus
router.get('/:userId/watched-movies', async function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({
      where: { id: req.params.userId },
      relations: ['watchedMovies'],
    });
    res.json(user.watchedMovies);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des films vus' });
  }
});

// Routes pour ajouter des films aux différentes listes
router.post('/:userId/liked-movies/:movieId', async function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({
      where: { id: req.params.userId },
      relations: ['likedMovies'],
    });
    const movie = await appDataSource.getRepository('Movie').findOne({
      where: { id: req.params.movieId },
    });

    user.likedMovies.push(movie);
    await userRepository.save(user);

    res.status(201).json({ message: 'Film ajouté aux favoris' });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du film aux favoris" });
  }
});

export default router;
