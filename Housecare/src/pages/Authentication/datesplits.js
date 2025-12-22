import axios from "axios"
import React, { useEffect, useState } from "react"
import { Button, Card, CardDeck, CardText } from "reactstrap"
import { BASE_URL } from "./handle-api"
// import * as XLSX from "xlsx"
import ExcelJS from "exceljs";
const Datesplits = () => {
  const [splits, setSplits] = useState([])
  const charityName = JSON.parse(localStorage.getItem("charityname"))

  // useEffect(() => {
  //   const fetchSplits = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/splits`)
  //       const filteredSplits = response.data.filter(
  //         split => split.beneficiary.charity_name === charityName
  //       )
  //       setSplits(filteredSplits)
  //       console.log(filteredSplits, "Filtered Splits")
  //     } catch (error) {
  //       console.error("Error fetching splits:", error)
  //     }
  //   }

  //   fetchSplits()
  // }, [charityName])

  useEffect(() => {
    const fetchSplits = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/splits`);
        const filteredSplits = response.data.filter(split => {
          // Check if split.beneficiary exists before accessing charity_name
          if (split.beneficiary && split.beneficiary.charity_name) {
            return split.beneficiary.charity_name === charityName;
          } else {
            console.log("Missing beneficiary or charity_name in split:", split);
            return false;
          }
        });
        setSplits(filteredSplits);
        console.log(filteredSplits, "Filtered Splits");
      } catch (error) {
        console.error("Error fetching splits:", error);
      }
    };
  
    fetchSplits();
  }, [charityName]);
  
  const showSplit = date => {
    localStorage.setItem("selectedDate", date)
    window.location.href = "/histories"
  }


  const exportSplitDetails = async (date) => {
    const splitData = splits
      .filter(split => new Date(split.date).toLocaleDateString() === date)
      .map(split => ({
        Date: new Date(split.date).toLocaleDateString(),
        _id: split._id,
        benificiary_name: split.beneficiary.benificiary_name,
        benificiary_id: split.beneficiary.benificiary_id,
        number: split.beneficiary.number,
        category: split.beneficiary.category,
        age: split.beneficiary.age,
        charity_name: split.beneficiary.charity_name,
        splitamount: split.splitamount,
        SecurityID: "", // This field should be editable
      }));
  
    if (splitData.length === 0) {
      alert("No data to export for this date");
      return;
    }
  
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Split Details");
  
    // Define columns
    worksheet.columns = [
      { header: "Date", key: "Date", width: 15 },
      { header: "_id", key: "_id", width: 30 },
      { header: "benificiary_name", key: "benificiary_name", width: 30 },
      { header: "benificiary_id", key: "benificiary_id", width: 30 },
      { header: "number", key: "number", width: 15 },
      { header: "category", key: "category", width: 20 },
      { header: "age", key: "age", width: 10 },
      { header: "charity_name", key: "charity_name", width: 20 },
      { header: "splitamount", key: "splitamount", width: 15 },
      { header: "SecurityID", key: "SecurityID", width: 20 },
    ];
  
    // Add rows
    splitData.forEach(data => {
      worksheet.addRow(data);
    });
  
    // Protect the _id column
    worksheet.getColumn("_id").eachCell({ includeEmpty: true }, (cell) => {
      cell.protection = { locked: true }; // Lock the _id column
    });
  
    // Protect the worksheet with a password (optional)
    worksheet.protect("yourPasswordHere", { selectLockedCells: false, selectUnlockedCells: true });
  
    // Save the workbook
    await workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SplitDetails_${date}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  };
  
  
  const renderedDates = new Set()

  return (
    <div>
      <Card className="container">
        <div
          className="card-body"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <CardDeck style={{ textAlign: "center", marginLeft: "20px" }}>
            SPLIT DETAILS
          </CardDeck>
        </div>
      </Card>
      {splits.map(split => {
        const splitDate = new Date(split.date).toLocaleDateString()
        if (!renderedDates.has(splitDate)) {
          renderedDates.add(splitDate)
          return (
            <Card key={split._id} className="container">
              <div
                className="card-body"
                style={{ display: "flex", alignItems: "center" }}
              >
                <CardText>Date: {splitDate}</CardText>
                <Button
                  style={{
                    marginLeft: "auto",
                    border: "none",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => showSplit(splitDate)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    color="black"
                    class="bi bi-eye"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                  </svg>
                </Button>
                <Button
                  style={{ border: "none", backgroundColor: "transparent" }}
                  onClick={() => exportSplitDetails(splitDate)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    color="black"
                    class="bi bi-cloud-download"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383" />
                    <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z" />
                  </svg>
                </Button>
              </div>
            </Card>
          )
        }
        return null
      })}
    </div>
  )
}

export default Datesplits
