const router = require('express').Router();
const { getMovies, getMovieById, fetchAndStoreMovie } = require('../controllers/movieController');
const { authenticate } = require('../controllers/authController');

router.use(authenticate);

router.get('/', getMovies);              // ?search=&category=&sortBy=score|date
router.get('/:id', getMovieById);       // detalle
router.post('/fetch/:tmdbId', fetchAndStoreMovie); // fuerza fetch desde TMDB

module.exports = router;
