// ProductList.js
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import "./ProductList.style.css";

const ProductList = ({ category }) => {
  const { productList } = useSelector((state) => state.product);

  if (!productList) {
    return <div className="no-products">상품을 불러오는 중입니다...</div>;
  }

  // 카테고리 필터링 로직
  const filteredProducts = category
    ? productList.filter((item) => {
        const productCategories = Array.isArray(item.category)
          ? item.category
          : [item.category];

        return productCategories
          .map((cat) => cat.toLowerCase())
          .includes(category.toLowerCase());
      })
    : productList;

  if (filteredProducts.length === 0) {
    return (
      <div className="no-products">
        <p>해당 카테고리의 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {filteredProducts.map((item) => (
        <ProductCard key={item._id} item={item} /> // item prop 사용
      ))}
    </div>
  );
};

export default ProductList;
