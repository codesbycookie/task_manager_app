"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FaUser, FaTrash, FaEye, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaSignInAlt, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/contexts/ApiContext";

export default function Users() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const {users} = useApi();
  const navigate = useNavigate();
  

  const formatDateTime = (date) => {
    if (!date) return "Not Yet Logged In";
    return new Date(date).toLocaleString("en-IN", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div className="px-6 py-6 w-full h-full flex flex-col">
      {/* Header */}
      

      <Card className="border-0 shadow-none mb-[40px] sticky top-0 z-10">
          <CardContent className=" top-0 z-10 bg-background flex items-center justify-between">
            <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold "><FaUser /> User Management</h2>
              <p className="text-sm text-muted-foreground mt-3">
                Manage and view all users in the system
              </p>
            </div>
<div className="flex items-center gap-4">
  <Label className="flex items-center gap-1"><FaFilter /> Branch:</Label>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="1">Anna Nagar</SelectItem>
              <SelectItem value="2">Velachery</SelectItem>
            </SelectContent>
          </Select> 
</div>
         </CardContent>
        </Card>
      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user._id} className="rounded-2xl shadow-sm flex flex-col">
            <CardContent className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h5 className="text-lg font-semibold">{user.name}</h5>
                <span className="px-2 py-1 rounded-md border text-sm text-muted-foreground">ID: {user._id}</span>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <FaEnvelope className="mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FaBuilding className="mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Branch</p>
                    <p>{user.branch?.name || "Branch deleted"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FaPhone className="mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p>{user.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p>{user.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FaSignInAlt className="mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Login</p>
                    <p>{formatDateTime(user.last_login)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1 flex items-center justify-center gap-1" onClick={() => navigate('/admin/users/sheets/' + user._id)}>
                  <FaEye /> View Sheet
                </Button>
                <Button size="sm" variant="destructive" className="flex-1 flex items-center justify-center gap-1"
                  onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                >
                  <FaTrash /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p>Are you sure you want to delete <strong>{selectedUser?.name}</strong>?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive">Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
