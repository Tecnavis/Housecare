import React, { Component } from 'react';
import { Table, Card, CardBody, Button } from "reactstrap";

//Import Images
import user6 from "../../assets/images/users/user-6.jpg";

class Staff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [
                { imgUrl: user6, name: "Kasper S. Jessen", status: "Confirm", amount: "8,844", date: "1/11/2016", color: "success" },
            ],
        }
    }

    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <h4 className="card-title mb-4">Housecare staffs</h4>

                        <div className="table-responsive">
                            <Table className="align-middle table-centered table-vertical table-nowrap">

                                <tbody>
                                    {
                                        this.state.transactions.map((transaction, key) =>
                                            <tr key={key}>
                                                <td>
                                                    <img src={transaction.imgUrl} alt="user" className="avatar-xs rounded-circle me-2" /> {transaction.name}
                                                </td>
                                                <td><i className={"mdi mdi-checkbox-blank-circle  text-" + transaction.color}></i> {transaction.status}</td>
                                                <td>
                                                    ${transaction.amount}
                                                    <p className="m-0 text-muted font-size-14">Amount</p>
                                                </td>
                                                <td>
                                                    {transaction.date}
                                                    <p className="m-0 text-muted font-size-14">Date</p>
                                                </td>
                                                <td>
                                                    <Button color="secondary" size="sm" className="waves-effect waves-light">Edit</Button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default Staff;