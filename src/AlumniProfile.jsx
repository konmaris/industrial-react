import React, { useEffect, useState } from "react";

import { createClient } from "@supabase/supabase-js";
import useProfile from "./context/useProfile";

import UserPicture from "./img/person.png";
import { Button, Form, Image } from "react-bootstrap";
const supabaseUrl = "https://eczgrwcooijbnmjkjtha.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjemdyd2Nvb2lqYm5tamtqdGhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTQ2NzAwOCwiZXhwIjoyMDAxMDQzMDA4fQ.HXaQSDVB9CrSJ7Sbl1IK4YHDn_VkKYnO1or7-dFn7uk";
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchUser(profile, setProfile) {}

const AlumniProfile = () => {
  const [_user, setUser] = useState({});

  async function fetchUser() {
    //fetch user id from url
    const url = window.location.href;
    const urlArray = url.split("/");
    const _userId = urlArray[urlArray.length - 1];

    const { data: user, error } = await supabase.from("users").select("school_id, user_id, username, contact_email, contact_phone, first_name, last_name, date_of_birth, address").eq("user_id", _userId).single();

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

    setUser({ ...user, school_name: school.school_name, programme_name: programme.programme_name, role: roleName.role_description, years });

    console.log(_user);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="">
      <div className="" style={{ margin: "50px" }}>
        {/* <img src={UserPicture} alt="user" className="img-fluid" /> */}

        <div className="">
          <div className="">
            <Image style={{ width: "200px", marginBottom: "20px" }} src={UserPicture} roundedCircle />

            <h3>
              {_user?.first_name} {_user?.last_name}
            </h3>

            <p>Role: {_user?.role}</p>

            <p>School: {_user?.school_name}</p>

            <p>Programme: {_user?.programme_name}</p>

            <p>
              Years: {_user?.years?.year_started} - {_user?.years?.year_finished}
            </p>

            <p>Email: {_user?.contact_email}</p>

            <p>Phone: {_user?.contact_phone}</p>

            <p>Address: {_user?.address}</p>

            <p>Birthday: {_user?.date_of_birth}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile;
