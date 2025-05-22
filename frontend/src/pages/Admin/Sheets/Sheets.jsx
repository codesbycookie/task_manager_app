import React, { useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import './Sheets.css'

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function Sheets() {
  const [selectedMonth, setSelectedMonth] = useState("2025-04");
  
  const tasks = [
    { _id: "1", title: "Complete Report", description: "Finish the annual report", assignedTo: "User 1", assignedBy: "Admin A", status: "Pending", priority: "High", deadline: "2025-04-05" },
    { _id: "2", title: "Fix UI Bugs", description: "Resolve UI issues in dashboard", assignedTo: "User 2", assignedBy: "Admin B", status: "In Progress", priority: "Medium", deadline: "2025-04-07" },
    { _id: "3", title: "Database Optimization", description: "Optimize DB queries", assignedTo: "User 1", assignedBy: "Admin A", status: "Completed", priority: "High", deadline: "2025-04-05" },
    { _id: "4", title: "Deploy API", description: "Deploy the latest API version", assignedTo: "User 3", assignedBy: "Admin C", status: "Pending", priority: "High", deadline: "2025-04-10" },
    { _id: "5", title: "Database Optimization", description: "Optimize DB queries", assignedTo: "User 1", assignedBy: "Admin A", status: "Completed", priority: "High", deadline: "2025-04-05" },
    { _id: "6", title: "Database Optimization", description: "Optimize DB queries", assignedTo: "User 1", assignedBy: "Admin A", status: "Completed", priority: "High", deadline: "2025-03-06" },

  ];

  const [year, month] = selectedMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${selectedMonth}-${String(day).padStart(2, "0")}`;
    const dayTasks = tasks.filter(task => task.deadline === dateStr);
    return { dateStr, tasks: dayTasks.length ? dayTasks : [{ title: "No Tasks Assigned" }] };
  });

  const columns = [
    { headerName: "Date", field: "dateStr", width: 120 },
    { headerName: "Title", field: "title", flex: 2 },
    { headerName: "Description", field: "description", flex: 3 },
    { headerName: "Assigned To", field: "assignedTo", flex: 1 },
    { headerName: "Assigned By", field: "assignedBy", flex: 1 },
    { headerName: "Status", field: "status", flex: 1 },
    { headerName: "Priority", field: "priority", flex: 1 },
  ];

  const rowData = calendarData.flatMap(({ dateStr, tasks }) => 
    tasks.map(task => ({ dateStr, ...task }))
  );

  return (
    <div className="container-fluid mt-4">
      <h3>User 1 Tasks</h3>
      <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="form-control w-auto mb-3" />
      <div className="table-container" style={{ overflow: "hidden", width: "100%" }}>

      <div className="ag-theme-alpine" style={{ height: '100vh',overflow: "hidden", width: "100%" }}>
        <AgGridReact
          modules={[ClientSideRowModelModule]}
          rowData={rowData}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={tasks.length + 31}
        />
      </div>
      </div>

    </div>
  );
}