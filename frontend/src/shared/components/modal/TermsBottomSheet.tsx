import { useState } from 'react';
import { BottomSheet, CheckboxCircle, Button } from '@components';
import { FormLayout } from '@layouts';
import { IcChevronRight } from '@icons';

interface TermsBottomSheetProps {
  children: React.ReactNode;
}

const TermsBottomSheet = ({ children }: TermsBottomSheetProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  return (
    <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
      <FormLayout.FooterButtonWrapper>
        <div className='w-[10rem]'>
          <Button variant='secondary' onClick={handleBackStep}>
            이전
          </Button>
        </div>
        <BottomSheet.Trigger asChild>
          <Button variant='primary' className='flex-1'>
            다음
          </Button>
        </BottomSheet.Trigger>
      </FormLayout.FooterButtonWrapper>
      <BottomSheet.Content>
        <BottomSheet.Header>
          <BottomSheet.Title>이용 약관 동의가 필요해요!</BottomSheet.Title>
          <BottomSheet.Description>
            <div className='flex flex-col gap-[1.5rem]'>
              <div className='flex items-center gap-[0.8rem]'>
                <CheckboxCircle
                  checked={termsAgreement.serviceTerms}
                  onChange={(e) => handleTermsAgreementChange('serviceTerms', e.target.checked)}
                />
                <button
                  className='flex items-center gap-[0.4rem]'
                  onClick={() => handleTermsClick('service-terms')}>
                  <p className='body1-16-medium text-text-neutral-primary'>
                    토닥 서비스 이용약관(필수)
                  </p>
                  <IcChevronRight className='[&_path]:stroke-icon-neutral-secondary [&_path]:fill-icon-neutral-secondary h-[2.4rem] w-[2.4rem]' />
                </button>
              </div>
              <div className='flex items-center gap-[0.8rem]'>
                <CheckboxCircle
                  checked={termsAgreement.privacyPolicy}
                  onChange={(e) => handleTermsAgreementChange('privacyPolicy', e.target.checked)}
                />
                <button
                  className='flex items-center gap-[0.4rem]'
                  onClick={() => handleTermsClick('privacy-policy')}>
                  <p className='body1-16-medium text-text-neutral-primary'>
                    개인정보처리방침(필수)
                  </p>
                  <IcChevronRight className='[&_path]:stroke-icon-neutral-secondary [&_path]:fill-icon-neutral-secondary h-[2.4rem] w-[2.4rem]' />
                </button>
              </div>
              <div className='flex items-center gap-[0.8rem]'>
                <CheckboxCircle
                  checked={termsAgreement.locationTerms}
                  onChange={(e) => handleTermsAgreementChange('locationTerms', e.target.checked)}
                />
                <button
                  className='flex items-center gap-[0.4rem]'
                  onClick={() => handleTermsClick('location-terms')}>
                  <p className='body1-16-medium text-text-neutral-primary'>
                    위치정보 이용약관(필수)
                  </p>
                  <IcChevronRight className='[&_path]:stroke-icon-neutral-secondary [&_path]:fill-icon-neutral-secondary h-[2.4rem] w-[2.4rem]' />
                </button>
              </div>
            </div>
          </BottomSheet.Description>
        </BottomSheet.Header>

        <BottomSheet.Footer>
          <Button
            variant='primary'
            onClick={handleSubmit}
            className='w-full'
            disabled={!isAllChecked}>
            동의하고 신청하기
          </Button>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
};

export default TermsBottomSheet;
