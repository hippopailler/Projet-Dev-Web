import { EntitySchema } from 'typeorm';

const Review = new EntitySchema({
  name: 'Review',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    content: {
      type: 'text',
    },
    rating: {
      type: 'float',
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    user_id: {
      type: 'int',
    },
    movie_id: {
      type: 'int',
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'user_id' },
    },
    movie: {
      type: 'many-to-one',
      target: 'Movie',
      joinColumn: { name: 'movie_id' },
    },
  },
});

export default Review;
