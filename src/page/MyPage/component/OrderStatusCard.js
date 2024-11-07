import React from "react";
import { Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderStatusCard = ({ orderItem }) => {
  return (
    <div className="status-card">
      <div className="img-container">
        <img
          src={orderItem.items[0]?.productId?.image}
          alt={orderItem.items[0]?.productId?.image}
        />
      </div>
      <div className="order-info">
        <div>
          <strong>주문번호: {orderItem.orderNum}</strong>
        </div>
        <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>
        <div>
          {orderItem.items[0].productId.name}
          {orderItem.items.length > 1 && `외 ${orderItem.items.length - 1}개`}
        </div>
        <div>₩ {currencyFormat(orderItem.totalPrice)}</div>
      </div>
      <div className="vertical-middle">
        <div className="text-align-center text-12">주문상태</div>
        <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>
      </div>
    </div>
  );
};

export default OrderStatusCard;
