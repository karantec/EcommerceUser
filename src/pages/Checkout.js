import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { config } from "../utils/axiosConfig";
import {
  createAnOrder,
  deleteUserCart,
  getUserCart,
  resetState,
} from "../features/user/userSlice";

let shippingSchema = yup.object({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  address: yup.string().required("Address Details are Required"),
  state: yup.string().required("State is Required"),
  city: yup.string().required("City is Required"),
  country: yup.string().required("Country is Required"),
  pincode: yup.number("Pincode No is Required").required().positive().integer(),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const [totalAmount, setTotalAmount] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    razorpayPaymentId: "",
    razorpayOrderId: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      setTotalAmount(sum);
    }
  }, [cartState]);

  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    dispatch(getUserCart(config2));
  }, []);

  useEffect(() => {
    if (
      authState?.orderedProduct?.order !== null &&
      authState?.orderedProduct?.success === true
    ) {
      navigate("/my-orders");
    }
  }, [authState]);

  const [cartProductState, setCartProductState] = useState([]);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      address: "",
      state: "",
      city: "",
      country: "",
      pincode: "",
      other: "",
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      setShippingInfo(values);
      localStorage.setItem("address", JSON.stringify(values));
      setTimeout(() => {
        checkOutHandler();
      }, 300);
    },
  });

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (cartState && cartState.length > 0) {
      let items = [];
      for (let index = 0; index < cartState.length; index++) {
        const item = cartState[index];
        if (item?.productId?._id && item?.color?._id) {
          items.push({
            product: item.productId._id,
            quantity: item.quantity,
            color: item.color._id,
            price: item.price,
          });
        }
      }
      setCartProductState(items);
    }
  }, [cartState]);

  const checkOutHandler = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to Load");
      return;
    }
    const result = await axios.post(
      "https://ecommercemea.onrender.com/api/user/order/checkout",
      { amount: totalAmount + 100 },
      config
    );

    if (!result) {
      alert("Something Went Wrong");
      return;
    }

    const { amount, id: order_id, currency } = result.data.order;

    const options = {
      key: "rzp_test_HSSeDI22muUrLR",
      amount: amount,
      currency: currency,
      name: "Cart's corner",
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
        };

        const result = await axios.post(
          "https://ecommercemea.onrender.com/api/user/order/paymentVerification",
          data,
          config
        );

        dispatch(
          createAnOrder({
            totalPrice: totalAmount,
            totalPriceAfterDiscount: totalAmount,
            orderItems: cartProductState,
            paymentInfo: result.data,
            shippingInfo: JSON.parse(localStorage.getItem("address")),
          })
        );
        dispatch(deleteUserCart(config2));
        localStorage.removeItem("address");
        dispatch(resetState());
      },
      prefill: {
        name: "Dev Corner",
        email: "devcorner@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "developer's corner office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      <Container class1="checkout-wrapper py-5 home-wrapper-2">
        <div className="row">
          {/* Left Section - Checkout Form */}
          <div className="col-12 col-lg-7 order-2 order-lg-1">
            <div className="checkout-left-data">
              <h3 className="website-name">Cart Corner</h3>

              {/* Breadcrumb */}
              <nav
                style={{ "--bs-breadcrumb-divider": ">" }}
                aria-label="breadcrumb"
                className="breadcrumb-wrapper"
              >
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link className="text-dark" to="/cart">
                      Cart
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Information
                  </li>
                  <li className="breadcrumb-item active">Shipping</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Payment
                  </li>
                </ol>
              </nav>

              {/* Contact Information */}
              <div className="contact-info-section">
                <h4 className="section-title">Contact Information</h4>
                <p className="user-details">
                  Dev Jariwala (devjariwala8444@gmail.com)
                </p>
              </div>

              {/* Shipping Form */}
              <h4 className="section-title mb-3">Shipping Address</h4>
              <form onSubmit={formik.handleSubmit} className="shipping-form">
                {/* Country */}
                <div className="form-group">
                  <select
                    className="form-control form-select"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange("country")}
                    onBlur={formik.handleBlur("country")}
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    <option value="India">India</option>
                  </select>
                  <div className="error-message">
                    {formik.touched.country && formik.errors.country}
                  </div>
                </div>

                {/* Name Fields */}
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="form-control"
                      name="firstname"
                      value={formik.values.firstname}
                      onChange={formik.handleChange("firstname")}
                      onBlur={formik.handleBlur("firstname")}
                    />
                    <div className="error-message">
                      {formik.touched.firstname && formik.errors.firstname}
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="form-control"
                      name="lastname"
                      value={formik.values.lastname}
                      onChange={formik.handleChange("lastname")}
                      onBlur={formik.handleBlur("lastname")}
                    />
                    <div className="error-message">
                      {formik.touched.lastname && formik.errors.lastname}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Address"
                    className="form-control"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange("address")}
                    onBlur={formik.handleBlur("address")}
                  />
                  <div className="error-message">
                    {formik.touched.address && formik.errors.address}
                  </div>
                </div>

                {/* Apartment */}
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Apartment, Suite, etc (optional)"
                    className="form-control"
                    name="other"
                    value={formik.values.other}
                    onChange={formik.handleChange("other")}
                    onBlur={formik.handleBlur("other")}
                  />
                </div>

                {/* City, State, Pincode */}
                <div className="form-row-three">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="City"
                      className="form-control"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange("city")}
                      onBlur={formik.handleBlur("city")}
                    />
                    <div className="error-message">
                      {formik.touched.city && formik.errors.city}
                    </div>
                  </div>
                  <div className="form-group">
                    <select
                      className="form-control form-select"
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange("state")}
                      onBlur={formik.handleBlur("state")}
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                    <div className="error-message">
                      {formik.touched.state && formik.errors.state}
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Pincode"
                      className="form-control"
                      name="pincode"
                      value={formik.values.pincode}
                      onChange={formik.handleChange("pincode")}
                      onBlur={formik.handleBlur("pincode")}
                    />
                    <div className="error-message">
                      {formik.touched.pincode && formik.errors.pincode}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                  <Link to="/cart" className="back-to-cart">
                    <BiArrowBack className="me-2" />
                    Return to Cart
                  </Link>
                  <button className="button submit-btn" type="submit">
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="col-12 col-lg-5 order-1 order-lg-2 mb-4 mb-lg-0">
            {/* Mobile Order Summary Toggle */}
            <button
              className="d-lg-none w-100 order-summary-toggle mb-3"
              onClick={() => setShowOrderSummary(!showOrderSummary)}
            >
              <span>{showOrderSummary ? "Hide" : "Show"} order summary</span>
              <span className="total-amount">
                Rs. {totalAmount ? totalAmount + 100 : "0"}
              </span>
            </button>

            <div className={`order-summary ${showOrderSummary ? "show" : ""}`}>
              {/* Cart Items */}
              <div className="cart-items-section">
                {cartState &&
                  cartState?.map((item, index) => {
                    return (
                      <div key={index} className="cart-item">
                        <div className="item-info">
                          <div className="item-image-wrapper">
                            <span className="item-quantity-badge">
                              {item?.quantity}
                            </span>
                            <img
                              src={item?.productId?.images?.[0]?.url}
                              alt="product"
                              className="item-image"
                            />
                          </div>
                          <div className="item-details">
                            <h5 className="item-title">
                              {item?.productId?.title}
                            </h5>
                            <p className="item-color">{item?.color?.title}</p>
                          </div>
                        </div>
                        <div className="item-price">
                          <h5>
                            Rs.{" "}
                            {(item?.price * item?.quantity)?.toLocaleString()}
                          </h5>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Pricing Summary */}
              <div className="pricing-summary">
                <div className="price-row">
                  <p>Subtotal</p>
                  <p>Rs. {totalAmount ? totalAmount.toLocaleString() : "0"}</p>
                </div>
                <div className="price-row">
                  <p>Shipping</p>
                  <p>Rs. 100</p>
                </div>
              </div>

              {/* Total */}
              <div className="total-section">
                <h4>Total</h4>
                <h5>
                  Rs. {totalAmount ? (totalAmount + 100).toLocaleString() : "0"}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        /* ========== CHECKOUT WRAPPER ========== */
        .checkout-wrapper {
          background: #f9f9f9;
        }

        /* ========== LEFT SECTION - FORM ========== */
        .checkout-left-data {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .website-name {
          font-size: 28px;
          font-weight: 700;
          color: #232f3e;
          margin-bottom: 20px;
        }

        /* Breadcrumb */
        .breadcrumb-wrapper {
          margin-bottom: 25px;
        }

        .breadcrumb {
          background: none;
          padding: 0;
          margin: 0;
          font-size: 14px;
        }

        .breadcrumb-item {
          color: #777;
        }

        .breadcrumb-item.active {
          color: #232f3e;
          font-weight: 500;
        }

        .breadcrumb-item + .breadcrumb-item::before {
          content: "›";
          padding: 0 8px;
          color: #999;
        }

        /* Contact Info */
        .contact-info-section {
          padding: 15px 0;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 10px;
        }

        .user-details {
          color: #555;
          font-size: 14px;
          margin: 0;
        }

        /* Form Styles */
        .shipping-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-row-three {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
        }

        .form-control {
          padding: 12px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-control:focus {
          border-color: #232f3e;
          outline: none;
          box-shadow: 0 0 0 3px rgba(35, 47, 62, 0.1);
        }

        .error-message {
          color: #e74c3c;
          font-size: 12px;
          margin-left: 4px;
          min-height: 18px;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .back-to-cart {
          color: #232f3e;
          text-decoration: none;
          display: flex;
          align-items: center;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .back-to-cart:hover {
          color: #000;
          transform: translateX(-3px);
        }

        .submit-btn {
          background: #232f3e;
          color: #fff;
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: #1a2332;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        /* ========== RIGHT SECTION - ORDER SUMMARY ========== */
        .order-summary-toggle {
          display: none;
          background: #fff;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px 20px;
          font-size: 16px;
          font-weight: 600;
          color: #232f3e;
          cursor: pointer;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
        }

        .order-summary-toggle:hover {
          border-color: #232f3e;
        }

        .total-amount {
          color: #e74c3c;
          font-size: 18px;
        }

        .order-summary {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          position: sticky;
          top: 20px;
        }

        /* Cart Items */
        .cart-items-section {
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .cart-item:last-child {
          margin-bottom: 0;
        }

        .item-info {
          display: flex;
          gap: 15px;
          flex: 1;
        }

        .item-image-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }

        .item-quantity-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #232f3e;
          color: #fff;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          z-index: 1;
        }

        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .item-details {
          flex: 1;
        }

        .item-title {
          font-size: 14px;
          font-weight: 600;
          color: #232f3e;
          margin: 0 0 5px 0;
          line-height: 1.3;
        }

        .item-color {
          font-size: 13px;
          color: #777;
          margin: 0;
        }

        .item-price {
          text-align: right;
        }

        .item-price h5 {
          font-size: 16px;
          font-weight: 700;
          color: #232f3e;
          margin: 0;
        }

        /* Pricing Summary */
        .pricing-summary {
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .price-row:last-child {
          margin-bottom: 0;
        }

        .price-row p {
          margin: 0;
          font-size: 15px;
          color: #555;
        }

        /* Total Section */
        .total-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-section h4 {
          font-size: 20px;
          font-weight: 700;
          color: #232f3e;
          margin: 0;
        }

        .total-section h5 {
          font-size: 22px;
          font-weight: 700;
          color: #e74c3c;
          margin: 0;
        }

        /* ========== TABLET (768px - 991px) ========== */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .checkout-left-data {
            padding: 25px;
          }

          .website-name {
            font-size: 24px;
          }

          .form-row-three {
            grid-template-columns: 1fr 1fr;
          }

          .form-row-three .form-group:last-child {
            grid-column: 1 / -1;
          }
        }

        /* ========== MOBILE (< 768px) ========== */
        @media (max-width: 767.98px) {
          .checkout-wrapper {
            padding: 15px 0 !important;
          }

          .checkout-left-data {
            padding: 20px 15px;
          }

          .website-name {
            font-size: 22px;
            margin-bottom: 15px;
          }

          .breadcrumb {
            font-size: 12px;
            flex-wrap: wrap;
          }

          .breadcrumb-item + .breadcrumb-item::before {
            padding: 0 5px;
          }

          .section-title {
            font-size: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .form-row-three {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .form-actions {
            flex-direction: column;
            gap: 15px;
          }

          .back-to-cart {
            width: 100%;
            justify-content: center;
            padding: 10px;
          }

          .submit-btn {
            width: 100%;
            padding: 14px;
          }

          /* Order Summary Mobile */
          .order-summary-toggle {
            display: flex;
          }

          .order-summary {
            display: none;
            position: static;
            margin-bottom: 20px;
            padding: 20px 15px;
          }

          .order-summary.show {
            display: block;
          }

          .item-image-wrapper {
            width: 70px;
            height: 70px;
          }

          .item-title {
            font-size: 13px;
          }

          .item-color {
            font-size: 12px;
          }

          .item-price h5 {
            font-size: 14px;
          }

          .total-section h4 {
            font-size: 18px;
          }

          .total-section h5 {
            font-size: 20px;
          }
        }

        /* ========== SMALL MOBILE (< 576px) ========== */
        @media (max-width: 575.98px) {
          .checkout-left-data {
            padding: 15px;
          }

          .website-name {
            font-size: 20px;
          }

          .section-title {
            font-size: 15px;
          }

          .user-details {
            font-size: 13px;
          }

          .form-control {
            padding: 10px 12px;
            font-size: 13px;
          }

          .error-message {
            font-size: 11px;
          }

          .submit-btn {
            font-size: 14px;
            padding: 12px;
          }

          .order-summary-toggle {
            padding: 12px 15px;
            font-size: 14px;
          }

          .total-amount {
            font-size: 16px;
          }

          .order-summary {
            padding: 15px;
          }

          .item-image-wrapper {
            width: 60px;
            height: 60px;
          }

          .item-quantity-badge {
            width: 20px;
            height: 20px;
            font-size: 11px;
          }

          .item-title {
            font-size: 12px;
          }

          .item-color {
            font-size: 11px;
          }

          .item-price h5 {
            font-size: 13px;
          }

          .price-row p {
            font-size: 14px;
          }

          .total-section h4 {
            font-size: 16px;
          }

          .total-section h5 {
            font-size: 18px;
          }
        }

        /* ========== EXTRA SMALL (< 400px) ========== */
        @media (max-width: 399.98px) {
          .website-name {
            font-size: 18px;
          }

          .breadcrumb {
            font-size: 11px;
          }

          .section-title {
            font-size: 14px;
          }

          .item-image-wrapper {
            width: 55px;
            height: 55px;
          }
        }

        /* ========== LARGE DESKTOP (>= 1200px) ========== */
        @media (min-width: 1200px) {
          .checkout-left-data {
            padding: 35px;
          }

          .website-name {
            font-size: 30px;
          }

          .order-summary {
            padding: 30px;
          }
        }
      `}</style>
    </>
  );
};

export default Checkout;
