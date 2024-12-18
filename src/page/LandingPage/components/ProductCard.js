import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { toggleWish } from "../../../features/wishes/wishSlice";
import "./ProductCard.style.css";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishList = useSelector((state) => state.wishes.wishList);
  const user = useSelector((state) => state.user.user);
  const [isWished, setIsWished] = useState(
    wishList.some((wishItem) => wishItem._id === item._id)
  );

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    setIsWished(wishList.some((wishItem) => wishItem._id === item._id));
  }, [wishList, item._id]);

  const handleWishClick = (e) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    setIsWished((prev) => !prev);

    dispatch(toggleWish(item._id))
      .unwrap()
      .catch(() => {
        setIsWished((prev) => !prev);
      });
  };

  return (
    <div className="product-card" onClick={() => showProduct(item._id)}>
      <div className="image-container">
        <img src={item?.image} alt={item?.name} />
        <button
          className="wishlist-btn"
          onClick={handleWishClick}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWished ? (
            <FaHeart size={30} className="heart-filled" />
          ) : (
            <FiHeart size={30} strokeWidth={2.5} />
          )}
        </button>
      </div>
      <div className="product-info">
        <div className="brand-name">{item?.brand}</div>
        <div className="product-name">{item?.name}</div>
        <div className="price-container">
          <span className="price">₩{currencyFormat(item?.price)}</span>
        </div>
        <div className="rating">
          <span>♥ {item?.likes || 0}</span>
          <span>
            ★ {item?.rating || 0} ({item?.reviewCount || 0})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
