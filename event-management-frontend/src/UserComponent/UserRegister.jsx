import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    phoneNo: "",
    street: "",
    city: "",
    pincode: "",
    role: "",
  });

  useEffect(() => {
    if (document.URL.includes("customer")) {
      setUser((prevUser) => ({ ...prevUser, role: "Customer" }));
    } else if (document.URL.includes("manager")) {
      setUser((prevUser) => ({ ...prevUser, role: "Manager" }));
    }
  }, []);

  const handleUserInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, emailId, password, phoneNo, street, city, pincode } = user;

    if (!firstName || !lastName || !emailId || !password || !phoneNo || !street || !city || !pincode) {
      toast.error("All fields are required!", { position: "top-center" });
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(emailId)) {
      toast.error("Invalid email format!", { position: "top-center" });
      return false;
    }

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      toast.error("Password must be at least 6 characters, contain one uppercase, one lowercase, and one number.", {
        position: "top-center",
      });
      return false;
    }

    if (!/^\d{10}$/.test(phoneNo)) {
      toast.error("Phone number must be exactly 10 digits!", { position: "top-center" });
      return false;
    }

    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be exactly 6 digits!", { position: "top-center" });
      return false;
    }

    return true;
  };

  const saveUser = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    fetch("http://localhost:8080/api/user/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, { position: "top-center", autoClose: 1000 });

          setTimeout(() => {
            navigate("/user/login");
          }, 1000);
        } else {
          toast.error(res.responseMessage || "Registration failed!", { position: "top-center", autoClose: 1000 });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Server error. Please try again later.", { position: "top-center", autoClose: 1000 });
      });
  };

  return (
    <div className="mt-2 d-flex aligns-items-center justify-content-center ms-2 me-2 mb-2">
      <div className="form-card border-color text-color" style={{ width: "50rem" }}>
        <div className="container-fluid">
          <div
            className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
            style={{ borderRadius: "1em", height: "45px" }}
          >
            <h5 className="card-title">Register Here!!!</h5>
          </div>
          <div className="card-body mt-3">
            <form className="row g-3" onSubmit={saveUser}>
              <div className="col-md-6 mb-3">
                <label className="form-label"><b>First Name</b></label>
                <input type="text" className="form-control" name="firstName" onChange={handleUserInput} value={user.firstName} />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Last Name</b></label>
                <input type="text" className="form-control" name="lastName" onChange={handleUserInput} value={user.lastName} />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Email Id</b></label>
                <input type="email" className="form-control" name="emailId" onChange={handleUserInput} value={user.emailId} />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Password</b></label>
                <input type="password" className="form-control" name="password" onChange={handleUserInput} value={user.password} />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Phone No</b></label>
                <input type="number" className="form-control" name="phoneNo" onChange={handleUserInput} value={user.phoneNo} />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Street</b></label>
                <textarea className="form-control" name="street" rows="3" onChange={handleUserInput} value={user.street}></textarea>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>City</b></label>
                <input type="text" className="form-control" name="city" onChange={handleUserInput} value={user.city} />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Pincode</b></label>
                <input type="number" className="form-control" name="pincode" onChange={handleUserInput} value={user.pincode} />
              </div>

              <div className="d-flex aligns-items-center justify-content-center">
                <input type="submit" className="btn btn-primary bg-color custom-bg-text" value="Register User" />
              </div>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
