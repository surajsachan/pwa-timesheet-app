import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminRoute from "./components/AdminHome";
import TimeSheetView from "./components/Timesheetview";
import TNavbar from "./components/Common/Navbar";
import FillTimesheet from "./components/FillTimesheet";
import AdminTimeSheetView from "./components/AdminTimesheetView";
import { AdminProvider } from "./context/AdminContext";


function App() {

  return (
    <UserAuthContextProvider>
      <AdminProvider>
        <Router>
          <Routes>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <TNavbar />
                  <TimeSheetView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timesheet"
              element={
                <ProtectedRoute>
                  <TNavbar />
                  <FillTimesheet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminHome"
              element={
                <ProtectedRoute>
                  <TNavbar />
                  <AdminTimeSheetView />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </AdminProvider>
    </UserAuthContextProvider>

  );
}

export default App;
