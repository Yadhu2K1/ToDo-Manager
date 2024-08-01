import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const { loginDetails, setLoginDetails, setProjectDetails } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (loginDetails.id) {
      fetchProjects();
    }
  }, [loginDetails.id]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/project/fetch/${loginDetails.id}`);
      setProjects(response.data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats as MM/DD/YYYY
  };

  const handleView = (projectId, title) => {
    setProjectDetails({ projectId, title });
    navigate("/todo");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/project/delete`, { data: { projectId: id } });
      Swal.fire({
        title: "Project Deleted",
        icon: "success",
        confirmButtonText: "OK",
      });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleCreateProject = () => {
    navigate("/create-project");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleEdit = (projectId, currentTitle) => {
    setEditMode(true);
    setEditingProjectId(projectId);
    setNewTitle(currentTitle);
  };

  const handleSave = async () => {
    try {
      await axios.post(`http://localhost:5000/project/update`, {
        projectId: editingProjectId,
        title: newTitle
      });
      Swal.fire({
        title: "Project Title Updated",
        icon: "success",
        confirmButtonText: "OK",
      });
      setEditMode(false);
      setEditingProjectId(null);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project title:", error);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <button className={styles.createButton} onClick={handleCreateProject}>
          Create a Project
        </button>
        <div className={styles.welcomeMessage}>
          <h2>Welcome, {loginDetails.username}!</h2>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Log Out
        </button>
      </header>

      <main className={styles.projectList}>
        <h1>Your Projects</h1>
        <div className={styles.projectCards}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                {editMode && editingProjectId === project.id ? (
                  <div>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className={styles.editInput}
                    />
                    <button
                      className={styles.saveButton}
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => {
                        setEditMode(false);
                        setEditingProjectId(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3>{project.title}</h3>
                    <p className={styles.createdDate}>Created: {formatDate(project.created_date)}</p>
                    <div className={styles.projectActions}>
                      <button
                        className={styles.viewButton}
                        onClick={() => handleView(project.id, project.title)}
                      >
                        View
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </button>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(project.id, project.title)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No Projects to display!</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
