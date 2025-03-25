import PropTypes from "prop-types"
import React, { useCallback, useEffect, useRef,useState } from "react"
import { BASE_URL } from "../../pages/Authentication/handle-api"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import withRouter from "components/Common/withRouter"
import { Link } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"
import axios from "axios"

const SidebarContent = props => {
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = process.env.PUBLIC_URL + props.router.location.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [props.router.location.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
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
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/* <li className="menu-title">{props.t("Main")} </li> */}
            <li>
              <Link to="/dashboard" className="waves-effect">
                <i className="mdi mdi-view-dashboard"></i>
                {/* <span className="badge rounded-pill bg-primary float-end">2</span> */}
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>
            <li>
              <Link to="/housecarestaffs" className="waves-effect">
                <i className="mdi mdi-account-tie"></i>
                <span>{props.t("Housecare Staffs")}</span>
              </Link>
            </li>
            <li>
              <Link to="/charity" className="waves-effect">
                <i className="mdi mdi-account-group"></i>
                <span>{props.t("Charity Organaization")}</span>
              </Link>
            </li>
            <li>
            <Link to="/beneficiary" className="nav-link">
                    <i className="mdi mdi-account-group"></i>
                    <span>{props.t("Beneficiary")}</span>
                  </Link>
            </li>
            <li>
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

            {/* <li>
              <Link to="/calendar" className=" waves-effect">
                <i className="mdi mdi-calendar-check"></i>
                <span>{props.t("Calendar")}</span>
              </Link>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-email-outline"></i>
                <span>{props.t("Email")}</span>
              </Link>
              <ul className="sub-menu" >
                <li>
                  <Link to="/email-inbox">{props.t("Inbox")}</Link>
                </li>
                <li>
                  <Link to="/email-read">{props.t("Email Read")} </Link>
                </li>
                <li>
                  <Link to="/email-compose">{props.t("Email Compose")} </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/chat" className=" waves-effect">
                <i className="mdi mdi-chat-processing-outline"></i>
                <span className="badge rounded-pill bg-danger float-end">Hot</span>
                <span>Chat</span>
              </Link>
            </li>

            <li>
              <Link to="/kanbanboard" className=" waves-effect">
                <i className="mdi mdi-billboard"></i>
                <span className="badge rounded-pill bg-success float-end">New</span>
                <span>Kanban Board</span>
              </Link>
            </li> */}


{/* ////////////////////////////// */}
            {/* <li className="menu-title">{props.t("Components")}</li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-buffer"></i>
                <span>{props.t("UI Elements")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/ui-alerts">{props.t("Alerts")}</Link>
                </li>
                <li>
                  <Link to="/ui-cards">{props.t("Cards")}</Link>
                </li>
                <li>
                  <Link to="/ui-carousel">{props.t("Carousel")}</Link>
                </li>
                <li>
                  <Link to="/ui-dropdowns">{props.t("Dropdowns")}</Link>
                </li>
                <li>
                  <Link to="/ui-images">{props.t("Images")}</Link>
                </li>
                <li>
                  <Link to="/ui-lightbox">{props.t("Lightbox")}</Link>
                </li>
                <li>
                  <Link to="/ui-modals">{props.t("Modals")}</Link>
                </li>
                <li>
                  <Link to="/ui-offcanvas">Offcanvas<span className="badge rounded-pill bg-warning float-end">New</span></Link>
                </li>
                <li>
                  <Link to="/ui-pagination">{props.t("Pagination")}</Link>
                </li>
                <li>
                  <Link to="/ui-popover-tooltip">{props.t("Popover & Tooltips")}</Link>
                </li>
                <li>
                  <Link to="/ui-session-timeout">{props.t("Session Timeout")}</Link>
                </li>
                <li>
                  <Link to="/ui-tabs-accordions">{props.t("Tabs & Accordions")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="waves-effect">
                <i className="mdi mdi-clipboard-outline"></i>
                <span className="badge rounded-pill bg-success float-end">6</span>
                <span>{props.t("Forms")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/form-elements">{props.t("Form Elements")}</Link>
                </li>
                <li>
                  <Link to="/form-validation">{props.t("Form Validation")}</Link>
                </li>
                <li>
                  <Link to="/form-advanced">{props.t("Form Advanced")}</Link>
                </li>
                <li>
                  <Link to="/form-editors">{props.t("Form Editors")}</Link>
                </li>
                <li>
                  <Link to="/form-uploads">{props.t("Form File Upload")} </Link>
                </li>
                <li>
                  <Link to="/form-xeditable">{props.t("Form Xeditable")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-format-list-bulleted-type"></i>
                <span>{props.t("Tables")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/tables-basic">{props.t("Basic Tables")}</Link>
                </li>
                <li>
                  <Link to="/tables-datatable">{props.t("Data Tables")}</Link>
                </li>
                <li>
                  <Link to="/tables-responsive">
                    {props.t("Responsive Table")}
                  </Link>
                </li>
                <li>
                  <Link to="/tables-editable">{props.t("Editable Table")}</Link>
                </li>
              </ul>
            </li> */}

            
            

            {/* <li className="menu-title">Authentication</li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-account-box"></i>
                <span>{props.t("Authentication")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/page-recoverpw">
                    {props.t("Recover Password")}
                  </Link>
                </li>
                <li>
                  <Link to="/auth-lock-screen">{props.t("Lock Screen")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-text-box-multiple-outline"></i>
                <span>{props.t("Extra Pages")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/pages-invoice">{props.t("Invoice")}</Link>
                </li>
                <li>
                  <Link to="/pages-directory">{props.t("Directory")}</Link>
                </li>
                <li>
                  <Link to="/pages-blank">{props.t("Blank Page")}</Link>
                </li>
              </ul>
            </li> */}

            
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
