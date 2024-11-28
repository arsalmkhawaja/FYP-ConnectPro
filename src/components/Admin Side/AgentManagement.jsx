import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const ErrorModal = ({ show, message, onClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: colors.primary[400],
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "400px",
          position: "relative",
          color: colors.primary[100],
        }}
      >
        <h3 style={{ color: colors.redAccent[600] }}>Error</h3>
        <p>{message}</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              padding: "10px 15px",
              backgroundColor: colors.redAccent[600],
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: colors.primary[100],
          }}
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

const AgentManagement = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    phoneNumber: "",
    email: "",
    agentID: "",
    hiringDate: "",
    position: "",
    workSchedule: "",
    department: "",
    education: "",
    username: "",
    password: "",
    profileImage: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers([...response.data.agents]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const interval = setInterval(() => {
      fetchUsers();
    }, 500);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [token]);

  const validateUser = () => {
    const { phoneNumber, email, agentID } = newUser;

    if (!/^\d{10,15}$/.test(phoneNumber)) {
      setErrorMessage("Phone number must be between 10 to 15 digits.");
      setShowErrorModal(true);
      return false;
    }

    if (users.some((user) => user.email === email)) {
      setErrorMessage("This email is already in use.");
      setShowErrorModal(true);
      return false;
    }

    if (users.some((user) => user.agentID === agentID)) {
      setErrorMessage("This Agent ID is already in use.");
      setShowErrorModal(true);
      return false;
    }

    return true;
  };

  const handleAddUser = async () => {
    if (!validateUser()) return;

    const formData = new FormData();
    formData.append("agentID", newUser.agentID);
    formData.append("fullName", newUser.fullName);
    formData.append("dateOfBirth", newUser.dateOfBirth);
    formData.append("gender", newUser.gender);
    formData.append("address", newUser.address);
    formData.append("phoneNumber", newUser.phoneNumber);
    formData.append("email", newUser.email);
    formData.append("hiringDate", newUser.hiringDate);
    formData.append("position", newUser.position);
    formData.append("workSchedule", newUser.workSchedule);
    formData.append("department", newUser.department);
    formData.append("education", newUser.education);
    formData.append("username", newUser.username);
    formData.append("password", newUser.password);
    if (newUser.profileImage) {
      formData.append("profileImage", newUser.profileImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/register/agent",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUsers([...users, response.data.agent]);
      setShowModal(false);
      toast.success("Agent added successfully");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add agent");
    }
  };

  const handleEditUser = async () => {
    if (
      selectedUser.email !== newUser.email &&
      users.some((user) => user.email === newUser.email)
    ) {
      setErrorMessage("This email is already in use.");
      return;
    }

    if (
      selectedUser.agentID !== newUser.agentID &&
      users.some((user) => user.agentID === newUser.agentID)
    ) {
      setErrorMessage("This Agent ID is already in use.");
      return;
    }

    if (!/^\d{10,15}$/.test(newUser.phoneNumber)) {
      setErrorMessage("Phone number must be between 10 to 15 digits.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", newUser.fullName);
    formData.append("dateOfBirth", newUser.dateOfBirth);
    formData.append("gender", newUser.gender);
    formData.append("address", newUser.address);
    formData.append("phoneNumber", newUser.phoneNumber);
    formData.append("email", newUser.email);
    formData.append("hiringDate", newUser.hiringDate);
    formData.append("position", newUser.position);
    formData.append("workSchedule", newUser.workSchedule);
    formData.append("department", newUser.department);
    formData.append("education", newUser.education);
    formData.append("username", newUser.username);

    // Only append password if it's being changed
    if (newUser.password) {
      formData.append("password", newUser.password);
    }

    // Only append profile image if a new one is selected
    if (newUser.profileImage) {
      formData.append("profileImage", newUser.profileImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/agent/${selectedUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUsers = users.map((user) =>
        user._id === selectedUser._id ? response.data.agent : user
      );

      setUsers(updatedUsers);
      setShowModal(false);
      toast.success("Agent updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update agent");
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/agent/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== id));
      toast.success("Agent deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete agent");
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setNewUser({
      ...user,
      password: "",
    });
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      handleRemoveUser(userToDelete._id);
      closeConfirmDeleteModal();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setEditMode(false);
    setNewUser({
      fullName: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      phoneNumber: "",
      email: "",
      agentID: "",
      hiringDate: "",
      position: "",
      workSchedule: "",
      department: "",
      education: "",
      username: "",
      password: "",
      profileImage: null,
    });
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedUser(null);
  };

  const openConfirmDeleteModal = (user) => {
    setUserToDelete(user);
    setConfirmDeleteVisible(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteVisible(false);
    setUserToDelete(null);
  };

  const handleFileChange = (e) => {
    setNewUser({ ...newUser, profileImage: e.target.files[0] });
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName &&
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.agentID &&
        user.agentID.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: colors.primary[100] }}>Agents</h2>
        <div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: `1px solid ${colors.primary[300]}`,
              color: colors.primary[100],
              backgroundColor: colors.primary[400],
            }}
          />
          <button
            style={{
              padding: "10px 15px",
              backgroundColor: colors.greenAccent[500],
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
            onClick={() => setShowModal(true)}
          >
            + Add agent
          </button>
        </div>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: colors.greenAccent[500],
              color: colors.primary[100],
            }}
          >
            <th
              style={{
                padding: "10px",
                borderBottom: `1px solid ${colors.primary[300]}`,
                color: colors.primary[600],
              }}
            >
              Agent ID
            </th>
            <th
              style={{
                padding: "10px",
                borderBottom: `1px solid ${colors.primary[300]}`,
                color: colors.primary[600],
              }}
            >
              Agent Name
            </th>
            <th
              style={{
                padding: "10px",
                borderBottom: `1px solid ${colors.primary[300]}`,
                color: colors.primary[600],
              }}
            >
              Email
            </th>
            <th
              style={{
                padding: "10px",
                borderBottom: `1px solid ${colors.primary[300]}`,
                color: colors.primary[600],
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: "10px",
                borderBottom: `1px solid ${colors.primary[300]}`,
                color: colors.primary[600],
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr
                key={user._id}
                style={{
                  backgroundColor: colors.primary[400],
                  color: colors.primary[200],
                }}
              >
                <td
                  style={{
                    padding: "10px",
                    borderBottom: `1px solid ${colors.primary[300]}`,
                    color: colors.gray[100],
                  }}
                >
                  {user.agentID}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: `1px solid ${colors.primary[300]}`,
                    color: colors.gray[100],
                    cursor: "pointer",
                  }}
                  onClick={() => handleUserClick(user)}
                >
                  {user.fullName}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: `1px solid ${colors.primary[300]}`,
                    color: colors.gray[100],
                  }}
                >
                  {user.email}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: `1px solid ${colors.primary[300]}`,
                    color: colors.gray[100],
                  }}
                >
                  {user.status}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: `1px solid ${colors.primary[300]}`,
                    color: colors.gray[100],
                  }}
                >
                  <button
                    style={{
                      padding: "5px 10px",
                      backgroundColor: colors.blueAccent[600],
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      padding: "5px 10px",
                      backgroundColor: colors.redAccent[600],
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    onClick={() => openConfirmDeleteModal(user)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: colors.gray[100],
                }}
              >
                No agents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              backgroundColor: colors.primary[400],
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
              color: colors.primary[100],
            }}
          >
            <h3>{editMode ? "Edit User" : "Add User"}</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={(e) =>
                setNewUser({ ...newUser, fullName: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={newUser.dateOfBirth}
              onChange={(e) =>
                setNewUser({ ...newUser, dateOfBirth: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="text"
              placeholder="Gender"
              value={newUser.gender}
              onChange={(e) =>
                setNewUser({ ...newUser, gender: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="text"
              placeholder="Address"
              value={newUser.address}
              onChange={(e) =>
                setNewUser({ ...newUser, address: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newUser.phoneNumber}
              onChange={(e) =>
                setNewUser({ ...newUser, phoneNumber: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="text"
              placeholder="Agent ID"
              value={newUser.agentID}
              onChange={(e) =>
                setNewUser({ ...newUser, agentID: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="date"
              placeholder="Hiring Date"
              value={newUser.hiringDate}
              onChange={(e) =>
                setNewUser({ ...newUser, hiringDate: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="text"
              placeholder="Position"
              value={newUser.position}
              onChange={(e) =>
                setNewUser({ ...newUser, position: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="text"
              placeholder="Work Schedule"
              value={newUser.workSchedule}
              onChange={(e) =>
                setNewUser({ ...newUser, workSchedule: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="text"
              placeholder="Department"
              value={newUser.department}
              onChange={(e) =>
                setNewUser({ ...newUser, department: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="text"
              placeholder="Education"
              value={newUser.education}
              onChange={(e) =>
                setNewUser({ ...newUser, education: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="password"
              placeholder="New Password (optional)"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <input
              type="file"
              name="profileImage"
              onChange={handleFileChange}
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                width: "100%",
                backgroundColor: colors.primary[500],
                border: `1px solid ${colors.primary[300]}`,
                color: colors.primary[100],
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                style={{
                  padding: "10px 15px",
                  backgroundColor: colors.greenAccent[500],
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={editMode ? handleEditUser : handleAddUser}
              >
                {editMode ? "Update" : "Add"}
              </button>
              <button
                style={{
                  padding: "10px 15px",
                  backgroundColor: colors.redAccent[600],
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: colors.primary[100],
              }}
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {showViewModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              backgroundColor: colors.primary[400],
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
              color: colors.primary[100],
            }}
          >
            <h3>Agent Details</h3>
            <div style={{ marginBottom: "10px" }}>
              <label>Full Name</label>
              <input
                type="text"
                value={selectedUser?.fullName || ""}
                readOnly
                style={{
                  display: "block",
                  padding: "8px",
                  width: "100%",
                  backgroundColor: colors.primary[500],
                  border: `1px solid ${colors.primary[300]}`,
                  color: colors.primary[100],
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Date of Birth</label>
              <input
                type="text"
                value={selectedUser?.dateOfBirth || ""}
                readOnly
                style={{
                  display: "block",
                  padding: "8px",
                  width: "100%",
                  backgroundColor: colors.primary[500],
                  border: `1px solid ${colors.primary[300]}`,
                  color: colors.primary[100],
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Gender</label>
              <input
                type="text"
                value={selectedUser?.gender || ""}
                readOnly
                style={{
                  display: "block",
                  padding: "8px",
                  width: "100%",
                  backgroundColor: colors.primary[500],
                  border: `1px solid ${colors.primary[300]}`,
                  color: colors.primary[100],
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Address</label>
              <input
                type="text"
                value={selectedUser?.address || ""}
                readOnly
                style={{
                  display: "block",
                  padding: "8px",
                  width: "100%",
                  backgroundColor: colors.primary[500],
                  border: `1px solid ${colors.primary[300]}`,
                  color: colors.primary[100],
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Phone Number</label>
              <input
                type="text"
                value={selectedUser?.phoneNumber || ""}
                readOnly
                style={{
                  display: "block",
                  padding: "8px",
                  width: "100%",
                  backgroundColor: colors.primary[500],
                  border: `1px solid ${colors.primary[300]}`,
                  color: colors.primary[100],
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Email</label>
              <input
                type="email"
                value={selectedUser?.email || ""}
                readOnly
                style={{
                  display: "block",
                  padding: "8px",
                  width: "100%",
                  backgroundColor: colors.primary[500],
                  border: `1px solid ${colors.primary[300]}`,
                  color: colors.primary[100],
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Agent ID</label>
              <input
                type="text"
                value={selectedUser?.agentID || ""}
                readOnly
                style={{
                  display: "block",
                  padding: "8px",
                  width: "100%",
                  backgroundColor: colors.primary[500],
                  border: `1px solid ${colors.primary[300]}`,
                  color: colors.primary[100],
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Hiring Date</label>
              <input
                type="text"
                value={selectedUser?.hiringDate || ""}
                readOnly
                style={{
                  display: "block",
                  padding: "8px",
                  width: "100%",
                  backgroundColor: colors.primary[500],
                  border: `1px solid ${colors.primary[300]}`,
                  color: colors.primary[100],
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Position</label>
              <input
                type="text"
                value={selectedUser?.position || ""}
                readOnly
                style={{
                  display: "block",
                  padding: "8px",
                  width: "100%",
                  backgroundColor: colors.primary[500],
                  border: `1px solid ${colors.primary[300]}`,
                  color: colors.primary[100],
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Work Schedule</label>
              <input
                type="text"
                value={selectedUser?.workSchedule || ""}
                readOnly
                style={{ display: "block", padding: "8px", width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Department</label>
              <input
                type="text"
                value={selectedUser?.department || ""}
                readOnly
                style={{ display: "block", padding: "8px", width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Education</label>
              <input
                type="text"
                value={selectedUser?.education || ""}
                readOnly
                style={{
                  display: "block",
                  margin: "10px 0",
                  padding: "8px",
                  width: "100%",
                  backgroundColor: colors.primary[500],
                  border: `1px solid ${colors.primary[300]}`,
                  color: colors.primary[100],
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                style={{
                  padding: "10px 15px",
                  backgroundColor: colors.blueAccent[600],
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={closeViewModal}
              >
                Close
              </button>
            </div>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: colors.primary[100],
              }}
              onClick={closeViewModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {confirmDeleteVisible && (
        <div
          id="confirm-delete-modal"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              backgroundColor: colors.primary[400],
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
              color: colors.primary[100],
            }}
          >
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to remove{" "}
              <strong>{userToDelete?.fullName}</strong> with Agent ID{" "}
              <strong>{userToDelete?.agentID}</strong>?
            </p>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                style={{
                  padding: "10px 15px",
                  backgroundColor: colors.redAccent[600],
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleConfirmDelete}
              >
                Yes, Remove
              </button>
              <button
                style={{
                  padding: "10px 15px",
                  backgroundColor: colors.blueAccent[600],
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={closeConfirmDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
};

export default AgentManagement;
