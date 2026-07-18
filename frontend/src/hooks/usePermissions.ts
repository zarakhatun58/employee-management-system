import { useAuthStore } from '../store/auth.store';
import type { Role } from '../types';

export function usePermissions() {
  const role = useAuthStore((s) => s.user?.role) as Role | undefined;

  return {
    canCreate: role === 'super_admin' || role === 'hr',
    canEdit: role === 'super_admin' || role === 'hr',
    canDelete: role === 'super_admin',
    canAssignManager: role === 'super_admin',
    canImport: role === 'super_admin' || role === 'hr',
    canEditOwnProfile: role === 'employee',
    isEmployee: role === 'employee',
    role,
  };
}
