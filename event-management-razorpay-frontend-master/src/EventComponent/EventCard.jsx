import { Link } from "react-router-dom";

const EventCard = ({ item }) => {
  const descriptionToShow = (description, maxLength) => {
    return description.length <= maxLength
      ? description
      : description.substring(0, maxLength) + "...";
  };

  return (
    <div className="col">
      <div
        className="card h-100 shadow-lg border-0 rounded-4 event-card"
        style={{
          textDecoration: "none",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {/* Event Image */}
        <img
          src={`http://localhost:8080/api/event/${item.image}`}
          className="card-img-top img-fluid rounded-top"
          alt="event image"
          style={{ height: "200px", objectFit: "cover" }}
        />

        {/* Event Details */}
        <div className="card-body text-color p-4">
          <h4 className="card-title text-color-second">
            <b>{item.name}</b>
          </h4>

          <p className="card-text text-muted">
            {descriptionToShow(item.description, 80)}
          </p>

          <div className="mt-2">
            <b>
              <span className="text-color-second">Category:</span> {item.category.name}
            </b>
          </div>

          <div className="d-flex justify-content-between text-color-second mt-3">
            <b>
              <span className="text-color-second">Available Tickets: </span>
              <span className="text-color">{item.availableTickets}</span>
            </b>
            <b>
              <span className="text-color-second">Ticket Price: </span>
              <span className="text-color">&#8377;{item.ticketPrice}</span>
            </b>
          </div>
        </div>

        {/* Footer with Button */}
        <div className="card-footer bg-white border-0 text-center p-3">
          <Link to={`/event/${item.id}/detail`} className="btn btn-primary px-4">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
