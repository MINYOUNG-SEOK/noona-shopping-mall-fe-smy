import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../../common/component/Banner";
import { getProductList } from "../../features/product/productSlice";
import { getWishList } from "../../features/wishes/wishSlice";
import "../LandingPage/LandingPage.style.css";

const LandingPage = () => {
  const dispatch = useDispatch();
  const { productList, loading } = useSelector((state) => state.product);
  const [query] = useSearchParams();
  const name = query.get("name");

  useEffect(() => {
    dispatch(getProductList({ name }));
    dispatch(getWishList());
  }, [query, dispatch]);

  if (loading) {
    return (
      <Container>
        <Banner />
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

  if (!productList.length) {
    return (
      <Container>
        <Banner />
        <div className="empty-product">
          <h2>
            {name
              ? `'${name}'과 일치하는 상품이 없습니다.`
              : "등록된 상품이 없습니다!"}
          </h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Banner />
      <div className="make-it-yours-title">MAKE IT YOURS!</div>
      <div className="products-grid">
        {productList.map((item) => (
          <ProductCard key={item._id} item={item} />
        ))}
      </div>
    </Container>
  );
};

export default LandingPage;
