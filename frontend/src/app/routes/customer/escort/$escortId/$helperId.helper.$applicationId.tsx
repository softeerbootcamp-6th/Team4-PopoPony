import { createFileRoute } from '@tanstack/react-router';

import { RecruitHelperDetailPage } from '@pages/customer/recruit-helper-detail';

export const Route = createFileRoute('/customer/escort/$escortId/$helperId/helper/$applicationId')({
  validateSearch: (search: { canSelect?: string } | undefined) => ({
    canSelect: search?.canSelect,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitHelperDetailPage />;
}
