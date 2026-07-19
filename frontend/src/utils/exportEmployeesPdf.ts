import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Employee } from "../types";

export const exportEmployeesPdf = (
  employees: Employee[]
) => {
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text(
    "Employee Management System",
    14,
    20
  );

  pdf.setFontSize(12);
  pdf.text(
    `Employee Report - ${new Date().toLocaleDateString()}`,
    14,
    30
  );

  autoTable(pdf, {
    startY: 40,
    head: [
      [
        "ID",
        "Name",
        "Email",
        "Department",
        "Role",
        "Status",
        "Joining Date",
      ],
    ],
    body: employees.map((employee) => [
      employee.employeeId ?? "-",
      employee.name,
      employee.email,
      employee.department,
      employee.role,
      employee.status,
      new Date(employee.joiningDate).toLocaleDateString(),
    ]),
  });

  pdf.save("employees-report.pdf");
};