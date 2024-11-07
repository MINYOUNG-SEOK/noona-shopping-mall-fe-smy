import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
      <Container>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="skeleton-item">
            <Skeleton height={100} style={{ marginBottom: 20 }} />
          </div>
        ))}
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
