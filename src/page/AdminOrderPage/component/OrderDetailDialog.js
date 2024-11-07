import React, { useState } from "react";
import { Form, Modal, Button, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ORDER_STATUS } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { updateOrder } from "../../../features/order/orderSlice";
import "../style/adminOrder.style.css";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
};

const OrderDetailDialog = ({ open, handleClose }) => {
  const selectedOrder = useSelector((state) => state.order.selectedOrder);
  const [orderStatus, setOrderStatus] = useState(selectedOrder?.status || "");
  const dispatch = useDispatch();

  const handleStatusChange = (event) => {
    setOrderStatus(event.target.value);
  };

  const submitStatus = (event) => {
    event.preventDefault();
    dispatch(updateOrder({ id: selectedOrder._id, status: orderStatus }));
    handleClose();
  };

  if (!selectedOrder) {
    return null;
  }

  return (
    <Modal
      show={open}
      onHide={handleClose}
      centered
      dialogClassName="admin-order-detail-dialog"
    >
      <Modal.Header closeButton className="admin-order-detail-dialog__header">
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="admin-order-detail-dialog__body">
        <div className="admin-order-detail-dialog__info">
          <p>
            <strong>Order Number : </strong> {selectedOrder.orderNum}
          </p>
          <p>
            <strong>Order Date : </strong>{" "}
            {formatDateTime(selectedOrder.createdAt)}
          </p>
          <p>
            <strong>Email : </strong> {selectedOrder.userId.email}
          </p>
          <p>
            <strong>Address : </strong>
            {`${selectedOrder.shipTo.address}, ${selectedOrder.shipTo.city} (${
              selectedOrder.shipTo.postalCode || "No Postal Code"
            })`}
          </p>
          <p>
            <strong>Contact : </strong>
            {`${selectedOrder.contact.firstName} ${selectedOrder.contact.lastName} (${selectedOrder.contact.phone})`}
          </p>
          {/* <p>
            <strong>Delivery Message:</strong>{" "}
            {selectedOrder.deliveryMessage || "No message provided"}
          </p> */}
        </div>
        <h5 className="admin-order-detail-dialog__section-title">
          Order Items
        </h5>
        <div className="admin-order-detail-dialog__items">
          <Table
            bordered
            responsive
            className="admin-order-detail-dialog__table"
          >
            <thead>
              <tr>
                <th>Image</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.productId.image ? (
                      <img
                        src={item.productId.image}
                        alt={item.productId.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                    <td className="text-center align-middle">{item._id}</td>
                  <td className="text-center align-middle">{item.productId.name}</td>
                  <td className="text-center align-middle">{currencyFormat(item.price)}</td>
                  <td className="text-center align-middle">{item.qty}</td>
                  <td className="text-center align-middle">{currencyFormat(item.price * item.qty)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="text-end">
                  <strong>Order Total :</strong>
                </td>
                <td>
                  <strong>{currencyFormat(selectedOrder.totalPrice)}</strong>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <Form
          onSubmit={submitStatus}
          className="admin-order-detail-dialog__form"
        >
          <Form.Group as={Col} controlId="status">
            <Form.Label>
              <strong>Status</strong>
            </Form.Label>
            <Form.Select
              value={orderStatus}
              onChange={handleStatusChange}
              className="admin-order-detail-dialog__status-select"
            >
              {ORDER_STATUS.map((status, idx) => (
                <option key={idx} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="admin-order-detail-dialog__actions">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="admin-order-detail-dialog__close-btn"
            >
              Close
            </Button>
            <Button
              type="submit"
              className="admin-order-detail-dialog__save-btn"
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailDialog;
