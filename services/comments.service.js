const CommentRepository = require("../repositories/comments.repository");

class CommentService {
  commentRepository = new CommentRepository();

  getComment = async (post_id) => {
    const getComment = await this.commentRepository.getComment(post_id);

    try {
      if (!getComment.length) {
        return { code: 404, errorMessage: "해당 게시글에 작성된 댓글이 없습니다." };
      }
      return getComment;
    } catch {
      return { code: 400, errorMessage: "댓글 조회에 실패하였습니다." };
    }
  };

  createComment = async (comment, user_id, post_id) => {
    const createComment = await this.commentRepository.createComment(comment, user_id, post_id);

    try {
      if (!comment) {
        return { code: 412, errorMessage: "내용을 입력해주세요." };
      }
      return true;
    } catch {
      return { code: 400, errorMessage: "댓글 생성에 실패하였습니다." };
    }
  };

  modifyComment = async (comment, user_id, post_id, comment_id) => {
    const getComment = await this.commentRepository.getComment(comment_id);

    try {
      if (!getComment) {
        return { code: 404, errorMessage: "해당 댓글을 찾을 수 없습니다." };
      } else if (!getComment.post_id != post_id) {
        return { code: 404, errorMessage: "해당 게시글에 작성된 댓글이 아닙니다." };
      } else if (getComment.user_id != user_id) {
        return { code: 403, errorMessage: "수정 권한이 없습니다." };
      }
      await this.commentRepository.modifyComment(comment, comment_id);
      return true;
    } catch {
      return { code: 400, errorMessage: "댓글 수정에 실패하였습니다." };
    }
  };

  deleteComment = async (user_id, post_id, comment_id) => {
    const getComment = await this.commentRepository.getComment(comment_id);

    try {
      if (!getComment) {
        return { code: 404, errorMessage: "해당 댓글을 찾을 수 없습니다." };
      } else if (!getComment.post_id != post_id) {
        return { code: 404, errorMessage: "해당 게시글에 작성된 댓글이 아닙니다." };
      } else if (getComment.user_id != user_id) {
        return { code: 403, errorMessage: "삭제 권한이 없습니다." };
      }
      await this.commentRepository.deleteComment(comment_id);
      return true;
    } catch {
      return { code: 400, errorMessage: "댓글 삭제에 실패하였습니다." };
    }
  };
}
