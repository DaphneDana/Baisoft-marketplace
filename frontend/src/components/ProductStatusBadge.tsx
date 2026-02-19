const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Pending',
  approved: 'Approved',
};

export default function ProductStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
      {statusLabels[status] || status}
    </span>
  );
}
