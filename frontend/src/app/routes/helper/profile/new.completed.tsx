import { createFileRoute } from '@tanstack/react-router';

import { HelperProfileCompletePage } from '@pages/helper/helper-profile-complete';

export const Route = createFileRoute('/helper/profile/new/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperProfileCompletePage />;
}
