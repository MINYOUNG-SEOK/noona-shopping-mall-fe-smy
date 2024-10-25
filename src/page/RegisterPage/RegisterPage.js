import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./RegisterPage.style.css";
import { registerUser, clearErrors } from "../../features/user/userSlice";

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
  const { registrationError, isLoading } = useSelector((state) => state.user);

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
    dispatch(registerUser({ name, email, password, navigate }));
  };

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;

    if (type === "checkbox") {
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData((prevState) => ({ ...prevState, [id]: value }));
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
            className={registrationError ? "input-invalid" : ""}
          />
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
          {policyError && <p className="error-text">정책에 동의해주세요.</p>}
        </div>
        <button type="submit" className="register-button" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <div className="login-link">
        Already have an account? <a href="/login">Login here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
