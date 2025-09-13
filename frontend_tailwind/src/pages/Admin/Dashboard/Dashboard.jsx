"use client";
import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconUserPlus,
  IconClipboardPlus,
  IconBuilding,
  IconUsers,
  IconUserBolt,
  IconSettings,
  IconArrowLeft,
} from "@tabler/icons-react";
import {
  IconBook,
  IconCheck,
  IconCreditCard,
} from "@tabler/icons-react";



// Dummy dashboard component with content
export default function Dashboard  () {
  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-zinc-900 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
        Tuition Centre Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Staff
              </p>
              <h2 className="text-xl font-bold text-black dark:text-white">12</h2>
            </div>
            <IconUsers className="text-blue-500" />
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Students
              </p>
              <h2 className="text-xl font-bold text-black dark:text-white">180</h2>
            </div>
            <IconBook className="text-green-500" />
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending Tasks
              </p>
              <h2 className="text-xl font-bold text-black dark:text-white">24</h2>
            </div>
            <IconCheck className="text-yellow-500" />
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monthly Revenue
              </p>
              <h2 className="text-xl font-bold text-black dark:text-white">
                ₹85,000
              </h2>
            </div>
            <IconCreditCard className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-500">
            [ Task Completion Trend Chart ]
          </p>
        </div>

        {/* Tasks Table */}
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
          <h2 className="text-lg font-bold text-black dark:text-white mb-4">
            Recent Tasks
          </h2>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-neutral-700">
                <th className="py-2 px-3 text-gray-600 dark:text-gray-400">
                  Task
                </th>
                <th className="py-2 px-3 text-gray-600 dark:text-gray-400">
                  Assigned To
                </th>
                <th className="py-2 px-3 text-gray-600 dark:text-gray-400">
                  Deadline
                </th>
                <th className="py-2 px-3 text-gray-600 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  task: "Prepare Math Worksheets",
                  staff: "Mr. Kumar",
                  deadline: "10 Sep",
                  status: "Pending",
                },
                {
                  task: "Science Lab Setup",
                  staff: "Ms. Priya",
                  deadline: "12 Sep",
                  status: "In Progress",
                },
                {
                  task: "Collect Fee Reports",
                  staff: "Admin Staff",
                  deadline: "8 Sep",
                  status: "Completed",
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-neutral-800"
                >
                  <td className="py-2 px-3 text-black dark:text-white">
                    {row.task}
                  </td>
                  <td className="py-2 px-3 text-black dark:text-white">
                    {row.staff}
                  </td>
                  <td className="py-2 px-3 text-black dark:text-white">
                    {row.deadline}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        row.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : row.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
