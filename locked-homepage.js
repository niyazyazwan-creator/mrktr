/* Minimal gold-on-cursor highlight; the V19 white smoke effect runs unchanged. */
(()=>{'use strict';const hero=document.querySelector('.hero-exact');if(!hero)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced)return;
 hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=hero.getBoundingClientRect();
  hero.style.setProperty('--gold-x',(e.clientX-r.left)+'px');hero.style.setProperty('--gold-y',(e.clientY-r.top)+'px');
  hero.style.setProperty('--gold-visible','1');},{passive:true});
 hero.addEventListener('pointerleave',()=>hero.style.setProperty('--gold-visible','0'));
})();
