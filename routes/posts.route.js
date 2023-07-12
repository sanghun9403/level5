const express = require("express");
const router = express.Router();

const PostController = require("../controllers/posts.controller");
const postController = new PostController();
const auth = require("../middlewares/auth-middleware");

router.get("/posts", postController.getPost);
router.get("/posts/:post_id", postController.getPostDetail);
router.post("/posts", auth, postController.createPost);
router.patch("/posts/:post_id", auth, postController.modifyPost);
router.delete("/posts/:post_id", auth, postController.deletePost);

module.exports = router;
