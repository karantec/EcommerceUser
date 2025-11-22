import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { BiPhoneCall, BiInfoCircle } from "react-icons/bi";
import Container from "../components/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { createQuery } from "../features/contact/contactSlice";

let contactSchema = yup.object({
  name: yup.string().required("First Name is Required"),
  email: yup
    .string()
    .required("Email is Required")
    .email("Email Should be valid"),
  mobile: yup.number().required().positive().integer("Mobile No is Required"),
  comment: yup.string().required("Comments is Required"),
});

const Contact = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      comment: "",
    },
    validationSchema: contactSchema,
    onSubmit: (values) => {
      dispatch(createQuery(values));
    },
  });

  return (
    <>
      <Meta title={"Contact Us"} />
      <BreadCrumb title="Contact Us" />
      <Container class1="contact-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6986.771103663534!2d76.99275607711007!3d28.886888929272477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390da5e51463d4c9%3A0xe5a485e2ac7c3d4a!2sMandaura%2C%20Haryana%20131103!5e0!3m2!1sen!2sin!4v1669909087902!5m2!1sen!2sin"
              width="600"
              height="450"
              className="border-0 w-100"
              style={{
                minHeight: "250px",
                height: "clamp(250px, 40vw, 450px)",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
            ></iframe>
          </div>
          <div className="col-12 mt-5">
            <div className="contact-inner-wrapper d-flex flex-column flex-md-row justify-content-between gap-4 gap-md-5">
              <div
                className="contact-form-wrapper flex-grow-1"
                style={{ maxWidth: "100%" }}
              >
                <h3 className="contact-title mb-4">Contact</h3>
                <form
                  action=""
                  onSubmit={formik.handleSubmit}
                  className="d-flex flex-column gap-15"
                >
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      name="name"
                      onChange={formik.handleChange("name")}
                      onBlur={formik.handleBlur("name")}
                      value={formik.values.name}
                    />
                    <div className="error">
                      {formik.touched.name && formik.errors.name}
                    </div>
                  </div>
                  <div>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      onChange={formik.handleChange("email")}
                      onBlur={formik.handleBlur("email")}
                      value={formik.values.email}
                    />
                    <div className="error">
                      {formik.touched.email && formik.errors.email}
                    </div>
                  </div>
                  <div>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Mobile Number"
                      name="mobile"
                      onChange={formik.handleChange("mobile")}
                      onBlur={formik.handleBlur("mobile")}
                      value={formik.values.mobile}
                    />
                    <div className="error">
                      {formik.touched.mobile && formik.errors.mobile}
                    </div>
                  </div>
                  <div>
                    <textarea
                      className="w-100 form-control"
                      cols="30"
                      rows="4"
                      placeholder="Comments"
                      name="comment"
                      onChange={formik.handleChange("comment")}
                      onBlur={formik.handleBlur("comment")}
                      value={formik.values.comment}
                    ></textarea>
                    <div className="error">
                      {formik.touched.comment && formik.errors.comment}
                    </div>
                  </div>
                  <div>
                    <button className="button border-0 w-100 w-sm-auto">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              <div
                className="contact-info-wrapper flex-grow-1"
                style={{ maxWidth: "100%" }}
              >
                <h3 className="contact-title mb-4">Get in touch with us</h3>
                <div>
                  <ul className="ps-0 list-unstyled">
                    <li className="mb-3 d-flex gap-15 align-items-start">
                      <AiOutlineHome className="fs-5 flex-shrink-0 mt-1" />
                      <address
                        className="mb-0"
                        style={{ wordBreak: "break-word" }}
                      >
                        Hno : Daiict college, Reliance Cross Rd, Gandhinagar,
                        Gujarat, 382007
                      </address>
                    </li>
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <BiPhoneCall className="fs-5 flex-shrink-0" />
                      <a
                        href="tel:+91 8264954234"
                        style={{ wordBreak: "break-all" }}
                      >
                        +91 8264954234
                      </a>
                    </li>
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <AiOutlineMail className="fs-5 flex-shrink-0" />
                      <a
                        href="mailto:devjariwala8444@gmail.com"
                        style={{ wordBreak: "break-all" }}
                      >
                        devjariwala8444@gmail.com
                      </a>
                    </li>
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <BiInfoCircle className="fs-5 flex-shrink-0" />
                      <p className="mb-0">Monday – Friday 10 AM – 8 PM</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        .contact-inner-wrapper {
          padding: 20px;
          background: #fff;
          border-radius: 10px;
        }
        
        .contact-form-wrapper,
        .contact-info-wrapper {
          width: 100%;
        }
        
        @media (min-width: 768px) {
          .contact-form-wrapper,
          .contact-info-wrapper {
            width: 48%;
          }
        }
        
        @media (max-width: 576px) {
          .contact-inner-wrapper {
            padding: 15px;
          }
          
          .contact-title {
            font-size: 1.25rem;
          }
          
          .form-control {
            font-size: 14px;
            padding: 10px 12px;
          }
          
          .button {
            width: 100%;
            padding: 12px 20px;
          }
          
          .gap-15 {
            gap: 10px !important;
          }
        }
        
        @media (max-width: 400px) {
          .contact-inner-wrapper {
            padding: 12px;
          }
          
          address, 
          .contact-info-wrapper a,
          .contact-info-wrapper p {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
};

export default Contact;
