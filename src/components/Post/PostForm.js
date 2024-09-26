import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addPost, EDIT_POST, editPost } from "../../store/actions/actions";

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  postDescription: Yup.string()
    .min(20, "Must be at least 20 characters")
    .required("Required"),
});

const PostForm = ({ open, handleClose, post }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: post ? post.name : "",
      postDescription: post ? post.postDescription : "",
      comments: [],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (post) {
        dispatch(editPost({ ...post, ...values }));
      } else {
        const newPost = {
          ...values,
          id: Date.now(),
          createdDate: new Date().toISOString().split("T")[0],
        };
        dispatch(addPost(newPost));
      }
      resetForm();
      handleClose();
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{post ? "Edit Post" : "Add Post"}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Post Description"
            name="postDescription"
            multiline
            rows={4}
            value={formik.values.postDescription}
            onChange={formik.handleChange}
            error={
              formik.touched.postDescription &&
              Boolean(formik.errors.postDescription)
            }
            helperText={
              formik.touched.postDescription && formik.errors.postDescription
            }
          />
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {post ? "Save Changes" : "Add Post"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostForm;
