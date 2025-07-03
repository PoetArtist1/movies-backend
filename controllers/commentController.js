const db = require('../db');

const addComment = async (req, res) => {
  const { movie_id, text, score } = req.body;
  const user_id = req.user.id;
  const { rows } = await db.query(
    `INSERT INTO comments (user_id, movie_id, text, score) VALUES ($1,$2,$3,$4) RETURNING *`,
    [user_id, movie_id, text, score]
  );
  res.json(rows[0]);
};

const getCommentsByMovie = async (req, res) => {
  const movieId = req.params.movieId;
  const { rows } = await db.query(
    `SELECT c.*, u.username, u.role FROM comments c
     JOIN users u ON u.id=c.user_id
     WHERE movie_id=$1 ORDER BY id DESC`,
    [movieId]
  );
  res.json(rows);
};

const updateComment = async (req, res) => {
  const { text, score } = req.body;
  const { rows } = await db.query(
    `UPDATE comments SET text=$1, score=$2 WHERE id=$3 RETURNING *`,
    [text, score, req.params.id]
  );
  res.json(rows[0]);
};

const deleteComment = async (req, res) => {
  await db.query(`DELETE FROM comments WHERE id=$1`, [req.params.id]);
  res.json({ msg: 'Comentario eliminado' });
};

module.exports = { addComment, getCommentsByMovie, updateComment, deleteComment };
