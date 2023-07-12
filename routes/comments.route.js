const express = require("express");
const router = express.Router();

const CommentController = require("../controllers/comments.controller");
const commentController = new CommentController();
const auth = require("../middlewares/auth-middleware");

router.get("/posts/:post_id/comments", commentController.getComment);
router.post("/posts/:post_id/comments", auth, commentController.createComment);
router.put("/posts/:post_id/comments/:comment_id", auth, commentController.modifyComment);
router.delete("/posts/:post_id/comments/:comment_id", auth, commentController.deleteComment);

module.exports = router;
