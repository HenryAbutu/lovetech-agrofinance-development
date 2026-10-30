import {it,expect,vi} from 'vitest';
vi.mock('@tanstack/react-start',()=>({createServerFn:()=>{const b={middleware:()=>b,inputValidator:()=>b,handler:(fn:unknown)=>fn};return b;}}));
vi.mock('@/integrations/supabase/auth-middleware',()=>({requireSupabaseAuth:{}}));
import {markLessonComplete} from '../../src/lib/lms.functions';
const handler=markLessonComplete as unknown as (x:unknown)=>Promise<unknown>;
function context(courseId:string,active:boolean){const write=vi.fn();const sb={from:(table:string)=>{const q={select:()=>q,eq:()=>q,limit:()=>q,maybeSingle:()=>Promise.resolve({data:table==='academy_lessons'?{id:'l',course_id:courseId}:active?{id:'enrol'}:null,error:null}),upsert:write};return q;}};return {supabase:sb,userId:'u',write};}
it('refuses completion without active authorised enrolment',async()=>{const c=context('course',false);await expect(handler({data:{lesson_id:'l',course_id:'course',completed:true},context:c})).rejects.toThrow('Active course enrolment');expect(c.write).not.toHaveBeenCalled();});
it('refuses completion against a different course',async()=>{const c=context('different-course',true);await expect(handler({data:{lesson_id:'l',course_id:'course',completed:true},context:c})).rejects.toThrow('Lesson is not available');expect(c.write).not.toHaveBeenCalled();});