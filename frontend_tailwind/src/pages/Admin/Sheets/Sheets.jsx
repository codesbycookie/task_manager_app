"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  MdOutlineEdit,
  MdDelete,
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdToday,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosRefresh } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useApi } from "@/contexts/ApiContext";
import { getFilteredTaskStatuses } from "@/utils/StatusFilter";

function isSameDate(d1, d2) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

function getDaysInMonth(year, month) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function AdminSheets() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    deleteTask,
    fetchTasksForAdmin,
    tasks,
    sheetUser,
    loading,
    editTask,
    users,
  } = useApi();
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    frequency: "daily",
    users_assigned: [],
    date: "",
    days: [],
    dates: "",
  });

  useEffect(() => {
    if (selectedTask?.task) {
      setFormData({
        _id: selectedTask.task._id,
        title: selectedTask.task.title || "",
        frequency: selectedTask.task.frequency || "daily",
        users_assigned: selectedTask.task.users_assigned || [],
        date: selectedTask.task.date || "",
        days: selectedTask.task.days || [],
        dates: selectedTask.task.dates?.join(",") || "",
      });
    }
  }, [selectedTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const updatedTask = {
    _id: selectedTask.task._id,
    title: formData.title,
    frequency: formData.frequency,
    users_assigned: formData.users_assigned,
    ...(formData.frequency === "once" && { date: formData.date }),
    ...(formData.frequency === "weekly" && { days: formData.days }),
    ...(formData.frequency === "monthly" && {
      dates: formData.dates
        ? formData.dates.split(",").map((d) => parseInt(d.trim(), 10))
        : [],
    }),
  };

  try {
    await editTask(updatedTask, sheetUser);
    setShowEditModal(false);
    setSelectedTask(null);
  } catch (error) {
    console.error(error);
    alert("Failed to update task");
  }
};


  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const presetGroups = [
    { label: "Mon / Wed / Fri", value: ["Monday", "Wednesday", "Friday"] },
    { label: "Tue / Thu / Sat", value: ["Tuesday", "Thursday", "Saturday"] },
  ];

  

  useEffect(() => {
    // Only fetch if userId exists and tasks/sheetUser is not already set
    if (userId && !sheetUser?._id) {
      // console.log("Fetching tasks for user:", userId, "on date:", selectedDate.toISOString().split('T')[0]);
      fetchTasksForAdmin(userId, selectedDate.toISOString().split("T")[0]);
    }
  }, [userId, selectedDate]);

  const filteredTasks = useMemo(() => {
    // console.log("Filtering tasks for date:", tasks);
    return getFilteredTaskStatuses(tasks, selectedDate, statusFilter);
  }, [tasks, selectedDate, statusFilter]);

  const daysInMonth = getDaysInMonth(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  );

  const goToPreviousMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const goTo = (page) => {
    navigate(page);
  };

  console.log("Filtered Tasks:", filteredTasks);
  console.log("Sheet User:", sheetUser);

  console.log("tasks:", tasks);

  const confirmDelete = async () => {
    try {
      await deleteTask(selectedTask._id, userId, selectedDate);
      setShowDeleteModal(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {sheetUser.name}'s Task Dashboard
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">Last Login:</span>
            <span className="font-medium">
              {sheetUser.last_login
                ? formatDateTime(sheetUser.last_login)
                : "Never logged in"}
            </span>
          </div>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            className="flex items-center gap-1"
            onClick={() => goTo("/admin/add-task")}
          >
            <MdAdd size={18} />
            Add New Task
          </Button>
          <Button className="flex items-center gap-1">
            <IoIosRefresh size={18} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="shadow-sm border rounded-2xl">
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between  max-w-8/10 mx-auto mb-[50px]">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                {selectedDate.toLocaleString("default", { month: "long" })}{" "}
                <span className="text-muted-foreground">
                  {selectedDate.getFullYear()}
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={goToPreviousMonth}
              >
                <MdChevronLeft size={20} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={goToNextMonth}
              >
                <MdChevronRight size={20} />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button
                variant="secondary"
                size="sm"
                className="rounded-full px-4 flex items-center gap-1"
                onClick={goToToday}
              >
                <MdToday className="h-4 w-4" />
                Today
              </Button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground mb-3 max-w-8/10 mx-auto">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="uppercase tracking-wide">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2 justify-items-center max-w-8/10 mx-auto mt-[40px]">
            {Array.from({
              length: new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                1
              ).getDay(),
            }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {daysInMonth.map((day, i) => {
              const isToday = isSameDate(day, new Date());
              const isSelected = isSameDate(day, selectedDate);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "flex items-center justify-center h-12 w-12 rounded-full text-lg relative transition-all duration-200 ease-in-out",
                    "hover:bg-accent hover:text-accent-foreground",
                    isSelected &&
                      "bg-primary text-primary-foreground font-semibold shadow-md",
                    isToday && !isSelected && "ring-2 ring-primary/60"
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Tasks for Tuesday, Sep 10
            </h3>
            <p className="text-gray-500 text-sm">Showing 2 tasks</p>
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder="All Tasks"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
              <SelectItem value="not-completed">Not Completed</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Task Title</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Completed At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((n, idx) => (
                <TableRow
                  key={idx}
                  className={
                    n.status === "completed" ? "bg-green-50" : "bg-red-50"
                  }
                >
                  <TableCell className="font-bold">{idx + 1}.</TableCell>
                  <TableCell className="font-medium">{n.task.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded bg-gray-200 text-xs">
                      {n.task.frequency}
                    </span>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {(() => {
                      const { frequency, days, dates, date } = n.task;
                      if (frequency === "daily") return "Every day";
                      if (frequency === "weekly" && days?.length > 0)
                        return days.join(", ");
                      if (frequency === "monthly" && dates?.length > 0)
                        return dates.join(", ");
                      if (frequency === "once" && date)
                        return new Date(date).toLocaleDateString();
                      return "-";
                    })()}
                  </TableCell>
                  <TableCell>
                    {n.status === "completed" ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        ✅ Completed
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        ❌ Missed
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(n.task.createdAt)}</TableCell>
                  <TableCell>
                    {n.status === "completed"
                      ? formatDateTime(n.completedAt)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2"
                      onClick={() => {
                        setSelectedTask(n);
                        setShowEditModal(true);
                      }}
                    >
                      <MdOutlineEdit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:bg-red-100"
                      onClick={() => {
                        setSelectedTask(n);

                        setShowDeleteModal(true);
                      }}
                    >
                      <MdDelete size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        {console.log(selectedTask)}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedTask?.task.title}?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The task will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <Label>Task Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Assign Users */}
            <div>
              <Label>Assign Users</Label>
              <div className="space-y-2 max-h-[150px] overflow-y-auto border p-2 rounded">
                {users.map((u) => (
                  <div key={u._id} className="flex items-center gap-2">
                    
                    <Checkbox
                      checked={formData.users_assigned.includes(u._id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData((prev) => ({
                            ...prev,
                            users_assigned: [...prev.users_assigned, u._id],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            users_assigned: prev.users_assigned.filter(
                              (id) => id !== u._id
                            ),
                          }));
                        }
                      }}
                    />

                    <span>
                      {u.name} ({u.email})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <Label>Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, frequency: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once</SelectItem>

                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Inputs */}
            {formData.frequency === "once" && (
              <div>
                <Label>Date</Label>
                <Input type="date" name="date" onChange={handleChange} />{" "}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!formData.date}
                      className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? (
                        format(formData.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          date: date,
                        }))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {formData.frequency === "weekly" && (
              <div>
                <Label>Days</Label>
                <div className="flex flex-wrap gap-2">
                  <div className="grid grid-cols-3 gap-2">
  {weekDays.map((day) => (
    <div key={day} className="flex items-center space-x-2">
      <Checkbox
        checked={formData.days.includes(day)}
        onCheckedChange={(checked) =>
          setFormData((prev) => ({
            ...prev,
            days: checked
              ? [...prev.days, day]
              : prev.days.filter((d) => d !== day),
          }))
        }
      />
      <span>{day}</span>
    </div>
  ))}
</div>

{/* Presets */}
<div className="flex gap-4 mt-2">
  {presetGroups.map((group) => (
    <Button
      key={group.label}
      type="button"
      variant="outline"
      size="sm"
      onClick={() =>
        setFormData((prev) => {
          const alreadySelected = group.value.every((d) =>
            prev.days.includes(d)
          );
          return {
            ...prev,
            days: alreadySelected
              ? prev.days.filter((d) => !group.value.includes(d))
              : [...new Set([...prev.days, ...group.value])],
          };
        })
      }
    >
      {group.label}
    </Button>
  ))}
</div>

                </div>
              </div>
            )}

            {formData.frequency === "monthly" && (
              <div>
                <Label>Dates (comma separated)</Label>
                <Input
                  name="dates"
                  placeholder="e.g. 1, 15, 28"
                  value={formData.dates}
                  onChange={handleChange}
                />
              </div>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
