import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { RecruitSearchPage } from '@pages/helper/recruit-search';

const filterSearchSchema = z.object({
  region: z.string().optional(),
  date: z.string().optional(),
});

export const Route = createFileRoute('/helper/application/')({
  validateSearch: filterSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitSearchPage />;
}
