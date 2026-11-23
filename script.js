
// Progressive enhancement: all navigation and content work without GSAP.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => {const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
document.getElementById('year').textContent=new Date().getFullYear();
const loader=document.querySelector('.page-loader');
function dismissLoader(){loader?.classList.add('done');document.body.classList.remove('is-loading');}
// Show the first screen immediately; never wait for below-the-fold images or third-party scripts.
dismissLoader();
const progress=document.querySelector('.progress');let scheduled=false;
window.addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';scheduled=false;});},{passive:true});
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
// Expand gallery images, keyboard-accessible and closable.
// Gallery removed in V42.
if(!reduced){
  // Smooth-follow cursor on devices with a precise pointer.
  if(window.matchMedia('(pointer:fine)').matches){const dot=document.querySelector('.cursor-dot');let x=-50,y=-50,cx=-50,cy=-50;window.addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;dot.style.opacity='1';},{passive:true});function moveCursor(){cx+=(x-cx)*.18;cy+=(y-cy)*.18;dot.style.left=cx+'px';dot.style.top=cy+'px';requestAnimationFrame(moveCursor);}moveCursor();document.querySelectorAll('a,button,.work-card,.photo-tile').forEach(el=>{el.addEventListener('pointerenter',()=>dot.classList.add('active'));el.addEventListener('pointerleave',()=>dot.classList.remove('active'));});}
  if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);
    // Staggered hero reveal; no dependency on the loader timeline.
    const hero=gsap.timeline({delay:.45,defaults:{ease:'power3.out'}});
    hero.from('.portrait',{scale:1.16,opacity:.3,duration:1.8}).from('.role-left,.role-right',{y:26,opacity:0,stagger:.13,duration:.9},'-=1.15').from('.signature',{y:35,opacity:0,duration:1.1},'-=.75').from('.hero-bottom > *',{y:35,opacity:0,stagger:.15,duration:.8},'-=.7').from('.scroll-hint',{opacity:0,duration:.8},'-=.4');
    gsap.to('.portrait',{yPercent:13,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.signature',{yPercent:-28,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    document.querySelectorAll('.section-head,.manifesto,.about-layout,.contact').forEach(section=>{gsap.from(section.querySelectorAll('.kicker,p:not(.note),.text-link'),{y:24,opacity:0,stagger:.12,duration:.8,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 85%',once:true}});});
    document.querySelectorAll('.photo-tile img').forEach(img=>gsap.fromTo(img,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
    // Animated graphic elements inside work cards.
    gsap.to('.orbit',{rotation:360,repeat:-1,duration:25,ease:'none'});
    gsap.to('.asterisk',{rotation:360,repeat:-1,duration:18,ease:'none'});
    gsap.to('.sun',{scale:1.08,repeat:-1,yoyo:true,duration:2.7,ease:'sine.inOut'});
    // Gentle magnetic tilt on desktop; reset on pointer leave.
    if(window.matchMedia('(pointer:fine)').matches){document.querySelectorAll('.work-card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;gsap.to(card,{rotateY:x*5,rotateX:-y*5,duration:.4,overwrite:true,ease:'power2.out'});});card.addEventListener('pointerleave',()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.6,ease:'power2.out'}));});}
  }
}


// MRKTR V5 — Cursor-following ambient waves (no extra dependencies).
(() => {
 const hero = document.querySelector('.hero');
 const canvas = hero?.querySelector('.hero-ripples');
 if (!hero || !canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const ctx = canvas.getContext('2d', { alpha: true });
 if (!ctx) return;
 let width=0,height=0,dpr=1,active=true,raf=0,lastMove=0;
 const waves=[];
 const resize=()=>{
  const box=hero.getBoundingClientRect();width=box.width;height=box.height;
  dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
 };
 const addWave=(x,y,click=false)=>{
  waves.push({x,y,r:click?4:10,life:1,click});
  if(waves.length>18)waves.shift();
 };
 hero.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch')return;
  const now=performance.now();if(now-lastMove<46)return;lastMove=now;
  const box=hero.getBoundingClientRect();addWave(e.clientX-box.left,e.clientY-box.top);
 },{passive:true});
 hero.addEventListener('pointerdown',e=>{
  const box=hero.getBoundingClientRect();addWave(e.clientX-box.left,e.clientY-box.top,true);
 },{passive:true});
 const render=()=>{
  raf=0;if(!active||document.hidden)return;
  ctx.clearRect(0,0,width,height);
  for(let i=waves.length-1;i>=0;i--){
   const w=waves[i];
   const radius=w.r;
   const strength=w.life*(w.click?.24:.115);
   const glow=ctx.createRadialGradient(w.x,w.y,Math.max(0,radius-28),w.x,w.y,radius+44);
   glow.addColorStop(0,'rgba(190,210,220,0)');
   glow.addColorStop(.45,`rgba(205,225,235,${strength*.23})`);
   glow.addColorStop(.57,`rgba(215,255,0,${strength*.12})`);
   glow.addColorStop(1,'rgba(205,225,235,0)');
   ctx.fillStyle=glow;ctx.beginPath();ctx.arc(w.x,w.y,radius+44,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle=`rgba(210,220,230,${strength})`;
   ctx.lineWidth=w.click?1.5:1;ctx.beginPath();ctx.arc(w.x,w.y,radius,0,Math.PI*2);ctx.stroke();
   w.r+=w.click?5.4:3.4;w.life*=w.click?.974:.957;
   if(w.life<.025)waves.splice(i,1);
  }
  raf=requestAnimationFrame(render);
 };
 const observer=new IntersectionObserver(entries=>{
  active=entries[0].isIntersecting;
  if(active&&!raf)raf=requestAnimationFrame(render);
  else if(!active){cancelAnimationFrame(raf);raf=0;}
 },{threshold:0});
 const onVisibility=()=>{if(!document.hidden&&active&&!raf)raf=requestAnimationFrame(render)};
 document.addEventListener('visibilitychange',onVisibility);
 window.addEventListener('resize',resize,{passive:true});
 resize();observer.observe(hero);
})();


// MRKTR V7: low-cost drifting fog with mouse-following displacement.
(() => {
 const hero=document.querySelector('.hero'), canvas=hero?.querySelector('.hero-fog');
 if(!hero||!canvas||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
 let w=0,h=0,dpr=1,raf=0,visible=true,last=0;
 const pointer={x:-9999,y:-9999,px:-9999,py:-9999,energy:0};
 const wisps=Array.from({length:21},(_,i)=>({seed:i*13.17, x:(i*0.61803398875)%1, y:(i*.382)%1, size:.19+(i%5)*.052, speed:.0008+(i%7)*.00017, phase:i*1.72}));
 function resize(){const r=hero.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
 function move(e){if(e.pointerType==='touch')return;const r=hero.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;pointer.energy=Math.min(1.4,pointer.energy+Math.hypot(x-pointer.x,y-pointer.y)/100);pointer.x=x;pointer.y=y}
 hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',()=>{pointer.x=-9999;pointer.y=-9999});
 hero.addEventListener('pointerdown',e=>{const r=hero.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;pointer.energy=1.8},{passive:true});
 function draw(t){raf=0;if(!visible||document.hidden)return;ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='screen';
  const time=t*.001;pointer.energy*=.963;
  for(const p of wisps){
   const baseX=(p.x*w+Math.sin(time*.15+p.phase)*w*.12+time*p.speed*w*4)%(w*1.35)-w*.13;
   const baseY=p.y*h+Math.sin(time*.2+p.phase)*h*.07;
   let dx=baseX-pointer.x,dy=baseY-pointer.y,dist=Math.hypot(dx,dy)||1;
   const influence=Math.exp(-dist*dist/(w*w*.09))*pointer.energy;
   const x=baseX+dx/dist*influence*60,y=baseY+dy/dist*influence*45;
   const r=Math.max(w,h)*p.size;
   const g=ctx.createRadialGradient(x,y,0,x,y,r);
   const a=.025+(p.seed%4)*.008+influence*.024;
   g.addColorStop(0,`rgba(205,219,219,${a})`);g.addColorStop(.38,`rgba(160,180,181,${a*.48})`);g.addColorStop(1,'rgba(135,155,160,0)');
   ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
  }
  if(pointer.x>=0&&pointer.x<w&&pointer.energy>.02){const r=150+pointer.energy*75;const g=ctx.createRadialGradient(pointer.x,pointer.y,5,pointer.x,pointer.y,r);g.addColorStop(0,`rgba(205,225,223,${Math.min(.095,pointer.energy*.05)})`);g.addColorStop(1,'rgba(180,210,210,0)');ctx.fillStyle=g;ctx.fillRect(pointer.x-r,pointer.y-r,r*2,r*2)}
  raf=requestAnimationFrame(draw);
 }
 const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible&&!raf)raf=requestAnimationFrame(draw);else if(!visible){cancelAnimationFrame(raf);raf=0}},{threshold:0});observer.observe(hero);
 const ro=new ResizeObserver(resize);ro.observe(hero);resize();raf=requestAnimationFrame(draw);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&visible&&!raf)raf=requestAnimationFrame(draw)});
})();
