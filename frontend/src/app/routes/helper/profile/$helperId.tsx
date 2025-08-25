import { createFileRoute } from '@tanstack/react-router';

import { HelperProfilePage } from '@pages/helper/helper-profile';

export const Route = createFileRoute('/helper/profile/$helperId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperProfilePage />;
}
