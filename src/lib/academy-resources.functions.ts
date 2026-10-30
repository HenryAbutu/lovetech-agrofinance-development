import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
async function admin(sb:any,userId:string){const r=await sb.rpc('has_role',{_user_id:userId,_role:'admin'});if(r.error||!r.data)throw new Error('Forbidden');}
export const listCourseResourcesAdmin=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).inputValidator(i=>z.object({course_id:z.string().uuid()}).parse(i)).handler(async({data,context})=>{
 await admin(context.supabase,context.userId);
 const r=await context.supabase.from('academy_resources').select('id,course_id,module_id,title,description,resource_type,file_url,is_public').eq('course_id',data.course_id).order('created_at');
 if(r.error)throw new Error(r.error.message);return {resources:r.data??[]};
});
export const saveCourseResourceAdmin=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(i=>z.object({id:z.string().uuid().optional(),course_id:z.string().uuid(),module_id:z.string().uuid().nullable().default(null),title:z.string().min(1).max(200),resource_type:z.string().min(1).max(80),file_url:z.string().min(1).max(4000)}).parse(i)).handler(async({data,context})=>{
 await admin(context.supabase,context.userId);
 if(data.module_id){const m=await context.supabase.from('academy_modules').select('course_id').eq('id',data.module_id).maybeSingle();if(m.error||m.data?.course_id!==data.course_id)throw new Error('Resource module must belong to this course.');}
 const r=await context.supabase.from('academy_resources').upsert({...data,is_public:false});if(r.error)throw new Error(r.error.message);return {ok:true};
});