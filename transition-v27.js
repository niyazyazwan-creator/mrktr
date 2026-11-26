/* MRKTR V27 — continuous golden-rule -> ticker morph tied to native scroll position.
   No snaps or extra gesture hijacking: backward motion is mathematically identical. */
(()=>{'use strict';if(window.matchMedia('(max-width: 720px)').matches)return;
 const outer=document.querySelector('.story-journey'),pin=outer?.querySelector('.story-pin'),
       band=pin?.querySelector('.v27-gold-bridge'),rule=pin?.querySelector('.vision-rule'),
       copy=pin?.querySelector('.vision-copy');
 if(!outer||!pin||!band||!rule||!copy)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced)return;
 document.body.classList.add('v27-bridge-ready');
 band.setAttribute('aria-hidden','false');
 const clamp=x=>Math.min(1,Math.max(0,x));
 const ease=t=>{t=clamp(t);return t*t*(3-2*t)};
 const ramp=(v,a,b)=>ease((v-a)/(b-a));
 const start=()=>scrollY+outer.getBoundingClientRect().top;
 const base=()=>start()+innerHeight;
 const available=()=>Math.max(80,outer.offsetHeight-2*innerHeight);
 let current=0,target=0,queued=0,initial=true,prev=-1;
 function measure(){const r=rule.getBoundingClientRect(),p=pin.getBoundingClientRect();
   return {ruleY:r.top+r.height/2-p.top, ruleW:r.width||80, pinW:pin.clientWidth,pinH:pin.clientHeight};
 }
 function apply(q){
   const g=measure(), tickerH=48;
   const width=g.ruleW+(g.pinW-g.ruleW)*ramp(q,.035,.82);
   const height=2+(tickerH-2)*ramp(q,.33,.98);
   const startC=g.ruleY, endC=g.pinH-tickerH/2;
   const cy=startC+(endC-startC)*ease(q);
   const alpha=ramp(q,.008,.12);
   const text=ramp(q,.64,.93);
   const ruleAlpha=1-ramp(q,.02,.13);
   band.style.setProperty('--v27-band-width',width.toFixed(2)+'px');
   band.style.setProperty('--v27-band-height',height.toFixed(2)+'px');
   band.style.setProperty('--v27-band-top',(cy-height/2).toFixed(2)+'px');
   band.style.setProperty('--v27-band-alpha',alpha.toFixed(4));
   band.style.setProperty('--v27-track-alpha',text.toFixed(4));
   pin.style.setProperty('--v27-rule-opacity',ruleAlpha.toFixed(4));
   // The statement dissolves only once its original golden rule is expanding.
   copy.style.setProperty('--v27-copy-fade',(1-ramp(q,.22,.68)).toFixed(4));
   copy.style.opacity=`calc(var(--statement-copy) * var(--v27-copy-fade))`;
 }
 function loop(){queued=0;target=clamp((scrollY-base())/available());
   // The gold bar follows the scroll smoothly but never jumps between positions.
   const diff=target-current;
   if(initial){current=target;initial=false;}
   else if(Math.abs(diff)>0.0005)current+=diff*.22;
   else current=target;
   apply(current);
   if(Math.abs(current-target)>.0006)queued=requestAnimationFrame(loop);
 }
 function update(){if(!queued)queued=requestAnimationFrame(loop)}
 addEventListener('scroll',update,{passive:true});
 addEventListener('resize',update,{passive:true});
 addEventListener('pageshow',()=>{initial=true;update()},{passive:true});
 update();
 window.MRKTR_previewGoldBridge=p=>{cancelAnimationFrame(queued);queued=0;initial=false;target=current=clamp(p);apply(current)};
})();
