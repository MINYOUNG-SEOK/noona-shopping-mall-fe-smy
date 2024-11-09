import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../page/LandingPage/components/ProductCard";
import { getWishList } from "../../features/wishes/wishSlice";
import "./MyLikePage.style.css";

const MyLikePage = () => {
  const dispatch = useDispatch();
  const { wishList, loading } = useSelector((state) => state.wishes);

  useEffect(() => {
    dispatch(getWishList());
  }, [dispatch]);

  if (loading) {
    return (
      <Container>
        <div className="products-grid">
          {[1, 2, 3, 4].map((n) => (
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

  if (!wishList.length) {
    return (
      <Container>
        <div className="empty-product">
          <h2>위시리스트가 비어있습니다.</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="wishlist-title">MY LIKES</div>
      <div className="products-grid">
        {wishList.map((item) => (
          <ProductCard key={item._id} item={item} />
        ))}
      </div>
    </Container>
  );
};

export default MyLikePage;
