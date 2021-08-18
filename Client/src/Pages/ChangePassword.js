import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../helper/AuthContext";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const history = useHistory();
  const { setAuthState } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });

    history.push("/login");
  };

  const changePassword = () => {
    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        { oldPassword: oldPassword, newPassword: newPassword },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((res) => {
        if (res.data.error) alert(res.data.error);
        else {
          alert("Password Updated");
          logout();
        }
      });
  };
  return (
    <div>
      <h1>change your password</h1>
      <input
        value={oldPassword}
        type="text"
        placeholder="Old Password..."
        onChange={(e) => {
          setOldPassword(e.target.value);
        }}
      />
      <input
        value={newPassword}
        type="text"
        placeholder="New Password..."
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      />
      <button onClick={changePassword}>Save Changes</button>
    </div>
  );
}

export default ChangePassword;
