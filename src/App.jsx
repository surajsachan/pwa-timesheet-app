import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import TimeSheetView from "./components/Timesheetview";
import TNavbar from "./components/Common/Navbar";
import FillTimesheet from "./components/FillTimesheet";
import AdminTimeSheetView from "./components/AdminTimesheetView";
import RestrictedAccess from "./components/Common/RestrictedAccess";
import Notification from "./components/Common/Notification";


function App() {

  const LoginProtection = ({ children }) => {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      return children;
    } else {
      return <RestrictedAccess redirectPath="/" redirectDelay={3000} />;
    }
  }

  const UserProtection = ({ children }) => {

    if (sessionStorage.getItem('isLoggedIn') === 'true' && sessionStorage.getItem('isAdmin') === 'false') {
      return children;
    } else {
      return <RestrictedAccess redirectPath="/adminHome" redirectDelay={3000} />;
    }
  }

  const AdminProtection = ({ children }) => {
    if (sessionStorage.getItem('isAdmin') === 'true') {
      return children;
    } else {
      return <RestrictedAccess redirectPath="/home" redirectDelay={3000} />;
    }

  }

  return (
    <UserAuthContextProvider>
      <Router>
        <Notification />
        <Routes>
          <Route
            path="/home"
            element={
              <LoginProtection>
                <UserProtection>
                  <TNavbar />
                  <TimeSheetView />
                </UserProtection>
              </LoginProtection>
            }
          />
          <Route
            path="/timesheet"
            element={
              <LoginProtection>
                <UserProtection>
                  <TNavbar />
                  <FillTimesheet />
                </UserProtection>
              </LoginProtection>
            }
          />
          <Route
            path="/adminHome"
            element={
              <LoginProtection>
                <AdminProtection>
                  <TNavbar />
                  <AdminTimeSheetView />
                </AdminProtection>
              </LoginProtection>
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </UserAuthContextProvider>
  );
}

export default App;
