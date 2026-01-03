import { supabase } from "@/lib/supabase";

export async function adminAddEmployee(params: {
  firstName: string;
  lastName: string;
  email: string;
  role: "employee" | "admin";
}) {
  const { data, error } = await supabase.functions.invoke(
    "admin-add-employee",
    { body: params }
  );

  if (error) {
    console.error("RAW ERROR:", error);

    // 🔴 THIS is the important part
    let message = error.message;

    if (error.context?.body) {
      try {
        message =
          typeof error.context.body === "string"
            ? error.context.body
            : JSON.stringify(error.context.body);
      } catch {
        message = "Unknown edge function error";
      }
    }

    throw new Error(message);
  }

  return data;
}
