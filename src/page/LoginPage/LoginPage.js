import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./LoginPage.style.css";
import { loginWithEmail, loginWithGoogle } from "../../features/user/userSlice";
import { clearErrors } from "../../features/user/userSlice";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginError, loading } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loginError) {
      dispatch(clearErrors());
    }
  }, [navigate]);

  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    dispatch(loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (googleData) => {
    //구글 로그인 하기
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <Container className="login-area">
        <h1 className="sign-in-title">Sign In</h1>

        <div className="text-align-center mt-2">
          <div className="display-center">
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </GoogleOAuthProvider>
          </div>
        </div>

        <div className="or-divider">
          <span className="line"></span>
          <span className="or-text">or</span>
          <span className="line"></span>
        </div>

        <Form className="login-form" onSubmit={handleLoginWithEmail}>
          <Form.Group className="mb-3 form-group" controlId="formBasicEmail">
            <Form.Label>Email*</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 form-group" controlId="formBasicPassword">
            <Form.Label>Password*</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>

          <div className="error-and-forgot-password">
            {loginError && (
              <div className="error-message">
                <Alert variant="danger">{loginError}</Alert>
              </div>
            )}
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <Button className="login-button" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="display-space-between login-button-area">
            <div className="sign-up-link">
              You don’t have an account?{" "}
              <Link to="/register">Sign up here</Link>
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Login;
