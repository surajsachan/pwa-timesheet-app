import React from 'react';
import { Button } from 'react-bootstrap';

const TimeSheetRow = ({ sheet, onApprove, onReject, isAdminView }) => {
    return (
        <tr>
            <td>{sheet.date}</td>
            <td>{sheet.startTime}</td>
            <td>{sheet.endTime}</td>
            <td>{sheet.description}</td>
            <td>{sheet.status}</td>
            {isAdminView && (
                <>
                    <td>
                        {sheet.fileUrl && (
                            <a href={sheet.fileUrl} target="_blank" rel="noopener noreferrer">View Document</a>
                        )}
                    </td>

                    <td>
                        {sheet.status === "Inprocess" && (
                            <>
                                <Button variant="success" size="sm" onClick={onApprove}>
                                    Approve
                                </Button>
                                {' '}
                                <Button variant="danger" size="sm" onClick={onReject}>
                                    Reject
                                </Button>
                            </>
                        )}
                    </td>
                </>
            )}
        </tr>
    );
};

export default TimeSheetRow;