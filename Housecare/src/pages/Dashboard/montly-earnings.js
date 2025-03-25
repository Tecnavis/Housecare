import React, { useEffect, useState } from "react";
import { Card, CardBody, Row, CardTitle } from "reactstrap";
import DonutChart from '../AllCharts/DonutChart';
import axios from "axios";
import { BASE_URL } from "../Authentication/handle-api";

const MonthlyEarnings = props => {
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

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <CardTitle className="h4 mb-4">Approvals</CardTitle>

                    <Row className="text-center mt-4">
                        <div className="col-4">
                            <h5 className="font-size-20">{approvedCount}</h5>
                            <p className="text-muted">Approved</p>
                        </div>
                        <div className="col-4">
                            <h5 className="font-size-20">{pendingCount}</h5>
                            <p className="text-muted">Pending</p>
                        </div>
                        <div className="col-4">
                            <h5 className="font-size-20">{rejectedCount}</h5>
                            <p className="text-muted">Rejected</p>
                        </div>
                    </Row>

                    <div dir="ltr">
                        <DonutChart 
                            approved={approvedCount}
                            pending={pendingCount}
                            rejected={rejectedCount} 
                        />
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default MonthlyEarnings;
