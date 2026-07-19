import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { Users, UserCheck, UserX, Building2, TrendingUp, PieChart as PieIcon, BarChart3, UserPlus, Network, Badge, RefreshCw, UserCircle, ShieldCheck, Activity } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart,
  Line,
} from 'recharts';
import type { DashboardStats, Employee } from '../../types';
import { employeeService } from '../../services/employee.services';
import { Button, Card, Spinner } from '../ui/primitives';
import { cn, roleLabel } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';


const PIE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6366f1', '#14b8a6'];

export default function Dashboard() {
  const { user } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [dashboard, employeeResponse] = await Promise.all([
        employeeService.dashboard(),
        employeeService.getAll({
          page: 1,
          limit: 5,
          sortBy: "joiningDate",
          sortOrder: "desc",
        }),
      ]);
      console.log("Dashboard API:", dashboard);
      setStats(dashboard);

      // backend always returns PaginatedEmployees
      if (Array.isArray(employeeResponse)) {
        setEmployees(employeeResponse);
      } else {
        setEmployees(employeeResponse.data ?? []);
      }
    } catch (err) {
      console.error(err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-sky-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="p-10 text-center">
        <h2 className="text-xl font-semibold">
          Dashboard unavailable
        </h2>

        <p className="mt-2 text-slate-500">
          Unable to load dashboard statistics.
        </p>

        <Button
          className="mt-6"
          onClick={refreshDashboard}
        >
          Try Again
        </Button>
      </Card>
    );
  }

  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      color:
        "from-sky-500 via-sky-600 to-cyan-500",
      bg:
        "bg-gradient-to-br from-sky-500 to-cyan-600"
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      icon: UserCheck,
      color:
        "from-emerald-500 via-emerald-600 to-teal-500",
      bg:
        "bg-gradient-to-br from-emerald-500 to-teal-600"
    },
    {
      title: "Inactive Employees",
      value: stats.inactiveEmployees,
      icon: UserX,
      color:
        "from-rose-500 via-red-500 to-orange-500",
      bg:
        "bg-gradient-to-br from-rose-500 to-red-600"
    },
    {
      title: "Departments",
      value: stats.departmentCount,
      icon: Building2,
      color:
        "from-amber-500 via-orange-500 to-yellow-500",
      bg:
        "bg-gradient-to-br from-amber-500 to-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Add Employee",
      icon: UserPlus,
      path: "/employees/new"
    },
    {
      title: "Employees",
      icon: Users,
      path: "/employees"
    },
    {
      title: "Organization",
      icon: Network,
      path: "/organization"
    },
    {
      title: "Reports",
      icon: BarChart3,
      path: "/dashboard"
    }
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-cyan-600 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl ">
            <p className="text-lg font-medium text-sky-100">
              {greeting},
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              {user?.name}
            </h1>

            <p className="mt-4 max-w-xl text-sky-100">
              Welcome to your Employee Management System.
              Monitor employees, departments,
              organizational hierarchy and workforce
              performance from one powerful dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/employees/new")}
                className="bg-white text-sky-700 hover:bg-slate-100"
              >
                <UserPlus className="h-4 w-4" />
                Add Employee
              </Button>

              <Button
                variant="outline"
                onClick={refreshDashboard}
                className="border-white text-white hover:bg-white hover:text-sky-700"
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4",
                    refreshing && "animate-spin"
                  )}
                />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-sky-100">
                Your Role
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {roleLabel(user?.role ?? "employee")}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-sky-100">
                Today's Date
              </p>

              <h3 className="mt-2 text-lg font-semibold">
                {new Date().toLocaleDateString()}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-sky-100">
                Active Employees
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {stats.activeEmployees}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-sky-100">
                Departments
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {stats.departmentCount}
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards?.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="group overflow-hidden border-0 p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div
                className={cn(
                  "bg-gradient-to-br p-6 text-white",
                  card.color
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm opacity-90">
                      {card.title}
                    </p>

                    <h2 className="mt-3 text-4xl font-bold">
                      {card.value}
                    </h2>

                    <p className="mt-3 text-xs opacity-90">
                      Updated just now
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions?.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-sky-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-500/10">
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Quick access
              </p>
            </button>
          );
        })}
      </section>
      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Employee Growth
              </h2>

              <p className="text-sm text-slate-500">
                Monthly employee joining trend
              </p>
            </div>

            <TrendingUp className="h-6 w-6 text-sky-600" />
          </div>
