import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faUser,
  faSearch,
  faShoppingBag,
  faSignInAlt,
  faSignOutAlt,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import "./Navbar.style.css";

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showMenuList, setShowMenuList] = useState(false);
  const menuList = [
    "BEST",
    "WOMEN",
    "MEN",
    "INTERIOR",
    "KITCHEN",
    "DIGITAL",
    "BEAUTY",
    "FOOD",
    "KIDS",
  ];

  let navigate = useNavigate();

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return navigate("/");
      }
      navigate(`?name=${event.target.value}`);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const toggleMenuList = () => {
    setShowMenuList(!showMenuList);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="navbar-container">
      <div className="navbar-top">
        <div className="navbar-left">
          <FontAwesomeIcon
            icon={faBars}
            className="hamburger-icon"
            onClick={toggleMenuList}
          />
          <Link to="/" className="navbar-logo">
            <img
              src="/image/logo.png"
              alt="Logo"
              className="navbar-logo-image"
            />
          </Link>
        </div>

        <div className="navbar-right">
          <div className="navbar-icons">
            <div onClick={() => navigate("/mypage")} className="navbar-icon">
              <FontAwesomeIcon icon={faUser} />
              <span style={{ cursor: "pointer" }}>MY ORDERS</span>
            </div>
            <div onClick={() => navigate("/favorites")} className="navbar-icon">
              <FontAwesomeIcon icon={faHeart} />
              <span style={{ cursor: "pointer" }}>MY LIKE</span>
            </div>
            <div onClick={() => navigate("/cart")} className="navbar-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              <span style={{ cursor: "pointer" }}>{`SHOPPING BAG(${
                cartItemCount || 0
              })`}</span>
            </div>
            {user ? (
              <div onClick={handleLogout} className="navbar-icon">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span style={{ cursor: "pointer" }}>LOGOUT</span>
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="navbar-icon">
                <FontAwesomeIcon icon={faSignInAlt} />
                <span style={{ cursor: "pointer" }}>LOGIN</span>
              </div>
            )}
            <div className="navbar-search-icon">
              <FontAwesomeIcon
                icon={faSearch}
                onClick={() => setShowSearchBox(!showSearchBox)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="navbar-bottom">
        <ul className="navbar-menu-list">
          {menuList.map((menu, index) => (
            <li key={index}>
              <a href="#">{menu}</a>
            </li>
          ))}
        </ul>

        {user && user.level === "admin" && (
          <Link to="/admin/product?page=1" className="link-area">
            Admin page
          </Link>
        )}
      </div>

      {showSearchBox && (
        <div className="navbar-search-box">
          <input
            type="text"
            placeholder="제품명으로 검색"
            onKeyPress={onCheckEnter}
            className="navbar-search-input"
          />
        </div>
      )}

      {/* 모바일 하단 아이콘 섹션 */}
      <div className="navbar-bottom-icons">
        <div className="navbar-icon" onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>BACK</span>
        </div>
        <div onClick={() => navigate("/mypage")} className="navbar-icon">
          <FontAwesomeIcon icon={faUser} />
          <span>MY ORDERS</span>
        </div>
        <div onClick={() => navigate("/favorites")} className="navbar-icon">
          <FontAwesomeIcon icon={faHeart} />
          <span>MY LIKES</span>
        </div>
        {/* <div onClick={() => navigate("/cart")} className="navbar-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              <span style={{ cursor: "pointer" }}>{`SHOPPING BAG(${cartItemCount || 0})`}</span>
            </div> */}
        {user ? (
          <div onClick={handleLogout} className="navbar-icon">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>LOGOUT</span>
          </div>
        ) : (
          <div onClick={() => navigate("/login")} className="navbar-icon">
            <FontAwesomeIcon icon={faSignInAlt} />
            <span>LOGIN</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
