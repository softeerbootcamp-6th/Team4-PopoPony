import { HelperProfileRegisterPage } from '@pages/helper/helper-profile-register';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/profile/new/$step')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperProfileRegisterPage />;
}
