import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormFeedback
} from 'reactstrap';

const PaymentModal = ({ isOpen, toggle, saveAmount }) => {
  const [amount, setAmount] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  const handleSave = () => {
    if (amount >= 1) {
      saveAmount(amount);
      toggle();
    } else {
      setIsInvalid(true);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
  
    // Convert to a number, and if the value is not a valid number, set it to an empty string
    const numericValue = parseInt(value, 10);
    
    if (!isNaN(numericValue)) {
      setAmount(numericValue);
      if (numericValue >= 1) {
        setIsInvalid(false);
      } else {
        setIsInvalid(true);
      }
    } else {
      setAmount('');  // Reset amount if input is not a valid number
      setIsInvalid(true);
    }
  };
  
  

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>BENEFICIARY PAYMENT DISTRIBUTION</ModalHeader>
      <ModalBody>
        <p>Enter your limited amount:</p>
        <Input
          type="number"
          value={amount}
          onChange={handleChange}
          placeholder="Enter amount"
          min="1"
          required
          invalid={isInvalid}  // This adds visual feedback if the value is invalid
        />
        <FormFeedback>
          Please enter an amount of at least SAR 1.
        </FormFeedback>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>OK</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  saveAmount: PropTypes.func.isRequired,
};

export default PaymentModal;
