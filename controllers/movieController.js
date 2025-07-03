const db = require('../db');
const axios = require('axios');
require('dotenv').config();

const TMDB_URL = 'https://api.themoviedb.org/3';

async function fetchTMDB(tmdbId) {
  const res = await axios.get(`${TMDB_URL}/movie/${tmdbId}`, {
    params: { api_key: process.env.TMDB_API_KEY, language: 'es-ES' }
  });
  return res.data;
}

const getMovies = async (req, res) => {
  const { search = '', category, sortBy = 'tmdb_score', order = 'DESC' } = req.query;
  let sql = `SELECT * FROM movies WHERE title ILIKE $1`;
  const params = [`%${search}%`];
  if (category) {
    sql += ` AND actors ILIKE $${params.length + 1}`; 
    params.push(`%${category}%`);
  }
  sql += ` ORDER BY ${sortBy} ${order}`;
  const { rows } = await db.query(sql, params);
  res.json(rows);
};

const getMovieById = async (req, res) => {
  const movieId = req.params.id;
  const { rows } = await db.query(`SELECT * FROM movies WHERE id=$1`, [movieId]);
  let movie = rows[0];
  if (!movie) return res.status(404).json({ msg: 'Pelicula no encontrada' });
  // traer comentarios y score promedio
  const cRes = await db.query(
    `SELECT AVG(score) AS avg_score FROM comments WHERE movie_id=$1`, [movieId]
  );
  movie.user_score = parseFloat(cRes.rows[0].avg_score || 0).toFixed(1);
  res.json(movie);
};

const fetchAndStoreMovie = async (req, res) => {
  const tmdbId = req.params.tmdbId;
  // ¿Ya existe?
  const exists = await db.query(`SELECT * FROM movies WHERE tmdb_id=$1`, [tmdbId]);
  if (exists.rows.length > 0) return res.json(exists.rows[0]);
  // fetch
  const data = await fetchTMDB(tmdbId);
  const { title, overview: synopsis, release_date, poster_path, vote_average, credits } = data;
  // traer actores
  const actors = (credits?.cast || []).slice(0,5).map(a => a.name).join(', ');
  const cover = `https://image.tmdb.org/t/p/w500${poster_path}`;
  const { rows } = await db.query(
    `INSERT INTO movies (tmdb_id, title, synopsis, release_date, cover, actors, tmdb_score)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [tmdbId, title, synopsis, release_date, cover, actors, vote_average]
  );
  res.json(rows[0]);
};

module.exports = { getMovies, getMovieById, fetchAndStoreMovie };
