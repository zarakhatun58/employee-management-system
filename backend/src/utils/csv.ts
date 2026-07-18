import { parse } from 'csv-parse';
import { Employee } from '../models/Employee';

export interface CsvRow {
  employeeId?: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  salary?: string;
  joiningDate?: string;
  status?: string;
  role?: string;
  reportingManagerEmployeeId?: string;
}

export interface ImportResult {
  created: number;
  updated: number;
  errors: string[];
}

export async function parseCsvBuffer(buffer: Buffer): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    const records: CsvRow[] = [];
    const parser = parse({
      columns: true,
      trim: true,
      skip_empty_lines: true,
    });
    parser.on('data', (row) => records.push(row));
    parser.on('error', reject);
    parser.on('end', () => resolve(records));
    parser.write(buffer);
    parser.end();
  });
}

export async function importEmployees(rows: CsvRow[]): Promise<ImportResult> {
  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const [i, row] of rows.entries()) {
    const lineNo = i + 2; // +2 because line 1 is header
    try {
      if (!row.name || !row.email || !row.employeeId) {
        errors.push(`Line ${lineNo}: missing required fields (employeeId, name, email)`);
        continue;
      }
      let managerObjectId = null;
      if (row.reportingManagerEmployeeId) {
        const mgr = await Employee.findOne({ employeeId: row.reportingManagerEmployeeId });
        if (!mgr) {
          errors.push(`Line ${lineNo}: reporting manager "${row.reportingManagerEmployeeId}" not found`);
          continue;
        }
        managerObjectId = mgr._id;
      }
      const existing = await Employee.findOne({ employeeId: row.employeeId });
      const payload = {
        employeeId: row.employeeId,
        name: row.name,
        email: row.email,
        phone: row.phone || '',
        department: row.department || 'Operations',
        designation: row.designation || 'Staff',
        salary: Number(row.salary) || 0,
        joiningDate: row.joiningDate ? new Date(row.joiningDate) : new Date(),
        status: (row.status as any) || 'active',
        role: (row.role as any) || 'employee',
        reportingManager: managerObjectId as any,
      };
      if (existing) {
        Object.assign(existing, payload);
        await existing.save();
        updated++;
      } else {
        await Employee.create(payload);
        created++;
      }
    } catch (err: any) {
      errors.push(`Line ${lineNo}: ${err.message}`);
    }
  }
  return { created, updated, errors };
}
