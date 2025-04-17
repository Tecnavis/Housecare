import React, { useEffect, useState, useCallback } from "react";
import { Button, Alert, Table, Input } from "reactstrap";
import axios from "axios";
import { BASE_URL } from "./handle-api";

const SmsSender = () => {
  const [phones, setPhones] = useState([]);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch phone numbers
  const fetchPhones = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/smssender`, {
        timeout: 5000,
      });
      setPhones(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch phone numbers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhones();
  }, [fetchPhones]);

  const handleAddPhone = async () => {
    const trimmedPhone = phone.trim();
  
    // Validate for exactly 10 digits
    const isValidPhone = /^\d{10}$/.test(trimmedPhone);
    if (!isValidPhone) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
  
    // Prepend +91 for Indian format
    const formattedPhone = `+91${trimmedPhone}`;
  
    try {
      await axios.post(`${BASE_URL}/smssender`, { phone: formattedPhone });
      setPhone("");
      setError(""); // Clear previous errors
      fetchPhones();
    } catch (err) {
      setError("Failed to add phone number.");
    }
  };
  

  const handleRemovePhone = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/smssender/${id}`);
      fetchPhones();
    } catch (err) {
      setError("Failed to delete phone number.");
    }
  };

  const handleEditClick = (id, currentPhone) => {
    setEditingId(id);
    setNewPhone(currentPhone);
  };

  const handleUpdatePhone = async (id) => {
    if (!newPhone.trim()) {
      setError("Please enter a valid phone number.");
      return;
    }
    try {
      await axios.put(`${BASE_URL}/smssender/${id}`, { phone: newPhone });
      setEditingId(null);
      setNewPhone("");
      fetchPhones();
    } catch (err) {
      setError("Failed to update phone number.");
    }
  };

  

  return (
    <div className="container mt-4">
      <h2 className="text-center">Manage Phone Numbers</h2>
      {error && <Alert color="danger">{error}</Alert>}

      <div className="mb-3">
        <label className="form-label">Enter Phone Number</label>
        <div className="d-flex">
          <Input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button color="primary" className="ms-2" onClick={handleAddPhone}>
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
              <th>Phone Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {phones.length > 0 ? (
              phones.map(({ _id, phone }) => (
                <tr key={_id}>
                  <td>
                    {editingId === _id ? (
                      <Input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                      />
                    ) : (
                      phone
                    )}
                  </td>
                  <td>
                    {editingId === _id ? (
                      <Button
                        color="success"
                        size="sm"
                        onClick={() => handleUpdatePhone(_id)}
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button
                          color="warning"
                          size="sm"
                          onClick={() => handleEditClick(_id, phone)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleRemovePhone(_id)}
                        >
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
                  No phone numbers added
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default SmsSender;
