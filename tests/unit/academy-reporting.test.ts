import {describe,it,expect} from 'vitest';
import {buildAcademyReport} from '../../src/lib/academy-reporting';
const course={id:'a',slug:'finance-ready',title:'Finance Ready',status:'coming_soon'};
const enrol={course_id:'a',user_id:'u',access_status:'active',payment_status:'paid'};
describe('real Academy reporting',()=>{
 it('counts open flagships by saved status, not catalogue length',()=>expect(buildAcademyReport([course],[],[],[],[],[]).activeCourses).toBe(0));
 it('counts repeated active enrolments as one learner',()=>expect(buildAcademyReport([course],[enrol,enrol],[],[],[],[]).enrolledLearners).toBe(1));
 it('sums only successful NGN payments',()=>expect(buildAcademyReport([course],[],[{course_id:'a',status:'success',currency:'NGN',amount:25000},{course_id:'a',status:'failed',currency:'NGN',amount:25000},{course_id:'a',status:'success',currency:'USD',amount:100}],[],[],[]).revenueNGN).toBe(25000));
 it('does not mark an empty course complete',()=>expect(buildAcademyReport([course],[enrol],[],[],[],[]).rows[0]?.completionPct).toBeNull());
 it('deduplicates valid completed lessons and ignores foreign lessons',()=>{const r=buildAcademyReport([course],[enrol],[],[{id:'l',course_id:'a'},{id:'l2',course_id:'a'}],[{course_id:'a',user_id:'u',lesson_id:'l',completed:true},{course_id:'a',user_id:'u',lesson_id:'l',completed:true},{course_id:'a',user_id:'u',lesson_id:'foreign',completed:true}],[]);expect(r.rows[0]?.completionPct).toBe(50);});
 it('matches saved course IDs and historic title interests without double-counting',()=>expect(buildAcademyReport([course],[],[],[],[],[{course_id:'a',course_interest:'Finance Ready'},{course_id:null,course_interest:'Finance Ready'},{course_id:'other',course_interest:'Finance Ready'}]).rows[0]?.waitlist).toBe(2));
});