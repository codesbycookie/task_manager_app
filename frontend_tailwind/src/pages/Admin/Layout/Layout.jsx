/* eslint-disable no-unused-vars */
"use client";
import React, { useState } from "react";
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
  IconPlus
} from "@tabler/icons-react";
import { IconBook, IconCheck, IconCreditCard } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";
import { useApi } from "@/contexts/ApiContext";

export function SidebarDemo() {


  const {logout } = useApi();


  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  }

  const links = [
    {
      label: "Dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0" />,
      href: "/admin",
    },
    {
      label: "Add User",
      icon: <IconUserPlus className="h-5 w-5 shrink-0" />,
      href: "/admin/add-user",
    },
    {
      label: "Add Task",
      icon: <IconClipboardPlus className="h-5 w-5 shrink-0" />,
      href: "/admin/add-task",
    },
    {
      label: "Branches",
      icon: <IconBuilding className="h-5 w-5 shrink-0" />,
      href: "/admin/branch",
    },
    {
      label: "Users",
      icon: <IconUsers className="h-5 w-5 shrink-0" />,
      href: "/admin/users",
    },
    {
      label: "Profile",
      icon: <IconUserBolt className="h-5 w-5 shrink-0" />,
      href: "/admin/profile",
    },
    {
      label: "Add branch",
      icon: <IconPlus className="h-5 w-5 shrink-0" />,
      href: "/admin/add-branch",
    }
    ,
    // {
    //   label: "Settings",
    //   icon: <IconSettings className="h-5 w-5 shrink-0" />,
    //   href: "/",
    // },
   
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full  flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        // for your use case, use `h-screen` instead of `h-[60vh]`
        "h-[100vh]"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
               <SidebarLink className={'hover:text-destructive'} onClick={(e) => handleLogout} link={{
      label: "Logout",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0" />,
      href: "/",
    }}/>
                
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Akilesh sampath",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="overflow-auto w-full">
              <Outlet />

      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        SAP CHECKLIST
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
