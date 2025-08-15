import { Spinner, Tabs } from '@components';
import { HelperCard, HelperEmptyCard, HelperSelectInfoCard } from '@customer/components';
import { useParams } from '@tanstack/react-router';
import { getApplicationListById } from '@customer/apis';

const HelperTab = () => {
  const { escortId } = useParams({ from: '/customer/escort/$escortId/' });
  const { data: applicationList, isLoading } = getApplicationListById(Number(escortId));
  console.log(applicationList);

  if (isLoading) return <Spinner />;

  return (
    <Tabs.TabsContentSection>
      {applicationList &&
      applicationList.data &&
      applicationList.data.applicationList.length > 0 ? (
        <>
          <HelperSelectInfoCard />
          {applicationList.data.applicationList.map((application) => (
            <HelperCard key={application.helper.helperProfileId} helper={application.helper} />
          ))}
        </>
      ) : (
        <HelperEmptyCard />
      )}
    </Tabs.TabsContentSection>
  );
};

export default HelperTab;
