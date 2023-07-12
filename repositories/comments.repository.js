const { User, Comment } = require("../models");
const { Op } = require("sequelize");

class CommentRepository {
  getComment = async (post_id) => {
    const comments = await Comment.findAll({
      where: { post_id },
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
      ],
    });

    const getComment = comments.map((comments) => {
      return {
        post_id: comments.post_id,
        comment_id: comments.comment_id,
        nickname: comments.User.nickname,
        comment: comments.comment,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      };
    });

    return getComment;
  };

  commentDetail = async (post_id) => {
    const comments = await Comment.findOne({
      where: { post_id },
    });
    return comments;
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
