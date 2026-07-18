import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Employee } from '../../types';
import { Card, Button, Badge, Spinner, EmptyState, Select } from '../../components/ui/primitives';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import { formatDate, formatCurrency, roleLabel, roleColor, statusColor, cn } from '../../lib/utils';
import { ArrowLeft, Pencil, Trash2, Mail, Phone, Building2, Briefcase, DollarSign, Calendar, UserCog, Users as UsersIcon, Network } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useToast } from '../ui/Toast';
import { employeeService } from '../../services/employee.services';

export default function EmployeeDetail() {
  const { id } = useParams();
  const { canEdit, canDelete, canAssignManager, isEmployee } = usePermissions();
  const { toast } = useToast();
  const [emp, setEmp] = useState<Employee | null>(null);
  const [reportees, setReportees] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [managerModal, setManagerModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState<string>('');
const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    employeeService.get(id)
      .then((e) => {
        setEmp(e);
        setSelectedManager(e.reportingManager ?? '');
      })
      .finally(() => setLoading(false));
    employeeService.reportees(id).then(setReportees).catch(() => { });
    employeeService.list({ limit: 1000 }).then((r) => setManagers(r.data)).catch(() => { });
  }, [id]);

  if (loading) return <div className="flex h-full items-center justify-center"><Spinner className="h-8 w-8 text-sky-500" /></div>;
  if (!emp) return <EmptyState title="Employee not found" action={<Link to="/employees"><Button>Back</Button></Link>} />;

  const canEditThis = canEdit|| emp.role === 'employee';

  const handleDelete = async () => {
    try {
      await employeeService.remove(id!);
      toast('success', 'Employee deleted');
      setConfirmDelete(false);
      navigate('/employees');
    } catch {
      toast('error', 'Delete failed');
    }
  };

  const handleManagerChange = async () => {
    try {
      await employeeService.setManager(id!, selectedManager);
      toast('success', 'Reporting manager updated');
      setManagerModal(false);
      setEmp((e) => e ? { ...e, reportingManager: selectedManager || null, reportingManagerName: managers.find((m) => m._id === selectedManager)?.name ?? null } : e);
    } catch (err: any) {
      toast('error', err.response?.data?.message ?? 'Failed to update manager');
    }
  };

  const availableManagers = managers.filter((m) => m._id !== id && m.status === 'active');

  const info = [
    { icon: Mail, label: 'Email', value: emp.email },
    { icon: Phone, label: 'Phone', value: emp.phone },
    { icon: Building2, label: 'Department', value: emp.department },
    { icon: Briefcase, label: 'Designation', value: emp.designation },
    { icon: DollarSign, label: 'Salary', value: formatCurrency(emp.salary) },
    { icon: Calendar, label: 'Joining Date', value: formatDate(emp.joiningDate) },
    { icon: UserCog, label: 'Role', value: roleLabel(emp.role) },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/employees"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Employee Details</h1>
      </div>

      {/* Header card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-sky-500 to-cyan-500" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar name={emp.name} src={emp.profileImage} size={96} className="border-4 border-white dark:border-slate-900" />
              <div className="pb-1">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{emp.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{emp.designation} · {emp.department}</p>
                <div className="mt-1 flex gap-2">
                  <Badge className={roleColor(emp.role)}>{roleLabel(emp.role)}</Badge>
                  <Badge className={statusColor(emp.status)}>{emp.status}</Badge>
                </div>
              </div>
            </div>
           <div className="flex flex-wrap gap-2">
              {canEditThis && (
                <Link to={`/employees/${id}/edit`}>
                  <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /> Edit</Button>
                </Link>
              )}
              {canAssignManager && (
                <Button variant="outline" size="sm" onClick={() => setManagerModal(true)}><Network className="h-4 w-4" /> Assign Manager</Button>
              )}
              {canDelete && (
                <Button variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-50" onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Info */}
        <Card className="p-5">
          <h3 className="mb-4 font-semibold text-slate-700 dark:text-slate-200">Contact & Employment</h3>
          <div className="space-y-3">
            {info.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Reporting */}
        <Card className="p-5">
          <h3 className="mb-4 font-semibold text-slate-700 dark:text-slate-200">Reporting Structure</h3>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs text-slate-400">Reporting Manager</p>
              {emp.reportingManager ? (
                <Link to={`/employees/${emp.reportingManager}`} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-sky-400 hover:bg-sky-50 dark:border-slate-800 dark:hover:bg-sky-500/10">
                  <Avatar name={emp.reportingManagerName ?? 'Manager'}  size={36} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{emp.reportingManagerName ?? 'View manager'}</span>
                </Link>
              ) : (
                <p className="text-sm text-slate-400">No reporting manager assigned</p>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs text-slate-400">Direct Reportees ({reportees.length})</p>
              {reportees.length === 0 ? (
                <p className="text-sm text-slate-400">No direct reports</p>
              ) : (
                <div className="space-y-2">
                  {reportees.map((r) => (
                    r._id && (
                      <Link
                        key={r._id}
                        to={`/employees/${r._id}`}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 p-2.5 transition-colors hover:border-sky-400 hover:bg-sky-50 dark:border-slate-800 dark:hover:bg-sky-500/10"
                      >
                        <Avatar name={r.name} src={r.profileImage} size={32} />
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {r.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {r.designation}
                          </p>
                        </div>
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Assign Manager Modal */}
      <Modal open={managerModal} onClose={() => setManagerModal(false)} title="Assign Reporting Manager" size="sm">
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Select a new reporting manager. Circular reporting is automatically prevented.</p>
        <Select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)} className="mb-4">
          <option value="">None (top-level)</option>
          {availableManagers.map((m) => <option key={m._id} value={m._id}>{m.name} — {m.designation}</option>)}
        </Select>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setManagerModal(false)}>Cancel</Button>
          <Button onClick={handleManagerChange}>Update</Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete Employee" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to delete <strong>{emp.name}</strong>? This is a soft delete.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}><Trash2 className="h-4 w-4" /> Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
