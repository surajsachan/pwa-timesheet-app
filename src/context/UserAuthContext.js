import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Loader from "../components/Common/Loader";


const userAuthContext = createContext(null);

export function UserAuthContextProvider({ children }) {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);


    async function logIn(email, password) {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const signUp = async (name, email, password) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const user = res.user;
            const docRef = doc(db, "users", user.uid)
            await setDoc(docRef, {
                uid: user.uid,
                name,
                authProvider: "local",
                email,
                isAdmin: false
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    function logOut() {
        setLoading(true);
        return signOut(auth);
    }
    const googleSignIn = async () => {
        const googleAuthProvider = new GoogleAuthProvider();
        try {
            const res = await signInWithPopup(auth, googleAuthProvider);
            const user = res.user;
            const userDocRef = doc(db, "users", user.uid);

            // Check if the user document already exists
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid,
                    name: user.displayName,
                    authProvider: "google",
                    email: user.email,
                    isAdmin: false
                });
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
            console.log("Auth", currentuser);
            setUser(currentuser);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <userAuthContext.Provider
            value={{ user, loading, logIn, signUp, logOut, googleSignIn }}
        >
            {!!loading ? <Loader /> : children}
        </userAuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(userAuthContext);
}
