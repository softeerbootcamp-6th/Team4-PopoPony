import { useState } from 'react';
import { BottomSheet, CheckboxCircle, Button } from '@components';
import { IcChevronRight } from '@icons';
import { getTermsById } from '@constants';
import type { TermsData } from '@types';
import TermsModal from './TermsModal';

interface TermsBottomSheetProps {
  children: React.ReactNode;
  onSubmit: () => void;
}

const TermsBottomSheet = ({ children, onSubmit }: TermsBottomSheetProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState<TermsData | null>(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  // 약관 동의 상태
  const [termsAgreement, setTermsAgreement] = useState({
    serviceTerms: false,
    privacyPolicy: false,
    locationTerms: false,
  });
  const handleTermsClick = (termsId: string) => {
    const terms = getTermsById(termsId);
    // BottomSheet 닫기
    setIsBottomSheetOpen(false);
    if (terms) {
      setSelectedTerms(terms);
      setIsTermsModalOpen(true);
    }
  };
  const handleTermsAgreementChange = (termsId: string, checked: boolean) => {
    setTermsAgreement((prev) => ({
      ...prev,
      [termsId]: checked,
    }));
  };
  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
    setSelectedTerms(null);
    setIsBottomSheetOpen(true);
  };
  const isAllChecked =
    termsAgreement.serviceTerms && termsAgreement.privacyPolicy && termsAgreement.locationTerms;
  return (
    <>
      <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <BottomSheet.Trigger asChild>{children}</BottomSheet.Trigger>

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
              onClick={onSubmit}
              className='w-full'
              disabled={!isAllChecked}>
              동의하고 신청하기
            </Button>
          </BottomSheet.Footer>
        </BottomSheet.Content>
      </BottomSheet>
      {selectedTerms && (
        <TermsModal
          isOpen={isTermsModalOpen}
          onClose={handleCloseTermsModal}
          terms={selectedTerms}
        />
      )}
    </>
  );
};

export default TermsBottomSheet;
