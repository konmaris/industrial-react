import React, { useEffect, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import useProfile from "./context/useProfile";
const supabaseUrl = "https://eczgrwcooijbnmjkjtha.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjemdyd2Nvb2lqYm5tamtqdGhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTQ2NzAwOCwiZXhwIjoyMDAxMDQzMDA4fQ.HXaQSDVB9CrSJ7Sbl1IK4YHDn_VkKYnO1or7-dFn7uk";
const supabase = createClient(supabaseUrl, supabaseKey);

const Login = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [alertVariant, setAlertVariant] = useState("danger"); // [state, setState]
  const [alertMessage, setAlertMessage] = useState(""); // [state, setState
  const [showAlert, setShowAlert] = useState(false); // [state, setState

  async function handleLogin(e) {
    e.preventDefault();

    const { data: user, error } = await supabase.from("users").select("*").eq("username", username);

    if (error) {
      console.log("error");
      setAlertVariant("danger");
      setAlertMessage("An error occurred while logging in!");
      setShowAlert(true);
      return;
    }

    if (user.length === 0) {
      console.log("user not found");
      setAlertVariant("danger");
      setAlertMessage("User not found!");
      setShowAlert(true);
      return;
    }

    const match = bcrypt.compareSync(password, user[0].password_hash);

    //find user role
    const { data: role, error: roleError } = await supabase.from("user_roles").select("role_id").eq("user_id", user[0].user_id).single();

    if (roleError) {
      console.log("error");
      setAlertVariant("danger");
      setAlertMessage("An error occurred while logging in!");
      setShowAlert(true);
      return;
    }

    console.log(role);

    if (match) {
      console.log("password correct!");
      console.log(user[0].user_id);
      setProfile({ id: user[0].user_id, username: user[0].username, role_id: role.role_id });
      setLoggedIn(true);
      navigate("/profile");
      setAlertVariant("success");
      setAlertMessage("Logged in successfully!");
      setShowAlert(true);
    } else {
      console.log("password incorrect!");
      setAlertVariant("danger");
      setAlertMessage("Password incorrect!");
      setShowAlert(true);
    }
  }

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "20%" }}>
        <h1 style={{ paddingBottom: "15px" }}>Login</h1>
        <Alert variant={alertVariant} show={showAlert}>
          {alertMessage}
        </Alert>
        <Form onSubmit={handleLogin}>
          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Username</Form.Label>
            <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder="Enter username" />
          </Form.Group>

          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Password</Form.Label>
            <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          </Form.Group>

          <Button size="lg" style={{ marginBottom: "15px", width: "100%" }} variant="primary" type="submit">
            Login
          </Button>

          <p>
            If you aren't registered yet, click <Link to="/register">here</Link> to register.
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
