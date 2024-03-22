import React, { useState } from 'react';
import { FloatingLabel, Form, Button, Alert, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { db, storage } from "../../firebase";
import { collection, doc, addDoc, updateDoc } from 'firebase/firestore';
import { useUserAuth } from "../../context/UserAuthContext";
import { ref, uploadBytes } from 'firebase/storage';
import { formatDate, formatTime } from './utils';

function FillTimesheet() {
    const [type, setType] = useState('work');
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [description, setDescription] = useState('');
    const [leaveEmail, setLeaveEmail] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const { user } = useUserAuth();

    const resetForm = () => {
        setType('work');
        setDate(new Date());
        setStartTime(new Date());
        setEndTime(new Date());
        setDescription('');
        setLeaveEmail(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userEmailOrId = user.uid;
        const userDocRef = doc(db, "timesheets", userEmailOrId);
        let timesheetData = {
            type,
            date: formatDate(date.toISOString()),
            description,
            status: "Inprocess"
        };

        if (type === 'work') {
            timesheetData = {
                ...timesheetData,
                startTime: formatTime(startTime.toISOString()),
                endTime: formatTime(endTime.toISOString())
            };
        }

        try {
            const timesheetDataRef = collection(userDocRef, "timesheetEntries");
            const docRef = await addDoc(timesheetDataRef, timesheetData);

            if (type === 'leave' && leaveEmail) {
                const filePath = `leaveEmails/${user.uid}/${docRef.id}`;
                const fileRef = ref(storage, filePath);
                await uploadBytes(fileRef, leaveEmail);
                await updateDoc(docRef, { filePath });
            }

            setMessage({ text: 'Timesheet submitted successfully.', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 5000); // Notification disappears after 5 seconds

            resetForm(); // Reset the form fields after successful submission
        } catch (error) {
            setMessage({ text: `Error submitting timesheet: ${error.message}`, type: 'danger' });
            setTimeout(() => setMessage({ text: '', type: '' }), 5000); // Notification disappears after 5 seconds
        }
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>Fill Timesheet</Card.Title>
                {message.text && (
                    <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
                        {message.text}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTimeSheetType">
                        <FloatingLabel controlId="floatingSelect" label="Select Type">
                            <Form.Select aria-label="Select Type" value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="work">Attendance</option>
                                <option value="leave">Leave</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Form.Group>
                    <br />
                    <Form.Group controlId="formTimeSheetDate">
                        <Form.Label>Date :-</Form.Label>
                        <DatePicker selected={date} onChange={setDate} />
                    </Form.Group>
                    {type === 'work' && (
                        <>
                            <Form.Group controlId="formTimeSheetStartTime">
                                <Form.Label>Start Time :-</Form.Label>
                                <DatePicker selected={startTime} onChange={setStartTime} showTimeSelect showTimeSelectOnly timeIntervals={30} timeCaption="Time" dateFormat="h:mm aa" />
                            </Form.Group>
                            <Form.Group controlId="formTimeSheetEndTime">
                                <Form.Label>End Time :-</Form.Label>
                                <DatePicker selected={endTime} onChange={setEndTime} showTimeSelect showTimeSelectOnly timeIntervals={30} timeCaption="Time" dateFormat="h:mm aa" />
                            </Form.Group>
                        </>
                    )}
                    <Form.Group controlId="formTimeSheetDescription">
                        <FloatingLabel controlId="floatingDesceription" label="Description">
                            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>
                    {type === 'leave' && (
                        <Form.Group controlId="formTimeSheetLeaveEmail">
                            <Form.Label>Leave Email</Form.Label>
                            <Form.Control type="file" onChange={(e) => setLeaveEmail(e.target.files[0])} />
                        </Form.Group>
                    )}
                    <br />
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default FillTimesheet;
