// V43: light-touch story reveal, gentle parallax on fine pointers, motion-safe.
(()=>{const root=document.querySelector('.about-v43');if(!root)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){root.classList.add('a43-visible');return;}
 const observer=new IntersectionObserver((entries)=>{for(const e of entries){if(e.isIntersecting){root.classList.add('a43-visible');observer.disconnect();break;}}},{threshold:.11});observer.observe(root);
 const visual=root.querySelector('.a43-visual');
 if(!visual||!window.matchMedia('(pointer:fine)').matches)return;
 let raf=0,last=0; visual.addEventListener('pointermove',e=>{const box=visual.getBoundingClientRect();last=((e.clientX-box.left)/box.width-.5)*9;if(!raf)raf=requestAnimationFrame(()=>{raf=0;visual.style.setProperty('--a43-parallax',last.toFixed(1)+'px');});},{passive:true});
 visual.addEventListener('pointerleave',()=>visual.style.setProperty('--a43-parallax','0px'));
})();
