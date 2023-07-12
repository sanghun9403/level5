const { Post, Like } = require("../models");
const { Op, Sequelize } = require("sequelize");

class PostRepository {
  getPostAll = async () => {
    const getPostAll = await Post.findAll({
      attributes: [
        "post_id",
        "user_id",
        "title",
        "nickname",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("COUNT", Sequelize.col("Like.post_id")), "likes"],
      ],
      include: [
        {
          model: Like,
          attributes: [],
        },
      ],
      group: ["post_id"],
      order: [["createdAt", "DESC"]],
    });

    return getPostAll;
  };

  getPostDetail = async (post_id) => {
    const getPostDetail = await Post.findOne({
      attributes: ["post_id", "user_id", "title", "nickname", "content", "createdAt", "updatedAt"],
      where: { post_id },
    });
    return getPostDetail;
  };

  createPost = async (title, content, user_id, user) => {
    const createPost = await Post.create({
      user_id: user_id,
      nickname: user.nickname,
      title,
      content,
    });

    return createPost;
  };

  modifyPost = async (title, content, user_id, post_id) => {
    const modifyPost = await Post.update(
      { title, content },
      { where: { [Op.and]: [{ post_id }, { user_id }] } }
    );

    return modifyPost;
  };

  deletePost = async (user_id, post_id) => {
    const deletePost = await Post.destroy({
      where: {
        [Op.and]: [{ user_id }, { post_id }],
      },
    });

    return deletePost;
  };
}

module.exports = PostRepository;
