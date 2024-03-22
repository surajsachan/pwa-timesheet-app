import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Container, FloatingLabel } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../../context/UserAuthContext";
import GoogleButton from "react-google-button";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Notification from "../Common/Notification";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { user, logIn, googleSignIn } = useUserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const userCredential = await logIn(email, password);
            sessionStorage.setItem("isLoggedIn", "true");
            await checkUserAndNavigate(userCredential.user);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await googleSignIn();
            await checkUserAndNavigate(userCredential.user);
        } catch (error) {
            console.log(error.message);
            setError(error.message);
        }
    };

    const checkUserAndNavigate = useCallback(async (currentUser) => {
        if (!currentUser || !currentUser.uid) {
            console.error("User data is not available");
            return;
        }

        try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                sessionStorage.setItem('isAdmin', 'true');
                navigate("/adminHome");
            } else {
                sessionStorage.setItem('isAdmin', 'false');
                navigate("/home");
            }
        } catch (error) {
            console.error("Error checking user admin status:", error);
        }
    }, [navigate]); // Add any other dependencies if needed

    // The rest of your component remains unchanged...
    useEffect(() => {
        if (user && user.uid && sessionStorage.getItem("isLoggedIn")) {
            checkUserAndNavigate(user);
        }
    }, [user, checkUserAndNavigate]);

    return (
        <>
            <Notification />
            <Container style={{ width: "400px" }}>
                <div className="p-4 box" >
                    <h2 className="mb-3">Login</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <FloatingLabel
                            controlId="formBasicEmail"
                            label="Email address"
                            className="mb-3"
                        >
                            <Form.Control required type="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="formBasicPassword"
                            label="Password"
                            className="mb-3"
                        >
                            <Form.Control required type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                        </FloatingLabel>

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="Submit">
                                Log In
                            </Button>
                        </div>
                    </Form>
                    <hr />
                    <div>
                        <GoogleButton
                            className="g-btn"
                            type="dark"
                            onClick={handleGoogleSignIn}
                        />
                    </div>
                </div>
                <div className="p-4 box mt-3 text-center">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </Container>
        </>
    );
};

export default Login;
