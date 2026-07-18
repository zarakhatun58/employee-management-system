import React from 'react';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { useToast } from '../../components/ui/Toast';
import { useAuthStore } from '../../store/auth.store';
import type { Employee, Role } from '../../types';
import { Card, Button, Input, Select, Label, Spinner } from '../../components/ui/primitives';
import Avatar from '../../components/ui/Avatar';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { employeeService } from '../../services/employee.services';

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Design', 'Support'];
const ROLES = [
  { value: 'employee', label: 'Employee' },
  { value: 'hr', label: 'HR Manager' },
  { value: 'super_admin', label: 'Super Admin' },
];

interface FormState {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  role: Role;
  reportingManager: string;
}
const empty: FormState = {
  employeeId: '', name: '', email: '', phone: '', department: '', designation: '',
  salary: '', joiningDate: '', status: 'active', role: 'employee', reportingManager: '',
};

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canCreate, canEdit, isEmployee, role } = usePermissions();
  const currentUser = useAuthStore((s) => s.user);

  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const canManage = isEdit ? canEdit : canCreate;
  const isOwnProfile = currentUser?.employee === id;

  useEffect(() => {
    employeeService.list({ limit: 1000 }).then((res) => setManagers(res.data)).catch(() => { });
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);
    employeeService.get(id)
      .then((emp) => {
        setForm({
          employeeId: emp.employeeId,
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          designation: emp.designation,
          salary: String(emp.salary),
          joiningDate: emp.joiningDate?.slice(0, 10),
          status: emp.status,
          role: emp.role,
          reportingManager: emp.reportingManager ?? '',
        });
        setImagePreview(emp.profileImage ?? null);
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  if (isEmployee && !isOwnProfile) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">You can only edit your own profile.</p>
        <Link to="/employees"><Button className="mt-4">Back</Button></Link>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">You don't have permission to {isEdit ? 'edit' : 'create'} employees.</p>
        <Link to="/employees"><Button className="mt-4">Back</Button></Link>
      </div>
    );
  }

  if (loading) return <div className="flex h-full items-center justify-center"><Spinner className="h-8 w-8 text-sky-500" /></div>;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[+]?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = 'Invalid phone';
    if (!form.department) e.department = 'Department is required';
    if (!form.designation.trim()) e.designation = 'Designation is required';
    if (!form.salary || isNaN(Number(form.salary)) || Number(form.salary) < 0) e.salary = 'Valid salary required';
    if (!form.joiningDate) e.joiningDate = 'Joining date is required';
    if (!form.employeeId.trim()) e.employeeId = 'Employee ID is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('profileImage', imageFile);
    try {
      if (isEdit && id) {
        await employeeService.update(id, fd);
        toast('success', 'Employee updated');
        navigate(`/employees/${id}`);
      } else {
        const emp = await employeeService.create(fd);
        toast('success', 'Employee created');
        if (emp._id) {
          navigate(`/employees/${emp._id}`);
        } else {
          navigate('/employees');
        }
      }
    } catch (err: any) {
      toast('error', err.response?.data?.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

 const availableManagers=managers.filter(
(m)=>m._id&&m._id!==id&&m.status==='active'
);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
     <div className="flex flex-wrap items-center gap-3">
        <Link to={isEdit ? `/employees/${id}` : '/employees'}>
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Profile image */}
          <div className="flex items-center gap-4">
            <Avatar name={form.name} src={imagePreview} size={72} />
            <div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                <Upload className="h-4 w-4" /> Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={onImage} />
              </label>
              <p className="mt-1 text-xs text-slate-400">JPG, PNG up to 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Employee ID *</Label>
              <Input value={form.employeeId} onChange={(e) => set('employeeId', e.target.value)} disabled={isEdit} />
              {errors.employeeId && <p className="mt-1 text-xs text-rose-500">{errors.employeeId}</p>}
            </div>
            <div>
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>
            <div>
              <Label>Phone *</Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555-0100" />
              {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
            </div>
            <div>
              <Label>Department *</Label>
              <Select value={form.department} onChange={(e) => set('department', e.target.value)}>
                <option value="">Select...</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
              {errors.department && <p className="mt-1 text-xs text-rose-500">{errors.department}</p>}
            </div>
            <div>
              <Label>Designation *</Label>
              <Input value={form.designation} onChange={(e) => set('designation', e.target.value)} />
              {errors.designation && <p className="mt-1 text-xs text-rose-500">{errors.designation}</p>}
            </div>
            <div>
              <Label>Salary (USD) *</Label>
              <Input type="number" min="0" value={form.salary} onChange={(e) => set('salary', e.target.value)} />
              {errors.salary && <p className="mt-1 text-xs text-rose-500">{errors.salary}</p>}
            </div>
            <div>
              <Label>Joining Date *</Label>
              <Input type="date" value={form.joiningDate} onChange={(e) => set('joiningDate', e.target.value)} />
              {errors.joiningDate && <p className="mt-1 text-xs text-rose-500">{errors.joiningDate}</p>}
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onChange={(e) => set('role', e.target.value)}>
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Reporting Manager</Label>
              <Select value={form.reportingManager} onChange={(e) => set('reportingManager', e.target.value)}>
                <option value="">None (top-level)</option>
                {availableManagers.map((m) => <option key={m._id} value={m._id}>{m.name} — {m.designation}</option>)}
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-5 dark:border-slate-800">
            <Link to={isEdit ? `/employees/${id}` : '/employees'}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {isEdit ? 'Save Changes' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
