import {
  ADD_POST,
  EDIT_POST,
  DELETE_POST,
  ADD_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
} from "../actions/actions";

const initialState = {
  posts: JSON.parse(localStorage.getItem("posts")) || [],
};

const saveToLocalStorage = (posts) => {
  localStorage.setItem("posts", JSON.stringify(posts));
};

const postReducer = (state = initialState, action) => {
  const posts = [...state.posts];

  switch (action.type) {
    case ADD_POST: {
      posts.unshift(action.payload);
      saveToLocalStorage(posts);
      return { ...state, posts };
    }

    case EDIT_POST: {
      const index = posts.findIndex((post) => post.id === action.payload.id);
      if (index !== -1) {
        posts[index] = { ...posts[index], ...action.payload };
        saveToLocalStorage(posts);
      }
      return { ...state, posts };
    }

    case DELETE_POST: {
      const index = posts.findIndex((post) => post.id === action.payload);
      if (index !== -1) {
        posts.splice(index, 1);
        saveToLocalStorage(posts);
      }
      return { ...state, posts };
    }

    case ADD_COMMENT: {
      const index = posts.findIndex(
        (post) => post.id === action.payload.postId
      );
      if (index !== -1) {
        if (!action.payload.parentCommentId) {
          if (!posts[index].comments) posts[index].comments = [];
          posts[index].comments.push(action.payload.comment);
        } else {
          const addNestedComment = (comments) => {
            return comments.map((comment) => {
              if (comment.id === action.payload.parentCommentId) {
                if (!comment.replies) comment.replies = [];
                comment.replies.push(action.payload.comment);
              } else if (comment.replies) {
                comment.replies = addNestedComment(comment.replies);
              }
              return comment;
            });
          };
          posts[index].comments = addNestedComment(posts[index].comments);
        }
        saveToLocalStorage(posts);
      }
      return { ...state, posts };
    }

    case EDIT_COMMENT: {
      const postIndex = posts.findIndex(
        (post) => post.id === action.payload.postId
      );
      if (postIndex !== -1) {
        const editNestedComment = (comments) => {
          return comments.map((comment) => {
            if (comment.id === action.payload.commentId) {
              return { ...comment, text: action.payload.newComment };
            } else if (comment.replies) {
              return {
                ...comment,
                replies: editNestedComment(comment.replies),
              };
            }
            return comment;
          });
        };
        posts[postIndex].comments = editNestedComment(
          posts[postIndex].comments
        );
        saveToLocalStorage(posts);
      }
      return { ...state, posts };
    }

    case DELETE_COMMENT: {
      const postIndex = posts.findIndex(
        (post) => post.id === action.payload.postId
      );
      if (postIndex !== -1) {
        const deleteNestedComment = (comments) => {
          return comments.filter((comment) => {
            if (comment.id === action.payload.commentId) {
              return false;
            }
            if (comment.replies) {
              comment.replies = deleteNestedComment(comment.replies);
            }
            return true;
          });
        };
        posts[postIndex].comments = deleteNestedComment(
          posts[postIndex].comments
        );
        saveToLocalStorage(posts);
      }
      return { ...state, posts };
    }

    default:
      return state;
  }
};

export default postReducer;
