import { Routes, Route } from "react-router-dom";

import Layout from "../component/Layout/Layout";

import Login from "../component/loginPage/Login";
import ResetPassword from "../component/resetPassword/ResetPassword";
import ResetPasswordCode from "../component/resetPasswordCode/ResetPasswordCode";
import ChangePassword from "../component/changePassword/ChangePassword";

import Dashboard from "../component/Dashboard/Dashboard";
import ClientsList from "../component/Clients/ClientsList/ClientsList";
import VisitsList from "../component/Visits/visitsList/VisitsList";
import NotificationsList from "../component/Notifications/NotificationsList/NotificationsList";
import RanksList from "../component/RanksList/RanksList";
import ClientDetails from "../component/Clients/ClientDetails/ClientDetails";
import AddClientForm from "../component/Clients/AddClientForm/AddClientForm";
import EditClientForm from "../component/Clients/EditClientForm/EditClientForm";
import AddCarModal from "../component/Clients/CarModal/CarModal";
import AddVisitForm from "../component/Visits/AddVisitForm/AddVisitForm";
import EditVisitForm from "../component/Visits/EditVisitForm/EditVisitForm";
import AddNotificationForm from "../component/Notifications/AddNotificationForm/AddNotificationForm";
import Settings from "../component/Settings/Settings";

const Routers = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/resetPasswordCode" element={<ResetPasswordCode />} />
      <Route path="/changePassword" element={<ChangePassword />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientsList" element={<ClientsList />} />
        <Route path="/visitsList" element={<VisitsList />} />
        <Route path="/notificationsList" element={<NotificationsList />} />
        <Route path="/ranksList" element={<RanksList />} />
        <Route path="/clientDetails/:id" element={<ClientDetails />} />
        <Route path="/addClientForm" element={<AddClientForm />} />
        <Route path="/editClientForm" element={<EditClientForm />} />
        <Route path="/addCarModal" element={<AddCarModal />} />
        <Route path="/addVisitForm" element={<AddVisitForm />} />
        <Route path="/editVisitForm" element={<EditVisitForm />} />
        <Route path="/addNotificationForm" element={<AddNotificationForm />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default Routers;
