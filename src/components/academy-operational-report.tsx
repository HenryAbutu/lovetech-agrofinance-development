import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useServerFn} from '@tanstack/react-start';
import {Download} from 'lucide-react';
import {getAcademyReport} from '@/lib/academy-reporting.functions';
import {downloadCsv} from '@/lib/lms-admin';
import {Button} from '@/components/ui/button';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
export function AcademyOperationalReport(){
 const fetchReport=useServerFn(getAcademyReport);
 const {data,error,isPending}=useQuery({queryKey:['admin','academy-operational-report'],queryFn:()=>fetchReport()});
 const [scope,setScope]=useState('flagship');
 if(isPending)return <p className="text-sm text-muted-foreground">Loading Academy records…</p>;
 if(error||!data)return <p role="alert" className="text-sm text-destructive">Academy figures could not be loaded.</p>;
 const rows=data.rows.filter(c=>scope==='flagship'?c.flagship:!c.flagship);
 const figures=[['Open flagship courses',data.activeCourses],['Active learners',data.enrolledLearners],['Lesson-complete enrolments',data.completedLearners],['Successful NGN payments',`₦${data.revenueNGN.toLocaleString('en-NG')}`],['Waitlist entries',data.waitlistCount]];
 return <section className="space-y-5 border-b border-border pb-8"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-xl font-semibold">Academy course performance</h2><Button variant="outline" size="sm" onClick={()=>downloadCsv(`academy-${scope}-report`,rows)}><Download/> Export report</Button></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{figures.map(([title,value])=><div key={String(title)} className="border-l-2 border-primary pl-4"><p className="text-xs text-muted-foreground">{title}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>)}</div><p className="text-xs text-muted-foreground">All-time records. Successful payments include sandbox transactions. Lesson completion is not assessment or certificate approval; historical programme evidence is reported separately below.</p><Tabs value={scope} onValueChange={setScope}><TabsList><TabsTrigger value="flagship">Six flagships</TabsTrigger><TabsTrigger value="archive">Historical courses</TabsTrigger></TabsList></Tabs><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead><tr className="border-b border-border text-muted-foreground">{['Course','Availability','Enrolments','Active learners','Lessons','Lesson completion','NGN payments','Waitlist'].map(h=><th key={h} className="px-3 py-3 font-medium">{h}</th>)}</tr></thead><tbody>{rows.map(c=><tr key={c.id} className="border-b border-border"><td className="max-w-64 px-3 py-4 font-semibold">{c.title}</td><td className="px-3 py-4">{c.status.replaceAll('_',' ')}</td><td className="px-3 py-4">{c.enrolments}</td><td className="px-3 py-4">{c.activeLearners}</td><td className="px-3 py-4">{c.lessons}</td><td className="px-3 py-4">{c.completionPct===null?'—':`${c.completionPct}%`}</td><td className="px-3 py-4">₦{c.revenueNGN.toLocaleString('en-NG')}</td><td className="px-3 py-4">{c.waitlist}</td></tr>)}</tbody></table></div></section>;
}