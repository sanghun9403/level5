const express = require("express");
const router = express.Router();

const LikeController = require("../controllers/likes.controller");
const likeController = new LikeController();
const auth = require("../middlewares/auth-middleware");

router.post("/posts/:post_id/like", auth, likeController.likeFunc);
router.get("/user/posts/like", auth, likeController.getLikePosts);

module.exports = router;
