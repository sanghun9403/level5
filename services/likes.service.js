const LikeRepository = require("../repositories/likes.repository");

class LikeService {
  likeRepository = new LikeRepository();

  likeFunc = async (user_id, post_id) => {
    try {
      const likeFunc = await this.likeRepository.likeFunc(user_id, post_id);
      return { code: 200, message: likeFunc.message, likeCount: likeFunc.likeCount };
    } catch (err) {
      return { code: 400, errorMessage: "좋아요 생성 실패." };
    }
  };

  getLikePosts = async (user_id) => {
    const getLikePosts = await this.likeRepository.getLikePosts(user_id);

    try {
      if (getLikePosts) {
        return getLikePosts;
      }
    } catch {
      return { code: 400, errorMessage: "좋아요 게시글 조회에 실패하였습니다." };
    }
  };
}

module.exports = LikeService;
