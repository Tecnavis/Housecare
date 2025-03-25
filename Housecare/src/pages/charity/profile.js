import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Form,
} from "reactstrap"
import axios from "axios"
import { useParams } from "react-router-dom"
import { useForm } from "helpers/useForms"
import { BASE_URL } from "../Authentication/handle-api"
import Navbar from "./Navbars"

const Profile = () => {
  document.title = "Profile | Admin Profile"

  const [superadmin, setSuperAdmin] = useState(null)
  const { id } = useParams()
  const [values, handleChange, setValues] = useForm({
    charity: "",
    email: "",
    roles: "",
    date: "",
    phone: "",
    VAT_REG_NO: "",
    CR_NO: "",
    authorizedperson: "",
    arbic: "",
  })
  // const [image, setImage] = useState("")

  useEffect(() => {
    const storedSuperadmin = localStorage.getItem("charitydetails")
    if (storedSuperadmin) {
      const parsedSuperadmin = JSON.parse(storedSuperadmin)
      setSuperAdmin(parsedSuperadmin)
      setValues({
        charity: parsedSuperadmin.charity,
        email: parsedSuperadmin.email,
        roles: parsedSuperadmin.roles,
        date: parsedSuperadmin.date,
        phone: parsedSuperadmin.phone,
        VAT_REG_NO: parsedSuperadmin.VAT_REG_NO,
        CR_NO: parsedSuperadmin.CR_NO,
        authorizedperson: parsedSuperadmin.authorizedperson,
        arbic: parsedSuperadmin.arbic,
      })
      // setImage(`${BASE_URL}/${parsedSuperadmin.image}`)
    }
  }, [setValues])

  // const handleImage = e => {
  //   const selectedImage = e.target.files[0]
  //   if (selectedImage) {
  //     setImage(URL.createObjectURL(selectedImage))
  //     setValues(prevValues => ({
  //       ...prevValues,
  //       image: selectedImage,
  //     }))
  //   }
  // }

  useEffect(() => {
    if (!id) {
      console.error("Admin ID is undefined.")
      alert("Admin ID is missing.")
      return
    }

    //CHARITY DATA FETCHING
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      axios.defaults.headers.common["Authorization"] = token
      try {
        const response = await axios.get(`${BASE_URL}/charity/details/${id}`)
        const adminData = response.data

        setValues({
          charity: adminData.charity,
          email: adminData.email,
          roles: adminData.roles,
          date: adminData.date,
          phone: adminData.phone,
          VAT_REG_NO: adminData.VAT_REG_NO,
          CR_NO: adminData.CR_NO,
          authorizedperson: adminData.authorizedperson,
          arbic: adminData.arbic,
        })
        // setImage(`${BASE_URL}/${adminData.image}`)
        setSuperAdmin(adminData)
      } catch (err) {
        console.error("An error occurred while fetching admin data:", err)
      }
    }

    fetchData()
  }, [id, setValues])

  //updated charity details
  const handleUpdate = async e => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    axios.defaults.headers.common["Authorization"] = token

    const formData = new FormData()
    formData.append("charity", values.charity)
    formData.append("email", values.email)
    formData.append("roles", values.roles)
    formData.append("date", values.date)
    formData.append("phone", values.phone)
    formData.append("VAT_REG_NO", values.VAT_REG_NO)
    formData.append("CR_NO", values.CR_NO)
    formData.append("authorizedperson", values.authorizedperson)
    formData.append("arbic", values.arbic)

    // if (values.image) {
    //   formData.append("image", values.image)
    // }

    try {
      const response = await axios.put(`${BASE_URL}/charity/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      localStorage.setItem("charitydetails", JSON.stringify({
        ...superadmin,
        email: values.email,
        roles: values.roles,
        date: values.date,
        phone: values.phone,
        VAT_REG_NO: values.VAT_REG_NO,
        CR_NO: values.CR_NO,
        authorizedperson: values.authorizedperson,
        arbic: values.arbic,
        charity: values.charity,
        // image: response.data.image,
       
      }))
      setSuperAdmin(JSON.parse(localStorage.getItem("charitydetails")))
      alert(" updated successfull!")
    } catch (err) {
      console.error("An error occurred while updating admin data:", err)
      alert(
        "Failed to update admin. Please check the console for more details."
      )
    }
  }
const charityDetails = JSON.parse(localStorage.getItem("charitydetails"));
  return (
    <React.Fragment>
      <div className="page-content p-0">
        <Navbar />
        <Container className="container">
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={`${BASE_URL}/upload/${charityDetails.image}` }
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5 className="ms-3">{superadmin?.charity}</h5>
                        <p className="mb-1 ms-3">{superadmin?.email}</p>
                        <p className="mb-1 ms-3">
                          {superadmin?.id || "ID not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Update Super Admin</h4>

          <Card>
            <CardBody>
              <Form className="form-horizontal" onSubmit={handleUpdate}>
                <div className="form-group">
                  <Label className="form-label">Admin Name</Label>
                  <Input
                    name="charity"
                    value={values.charity}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter Admin Name"
                    type="text"
                  />
                  <br />
                  <Label className="form-label">Email</Label>
                  <Input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter Email Address"
                    type="email"
                  />
                  <br />
                  <Label className="form-label">Phone</Label>
                  <Input
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter Phone Number"
                    type="text"
                  />
                  <br />
                  <Label className="form-label">CR_NO</Label>
                  <Input
                    name="CR_NO"
                    value={values.CR_NO}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter CR_NO"
                    type="text"
                  />
                  <br />
                  <Label className="form-label">Authorizedperson</Label>
                  <Input
                    name="authorizedperson"
                    value={values.authorizedperson}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter Authorizedperson"
                    type="text"
                  />
                  <br />
                  <Label className="form-label">Charity Name (Arabic)</Label>
                  <Input
                    name="arbic"
                    value={values.arbic}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter Arabic"
                    type="text"
                  />
                  <br />
                  <Label className="form-label">Date</Label>
                  <Input
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                    className="form-control"
                    type="date"
                  />
                  <br />
                  <Label className="form-label">VAT_REG_NO</Label>
                  <Input
                    name="VAT_REG_NO"
                    value={values.VAT_REG_NO}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter VAT_REG_NO"
                    type="text"
                  />
                  <br />
                  <Label className="form-label">Role</Label>
                  <select
                    name="roles"
                    value={values.roles}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option>Select</option>
                    <option value="Main_Admin">Main_Admin</option>
                  </select>
                  <br />
                  {/* <Label className="form-label">Profile Image</Label>
                  <Input
                    name="image"
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                  <br /> */}
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="danger" style={{marginRight: "10px"}}>
                    Update
                  </Button>
                  <Button >Update Password</Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Profile
