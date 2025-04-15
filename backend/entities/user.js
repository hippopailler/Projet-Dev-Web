import typeorm from 'typeorm';

const User = new typeorm.EntitySchema({
  name: 'User',
  columns: {
    id: {
      primary: true,
      generated: 'uuid',
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String }, // Pour l'authentification
  },
  relations: {
    likedMovies: {
      type: 'many-to-many',
      target: 'Movie',
      joinTable: true,
      cascade: true,
    },
    watchLaterMovies: {
      type: 'many-to-many',
      target: 'Movie',
      joinTable: true,
      cascade: true,
    },
    watchedMovies: {
      type: 'many-to-many',
      target: 'Movie',
      joinTable: true,
      cascade: true,
    },
  },
});

export default User;
