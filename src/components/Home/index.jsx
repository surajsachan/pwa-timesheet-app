import React from "react";
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from "react-router";
import { useUserAuth } from "../../context/UserAuthContext";
import FillTimesheet from "../FillTimesheet";
import TimeSheetView from "../Timesheetview";
import Notification from "../Common/Notification";

const Home = () => {
    const { logOut, user } = useUserAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };
    return (
        <>
            <Navbar bg="light" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand href="#home">TimeTracker</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/home">Home</Nav.Link>
                            <Nav.Link href="/timesheet">Timesheet</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Item className="align-self-center mr-2">
                                {user && user.email}
                            </Nav.Item>
                            <Button variant="outline-primary" onClick={handleLogout}>
                                Log Out
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Notification />
                <FillTimesheet />
                <TimeSheetView />
            </Container >
        </>
    );
};

export default Home;
