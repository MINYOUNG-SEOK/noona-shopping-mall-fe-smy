import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = ({ selectedItems, totalSelectedPrice }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="receipt-container">
      <div className="price-summary">
        <div className="summary-row">
          <div className="summary-header">
            <span>총 주문금액</span>
            <div className="price-count">
              <span>{currencyFormat(totalSelectedPrice)}원</span>
            </div>
          </div>

          <div className="operator-circle">+</div>

          <div className="summary-header">
            <span>총 배송비</span>
            <span>0원</span>
          </div>

          <div className="operator-circle">=</div>

          <div className="summary-header">
            <span>총 결제금액</span>
            <span className="total-selected-price">
              {currencyFormat(totalSelectedPrice)}원
            </span>
          </div>
        </div>
      </div>

      <div className="button-container">
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
      </div>
    </div>
  );
};

export default OrderReceipt;
