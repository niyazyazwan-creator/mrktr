// V48 — accessible enquiry form with honest local-email fallback and Netlify Forms integration.
(()=>{'use strict';
 const form=document.getElementById('mrktr-enquiry-form'); if(!form)return;
 const select=document.getElementById('lead-code'), extra=document.getElementById('lead-other-code'), status=document.getElementById('v48-form-status');
 const btn=form.querySelector('button[type=submit]');
 function toggleOther(){const show=select.value==='other';extra.hidden=!show;extra.disabled=!show;extra.required=show;if(!show)extra.value='';}
 select.addEventListener('change',toggleOther);toggleOther();
 const isNetlify=()=>location.hostname.endsWith('.netlify.app')||form.getAttribute('data-submit-to-netlify')==='true';
 const mailtoFor=payload=>{
  const detail=[['Name',payload.get('name')],['Email',payload.get('email')],['Mobile',(payload.get('calling_code')==='other'?payload.get('other_calling_code'):payload.get('calling_code'))+' '+payload.get('phone')],['City',payload.get('city')],['Country',payload.get('country')],['Service needed',payload.get('service')]];
  return 'mailto:niyazyazwan@gmail.com?subject='+encodeURIComponent('MRKTR enquiry — '+payload.get('service'))+'&body='+encodeURIComponent('Hi, I would like to enquire about your services.\n\n'+detail.map(([k,v])=>k+': '+(v||'')).join('\n')+'\n\nThank you.');
 };
 function resetButton(){btn.disabled=false;btn.querySelector('span:first-child').textContent='SUBMIT ENQUIRY';}
 form.addEventListener('submit',async e=>{
   e.preventDefault();status.textContent='';
   // A short accessible validation path keeps native field constraints.
   if(!form.checkValidity()){form.reportValidity();return;}
   if(form.elements.website?.value)return;
   const payload=new FormData(form);
   const mailto=mailtoFor(payload);
   if(!isNetlify()){
       status.textContent='Your email app will open with the enquiry. Press Send there to finish — nothing has been sent yet.';
       window.location.href=mailto;
       return;
   }
   btn.disabled=true;btn.querySelector('span:first-child').textContent='SENDING…';
   try{
      const post=new URLSearchParams(payload);
      const r=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:post.toString()});
      if(!r.ok)throw new Error('HTTP '+r.status);
      form.reset();toggleOther();status.textContent='Thank you. Your enquiry has been submitted; I will be in touch.';
   }catch(err){
      status.textContent='The form could not be submitted automatically. Please use the email option below.';
      const a=document.createElement('a');a.href=mailto;a.textContent='Open prepared email ↗';a.style.marginLeft='8px';status.append(a);
   }finally{resetButton();}
 });
 // Make the conditional deployment instructions clear without affecting design.
 const note=form.querySelector('.v48-form-disclaimer');
 if(note && isNetlify())note.textContent='Enquiries are securely submitted through this website’s Netlify form.';
})();