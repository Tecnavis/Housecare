import React, { useState, useEffect } from "react"
import styles from "./dashboard.module.css"
import { Button, Card, Input } from "reactstrap"
import html2canvas from "html2canvas"
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import axios from "axios"
import * as XLSX from "xlsx" 

import Navbar from "./Navbars"
import { BASE_URL } from "../Authentication/handle-api"
import { fetchBenificiarys } from "pages/Authentication/handle-api"
const App = () => {
  const [benificiarys, setBenificiarys] = useState([])
  const [data, setData] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [amount, setAmount] = useState("")
  const [limitedAmount, setLimitedAmount] = useState(
    JSON.parse(localStorage.getItem("limitedamount")) || 0
  )
  const [isEditingLimitedAmount, setIsEditingLimitedAmount] = useState(false)
  const [newLimitedAmount, setNewLimitedAmount] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [confirmAction, setConfirmAction] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchDatas = async () => {
    try {
      const response = await fetchBenificiarys()
      setBenificiarys(response)
    } catch (error) {
      console.error("Error fetching benificiary details:", error)
    }
  }

  useEffect(() => {
    if (benificiarys.length === 0) {
      fetchDatas()
    }
    const charitydetails = JSON.parse(localStorage.getItem("charitydetails"))
    if (charitydetails) {
      const filteredBenificiarys = benificiarys.filter(
        benificiary => benificiary.charity_name === charitydetails.charity
      )

      const savedData = JSON.parse(localStorage.getItem("data")) || []
      const initialData = filteredBenificiarys.map(benificiary => ({
        Name: benificiary.benificiary_name,
        id: benificiary._id,
        benificiary_id: benificiary.benificiary_id,
        Nav_Number: benificiary.navision_linked_no,
        Number: benificiary.number,
        category: benificiary.category,
        age: benificiary.age,
        amount:
          savedData.find(item => item.id === benificiary._id)?.amount || 0,
      }))

      setData(initialData)
    }
  }, [benificiarys])

  const handleEditClick = index => {
    setEditIndex(index)
    setAmount(data[index].amount)
  }

  const handleAmountChange = event => {
    setAmount(event.target.value)
  }

  const handleSaveClick = () => {
    const updatedData = [...data]
    updatedData[editIndex].amount = amount
    setData(updatedData)
    localStorage.setItem("data", JSON.stringify(updatedData))
    setEditIndex(null)
    setAmount("")
  }

  const handleCancelClick = () => {
    setEditIndex(null)
    setAmount("")
  }

  const handleLimitedAmountEdit = () => {
    setIsEditingLimitedAmount(true)
    setNewLimitedAmount(limitedAmount)
  }

  const handleLimitedAmountChange = event => {
    setNewLimitedAmount(event.target.value)
  }

  const handleLimitedAmountSave = () => {
    const updatedLimitedAmount = parseFloat(newLimitedAmount)
    setLimitedAmount(updatedLimitedAmount)
    localStorage.setItem("limitedamount", updatedLimitedAmount)
    setIsEditingLimitedAmount(false)
  }

  const handleLimitedAmountCancel = () => {
    setIsEditingLimitedAmount(false)
  }

  const handleClear = () => {
    setAlertMessage("Are you sure you want to clear all amounts?")
    setConfirmAction(() => () => {
      const clearedData = data.map(item => ({
        ...item,
        amount: 0,
      }))
      setData(clearedData)
      localStorage.setItem("data", JSON.stringify(clearedData))
      setShowAlert(false)
    })
    setShowAlert(true)
  }

  // Download pdf
  const handleSend = () => {
    if (totalAmount > limitedAmount) {
      setAlertMessage(
        `The total amount exceeds the limited amount of ${balanceAmount}. Do you want to continue with the split?`
      )
      setConfirmAction(() => downloadPages)
      setShowAlert(true)
    } else {
      downloadPages()
    }
  }

  const handleSearchChange = event => {
    setSearchQuery(event.target.value)
  }

  const totalAmount = data
    .reduce((total, item) => total + parseFloat(item.amount || 0), 0)
    .toFixed(2)
  const balanceAmount = (limitedAmount - totalAmount).toFixed(2)

  const downloadPages = () => {
    html2canvas(document.body).then(canvas => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save("page.pdf")
    })
  }

  const filteredData = data.filter(
    row =>
      String(row.Name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.Nav_Number)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(row.Number).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.category).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.age).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.amount).toLowerCase().includes(searchQuery.toLowerCase())
  )

  //Data History and get notification exceed amount
  const handleSaveData = async () => {
    if (totalAmount > limitedAmount) {
      const { isConfirmed } = await Swal.fire({
        title: 'Amount Exceeds Limit',
        text: `The total amount exceeds the limited amount of ${balanceAmount}. Do you want to continue with the split?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, continue',
        cancelButtonText: 'Cancel'
      });
  
      if (!isConfirmed) {
        return;
      }
    }
    try {
      const charityDetails = JSON.parse(localStorage.getItem("charitydetails"))
      if (!charityDetails) return
  
      // Filter out beneficiaries with an amount of 0
      const splits = data
        .filter(item => parseFloat(item.amount) > 0)
        .map(item => ({
          totalamount: limitedAmount,
          splitamount: parseFloat(item.amount),
          beneficiary: item.id,
          date: new Date().toISOString(),
        }))
  
      if (splits.length === 0) {
        await Swal.fire({
          title: 'No Beneficiaries',
          text: 'No beneficiaries with non-zero amounts to save.',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        return;
      }
  
      // Save splits to the backend
      await axios.post(`${BASE_URL}/api/splits`, { splits })
  
      // Update beneficiaries' balances
      const balanceUpdates = splits.map(split => ({
        beneficiaryId: split.beneficiary,
        newBalance: parseFloat(split.splitamount)
      }))
      
      await axios.post(`${BASE_URL}/benificiary/update-balances`, { balanceUpdates })
  
      await Swal.fire({
        title: 'Success',
        text: 'Data saved successfully!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      console.log("Splits and balances saved successfully")
      window.location.href = "/history"
    } catch (error) {
      console.error("Error saving data:", error)
      await Swal.fire({
        title: 'Error',
        text: 'Failed to save data. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      setShowAlert(true)
    }
  }
  

  //share pdf through mail
  const sendEmail = () => {
    // Filter out beneficiaries with an amount of 0
    const filteredTableData = filteredData.filter(split => split.amount !== 0)
    const tableData = filteredTableData.map(split => ({
      Name: split.Name,
      Nav_Number: split.Nav_Number,
      BEN_ID: split.benificiary_id,
      Number: split.Number,
      Category: split.category,
      Age: split.age,
      Amount: split.amount,
    }))

    // Generate the Excel file as before
    const worksheet = XLSX.utils.json_to_sheet(tableData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Split Details")
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    })
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    // Prepare form data to send to the server
    const formData = new FormData()
    formData.append("excel", excelBlob, "split_details.xlsx")

    // Send the Excel file to the server via POST request
    axios
      .post(`${BASE_URL}/sendmail`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(response => {
        console.log(response.data.message)
        Swal.fire({
          title: 'Success',
          text: response.data.message || 'Email sent successfully!',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      })
      .catch(error => {
        console.error("Error sending Excel file:", error)
         Swal.fire({
          title: 'Error',
          text: 'Failed to send email. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      })
  }

  // const handleShareEmail = async () => {
  //   try {
  //     await axios.post(`${BASE_URL}/increment`)
  //     console.log("Notification count incremented successfully")
  //   } catch (error) {
  //     console.error("Error incrementing notification count:", error)
  //   }
  //   handleSaveData()
  //   sendEmail()
  // }
  const handleShareEmail = async () => {
    try {
      const charityDetails = JSON.parse(localStorage.getItem("charitydetails"));
      if (charityDetails) {
        const response = await axios.post(`${BASE_URL}/notification`, {
          charityName: charityDetails.charity,
          message: `New approval notification from ${charityDetails.charity}. Approve the payment.`,
        });
        console.log("Notification created successfully:", response.data);
      }
  
      await axios.post(`${BASE_URL}/increment`);
      console.log("Notification count incremented successfully");
  
      handleSaveData();
      sendEmail();
    } catch (error) {
      console.error("Error handling share email:", error);
    }
  };
  return (
    <>
      <Navbar />
      <br />
      <div className={styles.App}>
        <Card className="container">
          <Card>
            <div
              className="card-body"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {isEditingLimitedAmount ? (
                <>
                  <Input
                    type="number"
                    value={newLimitedAmount}
                    onChange={handleLimitedAmountChange}
                    style={{ marginRight: "10px", width: "100px" }}
                  />
                  <Button
                    onClick={handleLimitedAmountSave}
                    style={{ marginRight: "10px",backgroundColor:"var(--bs-green)",border:"none" }}
                  >
                    Save
                  </Button>
                  <Button onClick={handleLimitedAmountCancel} style={{backgroundColor:"var(--bs-red)",border:"none"}}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button
                    style={{
                      marginRight: "10px",
                      backgroundColor: "transparent",
                      color: "black",
                    }}
                  >
                    {limitedAmount}
                  </Button>
                  <Button
                    onClick={handleLimitedAmountEdit}
                    style={{ backgroundColor: "transparent" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      color="black"
                      className="bi bi-pencil"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                    </svg>
                  </Button>
                </>
              )}
              <div style={{ flexGrow: 1, textAlign: "center" }}>
                <h4 style={{ margin: 0 }}>Beneficiary Distribution Panel</h4>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    color="black"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "8px",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{
                      paddingLeft: "30px",
                      marginRight: "2px",
                      height: "30px",
                    }}
                  />
                </div>

              </div>
            </div>
          </Card>

          <table className={styles.tables}>
            <thead>
              <tr>
                <th>Name</th>
                <th>id</th>
                <th>BEN_ID</th>
                <th>Nav_Number</th>
                <th>Number</th>
                <th>category</th>
                <th>age</th>
                <th>amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={row.id}>
                  <td>{row.Name}</td>
                  <td>{row.id}</td>
                  <td>{row.benificiary_id}</td>
                  <td>{row.Nav_Number}</td>
                  <td>{row.Number}</td>
                  <td>{row.category}</td>
                  <td>{row.age}</td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        style={{ width: "100px" }}
                      />
                    ) : (
                      row.amount
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <>
                        <button
                          onClick={handleSaveClick}
                          className={styles.btn}
                          style={{ marginInline: "10px" }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className={styles.btn}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditClick(index)}
                        className={styles.btn}
                        style={{ backgroundColor: "transparent" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          color="black"
                          className="bi bi-pencil"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              <br />
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <th>Total Amount</th>
                <th style={{ textAlign: "end" }}>{totalAmount}</th>
              </tr>
            </tbody>
          </table>

          <Card>
            <div
              className="card-body"
              style={{
                display: "flex",
                justifyContent: "end",
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={handleShareEmail}
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#7A6FBE",
                  color: "black",
                   marginRight:"10px",

                }}
              >
                SHARE{" "}  
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  color="black"
                  class="bi bi-envelope-arrow-up"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5a.5.5 0 0 1-1 0V5.383l-7 4.2-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h5.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-1.99zm1 7.105 4.708-2.897L1 5.383zM1 4v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1" />
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.354 1.25 1.25a.5.5 0 0 1-.708.708L13 12.207V14a.5.5 0 0 1-1 0v-1.717l-.28.305a.5.5 0 0 1-.737-.676l1.149-1.25a.5.5 0 0 1 .722-.016" />
                </svg>
              </Button>
              <Button
                onClick={handleSend}
                style={{ backgroundColor: "transparent", borderColor: "green",color:"black", marginRight:"10px" }}
              >DOWNLOAD {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  color="black"
                  class="bi bi-box-arrow-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"
                  />
                </svg>
              </Button>
              <Button
                onClick={handleClear}
                style={{ backgroundColor: "transparent", borderColor: "red",color:"black" }}
              >RESET {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  color="black"
                  class="bi bi-arrow-clockwise"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                  />
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                </svg>
              </Button>
            </div>
          </Card>
        </Card>
      </div>

      {showAlert && (
        <div className={styles.alert_container}>
          <p>{alertMessage}</p>
          <Button
            onClick={() => {
              if (confirmAction) confirmAction()
              setShowAlert(false)
            }}
            style={{ marginRight: "10px" ,backgroundColor:"green",border:"none"}}
          >
            Confirm
          </Button>
          <Button onClick={() => setShowAlert(false)} style={{backgroundColor:"red",border:"none"}}>Cancel</Button>
        </div>
      )}
    </>
  )
}

export default App
