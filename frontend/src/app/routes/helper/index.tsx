import { HelperHomePage } from '@pages/helper/helper-home';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperHomePage />;
}
