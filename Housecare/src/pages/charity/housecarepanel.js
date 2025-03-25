import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CardBody, Form, Input, Row, Col, Button } from "reactstrap";
import Swal from "sweetalert2";
import { useForm } from "helpers/useForms";
import { handleLogin } from "../Authentication/handle-api";
import "./LoginPage.css"
const HousecareLoginPanel = () => {
  const [values, handleChange] = useForm({ email: "", password: "" });
  const [loginStatus, setLoginStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(e, values, (status) => {
      setLoginStatus(status);
      if (status === "success") {
        Swal.fire({
          icon: "success",
          title: "Login successful",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (status === "error") {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: "Please try again.",
        });
      }
    });
  };

  return (
    <CardBody className="pt-0">
      <div className="p-4">
        <h4 className=" font-size-24 mb-4 text-center">House Care Login</h4>
        <Form className="form-horizontal mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              name="email"
              className="custom-input"
              placeholder="Enter email"
              type="email"
              value={values.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="password"
              type="password"
              placeholder="Enter Password"
              value={values.password}
              onChange={handleChange}
              required
              className="custom-input"
            />
          </div>
          <Row className="mb-4">
            <Col xs="6">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label
                  className="form-check-label"
                  htmlFor="rememberMe"
                >
                  Remember me
                </label>
              </div>
            </Col>
            <Col xs="6" className="text-end">
              <Button
                className="btn-custom"
                type="submit"
              >
                Log In
              </Button>
            </Col>
          </Row>
          <Row className="form-group mb-0">
            <Col className="text-center">
              <Link to="/change-password" className="text-muted">
                <i className="mdi mdi-lock"></i> Forgot your password?
              </Link>
            </Col>
          </Row>
        </Form>
      </div>
    </CardBody>
  );
};

export default HousecareLoginPanel;
