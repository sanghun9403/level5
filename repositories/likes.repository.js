const { Like, Post } = require("../models");
const PostRepository = require("../repositories/posts.repository");
const { Op, Sequelize } = require("sequelize");

class LikeRepository {
  postRepository = new PostRepository();

  likeFunc = async (user_id, post_id) => {
    const duplicateCheck = await Like.findOne({
      where: {
        [Op.and]: [{ post_id: post_id }, { user_id: user_id }],
      },
    });
    if (duplicateCheck) {
      await duplicateCheck.destroy();
      const likeCount = await Like.count({ where: { post_id: post_id } });
      return { message: "좋아요 취소", likeCount };
    }

    await Like.create({ user_id: user_id, post_id: post_id });
    const likeCount = await Like.count({ where: { post_id: post_id } });
    return { message: "좋아요 완료", likeCount };
  };

  getLikePosts = async (user_id) => {
    const getLikePosts = await Post.findAll({
      attributes: [
        "post_id",
        "user_id",
        "nickname",
        "title",
        "createdAt",
        "updatedAt",
        [
          Sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.post_id = Post.post_id)`),
          "likes",
        ],
        /* [Sequelize.fn("COUNT", Sequelize.col("Likes.likeId")), "likes"]을 사용하게 되면 
          하나의 게시글만 출력되는 현상이 있어서 Sequelize문법을 찾아보니 쿼리문자열(literal)을
           사용하면 쿼리를 날릴 수 있다고 하여 적용*/
      ],
      include: [
        {
          model: Like,
          attributes: [],
          where: { user_id: user_id },
          required: true,
        },
      ],
      order: [
        [Sequelize.literal("likes"), "DESC"],
        ["createdAt", "DESC"],
      ], // alias를 적용한 likes를 Sequelize.literal을 사용하여 불러옴
    });
    return getLikePosts;
  };
}

module.exports = LikeRepository;
