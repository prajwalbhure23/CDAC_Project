import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AdminRegisterForm = () => {
  let navigate = useNavigate();
  const [registerRequest, setRegisterRequest] = useState({
    emailId: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    emailId: "",
    password: "",
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = { emailId: "", password: "" };

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerRequest.emailId) {
      newErrors.emailId = "Email is required";
      valid = false;
    } else if (!emailPattern.test(registerRequest.emailId)) {
      newErrors.emailId = "Enter a valid email address";
      valid = false;
    }

    // Password Validation
    if (!registerRequest.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (registerRequest.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUserInput = (e) => {
    setRegisterRequest({ ...registerRequest, [e.target.name]: e.target.value });
  };

  const registerAdmin = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    fetch("http://localhost:8080/api/user/admin/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
          });

          setTimeout(() => {
            navigate("/home");
          }, 1000);
        } else {
          toast.error(res.responseMessage || "Registration failed", {
            position: "top-center",
            autoClose: 1000,
          });
        }
      })
      .catch(() => {
        toast.error("Server is down. Please try again later.", {
          position: "top-center",
          autoClose: 1000,
        });
      });
  };

  return (
    <div className="mt-2 d-flex align-items-center justify-content-center">
      <div className="form-card border-color mb-2" style={{ width: "25rem" }}>
        <div className="container-fluid">
          <div
            className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
            style={{ borderRadius: "1em", height: "38px" }}
          >
            <h4 className="card-title">Admin Register</h4>
          </div>
          <div className="card-body mt-3">
            <form onSubmit={registerAdmin}>
              <div className="mb-3 text-color">
                <label htmlFor="emailId" className="form-label">
                  <b>Email Id</b>
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.emailId ? "is-invalid" : ""}`}
                  id="email"
                  name="emailId"
                  onChange={handleUserInput}
                  value={registerRequest.emailId}
                />
                {errors.emailId && <div className="invalid-feedback">{errors.emailId}</div>}
              </div>

              <div className="mb-3 text-color">
                <label htmlFor="password" className="form-label">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  id="password"
                  name="password"
                  onChange={handleUserInput}
                  value={registerRequest.password}
                  autoComplete="on"
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="d-flex align-items-center justify-content-center">
                <button type="submit" className="btn bg-color custom-bg-text mb-2">
                  Register
                </button>
              </div>

              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterForm;
