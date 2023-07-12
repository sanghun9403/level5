const PostService = require("../services/posts.service");

class PostController {
  postService = new PostService();

  getPost = async (req, res) => {
    const getPost = await this.postService.getPostAll();
    if (getPost.errorMessage) {
      return res.status(getPost.code).json({
        errorMessage: getPost.errorMessage,
      });
    } else {
      return res.status(200).json({
        Posts: getPost,
      });
    }
  };

  getPostDetail = async (req, res) => {
    const { post_id } = req.params;
    const getPostDetail = await this.postService.getPostDetail(post_id);

    if (getPostDetail.errorMessage) {
      return res.status(getPostDetail.code).json({
        errorMessage: getPostDetail.errorMessage,
      });
    } else {
      return res.status(200).json({
        Detail: getPostDetail,
      });
    }
  };

  createPost = async (req, res) => {
    const { user_id } = res.locals.user;
    const { title, content } = req.body;

    const createPost = await this.postService.createPost(title, content, user_id, res);

    if (createPost.errorMessage) {
      return res.status(createPost.code).json({
        errorMessage: createPost.errorMessage,
      });
    } else {
      return res.status(201).json({
        message: "게시글 생성완료",
      });
    }
  };

  modifyPost = async (req, res) => {
    const { post_id } = req.params;
    const { user_id } = res.locals.user;
    const { title, content } = req.body;
    console.log(user_id);
    const modifyPost = await this.postService.modifyPost(title, content, user_id, post_id);

    if (modifyPost.errorMessage) {
      return res.status(modifyPost.code).json({
        errorMessage: modifyPost.errorMessage,
      });
    } else {
      return res.status(201).json({
        message: "게시글 수정 완료",
      });
    }
  };

  deletePost = async (req, res) => {
    const { post_id } = req.params;
    const { user_id } = res.locals.user;

    const deletePost = await this.postService.deletePost(user_id, post_id);

    if (deletePost.errorMessage) {
      return res.status(deletePost.code).json({
        errorMessage: deletePost.errorMessage,
      });
    } else {
      return res.status(204).json();
    }
  };
}

module.exports = PostController;
