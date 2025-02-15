import AdminHeader from "./AdminHeader";
import HeaderCustomer from "./HeaderCustomer";
import ManagerHeader from "./ManagerHeader";
import NormalHeader from "./NormalHeader";

const RoleNav = () => {
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const manager = JSON.parse(sessionStorage.getItem("active-manager"));

  if (customer != null) {
    return <HeaderCustomer />;
  } else if (admin != null) {
    return <AdminHeader />;
  } else if (manager != null) {
    return <ManagerHeader />;
  } else {
    return <NormalHeader />;
  }
};

export default RoleNav;
