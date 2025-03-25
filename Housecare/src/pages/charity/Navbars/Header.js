import React, { useState } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { showRightSidebarAction, toggleLeftmenu } from "store/actions";
import { Container } from "reactstrap";
import NotificationDropdown from "./notification";
import ProfileMenu from "./Profile";
// import PaymentModal from "../paymentmodal"; // Import the PaymentModal component
import logo from "assets/images/logo-sm.png";
import logoLight from "assets/images/logo-light.png";
import logoDark from "assets/images/logo-dark.png";
import { withTranslation } from "react-i18next";

const Header = props => {
  const [isSearch, setSearch] = useState(false);

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        )
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }
  }



  return (
    <React.Fragment>
      <div className="navbar-header">
        <Container fluid>
          <div className="float-start">
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="60" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="" height="60" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logo} alt="" height="60" />
                </span>
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="60" />
                </span>
              </Link>
            </div>
            <button
              type="button"
              className="btn btn-sm px-3 font-size-24 d-lg-none header-item waves-effect waves-light"
              onClick={() => {
                props.toggleLeftmenu(!props.leftMenu)
              }}
            >
              <i className="mdi mdi-menu"></i>
            </button>
          </div>

          <div className="float-end">
            <div className="dropdown d-none d-lg-inline-block">
              <button
                type="button"
                className="btn header-item noti-icon waves-effect"
                onClick={toggleFullscreen}
                data-toggle="fullscreen"
              >
                <i className="mdi mdi-fullscreen font-size-24"></i>
              </button>
            </div>
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                type="button"
                className="btn header-item noti-icon waves-effect"
                id="page-header-search-dropdown"
                onClick={() => setSearch(!isSearch)}
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  isSearch
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={props.t("Search") + "..."}
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <NotificationDropdown/>
            {/* <Button onClick={togglePaymentModal}>PAY NOW</Button> */}
            <ProfileMenu />
          </div>
        </Container>
      </div>

      {/* <PaymentModal 
        isOpen={isPaymentModalOpen} 
        toggle={togglePaymentModal} 
        saveAmount={saveAmount} 
      /> */}
    </React.Fragment>
  );
};

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
};

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(withTranslation()(Header));
