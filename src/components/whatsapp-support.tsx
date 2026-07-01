import { MessageCircle } from "lucide-react";
import { LMS_CONFIG, whatsappUrl } from "@/lib/lms-config";

export function WhatsAppSupportButton({ prefill }: { prefill?: string }) {
  return (
    <a
      href={whatsappUrl(prefill)}
      target="_blank"
      rel="noreferrer noopener"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
      aria-label="Chat with Lovetech on WhatsApp"
    >
      <MessageCircle className="size-4" /> Support
    </a>
  );
}

export function WhatsAppSupportCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-3 flex items-center gap-2 text-vetiver">
        <MessageCircle className="size-5" />
        <h3 className="font-serif text-lg">Need help?</h3>
      </div>
      <p className="mb-4 text-sm text-foreground/70">{LMS_CONFIG.whatsapp.supportText}</p>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-4 py-2 text-sm font-semibold text-white"
      >
        <MessageCircle className="size-4" /> Chat on WhatsApp
      </a>
    </div>
  );
}
