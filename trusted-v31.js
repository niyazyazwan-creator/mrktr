
(()=>{
 const root=document.querySelector('.trusted-v31'); if(!root) return;
 const cards=[...root.querySelectorAll('.t31-card')];
 const pop=root.querySelector('.t31-glass');
 const name=pop.querySelector('.t31-glass-name');
 const desc=pop.querySelector('.t31-glass-description');
 const kind=pop.querySelector('.t31-glass-type');
 let active=null, hideTimer=0, tapLock=false;
 const mobile=()=>matchMedia('(max-width:640px)').matches;
 function position(card){
  if(mobile()){pop.style.left='15px';pop.style.top='auto';return;}
  const r=card.getBoundingClientRect(); const w=355; const h=215;
  let x=r.right+18, y=r.top-25;
  if(x+w>innerWidth-18) x=r.left-w-18;
  if(x<15) x=Math.max(15,(innerWidth-w)/2);
  y=Math.min(Math.max(12,y),Math.max(12,innerHeight-h-16));
  pop.style.left=Math.round(x)+'px'; pop.style.top=Math.round(y)+'px';
 }
 function show(card, locked=false){
  clearTimeout(hideTimer);
  if(active && active!==card){active.classList.remove('t31-active'); active.setAttribute('aria-pressed','false');}
  active=card; tapLock=locked; active.classList.add('t31-active'); active.setAttribute('aria-pressed','true');
  name.textContent=card.dataset.name; desc.textContent=card.dataset.desc; kind.textContent=card.dataset.category||'TRUSTED BRAND';
  pop.hidden=false; position(card); requestAnimationFrame(()=>pop.classList.add('t31-open'));
 }
 function dismiss(immediate=false){
  clearTimeout(hideTimer); if(!active) return;
  const old=active; active=null; tapLock=false; old.classList.remove('t31-active'); old.setAttribute('aria-pressed','false');
  pop.classList.remove('t31-open'); hideTimer=setTimeout(()=>{if(!active) pop.hidden=true;}, immediate?0:250);
 }
 cards.forEach(card=>{
  card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'||e.pointerType==='pen') show(card,false);});
  card.addEventListener('pointerleave',e=>{if((e.pointerType==='mouse'||e.pointerType==='pen')&&!tapLock) dismiss();});
  card.addEventListener('focus',()=>show(card,false));
  card.addEventListener('blur',()=>{if(!tapLock) dismiss();});
  card.addEventListener('click',e=>{if(e.detail===0){show(card,true); return;} if(active===card&&tapLock){dismiss(); return;} show(card,true);});
 });
 document.addEventListener('pointerdown',e=>{if(active&&!e.target.closest('.t31-card')&&!e.target.closest('.t31-glass')) dismiss(true);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape') dismiss(true);});
 window.addEventListener('scroll',()=>{if(!active) return; const r=active.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight) dismiss(true); else if(!mobile()) position(active);},{passive:true});
 window.addEventListener('resize',()=>{if(active) position(active);},{passive:true});
})();
