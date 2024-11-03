import React from "react";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = ({ totalSelectedPrice }) => {
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
    </div>
  );
};

export default OrderReceipt;
