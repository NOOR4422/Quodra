// Routers.jsx
import { Routes, Route } from "react-router-dom";

import Layout from "../component/Layout/Layout";

import Login from "../component/LoginPages/Login/Login";
import ResetPassword from "../component/LoginPages/resetPassword/ResetPassword";
import ResetPasswordCode from "../component/LoginPages/resetPasswordCode/ResetPasswordCode";
import ChangePassword from "../component/LoginPages/changePassword/ChangePassword";

import Dashboard from "../component/Dashboard/Dashboard";
import ClientsList from "../component/Clients/ClientsList/ClientsList";
import VisitsList from "../component/Visits/visitsList/VisitsList";
import NotificationsList from "../component/Notifications/NotificationsList/NotificationsList";
import RanksList from "../component/RanksList/RanksList";
import ClientDetails from "../component/Clients/ClientDetails/ClientDetails";
import AddClientForm from "../component/Clients/AddClientForm/AddClientForm";
import EditClientForm from "../component/Clients/EditClientForm/EditClientForm";
import AddCarModal from "../component/Modals/CarModal/CarModal";
import AddVisitForm from "../component/Visits/AddVisitForm/AddVisitForm";
import EditVisitForm from "../component/Visits/EditVisitForm/EditVisitForm";
import AddNotificationForm from "../component/Notifications/AddNotificationForm/AddNotificationForm";
import Settings from "../component/Settings/Settings";
import TransferRequestsList from "../component/Clients/TransferRequestsList/TransferRequestsList";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

const Routers = () => {
  return (
    <Routes>
      <Route path="auth">
        <Route path="login" element={<Login />} />
        <Route path="reset" element={<ResetPassword />} />
        <Route path="reset/code" element={<ResetPasswordCode />} />
        <Route path="reset/change" element={<ChangePassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="clients">
            <Route index element={<ClientsList />} />
            <Route path="add" element={<AddClientForm />} />
            <Route path=":id" element={<ClientDetails />} />
            <Route path=":id/edit" element={<EditClientForm />} />
            <Route path="car/add" element={<AddCarModal />} />
            <Route path="current" element={<ClientsList />} />
            <Route path="transfer" element={<TransferRequestsList />} />
          </Route>

          <Route path="visits">
            <Route index element={<VisitsList />} />
            <Route path="add" element={<AddVisitForm />} />
            <Route path=":id/edit" element={<EditVisitForm />} />
          </Route>

          <Route path="notifications">
            <Route index element={<NotificationsList />} />
            <Route path="add" element={<AddNotificationForm />} />
          </Route>

          <Route path="ranks" element={<RanksList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Routers;
