import React, { useEffect, useState } from "react"
import axios from "axios"
import styles from "../../pages/charity/split.module.css"
import { Button, Card } from "reactstrap"
import * as XLSX from 'xlsx' // Add this import
import { BASE_URL } from "./handle-api"
import Swal from "sweetalert2"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
const SplitedHistory = () => {
  const [splits, setSplits] = useState([])
  const [file, setFile] = useState(null) // Add state for the file
  const charityName = JSON.parse(localStorage.getItem("charityname"))
  const selectedDate = localStorage.getItem("selectedDate")
  const [customMessage, setCustomMessage] = useState("") // State for custom message

  useEffect(() => {
    const fetchSplits = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/splits`)
        const filteredSplits = response.data.filter(
          split =>
            split.beneficiary &&
            split.beneficiary.charity_name === charityName &&
            new Date(split.date).toLocaleDateString() === selectedDate
        )
        setSplits(filteredSplits)
      } catch (error) {
        console.error("Error fetching splits:", error)
      }
    }

    fetchSplits()
  }, [charityName, selectedDate])

  // Handle file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

 // Handle file upload
 const handleUpload = async () => {
  if (file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        console.log("Parsed data:", data);

        for (const row of data) {
          console.log("Updating row:", row); // Log each row being updated
          
          // Construct the request payload
          const payload = {
            splitamount: row.splitamount,
            SecurityID: row.SecurityID, // Assuming SecurityID is a field in the split model or used for some logic
            beneficiary: {
              _id: row.beneficiary,
              benificiary_id: row.benificiary_id,
              benificiary_name: row.benificiary_name,
              number: row.number,
              category: row.category,
              age: row.age,
              charity_name: row.charity_name,
              // Add more fields if required
            },
            // Add more fields for the split data if required
          };

          try {
            const response = await axios.put(`${BASE_URL}/splits/${row._id}`, payload);
            console.log("Update response:", response.data); // Log the response data
          } catch (error) {
            console.error(`Error updating split with id ${row._id}:`, error.response ? error.response.data : error.message);
          }
        }
      } catch (error) {
        console.error("Error reading or parsing the file:", error);
      }
    };
    reader.readAsBinaryString(file);
  } else {
    await Swal.fire({
      title: 'Warning!',
      text: 'Please select a file first!',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });  }
};
//handle share excel file through emailssss
const handleShareEmail = () => {
  // Extract table data and convert it to a format suitable for XLSX
  const tableData = splits.map((split) => ({
    Date: new Date(split.date).toLocaleDateString(),
    // Id: split._id,
    Beneficiary_ID: split.beneficiary.benificiary_id,
    Name: split.beneficiary.benificiary_name,
    Number: split.beneficiary.number,
    Category: split.beneficiary.category,
    Age: split.beneficiary.age,
    Amount: split.splitamount,
    Status: split.status
  }));

  // Create a worksheet from the table data
  const worksheet = XLSX.utils.json_to_sheet(tableData);
  
  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Split Details");

  // Generate a binary Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a Blob from the Excel file
  const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  // Prepare form data to send to the server
  const formData = new FormData();
  formData.append("excel", excelBlob, "split_details.xlsx");

  // Send the Excel file to the server via POST request
  axios
    .post(`${BASE_URL}/sendmail`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(response => {
      console.log(response.data.message);
      Swal.fire({
        title: 'Success!',
        text: 'Email sent successfully!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    })
    .catch(error => {
      console.error("Error sending Excel file:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send email. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    });
};



  return (
    <React.Fragment>
      <br />
      <Card className="container">
        <div
          className="card-body"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h5 style={{ textAlign: "center", marginLeft: "20px" }}>
            SPLITED DETAILS
          </h5>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            style={{ marginLeft: 'auto', marginRight: '20px' }}
          />
          <Button
            style={{ marginRight: "10px" }}
            onClick={handleUpload}
          >
            Upload
          </Button>
          <Button onClick = {handleShareEmail}>Share</Button>
        </div>
      </Card>
      <div className={styles.table_container}>
        <table className={styles.tables}>
          <thead className={styles.theads}>
            <tr>
              <th>Date</th>
              <th>Id</th>
              <th>benificiary_id</th>
              <th>Name</th>
              <th>Number</th>
              <th>Category</th>
              <th>Age</th>
              <th>Amount</th>
              <th>Status</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {splits.map((split, index) => (
              <tr key={index}>
                <td>{new Date(split.date).toLocaleDateString()}</td>
                <td>{split._id}</td>
                <td>{split.beneficiary.benificiary_id}</td>
                <td>{split.beneficiary.benificiary_name}</td>
                <td>{split.beneficiary.number}</td>
                <td>{split.beneficiary.category}</td>
                <td>{split.beneficiary.age}</td>
                <td>{split.splitamount}</td>
                <td>{split.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  )
}

export default SplitedHistory
