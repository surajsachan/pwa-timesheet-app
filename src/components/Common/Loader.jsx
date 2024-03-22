import React from 'react';
import { Spinner, Container, Row, Col } from 'react-bootstrap';

const Loader = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Row>
                <Col>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Col>
            </Row>
        </Container>
    );
};

export default Loader;
