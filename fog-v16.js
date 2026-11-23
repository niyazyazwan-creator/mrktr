/* MRKTR V16 — soft white atmospheric fog, gentle cursor displacement,
   pressure-wave ripples, and gold ONLY where text/lines are under the pointer. */
(()=>{'use strict';
const hero=document.querySelector('.hero-exact'),host=hero?.querySelector('.exact-fog');
const ripple=hero?.querySelector('.exact-ripple'),gold=hero?.querySelector('.gold-reveal');
if(!hero||!host||!ripple||!gold)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fog=document.createElement('canvas');fog.setAttribute('aria-hidden','true');host.appendChild(fog);
const ctx=fog.getContext('2d'),rc=ripple.getContext('2d'),gc=gold.getContext('2d');
const imgs=[1,2,3].map(n=>{let im=new Image();im.src=`assets/white-fog-${n}.png`;return im});
const mask=new Image();mask.src='assets/gold-text-mask.png';
let w=1,h=1,dpr=1,last=0,frame=0,visible=true;
let cursor={x:-1000,y:-1000,tx:-1000,ty:-1000,vx:0,vy:0,force:0,inside:false};let pulses=[];
const spots=[{x:.18,y:.34},{x:.66,y:.73}];
function size(){const b=hero.getBoundingClientRect();w=b.width;h=b.height;dpr=Math.min(devicePixelRatio||1,1.5);for(let c of [fog,ripple,gold]){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);c.getContext('2d').setTransform(dpr,0,0,dpr,0,0)}}size();new ResizeObserver(size).observe(hero);
function xy(e){let r=hero.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}}
hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;let p=xy(e);cursor.vx=p.x-cursor.tx;cursor.vy=p.y-cursor.ty;cursor.tx=p.x;cursor.ty=p.y;cursor.inside=true;cursor.force=Math.max(cursor.force,Math.min(1,Math.hypot(cursor.vx,cursor.vy)/45))});
hero.addEventListener('pointerleave',()=>{cursor.inside=false});
hero.addEventListener('pointerdown',e=>{let p=xy(e);cursor.tx=p.x;cursor.ty=p.y;cursor.inside=true;cursor.force=1;pulses.push({x:p.x,y:p.y,age:0});pulses=pulses.slice(-8)});
new IntersectionObserver(entries=>visible=entries[0].isIntersecting).observe(hero);
function goldHighlight(){gc.clearRect(0,0,w,h);if(!cursor.inside||!mask.complete||!mask.naturalWidth)return;
const r=Math.max(105,w*.125),gr=gc.createRadialGradient(cursor.x,cursor.y,0,cursor.x,cursor.y,r);
gr.addColorStop(0,`rgba(212,175,55,${Math.min(.9,cursor.force*.55+.25)})`);gr.addColorStop(.55,'rgba(212,175,55,.19)');gr.addColorStop(1,'rgba(212,175,55,0)');
gc.fillStyle=gr;gc.fillRect(cursor.x-r,cursor.y-r,r*2,r*2);gc.globalCompositeOperation='destination-in';gc.drawImage(mask,0,0,w,h);gc.globalCompositeOperation='source-over'}
function paint(t){requestAnimationFrame(paint);if(!visible||!w||!h)return;if(++frame%2)return;
let dt=Math.min(.045,(t-last)*.001||.033);last=t;
cursor.x+=(cursor.tx-cursor.x)*.16;cursor.y+=(cursor.ty-cursor.y)*.16;
cursor.force*=cursor.inside?.965:.925;
ctx.clearRect(0,0,w,h);rc.clearRect(0,0,w,h);
const sec=t/1000;
imgs.forEach((im,i)=>{if(!im.complete||!im.naturalWidth)return;
 let f=1.32+i*.06,bw=w*f,bh=h*f;
 let dx=(w-bw)/2+Math.sin(sec*(.068+.027*i)+i*1.8)*w*.067;
 let dy=(h-bh)/2+Math.cos(sec*(.041+.023*i)+i)*h*.048;
 ctx.save();ctx.globalAlpha=i===1?.61:.53;
 ctx.drawImage(im,dx,dy,bw,bh);
 if(cursor.force>.05){const radius=Math.max(120,Math.min(w,h)*.29),push=Math.min(23,Math.hypot(cursor.vx,cursor.vy)*.18)*cursor.force;
  ctx.save();ctx.beginPath();ctx.ellipse(cursor.x,cursor.y,radius,radius*.76,0,0,2*Math.PI);ctx.clip();
  ctx.globalAlpha=.18*cursor.force;ctx.drawImage(im,dx+(cursor.vx>0?-push:push),dy+(cursor.vy>0?-push*.6:push*.6),bw,bh);ctx.restore()}
 ctx.restore();
});
for(let pulse of pulses){pulse.age+=dt;let p=Math.min(1,pulse.age/1.7),r=p*Math.min(w,h)*.26,a=(1-p)*(1-p)*.13;
 const grad=rc.createRadialGradient(pulse.x,pulse.y,Math.max(0,r-37),pulse.x,pulse.y,r+29);
 grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(.55,`rgba(252,252,252,${a})`);grad.addColorStop(1,'rgba(255,255,255,0)');
 rc.fillStyle=grad;rc.beginPath();rc.arc(pulse.x,pulse.y,r+29,0,2*Math.PI);rc.fill();}
pulses=pulses.filter(p=>p.age<1.7);goldHighlight();cursor.vx*=.79;cursor.vy*=.79;}
if(!reduced)requestAnimationFrame(paint);else imgs[0].onload=()=>{ctx.globalAlpha=.6;ctx.drawImage(imgs[0],0,0,w,h)};
})();