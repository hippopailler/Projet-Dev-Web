import express from 'express';

const router = express.Router();

// Routes à ajouter ici
router.get('/', function (req, res) {
  console.log('GET request received on /api/movies');
  res.json({ message: 'Liste des films' });
});

router.post('/new', function (req, res) {
  console.log('POST request received on /api/movies/new');
  console.log(req.body);
  res.json({ message: 'Film reçu' });
});
export default router;
