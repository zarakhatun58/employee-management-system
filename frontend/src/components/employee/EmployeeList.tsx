import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Employee } from '../../types';
import { usePermissions } from '../../hooks/usePermissions';
import { useToast } from '../../components/ui/Toast';
import { Card, Button, Input, Select, Badge, EmptyState, Spinner } from '../../components/ui/primitives';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import { formatDate, formatCurrency, roleLabel, roleColor, statusColor, cn } from '../../lib/utils';
import { Search, Plus, Upload, Trash2, Eye, ArrowUpDown, Users, FileSpreadsheet } from 'lucide-react';
import PageHeader from '../layout/PageHeader';
import { type EmployeeQuery, employeeService } from '../../services/employee.services';

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Design', 'Support'];
const ROLES = ['super_admin', 'hr', 'employee'];

export default function EmployeeList() {
  const { canCreate, canDelete, canImport } = usePermissions();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<EmployeeQuery>({ page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc' });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

useEffect(() => {
  setLoading(true);

  employeeService
    .list(query)
    .then((res) => {
      setEmployees(res.data);

      setTotal(res.pagination.total);
      setPages(res.pagination.pages);
      setPage(res.pagination.page);
    })
    .catch(() =>
      toast("error", "Failed to load employees")
    )
    .finally(() => setLoading(false));
}, [query]);

  const updateQuery = (patch: Partial<EmployeeQuery>) => setQuery((q) => ({ ...q, ...patch, page: 1 }));

  const toggleSort = (field: 'name' | 'joiningDate') => {
    setQuery((q) => ({
      ...q,
      sortBy: field,
      sortOrder: q.sortBy === field && q.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await employeeService.remove(confirmId);
      toast('success', 'Employee deleted');
      setConfirmId(null);
      setQuery((q:any) => ({ ...q }));
    } catch {
      toast('error', 'Delete failed');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const res = await employeeService.importCsv(file);
      toast('success', `Imported: ${res.created} created, ${res.updated} updated`);
      setQuery((q:any) => ({ ...q }));
    } catch (err: any) {
      toast('error', err.response?.data?.message ?? 'Import failed');
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const sortIcon = (field: string) => (
    <ArrowUpDown className={cn('h-3.5 w-3.5', query.sortBy === field ? 'text-sky-500' : 'text-slate-400')} />
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employees"
        description={`${total} total employees`}
        icon={<Users className="h-6 w-6" />}
        action={
          <div className="flex flex-wrap gap-2">
            {canImport && (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleImport}
                />

                <Button
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={importing}
                >
                  {importing ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Import CSV
                </Button>
              </>
            )}

            {canCreate && (
              <Link to="/employees/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  Add Employee
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search name or email..." value={query.search ?? ''} onChange={(e) => updateQuery({ search: e.target.value })} className="pl-10" />
          </div>
          <Select value={query.department ?? ''} onChange={(e) => updateQuery({ department: e.target.value })}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Select value={query.role ?? ''} onChange={(e) => updateQuery({ role: e.target.value })}>
            <option value="">All Roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
          </Select>
          <Select value={query.status ?? ''} onChange={(e) => updateQuery({ status: e.target.value })}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          <Button variant="ghost" onClick={() => setQuery({ page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc' })}>Clear</Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
          </div>
        ) : employees.length === 0 ? (
          <EmptyState icon={<Users className="h-8 w-8" />} title="No employees found" description="Try adjusting filters or add a new employee." />
        ) : (
         <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">
                    <button className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300" onClick={() => toggleSort('name')}>
                      Employee {sortIcon('name')}
                    </button>
                  </th>
                  <th className="hidden px-4 py-3 md:table-cell">Department</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Role</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Salary</th>
                  <th className="px-4 py-3">
                    <button className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300" onClick={() => toggleSort('joiningDate')}>
                      Joined {sortIcon('joiningDate')}
                    </button>
                  </th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {employees.map((emp, i) => (
                  <tr key={emp.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="px-4 py-3">
                      <Link to={`/employees/${emp.id}`} className="flex items-center gap-3">
                        <Avatar name={emp.name} src={emp.profileImage} size={36} />
                        <div>
                          <p className="font-medium text-slate-700 group-hover:text-sky-600 dark:text-slate-200">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-300 md:table-cell">{emp.department}</td>
                    <td className="hidden px-4 py-3 lg:table-cell"><Badge className={roleColor(emp.role)}>{roleLabel(emp.role)}</Badge></td>
                    <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-300 sm:table-cell">{formatCurrency(emp.salary)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(emp.joiningDate)}</td>
                    <td className="px-4 py-3"><Badge className={statusColor(emp.status)}>{emp.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/employees/${emp.id}`}>
                          <Button variant="ghost" size="sm" className="px-2"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        {canDelete && (
                          <Button variant="ghost" size="sm" className="px-2 text-rose-500 hover:bg-rose-50"  onClick={() => emp.id && setConfirmId(emp.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <div className="space-y-3 p-3 md:hidden">
        {
          employees.map((emp) => (
            <Card key={emp.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar name={emp.name} src={emp.profileImage} size={42} />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {emp.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {emp.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  Department:
                  <span className="ml-2 font-medium">
                    {emp.department}
                  </span>
                </p>

                <p>
                  Role:
                  <Badge className={roleColor(emp.role)}>
                    {roleLabel(emp.role)}
                  </Badge>
                </p>

                <p>
                  Status:
                  <Badge className={statusColor(emp.status)}>
                    {emp.status}
                  </Badge>
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <Link to={`/employees/${emp.id}`}>
                  <Button size="sm">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>
              </div>

            </Card>
          ))
        }
      </div>
      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {pages}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setQuery((q) => ({ ...q, page: page - 1 }))}>Prev</Button>
            {Array.from({ length: pages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
              <Button key={p} variant={p === page ? 'primary' : 'outline'} size="sm" onClick={() => setQuery((q) => ({ ...q, page: p }))}>{p}</Button>
            ))}
            <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setQuery((q) => ({ ...q, page: page + 1 }))}>Next</Button>
          </div>
        </div>
      )}

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete Employee" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to delete this employee? This is a soft delete — the record will be marked inactive and hidden from lists.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}><Trash2 className="h-4 w-4" /> Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
