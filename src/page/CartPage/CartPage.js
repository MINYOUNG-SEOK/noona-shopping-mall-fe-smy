import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import {
  getCartList,
  deleteCartItem,
  updateQty,
} from "../../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartList, totalPrice } = useSelector((state) => state.cart);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    dispatch(getCartList());
  }, [dispatch]);

  useEffect(() => {
    setSelectedItems(cartList.map((item) => item._id));
  }, [cartList]);

  // 전체 선택/해제 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartList.map((item) => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  // 개별 아이템 선택/해제 핸들러
  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // 개별 아이템 삭제 핸들러
  const handleDelete = async (itemId) => {
    try {
      await dispatch(deleteCartItem(itemId));
      dispatch(getCartList());
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // 선택된 아이템 삭제 핸들러
  const handleDeleteSelected = async () => {
    const failedItems = [];

    for (const itemId of selectedItems) {
      try {
        await dispatch(deleteCartItem(itemId));
      } catch (error) {
        console.error(`Failed to delete item with ID: ${itemId}`, error);
        failedItems.push(itemId);
      }
    }

    setSelectedItems(failedItems);
    dispatch(getCartList());
  };

  return (
    <Container>
      <Row>
        <Col xs={12}>
          {cartList.length > 0 ? (
            <>
              {cartList.map((item, index) => (
                <CartProductCard
                  item={item}
                  key={item._id}
                  isHeader={index === 0}
                  onSelectAll={handleSelectAll}
                  checked={selectedItems.includes(item._id)}
                  onSelect={() => handleSelectItem(item._id)}
                  allSelected={selectedItems.length === cartList.length}
                  onDelete={() => handleDelete(item._id)}
                />
              ))}

              {/* 선택상품 삭제 버튼 */}
              <div className="cart-page-delete-selected-container">
                <Button
                  className="delete-selected-button"
                  onClick={handleDeleteSelected}
                >
                  선택상품 삭제
                </Button>
              </div>
            </>
          ) : (
            <div className="text-align-center empty-bag">
              <h2>카트가 비어있습니다.</h2>
              <div>상품을 담아주세요!</div>
            </div>
          )}
        </Col>
      </Row>

      {/* 상품 리스트 하단에 주문 내역 추가 */}
      <Row className="mt-4">
        <Col xs={12}>
          <OrderReceipt
            selectedItems={selectedItems}
            totalSelectedPrice={cartList
              .filter((item) => selectedItems.includes(item._id))
              .reduce((sum, item) => sum + item.productId.price * item.qty, 0)}
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12} className="button-container">
          <Button
            variant="outline-dark"
            className="continue-shopping-btn"
            onClick={() => navigate("/")}
          >
            CONTINUE SHOPPING
          </Button>
          {location.pathname.includes("/cart") && selectedItems.length > 0 && (
            <Button
              variant="dark"
              className="checkout-btn"
              onClick={() => navigate("/payment")}
            >
              CHECK OUT
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
