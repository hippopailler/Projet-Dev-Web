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

router.post('/new', async function (req, res) {
  console.log('Données reçues dans le backend:', req.body);

  const userRepository = appDataSource.getRepository(User);
  try {
    // Vérification si l'utilisateur existe déjà
    const existingUser = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      console.log('Email déjà utilisé:', req.body.email);

      return res.status(400).json({
        message: 'Un utilisateur avec cet email existe déjà',
      });
    }

    // Création du nouvel utilisateur
    const newUser = userRepository.create({
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    console.log('Tentative de création utilisateur:', newUser);

    const savedUser = await userRepository.save(newUser);
    console.log('Utilisateur créé avec succès:', savedUser);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
      },
    });
  } catch (error) {
    console.error('Erreur détaillée serveur:', error);
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message,
      stack: error.stack,
    });
  }
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
  console.log('Tentative de connexion:', req.body);
  const userRepository = appDataSource.getRepository(User);

  try {
    const user = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (!user || user.password !== req.body.password) {
      console.log(
        'Échec authentification:',
        !user ? 'Utilisateur non trouvé' : 'Mot de passe incorrect',
      );

      return res.status(401).json({
        message: 'Email ou mot de passe incorrect',
      });
    }

    console.log('Connexion réussie pour:', user.email);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Routes pour les listes de films
router.get('/:userId/liked-movies', async function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  try {
    console.log('Récupération des films aimés pour userId:', req.params.userId);

    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.userId) },
      relations: ['likedMovies'],
    });

    if (!user) {
      console.log('Utilisateur non trouvé');

      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    console.log('Films trouvés:', user.likedMovies);
    res.json(user.likedMovies || []);
  } catch (error) {
    console.error('Erreur complète:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des films aimés',
      error: error.message,
    });
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
  const movieRepository = appDataSource.getRepository('Movie');

  try {
    console.log(
      'Ajout film aux favoris - userId:',
      req.params.userId,
      'movieId:',
      req.params.movieId,
    );

    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.userId) },
      relations: ['likedMovies'],
    });

    if (!user) {
      console.log('Utilisateur non trouvé');

      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const movie = await movieRepository.findOne({
      where: { id: parseInt(req.params.movieId) },
    });

    if (!movie) {
      console.log('Film non trouvé, création...');
      // Si le film n'existe pas, on le crée
      const newMovie = movieRepository.create({
        id: parseInt(req.params.movieId),
        title: req.body.title || 'Sans titre',
        release_date: req.body.release_date || new Date(),
      });
      await movieRepository.save(newMovie);
      user.likedMovies.push(newMovie);
    } else {
      console.log('Film trouvé, ajout aux favoris');
      user.likedMovies.push(movie);
    }

    await userRepository.save(user);
    console.log('Film ajouté avec succès');

    res.status(201).json({
      message: 'Film ajouté aux favoris',
      movie: movie,
    });
  } catch (error) {
    console.error('Erreur complète:', error);
    res.status(500).json({
      message: "Erreur lors de l'ajout du film aux favoris",
      error: error.message,
    });
  }
});

// Pour watch-later
router.post('/:userId/watch-later-movies/:movieId', async function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({
      where: { id: req.params.userId },
      relations: ['watchLaterMovies'],
    });
    const movie = await appDataSource.getRepository('Movie').findOne({
      where: { id: req.params.movieId },
    });

    user.watchLaterMovies.push(movie);
    await userRepository.save(user);

    res
      .status(201)
      .json({ message: 'Film ajouté à la liste "à voir plus tard"' });
  } catch (error) {
    console.error('Erreur:', error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du film à la liste" });
  }
});

// Pour watched
router.post('/:userId/watched-movies/:movieId', async function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({
      where: { id: req.params.userId },
      relations: ['watchedMovies'],
    });
    const movie = await appDataSource.getRepository('Movie').findOne({
      where: { id: req.params.movieId },
    });

    user.watchedMovies.push(movie);
    await userRepository.save(user);

    res.status(201).json({ message: 'Film ajouté à la liste "déjà vu"' });
  } catch (error) {
    console.error('Erreur:', error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du film à la liste" });
  }
});

router.delete('/:userId/:listType-movies/:movieId', async (req, res) => {
  try {
    const { userId, listType, movieId } = req.params;
    const user = await userRepository.findOne({
      where: { id: parseInt(userId) },
      relations: [`${listType}Movies`],
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Retirer le film de la liste appropriée
    user[`${listType}Movies`] = user[`${listType}Movies`].filter(
      (movie) => movie.id !== parseInt(movieId),
    );

    await userRepository.save(user);
    res.status(200).json({ message: 'Film supprimé avec succès' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du film' });
  }
});

export default router;
