import { createFileRoute } from '@tanstack/react-router';
import { ServicePage } from '@/components/website/presentation';
import { websiteHead, serviceContent } from '@/components/website/content';
export const Route = createFileRoute('/programme-support')({
 head: () => websiteHead('Programme & Institutional Support', serviceContent.find(s=>s.id==='programme')?.intro ?? 'Programme & Institutional Support'),
 component: () => <ServicePage id="programme" />,
});
