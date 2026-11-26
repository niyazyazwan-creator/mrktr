/* MRKTR: independent atmospheric particle layer. No scroll interception. */
(()=>{'use strict';
 const pin=document.querySelector('.story-pin'), journey=document.querySelector('.story-journey');
 if(!pin||!journey||!window.IntersectionObserver)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'), mobile=matchMedia('(max-width:720px)');
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
 Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'22',opacity:'0',transition:'opacity .35s'});
 pin.append(canvas);const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return;}
 let w=1,h=1,dpr=1,flakes=[],raf=0,last=0,visible=false,px=-10000,py=-10000,wind=0,burst=0,previous=0;
 const rand=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const sprites=[0,1,2].map(i=>{const c=document.createElement('canvas');c.width=c.height=48;const g=c.getContext('2d');const r=i===2?23:i===1?15:9;const grad=g.createRadialGradient(24,24,0,24,24,r);grad.addColorStop(0,'rgba(255,255,255,1)');grad.addColorStop(i===0?.45:.18,'rgba(255,255,255,.65)');grad.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=grad;g.fillRect(0,0,48,48);return c;});
 function flake(){const z=Math.random();return{x:rand(0,w),y:rand(0,h),z,phase:rand(0,6.28),speed:rand(9,24)*(0.5+z),alpha:rand(.14,.55),vx:0,vy:0};}
 function resize(){const r=pin.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,mobile.matches?1:1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);flakes=Array.from({length:mobile.matches?48:clamp(Math.round(w*h/8500),85,200)},flake);}
 function stop(){cancelAnimationFrame(raf);raf=0;last=0;canvas.style.opacity='0';}
 function start(){if(!raf&&visible&&!document.hidden&&!reduced.matches){last=0;raf=requestAnimationFrame(draw);}}
 function draw(t){raf=0;if(!visible||document.hidden||reduced.matches){stop();return;}
 const dt=last?Math.min(.04,(t-last)/1000):.016;last=t;
 const r=journey.getBoundingClientRect(), p=clamp(-r.top/Math.max(1,innerHeight),0,2.8);burst=burst*Math.exp(-dt*2.8)+Math.min(1,Math.abs(p-previous)*3);previous=p;
 const fade=clamp((r.bottom-innerHeight*.18)/(innerHeight*.82),0,1);canvas.style.opacity=String(fade*(mobile.matches?.58:.85));
 ctx.clearRect(0,0,w,h);wind+=(Math.sin(t*.00037)*13+12-wind)*dt*.8;
 for(const f of flakes){const dx=f.x-px,dy=f.y-py,dist=Math.hypot(dx,dy),force=dist<115?(1-dist/115)*36:0;f.vx=(f.vx+dx/(dist||1)*force*dt)*Math.exp(-dt*2);f.vy=(f.vy+dy/(dist||1)*force*dt)*Math.exp(-dt*2);
 const bx=(f.x-w*.5)/Math.max(w,1),by=(f.y-h*.5)/Math.max(h,1);
 f.x+=(wind*(.4+f.z)+Math.sin(t*.001+f.phase)*7+f.vx+bx*burst*110)*dt;f.y+=(f.speed+Math.cos(t*.0008+f.phase)*4+f.vy+by*burst*110)*dt;
 if(f.x>w+24)f.x=-24;if(f.x< -24)f.x=w+24;if(f.y>h+24){f.y=-24;f.x=rand(0,w);}if(f.y< -24)f.y=h+24;
 const near=f.z>.91, size=near?randStable(f.phase,12,23):f.z>.55?6+f.z*5:3+f.z*5;
 ctx.globalAlpha=f.alpha*(near?.65:1);ctx.drawImage(sprites[near?2:f.z>.55?1:0],f.x-size/2,f.y-size/2,size,size);
 }ctx.globalAlpha=1;raf=requestAnimationFrame(draw);}
 function randStable(p,a,b){return a+(b-a)*(Math.sin(p*13.7)*.5+.5);}
 pin.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=pin.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top;},{passive:true});
 pin.addEventListener('pointerleave',()=>{px=py=-10000;});
 new ResizeObserver(resize).observe(pin);resize();new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)start();else stop();}).observe(pin);
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());reduced.addEventListener('change',()=>reduced.matches?stop():start());
})();
