import logo from "./logo.svg";
import "./App.css";

import { useEffect, useState } from "react";
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
import AlumniProfile from "./AlumniProfile";
const supabaseUrl = "https://eczgrwcooijbnmjkjtha.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjemdyd2Nvb2lqYm5tamtqdGhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTQ2NzAwOCwiZXhwIjoyMDAxMDQzMDA4fQ.HXaQSDVB9CrSJ7Sbl1IK4YHDn_VkKYnO1or7-dFn7uk";
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const { profile, setProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {loggedIn && (
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
                  setProfile({});
                  setLoggedIn(false);
                  navigate("/login");
                }}
              >
                Logout
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      )}

      <Routes>
        <Route exact path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/users" element={<Users />} />
        <Route path="/alumni">
          <Route path="/alumni/" element={<Alumni />} />
          <Route path="/alumni/:id" element={<AlumniProfile />} />
        </Route>

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
