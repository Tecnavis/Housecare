import React,{useEffect} from "react"

import { connect } from "react-redux";

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";

const PagesBlank = (props) => {
    document.title = "Blank Page | Housecare";

    const breadcrumbItems = [
        { title: "Housecare", link: "#" },
        { title: "Pages", link: "#" },
        { title: "Blank page", link: "#" },
    ]

    useEffect(() => {
        props.setBreadcrumbItems('Blank page', breadcrumbItems)
    })

    return (
       <></>
    )
}

export default connect(null, { setBreadcrumbItems })(PagesBlank);