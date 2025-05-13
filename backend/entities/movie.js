import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    title: {
      type: String,
    },
    release_date: {
      type: 'timestamp',
      nullable: true,
    },
    poster_path: {
      type: String,
      nullable: true,
    },
    overview: {
      type: String,
      nullable: true,
    }
  },
  relations: {
    usersLiked: {
      type: 'many-to-many',
      target: 'User',
      inverseSide: 'likedMovies',
    },
    usersWatchLater: {
      type: 'many-to-many',
      target: 'User',
      inverseSide: 'watchLaterMovies',
    },
    usersWatched: {
      type: 'many-to-many',
      target: 'User',
      inverseSide: 'watchedMovies',
    }
  }
});

export default Movie;
