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
  console.log('🚀 Début inscription - données reçues:', req.body);

  const userRepository = appDataSource.getRepository(User);
  try {
    // Validation des données
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.firstname ||
      !req.body.lastname
    ) {
      console.log('❌ Données manquantes:', req.body);

      return res.status(400).json({
        message: 'Tous les champs sont obligatoires',
      });
    }

    // Vérification si l'utilisateur existe
    const existingUser = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      console.log('❌ Email déjà utilisé:', req.body.email);

      return res.status(400).json({
        message: 'Un utilisateur avec cet email existe déjà',
      });
    }

    // Création de l'utilisateur
    const newUser = userRepository.create({
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    console.log('👤 Tentative création utilisateur:', newUser);

    const savedUser = await userRepository.save(newUser);
    console.log('✅ Utilisateur créé avec succès:', savedUser);

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
    console.error('❌ Erreur création utilisateur:', error);
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message,
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
  console.log('👉 Tentative de connexion:', req.body);
  const userRepository = appDataSource.getRepository(User);

  try {
    const user = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');

      return res.status(401).json({
        message: 'Email ou mot de passe incorrect',
      });
    }

    if (user.password !== req.body.password) {
      console.log('❌ Mot de passe incorrect');

      return res.status(401).json({
        message: 'Email ou mot de passe incorrect',
      });
    }

    console.log('✅ Connexion réussie pour:', user.email);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error('❌ Erreur connexion:', error);
    res.status(500).json({
      message: 'Erreur lors de la connexion',
      error: error.message,
    });
  }
});

// Route pour ajouter un film à une liste
router.post('/:userId/:listType-movies/:movieId', async (req, res) => {
  try {
    const { userId, listType, movieId } = req.params;
    const movieData = req.body;

    console.log("📝 Tentative d'ajout film:", {
      userId,
      listType,
      movieId,
      movieData,
    });

    const safeListType = listType.replace('-', '_');
    const safeTableName = `user_${safeListType}_movies`;

    // 1. Vérifier si le film existe déjà dans la table movie
    const [existingMovie] = await appDataSource.query(
      'SELECT * FROM movie WHERE id = $1',
      [movieId],
    );

    // 2. Si non, le créer
    if (!existingMovie) {
      await appDataSource.query(
        `INSERT INTO movie (id, title, poster_path, release_date, vote_average) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          movieId,
          movieData.title,
          movieData.poster_path,
          movieData.release_date,
          movieData.vote_average,
        ],
      );
    }

    // 3. Ajouter le film à la liste de l'utilisateur
    await appDataSource.query(
      `INSERT INTO ${safeTableName} (userid, movieid) 
       VALUES ($1, $2) 
       ON CONFLICT (userid, movieid) DO NOTHING`,
      [userId, movieId],
    );

    res.status(201).json({ message: 'Film ajouté avec succès' });
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout:", error);
    res.status(500).json({
      message: "Erreur lors de l'ajout du film",
      error: error.message,
    });
  }
});

// Route pour supprimer un film d'une liste
router.delete('/:userId/:listType-movies/:movieId', async (req, res) => {
  try {
    const { userId, listType, movieId } = req.params;

    const safeListType = listType.replace('-', '_');
    const safeTableName = `user_${safeListType}_movies`;

    await appDataSource.query(
      `DELETE FROM ${safeTableName}
       WHERE userid = $1 AND movieid = $2`,
      [userId, movieId],
    );

    res.status(200).json({ message: 'Film supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression',
      error: error.message,
    });
  }
});

// Route pour récupérer une liste
router.get('/:userId/:listType-movies', async (req, res) => {
  try {
    const { userId, listType } = req.params;

    const safeListType = listType.replace('-', '_');
    const safeTableName = `user_${safeListType}_movies`;

    console.log('📊 Récupération des films:', {
      userId,
      listType,
      tableName: safeTableName,
    });

    const movies = await appDataSource.query(
      `SELECT m.* 
       FROM movie m 
       JOIN ${safeTableName} ul ON m.id = ul.movieid 
       WHERE ul.userid = $1`,
      [userId],
    );

    console.log(`✅ Films récupérés pour ${listType}:`, movies.length);
    res.json(movies);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération',
      error: error.message,
    });
  }
});

export default router;
