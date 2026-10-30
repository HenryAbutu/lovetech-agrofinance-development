import {describe,it,expect} from 'vitest';
import {FLAGSHIP_PRICE,FLAGSHIP_SLUGS,assertFlagshipCheckout} from '../../src/lib/flagship-rules';
import {resolveBasePrice} from '../../src/lib/pricing';
describe('Flagship course requirements',()=>{
 it('has exactly six distinct courses',()=>expect(new Set(FLAGSHIP_SLUGS).size).toBe(6));
 it('charges 25000 per course',()=>expect(FLAGSHIP_PRICE).toBe(25000));
 it('ignores outdated stored discounts for every flagship',()=>{for(const slug of FLAGSHIP_SLUGS)expect(resolveBasePrice(slug,{id:'course',regular_price:8900,discount_price:1000}).basePrice).toBe(25000);});
 it('blocks coming-soon checkout',()=>expect(()=>assertFlagshipCheckout('finance-ready',{status:'coming_soon',content_ready:true,publication_approved:true})).toThrow());
 it('requires uploaded ready content',()=>expect(()=>assertFlagshipCheckout('finance-ready',{status:'enrolment_open',content_ready:false,publication_approved:true})).toThrow());
 it('requires publication approval',()=>expect(()=>assertFlagshipCheckout('finance-ready',{status:'enrolment_open',content_ready:true,publication_approved:false})).toThrow());
 it('rejects module offers',()=>expect(()=>assertFlagshipCheckout('finance-ready',{status:'enrolment_open',content_ready:true,publication_approved:true},'single_module')).toThrow());
 it('rejects promotions',()=>expect(()=>assertFlagshipCheckout('finance-ready',{status:'enrolment_open',content_ready:true,publication_approved:true},null,'SALE')).toThrow());
 it('closes historic courses to new checkout',()=>expect(()=>assertFlagshipCheckout('professionals-ai-edge',{status:'enrolment_open'})).toThrow());
});