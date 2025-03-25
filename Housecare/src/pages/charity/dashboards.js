import React, { useEffect, useState } from "react"
import styles from "./dashboard.module.css"
import Navbar from "./Navbars"
import axios from "axios"
import { fetchBenificiarys , BASE_URL} from "pages/Authentication/handle-api"
import Graf from "./Navbars/graf"
const Dashboards = () => {
  //benificiarys list
  const [benificiarys, setBenificiarys] = useState([])
  useEffect(() => {
    fetchSplits()
    const fetchDatas = async () => {
      try {
        const response = await fetchBenificiarys()
        setBenificiarys(response)
        
      } catch (error) {
        console.error("Error fetching benificiary details:", error)
      }
    }
    fetchDatas()
  }, [])
  // const limitedamount = JSON.parse(localStorage.getItem("limitedamount"))
  const charitydetails = JSON.parse(localStorage.getItem("charitydetails"))

  // filter benificiarys based on the selected charity
  const filteredBenificiarys = benificiarys.filter(
    benificiary => benificiary.charity_name === charitydetails.charity
  )

  const [currentAmount, setCurrentAmount] = useState(0)
  const [previousAmount, setPreviousAmount] = useState(0)
  const [percentageChange, setPercentageChange] = useState(0)
  const [splitsAmountSum, setSplitsAmountSum] = useState(0); // New state for sum of spliteamount
  
  const updateLimitedAmount = (newAmount) => {
    const currentAmount = JSON.parse(localStorage.getItem("limitedamount")) || 0;
    localStorage.setItem("previousLimitedAmount", JSON.stringify(currentAmount));
    localStorage.setItem("limitedamount", JSON.stringify(newAmount));
    setCurrentAmount(newAmount);
  };
  
  useEffect(() => {
    const storedCurrentAmount =
      JSON.parse(localStorage.getItem("limitedamount")) || 0;
    const storedPreviousAmount =
      JSON.parse(localStorage.getItem("previousLimitedAmount")) || 0;
  
    // console.log("Stored Current Amount:", storedCurrentAmount);
    // console.log("Stored Previous Amount:", storedPreviousAmount);
  
    setCurrentAmount(storedCurrentAmount);
    setPreviousAmount(storedPreviousAmount);
  
    // Calculate percentage change if previous amount is greater than 0
    if (storedPreviousAmount > 0) {
      const change =
        ((storedCurrentAmount - storedPreviousAmount) / storedPreviousAmount) *
        100;
      setPercentageChange(change.toFixed(2));
    } else {
      // Handle cases where there is no previous amount
      setPercentageChange(0);
    }
  }, []);
  
//fetch splits data for find out the pending approvals
const [splits, setSplits] = useState([]);
const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const charityName = charitydetails?.charity;
  const fetchSplits = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/splits`);  
      const filteredSplits = response.data.filter(
        split => split.beneficiary && split.beneficiary.charity_name === charityName
      );
      setSplits(filteredSplits);
      console.log(filteredSplits, "Filtered Splits");
      
      const pendingCount = filteredSplits.filter(split => split.status === "Pending").length;
      setPendingApprovalsCount(pendingCount);  
        // Calculate the sum of spliteamount
        const amountSum = filteredSplits.reduce((total, split) => total + (split.splitamount || 0), 0);
        setSplitsAmountSum(amountSum); 
        console.log(splitsAmountSum, "Splits Amount Sum");
        
  
    } catch (error) {
      console.error("Error fetching splits:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
      <div className={styles.dashboards}>
        <div className={styles.cards}>
          <div className={styles.cardtitle}>Fund Size</div>
          <div className={styles.cardvalue}>SAR {currentAmount || "000"}</div>
         
        </div>
        <div className={styles.cards}>
          <div className={styles.cardtitle}>Invested</div>
          <div className={styles.cardvalue}>SAR {splitsAmountSum}</div>
          {/* <div className={styles.cardsubtext}>-29% From previous period</div> */}
        </div>
        <div className={styles.cards}>
          <div className={styles.cardtitle}>Total Beneficiaries</div>
          <div className={styles.cardvalue}>{filteredBenificiarys.length}</div>
          {/* <div className={styles.cardsubtext}>0% From previous period</div> */}
        </div>
        <div className={styles.cards}>
          <div className={styles.cardtitle}>Pending Approvals</div>
          <div className={styles.cardvalue}>{pendingApprovalsCount}</div>
          {/* <div className={styles.cardsubtext}>+1% From previous period</div> */}
        </div>
      <Graf />

      </div>
      </div>
     
    </>
  )
}

export default Dashboards
