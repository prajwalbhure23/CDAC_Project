import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/event/fetch?eventId=${eventId}`);
        if (response.data.events && response.data.events.length > 0) {
          setEvent(response.data.events[0]);
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const formatDateFromEpoch = (epochTime) => {
    if (!epochTime) return "N/A";
    const date = new Date(Number(epochTime));
    return date.toLocaleString();
  };

  const handleBooking = () => {
    if (!customer) {
      toast.warning("Please log in to book an event.");
      return;
    }
    navigate("/event/booking/page", { state: event });
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100 text-primary fw-bold">Loading event details...</div>;
  }

  if (error) {
    return <div className="d-flex justify-content-center align-items-center vh-100 text-danger fw-bold">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <div className="row">
          {/* Left - Event Details */}
          <div className="col-md-6">
            <h3 className="text">Event Details</h3>
            <img
              src={`http://localhost:8080/api/event/${event.image}`}
              className="img-fluid rounded mb-3"
              alt="Event"
              style={{ maxHeight: "200px" }}
            />
            <h4 className="fw-bold">{event.name}</h4>
            <p>{event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </div>

          {/* Right - Venue Details */}
          <div className="col-md-6">
            <h3 className="text">Venue Details</h3>
            <p><strong>Venue Name:</strong> {event.venueName}</p>
            <p><strong>Venue Type:</strong> {event.venueType}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </div>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="card shadow-lg mt-4 p-4">
        <h3 className="text">Ticket Details</h3>
        <div className="row">
          <div className="col-md-4"><strong>Total Tickets:</strong> {event.noOfTickets}</div>
          <div className="col-md-4"><strong>Available Tickets:</strong> {event.availableTickets}</div>
          <div className="col-md-4"><strong>Price:</strong> ₹{event.ticketPrice}</div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6"><strong>Start Time:</strong> {formatDateFromEpoch(event.startDate)}</div>
          <div className="col-md-6"><strong>End Time:</strong> {formatDateFromEpoch(event.endDate)}</div>
        </div>
      </div>

      {/* Booking Button */}
      <div className="text-center mt-4">
        <button className="btn btn-primary btn-lg" onClick={handleBooking}>Book Event</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EventDetailPage;