<ResponsiveContainer width="100%" height={320}>
  <LineChart data={stats.monthlyJoinings}>

    <CartesianGrid
      strokeDasharray="4 4"
      stroke="#e2e8f0"
    />

    <XAxis
      dataKey="month"
    />

    <YAxis
      allowDecimals={false}
    />

    <Tooltip />

    <Line
      type="monotone"
      dataKey="count"
      stroke="#0284c7"
      strokeWidth={3}
      dot={{
        r: 5,
      }}
      activeDot={{
        r: 8,
      }}
    />

  </LineChart>
</ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Role Distribution
              </h2>

              <p className="text-sm text-slate-500">
                Employee roles
              </p>
            </div>

            <PieIcon className="h-6 w-6 text-emerald-600" />
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={stats.roleDistribution}
                dataKey="count"
                nameKey="role"
                outerRadius={95}
                innerRadius={55}
                paddingAngle={4}
              >
                {stats.roleDistribution?.map((_, index) => (
                  <Cell
                    key={index}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend
                formatter={(value) => roleLabel(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Employees by Department
              </h2>

              <p className="text-sm text-slate-500">
                Department performance
              </p>
            </div>

            <Building2 className="h-6 w-6 text-orange-500" />
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stats.departments}>
              <CartesianGrid
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="department"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                allowDecimals={false}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                fill="#0ea5e9"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Quick Statistics
          </h2>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Total Employees
              </span>

              <span className="font-bold">
                {stats.totalEmployees}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Active
              </span>

              <Badge className="bg-green-100 text-green-700">
                {stats.activeEmployees}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Inactive
              </span>

              <Badge className="bg-red-100 text-red-700">
                {stats.inactiveEmployees}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Departments
              </span>

              <Badge className="bg-sky-100 text-sky-700">
                {stats.departmentCount}
              </Badge>
            </div>

            <div className="pt-4">
              <div className="mb-2 flex justify-between text-sm">
                <span>Active Ratio</span>

                <span>
                  {Math.round(
                    (stats.activeEmployees /
                      stats.totalEmployees) *
                    100
                  )}
                  %
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"
                  style={{
                    width: `${(stats.activeEmployees /
                        stats.totalEmployees) *
                      100
                      }%`
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Employees
              </h2>

              <p className="text-sm text-slate-500">
                Latest joined employees
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/employees")}
            >
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Employee
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {employees?.map((employee) => (
                  <tr
                    key={employee.id ?? employee.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={employee.name}
                          src={employee.profileImage ?? undefined}
                          size={42}
                        />

                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {employee.name}
                          </h4>

                          <p className="text-sm text-slate-500">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {employee.department}
                    </td>

                    <td className="px-6 py-4">
                      <Badge className="bg-sky-100 text-sky-700">
                        {roleLabel(employee.role)}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        className={
                          employee.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(
                        employee.joiningDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/employees/${employee.id ?? employee.id
                              }`
                            )
                          }
                        >
                          View
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/employees/${employee.id ?? employee.id
                              }/edit`
                            )
                          }
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-slate-500"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Profile Summary
              </h2>

              <p className="text-sm text-slate-500">
                Account information
              </p>
            </div>

            <UserCircle className="h-7 w-7 text-sky-600" />
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            <Avatar
              name={user?.name}
              size={80}
            />

            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              {user?.name}
            </h3>

            <Badge className="mt-2 bg-sky-100 text-sky-700">
              {roleLabel(user?.role ?? "employee")}
            </Badge>

            <p className="mt-3 text-sm text-slate-500">
              {user?.email}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs text-slate-500">
                Account Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                <span className="font-medium text-green-600">
                  Active
                </span>
              </div>
            </div>


            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs text-slate-500">
                Access Level
              </p>

              <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                {roleLabel(user?.role ?? "employee")}
              </p>
            </div>


            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs text-slate-500">
                Last Login
              </p>

              <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                Today
              </p>
            </div>
          </div>
        </Card>
      </section>


      <section className="grid gap-6 lg:grid-cols-3">

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/10">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Top Department
              </h3>

              <p className="text-sm text-slate-500">
                Highest employee count
              </p>
            </div>
          </div>


          <div className="mt-6">
            {(() => {
              const topDepartment =
                [...stats.departments].sort(
                  (a, b) => b.count - a.count
                )[0];

              return (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {topDepartment?.department ?? "N/A"}
                  </h2>

                  <p className="mt-2 text-slate-500">
                    {topDepartment?.count ?? 0} Employees
                  </p>
                </>
              );
            })()}
          </div>
        </Card>


        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-500/10">
              <UserCheck className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Workforce Health
              </h3>

              <p className="text-sm text-slate-500">
                Active percentage
              </p>
            </div>
          </div>


          <div className="mt-6">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              {Math.round(
                (stats.activeEmployees /
                  Math.max(stats.totalEmployees, 1)) *
                100
              )}
              %
            </h2>


            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                style={{
                  width: `${(stats.activeEmployees /
                      Math.max(stats.totalEmployees, 1)) *
                    100
                    }%`
                }}
              />
            </div>
          </div>
        </Card>


        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/10">
              <ShieldCheck className="h-6 w-6" />
            </div>


            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                System Status
              </h3>

              <p className="text-sm text-slate-500">
                Application health
              </p>
            </div>
          </div>


          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                API Server
              </span>

              <Badge className="bg-green-100 text-green-700">
                Online
              </Badge>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Database
              </span>

              <Badge className="bg-green-100 text-green-700">
                Connected
              </Badge>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Authentication
              </span>

              <Badge className="bg-green-100 text-green-700">
                Secure
              </Badge>
            </div>

          </div>
        </Card>

      </section>
      <section className="grid gap-6 lg:grid-cols-2">

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Department Overview
              </h2>

              <p className="text-sm text-slate-500">
                Employee distribution
              </p>
            </div>

            <PieIcon className="h-6 w-6 text-sky-600" />
          </div>


          <div className="mt-6 flex flex-wrap gap-3">
            {stats.departments?.map((department) => (
              <div
                key={department.department}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
                  {department.count}
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {department.department}
                  </p>

                  <p className="text-xs text-slate-500">
                    Employees
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>


        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>

              <p className="text-sm text-slate-500">
                System activities
              </p>
            </div>

            <Activity className="h-6 w-6 text-indigo-600" />
          </div>


          <div className="mt-6 space-y-5">

            <div className="flex gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />

              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Employee database synchronized
                </p>

                <span className="text-sm text-slate-500">
                  Just now
                </span>
              </div>
            </div>


            <div className="flex gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-sky-500" />

              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Dashboard statistics updated
                </p>

                <span className="text-sm text-slate-500">
                  Recently
                </span>
              </div>
            </div>


            <div className="flex gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-orange-500" />

              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Organization structure checked
                </p>

                <span className="text-sm text-slate-500">
                  Today
                </span>
              </div>
            </div>


            <div className="flex gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-purple-500" />

              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Authentication service running
                </p>

                <span className="text-sm text-slate-500">
                  Today
                </span>
              </div>
            </div>

          </div>
        </Card>

      </section>


      <section>
        <Card className="p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Employee Management System
              </h2>

              <p className="text-sm text-slate-500">
                Complete workforce management dashboard with
                authentication, RBAC and organization hierarchy.
              </p>
            </div>


            <div className="flex flex-wrap gap-2">

              <Badge className="bg-green-100 text-green-700">
                JWT Secure
              </Badge>


              <Badge className="bg-blue-100 text-blue-700">
                Role Based Access
              </Badge>


              <Badge className="bg-purple-100 text-purple-700">
                MongoDB
              </Badge>

            </div>

          </div>

        </Card>
      </section>


    </div>
  );
}