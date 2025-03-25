import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Button, Collapse } from "reactstrap"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import PaymentModal from "../paymentmodal"; // Import the PaymentModal component

//i18n
import { withTranslation } from "react-i18next"
import { connect } from "react-redux"

const Navbar = props => {
  const saveAmount = (amount) => {
    localStorage.setItem('limitedamount', amount);
    window.location.href = "/split";
  };

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const togglePaymentModal = () => {
    setPaymentModalOpen(!isPaymentModalOpen);
  };

  useEffect(() => {
    const pathName = process.env.PUBLIC_URL + props.router.location.pathname;

    var matchingMenuItem = null;
    var ul = document.getElementById("navigation");
    var items = ul.getElementsByTagName("a");
    removeActivation(items);
    for (var i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  });

  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;
      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        if (parent.classList.contains("active")) {
          parent.classList.remove("active");
        }
      }
    }
  };

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  }

  const charitydetails = JSON.parse(localStorage.getItem("charitydetails"));
  const isRoleStaff = () => {
    return charitydetails && charitydetails.roles === "Main_Admin";
  };

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
                <li className="nav-item">
                  <Link to="/dashboards" className="nav-link">
                    <i className="mdi mdi-view-dashboard"></i>
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>
                

                {isRoleStaff() && ( 
                  <li className="nav-item">
                    <Link className="nav-link" to={`/charityteam/${charitydetails.id}`}>
                      <i className="mdi mdi-account-box"></i>
                      {props.t("Team")}
                    </Link>
                  </li>
                )}
                
                 <li className="nav-item">
                  <Link to="/beneficiaries" className="nav-link">
                  <i className="mdi mdi-account-box"></i>
                    <span>{props.t("Beneficiary")}</span>
                  </Link>
                </li>
                 {/* <li className="nav-item">
                  <Link to="/email" className="nav-link">
                  <i className="mdi mdi-email-open-multiple"></i>
                    <span>{props.t("Email")}</span>
                  </Link>
                </li> */}
              </ul>
            </Collapse>
            <Button onClick={togglePaymentModal} style={{ marginRight: "20px",backgroundColor:"var(--bs-primary)",border:"none" }}>
              DISBURSEMENT
            </Button>
          </nav>
        </div>
      </div>
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        toggle={togglePaymentModal} 
        saveAmount={saveAmount} 
      />
    </React.Fragment>
  );
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
