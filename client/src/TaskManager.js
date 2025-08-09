import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "/api/tasks";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  const [priorityFilter, setPriorityFilter] = useState("All");
  const [completionFilter, setCompletionFilter] = useState("All");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("Low");
  const [editDueDate, setEditDueDate] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error.response?.data?.message || error.message);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        API,
        { title, priority, dueDate: dueDate || null, completed: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([res.data, ...tasks]);
      setTitle("");
      setPriority("Low");
      setDueDate("");
    } catch (error) {
      console.error("❌ Error adding task:", error.response?.data?.message || error.message);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("❌ Error deleting task:", error.response?.data?.message || error.message);
    }
  };

  const toggleComplete = async (task) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${API}/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (error) {
      console.error("❌ Error updating task:", error.response?.data?.message || error.message);
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setEditTitle(task.title);
    setEditPriority(task.priority || "Low");
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditModalOpen(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!taskToEdit) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${API}/${taskToEdit._id}`,
        { title: editTitle, priority: editPriority, dueDate: editDueDate || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === res.data._id ? res.data : t)));
      setEditModalOpen(false);
    } catch (error) {
      console.error("❌ Error updating task:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">📝 Task Manager</h1>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add Task
          </button>
        </form>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={completionFilter} onChange={(e) => setCompletionFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>

        {/* Task List */}
        <ul className="space-y-3">
          {tasks
            .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter((task) => {
              if (priorityFilter !== "All" && task.priority !== priorityFilter) return false;
              if (completionFilter === "Completed" && !task.completed) return false;
              if (completionFilter === "Incomplete" && task.completed) return false;
              return true;
            })
            .map((task) => (
              <li key={task._id} className="bg-gray-50 p-4 rounded-md flex justify-between items-center shadow-sm">
                <div>
                  <span
                    onClick={() => toggleComplete(task)}
                    className={`cursor-pointer font-medium ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                  >
                    {task.title}
                  </span>
                  <div className="text-sm text-gray-500">
                    Priority: {task.priority} | Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEditClick(task)} className="text-blue-600 hover:text-blue-800">✏️</button>
                  <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:text-red-700">🗑️</button>
                </div>
              </li>
            ))}
        </ul>

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h3 className="text-lg font-bold mb-4">Edit Task</h3>
              <form onSubmit={handleUpdateTask}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md"
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md"
                />
                <div className="flex justify-end space-x-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    💾 Save
                  </button>
                  <button type="button" onClick={() => setEditModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskManager;
