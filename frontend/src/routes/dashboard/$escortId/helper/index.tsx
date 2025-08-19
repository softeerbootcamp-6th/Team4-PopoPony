import { useSSE } from '@dashboard/hooks';
import { PageLayout } from '@layouts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/$escortId/helper/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { escortId } = Route.useParams();
  const role = 'customer'; // 필요시 교체
  const { events, connectionStatus } = useSSE(escortId, role);

  return (
    <PageLayout>
      <PageLayout.Header title='SSE 테스트' />

      <PageLayout.Content>
        <div className='p-[2rem]'>
          <div className='mb-[1.6rem]'>
            <p className='body2-14-medium text-text-neutral-weak'>
              연결 상태: <span className='text-text-neutral-strong'>{connectionStatus}</span>
            </p>
            <p className='body2-14-medium text-text-neutral-weak'>
              이벤트 수: <span className='text-text-neutral-strong'>{events.length}</span>
            </p>
          </div>
          <ul className='bg-background-default-white flex flex-col gap-[0.8rem]'>
            {events.map((event, index) => (
              <li
                key={index}
                className='body1-16-bold border-stroke-neutral-dark h-fit rounded-[0.4rem] border px-[0.8rem] py-[0.4rem]'>
                <div>
                  <div>{event.type}</div>
                  <div>{`escortId: ${event.data.escortId}`}</div>
                  <div>{`timestamp: ${event.data.timestamp}`}</div>
                  <div>{`latitude: ${event.data.latitude}`}</div>
                  <div>{`longitude: ${event.data.longitude}`}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
