import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/todos";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      const { data } = await axios.post(API_URL, { title, completed: false });
      setTodos([...todos, data]); // Update state instead of refetching
      setTitle("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id)); // Optimistic update
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-bold text-center mb-4">Todo List</h1>
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button className="bg-blue-500 text-white p-2 rounded" onClick={addTodo}>
          Add
        </button>
      </div>
      <ul className="mt-4">
        {todos.map((todo) => (
          <li key={todo.id} className="flex justify-between items-center p-2 border-b">
            <span
              onClick={() => toggleTodo(todo.id, todo.completed)}
              className={`cursor-pointer ${todo.completed ? "line-through text-gray-500" : ""}`}
            >
              {todo.title}
            </span>
            <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;