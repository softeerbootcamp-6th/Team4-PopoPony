import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/escort/$escortId/$helperId/helper/$applicationId')({
  validateSearch: (search: { canSelect?: string } | undefined) => ({
    canSelect: search?.canSelect,
  }),
  component: RouteComponent,
});

function RouteComponent() {}
