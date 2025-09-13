"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useApi } from "@/contexts/ApiContext";

export default function AdminProfile() {


  const {admin} = useApi();

  const details = [
    { label: "Name", value: admin.name },
    { label: "Email", value: admin.email},
    { label: "Phone", value: admin.phone_number },
    { label: "UID", value: admin.uid },
    { label: "Address", value: admin.address },
    { label: "ID", value: admin._id },
  ];

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-md">
        {/* Header */}
        <CardHeader className="flex flex-col items-center gap-3 pb-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="https://assets.aceternity.com/manu.png" alt="Profile" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold tracking-wide">
            Admin Profile
          </h3>
        </CardHeader>

        <Separator />

        {/* Details */}
        <CardContent className="mt-4 space-y-4">
          {details.map((item, index) => (
            <div key={index} className="flex items-start justify-between">
              <strong className="text-sm font-medium text-muted-foreground w-24 shrink-0">
                {item.label}:
              </strong>
              <span className="text-sm text-foreground break-words">
                {item.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
