import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch, BsList, BsX } from "react-icons/bs";
import compare from "../images/compare.svg";
import wishlist from "../images/wishlist.svg";
import user from "../images/user.svg";
import cart from "../images/cart.svg";
import menu from "../images/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getAProduct } from "../features/products/productSlilce";
import { getUserCart } from "../features/user/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const [total, setTotal] = useState(null);
  const [paginate, setPaginate] = useState(true);
  const productState = useSelector((state) => state?.product?.product);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const [productOpt, setProductOpt] = useState([]);
  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      setTotal(sum);
    }
  }, [cartState]);

  useEffect(() => {
    let data = [];
    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      data.push({ id: index, prod: element?._id, name: element?.title });
    }
    setProductOpt(data);
  }, [productState]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Top Strip */}
      <header className="header-top-strip py-2 py-md-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12 col-sm-6">
              <p className="text-white mb-0 text-center text-sm-start small">
                Free Shipping Over Rs.100
              </p>
            </div>
            <div className="col-12 col-sm-6 d-none d-sm-block">
              <p className="text-end text-white mb-0 small">
                Hotline:{" "}
                <a className="text-white" href="tel:+91 8264954234">
                  +91 8264954234
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Upper Header */}
      <header className="header-upper py-2 py-md-3">
        <div className="container-xxl">
          <div className="row align-items-center g-2 g-md-3">
            {/* Logo */}
            <div className="col-6 col-md-2">
              <h2 className="mb-0 fs-5 fs-md-4">
                <Link className="text-white" to="/">
                  Cart Corner
                </Link>
              </h2>
            </div>

            {/* Mobile Icons */}
            <div className="col-6 d-flex d-md-none justify-content-end align-items-center gap-3">
              <Link to="/cart" className="text-white position-relative">
                <img src={cart} alt="cart" width="28" />
                <span
                  className="badge bg-white text-dark position-absolute top-0 start-100 translate-middle rounded-pill"
                  style={{ fontSize: "10px" }}
                >
                  {cartState?.length ? cartState?.length : 0}
                </span>
              </Link>
              <button
                className="btn btn-link text-white p-0"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <BsX size={28} /> : <BsList size={28} />}
              </button>
            </div>

            {/* Search Bar */}
            

            {/* Desktop Header Links */}
            <div className="col-md-5 d-none d-md-block order-md-3">
              <div className="header-upper-links d-flex align-items-center justify-content-end gap-3 gap-lg-4">
                <div>
                  <Link
                    to="/wishlist"
                    className="d-flex align-items-center gap-2 text-white"
                  >
                    <img src={wishlist} alt="wishlist" width="30" />
                    <p className="mb-0 d-none d-lg-block small">
                      Favourite <br /> wishlist
                    </p>
                  </Link>
                </div>
                <div>
                  <Link
                    to={authState?.user === null ? "/login" : "my-profile"}
                    className="d-flex align-items-center gap-2 text-white"
                  >
                    <img src={user} alt="user" width="30" />
                    {authState?.user === null ? (
                      <p className="mb-0 d-none d-lg-block small">
                        Log in <br /> My Account
                      </p>
                    ) : (
                      <p className="mb-0 d-none d-lg-block small">
                        Welcome {authState?.user?.firstname}
                      </p>
                    )}
                  </Link>
                </div>
                <div>
                  <Link
                    to="/cart"
                    className="d-flex align-items-center gap-2 text-white"
                  >
                    <img src={cart} alt="cart" width="30" />
                    <div className="d-flex flex-column">
                      <span className="badge bg-white text-dark small">
                        {cartState?.length ? cartState?.length : 0}
                      </span>
                      <p className="mb-0 small">
                        Rs. {!cartState?.length ? 0 : total ? total : 0}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Header / Navigation */}
      <header className="header-bottom py-2 py-md-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              {/* Desktop Menu */}
              <div className="menu-bottom d-none d-md-flex align-items-center gap-15 gap-lg-30">
                <div>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={menu} alt="" />
                      <span className="me-2 me-lg-5 d-inline-block small">
                        Shop Categories
                      </span>
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {productState &&
                        productState.map((item, index) => {
                          return (
                            <li key={index}>
                              <Link className="dropdown-item text-white" to="">
                                {item?.category}
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
                <div className="menu-links">
                  <div className="d-flex align-items-center gap-2 gap-lg-15">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/product">Our Store</NavLink>
                    <NavLink to="/my-orders">My Orders</NavLink>
                    <NavLink to="/blogs">Blogs</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                    {authState?.user !== null && (
                      <button
                        className="border border-0 bg-transparent text-white text-uppercase small"
                        type="button"
                        style={{ backgroundColor: "#232f3e" }}
                        onClick={handleLogout}
                      >
                        LogOut
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Menu */}
              <div
                className={`mobile-menu d-md-none ${
                  mobileMenuOpen ? "show" : ""
                }`}
                style={{
                  maxHeight: mobileMenuOpen ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease-in-out",
                }}
              >
                <div className="d-flex flex-column py-3">
                  {/* Mobile Navigation Links */}
                  <NavLink
                    to="/"
                    className="text-white py-2 border-bottom border-secondary"
                    onClick={toggleMobileMenu}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/product"
                    className="text-white py-2 border-bottom border-secondary"
                    onClick={toggleMobileMenu}
                  >
                    Our Store
                  </NavLink>
                  <NavLink
                    to="/my-orders"
                    className="text-white py-2 border-bottom border-secondary"
                    onClick={toggleMobileMenu}
                  >
                    My Orders
                  </NavLink>
                  <NavLink
                    to="/blogs"
                    className="text-white py-2 border-bottom border-secondary"
                    onClick={toggleMobileMenu}
                  >
                    Blogs
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className="text-white py-2 border-bottom border-secondary"
                    onClick={toggleMobileMenu}
                  >
                    Contact
                  </NavLink>
                  <NavLink
                    to="/wishlist"
                    className="text-white py-2 border-bottom border-secondary"
                    onClick={toggleMobileMenu}
                  >
                    Wishlist
                  </NavLink>
                  <NavLink
                    to={authState?.user === null ? "/login" : "my-profile"}
                    className="text-white py-2 border-bottom border-secondary"
                    onClick={toggleMobileMenu}
                  >
                    {authState?.user === null
                      ? "Login / My Account"
                      : `Welcome ${authState?.user?.firstname}`}
                  </NavLink>

                  {/* Shop Categories Accordion */}
                  <div className="py-2">
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle bg-transparent border-0 p-0 d-flex align-items-center gap-2 text-white"
                        type="button"
                        id="mobileDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img src={menu} alt="" width="20" />
                        <span>Shop Categories</span>
                      </button>
                      <ul
                        className="dropdown-menu w-100"
                        aria-labelledby="mobileDropdown"
                      >
                        {productState &&
                          productState.map((item, index) => (
                            <li key={index}>
                              <Link
                                className="dropdown-item"
                                to=""
                                onClick={toggleMobileMenu}
                              >
                                {item?.category}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  {authState?.user !== null && (
                    <button
                      className="btn btn-outline-light mt-2 text-uppercase"
                      type="button"
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                    >
                      LogOut
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
