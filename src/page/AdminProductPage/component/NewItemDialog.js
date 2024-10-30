import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
import "../style/adminProduct.style.css";
import {
  clearError,
  createProduct,
  editProduct,
  getProductList,
} from "../../../features/product/productSlice";
import "@toast-ui/editor/dist/toastui-editor.css";

const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: 0,
};

const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedProduct } = useSelector(
    (state) => state.product
  );
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedProduct
  );
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stockError, setStockError] = useState(false);
  const editorRef = useRef();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (success) {
      dispatch(clearError());
      dispatch(getProductList({ page: 1, name: "" }));
      setShowDialog(false);
    }
  }, [success]);

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === "edit") {
        setFormData(selectedProduct);
        // 객체형태로 온 stock을 다시 배열로 세팅해주기
        const sizeArray = Object.keys(selectedProduct.stock).map((size) => [
          size,
          selectedProduct.stock[size],
        ]);
        setStock(sizeArray);
      } else {
        setFormData({ ...InitialFormData });
        setStock([]);
      }
    }
  }, [showDialog]);

  const handleClose = () => {
    // 모든걸 초기화시키고;
    setFormData({ ...InitialFormData });
    setStock([]);
    setStockError(false);
    // 다이얼로그 닫아주기
    setShowDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // 필수 필드 검사
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required.";
    if (!formData.sku) newErrors.sku = "SKU is required.";

    // Editor의 내용을 가져오기
    const description = editorRef.current.getInstance().getMarkdown();
    if (!description || description.trim() === "") {
      newErrors.description = "Description is required.";
    }

    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than 0.";
    if (stock.length === 0) {
      newErrors.stock = "Please add stock information.";
    } else {
      // 재고 검사
      stock.forEach((item, index) => {
        if (!item[1] || parseInt(item[1]) <= 0) {
          newErrors[`stock-${index}`] =
            "Stock quantity must be greater than 0.";
        }
      });
    }
    if (!formData.category.length)
      newErrors.category = "Please select at least one category.";

    // 이미지 필드 검사
    if (!formData.image)
      newErrors.image = "Please upload an image for the product.";

    setErrors(newErrors);

    // 오류가 있으면 반환하여 제출 방지
    if (Object.keys(newErrors).length > 0) return;

    // 재고를 배열에서 객체로 바꿔주기
    const totalStock = stock.reduce((total, item) => {
      return { ...total, [item[0]]: parseInt(item[1]) };
    }, {});

    console.log("formData", formData);
    console.log("formData", stock);
    console.log("formData", totalStock);

    const updatedFormData = { ...formData, description };

    if (mode === "new") {
      // 새 상품 만들기
      dispatch(createProduct({ ...updatedFormData, stock: totalStock }));
    } else {
      // 상품 수정하기
    }
  };

  const handleChange = (event) => {
    // form에 데이터 넣어주기
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const addStock = () => {
    // 재고 타입 추가 시 배열에 새 배열 추가
    setStock([...stock, []]);
  };

  const deleteStock = (idx) => {
    // 재고 삭제하기
    const newStock = stock.filter((item, index) => index !== idx);
    setStock(newStock);
  };

  const handleSizeChange = (value, index) => {
    // 재고 수량 변환하기
    setStock((prevStock) => {
      const newStock = prevStock.map((item, idx) =>
        idx === index ? [value, item[1]] : [...item]
      );
      return newStock;
    });
  };

  const handleStockChange = (value, index) => {
    setStock((prevStock) => {
      // 재고 사이즈 변환하기
      const newStock = prevStock.map((item, idx) =>
        idx === index ? [item[0], value] : [...item]
      );
      return newStock;
    });
  };

  const onHandleCategory = (event) => {
    // 카테고리가 이미 추가되어있으면 제거
    if (formData.category.includes(event.target.value)) {
      const newCategory = formData.category.filter(
        (item) => item !== event.target.value
      );
      setFormData({
        ...formData,
        category: [...newCategory],
      });
    } else {
      // 아니면 새로 추가
      setFormData({
        ...formData,
        category: [...formData.category, event.target.value],
      });
    }
  };

  const uploadImage = (secureUrl) => {
    console.log("Uploaded image URL:", secureUrl);
    setFormData({ ...formData, image: secureUrl });
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        {mode === "new" ? (
          <Modal.Title>Create New Product</Modal.Title>
        ) : (
          <Modal.Title>Edit Product</Modal.Title>
        )}
      </Modal.Header>

      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="sku">
            <Form.Label>Sku</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Enter Sku"
              value={formData.sku}
              isInvalid={!!errors.sku}
            />
            {error && <div className="form-error">{error}</div>}
          </Form.Group>

          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Name"
              value={formData.name}
              isInvalid={!!errors.name}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Editor
            ref={editorRef}
            initialValue={
              formData.description ||
              "Please write your product description here."
            }
            previewStyle="tab"
            height="300px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            toolbarItems={[
              ["heading", "bold", "italic", "strike"],
              ["hr", "quote"],
              ["ul", "ol", "task", "indent", "outdent"],
              ["table", "image", "link"],
              ["code", "codeblock"],
              ["scrollSync"],
            ]}
          />
          {errors.description && (
            <div className="form-error">{errors.description}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className="mr-1">Stock</Form.Label>
          <Button
            size="sm"
            onClick={addStock}
            className="create-new-product-btn"
          >
            Add +
          </Button>
          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={index}>
                <Col sm={4}>
                  <Form.Select
                    onChange={(event) =>
                      handleSizeChange(event.target.value, index)
                    }
                    value={item[0] || ""}
                    isInvalid={!!errors.stock}
                  >
                    <option value="" disabled>
                      Please Choose...
                    </option>
                    {SIZE.map((sizeOption, idx) => (
                      <option
                        key={idx}
                        value={sizeOption.toLowerCase()}
                        disabled={stock.some(
                          (stockItem) =>
                            stockItem[0] === sizeOption.toLowerCase() &&
                            stockItem !== item
                        )}
                      >
                        {sizeOption}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    onChange={(event) =>
                      handleStockChange(event.target.value, index)
                    }
                    type="number"
                    placeholder="number of stock"
                    value={item[1] || ""}
                    isInvalid={!!errors[`stock-${index}`]}
                  />
                  {errors[`stock-${index}`] && (
                    <div className="form-error">{errors[`stock-${index}`]}</div>
                  )}
                </Col>
                <Col sm={2}>
                  <Button
                    className="gray-button"
                    size="sm"
                    onClick={() => deleteStock(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))}
            {errors.stock && <div className="form-error">{errors.stock}</div>}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Image">
          <Form.Label className="mr-1">Image</Form.Label>
          <CloudinaryUploadWidget
            uploadImage={uploadImage}
            className="create-new-product-btn"
          />
          <div className="mt-2">
            {formData.image ? (
              <img
                src={formData.image}
                style={{ maxWidth: "200px", height: "auto" }}
                className="upload-image"
                alt="Product preview"
              />
            ) : null}
          </div>
          {errors.image && <div className="form-error">{errors.image}</div>}
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={formData.price}
              onChange={handleChange}
              type="number"
              placeholder="0"
              isInvalid={!!errors.category}
            />
            {errors.price && <div className="form-error">{errors.price}</div>}
          </Form.Group>

          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              multiple
              onChange={onHandleCategory}
              value={formData.category}
              isInvalid={!!errors.category}
            >
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Control>
            {errors.category && (
              <div className="form-error">{errors.category}</div>
            )}
          </Form.Group>

          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={handleChange}
              required
            >
              {STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        {mode === "new" ? (
          <Button
            variant="primary"
            type="submit"
            className="create-new-product-btn"
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="primary"
            type="submit"
            className="create-new-product-btn"
          >
            Edit
          </Button>
        )}
      </Form>
    </Modal>
  );
};

export default NewItemDialog;
