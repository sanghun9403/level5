const PostRepository = require("../repositories/posts.repository");

class PostService {
  postRepository = new PostRepository();

  getPostAll = async () => {
    const getPost = await this.postRepository.getPostAll();
    try {
      if (!getPost.length) {
        return { code: 404, errorMessage: "게시글이 없습니다." };
      }
      return getPost;
    } catch {
      return { code: 400, errorMessage: "게시글 조회에 실패하였습니다." };
    }
  };

  getPostDetail = async (post_id) => {
    const postDetail = await this.postRepository.getPostDetail(post_id);

    try {
      if (!postDetail) {
        return { code: 404, errorMessage: "해당 ID로 작성된 게시글이 없습니다." };
      }
      return postDetail;
    } catch {
      return { code: 404, errorMessage: "게시글 조회에 실패하였습니다." };
    }
  };

  createPost = async (title, content, user_id, res) => {
    const user = res.locals.user;

    try {
      if (!title || !content) {
        return { code: 412, errorMessage: "제목과 내용을 입력해주세요" };
      }
      await this.postRepository.createPost(title, content, user_id, user);
    } catch {
      return { code: 400, errorMessage: "게시글 생성에 실패하였습니다." };
    }
  };

  modifyPost = async (title, content, user_id, post_id) => {
    const post = await this.postRepository.getPostDetail(post_id);

    try {
      if (!post) {
        return { code: 404, errorMessage: "해당 게시글을 찾을 수 없습니다." };
      } else if (!title && !content) {
        return { code: 400, errorMessage: "제목과 내용을 입력해주세요." };
      } else if (post.user_id != user_id) {
        return { code: 403, errorMessage: "수정 권한이 없습니다." };
      }
      await this.postRepository.modifyPost(title, content, user_id, post_id);
      return true;
    } catch {
      return { code: 400, errorMessage: "게시글 수정에 실패하였습니다." };
    }
  };

  deletePost = async (user_id, post_id) => {
    const post = await this.postRepository.getPostDetail(post_id);

    try {
      if (!post) {
        return { code: 404, errorMessage: "해당 게시글을 찾을 수 없습니다." };
      } else if (post.user_id != user_id) {
        return { code: 403, errorMessage: "삭제 권한이 없습니다." };
      }
      await this.postRepository.deletePost(user_id, post_id);
      return true;
    } catch {
      return { code: 400, errorMessage: "게시글 삭제에 실패하였습니다." };
    }
  };
}

module.exports = PostService;
