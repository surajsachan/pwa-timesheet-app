import React, { useState, useEffect } from 'react';
import { Table, Card } from 'react-bootstrap';
import { getDocs, collectionGroup, query, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../firebase'; // Use your Firebase setup file path
import { getDownloadURL, ref } from 'firebase/storage';
import TimeSheetRow from '../TimesheetRow';

const AdminTimeSheetView = () => {
    const [timeSheets, setTimeSheets] = useState([]);

    useEffect(() => {
        const fetchTimeSheets = async () => {
            const q = query(collectionGroup(db, "timesheetEntries"));
            try {
                const querySnapshot = await getDocs(q);
                const sheets = await Promise.all(querySnapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    let fileUrl = '';
                    // If there is a file path and it's a leave type, get the file URL
                    if (data.filePath && data.type === 'leave') {
                        try {
                            const fileRef = ref(storage, data.filePath);
                            fileUrl = await getDownloadURL(fileRef);
                        } catch (error) {
                            console.error("Error fetching file URL:", error);
                        }
                    }
                    return {
                        id: doc.id,
                        path: doc.ref.path,
                        fileUrl, // Store the file URL if available
                        ...data
                    };
                }));
                setTimeSheets(sheets);
            } catch (error) {
                console.error("Error fetching timesheets:", error);
            }
        };

        fetchTimeSheets();
    }, []);

    const handleUpdateStatus = async (id, path, newStatus) => {
        const timesheetDocRef = doc(db, path);
        try {
            await updateDoc(timesheetDocRef, { status: newStatus });
            setTimeSheets(timeSheets.map(sheet => sheet.id === id ? { ...sheet, status: newStatus } : sheet));
        } catch (error) {
            console.error("Error updating timesheet status:", error);
        }
    };

    const renderTimeSheetRow = (sheet) => {
        // You can choose to pass down handleUpdateStatus or implement it within TimeSheetRow
        return (
            <TimeSheetRow
                key={sheet.id}
                sheet={sheet}
                onApprove={() => handleUpdateStatus(sheet.id, sheet.path, 'Approved')}
                onReject={() => handleUpdateStatus(sheet.id, sheet.path, 'Rejected')}
                isAdminView={true} // You can use this prop to determine the render of admin-specific actions
            />
        );
    };

    return (
        <>
            {timeSheets.length > 0 &&
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>Admin Timesheet Approval</Card.Title>
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Document</th>
                                        <th>Actions</th>
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

export default AdminTimeSheetView;
