import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import BreadCrumb from "../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../features/user/userSlice";
import { FiPackage, FiClock, FiCheckCircle, FiTruck } from "react-icons/fi";

const Orders = () => {
  const dispatch = useDispatch();
  const orderState = useSelector(
    (state) => state?.auth?.getorderedProduct?.orders
  );
  const [isMobile, setIsMobile] = useState(false);

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
    dispatch(getOrders(config2));
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return <FiClock className="status-icon" />;
      case "shipped":
        return <FiTruck className="status-icon" />;
      case "delivered":
        return <FiCheckCircle className="status-icon" />;
      default:
        return <FiPackage className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  return (
    <>
      <BreadCrumb title="My Orders" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            {/* Desktop Header - Hidden on Mobile */}
            <div className="orders-header d-none d-md-block">
              <div className="row">
                <div className="col-md-3">
                  <h5>Order ID</h5>
                </div>
                <div className="col-md-3">
                  <h5>Total Amount</h5>
                </div>
                <div className="col-md-3">
                  <h5>After Discount</h5>
                </div>
                <div className="col-md-3">
                  <h5>Status</h5>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="orders-list">
              {orderState && orderState.length > 0 ? (
                orderState.map((item, index) => {
                  return (
                    <div className="order-card" key={index}>
                      {/* Order Summary - Responsive */}
                      <div className="order-summary">
                        <div className="row g-3">
                          <div className="col-12 col-md-3">
                            <div className="order-info-item">
                              <span className="info-label d-md-none">
                                Order ID:
                              </span>
                              <span className="order-id">{item?._id}</span>
                            </div>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="order-info-item">
                              <span className="info-label d-md-none">
                                Total:
                              </span>
                              <span className="info-value">
                                Rs. {item?.totalPrice?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="order-info-item">
                              <span className="info-label d-md-none">
                                After Discount:
                              </span>
                              <span className="info-value">
                                Rs.{" "}
                                {item?.totalPriceAfterDiscount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="col-12 col-md-3">
                            <div className="order-info-item">
                              <span className="info-label d-md-none">
                                Status:
                              </span>
                              <span
                                className={`order-status ${getStatusClass(
                                  item?.orderStatus
                                )}`}
                              >
                                {getStatusIcon(item?.orderStatus)}
                                {item?.orderStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="order-items">
                        {/* Items Header - Desktop Only */}
                        <div className="items-header d-none d-md-block">
                          <div className="row">
                            <div className="col-md-4">
                              <h6>Product Name</h6>
                            </div>
                            <div className="col-md-2">
                              <h6>Quantity</h6>
                            </div>
                            <div className="col-md-3">
                              <h6>Price</h6>
                            </div>
                            <div className="col-md-3">
                              <h6>Color</h6>
                            </div>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="items-list">
                          {item?.orderItems?.map((orderItem, idx) => {
                            return (
                              <div className="order-item" key={idx}>
                                <div className="row g-3 align-items-center">
                                  <div className="col-12 col-md-4">
                                    <div className="item-info">
                                      <span className="item-label d-md-none">
                                        Product:
                                      </span>
                                      <span className="item-name">
                                        {orderItem?.product?.title}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-4 col-md-2">
                                    <div className="item-info">
                                      <span className="item-label d-md-none">
                                        Qty:
                                      </span>
                                      <span className="item-value">
                                        x{orderItem?.quantity}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-4 col-md-3">
                                    <div className="item-info">
                                      <span className="item-label d-md-none">
                                        Price:
                                      </span>
                                      <span className="item-price">
                                        Rs. {orderItem?.price?.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-4 col-md-3">
                                    <div className="item-info">
                                      <span className="item-label d-md-none">
                                        Color:
                                      </span>
                                      <span
                                        className="color-badge"
                                        style={{
                                          backgroundColor:
                                            orderItem?.color?.title,
                                        }}
                                        title={orderItem?.color?.title}
                                      ></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-orders">
                  <FiPackage size={64} />
                  <h3>No Orders Yet</h3>
                  <p>You haven't placed any orders yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        /* ========== ORDERS WRAPPER ========== */
        .cart-wrapper {
          background: #f9f9f9;
        }

        /* ========== ORDERS HEADER ========== */
        .orders-header {
          background: #fff;
          padding: 20px 25px;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin-bottom: 0;
        }

        .orders-header h5 {
          font-size: 14px;
          font-weight: 700;
          color: #232f3e;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ========== ORDERS LIST ========== */
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ========== ORDER CARD ========== */
        .order-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .order-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }

        /* Order Summary */
        .order-summary {
          background: linear-gradient(135deg, #febd69 0%, #ffa94d 100%);
          padding: 20px 25px;
        }

        .order-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(35, 47, 62, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .order-id {
          font-size: 13px;
          font-weight: 600;
          color: #232f3e;
          word-break: break-all;
          font-family: monospace;
        }

        .info-value {
          font-size: 16px;
          font-weight: 700;
          color: #232f3e;
        }

        /* Order Status */
        .order-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-icon {
          font-size: 16px;
        }

        .status-processing {
          background: #fff3cd;
          color: #856404;
        }

        .status-shipped {
          background: #cfe2ff;
          color: #084298;
        }

        .status-delivered {
          background: #d1e7dd;
          color: #0f5132;
        }

        .status-cancelled {
          background: #f8d7da;
          color: #842029;
        }

        .status-default {
          background: #e2e3e5;
          color: #41464b;
        }

        /* ========== ORDER ITEMS ========== */
        .order-items {
          background: #232f3e;
        }

        .items-header {
          padding: 15px 25px;
          border-bottom: 2px solid rgba(255,255,255,0.1);
        }

        .items-header h6 {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .items-list {
          padding: 0;
        }

        .order-item {
          padding: 20px 25px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .item-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .item-name {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          line-height: 1.4;
        }

        .item-value {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .item-price {
          font-size: 15px;
          font-weight: 700;
          color: #febd69;
        }

        .color-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.3);
          display: inline-block;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .color-badge:hover {
          transform: scale(1.1);
          border-color: #fff;
        }

        /* ========== NO ORDERS ========== */
        .no-orders {
          background: #fff;
          padding: 80px 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .no-orders svg {
          color: #ccc;
          margin-bottom: 20px;
        }

        .no-orders h3 {
          font-size: 24px;
          font-weight: 700;
          color: #232f3e;
          margin-bottom: 10px;
        }

        .no-orders p {
          font-size: 16px;
          color: #777;
          margin: 0;
        }

        /* ========== TABLET (768px - 991px) ========== */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .orders-header {
            padding: 18px 20px;
          }

          .orders-header h5 {
            font-size: 13px;
          }

          .order-summary {
            padding: 18px 20px;
          }

          .items-header {
            padding: 12px 20px;
          }

          .order-item {
            padding: 18px 20px;
          }

          .info-value {
            font-size: 15px;
          }

          .item-price {
            font-size: 14px;
          }
        }

        /* ========== MOBILE (< 768px) ========== */
        @media (max-width: 767.98px) {
          .cart-wrapper {
            padding: 20px 0 !important;
          }

          .orders-list {
            gap: 15px;
          }

          .order-card {
            border-radius: 10px;
          }

          .order-card:hover {
            transform: none;
          }

          .order-summary {
            padding: 15px;
          }

          .order-info-item {
            gap: 3px;
          }

          .info-label {
            font-size: 11px;
          }

          .order-id {
            font-size: 11px;
            line-height: 1.4;
          }

          .info-value {
            font-size: 15px;
          }

          .order-status {
            padding: 6px 12px;
            font-size: 12px;
            width: fit-content;
          }

          .status-icon {
            font-size: 14px;
          }

          .order-items {
            padding: 0;
          }

          .order-item {
            padding: 15px;
          }

          .item-info {
            gap: 3px;
          }

          .item-label {
            font-size: 10px;
          }

          .item-name {
            font-size: 13px;
          }

          .item-value {
            font-size: 13px;
          }

          .item-price {
            font-size: 14px;
          }

          .color-badge {
            width: 28px;
            height: 28px;
            border-width: 2px;
          }

          .no-orders {
            padding: 60px 20px;
          }

          .no-orders svg {
            width: 48px;
            height: 48px;
          }

          .no-orders h3 {
            font-size: 20px;
          }

          .no-orders p {
            font-size: 14px;
          }
        }

        /* ========== SMALL MOBILE (< 576px) ========== */
        @media (max-width: 575.98px) {
          .cart-wrapper {
            padding: 15px 0 !important;
          }

          .order-card {
            border-radius: 8px;
          }

          .order-summary {
            padding: 12px;
          }

          .order-id {
            font-size: 10px;
          }

          .info-value {
            font-size: 14px;
          }

          .order-status {
            padding: 5px 10px;
            font-size: 11px;
            gap: 4px;
          }

          .status-icon {
            font-size: 12px;
          }

          .order-item {
            padding: 12px;
          }

          .item-name {
            font-size: 12px;
          }

          .item-value {
            font-size: 12px;
          }

          .item-price {
            font-size: 13px;
          }

          .color-badge {
            width: 24px;
            height: 24px;
          }

          .no-orders {
            padding: 40px 15px;
          }

          .no-orders svg {
            width: 40px;
            height: 40px;
          }

          .no-orders h3 {
            font-size: 18px;
          }

          .no-orders p {
            font-size: 13px;
          }
        }

        /* ========== EXTRA SMALL (< 400px) ========== */
        @media (max-width: 399.98px) {
          .order-summary {
            padding: 10px;
          }

          .order-id {
            font-size: 9px;
          }

          .info-value {
            font-size: 13px;
          }

          .order-status {
            padding: 4px 8px;
            font-size: 10px;
          }

          .order-item {
            padding: 10px;
          }

          .item-name {
            font-size: 11px;
          }

          .item-value {
            font-size: 11px;
          }

          .item-price {
            font-size: 12px;
          }

          .color-badge {
            width: 22px;
            height: 22px;
          }
        }

        /* ========== LARGE DESKTOP (>= 1200px) ========== */
        @media (min-width: 1200px) {
          .orders-header {
            padding: 25px 30px;
          }

          .orders-header h5 {
            font-size: 15px;
          }

          .order-summary {
            padding: 25px 30px;
          }

          .items-header {
            padding: 18px 30px;
          }

          .order-item {
            padding: 22px 30px;
          }

          .info-value {
            font-size: 17px;
          }

          .item-name {
            font-size: 15px;
          }

          .item-price {
            font-size: 16px;
          }

          .color-badge {
            width: 36px;
            height: 36px;
          }
        }

        /* ========== HOVER EFFECTS (Desktop Only) ========== */
        @media (hover: hover) {
          .order-item:hover {
            background: rgba(255,255,255,0.05);
          }
        }

        /* ========== PRINT STYLES ========== */
        @media print {
          .order-card {
            page-break-inside: avoid;
            box-shadow: none;
            border: 1px solid #ddd;
          }

          .order-summary {
            background: #febd69 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .order-items {
            background: #232f3e !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
};

export default Orders;
