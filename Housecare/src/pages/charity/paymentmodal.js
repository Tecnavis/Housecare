import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormFeedback,
} from "reactstrap"
import axios from "axios"
import { BASE_URL, fetchbeneficiarys } from "pages/Authentication/handle-api"
const beneficiary_URL = `${process.env.REACT_APP_BASE_URL}/beneficiary`;


const PaymentModal = ({ isOpen, toggle, saveAmount }) => {
  const [amount, setAmount] = useState("")
  const [isInvalid, setIsInvalid] = useState(false)
    const [beneficiarys, setbeneficiarys] = useState([])
  

  useEffect(() => {

    const FetchBenfi = async () => {
      try {
        const response = await fetchbeneficiarys()

        const charityFromStorage = JSON.parse(localStorage.getItem("charitydetails"));
        if (!charityFromStorage?.charity) {
          console.error("Charity details missing.");
          return;
        }

        const filtered = response.filter(
          ben => ben.charity_name === charityFromStorage.charity
        );
        setbeneficiarys(filtered);
      } catch (error) {
        console.error(error)
      }
    }

    FetchBenfi()

  }, [])
  
  


  

  const handleSave = async () => {
    var raw = localStorage.getItem("data")
    const parsed = JSON.parse(raw || "[]"); 

    if(beneficiarys.length !== 0 || parsed.length !== 0 )  {    
        if (amount >= 1) {
        try {
          // const response = await axios.post(`${BASE_URL}/amount`, { amount })
          fetchAndStoreBeneficiaries();

          localStorage.setItem("amountId", amount)
          // 1. Get data from localStorage
          const raw = localStorage.getItem("data")
          const parsedData = raw ? JSON.parse(raw) : []
  
          // 2. Set amount = 0 for all items, keep rest unchanged
          const updatedData = parsedData.map(item => ({
            ...item,
            amount: 0,
          }))
  
          // 3. Update localStorage
          localStorage.setItem("data", JSON.stringify(updatedData))
        } catch (error) {
          console.error(error)
        }
  
        saveAmount(amount)
        toggle()
      } else {
        setIsInvalid(true)
      }
    }else{
      alert("No benficary please adde")
    }
   
  }

  const handleChange = e => {
    let value = e.target.value

    // Convert to a number, and if the value is not a valid number, set it to an empty string
    const numericValue = parseInt(value, 10)

    if (!isNaN(numericValue)) {
      setAmount(numericValue)
      if (numericValue >= 1) {
        setIsInvalid(false)
      } else {
        setIsInvalid(true)
      }
    } else {
      setAmount("") // Reset amount if input is not a valid number
      setIsInvalid(true)
    }
  }



  const fetchAndStoreBeneficiaries = async () => {
    try {
      const charityFromStorage = JSON.parse(localStorage.getItem("charitydetails"));
      if (!charityFromStorage?.charity) {
        console.error("Charity details missing.");
        return;
      }
  
      const { data } = await axios.get(`${beneficiary_URL}`);
      const filtered = data.filter(
        ben => ben.charity_name === charityFromStorage.charity
      );
  
      const simplified = filtered.map(ben => ({
        Name: ben.beneficiary_name,
        id: ben._id,
        BEN_ID: ben.beneficiary_id,
        Number: ben.number,
        category: ben.category,
        age: ben.age,
        amount: 0,
      }));
  
      localStorage.setItem("data", JSON.stringify(simplified));
      console.log("Beneficiary data stored.");
    } catch (err) {
      console.error("Error fetching beneficiaries:", err);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    // setTimeout(() => {
      fetchAndStoreBeneficiaries();
    // }, 1000);
  }, []);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        BENEFICIARY PAYMENT DISTRIBUTION
      </ModalHeader>
      <ModalBody>
        <p>Enter your limited amount:</p>
        <Input
          type="number"
          value={amount}
          onChange={handleChange}
          placeholder="Enter amount"
          min="1"
          required
          invalid={isInvalid} // This adds visual feedback if the value is invalid
        />
        <FormFeedback>Please enter an amount of at least SAR 1.</FormFeedback>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
          OK
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  saveAmount: PropTypes.func.isRequired,
}

export default PaymentModal
