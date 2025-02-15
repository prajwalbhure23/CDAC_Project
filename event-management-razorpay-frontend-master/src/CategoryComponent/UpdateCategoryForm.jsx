import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const UpdateCategoryForm = () => {
  const location = useLocation();
  const category = location.state;
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const [id] = useState(category.id);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);

  let navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Category Title is required.");
      return false;
    }
    if (name.length < 3 || name.length > 50) {
      toast.error("Category Title must be between 3 and 50 characters.");
      return false;
    }
    if (!description.trim()) {
      toast.error("Category Description is required.");
      return false;
    }
    if (description.length < 10 || description.length > 250) {
      toast.error("Category Description must be between 10 and 250 characters.");
      return false;
    }
    return true;
  };

  const saveCategory = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    let data = { id, name, description };

    fetch("http://localhost:8080/api/event/category/update", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify(data),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTimeout(() => {
              navigate("/admin/job/category/all");
            }, 2000);
          } else {
            toast.error(res.responseMessage || "Error updating category.");
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Server error, please try again later.");
      });
  };

  return (
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center">
        <div className="form-card border-color" style={{ width: "25rem" }}>
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
              style={{ borderRadius: "1em", height: "38px" }}
            >
              <h5 className="card-title">Update Event Category</h5>
            </div>
            <div className="card-body text-color mt-3">
              <form onSubmit={saveCategory}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    <b>Category Title</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Enter title.."
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    <b>Category Description</b>
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    placeholder="Enter description.."
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                </div>

                <div className="d-flex aligns-items-center justify-content-center mb-2">
                  <button type="submit" className="btn bg-color custom-bg-text">
                    Update Category
                  </button>
                </div>

                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategoryForm;
