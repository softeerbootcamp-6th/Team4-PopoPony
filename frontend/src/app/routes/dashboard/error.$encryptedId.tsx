import { createFileRoute } from '@tanstack/react-router';

import { PatientDashboardErrorPage } from '@pages/dashboard/patient-error';

export const Route = createFileRoute('/dashboard/error/$encryptedId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PatientDashboardErrorPage />;
}
