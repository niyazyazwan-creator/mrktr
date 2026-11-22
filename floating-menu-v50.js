/* MRKTR V50 — global menu, one-click/tap reliable even above animated sections. */
(()=>{'use strict';
 const trigger=document.querySelector('#v50-menu-trigger');
 const panel=document.querySelector('#premium-nav');
 if(!trigger||!panel)return;
 const links=[...panel.querySelectorAll('.premium-nav-links a')];
 let opened=false,previousFocus=null,previousOverflow='';
 function open(){
  if(opened)return;
  opened=true;previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;
  panel.inert=false;panel.removeAttribute('inert');panel.setAttribute('aria-hidden','false');
  panel.classList.add('open');trigger.classList.add('is-open');
  trigger.setAttribute('aria-expanded','true');trigger.setAttribute('aria-label','Close navigation menu');trigger.title='Close menu';
  document.body.classList.add('v50-menu-open');document.body.style.overflow='hidden';
  // Delay focus until panel becomes visible, but do not delay the interaction itself.
  requestAnimationFrame(()=>{if(opened)links[0]?.focus({preventScroll:true});});
 }
 function close({restore=true}={}){
  if(!opened)return;
  opened=false;panel.classList.remove('open');
  panel.setAttribute('aria-hidden','true');panel.inert=true;panel.setAttribute('inert','');
  trigger.classList.remove('is-open');trigger.setAttribute('aria-expanded','false');
  trigger.setAttribute('aria-label','Open navigation menu');trigger.title='Open menu';
  document.body.classList.remove('v50-menu-open');document.body.style.overflow=previousOverflow;
  if(restore){(previousFocus?.isConnected?previousFocus:trigger).focus({preventScroll:true});}
 }
 trigger.addEventListener('click',()=>opened?close():open());
 // Close on menu action, keeping native anchor routing and hash behavior.
 links.forEach(link=>link.addEventListener('click',()=>close({restore:false})));
 panel.querySelector('.nav-close')?.addEventListener('click',()=>close());
 panel.addEventListener('click',e=>{if(e.target===panel)close()});
 document.addEventListener('keydown',e=>{
  if(!opened)return;
  if(e.key==='Escape'){e.preventDefault();close();return;}
  if(e.key==='Tab'){
    const candidates=[trigger,...links].filter(el=>el.isConnected&&!el.hasAttribute('disabled'));
    const i=candidates.indexOf(document.activeElement);
    if(e.shiftKey&&i<=0){e.preventDefault();candidates[candidates.length-1].focus();}
    else if(!e.shiftKey&&i===candidates.length-1){e.preventDefault();candidates[0].focus();}
  }
 });
 // Keep the menu out of the way when the URL changes outside the menu.
 addEventListener('hashchange',()=>{if(opened)close({restore:false});});
 // For manual browser tests; no effect on normal website behavior.
 window.MRKTR_V50_MENU={isOpen:()=>opened};
})();
