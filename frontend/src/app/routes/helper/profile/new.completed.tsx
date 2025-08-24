import { HelperProfileCompletePage } from '@pages/helper/helper-profile-complete';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/helper/profile/new/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  <HelperProfileCompletePage />;
}
