import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Update with your actual path to firebase config
import { useUserAuth } from './UserAuthContext'; // Update with the path to your UserAuthContext

const AdminContext = createContext({ isAdmin: false, isLoading: true });

export const useAdmin = () => {
    return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
    const { user } = useUserAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.uid) {
            const checkAdminStatus = async () => {
                const userDocRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                }
                setIsLoading(false);
            };

            checkAdminStatus();
        } else {
            setIsAdmin(false);
            setIsLoading(false);
        }
    }, [user]);


    return (
        <AdminContext.Provider value={{ isAdmin, isLoading }}>
            {!isLoading && children}
        </AdminContext.Provider>
    );
};
