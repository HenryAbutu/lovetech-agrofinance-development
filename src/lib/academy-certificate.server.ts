import {PDFDocument,rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import headingAsset from '@/assets/flagship/montserrat.ttf.asset.json';
import bodyAsset from '@/assets/flagship/inter.ttf.asset.json';
import logoAsset from '@/assets/flagship/logo.png.asset.json';
export async function generateAcademyCertificate(input:{name:string;courseTitle:string;certificateId:string;issuedAt:Date}){
 const origin='https://lovetechgroup.lovable.app';
 async function asset(path:string){const r=await fetch(new URL(path,origin));if(!r.ok)throw new Error('Certificate brand asset unavailable');return new Uint8Array(await r.arrayBuffer());}
 const [headingBytes,bodyBytes,logoBytes]=await Promise.all([asset(headingAsset.url),asset(bodyAsset.url),asset(logoAsset.url)]);
 const pdf=await PDFDocument.create();pdf.registerFontkit(fontkit);
 const heading=await pdf.embedFont(headingBytes,{subset:true});const body=await pdf.embedFont(bodyBytes,{subset:false});const logo=await pdf.embedPng(logoBytes);
 const page=pdf.addPage([842,595]);
 const navy=rgb(11/255,45/255,91/255),green=rgb(22/255,163/255,74/255),orange=rgb(249/255,115/255,22/255);
 page.drawRectangle({x:20,y:20,width:802,height:555,borderColor:navy,borderWidth:3});
 page.drawLine({start:{x:30,y:30},end:{x:812,y:30},color:green,thickness:5});
 page.drawLine({start:{x:30,y:565},end:{x:812,y:565},color:orange,thickness:3});
 const logoSize=logo.scaleToFit(210,65);page.drawImage(logo,{x:(842-logoSize.width)/2,y:480,width:logoSize.width,height:logoSize.height});
 function centered(text:string,y:number,size:number,font=body){const fitted=Math.min(size,730/font.widthOfTextAtSize(text,1));page.drawText(text,{x:(842-font.widthOfTextAtSize(text,fitted))/2,y,size:fitted,font,color:navy});}
 centered('LOVETECH ACADEMY',455,15,heading);
 centered('Certificate of Completion',405,31,heading);
 centered('This certifies that',366,13);
 centered(input.name,325,29,heading);
 page.drawLine({start:{x:200,y:311},end:{x:642,y:311},color:orange,thickness:1});
 centered('has successfully completed the course',284,13);
 centered(input.courseTitle,251,19,heading);
 centered('delivered by LoveTech Agrofinance & Development Ltd.',224,12);
 centered('Chinny Loveday-Chukwu',175,14,heading);
 centered('Founder & Chief Learning Officer',156,10);
 centered(input.issuedAt.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),100,12);
 centered(`Certificate ID: ${input.certificateId}`,76,11);
 return pdf.save();
}