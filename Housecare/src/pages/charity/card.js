import React from "react";
import { Row, Col, Card, Badge } from "react-bootstrap";
import imgdark from "../../assets/images/1.JPG"

// benificiaryDetails Component
const benificiaryDetails = ({ benificiary }) => {
  return (
    <address>
      <strong className="text-primary">{benificiary.benificiary_name}</strong>
      <br />
      <span>{benificiary.email_id}</span>
      <br />
      <span>{benificiary.number}</span>
      <br />
      <span>Age: {benificiary.age}</span>
      <br />
      <span>{benificiary.category}</span>
      <br />
      <span>Physically challenged: {benificiary.physically_challenged}</span>
      <br />
      <span>Health status: {benificiary.health_status}</span>
      <br />
      <span>Marital status: {benificiary.marital}</span>
      <br />
      <span>Family members: {benificiary.family_members}</span>
    </address>
  );
};

// benificiaryCard Component
const benificiaryCard = ({ benificiary }) => {
  return (
    <Card className="border-light shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <strong className="text-primary">{benificiary.benificiary_name}</strong>
          <strong className="text-secondary">{benificiary.charity_name}</strong>
          <Badge bg={benificiary.account_status ? "success" : "danger"}>
            {benificiary.account_status ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="d-flex justify-content-between">
          <span>{benificiary.email_id}</span>
          <span>{benificiary.number}</span>
          <span>{benificiary.navision_linked_no}</span>
        </div>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <small className="text-muted">
          benificiary ID: {benificiary.benificiary_id}
        </small>
        <small className="text-muted">
          Balance: <strong>SAR {benificiary.Balance}</strong>
        </small>
      </Card.Footer>
    </Card>
  );
};

// Main Component
const benificiaryInfo = ({ benificiary }) => {
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

        {/* benificiary Information */}
        <Row>
          <Col xs="12" md="6">
            <benificiaryDetails benificiary={benificiary} />
          </Col>
          <Col xs="12" md="6">
            <benificiaryCard benificiary={benificiary} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default benificiaryInfo;
