import React, { memo } from 'react';

const TimeSheetRow = memo(({ sheet }) => {
    console.log('Rendering row for timesheet', sheet.id);
    return (
        <tr key={sheet.id}>
            <td>{sheet.date}</td>
            <td>{sheet.startTime}</td>
            <td>{sheet.endTime}</td>
            <td>{sheet.description}</td>
            <td>{sheet.status}</td>
        </tr>
    );
});

export default TimeSheetRow;
