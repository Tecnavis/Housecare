import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Collapse } from "reactstrap"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
// import classname from "classnames"

//i18n
import { withTranslation } from "react-i18next"
import { BASE_URL } from "../../pages/Authentication/handle-api"
import { connect } from "react-redux"
import axios from "axios"

const Navbar = props => {
  // const [ui, setui] = useState(false)
  // const [email, setemail] = useState(false)
  // const [form, setform] = useState(false)
  // const [table, settable] = useState(false)
  // const [icon, seticon] = useState(false)
  // const [map, setmap] = useState(false)
  // const [extra, setextra] = useState(false)
  // const [moreItem, setMoreItem] = useState(false)

  useEffect(() => {
    const pathName = process.env.PUBLIC_URL + props.router.location.pathname

    var matchingMenuItem = null
    var ul = document.getElementById("navigation")
    var items = ul.getElementsByTagName("a")
    removeActivation(items)
    for (var i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  })

  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i]
      const parent = items[i].parentElement
      if (item && item.classList.contains("active")) {
        item.classList.remove("active")
      }
      if (parent) {
        if (parent.classList.contains("active")) {
          parent.classList.remove("active")
        }
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    if (parent) {
      parent.classList.add("active") // li
      const parent2 = parent.parentElement
      parent2.classList.add("active") // li
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active") // li
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active") // li
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active") // li
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active") // li
            }
          }
        }
      }
    }
    return false
  }

  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/count`)
        setNotificationCount(response.data.count)
      } catch (error) {
        console.error("Error fetching notification count:", error)
      }
    }

    fetchNotificationCount()
  }, [])

  const handleResetNotifications = async () => {
    try {
      await axios.post(`${BASE_URL}/reset`)
      setNotificationCount(0)
      console.log("Notification count reset successfully")
    } catch (error) {
      console.error("Error resetting notification count:", error)
    }
  }
  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="topnav">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <i className="ti-dashboard"></i>
                    {props.t("Dashboard")} {props.menuOpen}
                  </Link>
                </li> */}

                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">
                    <i className="mdi mdi-view-dashboard"></i>
                    {/* <span className="badge rounded-pill bg-primary float-end">2</span> */}
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/housecarestaffs">
                    <i className="mdi mdi-account-tie"></i>
                    {props.t("Housecare Staffs")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/charity" className="nav-link">
                    <i className="mdi mdi-account-group"></i>
                    <span>{props.t("Charity Organaization")}</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/beneficiary" className="nav-link">
                    <i className="mdi mdi-account-group"></i>
                    <span>{props.t("Beneficiary")}</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/history-split"
                    className="nav-link"
                    onClick={handleResetNotifications}
                  >
                    <i className="mdi mdi-format-line-weight"></i>
                    <span className="badge rounded-pill bg-primary float-end">
                      {" "}
                      {notificationCount}
                    </span>
                    <span>{props.t("History")}</span>
                  </Link>
                </li>
                {/* <li className="nav-item">
                <Link to="/splithistory" className="nav-link" >
                <i className="mdi mdi-view-dashboard"></i>
                <span>{props.t("Split")}</span>
              </Link>
            </li> */}
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  )
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout
  return { leftMenu }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
)
