import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./OrderCompletePage.style.css";

const OrderCompletePage = () => {
  const { orderNum } = useSelector((state) => state.order);

  if (orderNum === "") {
    return (
      <Container className="order-complete-page">
        <h1>주문 실패</h1>
        <div>
          메인페이지로 돌아가세요
          <Link to={"/"}>메인페이지로 돌아가기</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="order-complete-page">
      <h2>
        고객님의 주문이 <span className="order-complete-highlight">완료</span>
        되었습니다.
      </h2>
      <div className="order-complete-number">주문번호: {orderNum}</div>
      <div>
        주문하신 내역은 <Link to={"/account/purchase"}>MY ORDERS</Link>{" "}
        페이지에서 확인하실 수 있습니다.
      </div>
    </Container>
  );
};

export default OrderCompletePage;
