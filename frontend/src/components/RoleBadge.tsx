const roleStyles: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  editor: 'bg-blue-100 text-blue-800',
  approver: 'bg-orange-100 text-orange-800',
  viewer: 'bg-gray-100 text-gray-700',
};

export default function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${roleStyles[role] || 'bg-gray-100 text-gray-700'}`}>
      {role}
    </span>
  );
}
