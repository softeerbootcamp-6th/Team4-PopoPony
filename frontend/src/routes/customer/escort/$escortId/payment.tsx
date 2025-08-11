import { PaymentCard, WarningBox } from '@customer/components';
import { PageLayout } from '@layouts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/escort/$escortId/payment')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout>
      <PageLayout.Header title='결제하기' showBack />
      <PageLayout.Content>
        <div className='bg-background-default-white flex flex-col gap-[1.6rem] px-[2rem] py-[1.6rem]'>
          <h2 className='title-20-bold text-text-neutral-primary'>결제 예정금액</h2>
          <PaymentCard usageFee={30000} estimatedTaxiFare={100000} />
          <WarningBox text='택시 요금은 동행 완료 후 자동 결제됩니다.' />
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
