const db = require('../db');

const getAllUsers = async (req, res) => {
  const { rows } = await db.query(`SELECT id, username, role FROM users`);
  res.json(rows);
};

const getUserById = async (req, res) => {
  const { rows } = await db.query(`SELECT id, username, role FROM users WHERE id=$1`, [req.params.id]);
  res.json(rows[0]);
};

const updateUser = async (req, res) => {
  const { username, role } = req.body;
  const { rows } = await db.query(
    `UPDATE users SET username=$1, role=$2 WHERE id=$3 RETURNING id, username, role`,
    [username, role, req.params.id]
  );
  res.json(rows[0]);
};

const deleteUser = async (req, res) => {
  await db.query(`DELETE FROM users WHERE id=$1`, [req.params.id]);
  res.json({ msg: 'Usuario eliminado' });
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
