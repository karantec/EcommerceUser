import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";

let loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Email Should be valid"),

  password: yup.string().required("Password is Required"),
});

const Login = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  useEffect(() => {
    if (authState.user !== null && authState.isError === false) {
      window.location.href = "/";
    }
  }, [authState]);

  return (
    <>
      <Meta title={"Login"} />
      <BreadCrumb title="Login" />

      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="auth-card">
              <h3 className="auth-title text-center mb-4">Login</h3>
              <form
                action=""
                onSubmit={formik.handleSubmit}
                className="d-flex flex-column gap-15"
              >
                <div className="form-group">
                  <CustomInput
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                  />
                  <div className="error">
                    {formik.touched.email && formik.errors.email}
                  </div>
                </div>

                <div className="form-group">
                  <CustomInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                  />
                  <div className="error">
                    {formik.touched.password && formik.errors.password}
                  </div>
                </div>

                <div className="forgot-password-link">
                  <Link to="/forgot-password" className="text-end d-block">
                    Forgot Password?
                  </Link>
                </div>

                <div className="action-buttons d-flex flex-column flex-sm-row justify-content-center gap-3 align-items-stretch align-items-sm-center mt-2">
                  <button className="button border-0 flex-grow-1" type="submit">
                    Login
                  </button>
                  <Link to="/signup" className="button signup flex-grow-1">
                    Sign Up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        /* ========== LOGIN WRAPPER ========== */
        .login-wrapper {
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
          padding: 40px 15px !important;
        }

        /* ========== AUTH CARD ========== */
        .auth-card {
          background: #ffffff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          width: 100%;
          max-width: 100%;
        }

        .auth-card:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        /* ========== AUTH TITLE ========== */
        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          position: relative;
          padding-bottom: 15px;
        }

        .auth-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #232f3e 0%, #febd69 100%);
          border-radius: 2px;
        }

        /* ========== FORM GROUP ========== */
        .form-group {
          margin-bottom: 0;
        }

        .gap-15 {
          gap: 20px;
        }

        /* ========== ERROR MESSAGE ========== */
        .error {
          color: #dc3545;
          font-size: 13px;
          margin-top: 6px;
          font-weight: 500;
          min-height: 18px;
          display: block;
        }

        /* ========== FORGOT PASSWORD LINK ========== */
        .forgot-password-link {
          margin-top: -5px;
        }

        .forgot-password-link a {
          color: #232f3e;
          font-size: 14px;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .forgot-password-link a:hover {
          color: #febd69;
          text-decoration: underline;
        }

        /* ========== ACTION BUTTONS ========== */
        .action-buttons {
          margin-top: 10px;
        }

        .button {
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
        }

        .button:not(.signup) {
          background: linear-gradient(135deg, #232f3e 0%, #3a4a5e 100%);
          color: #ffffff;
        }

        .button:not(.signup):hover {
          background: linear-gradient(135deg, #3a4a5e 0%, #232f3e 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(35, 47, 62, 0.3);
        }

        .button:not(.signup):active {
          transform: translateY(0);
        }

        .button.signup {
          background: #ffffff;
          color: #232f3e;
          border: 2px solid #232f3e;
        }

        .button.signup:hover {
          background: #232f3e;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(35, 47, 62, 0.2);
        }

        .button.signup:active {
          transform: translateY(0);
        }

        /* ========== LARGE DESKTOP (>= 1200px) ========== */
        @media (min-width: 1200px) {
          .auth-card {
            padding: 45px;
          }

          .auth-title {
            font-size: 30px;
          }

          .button {
            padding: 15px 32px;
            font-size: 16px;
            min-height: 52px;
          }

          .gap-15 {
            gap: 22px;
          }
        }

        /* ========== TABLET (768px - 991px) ========== */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .auth-card {
            padding: 35px;
          }

          .auth-title {
            font-size: 26px;
          }

          .button {
            padding: 13px 24px;
            font-size: 14px;
            min-height: 48px;
          }
        }

        /* ========== MOBILE (576px - 767px) ========== */
        @media (min-width: 576px) and (max-width: 767.98px) {
          .login-wrapper {
            padding: 30px 15px !important;
          }

          .auth-card {
            padding: 30px;
            border-radius: 14px;
          }

          .auth-title {
            font-size: 24px;
            margin-bottom: 25px !important;
          }

          .gap-15 {
            gap: 18px;
          }

          .button {
            padding: 12px 20px;
            font-size: 14px;
            min-height: 46px;
          }

          .forgot-password-link a {
            font-size: 13px;
          }
        }

        /* ========== SMALL MOBILE (< 576px) ========== */
        @media (max-width: 575.98px) {
          .login-wrapper {
            padding: 15px !important;
            min-height: auto;
          }

          .auth-card {
            padding: 20px 15px;
            border-radius: 12px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
          }

          .auth-title {
            font-size: 20px;
            margin-bottom: 20px !important;
            padding-bottom: 10px;
          }

          .auth-title::after {
            width: 50px;
            height: 2.5px;
          }

          .gap-15 {
            gap: 12px;
          }

          .error {
            font-size: 11px;
            margin-top: 4px;
            min-height: 14px;
          }

          .forgot-password-link {
            margin-top: -3px;
          }

          .forgot-password-link a {
            font-size: 12px;
          }

          .action-buttons {
            gap: 12px !important;
            margin-top: 8px !important;
          }

          .button {
            padding: 13px 20px;
            font-size: 14px;
            border-radius: 8px;
            min-height: 48px;
          }

          .button.signup {
            border-width: 2px;
          }
        }

        /* ========== EXTRA SMALL MOBILE (< 400px) ========== */
        @media (max-width: 399.98px) {
          .login-wrapper {
            padding: 10px !important;
          }

          .auth-card {
            padding: 18px 12px;
            border-radius: 10px;
          }

          .auth-title {
            font-size: 18px;
            margin-bottom: 16px !important;
            padding-bottom: 8px;
          }

          .auth-title::after {
            width: 40px;
            height: 2px;
          }

          .gap-15 {
            gap: 10px;
          }

          .error {
            font-size: 10px;
            min-height: 12px;
            margin-top: 3px;
          }

          .forgot-password-link a {
            font-size: 11px;
          }

          .action-buttons {
            gap: 10px !important;
          }

          .button {
            padding: 12px 18px;
            font-size: 13px;
            min-height: 46px;
          }
        }

        /* ========== CONTAINER OVERRIDE ========== */
        @media (max-width: 575.98px) {
          .login-wrapper .container,
          .login-wrapper .container-fluid {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .row {
            margin-left: 0;
            margin-right: 0;
          }

          .col-12 {
            padding-left: 0;
            padding-right: 0;
          }
        }

        /* ========== ACCESSIBILITY ========== */
        .button:focus,
        .forgot-password-link a:focus {
          outline: 2px solid #232f3e;
          outline-offset: 2px;
        }

        /* ========== LOADING STATE ========== */
        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        /* ========== FORM ANIMATION ========== */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-card {
          animation: slideUp 0.4s ease;
        }
      `}</style>
    </>
  );
};

export default Login;
