import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { BASE_URL } from "../../Authentication/handle-api";
import { fetchBenificiarys } from "../../Authentication/handle-api";

const MonthlyEarnings = () => {
  const [benificiarys, setBenificiarys] = useState([]);
  const [splits, setSplits] = useState([]);
  const [series, setSeries] = useState([
    { name: "APPROVED", data: Array(12).fill(0) },
    { name: "PENDING", data: Array(12).fill(0) },
    { name: "REJECTED", data: Array(12).fill(0) },
  ]);

  const [options] = useState({
    colors: ["#ccc", "#7a6fbe", "rgb(40, 187, 227)"],
    chart: { toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 0.1 },
    grid: { borderColor: "#f8f8fa", row: { colors: ["transparent", "transparent"], opacity: 0.5 } },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: { show: false },
  });

  const [acceptedCount, setAcceptedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    fetchDatas();
    fetchSplits();
  }, []);

  const fetchDatas = async () => {
    try {
      const response = await fetchBenificiarys();
      setBenificiarys(response);
    } catch (error) {
      console.error("Error fetching benificiary details:", error);
    }
  };

  const charitydetails = JSON.parse(localStorage.getItem("charitydetails"));
  const filteredBenificiarys = benificiarys.filter(
    benificiary => benificiary.charity_name === charitydetails.charity
  );

  const fetchSplits = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/splits`);

      if (!charitydetails || !charitydetails.charity) {
        console.error("Charity details are missing or undefined.");
        return;
      }

      const charityName = charitydetails.charity;

      if (response && response.data && Array.isArray(response.data)) {
        const filteredSplits = response.data
          .filter(
            split => split.beneficiary && split.beneficiary.charity_name === charityName
          )
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setSplits(filteredSplits);

        const monthlyData = aggregateMonthlyData(filteredSplits);

        setAcceptedCount(monthlyData.Accepted.reduce((a, b) => a + b, 0));
        setPendingCount(monthlyData.Pending.reduce((a, b) => a + b, 0));
        setRejectedCount(monthlyData.Rejected.reduce((a, b) => a + b, 0));

        setSeries([
          { name: "APPROVED", data: monthlyData.Accepted },
          { name: "PENDING", data: monthlyData.Pending },
          { name: "REJECTED", data: monthlyData.Rejected },
        ]);
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching splits:", error);
    }
  };

  const aggregateMonthlyData = (splits) => {
    const monthlyData = {
      Accepted: Array(12).fill(0),
      Pending: Array(12).fill(0),
      Rejected: Array(12).fill(0),
    };

    splits.forEach(split => {
      const date = new Date(split.date);
      const month = date.getMonth();
      const amount = split.splitamount;

      if (split.status in monthlyData) {
        monthlyData[split.status][month] += amount;
      }
    });

    return monthlyData;
  };

  return (
    <React.Fragment>
      <Card className="container">
        <CardBody>
          <h4 className="card-title mb-4">Overview</h4>
          <Row className="text-center mt-4">
            <Col xs="3">
              <h5 className="font-size-20">{filteredBenificiarys.length}</h5>
              <p className="text-muted">Beneficiary</p>
            </Col>
            <Col xs="3">
              <h5 className="font-size-20">{acceptedCount}</h5>
              <p className="text-muted">Approved</p>
            </Col>
            <Col xs="3">
              <h5 className="font-size-20">{pendingCount}</h5>
              <p className="text-muted">Pending</p>
            </Col>
            <Col xs="3">
              <h5 className="font-size-20">{rejectedCount}</h5>
              <p className="text-muted">Rejected</p>
            </Col>
          </Row>
          <div
            id="morris-area-example"
            className="morris-charts morris-charts-height"
            dir="ltr"
          >
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height="300"
            />
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default MonthlyEarnings;
