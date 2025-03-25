import React, { useEffect, useState } from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import axios from "axios";
import { BASE_URL } from "../Authentication/handle-api";

const DonutChart = () => {
    const [approvedCount, setApprovedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);

    useEffect(() => {
        fetchStatusCounts();
    }, []);

    const fetchStatusCounts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/splits`);
            const allSplits = response.data;
            
            
            // Filter splits based on status
            const approved = allSplits.filter(split => split.status === 'Accepted').length;
            const pending = allSplits.filter(split => split.status === 'Pending').length;
            const rejected = allSplits.filter(split => split.status === 'Rejected').length;

            // Update state with the counts
            setApprovedCount(approved);
            setPendingCount(pending);
            setRejectedCount(rejected);
        } catch (error) {
            console.error("Error fetching status counts:", error);
        }
    };
// const total = approvedCount + pendingCount + rejectedCount;
// console.log("Total Requests:", total);

    const data = {
        columns: [
            ['Approved', approvedCount],
            ['Pending', pendingCount],
            ['Rejected', rejectedCount]
        ],
        type: "donut",
    };

    const donut = {
        title: ` Requests `,
        width: 30,
        label: { show: false }
    };

    const color = {
        pattern: ['#7a6fbe', '#28bbe3', '#f0f1f4']
    };

    const size = {
        height: 300
    };

    return (
        <C3Chart data={data} donut={donut} color={color} size={size} dir="ltr" />
    );
};

export default DonutChart;
