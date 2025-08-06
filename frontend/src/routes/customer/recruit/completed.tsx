import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageLayout, FormLayout } from '@layouts';
import { TopAppBar, Button } from '@components';
import { videoOptions } from '@video';
import { useRef, useEffect, useState } from 'react';

export const Route = createFileRoute('/customer/recruit/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // 비디오 옵션들 (우선순위 순서)
  const videoSources = [
    { src: videoOptions.ok.webm, type: 'video/webm' },
    { src: videoOptions.ok.mp4, type: 'video/mp4' },
    { src: videoOptions.escortCompleted.webm, type: 'video/webm' },
    { src: videoOptions.escortCompleted.mp4, type: 'video/mp4' },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (video && !videoError) {
      // 비디오 로드 완료 시 자동 재생 및 무한 반복 설정
      const handleLoadedData = () => {
        video.play().catch((error) => {
          console.log('자동 재생 실패:', error);
          // 재생 실패 시 다음 비디오 시도
          if (currentVideoIndex < videoSources.length - 1) {
            setCurrentVideoIndex((prev) => prev + 1);
          } else {
            setVideoError(true);
          }
        });
      };

      const handleError = () => {
        console.log('비디오 로드 실패:', video.src);
        // 로드 실패 시 다음 비디오 시도
        if (currentVideoIndex < videoSources.length - 1) {
          setCurrentVideoIndex((prev) => prev + 1);
        } else {
          setVideoError(true);
        }
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [currentVideoIndex, videoError]);

  // 비디오 소스가 변경될 때마다 비디오 다시 로드
  useEffect(() => {
    const video = videoRef.current;
    if (video && !videoError) {
      video.load();
    }
  }, [currentVideoIndex]);

  return (
    <PageLayout background='bg-[#FCFCFF]'>
      <PageLayout.Header
        background={false}
        showBack={false}
        showClose={true}
        onClose={() => navigate({ to: '/customer' })}
      />
      <PageLayout.Content>
        <FormLayout>
          <FormLayout.Content>
            <div className='flex h-full flex-col items-center justify-center gap-[1.2rem]'>
              <div className='aspect-square w-full max-w-[30rem]'>
                {!videoError ? (
                  <video
                    ref={videoRef}
                    className='h-full w-full rounded-[1.2rem] object-contain'
                    muted
                    loop
                    playsInline>
                    <source
                      src={videoSources[currentVideoIndex].src}
                      type={videoSources[currentVideoIndex].type}
                    />
                    <source src={videoOptions.ok.webm} type='video/webm' />
                    <source src={videoOptions.ok.mp4} type='video/mp4' />
                    <source src={videoOptions.escortCompleted.webm} type='video/webm' />
                    <source src={videoOptions.escortCompleted.mp4} type='video/mp4' />
                    <img
                      src={videoOptions.ok.gif}
                      alt='동행 완료 애니메이션'
                      className='h-full w-full rounded-[1.2rem] object-contain'
                    />
                  </video>
                ) : (
                  // 비디오 로드 실패 시 GIF 이미지 표시
                  <img
                    src={videoOptions.ok.gif}
                    alt='동행 완료 애니메이션'
                    className='h-full w-full rounded-[1.2rem] object-contain'
                  />
                )}
              </div>
              <FormLayout.TitleWrapper>
                <FormLayout.Title>동행 신청이 완료되었어요!</FormLayout.Title>
                <FormLayout.SubTitle className='text-center'>
                  도우미가 지원하면 <br />
                  선택하실 수 있도록 알려드려요!
                </FormLayout.SubTitle>
              </FormLayout.TitleWrapper>
            </div>
          </FormLayout.Content>
        </FormLayout>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button variant='primary' className='w-full' onClick={() => navigate({ to: '/customer' })}>
          신청 내역 보기
        </Button>
      </PageLayout.Footer>
    </PageLayout>
  );
}
