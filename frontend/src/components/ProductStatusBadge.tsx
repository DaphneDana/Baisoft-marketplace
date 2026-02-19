const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  draft: {
    dot: 'bg-slate-400',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    label: 'Draft',
  },
  pending_approval: {
    dot: 'bg-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    label: 'Pending',
  },
  approved: {
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    label: 'Approved',
  },
};

const fallback = { dot: 'bg-slate-400', bg: 'bg-slate-50', text: 'text-slate-700', label: '' };

export default function ProductStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { ...fallback, label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
