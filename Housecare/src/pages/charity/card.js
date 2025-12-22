import React from "react";
import { Row, Col, Card, Badge } from "react-bootstrap";
import imgdark from "../../assets/images/1.JPG"

// BeneficiaryDetails Component
const BeneficiaryDetails = ({ beneficiary }) => {
  return (
    <address>
      <strong className="text-primary">{beneficiary.benificiary_name}</strong>
      <br />
      <span>{beneficiary.email_id}</span>
      <br />
      <span>{beneficiary.number}</span>
      <br />
      <span>Age: {beneficiary.age}</span>
      <br />
      <span>{beneficiary.category}</span>
      <br />
      <span>Physically challenged: {beneficiary.physically_challenged}</span>
      <br />
      <span>Health status: {beneficiary.health_status}</span>
      <br />
      <span>Marital status: {beneficiary.marital}</span>
      <br />
      <span>Family members: {beneficiary.family_members}</span>
    </address>
  );
};

// BeneficiaryCard Component
const BeneficiaryCard = ({ beneficiary }) => {
  return (
    <Card className="border-light shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <strong className="text-primary">{beneficiary.benificiary_name}</strong>
          <strong className="text-secondary">{beneficiary.charity_name}</strong>
          <Badge bg={beneficiary.account_status ? "success" : "danger"}>
            {beneficiary.account_status ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="d-flex justify-content-between">
          <span>{beneficiary.email_id}</span>
          <span>{beneficiary.number}</span>
          <span>{beneficiary.navision_linked_no}</span>
        </div>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <small className="text-muted">
          Beneficiary ID: {beneficiary.benificiary_id}
        </small>
        <small className="text-muted">
          Balance: <strong>SAR {beneficiary.Balance}</strong>
        </small>
      </Card.Footer>
    </Card>
  );
};

// Main Component
const BeneficiaryInfo = ({ beneficiary }) => {
  return (
    <Row className="p-4">
      <Col xs="12">
        {/* Invoice Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>
            <img src={imgdark} alt="logo" height="34" />
          </h3>
          <hr className="flex-grow-1 mx-3" />
        </div>

        {/* Beneficiary Information */}
        <Row>
          <Col xs="12" md="6">
            <BeneficiaryDetails beneficiary={beneficiary} />
          </Col>
          <Col xs="12" md="6">
            <BeneficiaryCard beneficiary={beneficiary} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default BeneficiaryInfo;
