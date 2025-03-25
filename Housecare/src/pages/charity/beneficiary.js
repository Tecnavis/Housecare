import React, { useEffect, useState } from "react"
import {
  Table,
  Card,
  Button,
  Row,
  CardBody,
  Col,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
} from "reactstrap"
import ImportBeneficiaryModal from './charitybenificiaryimport';
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { useForm } from "helpers/useForms"
import Swal from "sweetalert2"
import {
  fetchBenificiarys,
  handleBenificiary,
  benificiaryDelete,
  benificiaryEdit,
  benificiaryUpdate,
  BASE_URL,
} from "../Authentication/handle-api"
import Navbar from "./Navbars"
const Beneficiary = () => {
  const [datas, handleChanges, setDatas] = useForm({
    benificiary_name: "",
    category: "",
    age: "",
    number: "",
    email_id: "",
    charity_name: "",
    nationality: "",
    sex: "",
    health_status: "",
    marital: "",
    navision_linked_no: "",
    physically_challenged: "",
    family_members: "",
    account_status: "",
    Balance: "",
    date: "",
  })

  const [charitys, setCharitys] = useState([])
  // const [showPassword, setShowPassword] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { id } = useParams()
  const [edits, setEdits] = useState(false)
  const [benificiarys, setBenificiarys] = useState([])
  const [modals, setmodals] = useState(false)
  const [editedId, setEditedId] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const navigate = useNavigate()
  const [importModalOpen, setImportModalOpen] = useState(false);
  //charity details
  useEffect(() => {
    // loadData()
    fetchDatas()
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      try {
        const response = await axios.get(`${BASE_URL}/charity/detailses/${id}`)
        setCharitys(response.data)
      } catch (error) {
        console.error("Error fetching charity details:", error)
        if (error.response) {
          console.error("Response data:")
        }
      }
    }
    fetchData()
  }, [id])

  //benificiary create

  const benificiaryCreate = async e => {
    e.preventDefault()
    const errors = {}
    if(!datas.date) errors.date = "Date is required."
    if (!datas.benificiary_name) errors.benificiary_name = "Name is required."
    if (!datas.category) errors.category = "Category is required."
    if (!datas.age) errors.age = "Age is required."
    if (!datas.email_id) errors.email_id = "Email is required."
    if (!datas.number) errors.number = "Number is required."
    if (!datas.charity_name) errors.charity_name = "Charity Name is required."
    if (!datas.nationality) errors.nationality = "Nationality is required."
    if (!datas.sex) errors.sex = "Sex is required."
    if (!datas.health_status)
      errors.health_status = "Health Status is required."
    if (!datas.marital) errors.marital = "Marital Status is required."
    // if (!datas.navision_linked_no)
    //   errors.navision_linked_no = "Navision Number is required."
    if (!datas.physically_challenged)
      errors.physically_challenged = "Physically Challenged is required."
    if (!datas.family_members)
      errors.family_members = "Family Members is required."
    if (!datas.account_status)
      errors.account_status = "Account Status is required."
    // if (!datas.Balance) errors.Balance = "Balance is required."

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    const formData = new FormData()
    Object.keys(datas).forEach(key => {
      formData.append(key, datas[key])
    })
    try {
      await handleBenificiary(formData)
      fetchDatas()
      Swal.fire({
        title: "Success!",
        text: "Create successful",
        icon: "success",
        confirmButtonText: "OK",
      })
      setmodals(false)
    } catch (err) {
      console.log(err, "benificiary adding failed")
      Swal.fire({
        title: "Error!",
        text: "Creation failed. Don't use existing email or number",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }
  //benificiarys list
  const fetchDatas = async () => {
    try {
      const response = await fetchBenificiarys()
      setBenificiarys(response)
    } catch (error) {
      console.error("Error fetching benificiary details:", error)
    }
  }
  // filter benificiarys based on the selected charity

  const charitydetails = JSON.parse(localStorage.getItem("charitydetails"))
  const filteredBenificiarys = benificiarys.filter(
    benificiary => benificiary.charity_name === charitydetails.charity
  )
  //benificiary delete
  const deleteBenificiary = async id => {
    try {
      await benificiaryDelete(id)
      fetchDatas()
    } catch (err) {
      console.log(err, "delete failed")
    }
  }
  //benificiary edit
  const editBenificiary = async id => {
    try {
      const benificiaryDetails = await benificiaryEdit(id)
      setEditedId(id)
      setDatas({
        charity_name: benificiaryDetails.charity_name,
        email_id: benificiaryDetails.email_id,
        number: benificiaryDetails.number,
        nationality: benificiaryDetails.nationality,
        // Balance: benificiaryDetails.Balance,
        sex: benificiaryDetails.sex,
        health_status: benificiaryDetails.health_status,
        marital: benificiaryDetails.marital,
        // navision_linked_no: benificiaryDetails.navision_linked_no,
        physically_challenged: benificiaryDetails.physically_challenged,
        family_members: benificiaryDetails.family_members,
        account_status: benificiaryDetails.account_status,
        benificiary_name: benificiaryDetails.benificiary_name,
        category: benificiaryDetails.category,
        age: benificiaryDetails.age,
      })
    } catch (err) {
      console.log("an error occured", err)
    }
  }
  //handle benificiary update
  const handleBenificiaryUpdate = async e => {
    e.preventDefault()

    const errors = {}
    if(!datas.date) errors.date = "Date is required."
    if (!datas.benificiary_name) errors.benificiary_name = "Name is required."
    if (!datas.category) errors.category = "Category is required."
    if (!datas.age) errors.age = "Age is required."
    if (!datas.email_id) errors.email_id = "Email is required."
    if (!datas.number) errors.number = "Number is required."
    if (!datas.charity_name) errors.charity_name = "Charity Name is required."
    if (!datas.nationality) errors.nationality = "Nationality is required."
    if (!datas.sex) errors.sex = "Sex is required."
    if (!datas.health_status)
      errors.health_status = "Health Status is required."
    if (!datas.marital) errors.marital = "Marital Status is required."
    // if (!datas.navision_linked_no)
    //   errors.navision_linked_no = "Navision Number is required."
    if (!datas.physically_challenged)
      errors.physically_challenged = "Physically Challenged is required."
    if (!datas.family_members)
      errors.family_members = "Family Members is required."
    if (!datas.account_status)
      errors.account_status = "Account Status is required."
    // if (!datas.Balance) errors.Balance = "Balance is required."

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }
    const formData = new FormData()
    Object.keys(datas).forEach(key => {
      formData.append(key, datas[key])
    })
    try {
      await benificiaryUpdate(editedId, formData)
      fetchDatas()
      Swal.fire({
        title: "Success!",
        text: "Update successful",
        icon: "success",
        confirmButtonText: "OK",
      })
      setEdits(false)
    } catch (err) {
      console.error("Error updating benificiary:", err)
      Swal.fire({
        title: "Error!",
        text: "Update failed. Don't use existing email or phone number",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }
  //benificiary details and transactions
  const handleShow = _id => {
    navigate(`/beneficiariesdetails/${_id}`)
  }
  //search
  const filteredBen = filteredBenificiarys.filter(ben => 
    ben?.benificiary_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ben?.benificiary_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const handleExport = async () => {
    try {
      // Only export beneficiaries for the current charity
      const exportData = filteredBenificiarys.map(ben => ({
        benificiary_name: ben.benificiary_name,
        benificiary_id: ben.benificiary_id,
        number: ben.number,
        email_id: ben.email_id,
        charity_name: ben.charity_name,
        nationality: ben.nationality,
        sex: ben.sex,
        health_status: ben.health_status,
        marital: ben.marital,
        physically_challenged: ben.physically_challenged,
        family_members: ben.family_members,
        account_status: ben.account_status,
        date: ben.date,
        category: ben.category,
        age: ben.age,
        Balance: ben.Balance || 0
      }));

      // Create and download CSV
      const headers = Object.keys(exportData[0]).join(',');
      const csv = [
        headers,
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beneficiaries_${charitydetails.charity}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.fire({
        title: "Success!",
        text: "Beneficiaries exported successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Export failed:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to export beneficiaries",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const toggleImportModal = () => setImportModalOpen(!importModalOpen);
  return (
    <div>
      <Navbar />
      <Row>
        <Col>
          <Card className="container">
            <CardBody>
              <CardTitle className="p" style={{ color: "gray" }}>
                <Card>
                  <CardBody>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      BENIFICIARIES
                      <Input
                type="text"
                placeholder="Search Benificiaries..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  marginInline:"40px",
                }}
              />
                      <Button
                        style={{
                          marginLeft: "auto",
                          backgroundColor: "var(--bs-primary)",
                          border: "none",
                        }}
                        onClick={() => {
                          setmodals(!modals)
                        }}
                      >
                        <Link>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            class="bi bi-plus-circle-dotted"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                          </svg>
                        </Link>{" "}
                        ADD NEW BENEFICIARY{" "}
                      </Button>
                      <Button 
                        className="btn btn-primary ms-2"
                        onClick={handleExport}
                      >
                        EXPORT BENEFICIARY
                      </Button>
                      <Button onClick={toggleImportModal}>
  IMPORT BENEFICIARY
</Button>                 </div>

                    <Modal
                      size="lg"
                      isOpen={modals}
                      toggle={() => {
                        setmodals(!modals)
                      }}
                    >
                      <ModalHeader
                        toggle={() => {
                          setmodals(!modals)
                        }}
                      >
                        Create New Benificiary
                      </ModalHeader>
                      <ModalBody>
                        <form>
                          <Row>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="name">Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="benificiary_name"
                                  placeholder="Enter Name"
                                  value={datas.benificiary_name}
                                  onChange={handleChanges}
                                />
                                {validationErrors.benificiary_name && (
                                  <small className="text-danger">
                                    {validationErrors.benificiary_name}
                                  </small>
                                )}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  name="email_id"
                                  placeholder="Enter Email"
                                  value={datas.email_id}
                                  onChange={handleChanges}
                                />
                                {validationErrors.email_id && (
                                  <small className="text-danger">
                                    {validationErrors.email_id}
                                  </small>
                                )}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="phone">Phone</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="number"
                                  placeholder="Enter Phone No."
                                  value={datas.number}
                                  onChange={handleChanges}
                                />
                                {validationErrors.number && (
                                  <small className="text-danger">
                                    {validationErrors.number}
                                  </small>
                                )}
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="charity">Charity</label>
                                <select
                                  value={datas.charity_name}
                                  onChange={handleChanges}
                                  name="charity_name"
                                  className="form-control"
                                >
                                  <option>select charity</option>

                                  <option>{charitydetails.charity}</option>
                                </select>
                                {validationErrors.charity_name && (
                                  <small className="text-danger">
                                    {validationErrors.charity_name}
                                  </small>
                                )}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="nationality">Nationality</label>
                                <input
                                  className="form-control"
                                  name="nationality"
                                  value={datas.nationality}
                                  onChange={handleChanges}
                                  placeholder="Enter Nationality"
                                  type="text"
                                />
                                {validationErrors.nationality && (
                                  <small className="text-danger">
                                    {validationErrors.nationality}
                                  </small>
                                )}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="sex">Sex</label>
                                <select
                                  className="form-control"
                                  name="sex"
                                  value={datas.sex}
                                  onChange={handleChanges}
                                >
                                  <option>select sex</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                                {validationErrors.sex && (
                                  <small className="text-danger">
                                    {validationErrors.sex}
                                  </small>
                                )}
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="physically_challenged">
                                  Physically Challenged
                                </label>
                                <select
                                  className="form-control"
                                  name="physically_challenged"
                                  value={datas.physically_challenged}
                                  onChange={handleChanges}
                                >
                                  <option> physically challenged</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                                {validationErrors.physically_challenged && (
                                  <small className="text-danger">
                                    {validationErrors.physically_challenged}
                                  </small>
                                )}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="family_members">
                                  Family Members
                                </label>
                                <input
                                  className="form-control"
                                  name="family_members"
                                  value={datas.family_members}
                                  onChange={handleChanges}
                                  placeholder="Family Members"
                                  type="number"
                                />
                                {validationErrors.family_members && (
                                  <small className="text-danger">
                                    {validationErrors.family_members}
                                  </small>
                                )}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="account_status">
                                  Account Status
                                </label>
                                <select
                                  className="form-control"
                                  name="account_status"
                                  value={datas.account_status}
                                  onChange={handleChanges}
                                >
                                  <option>select account_status</option>
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                </select>
                                {validationErrors.account_status && (
                                  <small className="text-danger">
                                    {validationErrors.account_status}
                                  </small>
                                )}
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="category"> Category </label>
                                <input
                                  className="form-control"
                                  name="category"
                                  value={datas.category}
                                  onChange={handleChanges}
                                  placeholder="Ctegory"
                                  type="text"
                                />
                                {validationErrors.category && (
                                  <small className="text-danger">
                                    {validationErrors.category}
                                  </small>
                                )}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="age">Age</label>
                                <input
                                  className="form-control"
                                  name="age"
                                  value={datas.age}
                                  onChange={handleChanges}
                                  placeholder="Age"
                                  type="number"
                                />
                                {validationErrors.age && (
                                  <small className="text-danger">
                                    {validationErrors.age}
                                  </small>
                                )}
                              </div>
                            </Col>
                            
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="marital">Marital</label>
                                <select
                                  className="form-control"
                                  name="marital"
                                  value={datas.marital}
                                  onChange={handleChanges}
                                >
                                  <option>select marital</option>
                                  <option value="married">Married</option>
                                  <option value="single">Single</option>
                                </select>
                                {validationErrors.marital && (
                                  <small className="text-danger">
                                    {validationErrors.marital}
                                  </small>
                                )}
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="health status">
                                  Health status
                                </label>
                                <input
                                  className="form-control"
                                  name="health_status"
                                  value={datas.health_status}
                                  onChange={handleChanges}
                                  placeholder="Health status"
                                  type="text"
                                />
                                {validationErrors.health_status && (
                                  <small className="text-danger">
                                    {validationErrors.health_status}
                                  </small>
                                )}
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="Date">Date</label>
                                <input
                                  className="form-control"
                                  name="date"
                                  value={datas.date}
                                  onChange={handleChanges}
                                  placeholder="Date"
                                  type="date"
                                />
                                {validationErrors.date && (
                                  <small className="text-danger">
                                    {validationErrors.date}
                                  </small>
                                )}
                              </div>
                            </Col>
                           </Row>
                          <Row>
                            <Col lg={12}>
                              <div className="text-right">
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  onClick={benificiaryCreate}
                                >
                                  save
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </form>
                      </ModalBody>
                    </Modal>
                  </CardBody>
                </Card>
              </CardTitle>

              <div className="table-responsive">
                <Table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Id</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Nationality</th>
                      <th>Sex</th>
                      <th>Balance</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBen.map(benificiary => (
                      <tr className="table-light">
                        <td>{benificiary.benificiary_name}</td>
                        <td>{benificiary.benificiary_id}</td>
                        <td>{benificiary.number}</td>
                        <td>{benificiary.email_id}</td>
                        <td>{benificiary.nationality}</td>
                        <td>{benificiary.sex}</td>
                        <td>{benificiary.Balance || 0}</td>
                        <td
                          style={{
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                            onClick={() => handleShow(benificiary._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              color="black"
                              class="bi bi-eye"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                          </Button>
                          <div
                            onClick={() => {
                              setEdits(!edits)
                            }}
                          >
                            <Button
                              onClick={() => editBenificiary(benificiary._id)}
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                color="black"
                                class="bi bi-pencil"
                                viewBox="0 0 16 16"
                              >
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                              </svg>
                            </Button>
                          </div>

                          <Modal
                            size="lg"
                            isOpen={edits}
                            toggle={() => {
                              setEdits(!edits)
                            }}
                          >
                            <ModalHeader
                              toggle={() => {
                                setEdits(!edits)
                              }}
                            >
                              Edit Beneficiary
                            </ModalHeader>

                            <ModalBody>
                              <form>
                                <Row>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="name">Name</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="benificiary_name"
                                        placeholder="Enter Name"
                                        value={datas.benificiary_name}
                                        onChange={handleChanges}
                                      />
                                      {validationErrors.benificiary_name && (
                                        <small className="text-danger">
                                          {validationErrors.benificiary_name}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="email">Email</label>
                                      <input
                                        type="email"
                                        className="form-control"
                                        name="email_id"
                                        placeholder="Enter Email"
                                        value={datas.email_id}
                                        onChange={handleChanges}
                                      />
                                      {validationErrors.email_id && (
                                        <small className="text-danger">
                                          {validationErrors.email_id}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="phone">Phone</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        name="number"
                                        placeholder="Enter Phone No."
                                        value={datas.number}
                                        onChange={handleChanges}
                                      />
                                      {validationErrors.number && (
                                        <small className="text-danger">
                                          {validationErrors.number}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="charity">Charity</label>
                                      <select
                                        value={datas.charity_name}
                                        onChange={handleChanges}
                                        name="charity_name"
                                        className="form-control"
                                      >
                                        <option>select charity</option>
                                        <option>
                                          {charitydetails.charity}
                                        </option>
                                      </select>
                                      {validationErrors.charity_name && (
                                        <small className="text-danger">
                                          {validationErrors.charity_name}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="nationality">
                                        Nationality
                                      </label>
                                      <input
                                        className="form-control"
                                        name="nationality"
                                        value={datas.nationality}
                                        onChange={handleChanges}
                                        placeholder="Enter Nationality"
                                        type="text"
                                      />
                                      {validationErrors.nationality && (
                                        <small className="text-danger">
                                          {validationErrors.nationality}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="sex">Sex</label>
                                      <select
                                        className="form-control"
                                        name="sex"
                                        value={datas.sex}
                                        onChange={handleChanges}
                                      >
                                        <option>select sex</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                      </select>
                                      {validationErrors.sex && (
                                        <small className="text-danger">
                                          {validationErrors.sex}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="physically_challenged">
                                        Physically Challenged
                                      </label>
                                      <select
                                        className="form-control"
                                        name="physically_challenged"
                                        value={datas.physically_challenged}
                                        onChange={handleChanges}
                                      >
                                        <option> physically challenged</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                      </select>
                                      {validationErrors.physically_challenged && (
                                        <small className="text-danger">
                                          {
                                            validationErrors.physically_challenged
                                          }
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="family_members">
                                        Family Members
                                      </label>
                                      <input
                                        className="form-control"
                                        name="family_members"
                                        value={datas.family_members}
                                        onChange={handleChanges}
                                        placeholder="Family Members"
                                        type="number"
                                      />
                                      {validationErrors.family_members && (
                                        <small className="text-danger">
                                          {validationErrors.family_members}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="account_status">
                                        Account Status
                                      </label>
                                      <select
                                        className="form-control"
                                        name="account_status"
                                        value={datas.account_status}
                                        onChange={handleChanges}
                                      >
                                        <option>select account_status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                          Inactive
                                        </option>
                                      </select>
                                      {validationErrors.account_status && (
                                        <small className="text-danger">
                                          {validationErrors.account_status}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="category">
                                        {" "}
                                        Category
                                      </label>
                                      <input
                                        className="form-control"
                                        name="category"
                                        value={datas.category}
                                        onChange={handleChanges}
                                        placeholder="Category"
                                        type="text"
                                      />
                                      {validationErrors.category && (
                                        <small className="text-danger">
                                          {validationErrors.category}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="age">Age</label>
                                      <input
                                        className="form-control"
                                        name="age"
                                        value={datas.age}
                                        onChange={handleChanges}
                                        placeholder="Age"
                                        type="number"
                                      />
                                      {validationErrors.age && (
                                        <small className="text-danger">
                                          {validationErrors.age}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="marital">Marital</label>
                                      <select
                                        className="form-control"
                                        name="marital"
                                        value={datas.marital}
                                        onChange={handleChanges}
                                      >
                                        <option>select marital</option>
                                        <option value="married">Married</option>
                                        <option value="single">Single</option>
                                      </select>
                                      {validationErrors.marital && (
                                        <small className="text-danger">
                                          {validationErrors.marital}
                                        </small>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <label htmlFor="health status">
                                        Health status
                                      </label>
                                      <input
                                        className="form-control"
                                        name="health_status"
                                        value={datas.health_status}
                                        onChange={handleChanges}
                                        placeholder="Health status"
                                        type="text"
                                      />
                                      {validationErrors.health_status && (
                                        <small className="text-danger">
                                          {validationErrors.health_status}
                                        </small>
                                      )}
                                    </div>
                                  </Col>

                                  <Col lg={4}>
                              <div className="mb-3">
                                <label htmlFor="Date">Date</label>
                                <input
                                  className="form-control"
                                  name="date"
                                  value={datas.date}
                                  onChange={handleChanges}
                                  placeholder="Date"
                                  type="date"
                                />
                                {validationErrors.date && (
                                  <small className="text-danger">
                                    {validationErrors.date}
                                  </small>
                                )}
                              </div>
                            </Col>
                                </Row>

                                <Row>
                                  <Col lg={12}>
                                    <div className="text-right">
                                      <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={handleBenificiaryUpdate}
                                      >
                                        Update
                                      </button>
                                    </div>
                                  </Col>
                                </Row>
                              </form>
                            </ModalBody>
                          </Modal>
                          <Button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                            onClick={() => deleteBenificiary(benificiary._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              color="black"
                              class="bi bi-trash"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ImportBeneficiaryModal 
  isOpen={importModalOpen}
  toggle={toggleImportModal}
  onImportSuccess={fetchDatas}
/>
    </div>
  )
}

export default Beneficiary
