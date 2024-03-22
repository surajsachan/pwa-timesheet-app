import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button, Container, FloatingLabel } from "react-bootstrap";
import { useUserAuth } from "../../context/UserAuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container style={{ width: "400px" }}>
      <div className="p-4 box">
        <h2 className="mb-3">Firebase/ React Auth Signup</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>

          <FloatingLabel
            controlId="formBasicName"
            label="Name"
            className="mb-3"
          >
            <Form.Control type="text" placeholder="John Doe" onChange={(e) => setName(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel
            controlId="formBasicEmail"
            label="Email address"
            className="mb-3"
          >
            <Form.Control type="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel
            controlId="formBasicPassword"
            label="Password"
            className="mb-3"
          >
            <Form.Control type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} autocomplete="current-password" />
          </FloatingLabel>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Sign up
            </Button>
          </div>
        </Form>
      </div>
      <div className="p-4 box mt-3 text-center">
        Already have an account? <Link to="/">Log In</Link>
      </div>
    </Container>
  );
};

export default Signup;