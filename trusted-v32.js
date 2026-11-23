(()=>{
 const root=document.querySelector('.trusted-v32'); if(!root) return;
 const chips=[...root.querySelectorAll('.t32-chip')];
 const pop=root.querySelector('.t32-glass');
 const name=pop.querySelector('.t32-glass-name');
 const desc=pop.querySelector('.t32-glass-description');
 const kind=pop.querySelector('.t32-glass-type');
 let active=null, hideTimer=0, tapLock=false;
 const mobile=()=>matchMedia('(max-width:640px)').matches;
 function position(el){
  if(mobile()){pop.style.left='15px';pop.style.top='auto';return;}
  const r=el.getBoundingClientRect(); const w=360; const h=220;
  let x=r.left + r.width/2 - w/2, y=r.bottom + 16;
  if(y+h>innerHeight-16) y=r.top-h-16;
  x=Math.min(Math.max(16,x), innerWidth-w-16); y=Math.max(14,y);
  pop.style.left=Math.round(x)+'px'; pop.style.top=Math.round(y)+'px';
 }
 function show(el,locked=false){
  clearTimeout(hideTimer);
  if(active && active!==el){active.classList.remove('t32-active'); active.setAttribute('aria-pressed','false');}
  active=el; tapLock=locked;
  active.classList.add('t32-active'); active.setAttribute('aria-pressed','true');
  name.textContent=el.dataset.name; desc.textContent=el.dataset.desc; kind.textContent=el.dataset.category||'TRUSTED BRAND';
  pop.hidden=false; position(el); requestAnimationFrame(()=>pop.classList.add('t32-open'));
 }
 function hide(immediate=false){
  clearTimeout(hideTimer); if(!active) return;
  const prev=active; active=null; tapLock=false; prev.classList.remove('t32-active'); prev.setAttribute('aria-pressed','false');
  pop.classList.remove('t32-open'); hideTimer=setTimeout(()=>{if(!active) pop.hidden=true;}, immediate?0:240);
 }
 chips.forEach(el=>{
   el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'||e.pointerType==='pen') show(el,false);});
   el.addEventListener('pointerleave',e=>{if((e.pointerType==='mouse'||e.pointerType==='pen')&&!tapLock) hide();});
   el.addEventListener('focus',()=>show(el,false));
   el.addEventListener('blur',()=>{if(!tapLock) hide();});
   el.addEventListener('click',()=>{if(active===el&&tapLock){hide(true);return;} show(el,true);});
 });
 document.addEventListener('pointerdown',e=>{if(active&&!e.target.closest('.t32-chip')&&!e.target.closest('.t32-glass')) hide(true);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape') hide(true);});
 window.addEventListener('scroll',()=>{if(active){if(!mobile()) position(active);}}, {passive:true});
 window.addEventListener('resize',()=>{if(active) position(active);}, {passive:true});
})();