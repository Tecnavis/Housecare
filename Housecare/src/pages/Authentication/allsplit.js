import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, fetchBenificiarys } from "./handle-api";
import styles from "../charity/split.module.css";
import { Button, Card } from "reactstrap";
import Swal from "sweetalert2";

function Allsplit() {
  const [splits, setSplits] = useState([]);
  const [benificiarys, setBenificiarys] = useState([]);

  useEffect(() => {
    loadData();
    const fetchSplits = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/splits`);
        setSplits(response.data);
        console.log(response.data, "All Splits Data");
      } catch (error) {
        console.error("Error fetching splits:", error);
      }
    };

    fetchSplits();
  }, []);

  const loadData = async () => {
    try {
      const respond = await fetchBenificiarys();
      setBenificiarys(respond);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/${id}`);
          setSplits(splits.filter((split) => split._id !== id));
          Swal.fire("Deleted!", "Your split has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting split:", error);
          Swal.fire("Error!", "There was a problem deleting the split.", "error");
        }
      }
    });
  };
  return (
    <React.Fragment>
      <br />
      <Card className="container">
        <div className="card-body" style={{ display: "flex", justifyContent: "center" }}>
          <h5 style={{ textAlign: "center", marginLeft: "20px" }}>VIEW COMPLETE SPLIT HISTORY</h5>
        </div>
      </Card>
      <div className={styles.table_container}>
        <table className={styles.tables}>
          <thead className={styles.theads}>
            <tr>
              <th>Date</th>
              <th>Id</th>
              <th>Name</th>
              <th>Number</th>
              <th>Category</th>
              <th>Age</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          {splits.map((split, index) => (
            <tbody key={index}>
              <tr>
                <td>{new Date(split.date).toLocaleDateString()}</td>
                {/* <td>{split._id}</td> */}
                <td>{split.beneficiary ? split.beneficiary.benificiary_id : "N/A"}</td>
                <td>{split.beneficiary ? split.beneficiary.benificiary_name : "N/A"}</td>
                <td>{split.beneficiary ? split.beneficiary.number : "N/A"}</td>
                <td>{split.beneficiary ? split.beneficiary.category : "N/A"}</td>
                <td>{split.beneficiary ? split.beneficiary.age : "N/A"}</td>
                <td>{split.splitamount}</td>
                <td>{split.status}</td>
                <td>
                  <button
                    onClick={() => handleDelete(split._id)}
                    style={{ border: "none", backgroundColor: "transparent" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      color="black"
                      className="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </React.Fragment>
  );
}

export default Allsplit;
