import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Update with your actual path to firebase config
import { useUserAuth } from './UserAuthContext'; // Update with the path to your UserAuthContext
import Loader from '../components/Common/Loader';

const AdminContext = createContext({ isAdmin: false, isLoading: true });

export const useAdmin = () => {
    return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
    const { user } = useUserAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true); // Set loading to true at the start of the effect

        const checkAdminStatus = async () => {
            if (user && user.uid) {
                const userDocRef = doc(db, "users", user.uid);
                try {
                    const docSnap = await getDoc(userDocRef);
                    // Assuming that the presence of a document and a specific field (e.g., isAdmin)
                    // determines whether the user is an admin
                    setIsAdmin(!docSnap.exists());
                } catch (error) {
                    console.error("Error checking admin status:", error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setIsLoading(false);
        };

        checkAdminStatus();
    }, [user]);



    return (
        <AdminContext.Provider value={{ isAdmin, isLoading }}>
            {isLoading ? <Loader /> : children}
        </AdminContext.Provider>
    );
};
