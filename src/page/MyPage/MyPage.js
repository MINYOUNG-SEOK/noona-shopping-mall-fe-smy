import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import { getOrder } from "../../features/order/orderSlice";
import "./style/orderStatus.style.css";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="no-order-box">
        <div className="text-danger">{error}</div>
      </Container>
    );
  }

  if (!orderList?.length) {
    return (
      <Container className="no-order-box">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  }

  return (
    <Container className="status-card-container">
      {orderList.map((item) => (
        <OrderStatusCard orderItem={item} key={item._id} />
      ))}
    </Container>
  );
};

export default MyPage;
