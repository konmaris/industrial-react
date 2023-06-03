import React, { useEffect, useState } from "react";

import { createClient } from "@supabase/supabase-js";
import useProfile from "./context/useProfile";
import { Button, Form } from "react-bootstrap";
const supabaseUrl = "https://eczgrwcooijbnmjkjtha.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjemdyd2Nvb2lqYm5tamtqdGhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTQ2NzAwOCwiZXhwIjoyMDAxMDQzMDA4fQ.HXaQSDVB9CrSJ7Sbl1IK4YHDn_VkKYnO1or7-dFn7uk";
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchUser(profile, setProfile) {
  const { data: user, error } = await supabase.from("users").select("school_id, user_id, username, contact_email, contact_phone, first_name, last_name, date_of_birth, address").eq("username", profile.username).single();

  if (error) {
    console.log(error);
    return;
  }

  console.log(user);

  const { data: school, error: schoolError } = await supabase.from("schools").select("school_id, school_name").eq("school_id", user.school_id).single();

  if (schoolError) {
    console.log(schoolError);
    return;
  }

  console.log(school);

  const { data: userProgramme, error: userProgrammeError } = await supabase.from("user_programmes").select("programme_id").eq("user_id", user.user_id).single();

  if (userProgrammeError) {
    console.log(userProgrammeError);
    return;
  }

  const { data: programme, error: programmeError } = await supabase.from("programmes").select("programme_name").eq("programme_id", userProgramme.programme_id).single();

  if (programmeError) {
    console.log(programmeError);
    return;
  }

  const { data: role, error: roleError } = await supabase.from("user_roles").select("role_id").eq("user_id", user.user_id).single();

  if (roleError) {
    console.log(roleError);
    return;
  }

  console.log(role);

  const { data: roleName, error: roleNameError } = await supabase.from("roles").select("role_description").eq("role_id", role.role_id).single();

  if (roleNameError) {
    console.log(roleNameError);
    return;
  }

  const { data: years, error: yearsError } = await supabase.from("user_years").select("year_started, year_finished").eq("user_id", user.user_id).single();

  if (yearsError) {
    console.log(yearsError);
    return;
  }

  console.log(years);

  console.log(roleName);

  setProfile({ ...user, school_name: school.school_name, programme_name: programme.programme_name, role: roleName.role_description, years });

  console.log(profile);
}

async function handleSaveProfile(e, profile, setProfile, { contactEmail, contactPhone, firstName, lastName, dateOfBirth, address }) {
  e.preventDefault();

  console.log("save profile");
  console.log({ profile });
  const { data, error } = await supabase.from("users").update({ first_name: firstName, last_name: lastName, contact_email: contactEmail, contact_phone: contactPhone, date_of_birth: dateOfBirth, address: address }).eq("user_id", profile.user_id).select();

  if (error) {
    console.log(error);
    return;
  }

  fetchUser(profile, setProfile);

  console.log("profile updated", data);
}

const Profile = () => {
  const { profile, setProfile } = useProfile();

  useEffect(() => {
    setContactEmail(profile.contact_email);
    setContactPhone(profile.contact_phone);
    setFirstName(profile.first_name);
    setLastName(profile.last_name);
    setDateOfBirth(profile.date_of_birth);
    setAddress(profile.address);
  }, [profile]);

  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchUser(profile, setProfile);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ marginLeft: "30px", marginTop: "30px" }}>
        <h1 className="mb-4">Profile</h1>
        {/* <pre>{JSON.stringify(profile, 0, 4)}</pre> */}
        <Form style={{ width: "30%" }} onSubmit={(e) => handleSaveProfile(e, profile, setProfile, { contactEmail, contactPhone, firstName, lastName, dateOfBirth, address })}>
          <h3>User details</h3>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={profile.username} disabled={true} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control type="text" placeholder="Enter role" value={profile.role} disabled={true} />
          </Form.Group>
          {profile.role !== "Administrator" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>School</Form.Label>
                <Form.Control type="text" placeholder="Enter school" value={profile.school_name} disabled={true} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Programme</Form.Label>
                <Form.Control type="text" placeholder="Enter programme" value={profile.programme_name} disabled={true} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Year started</Form.Label>
                <Form.Control type="text" placeholder="Enter year started" value={profile.years?.year_started} disabled={true} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Year finished</Form.Label>
                <Form.Control type="text" placeholder="Enter year finished" value={profile.years?.year_finished} disabled={true} />
              </Form.Group>
            </>
          )}

          <h3 className="mt-5">Personal details</h3>
          <Form.Group className="mb-3">
            <Form.Label>Contact email</Form.Label>
            <Form.Control type="text" placeholder="Enter contact email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contact phone</Form.Label>
            <Form.Control type="text" placeholder="Enter contact phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>First name</Form.Label>
            <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last name</Form.Label>
            <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date of birth</Form.Label>
            <Form.Control type="text" placeholder="Enter date of birth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Save profile
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
