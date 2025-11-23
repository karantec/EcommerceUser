import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlilce";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import view from "../images/view.svg";

const ProductCard = (props) => {
  const navigate = useNavigate();
  const { grid, data } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);
  const [wishlist, setWishlist] = useState(wishlistState || []);

  useEffect(() => {
    setWishlist(wishlistState || []);
  }, [wishlistState]);

  const isProductInWishlist = (productId) => {
    return wishlist?.some((item) => item._id === productId);
  };

  const addToWish = (e, productId) => {
    e.stopPropagation();
    if (isProductInWishlist(productId)) {
      dispatch(addToWishlist(productId));
      const updatedWishlist = wishlist.filter((item) => item._id !== productId);
      setWishlist(updatedWishlist);
    } else {
      dispatch(addToWishlist(productId));
      const product = data.find((item) => item._id === productId);
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <>
      {data?.map((item, index) => {
        const isWishlist = isProductInWishlist(item._id);
        // Get the main image - either from 'image' field or 'images' array
      const productImage =
  item?.images?.[0]?.url ||   // case: images array has objects
  item?.images?.[0] ||        // case: images array contains direct URLs
  item?.image ||              // <-- your API uses this
  "/images/placeholder.jpg";  // fallback

        
        return (
          <div key={index} className={`product-card-wrapper gr-${grid}`}>
            <div
              className="product-card"
              onClick={() => navigate("/product/" + item?._id)}
            >
              {/* Wishlist Button */}
              <button
                className="wishlist-btn"
                onClick={(e) => addToWish(e, item?._id)}
                aria-label={
                  isWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isWishlist ? (
                  <AiFillHeart className="heart-icon filled" />
                ) : (
                  <AiOutlineHeart className="heart-icon" />
                )}
              </button>

              {/* Stock Badge */}
              {item?.countInStock !== undefined && (
                <div className={`stock-badge ${item.countInStock === 0 ? 'out-of-stock' : ''}`}>
                  {item.countInStock === 0 ? 'Out of Stock' : `${item.countInStock} in stock`}
                </div>
              )}

              {/* Product Image */}
              <div className="product-image">
  <img
    src={productImage}
    alt={item?.name || "Product"}
    loading="lazy"
  />
</div>

              {/* Product Details */}
              <div className="product-details">
                <span className="brand">{item?.brand || 'No Brand'}</span>
                <h5 className="product-title">{item?.name}</h5>
                <div className="rating-wrap">
                  <ReactStars
                    count={5}
                    size={18}
                    value={parseFloat(item?.totalrating || item?.rating) || 0}
                    edit={false}
                    activeColor="#ffd700"
                  />
                </div>
                <p className="price">₹{item?.price?.toLocaleString()}</p>
              </div>

              {/* Quick View - Desktop Only */}
              <div className="action-bar">
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/product/" + item?._id);
                  }}
                  aria-label="Quick view"
                >
                  <img src={view} alt="View" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        /* ========== BASE STYLES ========== */
        .product-card-wrapper {
          padding: 8px;
          box-sizing: border-box;
          display: flex;
        }
        
        /* ========== GRID SYSTEM - DESKTOP ========== */
        .gr-3 { 
          width: 25%; 
          flex: 0 0 25%;
          max-width: 25%;
        }
        /* ========== STOCK BADGE ========== */
.stock-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  background: rgba(34, 197, 94, 0.9);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.stock-badge.out-of-stock {
  background: rgba(239, 68, 68, 0.9);
}
        .gr-4 { 
          width: 33.333%; 
          flex: 0 0 33.333%;
          max-width: 33.333%;
        }
        
        .gr-6 { 
          width: 50%; 
          flex: 0 0 50%;
          max-width: 50%;
        }
        
        .gr-12 { 
          width: 100%; 
          flex: 0 0 100%;
          max-width: 100%;
        }

        /* ========== TABLET LANDSCAPE (992px - 1199px) ========== */
        @media (min-width: 992px) and (max-width: 1199.98px) {
          .gr-3 { 
            width: 33.333%; 
            flex: 0 0 33.333%;
            max-width: 33.333%;
          }
          
          .gr-4 { 
            width: 33.333%; 
            flex: 0 0 33.333%;
            max-width: 33.333%;
          }
        }

        /* ========== TABLET PORTRAIT (768px - 991px) ========== */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .gr-3 { 
            width: 33.333%; 
            flex: 0 0 33.333%;
            max-width: 33.333%;
          }
          
          .gr-4 { 
            width: 33.333%; 
            flex: 0 0 33.333%;
            max-width: 33.333%;
          }
          
          .gr-6 { 
            width: 50%; 
            flex: 0 0 50%;
            max-width: 50%;
          }
        }

        /* ========== MOBILE - CRITICAL FIX: ALWAYS 2 CARDS ========== */
        @media (max-width: 767.98px) {
          .gr-3, .gr-4, .gr-6 { 
            width: 50% !important; 
            flex: 0 0 50% !important;
            max-width: 50% !important;
          }
          
          .gr-12 { 
            width: 100% !important; 
            flex: 0 0 100% !important;
            max-width: 100% !important;
          }
          
          .product-card-wrapper {
            padding: 6px;
          }
        }

        /* ========== SMALL MOBILE (< 576px) ========== */
        @media (max-width: 575.98px) {
          .gr-3, .gr-4, .gr-6 { 
            width: 50% !important; 
            flex: 0 0 50% !important;
            max-width: 50% !important;
          }
          
          .product-card-wrapper {
            padding: 5px;
          }
        }

        /* ========== EXTRA SMALL MOBILE (< 400px) ========== */
        @media (max-width: 399.98px) {
          .gr-3, .gr-4, .gr-6 { 
            width: 50% !important; 
            flex: 0 0 50% !important;
            max-width: 50% !important;
          }
          
          .product-card-wrapper {
            padding: 4px;
          }
        }

        /* ========== PRODUCT CARD ========== */
        .product-card {
          position: relative;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (hover: hover) {
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
          }
        }
        
        @media (hover: none) {
          .product-card:active {
            transform: scale(0.98);
          }
        }

        /* ========== STOCK BADGE ========== */
        .stock-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 10px;
          background: rgba(34, 197, 94, 0.9);
          color: white;
          font-size: 11px;
          font-weight: 600;
          border-radius: 6px;
          z-index: 10;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        
        .stock-badge.out-of-stock {
          background: rgba(239, 68, 68, 0.9);
        }

        /* ========== WISHLIST BUTTON ========== */
        .wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 10;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .wishlist-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .wishlist-btn:active {
          transform: scale(1.05);
        }
        
        .heart-icon {
          font-size: 19px;
          color: #666;
          transition: color 0.2s;
        }
        
        .heart-icon.filled {
          color: #e74c3c;
          animation: heartBeat 0.3s ease;
        }
        
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        .wishlist-btn:hover .heart-icon:not(.filled) {
          color: #e74c3c;
        }

        /* ========== PRODUCT IMAGE ========== */
        .product-image {
          position: relative;
          aspect-ratio: 1;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 16px;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (hover: hover) {
          .product-card:hover .product-image img {
            transform: scale(1.1);
          }
        }

        /* ========== PRODUCT DETAILS ========== */
        .product-details {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .product-details .brand {
          display: block;
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 600;
          line-height: 1;
        }
        
        .product-details .product-title {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-grow: 1;
          min-height: 2.8em;
        }
        
        .rating-wrap {
          display: flex;
          align-items: center;
          min-height: 20px;
        }
        
        .product-details .price {
          font-size: 19px;
          font-weight: 700;
          color: #232f3e;
          margin: 0;
          line-height: 1;
        }

        /* ========== ACTION BAR (QUICK VIEW) ========== */
        .action-bar {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 5;
        }
        
        @media (hover: hover) {
          .product-card:hover .action-bar {
            opacity: 1;
            pointer-events: auto;
          }
        }
        
        .action-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .action-btn:hover {
          background: #232f3e;
          transform: scale(1.1);
        }
        
        .action-btn:active {
          transform: scale(1.05);
        }
        
        .action-btn:hover img {
          filter: brightness(0) invert(1);
        }
        
        .action-btn img {
          width: 20px;
          height: 20px;
          transition: filter 0.2s;
        }

        /* ========== DESKTOP RESPONSIVE (992px+) ========== */
        @media (min-width: 992px) {
          .product-card {
            border-radius: 12px;
          }
          
          .product-details {
            padding: 18px;
          }
          
          .product-details .product-title {
            font-size: 15px;
          }
          
          .product-details .price {
            font-size: 20px;
          }
        }

        /* ========== TABLET RESPONSIVE (768px - 991px) ========== */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .product-card {
            border-radius: 10px;
          }
          
          .wishlist-btn {
            width: 36px;
            height: 36px;
          }
          
          .heart-icon {
            font-size: 17px;
          }
          
          .product-image img {
            padding: 14px;
          }
          
          .product-details {
            padding: 14px;
          }
          
          .product-details .product-title {
            font-size: 13px;
          }
          
          .product-details .price {
            font-size: 17px;
          }
          
          .stock-badge {
            font-size: 10px;
            padding: 3px 8px;
          }
        }

        /* ========== MOBILE RESPONSIVE (< 768px) ========== */
        @media (max-width: 767.98px) {
          .product-card {
            border-radius: 10px;
          }
          
          .product-card:hover {
            transform: none;
          }
          
          .stock-badge {
            font-size: 9px;
            padding: 3px 7px;
            top: 8px;
            left: 8px;
          }
          
          .wishlist-btn {
            width: 34px;
            height: 34px;
            top: 10px;
            right: 10px;
          }
          
          .heart-icon {
            font-size: 16px;
          }
          
          .product-image img {
            padding: 12px;
          }
          
          .product-details {
            padding: 12px;
            gap: 4px;
          }
          
          .product-details .brand {
            font-size: 10px;
            letter-spacing: 0.5px;
          }
          
          .product-details .product-title {
            font-size: 13px;
            line-height: 1.35;
            min-height: 2.7em;
          }
          
          .rating-wrap {
            min-height: 18px;
          }
          
          .rating-wrap span {
            font-size: 15px !important;
          }
          
          .product-details .price {
            font-size: 16px;
          }
          
          .action-bar {
            display: none;
          }
        }

        /* ========== SMALL MOBILE (< 576px) ========== */
        @media (max-width: 575.98px) {
          .product-card {
            border-radius: 8px;
          }
          
          .stock-badge {
            font-size: 8px;
            padding: 2px 6px;
          }
          
          .wishlist-btn {
            width: 32px;
            height: 32px;
            top: 8px;
            right: 8px;
          }
          
          .heart-icon {
            font-size: 15px;
          }
          
          .product-image img {
            padding: 10px;
          }
          
          .product-details {
            padding: 10px;
          }
          
          .product-details .brand {
            font-size: 9px;
          }
          
          .product-details .product-title {
            font-size: 12px;
            min-height: 2.6em;
          }
          
          .rating-wrap span {
            font-size: 14px !important;
          }
          
          .product-details .price {
            font-size: 15px;
          }
        }

        /* ========== EXTRA SMALL MOBILE (< 400px) ========== */
        @media (max-width: 399.98px) {
          .stock-badge {
            font-size: 7px;
            padding: 2px 5px;
            top: 6px;
            left: 6px;
          }
          
          .wishlist-btn {
            width: 30px;
            height: 30px;
            top: 6px;
            right: 6px;
          }
          
          .heart-icon {
            font-size: 14px;
          }
          
          .product-image img {
            padding: 8px;
          }
          
          .product-details {
            padding: 8px;
          }
          
          .product-details .brand {
            font-size: 8px;
          }
          
          .product-details .product-title {
            font-size: 11px;
            -webkit-line-clamp: 2;
            min-height: 2.4em;
          }
          
          .rating-wrap span {
            font-size: 12px !important;
          }
          
          .product-details .price {
            font-size: 14px;
          }
        }

        /* ========== LIST VIEW (gr-12) ========== */
        .gr-12 .product-card {
          flex-direction: row;
          max-height: 220px;
        }
        
        .gr-12 .product-image {
          width: 220px;
          min-width: 220px;
          aspect-ratio: auto;
          height: 100%;
        }
        
        .gr-12 .product-image img {
          padding: 20px;
        }
        
        .gr-12 .product-details {
          padding: 24px;
          justify-content: center;
        }
        
        .gr-12 .product-details .brand {
          font-size: 12px;
        }
        
        .gr-12 .product-details .product-title {
          -webkit-line-clamp: 3;
          font-size: 17px;
          min-height: auto;
        }
        
        .gr-12 .product-details .price {
          font-size: 22px;
        }
        
        .gr-12 .wishlist-btn {
          top: 16px;
          right: 16px;
        }
        
        .gr-12 .stock-badge {
          top: 16px;
          left: 16px;
        }

        @media (min-width: 768px) and (max-width: 991.98px) {
          .gr-12 .product-card {
            max-height: 180px;
          }
          
          .gr-12 .product-image {
            width: 180px;
            min-width: 180px;
          }
          
          .gr-12 .product-details {
            padding: 18px;
          }
          
          .gr-12 .product-details .product-title {
            font-size: 15px;
          }
          
          .gr-12 .product-details .price {
            font-size: 19px;
          }
        }

        @media (max-width: 767.98px) {
          .gr-12 .product-card {
            flex-direction: row;
            max-height: 150px;
          }
          
          .gr-12 .product-image {
            width: 130px;
            min-width: 130px;
          }
          
          .gr-12 .product-image img {
            padding: 12px;
          }
          
          .gr-12 .product-details {
            padding: 12px 14px;
          }
          
          .gr-12 .product-details .product-title {
            font-size: 13px;
            -webkit-line-clamp: 2;
          }
          
          .gr-12 .product-details .price {
            font-size: 16px;
          }
          
          .gr-12 .wishlist-btn {
            top: 10px;
            right: 10px;
          }
          
          .gr-12 .stock-badge {
            top: 10px;
            left: 10px;
          }
        }

        @media (max-width: 575.98px) {
          .gr-12 .product-card {
            max-height: 130px;
          }
          
          .gr-12 .product-image {
            width: 110px;
            min-width: 110px;
          }
          
          .gr-12 .product-image img {
            padding: 10px;
          }
          
          .gr-12 .product-details {
            padding: 10px 12px;
          }
          
          .gr-12 .product-details .brand {
            font-size: 9px;
          }
          
          .gr-12 .product-details .product-title {
            font-size: 12px;
          }
          
          .gr-12 .product-details .price {
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
};

export default ProductCard;