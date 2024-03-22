import React, { useState, useEffect } from 'react';
import { Card, Table } from 'react-bootstrap';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserAuth } from "../../context/UserAuthContext";
import TimeSheetRow from '../TimesheetRow';

const TimeSheetView = () => {
    const [timeSheets, setTimeSheets] = useState([]);
    const { user } = useUserAuth();

    const fetchAndListenTimeSheets = async () => {
        try {
            const timesheetDataRef = collection(db, "timesheets", user.uid, "timesheetEntries");
            const q = query(timesheetDataRef);

            const unsubscribe = onSnapshot(q,
                (querySnapshot) => {
                    const sheets = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setTimeSheets(sheets);
                    localStorage.setItem("sheets", JSON.stringify(sheets));
                },
                (error) => {
                    console.error("Error fetching timesheets:", error);
                    // Handle the error appropriately
                }
            );

            return unsubscribe; // In case you need to unsubscribe from this listener later
        } catch (error) {
            console.error("Error setting up timesheet listener:", error);
            // Handle any setup errors
        }
    };

    useEffect(() => {
        if (!user.uid) return;

        const timesheetDataRef = collection(db, "timesheets", user.uid, "timesheetEntries");
        const q = query(timesheetDataRef);

        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const sheets = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTimeSheets(sheets);
                localStorage.setItem("sheets", JSON.stringify(sheets));
            },
            (error) => {
                const a = JSON.parse(localStorage.getItem("sheets"))
                setTimeSheets(a);
                console.error("Error fetching timesheets:", error);
                // Optionally, handle the error by setting state or showing a notification
            }
        );

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [user.uid]);

    const renderTimeSheetRow = (sheet) => {
        return (
            <TimeSheetRow
                key={sheet.id}
                sheet={sheet}
                // onApprove={() => (console.log("hello"))}
                // onReject={() => (console.log("hello"))}
                isAdminView={false}
            />
        );
    };


    return (
        <>
            {timeSheets.length > 0 &&
                <Card>
                    <Card.Body>
                        <Card.Title>Timesheets</Card.Title>
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSheets.map(renderTimeSheetRow)}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            }
        </>
    );
};

export default TimeSheetView;
