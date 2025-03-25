import React, { useState, useEffect } from "react";
import { Row, Col, Card, Input, Container } from "reactstrap";
import Navbar from "./Navbars";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import axios from "axios";
import { BASE_URL } from "../Authentication/handle-api";

// Define the fetchStaff function
const fetchStaff = async () => {
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = token;
  try {
    const response = await axios.get(`${BASE_URL}/housecare`);
    return response.data;
  } catch (err) {
    console.error("staff list failed: internal error", err);
    throw err;
  }
};

const EmailCompose = ({ onShare }) => {
  document.title = "Email Compose | Housecare";
  const [ccInputs, setCcInputs] = useState([{ id: 1, value: "" }]);
  const [toAddress, setToAddress] = useState("narjishakuniyil@gmail.com");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState(() => {
    const initialContent = `Hello sir,\n\nThis is From Charity Organization For approval\n\nThank you,\nCharity Organization`;
    return EditorState.createWithContent(ContentState.createFromText(initialContent));
  });

  // State to hold fetched staff emails
  const [staffEmails, setStaffEmails] = useState([]);

  // Fetch staff data on component mount
  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const staffData = await fetchStaff();
        const emails = staffData.map(staff => staff.email);
        setStaffEmails(emails);
        // Pre-fill CC inputs with staff emails
        if (emails.length > 0) {
          setCcInputs(emails.map((email, index) => ({ id: Date.now() + index, value: email })));
        }
      } catch (err) {
        console.error("Failed to fetch staff emails:", err);
      }
    };

    loadStaffData();
  }, []);

  const addCcInput = () => {
    setCcInputs([...ccInputs, { id: Date.now(), value: "" }]);
  };

  const removeCcInput = id => {
    setCcInputs(ccInputs.filter(input => input.id !== id));
  };

  const handleCcChange = (id, value) => {
    setCcInputs(ccInputs.map(input => (input.id === id ? { ...input, value } : input)));
  };

  // Function to save email template
  const saveEmailTemplate = async (emailTemplate) => {
    try {
      // Assuming you have an endpoint to save email templates
      const response = await axios.post('/api/save-email-template', emailTemplate);
      console.log('Email template saved successfully:', response.data);
    } catch (err) {
      console.error('Failed to save email template:', err);
    }
  };

  const handleShare = async () => {
    try {
      const ccAddresses = [...ccInputs.map(input => input.value), ...staffEmails].filter(value => value);
      
      // Create email template object
      const emailTemplate = {
        to: toAddress,
        cc: ccAddresses,
        subject,
        message: message.getCurrentContent().getPlainText(),
      };

      // Save email template
      await saveEmailTemplate(emailTemplate);

      // Call the onShare callback if needed
      onShare(emailTemplate);
    } catch (error) {
      console.error("Error in handleShare:", error);
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      <Container className="container">
        <Row>
          <Col>
            <div>
              <Card>
                <div className="card-body">
                  <div>
                    <div className="mb-3">
                      <Input
                        type="email"
                        className="form-control"
                        placeholder="To"
                        value={toAddress}
                        onChange={e => setToAddress(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      {ccInputs.map((ccInput, index) => (
                        <div
                          key={ccInput.id}
                          style={{ display: "flex", alignItems: "center" }}
                          className="mb-2"
                        >
                          <Input
                            type="email"
                            className="form-control"
                            placeholder="CC"
                            value={ccInput.value}
                            onChange={e => handleCcChange(ccInput.id, e.target.value)}
                          />
                          <button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              marginLeft: "10px",
                            }}
                            onClick={addCcInput}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              color="black"
                              className="bi bi-plus-circle-dotted"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                            </svg>
                          </button>
                          {index > 0 && (
                            <button
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                marginLeft: "10px",
                              }}
                              onClick={() => removeCcInput(ccInput.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-x-circle-dotted"
                                viewBox="0 0 16 16"
                              >
                                <path d="M7.5 9.5v-3h1v3h-1zm0 2v-1h1v1h-1zm8-3.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8zM1.254 4.493a7 7 0 1 0 10.253 10.253A7 7 0 0 0 1.254 4.493zM12.732 3.268a6 6 0 1 1-8.464 8.464 6 6 0 0 1 8.464-8.464z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mb-3">
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                      />
                    </div>
                    <Editor
                      editorState={message}
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                      toolbarClassName="toolbar-class"
                      onEditorStateChange={setMessage}
                    />
                    <button
                      className="btn btn-primary mt-3"
                      onClick={handleShare}
                    >
                      Save template
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default EmailCompose;
