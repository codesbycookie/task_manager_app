"use client";

import React, { useState } from "react";
import { useApi } from "@/contexts/ApiContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AddUser() {
  const { addUser, users, branches, fetchTasksForAddUserPage } = useApi();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    phone_number: "",
    address: "",
    copyFromUserId: "",
  });

  const [taskOptions, setTaskOptions] = useState([]);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "copyFromUserId") {
      try {
        const tasks = await fetchTasksForAddUserPage(value);
        setTaskOptions(tasks || []);
        setSelectedUserTasks([]);
      } catch (err) {
        console.error("Failed to fetch user tasks", err);
        setTaskOptions([]);
        setSelectedUserTasks([]);
      }
    }
  };

  const handleTaskToggle = (taskId) => {
    if (selectedUserTasks.includes(taskId)) {
      setSelectedUserTasks(selectedUserTasks.filter((id) => id !== taskId));
    } else {
      setSelectedUserTasks([...selectedUserTasks, taskId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tasksToCopy: selectedUserTasks,
    };

    addUser(payload);

    // Reset form
    setFormData({
      name: "",
      email: "",
      branch: "",
      phone_number: "",
      address: "",
      copyFromUserId: "",
    });
    setTaskOptions([]);
    setSelectedUserTasks([]);
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.branch.trim() !== "" &&
    formData.phone_number.trim() !== "" &&
    formData.address.trim() !== "";

  return (
    <div className="h-full w-full flex flex-col">
      {/* Sticky Header */}
      <div className="p-6 sticky top-0 z-10">
        <Card className="border-0 shadow-none">
          <CardContent className="bg-background flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Add New User</h2>
              <p className="text-sm text-muted-foreground">
                Fill the details to create a new user
              </p>
            </div>
            <Button size="sm" onClick={handleSubmit} disabled={!isFormValid}>
              Save
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto p-6 pt-0">
        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              {/* Copy From User */}
              <div className="flex flex-col space-y-2 md:col-span-2">
                <Label>Copy Tasks From User</Label>
                {users.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No users available
                  </p>
                )}

                <RadioGroup
                  value={formData.copyFromUserId}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "copyFromUserId", value },
                    })
                  }
                >
                  {users.map((user) => (
                    <div key={user._id} className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={user._id}
                          id={`copy-user-${user._id}`}
                        />
                        <Label htmlFor={`copy-user-${user._id}`}>
                          {user.name} ({user.email})
                        </Label>
                      </div>

                      {/* No tasks message */}
                      {formData.copyFromUserId === user._id &&
                        taskOptions.length === 0 && (
                          <p className="text-xs text-muted-foreground ml-6 mt-1">
                            This user has no tasks.{" "}
                            <a
                              href={`/admin/users/sheets/${user._id}`}
                              className="text-primary underline"
                            >
                              Add Task
                            </a>
                          </p>
                        )}
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Task Selection */}
              {taskOptions.length > 0 && (
                <div className="flex flex-col space-y-2 md:col-span-2">
                  <Label>Select Tasks to Copy</Label>
                  <div className="space-y-2">
                    {taskOptions.map((task) => (
                      <div key={task._id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`task-${task._id}`}
                          checked={selectedUserTasks.includes(task._id)}
                          onCheckedChange={() => handleTaskToggle(task._id)}
                        />
                        <Label htmlFor={`task-${task._id}`}>{task.title}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  placeholder="9876543210"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Address */}
              <div className="flex flex-col space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Street, City"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Branch selection */}
              <div className="flex flex-col space-y-2">
                <Label>Select Branch</Label>
                <RadioGroup
                  value={formData.branch}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "branch", value },
                    })
                  }
                >
                  {branches.map((branch) => (
                    <div key={branch._id} className="flex items-center space-x-2">
                      <RadioGroupItem value={branch._id} id={`branch-${branch._id}`} />
                      <Label htmlFor={`branch-${branch._id}`}>
                        {branch.name} ({branch.address})
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
