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

  const location = useLocation();
  const navigate = useNavigate();
  const getProductId = location.pathname.split("/")[2];

  const dispatch = useDispatch();
  const productState =
    useSelector((state) => state?.product?.singleproduct) || {};
  const productsState = useSelector((state) => state?.product?.product) || [];
  const cartState = useSelector((state) => state?.auth?.cartProducts) || [];
  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  // load product, cart and all products on mount / when getProductId changes
  useEffect(() => {
    if (getProductId) {
      dispatch(getAProduct(getProductId));
    }
    dispatch(getUserCart());
    dispatch(getAllProducts());
  }, [dispatch, getProductId]);

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
    width: 594,
    height: 600,
    zoomWidth: 600,
    img:
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
    // if (color === null) {
    //   toast.error("Please choose Color");
    //   return;
    // }

    dispatch(
      addProdToCart({
        productId: productState?._id,
        quantity: Number(quantity),
        color,
        price: productState?.price,
      })
    );
    // navigate after dispatch
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
        // refresh product after a short delay to allow backend to persist
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
          <div className="col-6">
            <div className="main-product-image">
              <div>
                <ReactImageZoom {...props} />
              </div>
            </div>
            <div className="other-product-images d-flex flex-wrap gap-15">
              {(productState?.images || []).map((item, index) => (
                <div key={item?.public_id || index}>
                  <img
                    src={item?.url}
                    className="img-fluid"
                    alt={`img-${index}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="col-6">
            <div className="main-product-details">
              <div className="border-bottom">
                <h3 className="title">{productState?.title}</h3>
              </div>

              <div className="border-bottom py-3">
                <p className="price"> Rs. {productState?.price}/-</p>
                <div className="d-flex align-items-center gap-10">
                  <ReactStars
                    count={5}
                    size={24}
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

              <div className=" py-3">
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Type :</h3>
                  <p className="product-data">{productState?.category}</p>
                </div>

                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Brand :</h3>
                  <p className="product-data">{productState?.brand}</p>
                </div>

                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Category :</h3>
                  <p className="product-data">{productState?.category}</p>
                </div>

                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Tags :</h3>
                  <p className="product-data">{productState?.tags}</p>
                </div>

                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Availability :</h3>
                  <p className="product-data">In Stock</p>
                </div>

                {alreadyAdded === false && (
                  <div className="d-flex gap-10 flex-column mt-2 mb-3">
                    <h3 className="product-heading">Color :</h3>
                    <Color
                      setColor={setColor}
                      colorData={productState?.color}
                    />
                  </div>
                )}

                <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                  <h3 className="product-heading">Quantity :</h3>
                  {alreadyAdded === false && (
                    <div>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        className="form-control"
                        style={{ width: "70px" }}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        value={quantity}
                      />
                    </div>
                  )}

                  <div
                    className={
                      alreadyAdded
                        ? "ms-0"
                        : "ms-5 d-flex align-items-center gap-30"
                    }
                  >
                    <button
                      className="button border-0"
                      type="button"
                      onClick={() => {
                        alreadyAdded ? navigate("/cart") : uploadCart();
                      }}
                    >
                      {alreadyAdded ? "Go to Cart" : "Add to Cart "}
                    </button>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-15">
                  <div>
                    {isFilled ? (
                      <AiFillHeart
                        className="fs-5 me-2"
                        onClick={handleToggle}
                      />
                    ) : (
                      <AiOutlineHeart
                        className="fs-5 me-2"
                        onClick={handleToggle}
                      />
                    )}
                  </div>
                </div>

                <div className="d-flex gap-10 flex-column  my-3">
                  <h3 className="product-heading">Shipping & Returns :</h3>
                  <p className="product-data">
                    Free shipping and returns available on all orders! <br /> We
                    ship all India domestic orders within{" "}
                    <b> 5-10 business days!</b>
                  </p>
                </div>

                <div className="d-flex gap-10 align-items-center my-3">
                  <h3 className="product-heading">Product Link:</h3>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      copyToClipboard(window.location.href);
                    }}
                  >
                    Copy Product Link
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container class1="description-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h4>Description</h4>
            <div className="bg-white p-3">
              <p
                dangerouslySetInnerHTML={{
                  __html: productState?.description || "",
                }}
              ></p>
            </div>
          </div>
        </div>
      </Container>

      <Container class1="reviews-wrapper home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 id="review">Reviews</h3>
            <div className="review-inner-wrapper">
              <div className="review-head d-flex justify-content-between align-items-end">
                <div>
                  <h4 className="mb-2">Customer Reviews</h4>
                  <div className="d-flex align-items-center gap-10">
                    <ReactStars
                      count={5}
                      size={24}
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
                  <div>
                    <a
                      className="text-dark text-decoration-underline"
                      href="#review"
                    >
                      Write a Review
                    </a>
                  </div>
                )}
              </div>

              <div className="review-form py-4">
                <h4>Write a Review</h4>

                <div>
                  <ReactStars
                    count={5}
                    size={24}
                    value={0}
                    edit={true}
                    activeColor="#ffd700"
                    onChange={(val) => setStar(val)}
                  />
                </div>

                <div>
                  <textarea
                    className="w-100 form-control"
                    cols="30"
                    rows="4"
                    placeholder="Comments"
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end mt-3">
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
                    <div className="d-flex gap-10 align-items-center">
                      <h6 className="mb-0">user</h6>
                      <ReactStars
                        count={5}
                        size={24}
                        value={item?.star || 0}
                        edit={false}
                        activeColor="#ffd700"
                      />
                    </div>
                    <p className="mt-3">{item?.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Popular Products</h3>
          </div>
        </div>
        <div className="row">
          <ProductCard data={popularProduct} />
        </div>
      </Container>
    </>
  );
};

export default SingleProduct;
