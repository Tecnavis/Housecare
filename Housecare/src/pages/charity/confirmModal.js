import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomModal = ({ show, onHide, onConfirm, balanceAmount }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        The total amount exceeds the limited amount of {balanceAmount}. Do you want to continue with the split?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
