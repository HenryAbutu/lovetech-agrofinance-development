import {it,expect,vi} from 'vitest';
vi.mock('@tanstack/react-start',()=>({createServerFn:()=>{const b={middleware:()=>b,inputValidator:()=>b,handler:(fn:unknown)=>fn};return b;}}));
vi.mock('@/integrations/supabase/auth-middleware',()=>({requireSupabaseAuth:{}}));
import {getAcademyReport} from '../../src/lib/academy-reporting.functions';
it('blocks a learner before reading administrator reporting records',async()=>{const from=vi.fn();const fn=getAcademyReport as unknown as (x:unknown)=>Promise<unknown>;await expect(fn({context:{userId:'learner',supabase:{rpc:async()=>({data:false,error:null}),from}}})).rejects.toThrow('Forbidden');expect(from).not.toHaveBeenCalled();});