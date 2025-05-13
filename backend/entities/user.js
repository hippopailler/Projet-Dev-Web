import typeorm from 'typeorm';

const User = new typeorm.EntitySchema({
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,  // Ajout du champ password
      nullable: false,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
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
