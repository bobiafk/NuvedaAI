interface TallySubmissionField {
  id: string;
  title: string;
  type:
    | "INPUT_TEXT"
    | "INPUT_NUMBER"
    | "INPUT_EMAIL"
    | "INPUT_PHONE_NUMBER"
    | "INPUT_LINK"
    | "INPUT_DATE"
    | "INPUT_TIME"
    | "TEXTAREA"
    | "MULTIPLE_CHOICE"
    | "DROPDOWN"
    | "CHECKBOXES"
    | "LINEAR_SCALE"
    | "FILE_UPLOAD"
    | "HIDDEN_FIELDS"
    | "CALCULATED_FIELDS"
    | "RATING"
    | "MULTI_SELECT"
    | "MATRIX"
    | "RANKING"
    | "SIGNATURE"
    | "PAYMENT";
  answer: { value: unknown; raw: unknown };
}

interface TallySubmissionPayload {
  id: string;
  respondentId: string;
  formId: string;
  formName: string;
  createdAt: string;
  fields: TallySubmissionField[];
}

interface TallyPopupOptions {
  key?: string;
  layout?: "default" | "modal";
  width?: number;
  alignLeft?: boolean;
  hideTitle?: boolean;
  overlay?: boolean;
  emoji?: {
    text: string;
    animation:
      | "none"
      | "wave"
      | "tada"
      | "heart-beat"
      | "spin"
      | "flash"
      | "bounce"
      | "rubber-band"
      | "head-shake";
  };
  autoClose?: number;
  showOnce?: boolean;
  doNotShowAfterSubmit?: boolean;
  customFormUrl?: string;
  hiddenFields?: Record<string, unknown>;
  onOpen?: () => void;
  onClose?: () => void;
  onPageView?: (page: number) => void;
  onSubmit?: (payload: TallySubmissionPayload) => void;
}

interface Window {
  Tally?: {
    openPopup: (formId: string, options?: TallyPopupOptions) => void;
    closePopup: (formId: string) => void;
    loadEmbeds: () => void;
  };
}
