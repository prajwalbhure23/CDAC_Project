import { Routes, Route } from "react-router-dom";
import Header from "./NavbarComponent/Header";
import AdminRegisterForm from "./UserComponent/AdminRegisterForm";
import UserLoginForm from "./UserComponent/UserLoginForm";
import UserRegister from "./UserComponent/UserRegister";
import ForgotPassword from "./UserComponent/ForgotPassword";
import HomePage from "./PageComponent/HomePage";
import AddCategoryForm from "./CategoryComponent/AddCategoryForm";
import ViewAllCategories from "./CategoryComponent/ViewAllCategories";
import UpdateCategoryForm from "./CategoryComponent/UpdateCategoryForm";
import ViewAllCustomers from "./UserComponent/ViewAllCustomers";
import AddEventForm from "./EventComponent/AddEventForm";
import EventDetailPage from "./EventComponent/EventDetailPage";
import EventBookingPage from "./EventComponent/EventBookingPage";
import ViewAllEvents from "./EventComponent/ViewAllEvents";
import UpdateEventForm from "./EventComponent/UpdateEventForm";
import ViewAllEventBookings from "./EventBookingComponent/ViewAllEventBookings";
import ViewCustomerEventBookings from "./EventBookingComponent/ViewCustomerEventBookings";
import ViewAllManagers from "./UserComponent/ViewAllManagers";
import ViewManagerEventBookings from "./EventBookingComponent/ViewManagerEventBookings";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/user/admin/register" element={<AdminRegisterForm />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/user/customer/register" element={<UserRegister />} />
        <Route path="/user/manager/register" element={<UserRegister />} />
        <Route path="/admin/event/category/add" element={<AddCategoryForm />} />
        <Route
          path="/admin/event/category/all"
          element={<ViewAllCategories />}
        />
        <Route
          path="/admin/event/category/update"
          element={<UpdateCategoryForm />}
        />
        <Route path="/admin/customer/all" element={<ViewAllCustomers />} />
        <Route path="/manager/event/add" element={<AddEventForm />} />
        <Route path="/event/:eventId/detail" element={<EventDetailPage />} />
        <Route path="/event/booking/page" element={<EventBookingPage />} />
        <Route path="/admin/event/all" element={<ViewAllEvents />} />
        <Route path="/manager/event/all" element={<ViewAllEvents />} />
        <Route path="/manager/event/update" element={<UpdateEventForm />} />
        <Route
          path="/admin/event/booking/all"
          element={<ViewAllEventBookings />}
        />
        <Route
          path="/customer/event/booking/all"
          element={<ViewCustomerEventBookings />}
        />
        <Route
          path="/manager/event/booking/all"
          element={<ViewManagerEventBookings />}
        />

        <Route path="/admin/manager/all" element={<ViewAllManagers />} />
      </Routes>
    </div>
  );
}

export default App;
