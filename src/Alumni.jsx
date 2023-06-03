import React, { useEffect, useState } from "react";

import { createClient } from "@supabase/supabase-js";
import { Button, Card } from "react-bootstrap";

import PersonPicture from "./img/person.png";
import { useNavigate } from "react-router-dom";
import useProfile from "./context/useProfile";
import NewAlumniModal from "./NewAlumniModal";
const supabaseUrl = "https://eczgrwcooijbnmjkjtha.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjemdyd2Nvb2lqYm5tamtqdGhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTQ2NzAwOCwiZXhwIjoyMDAxMDQzMDA4fQ.HXaQSDVB9CrSJ7Sbl1IK4YHDn_VkKYnO1or7-dFn7uk";
const supabase = createClient(supabaseUrl, supabaseKey);

const Alumni = () => {
  const { profile } = useProfile();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [registeredAlumni, setRegisteredAlumni] = useState([]);
  const [appliedAlumni, setAppliedAlumni] = useState([]);
  const [visitors, setVisitors] = useState([]);

  const navigate = useNavigate();

  async function fetchUsers() {
    const { data: _users, error } = await supabase.from("users").select("school_id, user_id, username, contact_email, contact_phone, first_name, last_name, date_of_birth, address");

    if (error) {
      console.log(error);
      return;
    }

    //remove current user from list of users
    const currentUser = _users.filter((user) => user.username === profile.username);
    const users = _users.filter((user) => user.username !== profile.username);

    // console.log(currentUser);

    const { data: userRoles, error: userRolesError } = await supabase.from("user_roles").select("role_id, user_id");

    if (userRolesError) {
      console.log(userRolesError);
      return;
    }

    const { data: roles, error: rolesError } = await supabase.from("roles").select("role_id, role_description");

    if (rolesError) {
      console.log(rolesError);
      return;
    }

    //   console.log(users);
    //   console.log(userRoles);
    //   console.log(roles);

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < userRoles.length; j++) {
        if (users[i].user_id === userRoles[j].user_id) {
          for (let k = 0; k < roles.length; k++) {
            if (userRoles[j].role_id === roles[k].role_id) {
              users[i].role = roles[k].role_description;
            }
          }
        }
      }
    }

    const { data: schools, error: schoolsError } = await supabase.from("schools").select("school_id, school_name");

    if (schoolsError) {
      console.log(schoolsError);
      return;
    }

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < schools.length; j++) {
        if (users[i].school_id === schools[j].school_id) {
          users[i].school_name = schools[j].school_name;
        }
      }
    }

    //find alumnus programme
    const { data: programmes, error: programmesError } = await supabase.from("programmes").select("programme_id, programme_name");

    if (programmesError) {
      console.log(programmesError);
      return;
    }

    console.log(programmes);

    const { data: alumniProgrammes, error: alumniProgrammesError } = await supabase.from("user_programmes").select("user_id, programme_id");

    if (alumniProgrammesError) {
      console.log(alumniProgrammesError);
      return;
    }

    console.log(alumniProgrammes);

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < alumniProgrammes.length; j++) {
        if (users[i].user_id === alumniProgrammes[j].user_id) {
          for (let k = 0; k < programmes.length; k++) {
            if (alumniProgrammes[j].programme_id === programmes[k].programme_id) {
              console.log("dick");
              users[i].programme_name = programmes[k].programme_name;
            }
          }
        }
      }
    }

    const registeredAlumni = users.filter((user) => user.role === "Registered Alumni");
    setRegisteredAlumni(registeredAlumni);

    const appliedAlumni = users.filter((user) => user.role === "Applied Alumni");
    setAppliedAlumni(appliedAlumni);

    const visitors = users.filter((user) => user.role === "Visitor");
    setVisitors(visitors);

    console.log(users);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ margin: "50px" }}>
      <NewAlumniModal show={show} handleClose={handleClose} handleShow={handleShow} />
      <h1>Alumni</h1>
      <Button className="mb-4" variant="primary" onClick={handleShow}>
        New alumni
      </Button>
      <div className="mb-4">
        <h3>Registered alumni</h3>
        {registeredAlumni.map((alumnus) => (
          <Card style={{ width: "18rem" }}>
            <Card.Img style={{ width: "30%", paddingLeft: "20px", paddingTop: "20px" }} variant="top" src={PersonPicture} />
            <Card.Body>
              <Card.Title>
                {alumnus.first_name} {alumnus.last_name}
              </Card.Title>
              <Card.Text>{alumnus.programme_name}</Card.Text>
              <Card.Text>{alumnus.school_name}</Card.Text>
              <Button
                onClick={() => {
                  navigate(`/alumni/${alumnus.user_id}`);
                }}
                variant="primary"
              >
                Visit profile
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className="mb-4">
        <h3>Applied alumni</h3>
        {appliedAlumni.map((alumnus) => (
          <Card style={{ width: "18rem" }}>
            <Card.Img style={{ width: "30%", paddingLeft: "20px", paddingTop: "20px" }} variant="top" src={PersonPicture} />
            <Card.Body>
              <Card.Title>
                {alumnus.first_name} {alumnus.last_name}
              </Card.Title>
              <Card.Text>{alumnus.programme_name}</Card.Text>
              <Card.Text>{alumnus.school_name}</Card.Text>
              <Button
                onClick={() => {
                  navigate(`/alumni/${alumnus.user_id}`);
                }}
                variant="primary"
              >
                Visit profile
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className="mb-4">
        <h3>Visitors</h3>
        {visitors.map((alumnus) => (
          <Card style={{ width: "18rem" }}>
            <Card.Img style={{ width: "30%", paddingLeft: "20px", paddingTop: "20px" }} variant="top" src={PersonPicture} />
            <Card.Body>
              <Card.Title>
                {alumnus.first_name} {alumnus.last_name}
              </Card.Title>
              <Card.Text>{alumnus.programme_name}</Card.Text>
              <Card.Text>{alumnus.school_name}</Card.Text>
              <Button
                onClick={() => {
                  navigate(`/alumni/${alumnus.user_id}`);
                }}
                variant="primary"
              >
                Visit profile
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Alumni;
