"use client";
import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { FormValues, TableEntry } from "../types/formTypes";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const CardPage = ({ onDelete }: { onDelete: (id: number) => void }) => {

  const { data: cards, mutate } = useSWR<TableEntry[]>("http://localhost:3001/tables", fetcher);

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
        toast.success("Card updated successfully!");
      } else {
        
        await axios.post("http://localhost:3001/tables", formValues);
        toast.success("Card created successfully!");
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
      toast.success("Card deleted successfully!");
      mutate(); 
      onDelete(id); 
    } catch (error) {
      toast.error("Failed to delete the card.");
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


const filteredCards = cards?.filter((card) =>
    Object.values(card).some((value) => {
      if (value == null) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );
  

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5 text-violet-800">Card Page</h1>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCards && filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <div 
              key={card.id} 
              className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
            >
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{card.name}</h2>
                <p>Surname: {card.surname}</p>
                <p>Age: {card.age}</p>
                <p>Description: {card.description}</p>
                <p>Total: {card.total}</p>
                <p>Workplace: {card.workplace}</p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => openModal(card, card.id)}
                  className="bg-violet-600 text-white px-2 py-1 rounded-md flex items-center"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md flex items-center"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No cards available.</p>
        )}
      </div>

      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">
              {editMode ? "Edit Card" : "Create New Card"}
            </h2>
            <form onSubmit={handleCreateUpdate}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="surname"
                  placeholder="Surname"
                  value={formValues.surname}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="age"
                  placeholder="Age"
                  value={formValues.age}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="total"
                  placeholder="Total"
                  value={formValues.total}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="workplace"
                  placeholder="Workplace"
                  value={formValues.workplace}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-violet-600 text-white px-4 py-2 rounded-md"
                >
                  {editMode ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
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

export default CardPage;
