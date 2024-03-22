import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';

const RestrictedAccess = ({ redirectPath = '/home', redirectDelay = 3000 }) => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log(`Redirecting to ${redirectPath} in ${redirectDelay / 1000} seconds`);
        const timer = setTimeout(() => {
            console.log(`Redirecting now to ${redirectPath}`);
            navigate(redirectPath);
        }, redirectDelay);

        return () => {
            clearTimeout(timer);
            console.log(`Cleaned up timeout for redirecting to ${redirectPath}`);
        };
    }, [navigate, redirectPath, redirectDelay]);

    return (
        <Container className="mt-5 text-center">
            <Alert variant="danger">
                <Alert.Heading>Restricted Access</Alert.Heading>
                <p>You do not have permission to view this page.</p>
                <hr />
                <p className="mb-0">Redirecting you in {redirectDelay / 1000} seconds.</p>
            </Alert>
        </Container>
    );
};

export default RestrictedAccess;
