import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import "./RegisterPage.style.css";
import { registerUser, clearErrors } from "../../features/user/userSlice";
import Spinner from "../../common/component/Spinner";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { registrationError, loading } = useSelector((state) => state.user);

  // 로딩 상태 확인용 useEffect
  useEffect(() => {
    console.log("Loading State:", loading);
  }, [loading]);

  // 등록 시 로직
  const register = (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword, policy } = formData;

    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!policy) {
      setPolicyError(true);
      return;
    }

    setPasswordError("");
    setPolicyError(false);
    setEmailError(""); // 이메일 에러 초기화

    // 이메일 중복 확인 후 등록 진행
    dispatch(registerUser({ name, email, password, navigate }));
  };

  // 입력 변경 시 로직
  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;

    if (type === "checkbox") {
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData((prevState) => ({ ...prevState, [id]: value }));
    }

    // 특정 오류 클리어
    if (id === "confirmPassword" && passwordError) {
      setPasswordError("");
    }
    if (type === "checkbox" && policyError) {
      setPolicyError(false);
    }
    if (id === "email") {
      setEmailError(""); // 이메일 에러 초기화
    }
    if (registrationError) {
      dispatch(clearErrors());
    }
  };

  return (
    <div className="register-container">
      {/* loading 상태에 따라 스피너 표시 */}
      {loading && (
        <div className="spinner-overlay">
          <Spinner />
        </div>
      )}
      <form className="register-form" onSubmit={register}>
        <div className="form-group">
          <label>Name*</label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
            className={emailError || registrationError ? "input-invalid" : ""}
          />
          {/* 구체적인 이메일 중복 에러 표시 */}
          {emailError && <p className="error-text">{emailError}</p>}
          {registrationError && (
            <p className="error-text">이미 가입된 유저입니다.</p>
          )}
        </div>
        <div className="form-group">
          <label>Password*</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password*</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className={passwordError ? "input-invalid" : ""}
          />
          {passwordError && <p className="error-text">{passwordError}</p>}
        </div>
        <div className="form-group checkbox">
          <label htmlFor="policy">
            <input
              type="checkbox"
              id="policy"
              onChange={handleChange}
              className={policyError ? "input-invalid" : ""}
              checked={formData.policy}
            />
            By signing up, you agree to MY&nbsp;
            <a href="/terms">Terms of Service</a>&nbsp;and&nbsp;
            <a href="/privacy">Privacy Policy</a>.
          </label>
          {policyError && (
            <p className="error-text">
              서비스 이용약관 및 개인정보 보호정책에 동의해주세요.
            </p>
          )}
        </div>
        <button type="submit" className="register-button" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <div className="login-link">
        Already have an account? <a href="/login">Login here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
