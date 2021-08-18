import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router";
import { AuthContext } from "../helper/AuthContext";

function CreatePost() {
  let history = useHistory();
  const { authState, setAuthState } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        if (res.data.error) {
          setAuthState({
            username: "",
            id: -1,
            status: false,
          });

          history.push("/login");
        } else
          setAuthState({
            username: res.data.username,
            id: res.data.id,
            status: true,
          });
      });
  }, []);

  const initialValues = {
    title: "",
    postText: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You Must Input a Title!"),
    postText: Yup.string().required(),
  });
  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        history.push(`/`);
      });
  };
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title:</label>
          <ErrorMessage name="title" component="span" />
          <Field
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
            autoComplete="off"
          ></Field>
          <label>Post:</label>
          <ErrorMessage name="postText" component="span" />
          <Field
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
            autoComplete="off"
          ></Field>

          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
