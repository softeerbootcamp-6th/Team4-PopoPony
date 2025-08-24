import { PatientDashboardPage } from '@pages/dashboard/patient';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/map/$encryptedId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PatientDashboardPage />;
}
