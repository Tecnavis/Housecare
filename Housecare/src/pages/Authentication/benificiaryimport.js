import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Alert } from 'reactstrap';
import { BASE_URL } from './handle-api';
import img1 from '../../assets/images/benificiary.png';
import * as XLSX from "xlsx";

const ExcelImport = ({ isOpen, toggle, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/vnd.ms-excel' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please upload a valid Excel file (.xlsx or .xls)');
    }
  };
  const handleImport = async () => {
    if (!file) {
      setError('Please select a file before importing.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/imports/importbeneficiaries`, {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        setSuccess(result.message);
        onImportSuccess();
        setTimeout(() => {
          toggle();
        }, 2000);
      } else {
        setError(result.error || 'Failed to import data');
      }
    } catch (error) {
      setError('Network error while importing file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headings = [
      ["benificiary_name", "number", "email_id", "charity_name", "nationality", 
       "sex", "health_status", "marital", "navision_linked_no", 
       "physically_challenged", "family_members", "account_status", 
       "Balance", "category", "age"]
    ];
    
    // Add a sample row to show expected format
    const sampleRow = [
      ["John Doe", "1234567890", "john@example.com", "Charity A", "US", 
       "Male", "Good", "Single", "NAV001", 
       "No", "3", "Active", 
       "1000", "Category A", "30"]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([...headings, ...sampleRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "Benificiary_Template.xlsx");
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered" size="xl">
      <ModalHeader toggle={toggle}>
        Import Benificiary Data from Excel
      </ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <label className="form-label">Upload Excel File</label>
          <input
            type="file"
            className="form-control"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
          <small className="text-muted d-block">
            Supported formats: .xlsx, .xls
          </small>
          <small className="text-danger d-block mt-2">
            All fields marked with * in the template are required
          </small>
          <img src={img1} alt="Excel Template" style={{ maxWidth: '100%', marginTop: '10px' }} />
        </div>

        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="success" className="mb-4">
            {success}
          </Alert>
        )}

        <div className="text-center">
          <Button 
            color="primary" 
            onClick={handleImport} 
            disabled={loading || !file} 
            style={{ marginRight: '10px' }}
          >
            {loading ? "Importing..." : "Import Data"}
          </Button>

          <Button 
            color="primary" 
            onClick={handleDownloadTemplate} 
            style={{ marginRight: "10px" }}
          >
            Download Template
          </Button>       
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ExcelImport;