const { User, Comment } = require("../models");

class CommentRepository {
  getComment = async (post_id) => {
    const getComment = await Comment.findAll({
      where: { post_id },
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
      ],
    });

    return getComment;
  };

  createComment = async (comment, user_id, post_id) => {
    const createComment = await Comment.create({
      post_id: post_id,
      user_id: user_id,
      comment,
    });

    return createComment;
  };

  modifyComment = async (comment, comment_id) => {
    const modifyComment = await Comment.update({ comment }, { where: { comment_id } });

    return modifyComment;
  };

  deleteComment = async (comment_id) => {
    const deleteComment = await Comment.destroy({ where: { comment_id } });

    return deleteComment;
  };
}

module.exports = CommentRepository;
