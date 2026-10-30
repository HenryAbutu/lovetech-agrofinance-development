import { isFlagship } from './flagship-rules';
type Course = {id:string;slug:string;title:string;status:string};
type Enrolment = {course_id:string;user_id:string|null;access_status:string;payment_status:string};
type Payment = {course_id:string;status:string;currency:string;amount:string|number|null};
type Lesson = {id:string;course_id:string};
type Progress = {course_id:string;user_id:string;lesson_id:string;completed:boolean|null};
type Waitlist = {course_id:string|null;course_interest:string|null};
export function buildAcademyReport(courses:Course[],enrolments:Enrolment[],payments:Payment[],lessons:Lesson[],progress:Progress[],waitlist:Waitlist[]) {
 const rows=courses.map(c=>{
  const entries=enrolments.filter(e=>e.course_id===c.id);
  const active=entries.filter(e=>e.access_status==='active');
  const users=new Set(active.flatMap(e=>e.user_id?[e.user_id]:[]));
  const lessonIds=new Set(lessons.filter(l=>l.course_id===c.id).map(l=>l.id));
  let completedLearners=0,completedLessons=0;
  for(const user of users){
   const done=new Set(progress.filter(p=>p.course_id===c.id&&p.user_id===user&&p.completed&&lessonIds.has(p.lesson_id)).map(p=>p.lesson_id));
   completedLessons+=done.size;
   if(lessonIds.size>0&&done.size===lessonIds.size)completedLearners++;
  }
  return {id:c.id,slug:c.slug,title:c.title,status:c.status,flagship:isFlagship(c.slug),enrolments:entries.length,paidEnrolments:entries.filter(e=>e.payment_status==='paid').length,activeLearners:users.size,lessons:lessonIds.size,completedLessons,completedLearners,completionPct:users.size&&lessonIds.size?Math.round(completedLessons/(users.size*lessonIds.size)*100):null,revenueNGN:payments.filter(p=>p.course_id===c.id&&p.status==='success'&&p.currency==='NGN').reduce((n,p)=>n+Number(p.amount??0),0),waitlist:waitlist.filter(w=>w.course_id===c.id||(!w.course_id&&(w.course_interest===c.title||w.course_interest===c.slug))).length};
 });
 return {rows,activeCourses:rows.filter(c=>c.flagship&&c.status==='enrolment_open').length,enrolledLearners:new Set(enrolments.filter(e=>e.access_status==='active').flatMap(e=>e.user_id?[e.user_id]:[])).size,revenueNGN:payments.filter(p=>p.status==='success'&&p.currency==='NGN').reduce((n,p)=>n+Number(p.amount??0),0),waitlistCount:waitlist.length,completedLearners:rows.reduce((n,c)=>n+c.completedLearners,0)};
}