import logo from "./logo.svg";
import "./App.css";

import { useEffect } from "react";
import Login from "./Login";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Register from "./Register";

import { createClient } from "@supabase/supabase-js";
import Profile from "./Profile";
import useProfile from "./context/useProfile";
import Users from "./Users";
import { Container, Nav, Navbar } from "react-bootstrap";
import Alumni from "./Alumni";
const supabaseUrl = "https://eczgrwcooijbnmjkjtha.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjemdyd2Nvb2lqYm5tamtqdGhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTQ2NzAwOCwiZXhwIjoyMDAxMDQzMDA4fQ.HXaQSDVB9CrSJ7Sbl1IK4YHDn_VkKYnO1or7-dFn7uk";
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(profile);
    if (profile.username !== "") {
      navigate("/profile");
    }
  }, [profile]);

  useEffect(() => {
    console.log(location.pathname);

    if (profile.username === "" && location.pathname !== "/login" && location.pathname !== "/register") {
      navigate("/login");
    }

    if (profile.username !== "" && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/profile");
    }
  }, [location, profile]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {profile.username !== "" && (
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/profile");
              }}
            >
              Alumni Office
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/profile");
                }}
              >
                Profile
              </Nav.Link>
              <Nav.Link
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/alumni");
                }}
              >
                Alumni
              </Nav.Link>
              <Nav.Link
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/users");
                }}
              >
                Users
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      )}

      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/users" element={<Users />} />
        <Route exact path="/alumni" element={<Alumni />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
