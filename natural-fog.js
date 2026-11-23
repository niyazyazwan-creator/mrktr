(()=>{
'use strict';
const hero=document.querySelector('.hero-exact'), host=document.querySelector('.exact-fog'), rip=document.querySelector('.exact-ripple'), gold=document.querySelector('.gold-reveal');
if(!hero||!host||!rip||!gold||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const fog=document.createElement('canvas');host.appendChild(fog);
const f=fog.getContext('2d'),r=rip.getContext('2d'),g=gold.getContext('2d');
const off=document.createElement('canvas');off.width=300;off.height=170;const oc=off.getContext('2d');
let W=1,H=1,D=1,active=true,inside=false,last=0,previous=0,fade=0,frame=0;
let pointer={x:-1000,y:-1000,tx:-1000,ty:-1000,vx:0,vy:0},rings=[];
// Reproducible soft turbulence texture, rather than uniform radial-gradient blobs.
let seed=19;function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
const puffs=Array.from({length:36},(_,i)=>({x:rnd(),y:rnd(),size:.09+rnd()*.20,speed:.10+rnd()*.21,phase:rnd()*6.28,opacity:.024+rnd()*.023}));
function texture(){oc.clearRect(0,0,300,170);for(let i=0;i<240;i++){let x=rnd()*300,y=rnd()*170,rad=5+rnd()*35;let grad=oc.createRadialGradient(x,y,0,x,y,rad);let a=.015+rnd()*.05;grad.addColorStop(0,`rgba(245,245,245,${a})`);grad.addColorStop(1,'rgba(245,245,245,0)');oc.fillStyle=grad;oc.fillRect(x-rad,y-rad,rad*2,rad*2)}}texture();
function resize(){const b=hero.getBoundingClientRect();W=b.width;H=b.height;D=Math.min(devicePixelRatio||1,1.5);for(let c of [fog,rip,gold]){c.width=Math.max(1,Math.round(W*D));c.height=Math.max(1,Math.round(H*D));c.getContext('2d').setTransform(D,0,0,D,0,0)}}
new ResizeObserver(resize).observe(hero);resize();
function coords(e){const b=hero.getBoundingClientRect();return {x:e.clientX-b.left,y:e.clientY-b.top}}
hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const v=coords(e);pointer.vx=v.x-pointer.tx;pointer.vy=v.y-pointer.ty;pointer.tx=v.x;pointer.ty=v.y;inside=true;last=performance.now()});
hero.addEventListener('pointerleave',()=>{inside=false});
hero.addEventListener('pointerdown',e=>{const v=coords(e);rings.push({x:v.x,y:v.y,age:0,power:1});pointer.tx=v.x;pointer.ty=v.y;inside=true;last=performance.now()});
new IntersectionObserver(es=>{active=es[0].isIntersecting}).observe(hero);
const GOLD='#d4af37'; // Configurable provisional gold: replace with exact brand HEX when supplied.
// Highlight only existing text and decorative line regions, not the photograph.
const regions=[{x:.054,y:.19,w:.16,h:.105},{x:.052,y:.34,w:.24,h:.22},{x:.77,y:.32,w:.19,h:.30},{x:.055,y:.79,w:.16,h:.10},{x:.60,y:.045,w:.34,h:.055},{x:.78,y:.80,w:.17,h:.08}];
function goldHighlight(){g.clearRect(0,0,W,H);if(fade<.015)return;
 // Gold reveals are strokes/underlines, not broad colored patches across the portrait.
 for(const b of regions){const x=b.x*W,y=b.y*H,w=b.w*W,h=b.h*H;
 const px=Math.max(x,Math.min(x+w,pointer.x)),py=Math.max(y,Math.min(y+h,pointer.y));
 const dist=Math.hypot(pointer.x-px,pointer.y-py),influence=Math.max(0,1-dist/Math.max(75,W*.11))*fade;
 if(influence<.015)continue;
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();
 const radius=Math.max(85,W*.12);const grad=g.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,radius);grad.addColorStop(0,`rgba(212,175,55,${.34*influence})`);grad.addColorStop(.55,`rgba(212,175,55,${.08*influence})`);grad.addColorStop(1,'rgba(212,175,55,0)');g.fillStyle=grad;g.fillRect(x,y,w,h);
 // Crisp minimal underline accent appears only on interaction.
 g.strokeStyle=`rgba(212,175,55,${.7*influence})`;g.lineWidth=1.3;g.beginPath();g.moveTo(x,y+h+(-2));g.lineTo(x+w*.32,y+h-2);g.stroke();g.restore();
 }
}
function tick(t){requestAnimationFrame(tick);if(!active)return;frame++;if(W<700&&frame%2)return;
 const dt=Math.min(.04,(t-previous)/1000||.016);previous=t;
 pointer.x+=(pointer.tx-pointer.x)*.095;pointer.y+=(pointer.ty-pointer.y)*.095;
 fade+=( (inside?1:0)-fade)*.06;
 f.clearRect(0,0,W,H);r.clearRect(0,0,W,H);
 const time=t*.001;
 f.save();f.globalCompositeOperation='screen';
 for(const p of puffs){let x=(p.x+.06*Math.sin(time*p.speed+p.phase))*W,y=(p.y+.06*Math.cos(time*p.speed*.7+p.phase))*H;
 const radius=Math.max(W,H)*p.size;
 const dx=x-pointer.x,dy=y-pointer.y,dist=Math.hypot(dx,dy)||1;
 const pressure=fade*Math.exp(-dist*dist/(radius*radius*1.2));
 x+=dx/dist*pressure*28+pointer.vx*pressure*.16;y+=dy/dist*pressure*21+pointer.vy*pressure*.16;
 // Preserve face clarity; heavier mist toward outer edges.
 const edge=.18+.82*Math.min(1,Math.abs(x-W*.5)/(W*.40));
 const grad=f.createRadialGradient(x,y,radius*.08,x,y,radius);
 const a=p.opacity*edge*(.75+.25*Math.sin(time*.32+p.phase));
 grad.addColorStop(0,`rgba(218,220,222,${a})`);grad.addColorStop(.4,`rgba(196,199,202,${a*.64})`);grad.addColorStop(1,'rgba(180,185,190,0)');f.fillStyle=grad;f.fillRect(x-radius,y-radius,2*radius,2*radius);
 }
 f.globalAlpha=.13;f.filter='blur(20px)';const drift=Math.sin(time*.16)*35;f.drawImage(off,drift-30,-20,W+60,H+40);f.filter='none';f.restore();
 for(const ring of rings){ring.age+=dt;const rad=ring.age*170,alpha=Math.pow(Math.max(0,1-ring.age/1.5),2)*.11;
 r.strokeStyle=`rgba(235,235,235,${alpha})`;r.lineWidth=1.4;r.beginPath();r.ellipse(ring.x,ring.y,rad,rad*.78,0,0,Math.PI*2);r.stroke();
 // localized fog turbulence around the pressure front, not bright geometric neon circles
 }
 rings=rings.filter(x=>x.age<1.5);
 goldHighlight();pointer.vx*=.88;pointer.vy*=.88;
}
requestAnimationFrame(tick);
})();
