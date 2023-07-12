const LikeService = require("../services/likes.service");

class LikeController {
  likeService = new LikeService();

  likeFunc = async (req, res) => {
    const { user_id } = res.locals.user;
    const { post_id } = req.params;
    const like = await this.likeService.likeFunc(user_id, post_id);

    if (like.errorMessage) {
      return res.status(like.code).json({
        errorMessage: like.errorMessage,
      });
    } else {
      return res.status(like.code).json({
        message: like.message,
        likeCount: like.likeCount,
      });
    }
  };

  getLikePosts = async (req, res) => {
    const { user_id } = res.locals.user;

    const getLikePosts = await this.likeService.getLikePosts(user_id);

    if (getLikePosts.errorMessage) {
      return res.status(getLikePosts.code).json({
        errorMessage: getLikePosts.errorMessage,
      });
    } else {
      return res.status(200).json({
        LikePosts: getLikePosts,
      });
    }
  };
}

module.exports = LikeController;
