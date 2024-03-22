import React, { useState, useEffect } from 'react';
import { Card, Table } from 'react-bootstrap';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserAuth } from "../../context/UserAuthContext";
import TimeSheetRow from '../TimesheetRow';

const TimeSheetView = () => {
    const [timeSheets, setTimeSheets] = useState([]);
    const { user } = useUserAuth();

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
            }
        );

        return () => unsubscribe();
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
                            {!!timeSheets.length && timeSheets.map(renderTimeSheetRow)}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TimeSheetView;
