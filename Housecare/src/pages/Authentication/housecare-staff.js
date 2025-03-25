import React, { useEffect, useState } from "react"
import {
  Table,
  Card,
  CardBody,
  Button,
  Col,
  Row,
  ModalBody,
  Modal,
  ModalHeader,
  Input,
} from "reactstrap"
import Swal from "sweetalert2"
import {
  fetchStaff,
  deleteStaff,
  staffEdit,
  staffUpdate,
  toggleBlockStaff,
} from "./handle-api"
import { Link } from "react-router-dom"
import { useForm } from "helpers/useForms"
import { BASE_URL } from "./handle-api"

function Staff() {
  const IMAGE = "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
  // const isSuperadmin = !!localStorage.getItem("HomecareAdmin")
  const isRoleStaff = () => {
    const HomecareAdmin = JSON.parse(localStorage.getItem("HomecareAdmin"))
    return HomecareAdmin && HomecareAdmin.role === "staff" // Return true if role is 'staff'
  }
  const [modal, setModal] = useState(false)
  const [staff, setStaff] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [validationErrors, setValidationErrors] = useState({})
  const [values, handleChange, setValues] = useForm({
    staff: "",
    email: "",
    password: "",
    iqama: "",
    phone: "",
    role: "",
  })
  const [image, setImage] = useState("")
  const [editId, setEditId] = useState(null)

  const toggleModal = () => setModal(!modal)

  const handleImage = e => {
    const selectedImage = e.target.files[0]
    setImage(selectedImage)
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const staffData = await fetchStaff()
      setStaff(staffData)
    } catch (err) {
      console.error(err)
    }
  }
  //staff delete
  const handleDelete = async id => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    })

    if (isConfirmed) {
      try {
        await deleteStaff(id)
        loadData()
        await Swal.fire({
          title: "Deleted!",
          text: "The product has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        })
      } catch (err) {
        console.error("Error deleting staff:", err)
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete the product. Please try again.",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        })
      }
    }
  }

  //password validation
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

  //staff editing By Id
  const handleEdit = async id => {
    try {
      const staffData = await staffEdit(id)
      setValues({
        staff: staffData.staff,
        email: staffData.email,
        role: staffData.role,
        iqama: staffData.iqama,
        phone: staffData.phone,
        password: staffData.password,
      })
      setImage(staffData.image)
      setEditId(id)
      toggleModal()
    } catch (err) {
      console.log(err, "staff fetching error")
    }
  }
  //staff update

  const handleUpdate = async e => {
    e.preventDefault()
    // Validate all fields
    const errors = {}
    if (!values.staff) errors.staff = "Staff name is required."
    if (!values.email) errors.email = "Email is required."
    // if (!values.password) errors.password = "Password is required."
    if (!values.role) errors.role = "Role is required."
    if (!values.iqama) errors.iqama = "Iqama No is required."
    if (!values.phone) errors.phone = "Phone Number is required."

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }
    if (!validatePassword(values.password)) {
      return
    }
    const formData = new FormData()
    formData.append("staff", values.staff)
    formData.append("email", values.email)
    formData.append("role", values.role)
    formData.append("iqama", values.iqama)
    formData.append("phone", values.phone)
    // formData.append("password", values.password)

    if (image) {
      formData.append("image", image)
    }

    try {
      await staffUpdate(editId, formData)
      toggleModal()
      loadData()
      await Swal.fire({
        title: "Success!",
        text: "Update successful",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      })
    } catch (err) {
      console.error("Error updating staff:", err)
      await Swal.fire({
        title: "Error!",
        text: "Update failed. Email or Phone number already exists.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      })
    }
  }
  //handlecreatestaff
  const createStaffs = () => {
    window.location.href = "/register"
  }
  //revok staff

  const handleBlock = async (id, currentStatus) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${currentStatus ? "unblock" : "block"} this staff?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${currentStatus ? "unblock" : "block"} it!`,
      cancelButtonText: "Cancel",
    })

    if (isConfirmed) {
      try {
        const updatedStaff = await toggleBlockStaff(id)
        console.log(updatedStaff)

        setStaff(prevStaff =>
          prevStaff.map(s =>
            s._id === id ? { ...s, isBlocked: !currentStatus } : s
          )
        )

        await Swal.fire({
          title: "Success!",
          text: `Staff ${currentStatus ? "unblocked" : "blocked"} successfully`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        })
      } catch (err) {
        console.error(
          `Error ${currentStatus ? "unblocking" : "blocking"} staff:`,
          err
        )

        await Swal.fire({
          title: "Error!",
          text: `Failed to ${
            currentStatus ? "unblock" : "block"
          } staff. Please try again.`,
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        })
      }
    }
  }

  //search staff
  const filteredStaff = staff.filter(staf =>
    staf?.staff?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <React.Fragment>
      <div style={{ textAlign: "center" }}>
        <Card>
          <CardBody>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                flexWrap: "nowrap",
                gap: "20px",
                justifyContent: "space-evenly",
                placeContent: "stretch space-evenly;",
              }}
            >
              <h4 className="card-title mb-3">Housecare staffs</h4>
              <Input
                type="text"
                placeholder="Search Staff..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                }}
              />
              <Button
                style={{
                  border: "none",
                  marginLeft: "auto",
                  backgroundColor: "var(--bs-primary)",
                }}
                onClick={createStaffs}
              >
                <svg
                  style={{ marginInline: "5px" }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  color="black"
                  class="bi bi-plus-circle-dotted"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg>{" "}
                ADD NEW STAFF
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      <Card>
        <CardBody>
          <div className="table-responsive">
            <Table className="align-middle table-centered table-vertical table-nowrap">
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <td>Staff</td>
                  <td>Email </td>
                  <td>Role </td>
                  <td>Phone </td>
                  <td>Iqama No</td>
                  <td style={{ textAlign: "center" }}>Action</td>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(staffs => (
                  <tr>
                    <td>
                      <img
                        src={
                          staffs.image
                            ? `${BASE_URL}/upload/${staffs.image}`
                            : IMAGE
                        }
                        alt={staffs.staff}
                        className="avatar-xs rounded-circle me-2"
                      />{" "}
                      {staffs.staff}
                    </td>
                    <td>{staffs.email}</td>
                    <td>{staffs.role}</td>
                    <td>{staffs.phone}</td>
                    <td>{staffs.iqama}</td>
                    <td style={{ justifyContent: "center", display: "flex" }}>
                      {/* <Card> */}
                      <div size="sm" style={{ paddingInline: "10px" }}>
                        <Link
                          onClick={() => {
                            if (isRoleStaff()) {
                              setModal(!modal)
                            }
                          }}
                        >
                          <Button
                            onClick={() => handleEdit(staffs._id)}
                            disabled={isRoleStaff()}
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
                        </Link>
                      </div>

                      <Button
                        color="dark"
                        size="sm"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                        className="waves-effect waves-light"
                        onClick={() => handleDelete(staffs._id)}
                        disabled={isRoleStaff()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          color="black"
                          class="bi bi-trash3"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                        </svg>
                      </Button>
                      <Button
                        style={{
                          paddingInline: "10px",
                          width: "75px",
                          backgroundColor: "transparent",
                          color: "black",
                        }}
                        className="waves-effect waves-light"
                        disabled={isRoleStaff()}
                        onClick={() =>
                          handleBlock(staffs._id, staffs.isBlocked)
                        }
                      >
                        {staffs.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Modal
            size="lg"
            isOpen={modal}
            toggle={() => {
              setModal(!modal)
            }}
          >
            <ModalHeader
              toggle={() => {
                setModal(!modal)
              }}
            >
              Edit Housecare staff Details
            </ModalHeader>
            <ModalBody>
              <form>
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="staff">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="staff"
                        placeholder="Enter Name"
                        value={values.staff}
                        onChange={handleChange}
                      />
                      {validationErrors.staff && (
                        <div className="text-danger">
                          {validationErrors.staff}
                        </div>
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
                        placeholder="Enter Email"
                        value={values.email}
                        onChange={handleChange}
                      />
                      {validationErrors.email && (
                        <div className="text-danger">
                          {validationErrors.email}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="iqama">Iqama No</label>
                      <input
                        className="form-control"
                        type="text"
                        name="iqama"
                        value={values.iqama}
                        onChange={handleChange}
                      />
                      {validationErrors.iqama && (
                        <div className="text-danger">
                          {validationErrors.iqama}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        className="form-control"
                        type="number"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                      />
                      {validationErrors.phone && (
                        <div className="text-danger">
                          {validationErrors.phone}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="role">Role</label>
                      <select
                        name="role"
                        id="role"
                        value={values.role}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {/* <option>select role</option> */}
                        <option value="staff">staff</option>
                        {/* <option value="company_admin">
                                      company_admin
                                    </option> */}
                      </select>
                      {validationErrors.role && (
                        <div className="text-danger">
                          {validationErrors.role}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="image">image</label>
                      <input
                        className="form-control"
                        type="file"
                        rows="3"
                        accept="image/*"
                        onChange={handleImage}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <div className="text-right">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                    </div>
                  </Col>
                </Row>
              </form>
            </ModalBody>
          </Modal>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default Staff
