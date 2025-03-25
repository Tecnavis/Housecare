import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from '../Authentication/handle-api';

const ImportBeneficiaryModal = ({ isOpen, toggle, onImportSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB');
        setSelectedFile(null);
        event.target.value = null;
        return;
      }
      
      const fileType = file.name.split('.').pop().toLowerCase();
      if (!['xlsx', 'xls'].includes(fileType)) {
        setError('Please select only Excel files (.xlsx or .xls)');
        setSelectedFile(null);
        event.target.value = null;
        return;
      }
      
      setError('');
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const charityDetails = JSON.parse(localStorage.getItem('charitydetails'));
      
      const response = await axios.post(
        `${BASE_URL}/imports/importbenificiaybasedoncharity`, 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'OK'
      });

      onImportSuccess();
      toggle();
    } catch (error) {
      console.error('Import failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to import beneficiaries';
      setError(errorMessage);
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Import Beneficiaries</ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <div className="mb-3">
          <label className="form-label">Select Excel File</label>
          <input
            type="file"
            className="form-control"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
          />
          <small className="text-muted">
            Only Excel files (.xlsx or .xls) up to 5MB are supported
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button 
          color="primary" 
          onClick={handleImport}
          disabled={!selectedFile || loading}
        >
          {loading ? 'Importing...' : 'Import'}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ImportBeneficiaryModal;