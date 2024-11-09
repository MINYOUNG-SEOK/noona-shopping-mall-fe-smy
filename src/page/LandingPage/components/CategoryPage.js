// CategoryPage.js
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../../features/product/productSlice";
import ProductCard from "./ProductCard";
import "./CategoryPage.style.css";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  const { productList, loading } = useSelector((state) => state.product);

  useEffect(() => {
    if (category) {
      dispatch(getProductList({ category: category.toLowerCase() }));
    }
  }, [dispatch, category]);

  // 카테고리별 필터링
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

  if (loading) {
    return (
      <Container>
        <div className="products-grid">
          {[1, 2, 3, 4, 8].map((n) => (
            <div key={n} className="product-skeleton">
              <div className="skeleton-img"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))}
        </div>
      </Container>
    );
  }

  if (!filteredProducts?.length) {
    return (
      <Container>
        <div className="empty-product">
          <h2>해당 카테고리의 상품이 없습니다.</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="category-title">{category.toUpperCase()}</div>
      <div className="products-grid">
        {filteredProducts.map((item) => (
          <ProductCard key={item._id} item={item} />
        ))}
      </div>
    </Container>
  );
};

export default CategoryPage;
