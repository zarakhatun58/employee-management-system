import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  Download,
  PieChart,
  ShieldCheck,
} from "lucide-react";

import type { Employee } from "../../types";
import { employeeService } from "../../services/employee.services";
import { Card, Button, Spinner } from "../ui/primitives";
import { exportEmployeesPdf } from "../../utils/exportEmployeesPdf";


export default function Reports() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);


  const loadReports = async () => {
    try {
      setLoading(true);

      const response = await employeeService.getAll({
        page: 1,
        limit: 10000,
      });

      if (Array.isArray(response)) {
        setEmployees(response);
      } else {
        setEmployees(response.data ?? []);
      }

    } catch (error) {
      console.error(
        "Reports loading error",
        error
      );

      setEmployees([]);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadReports();
  }, []);



  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-sky-600" />
      </div>
    );
  }



  const totalEmployees = employees.length;

  const activeEmployees =
    employees.filter(
      (employee) =>
        employee.status === "active"
    ).length;


  const inactiveEmployees =
    totalEmployees - activeEmployees;



  const departments =
    Object.entries(
      employees.reduce(
        (acc: Record<string, number>, employee) => {
          acc[employee.department] =
            (acc[employee.department] ?? 0) + 1;

          return acc;
        },
        {}
      )
    );


  const roles =
    Object.entries(
      employees.reduce(
        (acc: Record<string, number>, employee) => {
          acc[employee.role] =
            (acc[employee.role] ?? 0) + 1;

          return acc;
        },
        {}
      )
    );



  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: UserCheck,
    },
    {
      title: "Inactive Employees",
      value: inactiveEmployees,
      icon: UserX,
    },
    {
      title: "Departments",
      value: departments.length,
      icon: Building2,
    },
  ];



  return (
    <div className="space-y-6">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Reports
          </h1>

          <p className="text-sm text-slate-500">
            Employee analytics and workforce reports
          </p>
        </div>


        <Button
          onClick={() =>
            exportEmployeesPdf(employees)
          }
        >
          <Download className="h-4 w-4" />
          Export PDF
        </Button>

      </div>



      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => {

          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="p-6"
            >

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold dark:text-white">
                    {card.value}
                  </h2>
                </div>


                <Icon className="h-8 w-8 text-sky-600" />

              </div>

            </Card>
          );
        })}

      </section>



      <section className="grid gap-6 lg:grid-cols-2">

        <Card className="p-6">

          <div className="flex items-center gap-3">

            <PieChart className="text-sky-600" />

            <h2 className="text-lg font-bold dark:text-white">
              Department Report
            </h2>

          </div>


          <div className="mt-5 space-y-3">

            {departments.map(
              ([department, count]) => (
                <div
                  key={department}
                  className="flex justify-between rounded-xl bg-slate-100 p-4 dark:bg-slate-800"
                >

                  <span className="dark:text-white">
                    {department}
                  </span>

                  <span className="font-bold">
                    {count}
                  </span>

                </div>
              )
            )}

          </div>

        </Card>



        <Card className="p-6">

          <div className="flex items-center gap-3">

            <ShieldCheck className="text-green-600" />

            <h2 className="text-lg font-bold dark:text-white">
              Role Distribution
            </h2>

          </div>


          <div className="mt-5 space-y-3">

            {roles.map(
              ([role, count]) => (
                <div
                  key={role}
                  className="flex justify-between"
                >

                  <span className="dark:text-white">
                    {role}
                  </span>

                  <span>
                    {count}
                  </span>

                </div>
              )
            )}

          </div>

        </Card>

      </section>

    </div>
  );
}