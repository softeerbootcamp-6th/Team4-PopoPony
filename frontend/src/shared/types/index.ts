export interface TermsData {
  id: string;
  title: string;
  content: string;
  required: boolean;
}

export interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  terms: TermsData;
}
