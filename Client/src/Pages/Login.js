import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setAuthState } = useContext(AuthContext);

  const history = useHistory();

  const login = () => {
    const credentials = {
      username: username,
      password: password,
    };
    axios.post("http://localhost:3001/auth/login", credentials).then((res) => {
      if (res.data.error) alert(res.data.error);
      else {
        localStorage.setItem("accessToken", res.data.token);
        setAuthState({
          username: res.data.username,
          id: res.data.id,
          status: true,
        });
        history.push("/");
      }
    });
  };
  return (
    <div>
      <h1>Login Page:</h1>
      <input
        type="text"
        value={username}
        placeholder="Enter Your Username"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Enter Your Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
