import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format, currencyFormat } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedItems = [], totalPrice = 0 } = location.state || {};
  const { orderNum } = useSelector((state) => state.order);

  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });

  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
    deliveryMessage: "",
  });

  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      navigate("/cart");
    }
  }, [selectedItems, navigate]);

  useEffect(() => {
    if (orderNum) {
      navigate(`/order-complete/${orderNum}`);
    }
  }, [orderNum, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      contact,
      address,
      city,
      zip,
      deliveryMessage,
    } = shipInfo;

    dispatch(
      createOrder({
        totalPrice,
        shipTo: { address, city, zip },
        contact: { firstName, lastName, contact },
        deliveryMessage,
        orderList: selectedItems.map((item) => ({
          productId: item.productId._id,
          price: item.productId.price,
          qty: item.qty,
          size: item.size,
        })),
      })
    );
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setShipInfo({ ...shipInfo, [name]: value });
  };

  const handlePaymentInfoChange = (event) => {
    const { name, value } = event.target;
    if (name === "expiry") {
      let newValue = cc_expires_format(value);
      setCardValue({ ...cardValue, [name]: newValue });
      return;
    }
    setCardValue({
      ...cardValue,
      [name]: value,
    });
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };

  return (
    <Container className="payment-page-container mt-4">
      <Row className="justify-content-center">
        <Col lg={8} md={12}>
          <Form onSubmit={handleSubmit}>
            {/* 배송 정보, 상품 정보, 결제 정보 */}
            <div className="info-sections">
            <div className="shipping-info">
              <div className="shipping-info-title">
                <h2 className="shipping-title">배송 정보</h2>
                <p className="required-note">*표시는 필수입력 항목</p>
                </div>
                {/* 배송 정보 입력 폼 */}
                <Row className="mb-3">
                <Form.Group as={Col} controlId="lastName">
                  
                <Form.Label className="form-label-required">
                  성<span className="required-asterisk">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleFormChange}
                  required
                  name="lastName"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="firstName">
                <Form.Label className="form-label-required">
                  이름<span className="required-asterisk">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleFormChange}
                  required
                  name="firstName"
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label className="form-label-required">
                연락처<span className="required-asterisk">*</span>
              </Form.Label>
              <Form.Control
                placeholder="010-xxx-xxxxx"
                onChange={handleFormChange}
                required
                name="contact"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridAddress2">
              <Form.Label className="form-label-required">
                주소<span className="required-asterisk">*</span>
              </Form.Label>
              <Form.Control
                placeholder="Apartment, studio, or floor"
                onChange={handleFormChange}
                required
                name="address"
              />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label className="form-label-required">
                  City<span className="required-asterisk">*</span>
                </Form.Label>
                <Form.Control
                  onChange={handleFormChange}
                  required
                  name="city"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label className="form-label-required">
                  Zip<span className="required-asterisk">*</span>
                </Form.Label>
                <Form.Control onChange={handleFormChange} required name="zip" />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3 delivery-message">
              <Form.Label className="form-label-required">
                배송 메시지
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="배송 시 요청 사항을 입력해 주세요"
                onChange={handleFormChange}
                name="deliveryMessage"
                value={shipInfo.deliveryMessage}
              />
            </Form.Group>

              </div>
              

              <div className="selected-items-section">
                <h2 className="shipping-title">상품 정보 / 총 {selectedItems.length}개</h2>
                {selectedItems.map((item) => (
                  <div key={item.productId._id} className="selected-item mb-3">
                    <div className="selected-item-container">
                      <img
                        src={item.productId.image}
                        alt={item.productId.name}
                        className="selected-item-image"
                      />
                      <div className="selected-item-details">
                        <h5 className="selected-item-name">{item.productId.name}</h5>
                        <p className="selected-item-option">옵션: [SIZE] {item.size}</p>
                        <p className="selected-item-price">
                          {item.qty}개 / ₩ {currencyFormat(item.productId.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="payment-info">
                <h2 className="payment-title">결제 정보</h2>
                <PaymentForm
                  cardValue={cardValue}
                  handleInputFocus={handleInputFocus}
                  handlePaymentInfoChange={handlePaymentInfoChange}
                />
              </div>
            </div>
          </Form>
        </Col>

        {/* 고정된 주문 요약 영역 */}
        <Col lg={4} md={12} className="sticky-summary">
          <div className="receipt-and-button-area">
            <div className="order-summary">
              <h3 className="summary-title">결제금액</h3>
              <div className="summary-item">
                <span>총 상품 금액</span>
                <span>₩{currencyFormat(totalPrice)}</span>
              </div>
              <div className="summary-item">
                <span>배송비</span>
                <span>무료</span>
              </div>
              <div className="summary-item total">
                <span>총 결제 금액</span>
                <span className="total-amount">₩{currencyFormat(totalPrice)}</span>
              </div>
            </div>
            <div className="checkout-button-container">
            <Button variant="dark" className="checkout-button">
              CHECK OUT
            </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
