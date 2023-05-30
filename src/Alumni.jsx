import React, { useEffect } from "react";

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://eczgrwcooijbnmjkjtha.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjemdyd2Nvb2lqYm5tamtqdGhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTQ2NzAwOCwiZXhwIjoyMDAxMDQzMDA4fQ.HXaQSDVB9CrSJ7Sbl1IK4YHDn_VkKYnO1or7-dFn7uk";
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchUsers() {
  const { data: users, error } = await supabase.from("users").select("school_id, user_id, username, contact_email, contact_phone, first_name, last_name, date_of_birth, address");

  if (error) {
    console.log(error);
    return;
  }

  console.log(users);
}

const Alumni = () => {
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Alumni</h1>
      <h3>Registered alumni</h3>
      <h3>Applied alumni</h3>
      <h3>Visitors</h3>
    </div>
  );
};

export default Alumni;
