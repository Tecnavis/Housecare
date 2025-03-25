import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Form,
  Alert,
} from "reactstrap"
import { Link } from "react-router-dom"
import { BASE_URL } from "./handle-api"

import { handleadminLogin,fetchAdmin } from "./handle-api"
// import images
import logoLightPng from "../../assets/images/logo-light.png"
import logoDark from "../../assets/images/logo-dark.png"
import { useForm } from "helpers/useForms"

const Superadmin = () => {
  document.title = "Admin | HouseCare"
  const [values, handleChange] = useForm({
    email: "",
    password: "",
  })

  const [admins,setAdmins]=useState([])
  useEffect(() => {
    loadData()
  }, [])

  //fetch charity organaization deatils
  const loadData = async () => {
    try {
      const response = await fetchAdmin()
      setAdmins(response)
    } catch (err) {
      console.log(err)
    }
  }
  const [loginStatus, setLoginStatus] = useState(null)

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
            {admins &&(
          <Row className="justify-content-center">
            <Col md="8" lg="6" xl="5">
              <Card className="overflow-hidden">
                <CardBody className="pt-0">
                  <h3 className="text-center mt-5 mb-4">
                    <Link to="/" className="d-block auth-logo">
                      <img
                        src={logoDark}
                        alt=""
                        height="60"
                        className="auth-logo-dark"
                      />
                      <img
                        src={logoLightPng}
                        alt=""
                        height="60"
                        className="auth-logo-light"
                      />
                    </Link>
                  </h3>
                  <div className="p-3">
                    {/* <h4 className="text-muted font-size-18 mb-1 text-center">
                      Locked
                    </h4>
                    <p className="text-muted text-center">
                     {` Hello ${admins.admin}, enter your password to unlock the screen!`}
                    </p> */}
                    <Form
                      className="form-horizontal mt-4"
                      onSubmit={e =>
                        handleadminLogin(e, values, setLoginStatus)
                      }
                    >
                      {loginStatus === "success" && (
                        <Alert color="success">Login successful</Alert>
                      )}
                      {loginStatus === "error" && (
                        <Alert color="danger">
                          Login failed. Please try again.
                        </Alert>
                      )}

                      <div className="user-thumb text-center mb-4">
                        <img
                          src={`${BASE_URL}/upload/${admins.image}`}
                          className="rounded-circle avatar-md img-thumbnail"
                          alt="thumbnail"
                        />
                        <h6 className="font-size-16 mt-3">{admins.admin}</h6>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <Input
                          name="email"
                          className="form-control"
                          type="email"
                          placeholder="Enter Email"
                          value={values.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <Input
                          name="password"
                          className="form-control"
                          type="password"
                          placeholder="Enter password"
                          value={values.password}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3 row">
                        <div className="col-12 text-end">
                          <Button
                            color="primary"
                            className="w-md waves-effect waves-light"
                            type="submit"
                          >
                            Unlock
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>© 2024 Housecare</p>
              </div>
            </Col>
          </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Superadmin
