import express from 'express';
import { appDataSource } from '../datasource.js';
import Review from '../entities/review.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await appDataSource.getRepository(Review).find({
      relations: {
        user: true,
        movie: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
    console.log('Reviews récupérées avec succès:', reviews);
    res.json(reviews);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des reviews',
      error: error.message,
    });
  }
});

router.post('/new', async (req, res) => {
  try {
    const { content, rating, user_id, movie_id } = req.body;
    const review = await appDataSource.getRepository(Review).save({
      content,
      rating,
      user_id,
      movie_id,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error('Erreur création review:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
