"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaBuilding,
  FaUsers,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/contexts/ApiContext";

export default function Branch() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const { branches, deleteBranch, editBranch } = useApi();


  const [formData, setFormData] = useState({
    _id: '',
    name:'',
    address:'',
    phone_number:'',
    members_count:'0'
  })

  useEffect(() => {
      if (selectedBranch) {
        setFormData({
          _id: selectedBranch._id,
          name:selectedBranch.name || "",
          phone_number: selectedBranch.phone_number || "",
          address: selectedBranch?.address || "0",
          members_count: selectedBranch?.members_count || "0",
        });
      }
    }, [selectedBranch]);

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!selectedBranch) return;
    try {
      await deleteBranch(selectedBranch._id);
      setShowDeleteModal(false);
      setSelectedBranch(null);
    } catch (err) {
      console.error("Error deleting branch:", err);
    }
  };

   const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    editBranch(selectedBranch._id, formData);
    setShowEditModal(false);
    setSelectedBranch(null);
  };

  return (
    <div className="px-6 py-6 w-full h-full flex flex-col">
      {/* Header */}
      <Card className="border-0 shadow-none mb-[40px] sticky top-0 z-10">
        <CardContent className=" top-0 z-10 bg-background flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <FaBuilding size={20} /> Branches
            </h2>
            <p className="text-sm text-muted-foreground mt-3">
              Manage and view all branches in the system
            </p>
          </div>
          <Button
            className="flex items-center gap-2 "
            size="sm"
            onClick={() => navigate("/admin/add-branch")}
          >
            <FaPlus /> Add Branch
          </Button>
        </CardContent>
      </Card>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card
            key={branch._id}
            className="rounded-2xl shadow-sm flex flex-col"
          >
            <CardContent className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h5 className="text-lg font-semibold truncate">
                  {branch.name}
                </h5>
                <span className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 text-sm px-2 py-1 rounded-md">
                  {branch.members_count} <FaUsers />
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col gap-3 text-sm">
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-muted-foreground" />{" "}
                  {branch.address}
                </p>
                <p className="flex items-center gap-2">
                  <FaPhone className="text-muted-foreground" />{" "}
                  {branch.phone_number}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-4 text-xs text-muted-foreground mb-3">
                Updated: {new Date(branch.updatedAt).toLocaleString()}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-1"
                  onClick={() => {
                    setSelectedBranch(branch);
                    setShowEditModal(true);
                  }}
                >
                  <FaEdit /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1 flex items-center justify-center gap-1"
                  onClick={() => {
                    setSelectedBranch(branch);
                    setShowDeleteModal(true);
                  }}
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
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedBranch?.name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Branch Name */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                type="text"
                value={formData?.name}
                name='name'
                onChange={(e) =>handleChange(e)
                }
              />
            </div>

            {/* Address */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="branchAddress">Address</Label>
              <Input
                id="branchAddress"
                type="text"
                value={formData?.address}
                name='address'
                onChange={(e) =>handleChange(e)
                }
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="branchPhone">Phone Number</Label>
              <Input
                id="branchPhone"
                type="text"
                value={formData?.phone_number || ""}
                name='phone_number'
                onChange={(e) =>handleChange(e)
                }
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="members_count">No of members</Label>
              <Input
                id="members_count"
                type="text"
                value={formData?.members_count || "0"}
                name='members_count'
                onChange={(e) =>handleChange(e)
                }
              />
            </div>

            <DialogFooter className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
