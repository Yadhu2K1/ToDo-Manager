import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import axios from "axios";
import "./Todo.css";
const exportToMarkdown = async (todos, projectDetails) => {
  if (!todos) return;

  const completedCount = todos.filter(todo => todo.status === "Completed").length;
  const totalCount = todos.length;
  let markdownContent = `# ${projectDetails.title}\n\nSummary: ${completedCount}/${totalCount} todos completed\n\n`;

  const createTodoSection = (status, todos) => {
    if (todos.length === 0) return '';
    const statusMark = status === "Completed" ? '[x]' : '[ ]';
    return `### ${status}\n${todos.map(todo => `- ${statusMark} ${todo.description}`).join('\n')}\n`;
  };

  const pendingTodos = todos.filter(todo => todo.status === "Pending");
  const completedTodos = todos.filter(todo => todo.status === "Completed");

  markdownContent += createTodoSection('Pending', pendingTodos);
  markdownContent += createTodoSection('Completed', completedTodos);

  const blob = new Blob([markdownContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'todo_list.md';
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link);

  try {
    const response = await axios.post(
      'https://api.github.com/gists',
      {
        public: false,
        files: {
          'todo_list.md': {
            content: markdownContent,
          },
        },
      },
      {
        headers: {
          Authorization: 'Bearer "Token Removed due to push declined due to repository rule violations"',
        },
      }
    );

    if (response.status === 201) {
      const gistUrl = response.data.html_url;
      alert(`Exported to Gist successfully! Link: ${gistUrl}`);
    } else {
      console.error('Failed to create gist:', response.statusText);
      alert('Failed to export markdown content as a Gist.');
    }
  } catch (error) {
    console.error('Error exporting to Gist:', error);
    alert('An error occurred while exporting markdown content as a Gist.');
  }
};

const Todo = () => {
  const navigate = useNavigate();
  const { projectDetails } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const [editMode, setEditMode] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  const fetchData = async () => {
    try {
      const id = projectDetails.projectId;
      const response = await axios.post("http://localhost:5000/todo/fetch", {
        projectId: id,
      });
      setTodos(response.data.todos || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (projectDetails) {
      fetchData();
    }
  }, [projectDetails]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredTodos(todos);
    } else {
      setFilteredTodos(todos.filter(todo => todo.status === filter));
    }
  }, [todos, filter]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "Invalid DateTime";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} at ${formattedTime}`;
  };

  const changeStatus = async (todoId, status, description) => {
    try {
      const newStatus = status === "Completed" ? "Pending" : "Completed";
      await axios.post("http://localhost:5000/todo/update", {
        id: todoId,
        status: newStatus,
        description,
      });
      fetchData();
      alert("Todo Updated");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete("http://localhost:5000/todo/delete", {
        data: { id: todoId },
      });
      fetchData();
      alert("Todo Deleted");
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (todoId, currentDescription) => {
    setEditMode(true);
    setEditingTodoId(todoId);
    setNewDescription(currentDescription);
  };

  const saveDescription = async () => {
    try {
      const response = await axios.post("http://localhost:5000/todo/update", {
        id: editingTodoId,
        description: newDescription,
        status: todos.find(todo => todo.id === editingTodoId).status,
      });

      if (response.data.message === "Todo updated successfully") {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === editingTodoId ? { ...todo, description: newDescription, updated_date: new Date() } : todo
          )
        );
        setEditMode(false);
        setEditingTodoId(null);
        alert("Todo Description Updated");
      } else {
        throw new Error("Failed to update todo description");
      }
    } catch (error) {
      console.error("Error updating description:", error);
      alert("Failed to update description");
    }
  };

  const createTodo = () => {
    navigate("/create-todo");
  };

  const backToHome = () => {
    navigate("/home");
  };

  const handleExport = () => {
    exportToMarkdown(todos, projectDetails);
  };

  return (
    <div className="todo-container">
      <div className="actions">
        <button className="create-button" onClick={createTodo}>
          Add Todo
        </button>
        <button className="export-button" onClick={handleExport}>
          Export to Markdown
        </button>
        <button className="back-button-2" onClick={backToHome}>
          Back
        </button>
      </div>
      <div className="filters">
        <button
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === "Pending" ? "active" : ""}`}
          onClick={() => setFilter("Pending")}
        >
          Pending
        </button>
        <button
          className={`filter-button ${filter === "Completed" ? "active" : ""}`}
          onClick={() => setFilter("Completed")}
        >
          Completed
        </button>
      </div>
      <div className="project-header">
        <h1>{projectDetails.title}</h1>
      </div>
      <div className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo, index) => (
            <div className="todo-card" key={todo.id}>
              <div className="todo-header">
                <span className="todo-index">#{index + 1}</span>
                <span className={`todo-status ${todo.status.toLowerCase()}`}>
                  {todo.status}
                </span>
              </div>
              <div className="todo-body">
                {editMode && editingTodoId === todo.id ? (
                  <div>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="edit-input"
                    />
                    <button className="save-button" onClick={saveDescription}>
                      Save
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => {
                        setEditMode(false);
                        setEditingTodoId(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="todo-description">{todo.description}</p>
                    <p className="todo-dates">
                      <span>Created: {formatDateTime(todo.created_date)}</span>
                      <br />
                      <span>Updated: {formatDateTime(todo.updated_date)}</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="todo-actions">
                <button
                  className="status-button"
                  onClick={() => changeStatus(todo.id, todo.status, todo.description)}
                >
                  Update Status
                </button>
                <button
                  className="edit-button"
                  onClick={() => startEditing(todo.id, todo.description)}
                >
                  Edit
                </button>
                <button
                  className="todo-delete-button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No todo(s) to display!</p>
        )}
      </div>
    </div>
  );
};

export default Todo;
