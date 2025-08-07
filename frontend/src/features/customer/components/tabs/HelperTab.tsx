import { Tabs } from '@components';
import { HelperCard, HelperEmptyCard, HelperSelectInfoCard } from '@customer/components';

const HelperTab = () => {
  return (
    <Tabs.TabsCotentSection>
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
          tags: ['support', 'wheelchair', 'care'],
        }}
        onClick={(id) => console.log('헬퍼 카드 클릭:', id)}
      />

      <HelperCard
        helper={{
          id: '2',
          name: '김민수',
          age: 45,
          gender: '남',
          certificates: ['간호사', '간호조무사', '응급처치', '심폐소생술', '요양보호사'],
          tags: ['support', 'wheelchair'],
        }}
        onClick={(id) => console.log('헬퍼 카드 클릭:', id)}
      />

      <HelperCard
        helper={{
          id: '3',
          name: '박영희',
          age: 52,
          gender: '여',
          certificates: ['요양보호사'],
          tags: ['care'],
        }}
        onClick={(id) => console.log('헬퍼 카드 클릭:', id)}
      />
    </Tabs.TabsCotentSection>
  );
};

export default HelperTab;
