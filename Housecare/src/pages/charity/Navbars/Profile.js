import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"

// users
import { BASE_URL } from "pages/Authentication/handle-api"
// const charitydetails = JSON.parse(localStorage.getItem("charitydetails"))
const ProfileMenu = props => {
  const IMAGE = "https://cdn-icons-png.flaticon.com/512/2922/2922510.png";

  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)
  const charitydetails =JSON.parse(localStorage.getItem("charitydetails"))
  const isRoleStaff = () => {
    const charityDetails = JSON.parse(localStorage.getItem("charitydetails"))
    return charityDetails && charityDetails.roles === "Main_Admin"
  }
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
      className="btn header-item waves-effect"
      id="page-header-user-dropdown"
      tag="button"
      style={{
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        padding: '10px',
        alignContent:"space-between",
        alignItems:"center"
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
        <strong style={{ fontSize: '16px', marginRight: '10px'}}>{charitydetails.arbic}{" "} </strong>
      {/* <small style={{ fontSize: '12px',marginRight: '10px' }}>{charitydetails.authorizedperson}</small> */}

      </div>
      <img
        className="rounded-circle header-profile-user"
              // src={charitydetails.image?.includes("http") ? charitydetails.image : `${BASE_URL}/upload/${charitydetails.image}`}
       src={
        charitydetails.image && charitydetails.image.includes("http")
                                       ? charitydetails.image
                                       : charitydetails.image
                                       ? `${BASE_URL}/upload/${charitydetails.image}`
                                       : IMAGE
                                   }
        alt="Header Avatar"
        style={{ width: '40px', height: '40px', marginRight: '10px' }}
      />
      
    </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem
            tag="a"
            href={`/profiles/${charitydetails.id}`}
            disabled={!isRoleStaff()}
            // href="#"
          >
            {" "}
            <i className="mdi mdi-account-circle font-size-17 text-muted align-middle me-1" />
            {props.t("Profile")}{" "}
          </DropdownItem>
          {/* <DropdownItem tag="a" href="#">
            <i className="mdi mdi-wallet font-size-17 text-muted align-middle me-1" />
            {props.t("My Wallets")}
          </DropdownItem> */}
          <DropdownItem tag="a" href="#/auth-lock-screen">
            <i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1" />
            {props.t("Lock screen")}
          </DropdownItem>

          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item text-danger">
            <i className="mdi mdi-power font-size-17 text-muted align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu)),
)
