import { createFileRoute } from '@tanstack/react-router';
import { ServicePage } from '@/components/website/presentation';
import { websiteHead, serviceContent } from '@/components/website/content';
export const Route = createFileRoute('/agribusiness-development')({
 head: () => websiteHead('Agribusiness & Enterprise Development', serviceContent.find(s=>s.id==='agribusiness')?.intro ?? 'Agribusiness & Enterprise Development'),
 component: () => <ServicePage id="agribusiness" />,
});
