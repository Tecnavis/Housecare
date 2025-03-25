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

const ProfileMenu = props => {
  const IMAGE = "https://cdn-icons-png.flaticon.com/512/2922/2922510.png";

  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)
  // const isSuperadmin = !!localStorage.getItem("Superadmin")
  // const admins = JSON.parse(localStorage.getItem("Superadmin"))
  const admin = JSON.parse(localStorage.getItem("HomecareAdmin"))
  const isRoleStaff = () => {
    const HomecareAdmin = JSON.parse(localStorage.getItem("HomecareAdmin"))
    return HomecareAdmin && HomecareAdmin.role === "staff"
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
        >
          <img
            className="rounded-circle header-profile-user"
            // src={`${BASE_URL}/upload/${admin.image}`}
                src={admin.image ? `${BASE_URL}/upload/${admin.image}` : IMAGE}
            
            alt="Header Avatar"
          />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem
            tag="a"
            href={`/profile/${admin.id}`}
            disabled={isRoleStaff()}
          >
            {" "}
            <i className="mdi mdi-account-circle font-size-17 text-muted align-middle me-1" />
            {props.t("Profile")}{" "}
          </DropdownItem>
          {/* <DropdownItem tag="a" href="#">
            <i className="mdi mdi-wallet font-size-17 text-muted align-middle me-1" />
            {props.t("My Wallet")}
          </DropdownItem> */}
          {/* <DropdownItem className="d-flex align-items-center" to="#">
            <i className="mdi mdi-cog font-size-17 text-muted align-middle me-1"></i>
            {props.t("Settings")}
            <span className="badge bg-success ms-auto">11</span>
          </DropdownItem> */}
          <DropdownItem tag="a" href="auth-lock-screen">
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
