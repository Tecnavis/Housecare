import React, { useEffect, useState, useCallback } from "react";
import { Button, Alert, Table, Input } from "reactstrap";
import axios from "axios";
import { BASE_URL } from "./handle-api";

const EmailSender = () => {
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch emails function
  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/emailsender`, {
        timeout: 5000, 
      });
      setEmails(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch emails.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const handleAddEmail = async () => {
    if (email.trim() === "" || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/emailsender`, { email });
      setEmail("");
      fetchEmails(); 
    } catch (err) {
      setError("Failed to add email.");
    }
  };

  const handleRemoveEmail = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/emailsender/${id}`);
      fetchEmails(); 
    } catch (err) {
      setError("Failed to delete email.");
    }
  };

  const handleEditClick = (id, currentEmail) => {
    setEditingId(id);
    setNewEmail(currentEmail);
  };

  const handleUpdateEmail = async (id) => {
    if (newEmail.trim() === "" || !newEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      await axios.put(`${BASE_URL}/emailsender/${id}`, { email: newEmail });
      setEditingId(null);
      setNewEmail("");
      fetchEmails();
    } catch (err) {
      setError("Failed to update email.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Manage Emails</h2>
      {error && <Alert color="danger">{error}</Alert>}

      <div className="mb-3">
        <label className="form-label">Enter Email Address</label>
        <div className="d-flex">
          <Input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button color="primary" className="ms-2" onClick={handleAddEmail}>
            Add
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <Table bordered>
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {emails.length > 0 ? (
              emails.map(({ _id, email }) => (
                <tr key={_id}>
                  <td>
                    {editingId === _id ? (
                      <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    ) : (
                      email
                    )}
                  </td>
                  <td>
                    {editingId === _id ? (
                      <Button color="success" size="sm" onClick={() => handleUpdateEmail(_id)}>
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button color="warning" size="sm" onClick={() => handleEditClick(_id, email)}>
                          Edit
                        </Button>
                        <Button color="danger" size="sm" className="ms-2" onClick={() => handleRemoveEmail(_id)}>
                          Remove
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">
                  No emails added
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default EmailSender;
