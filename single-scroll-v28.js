/* MRKTR V28 — one deliberate scroll gesture expands the statement's gold line into
   the full services band; one reverse gesture retracts it. V23 visor choreography stays untouched. */
(()=>{'use strict';
 const outer=document.querySelector('.story-journey');
 if(!outer || !document.querySelector('.v27-gold-bridge'))return;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
 const ease=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10)};
 const start=()=>scrollY+outer.getBoundingClientRect().top;
 const lineY=()=>start()+innerHeight;
 const bandY=()=>start()+outer.offsetHeight-innerHeight;
 let traveling=false,raf=0,startTime=0,from=0,to=0,duration=0,token=0;
 const navOpen=()=>Boolean(document.querySelector('.premium-nav.open'));
 const scrollInstant=y=>{
  const el=document.documentElement,prior=el.style.scrollBehavior;
  el.style.scrollBehavior='auto';window.scrollTo({top:y,behavior:'instant'});
  el.style.scrollBehavior=prior;
 };
 function animateTick(t,identity){
  if(identity!==token)return;
  const progress=clamp((t-startTime)/duration);
  const y=from+(to-from)*ease(progress);
  scrollInstant(y);
  // The gold strip uses the exact current interpolated position, not delayed wheel deltas.
  if(window.MRKTR_previewGoldBridge){
   const span=Math.max(1,bandY()-lineY());
   window.MRKTR_previewGoldBridge((y-lineY())/span);
  }
  if(progress<1){raf=requestAnimationFrame(now=>animateTick(now,identity));return;}
  traveling=false;
 }
 function travel(dir){
  const target=dir>0?bandY():lineY();
  cancelAnimationFrame(raf);
  const id=++token;
  traveling=true;from=scrollY;to=target;
  const distance=Math.abs(to-from)/Math.max(1,Math.abs(bandY()-lineY()));
  duration=Math.max(420,1250*distance);
  startTime=performance.now();
  raf=requestAnimationFrame(t=>animateTick(t,id));
 }
 function consider(dir){
  if(!dir||navOpen())return false;
  if(traveling){
   if((dir>0&&to<bandY()-10)||(dir<0&&to>lineY()+10))travel(dir);
   return true;
  }
  const y=scrollY,a=lineY(),b=bandY();
  // Only intercept inside the gold-rule-to-marquee stage, leaving other sections free.
  // 72px allowance accommodates trackpad gesture deltas without additional wheel steps.
  if(dir>0 && y>=a-35 && y<b-18){travel(1);return true;}
  if(dir<0 && y>a+18 && y<=b+72){travel(-1);return true;}
  return false;
 }
 addEventListener('wheel',e=>{
  if(e.ctrlKey||Math.abs(e.deltaY)<2)return;
  if(consider(Math.sign(e.deltaY)))e.preventDefault();
 },{passive:false});
 document.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||e.target?.closest('input,textarea,select,[contenteditable="true"]'))return;
  const down=['ArrowDown','PageDown'].includes(e.key)||(e.code==='Space'&&!e.shiftKey);
  const up=['ArrowUp','PageUp'].includes(e.key)||(e.code==='Space'&&e.shiftKey);
  if((down||up)&&consider(down?1:-1))e.preventDefault();
 },{passive:false});
 let touchY=null,consumed=false;
 addEventListener('touchstart',e=>{touchY=e.touches.length===1?e.touches[0].clientY:null;consumed=false},{passive:true});
 addEventListener('touchmove',e=>{
  if(touchY==null||e.touches.length!==1)return;
  const delta=touchY-e.touches[0].clientY;
  if(consumed||traveling){e.preventDefault();return;}
  if(Math.abs(delta)>30&&consider(Math.sign(delta))){consumed=true;e.preventDefault();}
 },{passive:false});
 addEventListener('touchend',()=>{touchY=null;consumed=false},{passive:true});
 // Test hooks are inert in normal browsing and help verify both directions.
 window.MRKTR_V28={toStrip:()=>travel(1),toStatement:()=>travel(-1),getState:()=>({traveling,y:scrollY,line:lineY(),strip:bandY()})};
})();
