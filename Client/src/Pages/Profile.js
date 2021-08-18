import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  let history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((res) => {
      setUsername(res.data.username);
    });

    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((res) => {
      setListOfPosts(res.data);
    });
  }, []);

  return (
    <div className="PrfilePageContainer">
      <div className="basicInfo">
        <h1>Username: {username}</h1>
        {authState.username === username && (
          <button
            onClick={() => {
              history.push("/changepassword");
            }}
          >
            Change My Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, idx) => {
          return (
            <div key={idx} className="post">
              <div className="title">{value.title}</div>
              <div
                className="body"
                onClick={() => {
                  history.push(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  Liked By: <label>{value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
