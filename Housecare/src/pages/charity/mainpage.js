import React, { useState } from "react";
import { Card, Row, Col, Button } from "reactstrap";
import logoDark from "../../assets/images/logo-dark.png";
import CharityLoginPanel from "./charitypanel";
import HousecareLoginPanel from "./housecarepanel";
import Supermarket from "../../assets/images/image.png";

const Mainpage = () => {
  const [selectedPanel, setSelectedPanel] = useState("Charity");

  const isCharitySelected = selectedPanel === "Charity";
  const isHousecareSelected = selectedPanel === "Housecare";

  const renderLoginPanel = () => {
    if (isCharitySelected) {
      return <CharityLoginPanel />;
    } else if (isHousecareSelected) {
      return <HousecareLoginPanel />;
    }
    return null;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f4f7",
        padding: "20px",
      }}
    >
      <Card
        className="p-4"
        style={{
          width: "100%",
          maxWidth: "900px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          borderRadius: "8px",
          display: "flex",
        }}
      >
        <Row className="align-items-center w-100">
          <Col xs="12" md="4" className="d-flex justify-content-center mb-4 mb-md-0">
            <img
              src={Supermarket}
              alt="Side"
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Col>

          <Col xs="12" md="8">
            <div className="text-center mb-4">
              <img src={logoDark} alt="Logo" height="50" className="auth-logo-dark mb-3"  /><br/><br/>
              <div className="d-flex justify-content-center mb-3">
                <Button
                  color="primary"
                  style={{
                    marginRight: "10px",
                    width: "40%",
                    borderRadius: "0px",
                    padding: "10px 20px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    background: isCharitySelected
                      ? "linear-gradient(135deg, rgb(255 38 47), rgb(250, 208, 196))"
                      :"rgb(255 255 255)",
                    color: isCharitySelected ?   "#fff":"rgb(255 29 0 / 93%)",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    border: "none",
                  }}
                  onClick={() => setSelectedPanel("Charity")}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                  Charity
                </Button>
                <Button
                  color="secondary"
                  style={{
                    width: "40%",
                    borderRadius: "0px",
                    padding: "10px 20px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    background: isHousecareSelected
                    ? "linear-gradient(135deg, rgb(255 38 47), rgb(250, 208, 196))"
                    :"rgb(255 255 255)",
                    color: isHousecareSelected ?   "#fff":"rgb(255 29 0 / 93%)",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    border: "none",
                  }}
                  onClick={() => setSelectedPanel("Housecare")}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                  Housecare
                </Button>
              </div>
            </div>
            {renderLoginPanel()}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Mainpage;
