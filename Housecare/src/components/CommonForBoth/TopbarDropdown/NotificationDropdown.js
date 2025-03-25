import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col, Button } from "reactstrap";
import SimpleBar from "simplebar-react";
import { BASE_URL } from "pages/Authentication/handle-api";

// i18n
import { withTranslation } from "react-i18next";
import axios from "axios";

const NotificationDropdown = (props) => {
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const charityDetails = JSON.parse(localStorage.getItem("charitydetails"));
        if (charityDetails) {
          const response = await axios.get(`${BASE_URL}/notification/notifications`);
          setNotifications(response.data);
          const unread = response.data.filter(notification => !notification.isRead).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notificationId) => {
    try {
      const charityDetails = JSON.parse(localStorage.getItem("charitydetails"));
      if (charityDetails) {
        // Delete the notification from the backend
        await axios.delete(`${BASE_URL}/notification/${notificationId}`);

        // Update the local state to remove the notification
        setNotifications(prevNotifications => 
          prevNotifications.filter(notification => notification._id !== notificationId)
        );

        // Update the unread count
        setUnreadCount(prevUnreadCount => prevUnreadCount - 1);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block ms-1"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon waves-effect"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="ti-bell"></i>
          {unreadCount > 0 && (
            <span className="badge text-bg-danger rounded-pill">{unreadCount}</span>
          )}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h5 className="m-0"> {props.t("Notifications")} {unreadCount} </h5>
              </Col>
            </Row>
          </div>

          <SimpleBar style={{ height: "130px" }}>
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <Link 
                  to="#" 
                  className="text-reset notification-item" 
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification._id)} // Pass the notification ID
                >
                  <div
                    className="d-flex"
                    style={{
                      backgroundColor: !notification.isRead
                        ? "#f8d7da"
                        : "transparent",
                      borderRadius: "4px",
                      padding: "8px",
                    }}
                  >
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar-xs me-3">
                        <span className="avatar-title border-warning rounded-circle">
                          <i className="mdi mdi-message"></i>
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">{notification.message}</h6>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-3 text-center">No notifications</div>
            )}
          </SimpleBar>

          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="/history-split"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              {props.t("View all")}
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any
};
