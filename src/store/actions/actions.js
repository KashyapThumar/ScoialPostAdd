export const ADD_POST = "ADD_POST";
export const EDIT_POST = "EDIT_POST";
export const DELETE_POST = "DELETE_POST";

export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

// Post actions
export const addPost = (post) => ({
  type: ADD_POST,
  payload: post,
});

export const editPost = (post) => ({
  type: EDIT_POST,
  payload: post,
});

export const deletePost = (postId) => ({
  type: DELETE_POST,
  payload: postId,
});

// Comment actions
export const addComment = ({ postId, comment, parentCommentId = null }) => ({
  type: ADD_COMMENT,
  payload: { postId, comment, parentCommentId },
});

export const editComment = ({ postId, commentId, newComment }) => ({
  type: EDIT_COMMENT,
  payload: { postId, commentId, newComment },
});

export const deleteComment = ({ postId, commentId }) => ({
  type: DELETE_COMMENT,
  payload: { postId, commentId },
});
