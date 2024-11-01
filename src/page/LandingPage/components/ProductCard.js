import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import './ProductCard.style.css'; 

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const [isWished, setIsWished] = React.useState(false); // 찜하기 상태

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleWishClick = (e) => {
    e.stopPropagation();
    setIsWished(!isWished);
    // 여기에 찜하기 API 호출 로직 추가
  };

  return (
    <div className="product-card" onClick={() => showProduct(item._id)}>
      <div className="image-container">
        <img src={item?.image} alt={item?.name} />
        <button className="wishlist-btn" onClick={handleWishClick}>
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
