import { PaymentCard, WarningBox } from '@customer/components';
import { PageLayout } from '@layouts';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { getRecruitPayment, postSelectApplication } from '@customer/apis';
import { showToastError } from '@utils';

const Route = getRouteApi('/customer/escort/$escortId/payment/$applicationId');

const RecruitPaymentPage = () => {
  const navigate = useNavigate();
  const { escortId, applicationId } = Route.useParams();
  const { data } = getRecruitPayment(Number(escortId));
  //TODO: route추가로 지도 정보 가져올 수 있음
  const { baseFee, expectedTaxiFee, route } = data.data;

  const { mutate } = postSelectApplication();

  const handleSelectApplication = () => {
    mutate(
      {
        params: { path: { applicationId: Number(applicationId) } },
      },
      {
        onSuccess: () => {
          navigate({
            to: '/customer/escort/$escortId/completed',
            params: {
              escortId: escortId,
            },
          });
        },
        onError: (error: unknown) => {
          showToastError(error);
        },
      }
    );
  };

  return (
    <>
      <PageLayout.Header title='결제하기' showBack />
      <PageLayout.Content>
        <div className='flex h-full flex-col justify-between'>
          <div className='bg-background-default-white flex flex-col gap-[1.6rem] px-[2rem] py-[1.6rem]'>
            <h2 className='title-20-bold text-text-neutral-primary'>결제 예정금액</h2>
            <PaymentCard
              route={route}
              usageFee={baseFee || 0}
              estimatedTaxiFare={expectedTaxiFee || 0}
              onClick={handleSelectApplication}
            />
            <WarningBox text='택시 요금은 동행 완료 후 자동 결제됩니다.' />
          </div>
          <div className='bg-background-light-neutral w-full p-[2rem]'>
            <h6 className='caption1-12-bold text-text-neutral-assistive'>* 위약금 규정 안내</h6>
            <p className='caption1-12-medium text-text-neutral-assistive'>
              본 서비스의 매칭 확정 건에 대한 취소는 고객센터를 통해서만 접수 가능하며, 다음 규정에
              따라 위약금이 부과됩니다.
            </p>
            <section className='caption1-12-medium text-text-neutral-assistive'>
              <ul className='list-disc pl-[2.4rem]'>
                <li>서비스 시작 시간이 48시간 이상 남았을 경우: 위약금 없음</li>
                <li>서비스 시작 시간 24시간 ~ 48시간 이내: 이용 금액의 30%</li>
                <li>서비스 시작 시간 ~ 24시간 이내: 이용 금액의 50%</li>
                <li>서비스 시작 시간 이후: 이용 금액의 100%</li>
              </ul>
            </section>
          </div>
        </div>
      </PageLayout.Content>
    </>
  );
};

export default RecruitPaymentPage;
