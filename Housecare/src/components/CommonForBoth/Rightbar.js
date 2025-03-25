import React from "react"
import PropTypes from "prop-types"

import { connect } from "react-redux"
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changePreloader,
  showRightSidebarAction,
} from "../../store/actions"

//SimpleBar
import SimpleBar from "simplebar-react"

import { Link } from "react-router-dom"

import "../../components/CommonForBoth/rightbar.scss"

const RightSidebar = props => {
  return (
    <React.Fragment>
      <div className="right-bar" id="right-bar">
        <SimpleBar style={{ height: "900px" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-3 py-4">
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault()
                  props.showRightSidebarAction(false)
                }}
                className="right-bar-toggle float-end"
              >
                <i className="mdi mdi-close noti-icon" />
              </Link>
              <h5 className="m-0">Settings</h5>
            </div>

            <hr className="my-0" />

            <div className="p-4">
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layouts</span>
                <input
                  type="radio"
                  id="radioVertical"
                  name="radioFruit"
                  value="vertical"
                  checked={props.layoutType === "vertical"}
                  onChange={e => {
                    if (e.target.checked) {
                      props.changeLayout(e.target.value)
                    }
                  }}
                />
                <label htmlFor="radioVertical">Vertical</label>
                {"   "}
                <input
                  type="radio"
                  id="radioHorizontal"
                  name="radioFruit"
                  value="horizontal"
                  checked={props.layoutType === "horizontal"}
                  onChange={e => {
                    if (e.target.checked) {
                      props.changeLayout(e.target.value)
                    }
                  }}
                />
                <label htmlFor="radioHorizontal">Horizontal</label>
              </div>

              <hr className="mt-1" />

              {props.layoutType === "vertical" ? (
                <React.Fragment>
                  <hr className="mt-1" />
                  <div className="radio-toolbar">
                    <span className="mb-2 d-block" id="radio-title">
                      Left Sidebar Type{" "}
                    </span>
                    <input
                      type="radio"
                      id="sidebarDefault"
                      name="sidebarType"
                      value="default"
                      checked={props.leftSideBarType === "default"}
                      onChange={e => {
                        if (e.target.checked) {
                          props.changeSidebarType(e.target.value)
                        }
                      }}
                    />
                    <label htmlFor="sidebarDefault">Default</label>
                    {"   "}
                    <input
                      type="radio"
                      id="sidebarCompact"
                      name="sidebarType"
                      value="compact"
                      checked={props.leftSideBarType === "compact"}
                      onChange={e => {
                        if (e.target.checked) {
                          props.changeSidebarType(e.target.value)
                        }
                      }}
                    />
                    <label htmlFor="sidebarCompact">Compact</label>
                    {"   "}
                    <input
                      type="radio"
                      id="sidebarIcon"
                      name="sidebarType"
                      value="icon"
                      checked={props.leftSideBarType === "icon"}
                      onChange={e => {
                        if (e.target.checked) {
                          props.changeSidebarType(e.target.value)
                        }
                      }}
                    />
                    <label htmlFor="sidebarIcon">Icon</label>
                  </div>

                  <hr className="mt-1" />
                  <hr className="mt-1" />
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay" />
    </React.Fragment>
  )
}

RightSidebar.propTypes = {
  changeLayout: PropTypes.func,
  changePreloader: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  isPreloader: PropTypes.any,
  layoutType: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
}

const mapStateToProps = state => {
  return { ...state.Layout }
}

export default connect(mapStateToProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changePreloader,
  showRightSidebarAction,
})(RightSidebar)
