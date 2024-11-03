import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { currencyFormat } from "../../utils/number";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.product);
  const [size, setSize] = useState("");
  const { id } = useParams();
  const [sizeError, setSizeError] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [id, dispatch]);

  const handleWishClick = (e) => {
    e.stopPropagation();
    setIsWished(!isWished);
  };

  const addItemToCart = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ id: id, size }));
  };

  const selectSize = (value) => {
    setSize(value);
    setSizeError(false);
  };

  if (loading || !selectedProduct) {
    return (
      <Container className="product-detail-card">
        <Row>
          <Col sm={6}>
            <Skeleton height={400} width="100%" />
          </Col>
          <Col sm={6}>
            <Skeleton
              height={30}
              width="70%"
              style={{ marginBottom: "10px" }}
            />
            <Skeleton
              height={20}
              width="50%"
              style={{ marginBottom: "10px" }}
            />
            <Skeleton
              height={20}
              width="80%"
              style={{ marginBottom: "10px" }}
            />
            <Skeleton
              height={20}
              width="90%"
              style={{ marginBottom: "20px" }}
            />
            <Skeleton
              height={40}
              width="100%"
              style={{ marginBottom: "10px" }}
            />
            <Skeleton height={40} width="100%" />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="product-detail-card">
      <Row>
        <Col sm={6}>
          <img
            src={selectedProduct.image}
            className="w-100 product-detail-image"
            alt="image"
          />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-detail-separator"></div>
          <div className="product-detail-title">
            <div>{selectedProduct.name}</div>
            <button
              className="product-detail-wishlist-btn"
              onClick={handleWishClick}
            >
              {isWished ? (
                <FaHeart size={24} className="heart-filled" />
              ) : (
                <FiHeart size={24} strokeWidth={2.5} />
              )}
            </button>
          </div>
          <div className="product-info product-price">
            ₩ {currencyFormat(selectedProduct.price)}
          </div>
          <div className="product-info product-description">
            {selectedProduct.description}
          </div>

          <Dropdown
            className="size-dropdown"
            title={size}
            align="start"
            onSelect={(value) => selectSize(value)}
          >
            <Dropdown.Toggle
              className={`product-detail-dropdown-toggle ${
                sizeError ? "error" : ""
              }`}
              variant="outline-secondary"
            >
              {size === "" ? "옵션을 선택하세요 " : size.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu className="size-dropdown-menu">
              {selectedProduct.stock &&
                Object.keys(selectedProduct.stock).map((item, index) =>
                  selectedProduct.stock[item] > 0 ? (
                    <Dropdown.Item eventKey={item} key={index}>
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item eventKey={item} disabled={true} key={index}>
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  )
                )}
            </Dropdown.Menu>
          </Dropdown>

          <div className="button-group">
            <Button
              variant="light"
              className="add-to-cart"
              onClick={addItemToCart}
            >
              장바구니 담기
            </Button>
            <Button
              variant="dark"
              className="buy-now"
              onClick={() => {
                /* 구매 로직 추가 */
              }}
            >
              바로 구매하기
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
