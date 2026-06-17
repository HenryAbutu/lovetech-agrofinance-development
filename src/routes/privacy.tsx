import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — LoveTech" }, { name: "description", content: "How LoveTech handles your data." }] }),
  component: () => (
    <main className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <h1 className="mb-6 font-serif text-5xl text-vetiver">Privacy Policy</h1>
      <div className="space-y-4 text-foreground/75">
        <p>We collect only the information you submit through our forms (name, email, phone, business details) and use it to respond to enquiries, deliver training and provide our services.</p>
        <p>We do not sell your data. We share it only with payment processors and service providers strictly needed to deliver what you've requested.</p>
        <p>To request deletion of your data, email info@lovetechgroup.com.ng.</p>
      </div>
    </main>
  ),
});
