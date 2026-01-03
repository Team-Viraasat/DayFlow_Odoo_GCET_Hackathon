import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  try {
    const { firstName, lastName, email, role } = await req.json();

    if (!firstName || !lastName || !email) {
      return new Response("Missing fields", { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // employee id generation
    const empId =
      "OI-" +
      firstName[0].toUpperCase() +
      lastName[0].toUpperCase() +
      "-" +
      Date.now().toString().slice(-4);

    const tempPassword = crypto.randomUUID().slice(0, 10);

    const { error } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        employee_id: empId,
        role,
        first_name: firstName,
        last_name: lastName
      }
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ employeeId: empId, tempPassword }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
});
