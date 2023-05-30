import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = "https://eczgrwcooijbnmjkjtha.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjemdyd2Nvb2lqYm5tamtqdGhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTQ2NzAwOCwiZXhwIjoyMDAxMDQzMDA4fQ.HXaQSDVB9CrSJ7Sbl1IK4YHDn_VkKYnO1or7-dFn7uk";
const supabase = createClient(supabaseUrl, supabaseKey);

// SALT should be created ONE TIME upon sign up
const salt = bcrypt.genSaltSync(10);

const Register = () => {
  const navigate = useNavigate();

  const [registrationKey, setRegKey] = useState(""); // [state, setState
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [alertVariant, setAlertVariant] = useState("danger"); // [state, setState]
  const [alertMessage, setAlertMessage] = useState(""); // [state, setState
  const [showAlert, setShowAlert] = useState(false); // [state, setState

  async function handleRegister(e) {
    e.preventDefault();

    if (registrationKey === "medcollege") {
      console.log("reg key ok!");
      if (username.length < 6) {
        console.log("username too short!");
        setAlertVariant("danger");
        setAlertMessage("Username must be at least 6 characters long!");
        setShowAlert(true);
        return;
      }

      if (password.length < 6) {
        console.log("password too short!");
        setAlertVariant("danger");
        setAlertMessage("Password must be at least 6 characters long!");
        setShowAlert(true);
        return;
      }

      const hash = bcrypt.hashSync(password, salt);

      const { error } = await supabase.from("users").insert({ username: username, password_hash: hash });

      if (error) {
        console.log("error");
        setAlertVariant("danger");
        setAlertMessage("An error occurred while registering!");
        setShowAlert(true);
        return;
      }

      setAlertVariant("success");
      setAlertMessage("You have successfully registered!");
      setShowAlert(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

      console.log("username and password ok!");
    } else {
      console.log("reg key invalid!");
      setAlertVariant("danger");
      setAlertMessage("To register, you must provide a valid registration key!");
      setShowAlert(true);
    }
  }

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "20%" }}>
        <h1 style={{ paddingBottom: "15px" }}>Register</h1>
        <Alert variant={alertVariant} show={showAlert}>
          {alertMessage}
        </Alert>
        <Form onSubmit={handleRegister}>
          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Registration Key</Form.Label>
            <Form.Control value={registrationKey} onChange={(e) => setRegKey(e.target.value)} type="regkey" placeholder="Enter registration key" />
          </Form.Group>

          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Username</Form.Label>
            <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder="Enter username" />
          </Form.Group>

          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Password</Form.Label>
            <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          </Form.Group>

          <Button size="lg" style={{ marginBottom: "15px", width: "100%" }} variant="primary" type="submit">
            Create account
          </Button>

          <p>
            If you have an account, click <Link to="/login">here</Link> to login.
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Register;
