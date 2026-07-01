// Central config for LMS placeholders.
// Replace these with real links when ready.

export const LMS_CONFIG = {
  whatsapp: {
    number: "+2348026065189",
    display: "0802 606 5189",
    supportText:
      "Need help with enrolment, payment, course access or certificate? Chat with Lovetech support on WhatsApp.",
  },
  courses: {
    "ai-tools-small-businesses": {
      assignmentFormUrl: "https://forms.gle/REPLACE-WITH-ASSIGNMENT-FORM",
      assessmentFormUrl: "https://forms.gle/REPLACE-WITH-ASSESSMENT-FORM",
      handbookUrl: "/resources/ai-tools-participant-handbook.pdf",
      promptBankUrl: "/resources/ai-tools-prompt-bank.pdf",
      contentCalendarUrl: "/resources/ai-tools-content-calendar.pdf",
      actionPlanUrl: "/resources/ai-tools-action-plan-template.pdf",
      certificateIdPrefix: "LTAI-BASIC-2026",
    },
    "professionals-ai-edge": {
      assignmentFormUrl: "https://forms.gle/REPLACE-WITH-ASSIGNMENT-FORM",
      assessmentFormUrl: "https://forms.gle/REPLACE-WITH-ASSESSMENT-FORM",
      handbookUrl: "",
      certificateIdPrefix: "LTAI-EDGE-2026",
    },
  } as Record<string, {
    assignmentFormUrl?: string;
    assessmentFormUrl?: string;
    handbookUrl?: string;
    promptBankUrl?: string;
    contentCalendarUrl?: string;
    actionPlanUrl?: string;
    certificateIdPrefix?: string;
  }>,
};

export function whatsappUrl(prefill = "Hi Lovetech, I need help with the Academy.") {
  const num = LMS_CONFIG.whatsapp.number.replace(/[^\d]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(prefill)}`;
}
