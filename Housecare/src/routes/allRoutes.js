import React from "react"
import { Navigate } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Pages Calendar
import Calendar from "../pages/Calendar/index"

//Email
import EmailInbox from "../pages/Email/email-inbox"
import EmailRead from "../pages/Email/email-read"
import EmailCompose from "../pages/Email/email-compose"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import HousecareStaff from "pages/Authentication/housecare-staff"

// Inner Authentication
import Recoverpw from "../pages/AuthenticationInner/Recoverpw"
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen"

// Dashboard
import Dashboard from "../pages/Dashboard/index"

//Tables
import BasicTables from "../pages/Tables/BasicTables"
import DatatableTables from "../pages/Tables/DatatableTables"
import ResponsiveTables from "../pages/Tables/ResponsiveTables"
import EditableTables from "../pages/Tables/EditableTables"

// Forms
import FormElements from "../pages/Forms/FormElements"
import FormAdvanced from "../pages/Forms/FormAdvanced"
import FormEditors from "../pages/Forms/FormEditors"
import FormValidations from "../pages/Forms/FormValidations"
import FormUpload from "../pages/Forms/FormUpload"
import FormXeditable from "../pages/Forms/FormXeditable"

//Ui
import UiAlert from "../pages/Ui/UiAlert"
import UiCards from "../pages/Ui/UiCards"
import UiCarousel from "../pages/Ui/UiCarousel"
import UiDropdown from "../pages/Ui/UiDropdown"
import UiImages from "../pages/Ui/UiImages"
import UiLightbox from "../pages/Ui/UiLightbox"
import UiModal from "../pages/Ui/UiModal"
import UiPagination from "../pages/Ui/UiPagination"
import UiPopoverTooltips from "../pages/Ui/UiPopoverTooltips"
import UiTabsAccordions from "../pages/Ui/UiTabsAccordions"
import UiSessionTimeout from "../pages/Ui/UiSessionTimeout"
import CharityDetails from "pages/Authentication/charitydetails"

//Extra Pages
import PagesInvoice from "../pages/Extra Pages/pages-invoice"
import PagesDirectory from "../pages/Extra Pages/pages-directory"
import PagesBlank from "../pages/Extra Pages/pages-blank"
import Pages403 from "../pages/Extra Pages/pages-403"
import Pages500 from "../pages/Extra Pages/pages-500"
import UiOffcanvas from "pages/Ui/UiOffcanvas"
import Chat from "pages/Chat/Chat"
import Kanban from "pages/Kanban"
import Staff from "pages/staffs"
import Charity from "pages/Authentication/charity"
import Superadmin from "pages/Authentication/superadmin"
import Beneficiarydetails from "pages/Authentication/beneficiarydetails"
import Charity1 from "../pages/charity"
import CharityTeam from "../pages/charity/charity-team"
import Mainpage from "pages/charity/mainpage"
import Dashboards from "pages/charity/dashboards"
import BenificiariesDetails from "pages/charity/beneficiariesdetails"
import Split from "pages/charity/split"
import Profile from "pages/charity/profile"
import Beneficiary from "pages/charity/beneficiary"
import Allbeneficiaries from "pages/Authentication/allbeneficiary"
// import New from "pages/charity/new"
import New from "pages/charity/splitDetails"
import SplitHistory from "pages/Authentication/splithistory"
import Charitysplithistory from "pages/Authentication/charitysplithistory"
import Datesplits from "pages/Authentication/datesplits"
import History from "pages/Authentication/History"
import Email from "pages/charity/email"
import Resetpassword from "pages/Authentication/resetpassword"
import LatestNotifications from "pages/Authentication/latestnotifications"
import Allsplit from "pages/Authentication/allsplit"
const userRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/staffs", component: <Staff /> },
  { path: "/housecarestaffs", component: <HousecareStaff /> },
  { path: "/charity", component: <Charity /> },
  { path: "/admin", component: <Charity /> },
  { path: "/charitydetails/:id", component: <CharityDetails /> },
  { path: "/beneficiarydetails/:id", component: <Beneficiarydetails /> },
{ path: "/splithistory", component: <SplitHistory /> },
  { path: "/histories", component: <Charitysplithistory /> },
  { path: "/datesplits/:id", component: <Datesplits /> },
  { path: "/allsplit", component: <Allsplit /> },
  {path: "/history-split" , component: <History/>},
  {path: "/latest-notifications" , component: <LatestNotifications/>},
  {path: "/beneficiary" , component: <Allbeneficiaries/>},


  // //calendar
  { path: "/calendar", component: <Calendar /> },

  { path: "/chat", component: <Chat /> },
  { path: "/kanbanboard", component: <Kanban /> },

  // // //profile
  { path: "/profile/:id", component: <UserProfile /> },

  // //Email
  { path: "/email-inbox", component: <EmailInbox /> },
  { path: "/email-read", component: <EmailRead /> },
  { path: "/email-compose", component: <EmailCompose /> },

  // // Tables
  { path: "/tables-basic", component: <BasicTables /> },
  { path: "/tables-datatable", component: <DatatableTables /> },
  { path: "/tables-responsive", component: <ResponsiveTables /> },
  { path: "/tables-editable", component: <EditableTables /> },

  // // Forms
  { path: "/form-elements", component: <FormElements /> },
  { path: "/form-advanced", component: <FormAdvanced /> },
  { path: "/form-editors", component: <FormEditors /> },
  { path: "/form-uploads", component: <FormUpload /> },
  { path: "/form-validation", component: <FormValidations /> },
  { path: "/form-xeditable", component: <FormXeditable /> },

  // // Ui
  { path: "/ui-alerts", component: <UiAlert /> },
  { path: "/ui-cards", component: <UiCards /> },
  { path: "/ui-carousel", component: <UiCarousel /> },
  { path: "/ui-dropdowns", component: <UiDropdown /> },
  { path: "/ui-images", component: <UiImages /> },
  { path: "/ui-lightbox", component: <UiLightbox /> },
  { path: "/ui-modals", component: <UiModal /> },
  { path: "/ui-pagination", component: <UiPagination /> },
  { path: "/ui-popover-tooltip", component: <UiPopoverTooltips /> },
  { path: "/ui-tabs-accordions", component: <UiTabsAccordions /> },
  { path: "/ui-session-timeout", component: <UiSessionTimeout /> },
  { path: "/ui-offcanvas", component: <UiOffcanvas /> },

  // //Extra Pages
  { path: "/pages-invoice", component: <PagesInvoice /> },
  { path: "/pages-directory", component: <PagesDirectory /> },
  { path: "/pages-blank", component: <PagesBlank /> },

  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: <Navigate to="/housecare" />,
  },
]

const authRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  {path:"/change-password",component:<Resetpassword/>},

  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "/admin", component: <Superadmin /> },
  {path:"/chaarity",component:<Charity1/>},
  {path:"/charityteam/:id",component:<CharityTeam/>},
  {path:"/housecare",component:<Mainpage/>},
  {path:"/dashboards",component:<Dashboards/>},
  {path:"/beneficiariesdetails/:id",component:<BenificiariesDetails/>},
  {path:"/split",component:<Split/>},
  {path:"/profiles/:id",component:<Profile/>},
  {path:"/beneficiaries",component:<Beneficiary/>},
  { path: "/pages-403", component: <Pages403 /> },
  { path: "/pages-500", component: <Pages500 /> },
  {path: "/history" , component: <New/>},
  {path: "/email" , component: <Email/>},
  // Authentication Inner
  { path: "/page-recoverpw", component: <Recoverpw /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
]

export { userRoutes, authRoutes }
