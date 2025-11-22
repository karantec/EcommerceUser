import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import ReactImageZoom from "react-image-zoom";
import Color from "../components/Color";
import { TbGitCompare } from "react-icons/tb";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import watch from "../images/watch.jpg";
import Container from "../components/Container";
import { addToWishlist } from "../features/products/productSlilce";
import { useDispatch, useSelector } from "react-redux";
import {
  addRating,
  getAProduct,
  getAllProducts,
} from "../features/products/productSlilce";
import { toast } from "react-toastify";
import { addProdToCart, getUserCart } from "../features/user/userSlice";

const SingleProduct = () => {
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [popularProduct, setPopularProduct] = useState([]);
  const [orderedProduct, setOrderedProduct] = useState(true);
  const [star, setStar] = useState(null);
  const [comment, setComment] = useState(null);
  const [isFilled, setIsFilled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const getProductId = location.pathname.split("/")[2];

  const dispatch = useDispatch();
  const productState =
    useSelector((state) => state?.product?.singleproduct) || {};
  const productsState = useSelector((state) => state?.product?.product) || [];
  const cartState = useSelector((state) => state?.auth?.cartProducts) || [];
  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // load product, cart and all products on mount / when getProductId changes
  useEffect(() => {
    if (getProductId) {
      dispatch(getAProduct(getProductId));
    }
    dispatch(getUserCart());
    dispatch(getAllProducts());
  }, [dispatch, getProductId]);

  // Set initial selected image
  useEffect(() => {
    if (productState?.images?.[0]?.url) {
      setSelectedImage(productState.images[0].url);
    }
  }, [productState?.images]);

  // update alreadyAdded when cartState or getProductId changes
  useEffect(() => {
    const added = Array.isArray(cartState)
      ? cartState.some((c) => c?.productId?._id === getProductId)
      : false;
    setAlreadyAdded(added);
  }, [cartState, getProductId]);

  // set popular products (filter once productsState changes)
  useEffect(() => {
    if (Array.isArray(productsState) && productsState.length) {
      const popular = productsState.filter((p) => p?.tags === "popular");
      setPopularProduct(popular);
    } else {
      setPopularProduct([]);
    }
  }, [productsState]);

  // safe image props for ReactImageZoom (guard for missing images)
  const props = {
    width: isMobile ? window.innerWidth - 40 : 594,
    height: isMobile ? window.innerWidth - 40 : 600,
    zoomWidth: 600,
    img:
      selectedImage ||
      productState?.images?.[0]?.url ||
      "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-fernando-arcos-190819.jpg&fm=jpg",
  };

  const copyToClipboard = (text) => {
    const textField = document.createElement("textarea");
    textField.value = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast.success("Link copied to clipboard");
  };

  const uploadCart = () => {
    dispatch(
      addProdToCart({
        productId: productState?._id,
        quantity: Number(quantity),
        color,
        price: productState?.price,
      })
    );
    navigate("/cart");
  };

  const handleToggle = () => {
    setIsFilled((s) => !s);
  };

  const addRatingToProduct = () => {
    if (star === null) {
      toast.error("Please add star rating");
      return false;
    }
    if (!comment || comment.trim() === "") {
      toast.error("Please write review about the product");
      return false;
    }

    dispatch(addRating({ star, comment, prodId: getProductId }))
      .unwrap?.()
      .catch(() => {})
      .finally(() => {
        setTimeout(() => dispatch(getAProduct(getProductId)), 200);
      });

    return false;
  };

  return (
    <>
      <Meta title={productState?.title || "Product"} />
      <BreadCrumb title={productState?.title || "Product"} />

      <Container class1="main-product-wrapper py-5 home-wrapper-2">
        <div className="row">
          {/* Product Images */}
          <div className="col-12 col-lg-6 mb-4 mb-lg-0">
            <div className="main-product-image">
              <div className="zoom-wrapper">
                {isMobile ? (
                  <img
                    src={
                      selectedImage ||
                      productState?.images?.[0]?.url ||
                      "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-fernando-arcos-190819.jpg&fm=jpg"
                    }
                    alt="Product"
                    className="mobile-main-image"
                    onError={(e) => {
                      e.target.src =
                        "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-fernando-arcos-190819.jpg&fm=jpg";
                    }}
                  />
                ) : (
                  <ReactImageZoom {...props} />
                )}
              </div>
            </div>
            <div className="other-product-images d-flex flex-wrap gap-2 gap-md-3 mt-3">
              {(productState?.images || []).map((item, index) => (
                <div
                  key={item?.public_id || index}
                  className={`thumbnail-wrapper ${
                    selectedImage === item?.url ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(item?.url)}
                >
                  <img
                    src={item?.url}
                    className="img-fluid"
                    alt={`thumbnail-${index}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-12 col-lg-6">
            <div className="main-product-details">
              <div className="border-bottom pb-3">
                <h3 className="title">{productState?.title}</h3>
              </div>

              <div className="border-bottom py-3">
                <p className="price">
                  {" "}
                  Rs. {productState?.price?.toLocaleString()}/-
                </p>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <ReactStars
                    count={5}
                    size={window.innerWidth < 576 ? 18 : 24}
                    value={Number(productState?.totalrating) || 0}
                    edit={false}
                    activeColor="#ffd700"
                  />
                  <p className="mb-0 t-review">
                    ( {productState?.ratings?.length || 0} Reviews )
                  </p>
                </div>
                <a className="review-btn" href="#review">
                  Write a Review
                </a>
              </div>

              <div className="py-3">
                <div className="product-info-item">
                  <h3 className="product-heading">Type :</h3>
                  <p className="product-data">{productState?.category}</p>
                </div>

                <div className="product-info-item">
                  <h3 className="product-heading">Brand :</h3>
                  <p className="product-data">{productState?.brand}</p>
                </div>

                <div className="product-info-item">
                  <h3 className="product-heading">Category :</h3>
                  <p className="product-data">{productState?.category}</p>
                </div>

                <div className="product-info-item">
                  <h3 className="product-heading">Tags :</h3>
                  <p className="product-data">{productState?.tags}</p>
                </div>

                <div className="product-info-item">
                  <h3 className="product-heading">Availability :</h3>
                  <p className="product-data">In Stock</p>
                </div>

                {alreadyAdded === false && (
                  <div className="color-selector mt-3 mb-3">
                    <h3 className="product-heading mb-2">Color :</h3>
                    <Color
                      setColor={setColor}
                      colorData={productState?.color}
                    />
                  </div>
                )}

                <div className="quantity-cart-wrapper">
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <h3 className="product-heading mb-0">Quantity :</h3>
                    {alreadyAdded === false && (
                      <div className="quantity-input">
                        <input
                          type="number"
                          min={1}
                          max={10}
                          className="form-control"
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          value={quantity}
                        />
                      </div>
                    )}
                  </div>

                  <div className="cart-button-wrapper mt-3">
                    <button
                      className="button border-0 w-100 w-sm-auto"
                      type="button"
                      onClick={() => {
                        alreadyAdded ? navigate("/cart") : uploadCart();
                      }}
                    >
                      {alreadyAdded ? "Go to Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>

                <div className="wishlist-wrapper mt-3">
                  <button
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                    onClick={handleToggle}
                  >
                    {isFilled ? (
                      <AiFillHeart className="fs-5 text-danger" />
                    ) : (
                      <AiOutlineHeart className="fs-5" />
                    )}
                    <span>
                      {isFilled ? "Remove from Wishlist" : "Add to Wishlist"}
                    </span>
                  </button>
                </div>

                <div className="shipping-info mt-4 p-3 bg-light rounded">
                  <h3 className="product-heading">Shipping & Returns :</h3>
                  <p className="product-data mb-0">
                    Free shipping and returns available on all orders! <br /> We
                    ship all India domestic orders within{" "}
                    <b>5-10 business days!</b>
                  </p>
                </div>

                <div className="product-link-wrapper mt-3">
                  <h3 className="product-heading mb-2">Product Link:</h3>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      copyToClipboard(window.location.href);
                    }}
                  >
                    Copy Product Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Description Section */}
      <Container class1="description-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h4 className="section-heading">Description</h4>
            <div className="bg-white p-3 p-md-4 rounded">
              <p
                className="description-text"
                dangerouslySetInnerHTML={{
                  __html:
                    productState?.description || "No description available.",
                }}
              ></p>
            </div>
          </div>
        </div>
      </Container>

      {/* Reviews Section */}
      <Container class1="reviews-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 id="review" className="section-heading">
              Reviews
            </h3>
            <div className="review-inner-wrapper">
              <div className="review-head">
                <div className="mb-3 mb-md-0">
                  <h4 className="mb-2">Customer Reviews</h4>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <ReactStars
                      count={5}
                      size={window.innerWidth < 576 ? 18 : 24}
                      value={Number(productState?.totalrating) || 0}
                      edit={false}
                      activeColor="#ffd700"
                    />
                    <p className="mb-0">
                      Based on {productState?.ratings?.length || 0} Reviews
                    </p>
                  </div>
                </div>
                {orderedProduct && (
                  <div className="mt-3 mt-md-0">
                    <a
                      className="text-dark text-decoration-underline"
                      href="#review-form"
                    >
                      Write a Review
                    </a>
                  </div>
                )}
              </div>

              <div id="review-form" className="review-form py-4">
                <h4 className="mb-3">Write a Review</h4>

                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <ReactStars
                    count={5}
                    size={window.innerWidth < 576 ? 20 : 24}
                    value={0}
                    edit={true}
                    activeColor="#ffd700"
                    onChange={(val) => setStar(val)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Your Review</label>
                  <textarea
                    className="form-control"
                    rows={window.innerWidth < 576 ? "3" : "4"}
                    placeholder="Write your review here..."
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    onClick={addRatingToProduct}
                    className="button border-0"
                    type="button"
                  >
                    Submit Review
                  </button>
                </div>
              </div>

              <div className="reviews mt-4">
                {(productState?.ratings || []).map((item, index) => (
                  <div className="review" key={item._id || index}>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                      <h6 className="mb-0">User</h6>
                      <ReactStars
                        count={5}
                        size={window.innerWidth < 576 ? 16 : 20}
                        value={item?.star || 0}
                        edit={false}
                        activeColor="#ffd700"
                      />
                    </div>
                    <p className="mt-2">{item?.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Popular Products */}
      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading mb-4">Our Popular Products</h3>
          </div>
        </div>
        <div className="row">
          <ProductCard
            data={popularProduct}
            grid={window.innerWidth < 768 ? 6 : 3}
          />
        </div>
      </Container>

      <style>{`
        /* ========== MAIN PRODUCT SECTION ========== */
        .main-product-wrapper {
          background: #f9f9f9;
        }

        .main-product-image {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .zoom-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          background: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
        }

        .zoom-wrapper img {
          max-width: 100%;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .mobile-main-image {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: contain;
          display: block;
        }

        /* Thumbnail Images */
        .other-product-images {
          margin-top: 15px;
        }

        .thumbnail-wrapper {
          width: 80px;
          height: 80px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fff;
          padding: 5px;
        }

        .thumbnail-wrapper:hover {
          border-color: #232f3e;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .thumbnail-wrapper.active {
          border-color: #232f3e;
          box-shadow: 0 0 0 2px rgba(35, 47, 62, 0.2);
        }

        .thumbnail-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Product Details */
        .main-product-details {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .title {
          font-size: 24px;
          font-weight: 700;
          color: #232f3e;
          line-height: 1.3;
        }

        .price {
          font-size: 28px;
          font-weight: 700;
          color: #e74c3c;
          margin: 10px 0;
        }

        .t-review {
          font-size: 14px;
          color: #777;
        }

        .review-btn {
          display: inline-block;
          margin-top: 10px;
          color: #232f3e;
          text-decoration: underline;
          font-weight: 500;
        }

        .review-btn:hover {
          color: #000;
        }

        /* Product Info Items */
        .product-info-item {
          display: flex;
          gap: 10px;
          align-items: center;
          margin: 12px 0;
          flex-wrap: wrap;
        }

        .product-heading {
          font-size: 14px;
          font-weight: 600;
          color: #232f3e;
          margin: 0;
          white-space: nowrap;
        }

        .product-data {
          font-size: 14px;
          color: #555;
          margin: 0;
        }

        /* Color Selector */
        .color-selector {
          padding: 15px 0;
        }

        /* Quantity & Cart */
        .quantity-cart-wrapper {
          margin: 20px 0;
        }

        .quantity-input input {
          width: 80px;
          padding: 8px;
          text-align: center;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          font-weight: 600;
        }

        .button {
          background: #232f3e;
          color: #fff;
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .button:hover {
          background: #1a2332;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        /* Wishlist */
        .wishlist-wrapper button {
          padding: 10px 20px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .wishlist-wrapper button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        /* Shipping Info */
        .shipping-info {
          border-left: 4px solid #232f3e;
        }

        /* Section Headings */
        .section-heading {
          font-size: 22px;
          font-weight: 700;
          color: #232f3e;
          margin-bottom: 20px;
        }

        /* Description */
        .description-text {
          font-size: 15px;
          line-height: 1.8;
          color: #555;
        }

        /* Reviews */
        .review-inner-wrapper {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .review-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
          flex-wrap: wrap;
        }

        .review-form {
          border-bottom: 1px solid #e0e0e0;
        }

        .review {
          padding: 20px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .review:last-child {
          border-bottom: none;
        }

        /* ========== TABLET (768px - 991px) ========== */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .main-product-details {
            padding: 20px;
          }

          .title {
            font-size: 22px;
          }

          .price {
            font-size: 24px;
          }

          .thumbnail-wrapper {
            width: 70px;
            height: 70px;
          }
        }

                  /* ========== MOBILE (< 768px) ========== */
        @media (max-width: 767.98px) {
          .main-product-wrapper {
            padding: 20px 0 !important;
          }

          .main-product-image {
            padding: 15px;
            margin-bottom: 20px;
          }

          .zoom-wrapper {
            min-height: 280px;
            padding: 10px;
          }

          .mobile-main-image {
            max-height: 280px;
          }

          .main-product-details {
            padding: 20px 15px;
          }

          .title {
            font-size: 20px;
          }

          .price {
            font-size: 24px;
          }

          .product-heading {
            font-size: 13px;
          }

          .product-data {
            font-size: 13px;
          }

          .thumbnail-wrapper {
            width: 65px;
            height: 65px;
          }

          .quantity-input input {
            width: 70px;
            padding: 6px;
          }

          .button {
            padding: 10px 20px;
            font-size: 14px;
          }

          .shipping-info {
            padding: 15px !important;
          }

          .section-heading {
            font-size: 18px;
          }

          .review-inner-wrapper {
            padding: 20px 15px;
          }

          .description-wrapper .bg-white {
            padding: 15px !important;
          }
        }

        /* ========== SMALL MOBILE (< 576px) ========== */
        @media (max-width: 575.98px) {
          .main-product-image {
            padding: 10px;
          }

          .zoom-wrapper {
            min-height: 250px;
            padding: 5px;
          }

          .mobile-main-image {
            max-height: 250px;
          }

          .main-product-details {
            padding: 15px;
          }

          .title {
            font-size: 18px;
          }

          .price {
            font-size: 22px;
          }

          .product-heading {
            font-size: 12px;
          }

          .product-data {
            font-size: 12px;
          }

          .thumbnail-wrapper {
            width: 55px;
            height: 55px;
          }

          .other-product-images {
            gap: 8px !important;
          }

          .quantity-input input {
            width: 60px;
            font-size: 14px;
          }

          .button {
            padding: 10px 18px;
            font-size: 13px;
            width: 100%;
          }

          .wishlist-wrapper button {
            width: 100%;
            justify-content: center;
          }

          .shipping-info {
            padding: 12px !important;
            font-size: 13px;
          }

          .shipping-info .product-heading {
            font-size: 13px;
            margin-bottom: 8px;
          }

          .shipping-info .product-data {
            font-size: 12px;
          }

          .section-heading {
            font-size: 16px;
          }

          .review-inner-wrapper {
            padding: 15px;
          }

          .review-form h4 {
            font-size: 16px;
          }

          .form-label {
            font-size: 13px;
          }
        }

        /* ========== EXTRA SMALL (< 400px) ========== */
        @media (max-width: 399.98px) {
          .title {
            font-size: 16px;
          }

          .price {
            font-size: 20px;
          }

          .thumbnail-wrapper {
            width: 50px;
            height: 50px;
          }

          .section-heading {
            font-size: 15px;
          }
        }

        /* ========== LARGE DESKTOP (>= 1200px) ========== */
        @media (min-width: 1200px) {
          .main-product-details {
            padding: 30px;
          }

          .title {
            font-size: 28px;
          }

          .price {
            font-size: 32px;
          }

          .thumbnail-wrapper {
            width: 90px;
            height: 90px;
          }
        }
      `}</style>
    </>
  );
};

export default SingleProduct;
