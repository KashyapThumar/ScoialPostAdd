import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Container,
  Box,
  TextField,
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import {
  deletePost,
  addComment,
  editComment,
  deleteComment,
} from "../../store/actions/actions";
import PostForm from "./PostForm";

const PostList = () => {
  const posts = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const [openForm, setOpenForm] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [currentPostId, setCurrentPostId] = useState(null);
  const [parentCommentId, setParentCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [expandedPostIds, setExpandedPostIds] = useState({});

  const handleOpenForm = (post = null) => {
    setEditPost(post);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditPost(null);
  };

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  const handleAddCommentClick = (postId, parentId = null) => {
    setCurrentPostId(postId);
    setParentCommentId(parentId);
    setCommentInput("");
    setEditingCommentId(null);
  };

  const handlePostComment = (postId) => {
    if (commentInput.trim()) {
      const commentId = Date.now();
      dispatch(
        addComment({
          postId,
          comment: { id: commentId, text: commentInput, replies: [] },
          parentCommentId,
        })
      );
      setCommentInput("");
      setCurrentPostId(null);
      setParentCommentId(null);
    }
  };

  const handleEditCommentClick = (commentId, commentText) => {
    setEditingCommentId(commentId);
    setEditingCommentText(commentText);
  };

  const handleSaveEditedComment = (postId) => {
    if (editingCommentText.trim()) {
      dispatch(
        editComment({
          postId,
          commentId: editingCommentId,
          newComment: editingCommentText,
        })
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    }
  };

  const toggleDescription = (postId) => {
    setExpandedPostIds((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const renderComments = (comments, postId) => {
    return comments.map((comment) => (
      <Box key={comment.id} className="comment" sx={{ marginLeft: "20px" }}>
        {editingCommentId === comment.id ? (
          <Box>
            <TextField
              variant="outlined"
              sx={{ width: "100%" }}
              value={editingCommentText}
              onChange={(e) => setEditingCommentText(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSaveEditedComment(postId)}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setEditingCommentId(null);
                setEditingCommentText("");
              }}
              color="secondary"
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2">{comment.text}</Typography>
            <Box>
              <Button onClick={() => handleAddCommentClick(postId, comment.id)}>
                Reply
              </Button>
              <Button
                onClick={() => handleEditCommentClick(comment.id, comment.text)}
              >
                Edit
              </Button>
              <Button
                onClick={() =>
                  dispatch(deleteComment({ postId, commentId: comment.id }))
                }
                color="secondary"
              >
                Delete
              </Button>
            </Box>
          </Box>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <Box className="replies" sx={{ marginLeft: "20px" }}>
            {renderComments(comment.replies, postId)}
          </Box>
        )}
      </Box>
    ));
  };

  return (
    <Container>
      <div className="mt-100px main_class">
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "50%" }}
          onClick={() => handleOpenForm()}
        >
          Add Post
        </Button>
        {posts.map((post) => (
          <Card
            key={post.id}
            variant="outlined"
            sx={{ margin: "16px 0", width: "50%" }}
          >
            <CardContent>
              <Typography variant="h6">{post.name}</Typography>
              <Typography variant="body2" style={{ wordBreak: "break-all" }}>
                {expandedPostIds[post.id]
                  ? post.postDescription
                  : post.postDescription.length > 100
                  ? post.postDescription.substring(0, 100) + "..."
                  : post.postDescription}
              </Typography>
              {post.postDescription.length > 100 && (
                <Button onClick={() => toggleDescription(post.id)}>
                  {expandedPostIds[post.id] ? "Show Less" : "Show More"}
                </Button>
              )}
              <Box>
                <AddCommentIcon
                  onClick={() => handleAddCommentClick(post.id)}
                  style={{ cursor: "pointer" }}
                />
              </Box>
              {currentPostId === post.id && (
                <Box>
                  <TextField
                    variant="outlined"
                    sx={{ width: "100%" }}
                    label="Add a comment"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePostComment(post.id)}
                  >
                    Post Comment
                  </Button>
                </Box>
              )}
              {post.comments &&
                post.comments.length > 0 &&
                renderComments(post.comments, post.id)}
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={() => handleOpenForm(post)}>
                Edit
              </Button>
              <Button color="secondary" onClick={() => handleDelete(post.id)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
        <PostForm
          open={openForm}
          handleClose={handleCloseForm}
          post={editPost}
        />
      </div>
    </Container>
  );
};

export default PostList;
