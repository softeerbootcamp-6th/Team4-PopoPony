import { getRouteApi, useNavigate } from '@tanstack/react-router';

import { EmptyCard, Tabs } from '@shared/ui';
import { SuspenseUI } from '@shared/ui';

import { getApplicationListById } from '@customer/apis';
import { HelperCard, HelperSelectInfoCard } from '@customer/components';

const routeApi = getRouteApi('/customer/escort/$escortId/');

const HelperTab = ({ status }: { status: string }) => {
  const navigate = useNavigate();
  const { escortId } = routeApi.useParams();
  const { data: applicationData, isLoading } = getApplicationListById(Number(escortId));
  const { applicationList } = applicationData?.data || {};

  const handleHelperCardClick = (helperId: number, escortId: string, applicationId: number) => {
    if (status === '매칭중') {
      navigate({
        to: '/customer/escort/$escortId/$helperId/helper/$applicationId',
        params: {
          escortId: escortId,
          helperId: helperId.toString(),
          applicationId: applicationId.toString(),
        },
        search: { canSelect: 'true' },
      });
    } else {
      navigate({
        to: '/customer/escort/$escortId/$helperId/helper/$applicationId',
        params: {
          escortId: escortId,
          helperId: helperId.toString(),
          applicationId: applicationId.toString(),
        },
        search: { canSelect: 'false' },
      });
    }
  };

  if (isLoading) return <SuspenseUI />;

  return (
    <Tabs.TabsContentSection>
      {applicationList && applicationList.length > 0 ? (
        <>
          {status === '매칭중' && <HelperSelectInfoCard />}
          {applicationList.map((application) => (
            <HelperCard
              key={application.helper.helperProfileId}
              helper={application.helper}
              onClick={() =>
                handleHelperCardClick(
                  application.helper.helperProfileId,
                  escortId,
                  application.applicationId
                )
              }
            />
          ))}
        </>
      ) : (
        <EmptyCard text='아직 지원한 도우미가 없어요' />
      )}
    </Tabs.TabsContentSection>
  );
};

export default HelperTab;
