import { useEffect } from "react";
import carousel1 from "../images/carousel_1.jpg";
import carousel2 from "../images/carousel_2.jpg";
import carousel3 from "../images/carousel_3.jpg";

const Carousel = () => {
  useEffect(() => {
    const carousel = document.querySelector("#carouselExampleCaptions");
    if (carousel) {
      new window.bootstrap.Carousel(carousel, {
        interval: 3000, // 3 seconds per slide
        ride: "carousel",
        pause: "hover",
      });
    }
  }, []);

  return (
    <div
      id="carouselExampleCaptions"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000"
      style={{ height: "75vh" }}
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>

      {/* Carousel Items */}
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={carousel2} className="d-block w-100" style={{ height: "75vh", objectFit: "cover" }} alt="Slide 1" />
          <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
            <h2 className="text-white fw-bold">Welcome to Event Management</h2>
            <p className="text-white">Plan and organize your events effortlessly</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src={carousel1} className="d-block w-100" style={{ height: "75vh", objectFit: "cover" }} alt="Slide 2" />
          <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
            <h2 className="text-white fw-bold">Make Every Event Memorable</h2>
            <p className="text-white">Book venues and manage guests with ease</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src={carousel3} className="d-block w-100" style={{ height: "75vh", objectFit: "cover" }} alt="Slide 3" />
          <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
            <h2 className="text-white fw-bold">Seamless Event Planning</h2>
            <p className="text-white">Your one-stop solution for all events</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
