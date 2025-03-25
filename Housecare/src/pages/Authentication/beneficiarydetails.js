import React, { useEffect, useState } from "react";
import { Col, Row, Card, CardBody, Button } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import imgdark from "../../assets/images/1.JPG";
import { BASE_URL } from "./handle-api";
import axios from "axios";

const BenificiaryDetails = (props) => {
  document.title = "Benificiary Details | Housecare";

  const [beneficiarys, setBeneficiarys] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      try {
        const response = await axios.get(`${BASE_URL}/benificiary/${id}`);
        setBeneficiarys(response.data);
      } catch (error) {
        console.error("Error fetching beneficiary details:", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/benificiary/${id}/transactions`);
        const { creditedDetails, debitedDetails } = response.data;
    
        // Combine credited and debited details
        const allTransactions = [
          ...creditedDetails.map((split) => ({
            date: split.date,
            amount: split.splitamount,
            type: "credit",
            status: split.status,
            beneficiaryId: split.beneficiary,
          })),
          ...debitedDetails.map((debit) => ({
            date: debit.debitedDate,
            amount: debit.debitedAmount,
            type: "debit",
            status: "Debited",
            beneficiaryId: debit.beneficiary,
          })),
        ];
    
        // Sort transactions by date in descending order
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
        // Calculate running total balance
        let runningTotal = 0;
        const totalBalanceDetails = allTransactions.map((transaction) => {
          runningTotal += transaction.type === "credit" ? transaction.amount : -transaction.amount;
          return { ...transaction, runningTotal };
        });
    
        setTransactions(totalBalanceDetails);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };
    

    fetchData();
    fetchTransactions();
  }, [id]);

  const printInvoice = () => {
    window.print();
  };

  return (
    <React.Fragment>
      <Row>
        <Col xs="12">
          <Card>
            <CardBody>
              {/* <Row>
                <Col xs="12">
                  <div className="invoice-title">
                    <h3>
                      <img src={imgdark} alt="logo" height="34" />
                    </h3>
                  </div>
                  <hr />
                  <Row>
                    <Col xs="6">
                      <address>
                        <strong>{beneficiarys.benificiary_name}</strong>
                        <br />
                        {beneficiarys.email_id}
                        <br />
                        {beneficiarys.number}
                      </address>
                    </Col>
                    <Col xs="6" className="text-end">
                      <address>
                        <strong>{beneficiarys.charity_name}</strong>
                        <br />
                        Navision No. {beneficiarys.navision_linked_no}
                        <br />
                        {beneficiarys.benificiary_id}
                        <br />
                        {beneficiarys.nationality}
                      </address>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6" className="mt-4">
                      <address>
                        <strong>Personal info</strong>
                        <br />
                        Age: {beneficiarys.age}
                        <br />
                        {beneficiarys.category}
                        <br />
                        Physically challenged: {beneficiarys.physically_challenged}
                        <br />
                        Health status: {beneficiarys.health_status}
                        <br />
                        Marital status: {beneficiarys.marital}
                        <br />
                        Family members: {beneficiarys.family_members}
                      </address>
                    </Col>
                    <Col xs="6" className="mt-4 text-end">
                      <address>
                        <strong>Balance</strong>
                        <br />
                        {beneficiarys.Balance}
                        <br />
                        {beneficiarys.account_status ? (
                          <span style={{ color: "green" }}>Active</span>
                        ) : (
                          <span style={{ color: "red" }}>Inactive</span>
                        )}{" "}
                        <br />
                      </address>
                    </Col>
                  </Row>
                </Col>
              </Row> */}
              <Row className="p-4">
                <Col xs="12">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>
                      <img src={imgdark} alt="logo" height="34" />
                    </h3>
                    <hr className="flex-grow-1 mx-3" />
                  </div>

                  <Row>
                    <Col xs="6">
                      <address>
                        <strong className="text-primary" style={{ fontSize: "large" }}>
                          {beneficiarys.benificiary_name}
                        </strong>
                        <br />
                        <span>Age: {beneficiarys.age}</span>
                        <br />
                        <span>{beneficiarys.category}</span>
                        <br />
                        <span>
                          Physically challenged:{" "}
                          {beneficiarys.physically_challenged}
                        </span>
                        <br />
                        <span>Health status: {beneficiarys.health_status}</span>
                        <br />
                        <span>Marital status: {beneficiarys.marital}</span>
                        <br />
                        <span>
                          Family members: {beneficiarys.family_members}
                        </span>
                      </address>
                    </Col>
                    <Col xs="12" md="6">
  <div className="card border-light shadow-sm">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <strong className="text-primary">
          {beneficiarys.charity_name}
        </strong>
        {/* <strong className="text-secondary">
          {beneficiarys.charity_name}
        </strong> */}
        <div className="badge-container">
          {beneficiarys.account_status ? (
            <span className="badge bg-success">Active</span>
          ) : (
            <span className="badge bg-danger">Inactive</span>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <span>{beneficiarys.email_id}</span>
        <span>{beneficiarys.number}</span>
        <span>{beneficiarys.navision_linked_no}</span>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center" style={{fontSize: "medium"}}>
        <small className="text-muted">
          Beneficiary ID: {beneficiarys.benificiary_id}
        </small>
        <small className="text-muted">
          Balance: <strong>SAR {beneficiarys.Balance}</strong>
        </small>
      </div>
    </div>
  </div>
</Col>

                  </Row>

                </Col>
              </Row>

              <Row>
                <Col xs="12">
                  <div>
                    <div className="p-2">
                      <h3 className="font-size-16">
                        <strong>Transactions</strong>
                        <div className="float-end">
                          <Link to="#" className="btn btn-dark waves-effect waves-light">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-funnel-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                            </svg>
                            Filter
                          </Link>
                        </div>
                      </h3>

                      <hr />
                    </div>

                    <div className="">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <td>
                                <strong>Date & Time</strong>
                              </td>
                              <td className="text-center">
                                <strong>Beneficiary Id</strong>
                              </td>
                              <td className="text-center">
                                <strong>Transaction</strong>
                              </td>
                              <td className="text-end">
                                <strong>Status</strong>
                              </td>
                              <td className="text-end">
                                <strong>Balance</strong>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((transaction) => {
                              const formattedDate = new Date(transaction.date).toLocaleDateString("en-CA");

                              return (
                                <tr key={transaction._id}>
                                  <td>{formattedDate}</td>
                                  {/* <td className="text-center">{transaction.beneficiaryId}</td> */}
                                  <td className="text-center">{beneficiarys.benificiary_id}</td>
                                  <td className="text-center">
                                    {transaction.type === "credit"
                                      ? `+${transaction.amount}`
                                      : `-${transaction.amount}`}
                                  </td>
                                  <td className="text-end">{transaction.status}</td>
                                  <td className="text-end">{transaction.runningTotal}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="d-print-none">
                        <div className="float-end">
                          
                          <Button style={{backgroundColor:"transparent",marginRight:"10px",color:"black"}}>Total Amount : {beneficiarys.Balance}</Button>
                          <Link
                            to="#"
                            onClick={printInvoice}
                            className="btn btn-success waves-effect waves-light me-2"
                          >
                            <i className="fa fa-print"></i>
                          </Link>{" "}
                          <Link to="#" className="btn btn-primary waves-effect waves-light">
                            Send
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(BenificiaryDetails);
