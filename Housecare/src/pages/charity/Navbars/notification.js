import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col, Button } from "reactstrap";
import SimpleBar from "simplebar-react";
import axios from "axios";
import { BASE_URL } from "pages/Authentication/handle-api";

const NotificationDropdown = () => {
  const charityDetails = JSON.parse(localStorage.getItem("charitydetails"));
  const charityName = charityDetails?.charity; // Fetch the charity name from localStorage

  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);


useEffect(() => {
    const fetchNotifications = async () => {
      if (!charityName) return;
  
      try {
        const response = await axios.get(`${BASE_URL}/approvals/notifications`, {
          params: { charity: charityName }, // Fetch only unseen notifications
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    fetchNotifications();
  }, [charityName]);
  
//reset notifications
const handleViewAll = async () => {

    if (!charityName) return;
    window.location.href = `/history`
  
    try {
      // Mark notifications as seen
      await axios.delete(`${BASE_URL}/approvals/mark-as-seen`, {
        params: { charity: charityName },
      });
  
      // Clear the notifications in the frontend
      setNotifications([]);
    } catch (error) {
      console.error("Error marking notifications as seen:", error);
    }
  };
  
  
  return (
    <Dropdown
      isOpen={menu}
      toggle={() => setMenu(!menu)}
      className="dropdown d-inline-block ms-1"
      tag="li"
    >
      <DropdownToggle className="btn header-item noti-icon waves-effect" tag="button">
        <i className="ti-bell"></i>
        <span className="badge text-bg-danger rounded-pill">{notifications.length}</span>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
        <div className="p-3">
          <Row className="align-items-center">
            <Col>
              <h5 className="m-0"> Notifications {notifications.length} </h5>
            </Col>
          </Row>
        </div>

        <SimpleBar style={{ height: "130px" }}>
          {notifications.map((notification, index) => (
            <Link to="#" key={index} className="text-reset notification-item">
              <div className="d-flex">
                <div className="flex-grow-1">
                  <h6 className="mt-0 mb-1">{notification.message}</h6>
                  <div className="text-muted">
                    <p className="mb-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </SimpleBar>

        <div className="p-2 border-top d-grid">
          <Link
            className="btn btn-sm btn-link font-size-14 btn-block text-center"
            to="#"
            onClick={handleViewAll}
          >
            View all
          </Link>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;
