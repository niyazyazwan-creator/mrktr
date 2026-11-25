// MRKTR enquiry: Formspree submission on GitHub Pages, preserving existing UI.
(()=>{'use strict';
 const form=document.getElementById('mrktr-enquiry-form');if(!form)return;
 const select=document.getElementById('lead-code');
 const extra=document.getElementById('lead-other-code');
 const status=document.getElementById('v48-form-status');
 const btn=form.querySelector('button[type=submit]');
 const btnText=btn?.querySelector('span:first-child');
 const endpoint='https://formspree.io/f/mnpdovnz';
 function toggleOther(){const show=select.value==='other';extra.hidden=!show;extra.disabled=!show;extra.required=show;if(!show)extra.value='';}
 select.addEventListener('change',toggleOther);toggleOther();
 function resetButton(){btn.disabled=false;if(btnText)btnText.textContent='Send enquiry';}
 form.addEventListener('submit',async event=>{
  event.preventDefault();status.textContent='';
  if(!form.checkValidity()){form.reportValidity();return;}
  if(form.elements.website?.value)return;
  const payload=new FormData(form);
  payload.delete('form-name');
  payload.delete('website');
  if(payload.get('calling_code')==='other')payload.set('calling_code',payload.get('other_calling_code')||'');
  payload.delete('other_calling_code');
  payload.set('_subject','New MRKTR website enquiry');
  btn.disabled=true;if(btnText)btnText.textContent='SENDING…';
  try{
   const response=await fetch(endpoint,{method:'POST',body:payload,headers:{Accept:'application/json'}});
   if(!response.ok)throw new Error('Formspree HTTP '+response.status);
   form.reset();toggleOther();
   status.textContent='Thank you! Your enquiry has been submitted successfully. I will be in touch.';
   // A successful response is required before firing lead measurement.
   window.dataLayer=window.dataLayer||[];
   window.dataLayer.push({event:'generate_lead',form_id:'mrktr-enquiry-form',form_provider:'formspree'});
   window.location.assign(new URL('thank-you.html', window.location.href).href);
  }catch(error){
   status.textContent='Sorry, your enquiry could not be submitted. Please try again, or contact me using WhatsApp or email.';
  }finally{resetButton();}
 });
 const note=form.querySelector('.v48-form-disclaimer');
 if(note)note.textContent='Your enquiry is submitted securely through Formspree. Your email app will not open.';
})();
