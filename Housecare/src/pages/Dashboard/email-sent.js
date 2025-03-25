import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import { fetchBenificiarys, fetchCharity } from "pages/Authentication/handle-api";
import axios from "axios";
import { BASE_URL } from "../Authentication/handle-api";

const MonthlyEarnings = () => {
    const [charitys, setCharitys] = useState([]);
    const [benificiarys, setBenificiarys] = useState([]);
    const [splits, setSplits] = useState([]);
    const [acceptedAmount, setAcceptedAmount] = useState(0);

    const [series, setSeries] = useState([
        {
            name: 'Charitys',
            data: Array(12).fill(0)
        },
        {
            name: 'Beneficiaries',
            data: Array(12).fill(0)
        }
    ]);

    useEffect(() => {
        loadData();
        fetchSplits()
    }, []);

    const loadData = async () => {
        try {
            const charityResponse = await fetchCharity();
            setCharitys(charityResponse);
            
            const charityCounts = processCharityData(charityResponse);
            
            const beneficiaryResponse = await fetchBenificiarys();
            setBenificiarys(beneficiaryResponse);
            
            const beneficiaryCounts = processBeneficiaryData(beneficiaryResponse);
            
            setSeries([
                { name: 'Charitys', data: charityCounts },
                { name: 'Beneficiaries', data: beneficiaryCounts }
            ]);
        } catch (err) {
            console.log(err);
        }
    };


//cahrity monthly data
    const processCharityData = (data) => {
        const counts = Array(12).fill(0);
    
        data.forEach(charity => {
            const createdDateStr = charity.date || charity.created_at;
            const createdDate = createdDateStr ? new Date(createdDateStr) : null;
    
            if (createdDate && !isNaN(createdDate.getTime())) {
                const month = createdDate.getMonth();
                counts[month]++;
            } else {
                console.warn("Invalid date format or missing date:", createdDateStr);
            }
        });
    
        return counts;
    };
//beneficiary monthly data
    const processBeneficiaryData = (data) => {
        const counts = Array(12).fill(0);
    
        data.forEach(beneficiary => {
            const createdDateStr = beneficiary.date || beneficiary.created_at;
            const createdDate = createdDateStr ? new Date(createdDateStr) : null;
    
            if (createdDate && !isNaN(createdDate.getTime())) {
                const month = createdDate.getMonth();
                counts[month]++;
            } else {
                console.warn("Invalid date format or missing date:", createdDateStr);
            }
        });
    
        return counts;
    };
//fetch splited details
const fetchSplits = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/splits`);
        const allSplits = response.data;

        // Filter splits with status 'Accepted'
        const acceptedSplits = allSplits.filter(split => split.status === 'Accepted');

        // Calculate the sum of splitamount for accepted splits
        const acceptedAmountSum = acceptedSplits.reduce((sum, split) => sum + split.splitamount, 0);

        // Set the data to state
        setSplits(allSplits);  // Store all splits if you need them elsewhere
        setAcceptedAmount(acceptedAmountSum);  // Set the sum to state

        console.log(allSplits, "All Splits Data");
    } catch (error) {
        console.error("Error fetching splits:", error);
    }
};


    const [options] = useState({
        colors: ['#ccc', '#7a6fbe', 'rgb(40, 187, 227)'],
        chart: {
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 0.1,
        },
        grid: {
            borderColor: '#f8f8fa',
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        legend: {
            show: false
        },
    });

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h4 className="card-title mb-4">Overview</h4>

                    <Row className="text-center mt-4">
                        <Col xs="4">
                            <h5 className="font-size-20">{charitys.length}</h5>
                            <p className="text-muted">Charity</p>
                        </Col>
                        <Col xs="4">
                            <h5 className="font-size-20">{benificiarys.length}</h5>
                            <p className="text-muted">Beneficiary</p>
                        </Col>
                        <Col xs="4">
                            <h5 className="font-size-20">SAR {acceptedAmount}</h5>
                            <p className="text-muted">Reward Amount</p>
                        </Col>
                    </Row>

                    <div id="morris-area-example" className="morris-charts morris-charts-height" dir="ltr">
                        <ReactApexChart options={options} series={series} type="area" height="300" />
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default MonthlyEarnings;
