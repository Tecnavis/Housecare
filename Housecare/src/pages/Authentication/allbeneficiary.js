import React, { useEffect, useState } from "react"
import {
  Table,
  Card,
  CardBody,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  FormGroup,
  Label,
  Form,
} from "reactstrap"
import axios from "axios"
import moment from "moment" // Import moment.js for handling dates
import GoogleSheetsImport from "./beneficiaryimport"
import * as XLSX from "xlsx"

import { fetchbeneficiarys, BASE_URL, toggleBlockBenificary } from "./handle-api"
import Swal from "sweetalert2"
// Function to generate a transaction ID that starts with "TR" followed by 6 digits
const generateTransactionId = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000) // Generate a 6-digit number
  return `TR${randomDigits}`
}

function Beneficiary() {
  const [beneficiarys, setbeneficiarys] = useState([])
  const [searchTerm, setSearchTerm] = useState("") // New state for search input
  const [modal, setModal] = useState(false)
  const [selectedbeneficiary, setSelectedbeneficiary] = useState(null)
  const [spendAmount, setSpendAmount] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [transactionDate, setTransactionDate] = useState(
    moment().format("YYYY-MM-DD")
  ) // Default to today's date

  const [importModal, setImportModal] = useState(false)
  useEffect(() => {
    loadData()
  }, [])

  // Fetch charity organization details
  const loadData = async () => {
    try {
      const respond = await fetchbeneficiarys()
      setbeneficiarys(respond)
    } catch (err) {
      console.log(err)
    }
  }

  const toggleModal = () => setModal(!modal)

  const handlePayNowClick = beneficiary => {
    setSelectedbeneficiary(beneficiary)
    setTransactionId(generateTransactionId()) // Generate custom transaction ID starting with "TR"
    setSpendAmount("") // Clear the spend amount field
    setTransactionDate(moment().format("YYYY-MM-DD")) // Default to today's date
    toggleModal() // Open the modal
  }

  const handleSpendAmountChange = e => {
    setSpendAmount(e.target.value)
  }

  const handleTransactionDateChange = e => {
    setTransactionDate(e.target.value)
  }

  const handleSubmit = async () => {
    if (!selectedbeneficiary || !selectedbeneficiary._id) {
      alert("Invalid beneficiary selected.")
      return
    }

    try {
      // Update the beneficiary
      await updateBeneficiaryInDatabase(selectedbeneficiary._id, {
        debitedAmount: parseFloat(spendAmount),
        debitedDate: new Date(transactionDate),
        Balance: selectedbeneficiary.Balance - parseFloat(spendAmount),
      })

      // Save the debited history
      await saveDebitedHistory({
        debitedAmount: parseFloat(spendAmount),
        debitedDate: new Date(transactionDate),
        transactionId,
        beneficiary: selectedbeneficiary._id,
      })

      await loadData()
      toggleModal()
    } catch (err) {
      console.error("Error processing transaction:", err)
      alert(
        "Failed to process transaction. Please check the server logs for details."
      )
    }
  }

  // Function to update beneficiary in the database
  const updateBeneficiaryInDatabase = async (id, data) => {
    try {
      await axios.put(`${BASE_URL}/beneficiary/beneficiaries/${id}`, data)
    } catch (err) {
      console.error("Error updating beneficiary:", err)
      throw err
    }
  }

  // Function to save debited history
  const saveDebitedHistory = async data => {
    try {
      await axios.post(`${BASE_URL}/beneficiary/debited`, data)
    } catch (err) {
      console.error("Error saving debited history:", err)
      throw err
    }
  }

  const handleView = beneficiaryId => {
    window.location.href = `/beneficiarydetails/${beneficiaryId}`
  }

  // Filter beneficiaries based on the search term
  const filteredBeneficiaries = beneficiarys.filter(
    beneficiary =>
      beneficiary.beneficiary_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      beneficiary.charity_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      beneficiary.beneficiary_id
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  )

  const handleExport = () => {
    if (beneficiarys.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No data available to export.",
        showConfirmButton: false,
        timer: 1500,
      })
      return
    }

    // Format data for Excel with all required fields
    const exportData = beneficiarys.map(beneficiary => ({
      "Beneficiary ID": beneficiary.beneficiary_id,
      "Beneficiary Name": beneficiary.beneficiary_name,
      "Phone Number": beneficiary.number,
      Email: beneficiary.email_id,
      "Charity Name": beneficiary.charity_name,
      Nationality: beneficiary.nationality,
      Sex: beneficiary.sex,
      "Health Status": beneficiary.health_status,
      "Marital Status": beneficiary.marital,
      "Navision Linked No": beneficiary.navision_linked_no,
      "Physically Challenged": beneficiary.physically_challenged,
      "Family Members": beneficiary.family_members,
      "Account Status": beneficiary.account_status,
      Balance: beneficiary.Balance || 0,
      Category: beneficiary.category,
      Age: beneficiary.age,
    }))

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Beneficiaries")

    // Generate and download the Excel file
    XLSX.writeFile(wb, "Beneficiaries.xlsx")
  }

  const handleBlock = async (id, currentStatus) => {

      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${currentStatus ? "unblock" : "block"} this staff?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${currentStatus ? "unblock" : "block"} it!`,
        cancelButtonText: "Cancel",
      })

      if (isConfirmed) {
        try {
          const updatedBeneficiary = await toggleBlockBenificary(id)
          console.log(updatedBeneficiary)

          setbeneficiarys(prevBenfi =>
            prevBenfi.map(s =>
              s._id === id ? { ...s, isBlocked: !currentStatus } : s
            )
          )

          await Swal.fire({
            title: "Success!",
            text: `Staff ${currentStatus ? "unblocked" : "blocked"} successfully`,
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          })
        } catch (err) {
          console.error(
            `Error ${currentStatus ? "unblocking" : "blocking"} staff:`,
            err
          )

          await Swal.fire({
            title: "Error!",
            text: `Failed to ${
              currentStatus ? "unblock" : "block"
            } staff. Please try again.`,
            icon: "error",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          })
        }
      }
    }

  return (
    <React.Fragment>
      <div style={{ textAlign: "center" }}>
        <Card>
          <CardBody>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h4 className="card-title mb-3">BENEFICIARYS</h4>
              <Input
                type="text"
                placeholder="Search Beneficiaries..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: "300px" }} // Adjust the width of the search bar as needed
              />
              <button className="btn btn-primary" onClick={handleExport}>
                EXPORT BENEFICIARY
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setImportModal(true)}
              >
                IMPORT BENEFICIARYS
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
      <Card>
        <CardBody>
          <div className="table-responsive">
            <Table className="align-middle table-centered table-vertical table-nowrap">
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <td>Name</td>
                  <td>beneficiary Id</td>
                  <td>Charity</td>
                  <td>Email</td>
                  <td>Phone</td>
                  <td>Total Amount</td>
                  <td style={{ textAlign: "center" }}>Action</td>
                </tr>
              </thead>
              <tbody>
                {filteredBeneficiaries.map(beneficiary => (
                  <tr key={beneficiary.id}>
                    <td>{beneficiary.beneficiary_name}</td>
                    <td>{beneficiary.beneficiary_id}</td>
                    <td>{beneficiary.charity_name}</td>
                    <td>{beneficiary.email_id}</td>
                    <td>{beneficiary.number}</td>
                    <td>{beneficiary.Balance || 0}</td>
                    <td style={{ justifyContent: "center", display: "flex" }}>
                      <Button
                        style={{
                          paddingInline: "10px",
                          width: "75px",
                          backgroundColor: "transparent",
                          color: "black",
                          marginRight: "10px",
                        }}

                        className="waves-effect waves-light"
                        onClick={() =>
                          handleBlock(beneficiary._id, beneficiary.isBlocked)
                        }
                      >
                        {beneficiary.isBlocked ? "Unblock" : "Block"}
                      </Button>
                      <Button
                        style={{
                          paddingInline: "10px",
                          width: "75px",
                          backgroundColor: "transparent",
                          color: "black",
                          marginRight: "10px",
                        }}
                        className="waves-effect waves-light"
                        onClick={() => handlePayNowClick(beneficiary)}
                      >
                        PAY NOW
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "transparent",
                          color: "black",
                        }}
                        onClick={() => handleView(beneficiary._id)}
                      >
                        VIEW
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Modal for payment */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>PAY NOW</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="transactionId">Transaction ID</Label>
              <Input
                type="text"
                id="transactionId"
                value={transactionId}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="spendAmount">Debit Amount</Label>
              <Input
                type="number"
                id="spendAmount"
                value={spendAmount}
                onChange={handleSpendAmountChange}
                placeholder="Enter amount"
              />
            </FormGroup>
            <FormGroup>
              <Label for="transactionDate">Transaction Date</Label>
              <Input
                type="date"
                id="transactionDate"
                value={transactionDate}
                onChange={handleTransactionDateChange}
              />
            </FormGroup>
            <Button color="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              color="secondary"
              onClick={toggleModal}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          </Form>
        </ModalBody>
      </Modal>
      <GoogleSheetsImport
        isOpen={importModal}
        toggle={() => setImportModal(false)}
        onImportSuccess={data => {
          // Handle the imported data here
          loadData() // Refresh the charity list
        }}
      />
    </React.Fragment>
  )
}

export default Beneficiary
