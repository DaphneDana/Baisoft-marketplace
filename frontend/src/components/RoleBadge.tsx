const roleConfig: Record<string, { dot: string; bg: string; text: string }> = {
  admin: {
    dot: 'bg-violet-400',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
  },
  editor: {
    dot: 'bg-indigo-400',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
  approver: {
    dot: 'bg-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  viewer: {
    dot: 'bg-slate-400',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
  },
};

const fallback = { dot: 'bg-slate-400', bg: 'bg-slate-50', text: 'text-slate-600' };

export default function RoleBadge({ role }: { role: string }) {
  const config = roleConfig[role] || fallback;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {role}
    </span>
  );
}
