/* V18: smoke appears ONLY after pointer movement and dissipates naturally. White smoke, gold text only. */
(()=>{'use strict';
const hero=document.querySelector('.hero-exact'),canvas=hero?.querySelector('.pointer-smoke');
if(!hero||!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
let W=1,H=1,dpr=1,visible=true,running=false,frame=0,lastTime=0,lastSpawn=0,oldX=null,oldY=null;
const wisps=[],waves=[],imgs=[1,2,3,4].map(i=>{const im=new Image();im.src=`assets/pointer-smoke-${i}.png`;return im});
const goldTargets=[...hero.querySelectorAll('.gold-target')];
const pointer={x:-999,y:-999,on:false,last:0};
function resize(){let r=hero.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
resize();new ResizeObserver(resize).observe(hero);
function frameStart(){if(!running&&visible&&!document.hidden){running=true;requestAnimationFrame(draw)}}
const rand=(a,b)=>a+(b-a)*Math.random();
function putSmoke(x,y,vx,vy,click=false){
 const n=click?9:2;
 for(let i=0;i<n;i++){
  const life=rand(1.55,2.7)*(click?1.18:1);
  wisps.push({x:x+rand(-15,15),y:y+rand(-13,13),vx:rand(-21,10)-vx*.09,vy:rand(-36,-8)-vy*.07,turn:rand(-.08,.08),spin:rand(-.12,.12),life,age:0,size:rand(160,290)*(click?1.1:1),alpha:rand(.12,.29),img:imgs[Math.floor(rand(0,imgs.length))]});
 }
 if(wisps.length>95)wisps.splice(0,wisps.length-95);
 frameStart();
}
function pointerPosition(e){const r=hero.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
hero.addEventListener('pointermove',e=>{
 if(e.pointerType==='touch')return;
 const {x,y}=pointerPosition(e);const now=performance.now();const vx=oldX==null?0:x-oldX,vy=oldY==null?0:y-oldY;
 pointer.x=x;pointer.y=y;pointer.on=true;pointer.last=now;
 for(let el of goldTargets){const b=el.getBoundingClientRect(),hr=hero.getBoundingClientRect();el.style.setProperty('--gx',`${x-(b.left-hr.left)}px`);el.style.setProperty('--gy',`${y-(b.top-hr.top)}px`);const dx=Math.max(b.left-e.clientX,0,e.clientX-b.right),dy=Math.max(b.top-e.clientY,0,e.clientY-b.bottom);el.style.setProperty('--gold-alpha',Math.max(0,1-Math.hypot(dx,dy)/160).toFixed(3))}
 const dist=Math.hypot(vx,vy);if(now-lastSpawn>33&&dist>2){putSmoke(x-vx*.65,y-vy*.65,vx,vy);lastSpawn=now}
 oldX=x;oldY=y;
},{passive:true});
hero.addEventListener('pointerleave',()=>{pointer.on=false;oldX=oldY=null;goldTargets.forEach(el=>el.style.setProperty('--gold-alpha','0'))});
hero.addEventListener('pointerdown',e=>{const {x,y}=pointerPosition(e);putSmoke(x,y,0,0,true);waves.push({x,y,age:0});if(waves.length>4)waves.shift();},{passive:true});
new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&wisps.length)frameStart();},{threshold:0}).observe(hero);
function draw(t){running=false;if(document.hidden||!visible)return;
 const dt=Math.min(.05,(t-lastTime)/1000||.016);lastTime=t;
 ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='screen';
 for(let i=wisps.length-1;i>=0;i--){let p=wisps[i];p.age+=dt;if(p.age>=p.life){wisps.splice(i,1);continue}
  let k=p.age/p.life;const fade=Math.sin(Math.PI*Math.pow(k,.70));const op=p.alpha*fade;
  p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx+=Math.sin(t*.0015+p.turn*17)*.07;p.turn+=p.spin*dt;
  if(!p.img.complete||!p.img.naturalWidth)continue;
  let size=p.size*(.68+k*.7),aspect=p.img.naturalWidth/p.img.naturalHeight;
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.turn);ctx.globalAlpha=op;
  ctx.drawImage(p.img,-size/2,-size/aspect/2,size,size/aspect);ctx.restore();
 }
 // Rare pressure wave: faint white haze rather than a visible ring.
 for(let i=waves.length-1;i>=0;i--){let p=waves[i];p.age+=dt;let k=p.age/1.35;if(k>=1){waves.splice(i,1);continue}
  const r=30+k*125,grad=ctx.createRadialGradient(p.x,p.y,r*.4,p.x,p.y,r);
  grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(.75,`rgba(255,255,255,${(1-k)*.033})`);grad.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=grad;ctx.beginPath();ctx.arc(p.x,p.y,r,0,2*Math.PI);ctx.fill();
 }
 if(wisps.length||waves.length)frameStart();
}
})();