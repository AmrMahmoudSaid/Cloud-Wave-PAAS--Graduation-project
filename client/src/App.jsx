import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LoginForm from "./components/LoginForm";
import HomePage from "./pages/HomePage";
import Payment from "./pages/Payment";
import PaymentForm from "./pages/Payment";
import AddDatabase from "./pages/AddDatabase";
import AddApplication from "./pages/AddApplication";
import AppLogs from "./pages/AppLogs";
import { Helmet } from "react-helmet";
import Callback from "./pages/callback";
import DatabaseLogs from "./pages/DatabaseLogs";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";
import ContactUs from "./pages/contactUs";
import Aboutus from "./pages/aboutus";
import Help from "./pages/help";

function App() {
  return (
    <>
      <Helmet>
        <title>Cloud wave</title>
      </Helmet>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/loginForm" element={<LoginForm />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/paymentform" element={<PaymentForm />} />
          <Route path="/createdatabase" element={<AddDatabase />} />
          <Route path="/createapplication" element={<AddApplication />} />
          <Route path="/applogs" element={<AppLogs />} />
          <Route path="/login/callback" element={<Callback />} />
          <Route path="/databaselogs" element={<DatabaseLogs />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
