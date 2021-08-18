import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";

function Post() {
  const [postObject, setpostObject] = useState({});
  const [commentsObject, setCommentsObject] = useState([]);
  let { id } = useParams();
  const [newComment, setNewComment] = useState();

  const { authState } = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setpostObject(response.data);
    });
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setCommentsObject(response.data);
    });
  }, []);

  const addComment = () => {
    if (newComment === "") return;
    axios
      .post(
        "http://localhost:3001/comments/",
        {
          CommentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem(`accessToken`),
          },
        }
      )
      .then((res) => {
        if (res.data.error) console.log(res.data.error);
        else {
          console.log(res.data);
          const commentToAdd = {
            CommentBody: newComment,
            username: res.data.username,
          };
          setCommentsObject([...commentsObject, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem(`accessToken`),
        },
      })
      .then(() => {
        setCommentsObject(
          commentsObject.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (postId) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem(`accessToken`),
        },
      })
      .then(() => {
        alert("Delete Succefully");
        history.push("/");
      });
  };

  const editPost = (option) => {
    if (option == "title") {
      let newTitle = prompt("Enter new Title:");
      axios
        .put(
          "http://localhost:3001/posts/title",
          { newTitle: newTitle, id: id },
          {
            headers: {
              accessToken: localStorage.getItem(`accessToken`),
            },
          }
        )
        .then(() => {
          setpostObject({ ...postObject, title: newTitle });
        });
    } else {
      let newPost = prompt("Enter new Post Text:");
      axios
        .put(
          "http://localhost:3001/posts/postText",
          { newText: newPost, id: id },
          {
            headers: {
              accessToken: localStorage.getItem(`accessToken`),
            },
          }
        )
        .then(() => {
          setpostObject({ ...postObject, postText: newPost });
        });
    }
  };
  return (
    <div className="postPage">
      <div className="letfSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.username) editPost("title");
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) editPost("body");
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}
            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            value={newComment}
            type="text"
            placeholder="Add a Comment..."
            autoComplete="off"
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {commentsObject.map((value, key) => {
            return (
              <div className="comment" key={key}>
                {value.CommentBody}
                <label> Username: {value.username}</label>
                {authState.username === value.username && (
                  <button
                    onClick={() => {
                      deleteComment(value.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
