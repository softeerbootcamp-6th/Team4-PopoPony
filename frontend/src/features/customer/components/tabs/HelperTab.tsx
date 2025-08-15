import { Spinner, Tabs } from '@components';
import { HelperCard, HelperEmptyCard, HelperSelectInfoCard } from '@customer/components';
import { useParams, useNavigate } from '@tanstack/react-router';
import { getApplicationListById } from '@customer/apis';

const HelperTab = () => {
  const navigate = useNavigate();
  const { escortId } = useParams({ from: '/customer/escort/$escortId/' });
  const { data: applicationList, isLoading } = getApplicationListById(Number(escortId));
  console.log(applicationList);

  const handleHelperCardClick = (helperId: number) => {
    navigate({
      to: '/customer/escort/$escortId/helper/$helperId',
      params: { escortId: escortId, helperId: helperId.toString() },
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <Tabs.TabsContentSection>
      {applicationList &&
      applicationList.data &&
      applicationList.data.applicationList.length > 0 ? (
        <>
          <HelperSelectInfoCard />
          {applicationList.data.applicationList.map((application) => (
            <HelperCard
              key={application.helper.helperProfileId}
              helper={application.helper}
              onClick={() => handleHelperCardClick(application.helper.helperProfileId)}
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
