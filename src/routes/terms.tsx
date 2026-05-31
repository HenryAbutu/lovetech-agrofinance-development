import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — LoveTech" }, { name: "description", content: "Terms of service for LoveTech Agrofinance & Development." }] }),
  component: () => (
    <main className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <h1 className="mb-6 font-serif text-5xl text-vetiver">Terms & Conditions</h1>
      <div className="space-y-4 text-foreground/75">
        <p>By using our services, courses or website you agree to engage in good faith and to use materials we provide for your own learning and business use.</p>
        <p>Course fees are non-refundable once access is granted, except where required by law.</p>
        <p>We make every effort to deliver accurate training and advisory, but final business decisions remain your responsibility.</p>
      </div>
    </main>
  ),
});
