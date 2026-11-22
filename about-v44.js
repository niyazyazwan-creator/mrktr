/* MRKTR V44: About story remains visible, animation is optional. */
(()=>{'use strict';
  const root=document.querySelector('.about-v43');if(!root)return;
  const visual=root.querySelector('.a43-visual');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rect=root.getBoundingClientRect();
  if(reduced||rect.top<innerHeight*.93){root.classList.add('a43-visible');}
  else if('IntersectionObserver' in window){
    root.classList.add('a43-motion-ready');
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){
        root.classList.add('a43-visible');
        root.classList.remove('a43-motion-ready');
        observer.disconnect();
      }
    },{rootMargin:'0px 0px 8% 0px',threshold:.045});
    observer.observe(root);
  }else{root.classList.add('a43-visible');}
  if(!visual||reduced||!matchMedia('(pointer:fine)').matches)return;
  let raf=0,offset=0;
  visual.addEventListener('pointermove',e=>{
    const r=visual.getBoundingClientRect();offset=((e.clientX-r.left)/Math.max(1,r.width)-.5)*8;
    if(!raf)raf=requestAnimationFrame(()=>{raf=0;visual.style.setProperty('--a43-parallax',offset.toFixed(1)+'px');});
  },{passive:true});
  visual.addEventListener('pointerleave',()=>visual.style.setProperty('--a43-parallax','0px'));
})();
