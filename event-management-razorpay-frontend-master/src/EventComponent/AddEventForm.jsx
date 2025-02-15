import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddEventForm = () => {
  const [categories, setCategories] = useState([]);
  const [event, setEvent] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const manager = JSON.parse(sessionStorage.getItem("active-manager"));
  const manager_jwtToken = sessionStorage.getItem("manager-jwtToken");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/event/category/fetch/all");
        setCategories(response.data.categories);
      } catch (error) {
        toast.error("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  const handleInput = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!event.name || !event.description || !event.location || !event.noOfTickets || !event.ticketPrice || !event.startDate || !event.endDate || !event.categoryId || !event.venueName || !event.venueType || !selectedImage) {
      toast.error("All fields are required");
      return false;
    }
    if (event.noOfTickets <= 0 || event.ticketPrice <= 0) {
      toast.error("Invalid ticket count or price");
      return false;
    }
    if (new Date(event.startDate) >= new Date(event.endDate)) {
      toast.error("Start date must be before end date");
      return false;
    }
    return true;
  };

  const convertToEpochTime = (dateString) => {
    return new Date(dateString).getTime();
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(event).forEach(([key, value]) => {
      formData.append(key, key.includes("Date") ? convertToEpochTime(value) : value);
    });
    formData.append("image", selectedImage);
    formData.append("managerId", manager.id);

    try {
      const response = await axios.post("http://localhost:8080/api/event/add", formData, {
        headers: { Authorization: `Bearer ${manager_jwtToken}` },
      });
      toast.success(response.data.responseMessage);
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      toast.error("Error adding event");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h3 className="text-center">Add Event</h3>
        <form onSubmit={saveEvent}>
          <input type="text" name="name" placeholder="Event Title" className="form-control mb-3" onChange={handleInput} />
          <textarea name="description" placeholder="Event Description" className="form-control mb-3" onChange={handleInput}></textarea>
          <select name="categoryId" className="form-control mb-3" onChange={handleInput}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input type="text" name="venueName" placeholder="Venue Name" className="form-control mb-3" onChange={handleInput} />
          <select name="venueType" className="form-control mb-3" onChange={handleInput}>
            <option value="">Select Venue Type</option>
            <option value="Conference Centers">Conference Centers</option>
            <option value="Hotels">Hotels</option>
          </select>
          <input type="text" name="location" placeholder="Location" className="form-control mb-3" onChange={handleInput} />
          <input type="number" name="noOfTickets" placeholder="No. of Tickets" className="form-control mb-3" onChange={handleInput} />
          <input type="number" name="ticketPrice" placeholder="Ticket Price" className="form-control mb-3" onChange={handleInput} />
          <input type="datetime-local" name="startDate" className="form-control mb-3" onChange={handleInput} />
          <input type="datetime-local" name="endDate" className="form-control mb-3" onChange={handleInput} />
          <input type="file" className="form-control mb-3" onChange={(e) => setSelectedImage(e.target.files[0])} />
          <button type="submit" className="btn btn-primary w-100">Add Event</button>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;
