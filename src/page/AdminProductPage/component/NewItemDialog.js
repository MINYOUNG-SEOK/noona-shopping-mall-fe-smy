import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import { Form, Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
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

        // 먼저 기존의 상태들을 초기화
        setIsCustomSize({});

        // stock 데이터 처리
        const sizeArray = Object.keys(selectedProduct.stock).map(
          (size, index) => {
            // SIZE 배열에 없는 모든 값을 커스텀 사이즈로 처리
            if (!SIZE.includes(size.toUpperCase())) {
              setIsCustomSize((prev) => ({
                ...prev,
                [index]: true,
              }));
            }

            return [size, selectedProduct.stock[size]];
          }
        );

        setStock(sizeArray);

        if (editorRef.current) {
          editorRef.current
            .getInstance()
            .setMarkdown(selectedProduct.description || "");
        }
      } else {
        setFormData({ ...InitialFormData });
        setStock([]);
        setIsCustomSize({});
      }
    }
  }, [showDialog, selectedProduct, mode]);

  const handleClose = () => {
    setFormData({ ...InitialFormData });
    setStock([]);
    setStockError(false);
    setShowDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required.";
    if (!formData.sku) newErrors.sku = "SKU is required.";

    const description = editorRef.current.getInstance().getMarkdown();
    if (!description || description.trim() === "") {
      newErrors.description = "Description is required.";
    }

    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than 0.";
    if (stock.length === 0) {
      newErrors.stock = "SIZE";
    } else {
      stock.forEach((item, index) => {
        if (!item[0]) {
          newErrors[`size-${index}`] = "Size is required.";
        }
        if (!item[1] || parseInt(item[1]) < 0) {
          newErrors[`stock-${index}`] =
            "Stock quantity must be greater than 0.";
        }
      });
    }
    if (!formData.category.length)
      newErrors.category = "Please select at least one category.";
    if (!formData.image)
      newErrors.image = "Please upload an image for the product.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const totalStock = stock.reduce((total, item) => {
      return { ...total, [item[0]]: parseInt(item[1]) };
    }, {});

    const updatedFormData = { ...formData, description };

    if (mode === "new") {
      dispatch(createProduct({ ...updatedFormData, stock: totalStock }));
    } else {
      dispatch(
        editProduct({ ...formData, stock: totalStock, id: selectedProduct._id })
      );
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const addStock = () => {
    setStock([...stock, ["", ""]]);
  };

  const deleteStock = (idx) => {
    const newStock = stock.filter((item, index) => index !== idx);
    setStock(newStock);
    const newIsCustomSize = { ...isCustomSize };
    delete newIsCustomSize[idx];
    setIsCustomSize(newIsCustomSize);
  };

  const [isCustomSize, setIsCustomSize] = useState({});

  const handleSizeTypeChange = (index, isCustom) => {
    setIsCustomSize((prev) => ({
      ...prev,
      [index]: isCustom,
    }));

    setStock((prevStock) => {
      const newStock = [...prevStock];
      if (isCustom) {
        // 커스텀 모드로 전환 시 현재 값 유지
        newStock[index] = [newStock[index][0] || "", newStock[index][1] || ""];
      } else {
        // 일반 모드로 전환 시 값 초기화
        newStock[index] = ["", newStock[index][1] || ""];
      }
      return newStock;
    });
  };

  const handleSizeChange = (value, index) => {
    setStock((prevStock) => {
      const newStock = [...prevStock];
      newStock[index] = [value.toLowerCase(), newStock[index]?.[1] || ""];
      return newStock;
    });
  };

  const handleCustomSizeInput = (value, index) => {
    setStock((prevStock) => {
      const newStock = [...prevStock];
      // 직접 입력한 값을 그대로 사용
      newStock[index] = [value, newStock[index]?.[1] || ""];
      return newStock;
    });
  };

  const handleStockChange = (value, index) => {
    setStock((prevStock) => {
      const newStock = [...prevStock];
      newStock[index] = [newStock[index][0], value];
      return newStock;
    });
  };

  const onHandleCategory = (event) => {
    if (formData.category.includes(event.target.value)) {
      const newCategory = formData.category.filter(
        (item) => item !== event.target.value
      );
      setFormData({
        ...formData,
        category: [...newCategory],
      });
    } else {
      setFormData({
        ...formData,
        category: [...formData.category, event.target.value],
      });
    }
  };

  const uploadImage = (secureUrl) => {
    setFormData({ ...formData, image: secureUrl });
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "new" ? "Create New Product" : "Edit Product"}
        </Modal.Title>
      </Modal.Header>

      <Form className="form-container" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
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
            {errors.sku && <div className="form-error">{errors.sku}</div>}
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
              <Row key={index} className="mb-2">
                <Col sm={6}>
                  <InputGroup>
                    <InputGroup.Text className="px-2">
                      <Form.Check
                        type="switch"
                        id={`custom-switch-${index}`}
                        label="Custom Size"
                        checked={isCustomSize[index]}
                        onChange={(e) =>
                          handleSizeTypeChange(index, e.target.checked)
                        }
                        className="m-0"
                      />
                    </InputGroup.Text>
                    {!isCustomSize[index] ? (
                      <Form.Select
                        value={item[0] || ""}
                        onChange={(e) =>
                          handleSizeChange(e.target.value, index)
                        }
                        isInvalid={!!errors[`size-${index}`]}
                      >
                        <option value="" disabled>
                          Please select
                        </option>
                        {SIZE.map((size, idx) => (
                          <option
                            key={idx}
                            value={size.toLowerCase()}
                            disabled={stock.some(
                              (stockItem) =>
                                stockItem[0] === size.toLowerCase() &&
                                stockItem !== item
                            )}
                          >
                            {size}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        type="text"
                        placeholder="Enter custom size"
                        value={item[0] || ""}
                        onChange={(e) =>
                          handleSizeChange(e.target.value, index)
                        }
                        isInvalid={!!errors[`size-${index}`]}
                      />
                    )}
                  </InputGroup>
                  {errors[`size-${index}`] && (
                    <div className="form-error">{errors[`size-${index}`]}</div>
                  )}
                </Col>

                <Col sm={4}>
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
