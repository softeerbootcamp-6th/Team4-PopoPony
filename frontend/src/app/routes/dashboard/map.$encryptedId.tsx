import { createFileRoute } from '@tanstack/react-router';

import { PatientDashboardPage } from '@pages/dashboard/patient';

export const Route = createFileRoute('/dashboard/map/$encryptedId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PatientDashboardPage />;
}
