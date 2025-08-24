import { HelperProfilePage } from '@pages/helper/helper-profile';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/profile/$helperId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperProfilePage />;
}
