import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useApi } from "@/contexts/ApiContext";

export default function AddBranch() {


  const {createBranch} = useApi();

  const [formData, setFormData] = useState({
    name: '',
    address:'',
    phone_number: ''
  })
  

const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData)
    createBranch(formData)
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-6 sticky top-0 z-10">
        {" "}
        <Card className="border-0 shadow-none ">
          <CardContent className=" top-0 z-10 bg-background  flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Add New Branch</h2>
              <p className="text-sm text-muted-foreground">
                Fill the details to create branch
              </p>
            </div>
            <Button size="sm" onClick={handleSubmit}>Save</Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-0">
        <Card className="border-0 shadow-none">
          <CardContent className="p-10">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" >
              {/* Name */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Branch Name</Label>
                <Input id="name" placeholder="John Doe" type="text" onChange={(e) => handleChange(e)}/>
              </div>

              


              <div className="flex flex-col space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input id="phone_number" placeholder="9876543210" type="tel" onChange={(e) => handleChange(e)}/>
              </div>

              {/* Address */}
              <div className="flex flex-col space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Street, City"
                  type="text"
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="members_count">Members Count</Label>
                <Input
                  id="members_count"
                  placeholder="10"
                  type="number"
                  
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
