import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/user/userSlice";

let signUpSchema = yup.object({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  email: yup
    .string()
    .required("Email is Required")
    .email("Email Should be valid"),
  mobile: yup.number().required().positive().integer("Mobile No is Required"),
  password: yup.string().required("Password is Required"),
});

const Signup = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      dispatch(registerUser(values));
    },
  });

  // useEffect(() => {
  //   if (authState.createdUser !== null && authState.isError === false) {
  //     navigate("/login");
  //   }
  // }, [authState]);

  return (
    <>
      <Meta title={"Sign Up"} />
      <BreadCrumb title="Sign Up" />
      <Container class1="signup-wrapper py-5 home-wrapper-2">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="auth-card">
              <h3 className="auth-title text-center mb-4">Create Account</h3>
              <form
                action=""
                className="d-flex flex-column gap-15"
                onSubmit={formik.handleSubmit}
              >
                {/* Name Fields Row */}
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <div className="form-group">
                      <CustomInput
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={formik.values.firstname}
                        onChange={formik.handleChange("firstname")}
                        onBlur={formik.handleBlur("firstname")}
                      />
                      <div className="error">
                        {formik.touched.firstname && formik.errors.firstname}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="form-group">
                      <CustomInput
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={formik.values.lastname}
                        onChange={formik.handleChange("lastname")}
                        onBlur={formik.handleBlur("lastname")}
                      />
                      <div className="error">
                        {formik.touched.lastname && formik.errors.lastname}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <CustomInput
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                  />
                  <div className="error">
                    {formik.touched.email && formik.errors.email}
                  </div>
                </div>

                {/* Mobile Field */}
                <div className="form-group">
                  <CustomInput
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formik.values.mobile}
                    onChange={formik.handleChange("mobile")}
                    onBlur={formik.handleBlur("mobile")}
                  />
                  <div className="error">
                    {formik.touched.mobile && formik.errors.mobile}
                  </div>
                </div>

                {/* Password Field */}
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

                {/* Submit Button */}
                <div className="action-buttons mt-2">
                  <button className="button border-0 w-100" type="submit">
                    Sign Up
                  </button>
                </div>

                {/* Login Link */}
                <div className="login-link text-center mt-2">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="signup-login-link">
                    Login here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        /* ========== SIGNUP WRAPPER ========== */
        .signup-wrapper {
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
          background: linear-gradient(135deg, #232f3e 0%, #3a4a5e 100%);
          color: #ffffff;
        }

        .button:hover {
          background: linear-gradient(135deg, #3a4a5e 0%, #232f3e 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(35, 47, 62, 0.3);
        }

        .button:active {
          transform: translateY(0);
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        /* ========== LOGIN LINK ========== */
        .login-link {
          font-size: 14px;
          margin-top: 8px;
        }

        .login-link .text-muted {
          color: #6c757d;
        }

        .signup-login-link {
          color: #232f3e;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .signup-login-link:hover {
          color: #febd69;
          text-decoration: underline;
        }

        /* ========== NAME FIELDS ROW ========== */
        .row.g-3 {
          margin-left: -12px;
          margin-right: -12px;
        }

        .row.g-3 > * {
          padding-left: 12px;
          padding-right: 12px;
        }

        @media (max-width: 575.98px) {
          .row.g-3 {
            margin-left: 0;
            margin-right: 0;
          }

          .row.g-3 > * {
            padding-left: 0;
            padding-right: 0;
          }
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

          .login-link {
            font-size: 15px;
          }
        }

        /* ========== DESKTOP (992px - 1199px) ========== */
        @media (min-width: 992px) and (max-width: 1199.98px) {
          .auth-card {
            padding: 38px;
          }

          .auth-title {
            font-size: 27px;
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

          .gap-15 {
            gap: 18px;
          }
        }

        /* ========== MOBILE (576px - 767px) ========== */
        @media (min-width: 576px) and (max-width: 767.98px) {
          .signup-wrapper {
            padding: 30px 0 !important;
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
            gap: 16px;
          }

          .button {
            padding: 12px 20px;
            font-size: 14px;
            min-height: 46px;
          }

          .login-link {
            font-size: 13px;
          }

          /* Stack name fields on smaller tablets */
          .row.g-3 .col-sm-6 {
            width: 100%;
          }
        }

        /* ========== SMALL MOBILE (< 576px) ========== */
        @media (max-width: 575.98px) {
          .signup-wrapper {
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

          .button {
            padding: 13px 20px;
            font-size: 14px;
            border-radius: 8px;
            min-height: 48px;
          }

          .login-link {
            font-size: 12px;
            margin-top: 6px !important;
          }

          /* Name fields stack vertically on mobile */
          .row.g-3 {
            margin-left: 0;
            margin-right: 0;
            gap: 12px;
          }

          .row.g-3 > * {
            padding-left: 0;
            padding-right: 0;
          }

          .row.g-3 .col-12 {
            margin-bottom: 0;
          }

          /* Adjust form field spacing */
          .form-group {
            margin-bottom: 0;
          }
        }

        /* ========== EXTRA SMALL MOBILE (< 400px) ========== */
        @media (max-width: 399.98px) {
          .signup-wrapper {
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

          .button {
            padding: 12px 18px;
            font-size: 13px;
            min-height: 46px;
          }

          .login-link {
            font-size: 11px;
          }

          .row.g-3 {
            gap: 10px;
          }
        }

        /* ========== ACCESSIBILITY ========== */
        .button:focus,
        .signup-login-link:focus {
          outline: 2px solid #232f3e;
          outline-offset: 2px;
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

        /* ========== INPUT FIELD SPACING ========== */
        .form-group + .form-group {
          margin-top: 0;
        }

        /* ========== RESPONSIVE ROW SPACING ========== */
        @media (min-width: 576px) {
          .row.g-3 {
            gap: 0;
            margin-left: -12px;
            margin-right: -12px;
          }
          
          .row.g-3 > * {
            padding-left: 12px;
            padding-right: 12px;
          }
        }

        @media (max-width: 575.98px) {
          .row.g-3 {
            gap: 12px;
          }
        }

        /* ========== CONTAINER OVERRIDE ========== */
        @media (max-width: 575.98px) {
          .signup-wrapper .container,
          .signup-wrapper .container-fluid {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }

        /* ========== ENSURE FULL WIDTH ON MOBILE ========== */
        @media (max-width: 575.98px) {
          .row {
            margin-left: 0;
            margin-right: 0;
          }
          
          .col-12 {
            padding-left: 0;
            padding-right: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Signup;
