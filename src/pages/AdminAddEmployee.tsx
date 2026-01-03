import { useState } from "react";
import Layout from "../components/Layout";
import { adminAddEmployee } from "@/services/adminAddEmployee";

export default function AdminAddEmployee() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"employee" | "admin">("employee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleCreateEmployee = async () => {
    setError(null);
    setSuccess(null);

    if (!firstName || !lastName || !email) {
    setError("First name, last name and email are required");
    return;
    }

    setLoading(true);

    try {
        const { employeeId, tempPassword } = await adminAddEmployee({
        firstName,
        lastName,
        email,
        role,
        });

      setSuccess(
        `Employee created successfully.
Employee ID: ${employeeId}
Temporary Password: ${tempPassword}`
      );

      setEmail("");
      setRole("employee");
    } catch (err: any) {
     console.error("UI ERROR:", err);
     setError(err.message);
    }
 finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Add New Employee</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && (
          <pre className="bg-green-50 text-green-700 p-4 rounded mb-4 whitespace-pre-wrap">
            {success}
          </pre>
        )}

        <div className="space-y-4">
            <input
            className="w-full border rounded px-3 py-2"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            />
            <input
            className="w-full border rounded px-3 py-2"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Employee Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="w-full border rounded px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={handleCreateEmployee}
            disabled={loading}
            className="bg-[#714B67] text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
