const CommentService = require("../services/comments.service");

class CommentController {
  commentService = new CommentService();

  getComment = async (req, res) => {
    const { post_id } = req.params;
    const getComment = await this.commentService.getComment(post_id);

    if (getComment.errorMessage) {
      return res.status(getComment.code).json({
        errorMessage: getComment.errorMessage,
      });
    } else {
      return res.status(200).json({
        Comments: getComment,
      });
    }
  };

  createComment = async (req, res) => {
    const { user_id } = res.locals.user;
    const { post_id } = req.params;
    const { comment } = req.body;

    const createComment = await this.commentService.createComment(comment, user_id, post_id);

    if (createComment.errorMessage) {
      return res.status(createComment.code).json({
        errorMessage: createComment.errorMessage,
      });
    } else {
      return res.status(201).json({
        message: "댓글 생성 완료",
      });
    }
  };

  modifyComment = async (req, res) => {
    const { user_id } = res.locals.user;
    const { post_id, comment_id } = req.params;
    const { comment } = req.body;

    const modifyComment = await this.commentService.modifyComment(
      comment,
      user_id,
      post_id,
      comment_id
    );

    if (modifyComment.errorMessage) {
      return res.status(modifyComment.code).json({
        errorMessage: modifyComment.errorMessage,
      });
    } else {
      return res.status(201).json({
        message: "댓글 수정 완료",
      });
    }
  };

  deleteCommnet = async (req, res) => {
    const { user_id } = res.locals.user;
    const { post_id, comment_id } = req.params;

    const deleteComment = await this.commentService.deleteComment(user_id, post_id, comment_id);

    if (deleteComment.errorMessage) {
      return res.status(deleteComment.code).json({
        errorMessage: deleteComment.errorMessage,
      });
    } else {
      return res.status(204).json();
    }
  };
}

module.exports = CommentController;
