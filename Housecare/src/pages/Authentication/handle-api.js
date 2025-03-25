import axios from "axios"
import Swal from "sweetalert2";
const HOUSECARE_BASE_URL = `${process.env.REACT_APP_BASE_URL}/housecare`;
const CHARITY_URL= `${process.env.REACT_APP_BASE_URL}/charity`;
const ADMIN_URL = `${process.env.REACT_APP_BASE_URL}/admin`;
const CHARITYSTAFF_URL = `${process.env.REACT_APP_BASE_URL}/charitystaff`;
const BENIFICIARY_URL = `${process.env.REACT_APP_BASE_URL}/benificiary`;
const CATEGORY_URL = `${process.env.REACT_APP_BASE_URL}/category`;
const EMAIL_URL = `${process.env.REACT_APP_BASE_URL}/email`;
export const BASE_URL = `${process.env.REACT_APP_BASE_URL}`


//housecare staff creating
export const Createstaff = async formData => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
  try {
    const response = await axios.post(`${HOUSECARE_BASE_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (err) {
    console.log(err, "an error occure in signup")
    throw err
  }
}

//staff signin
export const handleLogin = async (e, values, setLoginStatus) => {
  e.preventDefault()
  const Data = {
    email: values.email,
    password: values.password,
  }

  console.log("Attempting to login with data:")

  try {
    const response = await axios.post(`${HOUSECARE_BASE_URL}/signin`, Data)
    if (response.status === 200) {
      setLoginStatus("success")
      const token = response.data.token
      localStorage.setItem("token", token)
      const HomecareAdmin = response.data.HomecareAdmin
      localStorage.setItem("HomecareAdmin", JSON.stringify(HomecareAdmin))
      console.log("Token and user data stored in Local storage")
      window.location.href = "/dashboard"
      // history.push("/dashboard");
    }
  } catch (err) {
    setLoginStatus("error")
    if (err.response && err.response.status === 400) {
      console.log(err.response.data.message)
    } else {
      console.log(err.message, "something went wrong in signin")
    }
  }
}

//Housecare staff details listing
export const fetchStaff = async () => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
  try {
    const response = await axios.get(`${HOUSECARE_BASE_URL}`)
    return response.data
  } catch (err) {
    console.error("staff list failed: internal error", err)
    throw err
  }
}

//Housecare staff delete
export const deleteStaff = async id => {
  try {
    await axios.delete(`${HOUSECARE_BASE_URL}/${id}`)
  } catch (err) {
    console.log(
      err.response ? err.response.data : err.message,
      "something went wrong in staff delete"
    )
    throw err
  }
}

//Staff details edit by Id
export const staffEdit = async id => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
  try {
    const response = await axios.get(`${HOUSECARE_BASE_URL}/${id}`)
    return response.data
  } catch (err) {
    console.log(err, "staff fetching error")
    throw err
  }
}

//staff details update
export const staffUpdate = async (id, formData) => {
  try {
    const response = await axios.put(`${HOUSECARE_BASE_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (err) {
    console.error("Error updating staff:", err)
    throw err
  }
}

//revoke staff
export const toggleBlockStaff = async id => {
  const response = await fetch(`${HOUSECARE_BASE_URL}/block/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to toggle block status")
  }

  return response.json()
}

//charity organaization listing

export const fetchCharity = async () => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
  try {
    const response = await axios.get(`${CHARITY_URL}`)
    return response.data
  } catch (err) {
    console.log(err, "charity organaization details listing failed")
  }
}

//charity organaization Add

export const handleCharity = async formData => {
  try {
    const response = await axios.post(`${CHARITY_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (err) {
    console.log(err, "Charity Organaizaztion Adding Failed")
    throw err
  }
}

//charity organaization Delete

export const charityDelete = async (id) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this charity?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });

  if (isConfirmed) {
    try {
      await axios.delete(`${CHARITY_URL}/${id}`);
      await Swal.fire({
        title: 'Deleted!',
        text: 'The Charity has been deleted.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    } catch (err) {
      console.error('Error deleting charity:', err);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the charity. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }
  }
}

//superadmin signin

export const handleadminLogin = async (e, values, setLoginStatus) => {
  e.preventDefault()
  const Data = {
    email: values.email,
    password: values.password,
  }

  console.log("Attempting to login with data")

  try {
    const response = await axios.post(`${ADMIN_URL}`, Data)
    if (response.status === 200) {
      setLoginStatus("success")
      const token = response.data.token
      localStorage.setItem("token", token)
      const HomecareAdmin = response.data.HomecareAdmin
      localStorage.setItem("HomecareAdmin", JSON.stringify(HomecareAdmin))
      // const roles  = response.data.roles
      // localStorage.setItem("roles", JSON.stringify(roles))
      console.log("Token and user data stored in Local storage")
      window.location.href = "/dashboard"
    }
  } catch (err) {
    setLoginStatus("error")
    if (err.response && err.response.status === 400) {
      console.log(err.response.data.message)
    } else {
      console.log(err.message, "something went wrong in signin")
    }
  }
}

//fetch Super admin
export const fetchAdmin = async () => {
  try {
    const response = await axios.get(`${ADMIN_URL}`)
    return response.data
  } catch (err) {
    console.log(err, "Super admin details listing failed")
  }
}

//Super admin Edit ById

export const EditAdmin = async id => {
  try {
    const response = await axios.get(`${ADMIN_URL}/${id}`)
    return response.data
  } catch (err) {
    console.log(err, "Fetching admin details is failed")
  }
}
//charity organaization edit by Id

export const charityEdit = async id => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
  try {
    const response = await axios.get(`${CHARITY_URL}/${id}`)
    return response.data
  } catch (err) {
    console.log(err, "charity organaizatiuon fetching error")
    throw err
  }
}
//charity update
export const charityUpdate = async (id, formData) => {
  try {
    const response = await axios.put(`${CHARITY_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (err) {
    console.error("Error updating charity:", err)
    throw err
  }
}
//charity staff creation
export const handleCharitystaff = async formData => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
  try {
    const response = await axios.post(`${CHARITYSTAFF_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (err) {
    console.log( "Charitystaff  Adding Failed")
    throw err
  }
}
//fetch charity staffs
export const fetchCharitystaffs = async () => {
  try {
    const response = await axios.get(`${CHARITYSTAFF_URL}`)
    return response.data
  } catch (err) {
    console.log(err, "charity staffs details listing failed")
  }
}

//delete charitystaffs

export const charitystaffDelete = async (id) => {
  const { value: confirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this staff?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (confirmed) {
    try {
      await axios.delete(`${CHARITYSTAFF_URL}/${id}`);
      Swal.fire(
        'Deleted!',
        'The staff has been deleted.',
        'success'
      );
    } catch (err) {
      Swal.fire(
        'Error!',
        err.response ? err.response.data : err.message,
        'error'
      );
    }
  }
}

//charity staffs edit byId
export const charitystaffEdit = async id => {
  try {
    const response = await axios.get(`${CHARITYSTAFF_URL}/${id}`)
    return response.data
  } catch (err) {
    console.log("an error occured in charity staff Fetching", err)
  }
}
//charity staff update
export const charityStaffUpdate = async (id, formData) => {
  try {
    const response = await axios.put(`${CHARITYSTAFF_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (err) {
    console.log("an error occured in charity staff details updation", err)
    throw err
  }
}
//revoke charity staffs
// export const blockcharityStaff = async id => {
//   const response = await fetch(`${CHARITYSTAFF_URL}/${id}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   })

//   if (!response.ok) {
//     throw new Error("Failed to  block status")
//   }

//   return response.json()
// }


//create benificiary  
export const handleBenificiary = async formData => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
  try {
    const response = await axios.post(`${BENIFICIARY_URL}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (err) {
    console.log(err, "Benificiary  Adding Failed")
    throw err
  }
}
//fetch benificiary
export const fetchBenificiarys = async () => {
  const token = localStorage.getItem("token")
  axios.defaults.headers.common["Authorization"] = token
  try {
    const response = await axios.get(`${BENIFICIARY_URL}`)
    return response.data
  } catch (err) {
    console.log(err, "benificiary details listing failed")
  }
}
//delete benificiary

export const benificiaryDelete = async (id) => {
  const { value: confirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this beneficiary?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (confirmed) {
    try {
      await axios.delete(`${BENIFICIARY_URL}/${id}`);
      Swal.fire(
        'Deleted!',
        'The beneficiary has been deleted.',
        'success'
      );
    } catch (err) {
      Swal.fire(
        'Error!',
        err.response ? err.response.data : err.message,
        'error'
      );
    }
  }
}
//benificiary edit byId
export const benificiaryEdit = async id => {
  try {
    const response = await axios.get(`${BENIFICIARY_URL}/${id}`)
    return response.data
  } catch (err) {
    console.log("an error occured in benificiary Fetching", err)
  }
}

//benificiary update
export const benificiaryUpdate = async (id, formData) => {
  try {
    const response = await axios.put(`${BENIFICIARY_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (err) {
    console.log("an error occured in benificiary details updation", err)
    throw err
  }
}
//handle charity signin
export const handleCharitySignin = async (e, values, setLoginStatus) => {
  e.preventDefault()
  const Data = {
    email: values.email,
    password: values.password,
  } 
  console.log("Attempting to login with data")
  try {
    const response = await axios.post(`${CHARITY_URL}/signin`, Data);
    if (response.status === 200) {
  
    const { token, charitydetails } = response.data; 
    localStorage.setItem("token", token);
    localStorage.setItem("charitydetails",JSON.stringify (charitydetails));
    setLoginStatus(true);
    console.log("Login successful");
    window.location.href = "/dashboards";
    }
  } catch (err) {
    setLoginStatus("error")
    if (err.response && err.response.status === 400) {
      console.log(err.response.data.message)
    } else {
      console.log(err.message, "something went wrong in signin")
    } 
   } 
}
//category create
export const handleCategory = async formData => {
  try {
    const response = await axios.post(`${CATEGORY_URL}`, formData)
    return response.data
  } catch (err) {
    console.log(err, "Category Adding Failed")
    throw err
  }
}

// category listing
export const fetchCategory = async () => {
  try {
    const response = await axios.get(`${CATEGORY_URL}`)
    return response.data
  } catch (err) {
    console.log(err, "Category listing failed")
  }
}

//email listing
export const fetchEmail = async () => {
  try {
    const response = await axios.get(`${EMAIL_URL}`)
    return response.data
  } catch (err) {
    console.log(err, "Email listing failed")
  }
}