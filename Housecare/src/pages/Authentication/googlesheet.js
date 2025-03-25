import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Button, Alert } from "reactstrap";
import { BASE_URL } from "./handle-api";
import * as XLSX from "xlsx";
import img1 from "../../assets/images/charitymodel.png";

const ExcelImport = ({ isOpen, toggle, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/vnd.ms-excel" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please upload a valid Excel file (.xlsx or .xls)");
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    const url = `${BASE_URL}/imports/import`;
    console.log("Sending request to:", url);
    
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      console.log("Response status:", response.status);
      
      const result = await response.json();
      console.log("Response data:", result);
      
      if (response.ok) {
        console.log("Import Successful:", result);
        onImportSuccess();
        toggle();
      } else {
        setError(result.message || "Import failed");
      }
    } catch (err) {
      console.error("Error during import:", err);
      setError("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headings = [
      ["charity", "prifix", "arbic", "CR_NO", "VAT_REG_NO", "phone", "authorizedperson", "email", "date", "roles", "password"],
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(headings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
  
    // Create a Blob and trigger a download
    XLSX.writeFile(workbook, "Charity_Template.xlsx");
  };

  return (
    // <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered" size="lg">
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered" size="lg" fade={true} timeout={900}>
      <ModalHeader toggle={toggle}>Import Charity Data from Excel</ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <label className="form-label">Upload Excel File</label>
          <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileChange} />
          <small className="text-muted">Supported formats: .xlsx, .xls</small>
          <br />
          <small className="text-danger">Use this model template</small>
          <img src={img1} alt="Excel" style={{ maxWidth: "100%", marginTop: "10px" }} />
        </div>

        {error && <Alert color="danger" className="mb-4">{error}</Alert>}

        <div className="text-center">
          <Button color="primary" onClick={handleImport} disabled={loading || !file} style={{ marginRight: "10px" }}>
            {loading ? "Importing..." : "Import Data"}
          </Button>

          <Button color="primary" onClick={handleDownloadTemplate} style={{ marginRight: "10px" }}>
            Download Template
          </Button>

          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ExcelImport;
