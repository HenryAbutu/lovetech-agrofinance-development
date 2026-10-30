import {it,expect,vi} from 'vitest';
const mocks=vi.hoisted(()=>({insert:vi.fn(async()=>({error:null})),email:vi.fn(async()=>({ok:true}))}));
vi.mock('@/lib/supabase',()=>({getActiveSupabaseSession:async()=>null,supabase:{from:(table:string)=>{const q={select:()=>q,eq:()=>q,maybeSingle:async()=>({data:{id:'finance-course'},error:null}),insert:mocks.insert};return q;}}}));
vi.mock('@/lib/waitlist.functions',()=>({sendWaitlistConfirmation:mocks.email}));
import {joinWaitlist} from '../../src/lib/waitlist';
it('links a flagship waitlist entry to the resolved course ID while preserving the title',async()=>{await joinWaitlist({full_name:'Test Learner',email:'test@example.invalid'},'Finance Ready: Accessing Finance and Investment','finance-ready');expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({course_id:'finance-course',course_interest:'Finance Ready: Accessing Finance and Investment'}));});