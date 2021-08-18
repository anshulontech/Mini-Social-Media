import "./App.css";
import Home from "./Pages/Home";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import CreatePost from "./Pages/CreatePost";
import Post from "./Pages/Post";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { AuthContext } from "./helper/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import PageNotFound from "./Pages/PageNotFound";
import { useHistory } from "react-router";
import Profile from "./Pages/Profile";
import ChangePassword from "./Pages/ChangePassword";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: -1,
    status: false,
  });

  let history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        if (res.data.error)
          setAuthState({
            username: "",
            id: -1,
            status: false,
          });
        else
          setAuthState({
            username: res.data.username,
            id: res.data.id,
            status: true,
          });
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });

    // history.push("/login");
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              ) : (
                <>
                  <Link to="/">Go To Home Page</Link>
                  <Link to="/createpost">Create a Post</Link>
                </>
              )}
            </div>
            {authState.status && (
              <>
                <div className="loggedInContainer">
                  <h1>{authState.username}</h1>
                  <button onClick={logout}>Logout</button>
                </div>
              </>
            )}
          </div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/createpost" exact component={CreatePost} />
            <Route path="/post/:id" exact component={Post} />
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
            <Route path="/profile/:id" exact component={Profile} />
            <Route path="/changepassword" exact component={ChangePassword} />
            <Route path="*" exact component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
