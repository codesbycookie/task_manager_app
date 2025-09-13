"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { useApi } from "@/contexts/ApiContext";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("");
  const [date, setDate] = useState(null);
  const [days, setDays] = useState([]);
  const [dates, setDates] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);

  const { assignTask, users } = useApi();

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const presetGroups = [
    { label: "Mon / Wed / Fri", value: ["Monday", "Wednesday", "Friday"] },
    { label: "Tue / Thu / Sat", value: ["Tuesday", "Thursday", "Saturday"] },
  ];

  // Toggle user assignment
  const toggleUser = (userId) => {
    setAssignedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Toggle weekdays
  const toggleDay = (day) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Submit task
  const handleSubmit = async (e) => {
    e.preventDefault();

    const task = {
      title,
      frequency,
      users_assigned: assignedUsers,
      ...(frequency === "once" && { date }),
      ...(frequency === "weekly" && { days }),
      ...(frequency === "monthly" && {
        dates: dates.split(",").map((d) => parseInt(d.trim())),
      }),
    };

    await assignTask(task);
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Sticky header */}
      <div className="p-6 sticky top-0 z-10">
        <Card className="border-0 shadow-none">
          <CardContent className="flex items-center justify-between bg-background">
            <div>
              <h2 className="text-lg font-semibold">Add New Task</h2>
              <p className="text-sm text-muted-foreground">
                Fill the details to create a task
              </p>
            </div>
            <Button size="sm" onClick={handleSubmit}>Save</Button>
          </CardContent>
        </Card>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto p-6 pt-0">
        <Card className="border-0 shadow-none">
          <CardContent className="p-10">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
              {/* Task Title */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Assign Users */}
              <div className="flex flex-col space-y-2">
                <Label>Assign Users</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={assignedUsers.length === users.length}
                    onCheckedChange={(checked) =>
                      checked ? setAssignedUsers(users.map((u) => u._id)) : setAssignedUsers([])
                    }
                  />
                  <span>Select All</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {users.map((user) => (
                    <div key={user._id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={assignedUsers.includes(user._id)}
                        onCheckedChange={() => toggleUser(user._id)}
                      />
                      <span>{user.name} ({user.email})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="flex flex-col space-y-2">
                <Label>Frequency</Label>
                <Select onValueChange={setFrequency} value={frequency}>
                  <SelectTrigger className="w-full max-w-sm">
                    <SelectValue placeholder="Choose frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Frequency fields */}
              {frequency === "once" && (
                <div className="flex flex-col space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!date}
                        className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {frequency === "weekly" && (
                <div className="flex flex-col space-y-2">
                  <Label>Days</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {weekDays.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          checked={days.includes(day)}
                          onCheckedChange={() => toggleDay(day)}
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
                          setDays((prev) => {
                            const alreadySelected = group.value.every((d) => prev.includes(d));
                            return alreadySelected
                              ? prev.filter((d) => !group.value.includes(d))
                              : [...new Set([...prev, ...group.value])];
                          })
                        }
                      >
                        {group.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {frequency === "monthly" && (
                <div className="flex flex-col space-y-2">
                  <Label>Dates (comma-separated)</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 5, 15, 25"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                  />
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
