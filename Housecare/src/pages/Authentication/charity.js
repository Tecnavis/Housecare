import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import GoogleSheetsImport from "./googlesheet"
import Swal from "sweetalert2"
import PasswordUpdateModal from "./passwordmodal"
import {
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
} from "reactstrap"
import {
  fetchCharity,
  handleCharity,
  charityDelete,
  charityEdit,
  charityUpdate,
  BASE_URL,
} from "./handle-api"

import { useForm } from "helpers/useForms"

function Charity() {
  const IMAGE = "https://cdn-icons-png.flaticon.com/512/2922/2922510.png";
  const [modal, setmodal] = useState(false)
  const [charity1, setCharity1] = useState([])
  const [searchTerm, setSearchTerm] = useState("") // New state for search input
  const [image, setImage] = useState("")
  const [editId, setEditId] = useState(null)
  const [importModal, setImportModal] = useState(false)
  const [modal_center, setmodal_center] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false);
  const [values, handleChange, setValues] = useForm({
    charity: "",
    email: "",
    date: "",
    arbic: "",
    prifix: "",
    CR_NO: "",
    roles: "",
    VAT_REG_NO: "",
    authorizedperson: "",
    password: "",
    phone: "",
  })

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function tog_center() {
    setmodal_center(!modal_center)
    removeBodyCss()
  }
  useEffect(() => {
    loadData()
  }, [])

  //fetch charity organaization deatils
  const loadData = async () => {
    try {
      const response = await fetchCharity()
      setCharity1(response)
    } catch (err) {
      console.log(err)
    }
  }
  //password strong
  const [passwordError, setPasswordError] = useState("")
  const validatePassword = password => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.")
      return false
    } else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setPasswordError("Password must contain both letters and numbers.")
      return false
    } else {
      setPasswordError("")
      return true
    }
  }
  //handle charity organaization Add
  const [validationErrors, setValidationErrors] = useState({})
  const charityCreate = async e => {
    e.preventDefault()
    const errors = {}
    if (!values.phone) errors.phone = "Phone Number is required."
    if (!values.authorizedperson)
      errors.authorizedperson = "Authorized person is required."
    if (!values.charity) errors.charity = "Charity name is required."
    if (!values.email) errors.email = "Email is required."
    if (!values.password) errors.password = "Password is required."
    if (!values.date) errors.date = "Date is required."
    if (!values.arbic) errors.arbic = "Arbic name is required."
    if (!values.CR_NO) errors.CR_NO = "CR_NO is required."
    if (!values.roles) errors.roles = "Roles is required."
    if (!values.VAT_REG_NO) errors.VAT_REG_NO = "VAT_REG_NO is required."
    if (!values.prifix) errors.prifix = "Prifix is required."

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }
    if (!validatePassword(values.password)) {
      return
    }
    const formData = new FormData()
    formData.append("charity", values.charity)
    formData.append("email", values.email)
    formData.append("date", values.date)
    formData.append("arbic", values.arbic)
    formData.append("CR_NO", values.CR_NO)
    formData.append("roles", values.roles)
    formData.append("VAT_REG_NO", values.VAT_REG_NO)
    formData.append("phone", values.phone)
    formData.append("authorizedperson", values.authorizedperson)
    formData.append("password", values.password)
    formData.append("prifix", values.prifix)
    formData.append("image", image)
    try {
      await handleCharity(formData)
      await Swal.fire({
        title: "Success!",
        text: "Charity organization created successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      })
      setmodal(!modal)
      loadData()
    } catch (err) {
      await Swal.fire({
        title: "Error!",
        text: "Failed to create charity. Email or Phone number already exists.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      })
      console.log(err, "Charity organaization adding failed")
    }
  }

  //Charity organaization Delete
  const handleDelete = async id => {
    try {
      await charityDelete(id)
      loadData()
    } catch (err) {
      console.log(err, "delete failed")
    }
  }

  //handle edit
  const handleEdit = async id => {
    try {
      const charityDetails = await charityEdit(id)
      setEditId(id)
      const formattedDate = charityDetails.date
        ? new Date(charityDetails.date).toISOString().split("T")[0]
        : ""

      setValues({
        ...charityDetails,
        date: formattedDate,
        image: charityDetails.image?.includes("http")
          ? charityDetails.image
          : `${BASE_URL}/upload/${charityDetails.image}`,
      })

      setmodal_center(true)
    } catch (err) {
      console.log(err, "an error occurred in fetching charity details")
    }
  }

  //handle update charity
  const handleUpdate = async e => {
    e.preventDefault()
    const errors = {}
    if (!values.phone) errors.phone = "Phone Number is required."
    if (!values.authorizedperson)
      errors.authorizedperson = "Authorized person is required."
    if (!values.charity) errors.charity = "Charity name is required."
    if (!values.email) errors.email = "Email is required."
    // if (!values.password) errors.password = "Password is required."
    if (!values.date) errors.date = "Date is required."
    if (!values.arbic) errors.arbic = "Arbic name is required."
    if (!values.CR_NO) errors.CR_NO = "CR_NO is required."
    if (!values.roles) errors.roles = "Roles is required."
    if (!values.VAT_REG_NO) errors.VAT_REG_NO = "VAT_REG_NO is required."
    if (!values.prifix) errors.prifix = "Prifix is required."

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }
    const formData = new FormData()
    formData.append("email", values.email)
    formData.append("date", values.date)
    formData.append("CR_NO", values.CR_NO)
    formData.append("roles", values.roles)
    formData.append("VAT_REG_NO", values.VAT_REG_NO)
    formData.append("arbic", values.arbic)
    formData.append("phone", values.phone)
    formData.append("authorizedperson", values.authorizedperson)
    formData.append("charity", values.charity)
    formData.append("prifix", values.prifix)

    if (image) {
      formData.append("image", image)
    }

    try {
      await charityUpdate(editId, formData)
      await Swal.fire({
        title: "Success!",
        text: "Update successful",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      })
      loadData()
      setmodal_center(false)
    } catch (err) {
      console.error("Error updating charity:", err)
      await Swal.fire({
        title: "Error!",
        text: "Update failed.Email or Phone number already exists.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      })
    }
  }
  //image handle
  const handleImage = e => {
    const selectedImage = e.target.files[0]
    setImage(selectedImage)
  }
  //charity details
  const handleView = charity => {
    window.location.href = `charitydetails/${charity}`
  }
  const handleHistory = charity => {
    localStorage.setItem("charityname", JSON.stringify(charity))
    window.location.href = `datesplits/${charity}`
  }
  // Filter charity based on the search term
  const filteredCharity = charity1.filter(
    charitys =>
      charitys.charity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charitys.authorizedperson.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <React.Fragment>
      <div style={{ textAlign: "center" }}>
        <Card>
          <CardBody>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                flexWrap: "nowrap",
                gap: "20px",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <h4 className="card-title mb-3">Charity Organization</h4>

              {/* Search Bar */}
              <Input
                type="text"
                placeholder="Search Charity..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                }}
              />
              <button
                className="btn btn-primary"
                onClick={() => setImportModal(true)}
              >
                Import Charity
              </button>
              <Link
                onClick={() => {
                  setmodal(!modal)
                }}
                to="#"
                className="popup-form btn btn-primary"
                style={{ marginLeft: "auto" }}
              >
                <svg
                  style={{ marginInline: "5px" }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  color="white"
                  class="bi bi-plus-circle-dotted"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg>
                ADD NEW CHARITY
              </Link>
              {/* </Button> */}
            </div>

            <Modal
              size="lg"
              isOpen={modal}
              toggle={() => {
                setmodal(!modal)
              }}
            >
              <ModalHeader
                toggle={() => {
                  setmodal(!modal)
                }}
              >
                New Charity organaization
              </ModalHeader>
              <ModalBody>
                <form>
                  <Row>
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="name">Charity</label>
                        <input
                          type="text"
                          className="form-control"
                          name="charity"
                          value={values.charity}
                          onChange={handleChange}
                          placeholder="Charity Organaization"
                        />
                        {validationErrors.charity && (
                          <small className="text-danger">
                            {validationErrors.charity}
                          </small>
                        )}
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="name">اسم الجمعية الخيرية</label>
                        <input
                          type="text"
                          className="form-control"
                          name="arbic"
                          value={values.arbic}
                          onChange={handleChange}
                          placeholder="اسم الجمعية الخيرية"
                        />
                        {validationErrors.arbic && (
                          <small className="text-danger">
                            {validationErrors.arbic}
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
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          placeholder="Enter Email"
                        />
                        {validationErrors.email && (
                          <small className="text-danger">
                            {validationErrors.email}
                          </small>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="CR_NO">CR_NO</label>
                        <input
                          type="text"
                          className="form-control"
                          name="CR_NO"
                          value={values.CR_NO}
                          onChange={handleChange}
                          placeholder="CR_NO"
                        />
                        {validationErrors.CR_NO && (
                          <small className="text-danger">
                            {validationErrors.CR_NO}
                          </small>
                        )}
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="VAT_REG_NO">VAT_REG_NO</label>
                        <input
                          type="text"
                          className="form-control"
                          name="VAT_REG_NO"
                          value={values.VAT_REG_NO}
                          onChange={handleChange}
                          placeholder="VAT_REG_NO"
                        />
                        {validationErrors.VAT_REG_NO && (
                          <small className="text-danger">
                            {validationErrors.VAT_REG_NO}
                          </small>
                        )}
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="Phone">Phone</label>
                        <input
                          type="number"
                          className="form-control"
                          name="phone"
                          value={values.phone}
                          onChange={handleChange}
                          placeholder="Phone No"
                        />
                        {validationErrors.phone && (
                          <small className="text-danger">
                            {validationErrors.phone}
                          </small>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="Role">Role</label>
                        <select
                          className="form-control"
                          name="roles"
                          value={values.roles}
                          onChange={handleChange}
                        >
                          <option>Select Role</option>
                          <option>Main_Admin</option>
                          {/* <option>DATA_ENTRY</option>
                          <option>DATA_VERIFY</option> */}
                        </select>
                        {validationErrors.roles && (
                          <small className="text-danger">
                            {validationErrors.roles}
                          </small>
                        )}
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="Authorizedperson">
                          Authorizedperson
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="authorizedperson"
                          value={values.authorizedperson}
                          onChange={handleChange}
                          placeholder="Authorizedperson"
                        />
                        {validationErrors.authorizedperson && (
                          <small className="text-danger">
                            {validationErrors.authorizedperson}
                          </small>
                        )}
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="date">Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="date"
                          value={values.date}
                          onChange={handleChange}
                          placeholder="Date"
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
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                          className="form-control"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Password"
                        />
                        {validationErrors.password && (
                          <small className="text-danger">
                            {validationErrors.password}
                          </small>
                        )}
                        {passwordError && (
                          <small className="text-danger">{passwordError}</small>
                        )}
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="image">Image</label>
                        <input
                          className="form-control"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImage}
                        />
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <label htmlFor="status">Prifix</label>
                        <input
                          className="form-control"
                          name="prifix"
                          type="name"
                          value={values.prifix}
                          onChange={handleChange}
                          placeholder="prifix"
                        ></input>
                        {validationErrors.prifix && (
                          <small className="text-danger">
                            {validationErrors.prifix}
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
                          onClick={charityCreate}
                        >
                          ADD
                        </button>
                      </div>
                    </Col>
                  </Row>
                </form>
              </ModalBody>
            </Modal>
          </CardBody>
        </Card>
      </div>
      <Card>
        <CardBody>
          {/* <h4 className="card-title mb-3">Charity Organaization</h4> */}
          <Row style={{ display: "flex" }}>
            {filteredCharity.map(details => (
              <Col lg={6}>
                <Card lg={6}>
                  <div className="inbox-wid" col={6}>
                    <Link to="#" className="text-dark">
                      <div
                        className="inbox-item"
                        style={{ paddingInline: "10px" }}
                      >
                        <div className="inbox-item-img float-start me-4">
                          <img
                           src={
                            details.image && details.image.includes("http")
                              ? details.image
                              : details.image
                              ? `${BASE_URL}/upload/${details.image}`
                              : IMAGE
                          }
                            className="avatar-md rounded-circle"
                            alt="Charity"
                          />
                        </div>

                        <div>
                          <h6 className="inbox-item-author mb-1 font-size-16">
                            {details.authorizedperson}
                          </h6>
                          <p className="inbox-item-text text-muted mb-0">
                            {details.arbic}
                            <br />
                            {details.charity}
                          </p>
                        </div>
                        <br />
                        <br />
                        <Col
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            alignContent: "flex-end",
                          }}
                        >
                          <div>
                            <Button
                              type="button"
                              className="btn btn-primary waves-effect waves-light"
                              data-toggle="modal"
                              data-target=".bs-example-modal-center"
                              style={{
                                backgroundColor: "transparent",
                                borderColor: "black",
                                color: "black",
                                padding: "8px 16px",
                              }}
                              onClick={() => handleEdit(details._id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="16"
                                color="black"
                                class="bi bi-pencil"
                                viewBox="0 0 16 16"
                              >
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                              </svg>{" "}
                              Edit
                            </Button>
                          </div>

                          <Button
                            style={{
                              backgroundColor: "transparent",
                              borderColor: "black",
                              color: "black",
                              padding: "8px 16px",
                              // width:"100px",
                              marginInline: "5px",
                            }}
                            onClick={() => handleView(details.charity)}
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
                            </svg>{" "}
                            View
                          </Button>

                          <Button
                            onClick={() => handleHistory(details.charity)}
                            style={{
                              backgroundColor: "transparent",
                              borderColor: "black",
                              color: "black",
                              padding: "8px 16px",
                              // width:"100px",
                              marginInline: "5px",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              color="black"
                              class="bi bi-clipboard-data"
                              viewBox="0 0 16 16"
                            >
                              <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z" />
                              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                            </svg>{" "}
                            Split
                          </Button>
                          <Button
                            onClick={() => handleDelete(details._id)}
                            style={{
                              backgroundColor: "transparent",
                              borderColor: "black",
                              color: "black",
                              padding: "8px 16px",
                              // width:"100px",
                              marginInline: "5px",
                            }}
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
                            </svg>{" "}
                            Delete
                          </Button>
                        </Col>
                        <br />
                        <br />
                        {/* </div> */}
                      </div>
                    </Link>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>

      <Modal
        isOpen={modal_center}
        toggle={() => {
          tog_center()
        }}
        centered={true}
        size="lg"
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Edit Charity Organaization </h5>
          <button
            type="button"
            onClick={() => {
              setmodal_center(false)
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="authorizedperson">Authorizedperson</label>
                <input
                  type="text"
                  className="form-control"
                  name="authorizedperson"
                  value={values.authorizedperson}
                  onChange={handleChange}
                  placeholder="Authorizedperson"
                />
                {validationErrors.authorizedperson && (
                  <small className="text-danger">
                    {validationErrors.authorizedperson}
                  </small>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="Role">Role</label>
                <select
                  className="form-control"
                  name="roles"
                  value={values.roles}
                  onChange={handleChange}
                >
                  <option>Role</option>
                  <option>Main_Admin</option>
                  <option>DATA_ENTRY</option>
                  <option>DATA_VERIFY</option>
                </select>
                {validationErrors.roles && (
                  <small className="text-danger">
                    {validationErrors.roles}
                  </small>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="name">Charity</label>
                <input
                  type="text"
                  className="form-control"
                  name="charity"
                  value={values.charity}
                  onChange={handleChange}
                  placeholder="Charity Organaization"
                />
                {validationErrors.charity && (
                  <small className="text-danger">
                    {validationErrors.charity}
                  </small>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="name">اسم الجمعية الخيرية</label>
                <input
                  type="text"
                  className="form-control"
                  name="arbic"
                  value={values.arbic}
                  onChange={handleChange}
                  placeholder="اسم الجمعية الخيرية"
                />
                {validationErrors.arbic && (
                  <small className="text-danger">
                    {validationErrors.arbic}
                  </small>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                />
                {validationErrors.email && (
                  <small className="text-danger">
                    {validationErrors.email}
                  </small>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="Phone">Phone No</label>
                <input
                  type="number"
                  className="form-control"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="Phone No"
                />
                {validationErrors.phone && (
                  <small className="text-danger">
                    {validationErrors.phone}
                  </small>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="VAT_REG_NO">VAT_REG_NO</label>
                <input
                  type="text"
                  className="form-control"
                  name="VAT_REG_NO"
                  value={values.VAT_REG_NO}
                  onChange={handleChange}
                  placeholder="VAT_REG_NO"
                />
                {validationErrors.VAT_REG_NO && (
                  <small className="text-danger">
                    {validationErrors.VAT_REG_NO}
                  </small>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="CR_NO">CR_NO</label>
                <input
                  type="text"
                  className="form-control"
                  name="CR_NO"
                  value={values.CR_NO}
                  onChange={handleChange}
                  placeholder="CR_NO"
                />
                {validationErrors.CR_NO && (
                  <small className="text-danger">
                    {validationErrors.CR_NO}
                  </small>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                />
                {validationErrors.date && (
                  <small className="text-danger">{validationErrors.date}</small>
                )}
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleImage} // Ensure handleImage is called
                />
                {values.image && (
                  <img
                    src={values.image || ""}
                    alt="Img"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <div className="mb-3">
                <label htmlFor="prifix">Prifix</label>

                <input
                  type="text"
                  className="form-control"
                  name="prifix"
                  value={values.prifix}
                  onChange={handleChange}
                  placeholder="Prifix"
                />
                {validationErrors.prifix && (
                  <small className="text-danger">
                    {validationErrors.prifix}
                  </small>
                )}
              </div>
            </Col>
          </Row>
          <br />
          <Button onClick={handleUpdate} style={{ marginRight: "5px" }}>
            Update
          </Button>
          <Button onClick={() => setPasswordModal(true)}>Password Change</Button>
        </div>
      </Modal>

<PasswordUpdateModal 
    charityId={values._id} 
    isOpen={passwordModal} 
    toggle={() => setPasswordModal(!passwordModal)} 
/>
      <GoogleSheetsImport
        isOpen={importModal}
        toggle={() => setImportModal(false)}
        onImportSuccess={data => {
          // Handle the imported data here
          loadData() // Refresh the charity list
        }}
      />
    </React.Fragment>
  )
}

export default Charity
