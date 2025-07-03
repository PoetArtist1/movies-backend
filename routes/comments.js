const router = require('express').Router();
const { addComment, getCommentsByMovie, updateComment, deleteComment } = require('../controllers/commentController');
const { authenticate } = require('../controllers/authController');

router.use(authenticate);

router.post('/', addComment);
router.get('/movie/:movieId', getCommentsByMovie);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;
