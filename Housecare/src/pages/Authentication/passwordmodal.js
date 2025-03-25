import { useState } from "react";
import axios from "axios";
import { Modal, Button } from "reactstrap";
import { BASE_URL } from "./handle-api";
import Swal from "sweetalert2";

const PasswordUpdateModal = ({ charityId, isOpen, toggle }) => {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePasswordUpdate = async () => {
        if (!newPassword) {
            setError("Password is required");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/charity/update-password`, {
                _id: charityId,
                newPassword
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message
            })
            toggle(); // Close modal
        } catch (err) {
            setError("Error updating password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="md">
            <div className="modal-header">
                <h5 className="modal-title">Update Password</h5>
                <button type="button" onClick={toggle} className="close">
                    <span>&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="mb-3">
                    <label>New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                    {error && <small className="text-danger">{error}</small>}
                </div>
                <Button color="primary" onClick={handlePasswordUpdate} disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </Button>
            </div>
        </Modal>
    );
};

export default PasswordUpdateModal;
