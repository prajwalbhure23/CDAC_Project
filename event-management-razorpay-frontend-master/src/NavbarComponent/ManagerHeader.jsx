import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagerHeader = () => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-manager"));

  const managerLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-manager");
    sessionStorage.removeItem("manager-jwtToken");
    window.location.reload(true);
    setTimeout(() => {
      navigate("/home");
    }, 2000); // Redirect after 3 seconds
  };
  return (
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li class="nav-item">
        <Link
          to="/manager/event/add"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Add Event</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to="/manager/event/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">My Events</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to="/manager/event/booking/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Event Bookings</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to=""
          class="nav-link active"
          aria-current="page"
          onClick={managerLogout}
        >
          <b className="text-color">Logout</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default ManagerHeader;
