const express = require(`express`);
const router = express.Router();
const { Posts, Likes } = require(`../models`);
const { validateToken } = require(`../middleware/AuthMiddleware`);

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });

  const likedPost = await Likes.findAll({ where: { UserId: req.user.id } });

  try {
    res.json({ listOfPosts: listOfPosts, likedPost: likedPost });
  } catch (e) {
    console.log(e);
  }
});

router.get(`/byId/:id`, async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get(`/byuserId/:id`, async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.post(`/`, validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);

  res.json(post);
});

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
});

router.delete(`/:postId`, validateToken, async (req, res) => {
  const postId = req.params.postId;

  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("Post Deleted Successfully");
});

module.exports = router;
