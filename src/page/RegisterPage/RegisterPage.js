import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
  const [errors, setErrors] = useState({});
  const { registrationError, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (registrationError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "User already registered.",
      }));
    }
  }, [registrationError]);

  const register = (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword, policy } = formData;

    let hasErrors = false;
    const newErrors = {};

    // Name 필드가 비어 있는지 확인
    if (!name.trim()) {
      newErrors.name = "Please enter your name.";
      hasErrors = true;
    }

    // 이메일 필드가 비어 있는지 확인
    if (!email.trim()) {
      newErrors.email = "Please enter your email.";
      hasErrors = true;
    }

    // 비밀번호 필드가 비어 있는지 확인
    if (!password.trim()) {
      newErrors.password = "Please enter your password.";
      hasErrors = true;
    }

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      hasErrors = true;
    }

    // 정책 동의 여부 확인
    if (!policy) {
      setPolicyError(true);
      hasErrors = true;
    }

    // 오류가 있는 경우, 오류 상태를 설정하고 함수 종료
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // 모든 오류 초기화
    setPasswordError("");
    setPolicyError(false);
    setErrors({});

    // 회원가입 요청
    dispatch(registerUser({ name, email, password, navigate }));
  };

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;

    if (type === "checkbox") {
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData((prevState) => ({ ...prevState, [id]: value }));
    }

    // 이메일이 변경될 때 오류 초기화
    if (id === "email") {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    if (id === "confirmPassword" && passwordError) {
      setPasswordError("");
    }
    if (type === "checkbox" && policyError) {
      setPolicyError(false);
    }

    if (registrationError) {
      dispatch(clearErrors());
    }
  };

  return (
    <div className="register-container">
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
            value={formData.name}
            className={errors.name ? "input-invalid" : ""}
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            value={formData.email}
            className={errors.email ? "input-invalid" : ""}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Password*</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className={errors.password ? "input-invalid" : ""}
          />
          {errors.password && (
            <div className="form-error">{errors.password}</div>
          )}
        </div>
        <div className="form-group">
          <label>Confirm Password*</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={formData.confirmPassword}
            className={errors.confirmPassword ? "input-invalid" : ""}
          />
          {errors.confirmPassword && (
            <div className="form-error">{errors.confirmPassword}</div>
          )}
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
            <Link to="/terms">Terms of Service</Link>&nbsp;and&nbsp;
            <Link to="/privacy">Privacy Policy</Link>.
          </label>
          {policyError && (
            <div className="form-error">
              Please agree to the Terms of Service and Privacy Policy.
            </div>
          )}
        </div>
        <button type="submit" className="register-button" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <div className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
