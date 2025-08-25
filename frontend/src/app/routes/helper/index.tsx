import { createFileRoute } from '@tanstack/react-router';

import { HelperHomePage } from '@pages/helper/helper-home';

export const Route = createFileRoute('/helper/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperHomePage />;
}
