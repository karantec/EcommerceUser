import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../components/BlogCard";
import ProductCard from "../components/ProductCard";
import SpecialProduct from "../components/SpecialProduct";
import Container from "../components/Container";
import { services } from "../utils/Data";
import prodcompare from "../images/prodcompare.svg";
import wish from "../images/wish.svg";
import wishlist from "../images/wishlist.svg";
import watch from "../images/watch.jpg";
import watch2 from "../images/watch-1.avif";
import addcart from "../images/add-cart.svg";
import view from "../images/view.svg";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import moment from "moment";
import { getAllProducts } from "../features/products/productSlilce";
import ReactStars from "react-rating-stars-component";
import { addToWishlist } from "../features/products/productSlilce";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const Home = () => {
  const blogState = useSelector((state) => state?.blog?.blog);
  const productState = useSelector((state) => state?.product?.product);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getblogs();
    getProducts();
  }, []);

  const getblogs = () => {
    dispatch(getAllBlogs());
  };

  const getProducts = () => {
    dispatch(getAllProducts());
  };

  const addToWish = (id) => {
    dispatch(addToWishlist(id));
  };

  return (
    <>
      {/* Hero Banner Section */}
      <Container class1="home-wrapper-1 py-3 py-md-5">
        <div className="row g-2 g-md-3">
          {/* Main Banner - Full width on mobile */}
          <div className="col-12 col-lg-6 mb-3 mb-lg-0">
            <div className="main-banner position-relative">
              <img
                src="images/main-banner-1.jpg"
                className="img-fluid rounded-3"
                style={{ width: "100%", height: "auto" }}
                alt="main banner"
              />
              <div className="main-banner-content position-absolute">
                <h4>SUPERCHARGED FOR PROS.</h4>
                <h5>iPad S13+ Pro.</h5>
                <p>From Rs. 81,900.00</p>
                <Link className="button">BUY NOW</Link>
              </div>
            </div>
          </div>

          {/* Small Banners - 2x2 grid */}
          <div className="col-12 col-lg-6">
            <div className="row g-2">
              <div className="col-6">
                <div className="small-banner position-relative">
                  <img
                    src="images/catbanner-01.jpg"
                    className="img-fluid rounded-3"
                    style={{ width: "100%", height: "auto" }}
                    alt="main banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>Best Sake</h4>
                    <h5>MacBook Pro.</h5>
                    <p>From Rs. 1,29,900.00</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="small-banner position-relative">
                  <img
                    src="images/catbanner-02.jpg"
                    className="img-fluid rounded-3"
                    style={{ width: "100%", height: "auto" }}
                    alt="main banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>NEW ARRIVAL</h4>
                    <h5>But IPad Air</h5>
                    <p>From Rs. 21,625.00</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="small-banner position-relative">
                  <img
                    src="images/catbanner-03.jpg"
                    className="img-fluid rounded-3"
                    style={{ width: "100%", height: "auto" }}
                    alt="main banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>NEW ARRIVAL</h4>
                    <h5>But IPad Air</h5>
                    <p>From Rs. 41,900.00</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="small-banner position-relative">
                  <img
                    src="images/catbanner-04.jpg"
                    className="img-fluid rounded-3"
                    style={{ width: "100%", height: "auto" }}
                    alt="main banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>NEW ARRIVAL</h4>
                    <h5>But Headphone</h5>
                    <p>From Rs. 41,000.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Services Section */}
      <Container class1="home-wrapper-2 py-3 py-md-5">
        <div className="row">
          <div className="col-12">
            <div className="row g-3">
              {services?.map((i, j) => (
                <div className="col-6 col-md-4 col-lg-3 col-xl" key={j}>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={i.image}
                      alt="services"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontSize: "14px" }}>
                        {i.title}
                      </h6>
                      <p
                        className="mb-0 d-none d-sm-block"
                        style={{ fontSize: "12px" }}
                      >
                        {i.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Featured Collection */}
      <Container class1="featured-wrapper py-3 py-md-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Featured Collection</h3>
          </div>
        </div>
        <div className="row g-2 g-md-3">
          {productState &&
            productState?.map((item, index) => {
              if (item.tags === "featured") {
                return (
                  <div key={index} className="col-6 col-sm-6 col-md-4 col-lg-3">
                    <div className="product-card position-relative h-100">
                      <div className="wishlist-icon position-absolute">
                        <button className="border-0 bg-transparent">
                          <img
                            src={wish}
                            alt="wishlist"
                            onClick={() => addToWish(item?._id)}
                          />
                        </button>
                      </div>
                      <div className="product-image text-center">
                        <img
                          src={item?.images[0]?.url}
                          className="img-fluid"
                          alt="product"
                          style={{
                            maxHeight: "200px",
                            objectFit: "contain",
                            width: "100%",
                          }}
                          onClick={() => navigate("/product/" + item?._id)}
                        />
                      </div>
                      <div className="product-details p-2">
                        <h6 className="brand" style={{ fontSize: "12px" }}>
                          {item?.brand}
                        </h6>
                        <h5
                          className="product-title"
                          style={{ fontSize: "13px", lineHeight: "1.3" }}
                        >
                          {item?.title?.substr(0, 40) + "..."}
                        </h5>
                        <ReactStars
                          count={5}
                          size={18}
                          value={item?.totalrating.toString()}
                          edit={false}
                          activeColor="#ffd700"
                        />
                        <p className="price mb-0" style={{ fontSize: "14px" }}>
                          Rs. {item?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </Container>

      {/* Famous Products Section */}
      <Container class1="famous-wrapper py-3 py-md-5 home-wrapper-2">
        <div className="row g-2 g-md-3">
          <div className="col-6 col-lg-3">
            <div className="famous-card position-relative">
              <img
                src="images/famous-1.webp"
                className="img-fluid w-100"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5>Big Screen</h5>
                <h6>Smart Watch Series 7</h6>
                <p>From Rs. 399</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="famous-card position-relative">
              <img
                src="images/famous-2.webp"
                className="img-fluid w-100"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5 className="text-dark">Studio Display</h5>
                <h6 className="text-dark">600 nits of brightness.</h6>
                <p className="text-dark">27-inch 5K Retina display</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="famous-card position-relative">
              <img
                src="images/famous-3.webp"
                className="img-fluid w-100"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5 className="text-dark">smartphones</h5>
                <h6 className="text-dark">Iphone 14 Pro.</h6>
                <p className="text-dark">From Rs. 61,000.00</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="famous-card position-relative">
              <img
                src="images/famous-3.webp"
                className="img-fluid w-100"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5 className="text-dark">home speakers</h5>
                <h6 className="text-dark">Room-filling sound.</h6>
                <p className="text-dark">From Rs. 699</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Special Products Section */}
      <Container class1="special-wrapper py-3 py-md-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Special Products</h3>
          </div>
        </div>
        <div className="row g-2 g-md-3">
          {productState &&
            productState?.map((item, index) => {
              if (item.tags === "special") {
                return (
                  <div key={index} className="col-12 col-md-6 col-lg-4">
                    <SpecialProduct
                      id={item?._id}
                      title={item?.title}
                      brand={item?.brand}
                      totalrating={item?.totalrating.toString()}
                      price={item?.price}
                      img={item?.images[0].url}
                      sold={item?.sold}
                      quantity={item?.quantity}
                    />
                  </div>
                );
              }
              return null;
            })}
        </div>
      </Container>

      {/* Popular Products Section */}
      <Container class1="popular-wrapper py-3 py-md-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Popular Products</h3>
          </div>
        </div>
        <div className="row g-2 g-md-3">
          {productState &&
            productState?.map((item, index) => {
              if (item.tags === "popular") {
                return (
                  <div key={index} className="col-6 col-sm-6 col-md-4 col-lg-3">
                    <div className="product-card position-relative h-100">
                      <div className="wishlist-icon position-absolute">
                        <button className="border-0 bg-transparent">
                          <img
                            src={wish}
                            alt="wishlist"
                            onClick={() => addToWish(item?._id)}
                          />
                        </button>
                      </div>
                      <div className="product-image text-center">
                        <img
                          src={item?.images[0].url}
                          className="img-fluid"
                          alt="product"
                          style={{
                            maxHeight: "200px",
                            objectFit: "contain",
                            width: "100%",
                          }}
                          onClick={() => navigate("/product/" + item?._id)}
                        />
                      </div>
                      <div className="product-details p-2">
                        <h6 className="brand" style={{ fontSize: "12px" }}>
                          {item?.brand}
                        </h6>
                        <h5
                          className="product-title"
                          style={{ fontSize: "13px", lineHeight: "1.3" }}
                        >
                          {item?.title?.substr(0, 40) + "..."}
                        </h5>
                        <ReactStars
                          count={5}
                          size={18}
                          value={item?.totalrating.toString()}
                          edit={false}
                          activeColor="#ffd700"
                        />
                        <p className="price mb-0" style={{ fontSize: "14px" }}>
                          Rs. {item?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </Container>

      {/* Brand Marquee */}
      <Container class1="marque-wrapper home-wrapper-2 py-3 py-md-5">
        <div className="row">
          <div className="col-12">
            <div className="marquee-inner-wrapper card-wrapper">
              <Marquee className="d-flex">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div className="mx-3 mx-md-4" key={n}>
                    <img
                      src={`images/brand-0${n}.png`}
                      alt="brand"
                      style={{ maxWidth: "100px" }}
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </Container>

      {/* Blog Section */}
      <Container class1="blog-wrapper py-3 py-md-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Latest Blogs</h3>
          </div>
        </div>
        <div className="row g-2 g-md-3">
          {blogState &&
            blogState?.map((item, index) => {
              if (index < 4) {
                return (
                  <div className="col-6 col-sm-6 col-lg-3" key={index}>
                    <BlogCard
                      id={item?._id}
                      title={item?.title}
                      description={item?.description}
                      image={item?.images[0]?.url}
                      date={moment(item?.createdAt).format(
                        "MMMM Do YYYY, h:mm a"
                      )}
                    />
                  </div>
                );
              }
              return null;
            })}
        </div>
      </Container>
    </>
  );
};

export default Home;
