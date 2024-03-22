import React from "react";
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from "react-router";
import { useUserAuth } from "../../context/UserAuthContext";

const TNavbar = () => {
    const { logOut, user } = useUserAuth();
    const { isAdmin } = JSON.parse(sessionStorage.getItem("isAdmin"));

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logOut();
            sessionStorage.clear();
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Navbar bg="light" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand>TimeTracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {!!user &&
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href={isAdmin ? "/adminHome" : "/home"}>Home</Nav.Link>
                            <Nav.Link disabled={isAdmin} href="/timesheet">Timesheet</Nav.Link>
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
                }
            </Container>
        </Navbar >
    );
};

export default TNavbar;
