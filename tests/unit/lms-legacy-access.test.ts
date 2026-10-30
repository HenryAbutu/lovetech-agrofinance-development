import {it,expect,vi} from 'vitest';
vi.mock('@tanstack/react-start',()=>({createServerFn:()=>{const b={middleware:()=>b,inputValidator:()=>b,handler:(fn:unknown)=>fn};return b;}}));
vi.mock('@/integrations/supabase/auth-middleware',()=>({requireSupabaseAuth:{}}));
import {getMyCourseContent} from '../../src/lib/lms.functions';
it('retains active course access when the learner has repeated paid enrolments',async()=>{
 const rows=[{id:'old',user_id:'learner',course_id:'course',access_status:'active',payment_status:'paid'},{id:'new',user_id:'learner',course_id:'course',access_status:'active',payment_status:'paid'}];
 const sb={from:(table:string)=>{let data:Record<string,unknown>[]=table==='academy_courses'?[{id:'course',slug:'professionals-ai-edge'}]:table==='academy_enrolments'?rows:[];const q={select:()=>q,eq:(key:string,v:unknown)=>{data=data.filter(r=>r[key]===v);return q;},order:()=>q,limit:(n:number)=>{data=data.slice(0,n);return q;},maybeSingle:()=>Promise.resolve(data.length>1?{data:null,error:{message:'multiple rows'}}:{data:data[0]??null,error:null}),then:(r:(v:unknown)=>unknown)=>Promise.resolve({data,error:null}).then(r)};return q;}};
 const handler=getMyCourseContent as unknown as (x:unknown)=>Promise<{hasAccess:boolean}>;
 const result=await handler({data:{slug:'professionals-ai-edge'},context:{supabase:sb,userId:'learner'}});
 expect(result.hasAccess).toBe(true);
});