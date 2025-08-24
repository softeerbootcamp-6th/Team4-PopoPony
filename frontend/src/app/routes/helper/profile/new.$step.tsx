import { createFileRoute } from '@tanstack/react-router';

import { HelperProfileRegisterPage } from '@pages/helper/helper-profile-register';

export const Route = createFileRoute('/helper/profile/new/$step')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperProfileRegisterPage />;
}
