import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { supabase } from "@/lib/supabase";

type Employee = {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
};

export default function AdminPayroll() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [base, setBase] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [month, setMonth] = useState("2026-01");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, employee_id, first_name, last_name");

    if (data) setEmployees(data);
  };

  const savePayroll = async () => {
    if (!selectedUser || !base) return;

    const net = base + bonus - deductions;

    await supabase.from("payroll").insert({
      user_id: selectedUser,
      month,
      base_salary: base,
      bonus,
      deductions,
      net_salary: net,
    });

    alert("Salary saved");
    setBase(0);
    setBonus(0);
    setDeductions(0);
  };

  return (
    <Layout>
      <div className="max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold">Payroll (Admin)</h1>

        <select
          className="w-full border p-2"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.employee_id} — {e.first_name} {e.last_name}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full border p-2"
        />

        <input
          type="number"
          placeholder="Base Salary (₹)"
          value={base}
          onChange={(e) => setBase(Number(e.target.value))}
          className="w-full border p-2"
        />

        <input
          type="number"
          placeholder="Bonus (₹)"
          value={bonus}
          onChange={(e) => setBonus(Number(e.target.value))}
          className="w-full border p-2"
        />

        <input
          type="number"
          placeholder="Deductions (₹)"
          value={deductions}
          onChange={(e) => setDeductions(Number(e.target.value))}
          className="w-full border p-2"
        />

        <button
          onClick={savePayroll}
          className="bg-[#714B67] text-white px-4 py-2 rounded"
        >
          Save Salary
        </button>
      </div>
    </Layout>
  );
}
