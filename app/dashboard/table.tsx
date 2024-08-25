"use client";

import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { TableEntry, FormValues } from "../types/tableTypes";


const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const TablePage = ({ deletedId }: { deletedId: number | null }) => {

  const { data: tables, mutate } = useSWR<TableEntry[]>("http://localhost:3001/tables", fetcher);

  const initialValues: FormValues = {
    name: "",
    surname: "",
    age: "",
    description: "",
    total: "",
    workplace: "",
  };

  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  
  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && currentId !== null) {
     
        await axios.put(`http://localhost:3001/tables/${currentId}`, formValues);
        toast.success("Table entry updated successfully!");
      } else {
     
        await axios.post("http://localhost:3001/tables", formValues);
        toast.success("Table entry created successfully!");
      }
      setModalIsOpen(false);
      mutate(); 
    } catch (error) {
      toast.error("An error occurred!");
    }
  };


  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/tables/${id}`);
      toast.success("Table entry deleted successfully!");
      mutate(); 
    } catch (error) {
      toast.error("Failed to delete the table entry.");
    }
  };

 
  const openModal = (entry: FormValues = initialValues, id: number | null = null) => {
    setModalIsOpen(true);
    setEditMode(id !== null);
    setCurrentId(id);
    setFormValues(entry);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  const filteredTables = tables
    ?.filter((table) =>
      Object.values(table).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((table) => (deletedId ? table.id !== deletedId : true));

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5 text-violet-800">Table Page</h1>
      <ToastContainer />

      <div className="mb-5">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-full"
        />
      </div>

      <button
        onClick={() => openModal()}
        className="bg-violet-800 text-white px-4 py-2 rounded-md mb-5 flex items-center"
      >
        <FaPlus className="mr-2 text-white" />
        Create
      </button>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Surname</th>
            <th className="py-2 px-4 border-b text-left">Age</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
            <th className="py-2 px-4 border-b text-left">Total</th>
            <th className="py-2 px-4 border-b text-left">Workplace</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTables && filteredTables.length > 0 ? (
            filteredTables.map((table) => (
              <tr key={table.id}>
                <td className="py-2 px-4 border-b text-left">{table.name}</td>
                <td className="py-2 px-4 border-b text-left">{table.surname}</td>
                <td className="py-2 px-4 border-b text-left">{table.age}</td>
                <td className="py-2 px-4 border-b text-left">{table.description}</td>
                <td className="py-2 px-4 border-b text-left">{table.total}</td>
                <td className="py-2 px-4 border-b text-left">{table.workplace}</td>
                <td className="py-2 px-4 border-b flex space-x-2">
                  <button
                    onClick={() => openModal(table, table.id)}
                    className="bg-violet-600 text-white px-2 py-1 rounded-md flex items-center"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(table.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md flex items-center"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No matching records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">
              {editMode ? "Edit Table Entry" : "Create New Table Entry"}
            </h2>
            <form onSubmit={handleCreateUpdate}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="surname"
                  placeholder="Surname"
                  value={formValues.surname}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="age"
                  placeholder="Age"
                  value={formValues.age}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="total"
                  placeholder="Total"
                  value={formValues.total}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="workplace"
                  placeholder="Workplace"
                  value={formValues.workplace}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-violet-600 text-white px-4 py-2 rounded-md"
                >
                  {editMode ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePage;
