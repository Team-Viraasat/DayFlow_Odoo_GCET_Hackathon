import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid or empty JSON body", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const { firstName, lastName, email, role } = body;

  if (!firstName || !lastName || !email) {
    return new Response("Missing fields", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Generate employee ID
  const { count, error: countError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (countError) {
    return new Response(countError.message, {
      status: 500,
      headers: corsHeaders,
    });
  }

  const year = new Date().getFullYear();
  const employeeId =
    `OI${firstName.slice(0, 2).toUpperCase()}${lastName
      .slice(0, 2)
      .toUpperCase()}${year}` +
    String((count ?? 0) + 1).padStart(4, "0");

  const tempPassword = Math.random().toString(36).slice(-10);

  // Create auth user (NO triggers involved now)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (error) {
    console.error("ADMIN CREATE USER ERROR:", error);
    return new Response(error.message, {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Explicitly insert profile (SAFE)
    const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    email,
    login_id: employeeId,
    employee_id: employeeId,
    first_name: firstName,
    last_name: lastName,
    role,
    needs_onboarding: true,
    });


  if (profileError) {
    console.error("PROFILE INSERT ERROR:", profileError);
    return new Response(profileError.message, {
      status: 500,
      headers: corsHeaders,
    });
  }

  return new Response(
    JSON.stringify({ employeeId, tempPassword }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
});
