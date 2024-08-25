"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import { useRequest } from "../_http/axiosFetcher";
import CustomButtonLoading from "../_components/CustomLoadingButton";
import TablePage from "./table";
import CardPage from "./card"; 

const Page = () => {
  const router = useRouter();
  const { data, isLoading } = useRequest("user", {
    module: "devApi",
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const [selectedSection, setSelectedSection] = useState("home");
  const [deletedId, setDeletedId] = useState<number | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCookie("token", "", {
      expires: new Date(Date.now()),
    });
    router.push("/");
  };

  const handleDeleteFromCard = (id: number) => {
    setDeletedId(id);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "home":
        return <div>Home Page</div>;
      case "card":
        return <CardPage onDelete={handleDeleteFromCard} />; 
      case "table":
        return <TablePage deletedId={deletedId} />; 
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex">
      <div className="w-1/5 bg-violet-600 text-white min-h-screen p-10 ">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <ul className="space-y-4 mt-10 ">
          <li
            className="cursor-pointer text-bold text-2xl"
            onClick={() => setSelectedSection("home")}
          >
            Home
          </li>
          <li
            className="cursor-pointer text-bold text-2xl"
            onClick={() => setSelectedSection("card")}
          >
            Card
          </li>
          <li
            className="cursor-pointer text-bold text-2xl"
            onClick={() => setSelectedSection("table")}
          >
            Table
          </li>
        </ul>
      </div>

      <div className="w-full">
        <div className="bg-violet-600 flex justify-end items-center text-white p-3">
          <button
            onClick={handleLogout}
            className=" bg-violet-800 text-white px-4 py-2 rounded-md"
          >
            LogOut
          </button>
        </div>
        <div className="">
          {renderSection()} 
        </div>
      </div>
    </div>
  );
};

export default Page;
