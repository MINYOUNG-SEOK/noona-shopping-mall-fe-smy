import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
  const { cartList } = useSelector((state) => state.cart);
  const [unselectedItems, setUnselectedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchCartList = async () => {
      setIsLoading(true);
      try {
        await dispatch(getCartList());
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartList();
  }, [dispatch]);

  useEffect(() => {
    if (cartList.length > 0 && !isInitialized) {
      setUnselectedItems(new Set());
      setIsInitialized(true);
    }
  }, [cartList, isInitialized]);

  const getSelectedItems = () => {
    return cartList
      .filter(item => !unselectedItems.has(item._id))
      .map(item => item._id);
  };

  const getSelectedItemsData = () => {
    return cartList.filter(item => !unselectedItems.has(item._id));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setUnselectedItems(new Set());
    } else {
      setUnselectedItems(new Set(cartList.map(item => item._id)));
    }
  };

  const handleSelectItem = (itemId) => {
    setUnselectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleDelete = async (itemId) => {
    try {
      await dispatch(deleteCartItem(itemId));
      setUnselectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      await dispatch(getCartList());
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleDeleteSelected = async () => {
    const selectedItems = getSelectedItems();
    for (const itemId of selectedItems) {
      try {
        await dispatch(deleteCartItem(itemId));
      } catch (error) {
        console.error(`Failed to delete item with ID: ${itemId}`, error);
      }
    }
    setUnselectedItems(new Set());
    await dispatch(getCartList());
  };

  const calculateTotalSelectedPrice = () => {
    return cartList
      .filter(item => !unselectedItems.has(item._id))
      .reduce((sum, item) => sum + item.productId.price * item.qty, 0);
  };

  const handleCheckout = () => {
    const selectedItems = getSelectedItemsData();
    navigate("/payment", {
      state: {
        selectedItems,
        totalPrice: calculateTotalSelectedPrice()
      }
    });
  };

  if (isLoading) {
    return (
      <Container>
        <Row>
          <Col xs={12}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="skeleton-item">
                <Skeleton height={100} style={{ marginBottom: 20 }} />
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    );
  }

  if (cartList.length === 0) {
    return (
      <Container>
        <Row>
          <Col xs={12}>
            <div className="text-align-center empty-bag">
              <h2>카트가 비어있습니다.</h2>
              <div>상품을 담아주세요!</div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col xs={12}>
          {cartList.map((item, index) => (
            <CartProductCard
              key={item._id}
              item={item}
              isHeader={index === 0}
              onSelectAll={handleSelectAll}
              checked={!unselectedItems.has(item._id)}
              onSelect={() => handleSelectItem(item._id)}
              allSelected={unselectedItems.size === 0}
              onDelete={() => handleDelete(item._id)}
            />
          ))}

          <div className="cart-page-delete-selected-container">
            <Button
              className="delete-selected-button"
              onClick={handleDeleteSelected}
              disabled={getSelectedItems().length === 0}
            >
              선택상품 삭제
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <OrderReceipt
            selectedItems={getSelectedItems()}
            totalSelectedPrice={calculateTotalSelectedPrice()}
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

          {location.pathname.includes("/cart") && getSelectedItems().length > 0 && (
            <Button
              variant="dark"
              className="checkout-btn"
              onClick={handleCheckout}
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
