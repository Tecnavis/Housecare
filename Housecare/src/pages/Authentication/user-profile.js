import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import withRouter from "components/Common/withRouter";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm } from "helpers/useForms";
import { BASE_URL } from "./handle-api";

const UserProfile = () => {
  document.title = "Profile |Housecare Admin Profile";

  const [superadmin, setSuperAdmin] = useState(null);
  const { id } = useParams();
  const [values, handleChange, setValues] = useForm({
    admin: "",
    email: "",
    role: "",
  });
  const [image, setImage] = useState(""); 

  useEffect(() => {
    const storedSuperadmin = localStorage.getItem("Superadmin");
    if (storedSuperadmin) {
      const parsedSuperadmin = JSON.parse(storedSuperadmin);
      setSuperAdmin(parsedSuperadmin);
      setValues({
        admin: parsedSuperadmin.admin,
        email: parsedSuperadmin.email,
        role: parsedSuperadmin.role
      });
      setImage(`${BASE_URL}/${parsedSuperadmin.image}`); // Set image URL
    }
  }, [setValues]);

  const handleImage = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage)); 
      setValues((prevValues) => ({
        ...prevValues,
        image: selectedImage
      }));
    }
  };

  useEffect(() => {
    if (!id) {
      console.error("Admin ID is undefined.");
      alert("Admin ID is missing.");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/${id}`);
        const adminData = response.data;
        setValues({
          admin: adminData.admin,
          email: adminData.email,
          role: adminData.role
        });
        setImage(`${BASE_URL}/${adminData.image}`); 
        setSuperAdmin(adminData);
      } catch (err) {
        console.error("An error occurred while fetching admin data:", err);
      }
    };

    fetchData();
  }, [id, setValues]);
  const [admins, setAdmin] = useState([])
  //update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("admin", values.admin);
    formData.append("email", values.email);
    formData.append("role", values.role);

    if (values.image) {
      formData.append("image", values.image);
    }  

    try {
      const response = await axios.put(`${BASE_URL}/admin/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      localStorage.setItem(
        "Superadmin",
        JSON.stringify({
          ...admins,
          email: values.email,
          role: values.role,
          admin: values.admin,
          image: response.data.image,
        }),
      )
      setAdmin(JSON.parse(localStorage.getItem("Superadmin")))
     alert(" updated successfull!")
    } catch (err) {
      console.error("An error occurred while updating admin data:", err);
      alert("Failed to update admin. Please check the console for more details.");
    }
  };
  const handlePasswordChange = () => {
window.location.href = "/change-password"
};
  return (
    <React.Fragment>
      <div className="page-content p-0">
        <Container fluid>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={`${BASE_URL}/upload/${superadmin?.image}`||image} 
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5 className="ms-3">{superadmin?.admin}</h5>
                        <p className="mb-1 ms-3">{superadmin?.email}</p>
                        <p className="mb-1 ms-3">
                          {superadmin?._id || "ID not available"}
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
                    name="admin"
                    value={values.admin}
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
                  <br/>
                  <Label className="form-label">Role</Label>
                  <select
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="company_admin">company_admin</option>
                    <option value="staff">staff</option>
                  </select>
                  <br />
                  <Label className="form-label">Profile Image</Label>
                  <Input
                    name="image"
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                  <br />
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="danger" style={{marginRight: "10px"}}>
                    Update
                  </Button>
                  <Button onClick={handlePasswordChange}>Password change</Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
