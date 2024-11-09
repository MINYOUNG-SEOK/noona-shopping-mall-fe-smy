import Slider from "react-slick";
import "./Banner.style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="banner-container">
      <Slider {...settings}>
        <div className="banner-item">
          <img
            src="/image/1.jpg"
            alt="틸아이다이 프로모션"
            className="banner-image"
          />
          <div className="banner-text">
            <h2>인플루언서가 사랑한 틸아이다이</h2>
            <p>~50% + 15% 쿠폰</p>
          </div>
        </div>
        <div className="banner-item">
          <img
            src="/image/2.jpg"
            alt="라이프스타일 기획전"
            className="banner-image"
          />
          <div className="banner-text">
            <h2>취향으로 가득한 라이프스타일</h2>
            <p>특별한 쿠폰 혜택 10%</p>
          </div>
        </div>
        <div className="banner-item">
          <img src="/image/3.jpg" alt="Banner 4" className="banner-image" />
          <div className="banner-text">
            <h2>추울 틈 없이 따뜻한 캠핑을 위해</h2>
            <p>머플러 아이템</p>
          </div>
        </div>
        <div className="banner-item">
          <img src="/image/4.jpg" alt="Banner 4" className="banner-image" />
          <div className="banner-text">
            <h2>기분 좋은단독 혜택</h2>
            <p>오직 여기서만 20%</p>
          </div>
        </div>
        <div className="banner-item">
          <img src="/image/5.jpg" alt="Banner 5" className="banner-image" />
          <div className="banner-text">
            <h2>72시간의 혜택</h2>
            <p>팝업할인 ~70%</p>
          </div>
        </div>
        <div className="banner-item">
          <img src="/image/6.gif" alt="Banner 6" className="banner-image" />
          <div className="banner-text">
            <h2>포근한 겨울나기</h2>
            <p>지금 만나보세요</p>
          </div>
        </div>
        <div className="banner-item">
          <img src="/image/7.jpg" alt="Banner 7" className="banner-image" />
          <div className="banner-text">
            <h2>11월에 찾아온 선물</h2>
            <p>인플루언서 PICK!</p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Banner;
