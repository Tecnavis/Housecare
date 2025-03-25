import React, { useState } from "react";
import { Button, Input, Label, Form, Container, Row, Col } from "reactstrap";
import axios from "axios";
import { BASE_URL } from "./handle-api";

// Define inline styles
const styles = {
  container: {
    maxWidth: '500px',
    marginTop: '50px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  formControl: {
    marginBottom: '15px',
  },
  button: {
    width: '100%',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  responsiveContainer: {
    '@media (max-width: 576px)': {
      marginTop: '20px',
      padding: '15px',
    }
  }
};

const PasswordReset = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/admin/request-otp`, { email });
      alert("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      console.error("Failed to request OTP:", err);
      alert("Failed to request OTP. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      console.log('Request Payload:', { email, otp, newPassword });
      const response = await axios.post(`${BASE_URL}/admin/reset-password`, { email, otp, newPassword });
      console.log('Response:', response.data);
      alert("Password reset successful.");
      setStep(1);
    } catch (err) {
      console.error("Failed to reset password:", err.response ? err.response.data : err.message);
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <Container style={{ ...styles.container, ...styles.responsiveContainer }}>
      <Row className="justify-content-center">
        <Col xs="12" sm="10" md="8" lg="6">
          {step === 1 && (
            <Form onSubmit={handleRequestOtp}>
              <Label for="email" style={styles.label}>Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.formControl}
              />
              <Button type="submit" color="primary" style={styles.button}>
                Request OTP
              </Button>
            </Form>
          )}

          {step === 2 && (
            <Form onSubmit={handleResetPassword}>
              <Label for="otp" style={styles.label}>Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                style={styles.formControl}
              />
              <Label for="newPassword" style={styles.label}>New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.formControl}
              />
              <Label for="confirmPassword" style={styles.label}>Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.formControl}
              />
              <Button type="submit" color="primary" style={styles.button}>
                Reset Password
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordReset;
