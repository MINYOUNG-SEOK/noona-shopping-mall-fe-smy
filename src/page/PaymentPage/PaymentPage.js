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
    const { firstName, lastName, contact, address, city, zip, deliveryMessage } = shipInfo;

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
    <Container
    className="custom-container d-flex justify-content-center mt-4"
    style={{ minHeight: "100vh" }}
  >
      <Row className="justify-content-center w-100">
        <Col lg={7} md={10} sm={12}>
          <div className="shipping-info-title text-center">
            <h2 className="shipping-title">배송 정보</h2>
            <span className="required-note">*표시는 필수입력 항목</span>
          </div>

       

       

          {/* 배송 정보 폼 */}
          <Form onSubmit={handleSubmit}>
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
                <Form.Control
                  onChange={handleFormChange}
                  required
                  name="zip"
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3 delivery-message">
              <Form.Label className="form-label-required">배송 메시지</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="배송 시 요청 사항을 입력해 주세요"
                onChange={handleFormChange}
                name="deliveryMessage"
                value={shipInfo.deliveryMessage}
              />
            </Form.Group>

         {/* 주문 상품 정보 섹션 */}
         <div className="selected-items-section mb-4">
            <h2 className="shipping-title">
              상품 정보 / 총 {selectedItems.length}개
            </h2>
            {selectedItems.map((item) => (
              <div key={item.productId._id} className="selected-item mb-3">
                <Row className="align-items-center">
                  <Col xs={3}>
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="selected-item-image"
                    />
                  </Col>
                  <Col xs={9}>
                    <div className="selected-item-details">
                      <h5 className="selected-item-name">{item.productId.name}</h5>
                      <p className="selected-item-option">옵션: [SIZE] {item.size}</p>
                      <p className="selected-item-price">₩ {currencyFormat(item.productId.price * item.qty)}</p>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          </div>

             {/* 총 주문 금액 영역 */}
             <div className="receipt-area">
            <OrderReceipt
              selectedItems={selectedItems}
              totalSelectedPrice={totalPrice}
            />
          </div>

            <div>
              <h2 className="payment-title">결제 정보</h2>
              <PaymentForm
                cardValue={cardValue}
                handleInputFocus={handleInputFocus}
                handlePaymentInfoChange={handlePaymentInfoChange}
              />
            </div>

            <Button
              variant="dark"
              className="payment-button pay-button"
              type="submit"
            >
              결제하기
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
