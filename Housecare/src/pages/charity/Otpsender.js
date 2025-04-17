import React, { useState } from 'react'
import { Button, Col, Container, Input, Label, Row } from 'reactstrap';

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
};

export default function Otpsender() {
  const [otp, setOtp] = useState("");

  return (
    <Container style={styles.container}>
      <Row className="justify-content-center">
        <Col xs="12" sm="10" md="8" lg="6">
          <Label for="otp" style={styles.label}>Enter OTP</Label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={styles.formControl}
          />
          <Button type="submit" color="primary" style={styles.button}>
            Submit
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
