import ActiveCollection from "@/features/crm/active-collection";

export default function Dashboard() {
  return (
    <div className="sx:p-0 md:p-6 pt-1 h-screen space-y-4">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      <ActiveCollection />
    </div>
  );
}
