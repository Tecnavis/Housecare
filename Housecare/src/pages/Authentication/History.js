import React, { useState, useEffect } from "react";
import styles from "../../pages/charity/split.module.css";
import { Button, Card, CardBody, CardTitle, Col, Collapse, Row } from "reactstrap";
import axios from "axios";
import { BASE_URL } from "./handle-api"

const UiTabsAccordions = () => {
  const [activeDate, setActiveDate] = useState(null);
  const [splits, setSplits] = useState([]);
  const [selectedSplits, setSelectedSplits] = useState({});
  const [selectAll, setSelectAll] = useState({});
  const charityName = JSON.parse(localStorage.getItem("charityname"));

  useEffect(() => {
    const fetchSplits = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/splits`);
        setSplits(response.data);
      } catch (error) {
        console.error("Error fetching splits:", error);
      }
    };

    fetchSplits();
  }, [charityName]);

  const toggleCollapse = (date) => {
    setActiveDate(activeDate === date ? null : date);
  };

  // const handleStatusChange = async (splitIds, status) => {
  //   try {
  //     await Promise.all(
  //       splitIds.map(splitId => axios.put(`${BASE_URL}/splits/${splitId}/status`, { status }))
  //     );
  //     const response = await axios.get(`${BASE_URL}/api/splits`);
  //     setSplits(response.data);
  //     setSelectedSplits({}); // Reset selected splits after action
  //     setSelectAll({}); // Reset select all checkboxes
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //   }
  // };
  const handleStatusChange = async (splitIds, status) => {
    try {
      await Promise.all(
        splitIds.map(async (splitId) => {
          await axios.put(`${BASE_URL}/splits/${splitId}/status`, { status });
          
          const split = splits.find(s => s._id === splitId);
          await axios.post(`${BASE_URL}/approvals/notifications`, {
            charityName: split.beneficiary?.charity_name,
            beneficiaryName: split.beneficiary?.benificiary_name,
            status,
          });
        })
      );
  
      const response = await axios.get(`${BASE_URL}/api/splits`);
      setSplits(response.data);
      setSelectedSplits({}); // Reset selected splits after action
      setSelectAll({}); // Reset select all checkboxes
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  

  const handleCheckboxChange = (splitDate, splitId) => {
    setSelectedSplits(prevSelectedSplits => {
      const newSelectedSplits = { ...prevSelectedSplits };
      if (newSelectedSplits[splitDate]?.includes(splitId)) {
        newSelectedSplits[splitDate] = newSelectedSplits[splitDate].filter(id => id !== splitId);
      } else {
        newSelectedSplits[splitDate] = [...(newSelectedSplits[splitDate] || []), splitId];
      }
      return newSelectedSplits;
    });
  };

  const handleSelectAllChange = (splitDate) => {
    setSelectAll(prevSelectAll => {
      const newSelectAll = { ...prevSelectAll, [splitDate]: !prevSelectAll[splitDate] };
      return newSelectAll;
    });

    setSelectedSplits(prevSelectedSplits => {
      const newSelectedSplits = { ...prevSelectedSplits };
      if (selectAll[splitDate]) {
        newSelectedSplits[splitDate] = [];
      } else {
        newSelectedSplits[splitDate] = groupedSplits[splitDate].map(split => split._id);
      }
      return newSelectedSplits;
    });
  };

  const groupedSplits = splits.reduce((acc, split) => {
    const splitDate = new Date(split.date).toLocaleDateString();
    if (!acc[splitDate]) {
      acc[splitDate] = [];
    }
    acc[splitDate].push(split);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSplits).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('/'));
    const dateB = new Date(b.split('/').reverse().join('/'));
    return dateB - dateA;
  });

  const handleClick = () => {
    window.location.href = "/allsplit";
  };

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <CardTitle className="h4" style={{display:"flex"}} >
                <h4>SPLIT DETAILS</h4>
                <Button style={{marginLeft:"auto",backgroundColor:"var(--bs-primary)",border:"none"}} onClick={handleClick}>
                  View All History
                </Button>
              </CardTitle>

              <div className="accordion" id="accordion">
                {sortedDates.map((splitDate) => (
                  <div className="accordion-item" key={splitDate}>
                    <h2 className="accordion-header" id={`heading-${splitDate}`}>
                      <button
                        className="accordion-button fw-medium"
                        type="button"
                        onClick={() => toggleCollapse(splitDate)}
                        style={{ cursor: "pointer" }}
                      >
                        Date: {splitDate}
                      </button>
                    </h2>

                    <Collapse isOpen={activeDate === splitDate} className="accordion-collapse">
                      <div className={styles.table_container}>
                        <div style={{ display: "flex", justifyContent: "end" }}>
                          <Button
                            style={{ marginRight: "5px", backgroundColor: "#28a745", borderColor: "#28a745" }}
                            onClick={() => handleStatusChange(selectedSplits[splitDate] || [], 'Accepted')}
                            disabled={!selectedSplits[splitDate]?.length}
                          >
                            Approve
                          </Button>
                          <Button
                            style={{ marginRight: "5px", backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                            onClick={() => handleStatusChange(selectedSplits[splitDate] || [], 'Rejected')}
                            disabled={!selectedSplits[splitDate]?.length}
                          >
                            Reject
                          </Button>
                        </div>
                        <br/>
                        <table className={styles.tables}>
                          <thead className={styles.theads}>
                            <tr>
                              <th>
                                <input
                                  type="checkbox"
                                  checked={selectAll[splitDate] || false}
                                  onChange={() => handleSelectAllChange(splitDate)}
                                />
                              </th>
                              <th>Date</th>
                              <th>Beneficiary ID</th>
                              <th>Name</th>
                              <th>Number</th>
                              <th>Charity</th>
                              <th>Age</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupedSplits[splitDate].map((split, index) => (
                              <tr 
                                key={index}
                                style={split.status === 'Pending' ? { backgroundColor: '#f8d7da' } : {}}
                              >
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedSplits[splitDate]?.includes(split._id) || false}
                                    onChange={() => handleCheckboxChange(splitDate, split._id)}
                                  />
                                </td>
                                <td>{splitDate}</td>
                                <td>{split.beneficiary?.benificiary_id || "N/A"}</td>
                                <td>{split.beneficiary?.benificiary_name || "N/A"}</td>
                                <td>{split.beneficiary?.number || "N/A"}</td>
                                <td>{split.beneficiary?.charity_name || "N/A"}</td>
                                <td>{split.beneficiary?.age || "N/A"}</td>
                                <td>{split.splitamount}</td>
                                <td>{split.status === 'Accepted' ? 'Approved' : split.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Collapse>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default UiTabsAccordions;
