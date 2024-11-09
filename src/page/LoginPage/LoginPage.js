import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./LoginPage.style.css";
import {
  loginWithEmail,
  clearErrors,
  loginWithGoogle,
} from "../../features/user/userSlice";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginError, loading } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (loginError) {
      dispatch(clearErrors());
    }
  }, [dispatch]);

  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    let hasErrors = false;
    const newErrors = {};

    // 이메일이 빈 값인지 확인
    if (!email.trim()) {
      newErrors.email = "Please enter your email.";
      hasErrors = true;
    }

    // 비밀번호가 빈 값인지 확인
    if (!password.trim()) {
      newErrors.password = "Please enter your password.";
      hasErrors = true;
    }

    // 오류가 있는 경우 상태 업데이트 및 함수 종료
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // 오류 초기화
    setErrors({});
    dispatch(loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (googleData) => {
    // 구글 로그인 처리 로직
    dispatch(loginWithGoogle(googleData.credential));
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <Container className="login-area">
      <h1 className="sign-in-title">Sign In</h1>

      <div className="text-align-center mt-2">
        <div className="display-center">
          {/* 
        1. 구글 로인 버튼 가져오기
        3. 로그인
        4. 백엔드에서 로그인
         a. 이미 로그인을 한 적 있는 유저 => 로그인 시키고 토큰 값 주면 됨
         b. 처음 로그인 시도를 한 유저 => 유저 정보 먼저 새로 생성한 후 토큰 값 주기
          */}
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
            onChange={(event) => setEmail(event.target.value)}
            className={errors.email ? "input-invalid" : ""}
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </Form.Group>

        <Form.Group className="mb-3 form-group" controlId="formBasicPassword">
          <Form.Label>Password*</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
            className={errors.password ? "input-invalid" : ""}
          />
          {errors.password && (
            <div className="error-text">{errors.password}</div>
          )}
        </Form.Group>

        <div className="error-and-forgot-password">
          {loginError && <div className="error-text">{loginError}</div>}
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>

        <Button className="login-button" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <div className="display-space-between login-button-area">
          <div className="sign-up-link">
            You don’t have an account? <Link to="/register">Sign up here</Link>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
