import { Spinner, Tabs } from '@components';
import { HelperCard, HelperEmptyCard, HelperSelectInfoCard } from '@customer/components';
import { useParams, useNavigate } from '@tanstack/react-router';
import { getApplicationListById } from '@customer/apis';

const HelperTab = ({ status }: { status: string }) => {
  const navigate = useNavigate();
  const { escortId } = useParams({ from: '/customer/escort/$escortId/' });
  const { data: applicationList, isLoading } = getApplicationListById(Number(escortId));

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

  if (isLoading) return <Spinner />;

  return (
    <Tabs.TabsContentSection>
      {applicationList &&
      applicationList.data &&
      applicationList.data.applicationList.length > 0 ? (
        <>
          {status === '매칭중' && <HelperSelectInfoCard />}
          {applicationList.data.applicationList.map((application) => (
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
        <HelperEmptyCard />
      )}
    </Tabs.TabsContentSection>
  );
};

export default HelperTab;
