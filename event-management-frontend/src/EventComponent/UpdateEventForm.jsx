import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateEventForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [event, setEvent] = useState(location.state || {});

  const location = useLocation();
  const navigate = useNavigate();

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/event/category/fetch/all");
        if (response.data) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleInput = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const convertToEpochTime = (dateString) => {
    return new Date(dateString).getTime();
  };

  const validateForm = () => {
    if (!event.name || !event.description || !event.venueName || !event.location) {
      toast.error("All text fields must be filled.");
      return false;
    }
    if (!event.categoryId || event.categoryId === "0") {
      toast.error("Select a category.");
      return false;
    }
    if (!event.venueType) {
      toast.error("Select a venue type.");
      return false;
    }
    if (!event.noOfTickets || event.noOfTickets <= 0) {
      toast.error("No. of tickets must be greater than 0.");
      return false;
    }
    if (!event.availableTickets || event.availableTickets < 0) {
      toast.error("Available tickets cannot be negative.");
      return false;
    }
    if (!event.ticketPrice || event.ticketPrice < 0) {
      toast.error("Ticket price must be a positive value.");
      return false;
    }
    if (!event.startDate || !event.endDate) {
      toast.error("Start and End dates are required.");
      return false;
    }
    if (new Date(event.startDate) >= new Date(event.endDate)) {
      toast.error("End date must be after start date.");
      return false;
    }
    if (!selectedImage1) {
      toast.error("Event image is required.");
      return false;
    }
    return true;
  };

  const saveEvent = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("id", event.id);
    formData.append("name", event.name);
    formData.append("description", event.description);
    formData.append("venueName", event.venueName);
    formData.append("venueType", event.venueType);
    formData.append("location", event.location);
    formData.append("image", selectedImage1);
    formData.append("noOfTickets", event.noOfTickets);
    formData.append("startDate", convertToEpochTime(event.startDate));
    formData.append("endDate", convertToEpochTime(event.endDate));
    formData.append("ticketPrice", event.ticketPrice);
    formData.append("categoryId", event.categoryId);
    formData.append("availableTickets", event.availableTickets);

    try {
      const response = await axios.put("http://localhost:8080/api/event/update", formData, {
        headers: {
          Authorization: `Bearer ${admin_jwtToken}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.responseMessage);
        setTimeout(() => navigate("/admin/event/all"), 2000);
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Error updating event. Server may be down.");
    }
  };

  return (
    <div>
      <div className="mt-2 d-flex align-items-center justify-content-center mb-4">
        <div className="card form-card shadow-lg" style={{ width: "60rem" }}>
          <div className="container-fluid">
            <div className="card-header bg-color custom-bg-text mt-2 text-center" style={{ borderRadius: "1em", height: "45px" }}>
              <h5 className="card-title">Update Event</h5>
            </div>
            <div className="card-body text-color">
              <form className="row g-3" onSubmit={saveEvent}>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Event Title</b></label>
                  <input type="text" className="form-control" name="name" onChange={handleInput} value={event.name || ""} />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Event Description</b></label>
                  <input type="text" className="form-control" name="description" onChange={handleInput} value={event.description || ""} />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Event Category</b></label>
                  <select name="categoryId" onChange={handleInput} className="form-control" value={event.categoryId || ""}>
                    <option value="">Select Event Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Event Venue Name</b></label>
                  <input type="text" className="form-control" name="venueName" onChange={handleInput} value={event.venueName || ""} />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Location</b></label>
                  <input type="text" className="form-control" name="location" onChange={handleInput} value={event.location || ""} />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Event Image</b></label>
                  <input type="file" className="form-control" onChange={(e) => setSelectedImage1(e.target.files[0])} />
                </div>

                <div className="d-flex justify-content-center mb-2">
                  <button type="submit" className="btn bg-color custom-bg-text">Update Event</button>
                </div>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEventForm;
