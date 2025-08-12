import { Tabs } from '@components';
import { HelperCard, HelperEmptyCard, HelperSelectInfoCard } from '@customer/components';

const HelperTab = () => {
  return (
    <Tabs.TabsContentSection>
      <HelperSelectInfoCard />
      <HelperEmptyCard />
      <HelperCard
        helper={{
          id: '1',
          name: '최솔희',
          age: 39,
          gender: '여',
          profileImage: '/images/default-profile.svg',
          certificates: ['간호사', '간호조무사'],
          tags: ['안전한 부축', '휠체어 이동', '인지장애 케어'],
        }}
        onClick={() => alert('준비중인 기능이에요')}
      />
    </Tabs.TabsContentSection>
  );
};

export default HelperTab;
