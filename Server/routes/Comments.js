const express = require(`express`);
const { validateToken } = require("../middleware/AuthMiddleware");
const router = express.Router();
const { Comments } = require(`../models`);

router.get(`/:postId`, async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { postId: postId } });
  res.json(comments);
});

router.post(`/`, validateToken, async (req, res) => {
  const comment = req.body;
  comment.username = req.user.username;
  await Comments.create(comment);
  res.json(comment);
});

router.delete(`/:commentId`, validateToken, async (req, res) => {
  const commentId = req.params.commentId;

  await Comments.destroy({
    where: {
      id: commentId,
    },
  });

  res.json("Deleted Successfully");
});

module.exports = router;
