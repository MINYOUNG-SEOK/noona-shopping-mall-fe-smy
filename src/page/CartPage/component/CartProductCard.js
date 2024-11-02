import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { IoCloseOutline } from "react-icons/io5";
import { currencyFormat } from "../../../utils/number";
import { updateQty } from "../../../features/cart/cartSlice";
import "../style/cart.style.css";

const CartProductCard = ({
  item,
  isHeader,
  onSelectAll,
  checked,
  onSelect,
  allSelected,
  onDelete,
}) => {
  const dispatch = useDispatch();

  const handleQtyChange = (id, value) => {
    if (value >= 1) dispatch(updateQty({ id, value }));
  };

  const GRID_LAYOUT = {
    checkbox: { xs: 1, md: 1 },
    info: { xs: 6, md: 6 },
    quantity: { xs: 2, md: 2 },
    price: { xs: 3, md: 3 },
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item._id);
    }
  };

  return (
    <div className="cart-page-product-card">
      {isHeader && (
        <div className="cart-page-header">
          <Row className="align-items-center g-0">
            <Col xs={GRID_LAYOUT.checkbox.xs} className="text-center">
              <input
                type="checkbox"
                className="cart-page-all-check-checkbox"
                onChange={onSelectAll}
                checked={allSelected}
              />
            </Col>
            <Col
              xs={GRID_LAYOUT.info.xs}
              className="cart-page-header-title text-center"
            >
              상품 정보
            </Col>
            <Col
              xs={GRID_LAYOUT.quantity.xs}
              className="cart-page-header-title text-center"
            >
              수량
            </Col>
            <Col
              xs={GRID_LAYOUT.price.xs}
              className="cart-page-header-title text-center"
            >
              주문금액
            </Col>
          </Row>
        </div>
      )}
      <Row className="g-0 cart-page-product-container">
        <Col {...GRID_LAYOUT.checkbox} className="cart-page-checkbox-container">
          <input
            type="checkbox"
            className="cart-page-checkbox"
            checked={checked}
            onChange={onSelect}
          />
        </Col>
        <Col {...GRID_LAYOUT.info}>
          <Row className="g-0">
            <Col xs={12} className="cart-page-product-info-container">
              <img
                src={item.productId.image}
                alt="product"
                className="cart-page-product-image"
              />
              <div className="cart-page-product-details">
                <div className="cart-page-product-header">
                  <h5 className="cart-page-product-name">
                    {item.productId.name}
                  </h5>
                  <button
                    className="cart-page-delete-button"
                    onClick={handleDelete}
                    aria-label="상품 삭제"
                  >
                    <IoCloseOutline size={16} />
                  </button>
                </div>
                <div className="cart-page-product-price">
                  ₩ {currencyFormat(item.productId.price)}
                </div>
                <div className="cart-page-product-options">
                  옵션: [SIZE]{item.size}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col
          {...GRID_LAYOUT.quantity}
          className="d-flex justify-content-center"
        >
          <div className="cart-page-quantity-buttons">
            <button onClick={() => handleQtyChange(item._id, item.qty - 1)}>
              -
            </button>
            <span>{item.qty}</span>
            <button onClick={() => handleQtyChange(item._id, item.qty + 1)}>
              +
            </button>
          </div>
        </Col>
        <Col {...GRID_LAYOUT.price} className="text-center">
          <div className="cart-page-order-price">
            ₩ {currencyFormat(item.productId.price * item.qty)}
          </div>
          <div className="cart-page-button-container">
            <Button className="cart-page-purchase-button">구매하기</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
