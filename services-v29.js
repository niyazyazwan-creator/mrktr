// MRKTR V29 — one reusable glass explanation panel; pointer, keyboard, and touch supported.
(()=>{
 const root=document.querySelector('.services-v29');if(!root)return;
 const cards=[...root.querySelectorAll('.s29-card')];
 const pop=root.querySelector('.s29-glass');
 const name=pop.querySelector('.s29-glass-name');
 const desc=pop.querySelector('.s29-glass-description');
 const kind=pop.querySelector('.s29-glass-type');
 let active=null,hideTimer=0,tapLock=false;
 const mobile=()=>matchMedia('(max-width:640px)').matches;
 function position(card){
  if(mobile()){pop.style.left='15px';pop.style.top='auto';return;}
  const r=card.getBoundingClientRect();const w=355;const h=215;
  let x=r.right+18,y=r.top-25;
  if(x+w>innerWidth-18)x=r.left-w-18;
  if(x<15)x=Math.max(15,(innerWidth-w)/2);
  y=Math.min(Math.max(12,y),Math.max(12,innerHeight-h-16));
  pop.style.left=Math.round(x)+'px';pop.style.top=Math.round(y)+'px';
 }
 function show(card,locked=false){
  clearTimeout(hideTimer);if(active&&active!==card){active.classList.remove('s29-active');active.setAttribute('aria-pressed','false');}
  active=card;tapLock=locked;active.classList.add('s29-active');active.setAttribute('aria-pressed','true');
  name.textContent=card.dataset.name;desc.textContent=card.dataset.desc;kind.textContent=card.dataset.category||'SERVICE / PLATFORM';
  pop.hidden=false;position(card);
  requestAnimationFrame(()=>pop.classList.add('s29-open'));
 }
 function dismiss(immediate=false){
  clearTimeout(hideTimer);
  if(!active)return;
  const old=active;active=null;tapLock=false;
  old.classList.remove('s29-active');old.setAttribute('aria-pressed','false');
  pop.classList.remove('s29-open');
  hideTimer=setTimeout(()=>{if(!active)pop.hidden=true;},immediate?0:250);
 }
 cards.forEach(card=>{
  card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'||e.pointerType==='pen')show(card,false);});
  card.addEventListener('pointerleave',e=>{if((e.pointerType==='mouse'||e.pointerType==='pen')&&!tapLock) dismiss();});
  card.addEventListener('focus',()=>show(card,false));
  card.addEventListener('blur',()=>{if(!tapLock)dismiss();});
  card.addEventListener('click',e=>{
   // Touch: keep details open until the next card/tap outside.
   if(e.detail===0){show(card,true);return;}
   if(active===card&&tapLock){dismiss();return;}
   show(card,true);
  });
 });
 document.addEventListener('pointerdown',e=>{if(active&&!e.target.closest('.s29-card')&&!e.target.closest('.s29-glass'))dismiss(true);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')dismiss(true);});
 window.addEventListener('scroll',()=>{if(!active)return;const r=active.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)dismiss(true);else if(!mobile())position(active);},{passive:true});
 window.addEventListener('resize',()=>{if(active)position(active);},{passive:true});
})();
