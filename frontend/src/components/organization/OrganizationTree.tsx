
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { TreeNode } from '../../types';
import { Card, Spinner, EmptyState } from '../../components/ui/primitives';
import Avatar from '../../components/ui/Avatar';
import { roleLabel, roleColor, cn } from '../../lib/utils';
import { ChevronDown, ChevronRight, Network } from 'lucide-react';
import { employeeService } from '../../services/employee.services';
import OrganizationChart from './OrganizationChart';

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children.length > 0;

  return (
    <div className="animate-slide-down">
      <div
        className="flex items-center gap-2 rounded-lg py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
        style={{ paddingLeft: `${Math.min(depth * 20 + 8, 80)}px` }}
      >
        {hasChildren ? (
          <button onClick={() => setExpanded((e) => !e)} className="rounded p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <div className="w-6" />
        )}
        <Link to={`/employees/${node._id}`} className="flex flex-1 items-center gap-3">
          <Avatar name={node.name} src={node.profileImage} size={36} />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 hover:text-sky-600 dark:text-slate-200">{node.name}</p>
            <p className="text-xs text-slate-400">{node.designation} · {node.department}</p>
          </div>
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', roleColor(node.role))}>{roleLabel(node.role)}</span>
          {hasChildren && <span className="text-xs text-slate-400">{node.children.length} reports</span>}
        </Link>
      </div>
      {expanded && hasChildren && (
        <div className="border-l border-slate-200 dark:border-slate-800" style={{ marginLeft: `${depth * 28 + 24}px` }}>
          {node.children.map((child) => <TreeRow key={child._id} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function OrganizationTree() {
  const [forest, setForest] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    employeeService
      .forest()
      .then(setForest)
      .catch(() => setForest([]))
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8 text-sky-500" />
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Organization Hierarchy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Reporting structure across the organization</p>
      </div>

      <Card className="overflow-hidden p-0 h-[760px]">
  {forest.length > 0 ? (
    <OrganizationChart forest={forest} />
  ) : (
    <EmptyState
      icon={<Network className="h-8 w-8" />}
      title="No organization data"
      description="Add employees with reporting managers."
    />
  )}
</Card>
    </div>
  );
}
