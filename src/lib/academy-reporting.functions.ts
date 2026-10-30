import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { buildAcademyReport } from './academy-reporting';
export const getAcademyReport = createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data:admin,error}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
 if(error||!admin)throw new Error('Forbidden');
 // Page every collection: a default API row limit must never truncate totals.
 async function all<T>(query:(from:number,to:number)=>PromiseLike<{data:T[]|null;error:{message:string}|null}>){
  const rows:T[]=[];
  for(let from=0;;from+=500){const r=await query(from,from+499);if(r.error)throw new Error(r.error.message);const page=r.data??[];rows.push(...page);if(page.length<500)return rows;}
 }
 const sb=context.supabase;
 const [courses,enrolments,payments,lessons,progress,waitlist]=await Promise.all([
  all((f,t)=>sb.from('academy_courses').select('id,slug,title,status').order('id').range(f,t)),
  all((f,t)=>sb.from('academy_enrolments').select('course_id,user_id,access_status,payment_status').order('id').range(f,t)),
  all((f,t)=>sb.from('academy_payments').select('course_id,status,currency,amount').order('id').range(f,t)),
  all((f,t)=>sb.from('academy_lessons').select('id,course_id').order('id').range(f,t)),
  all((f,t)=>sb.from('academy_lesson_progress').select('course_id,user_id,lesson_id,completed').order('id').range(f,t)),
  all((f,t)=>sb.from('academy_waitlist').select('course_id,course_interest').order('id').range(f,t)),
 ]);
 return buildAcademyReport(courses,enrolments,payments,lessons,progress,waitlist);
});