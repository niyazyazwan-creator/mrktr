/* MRKTR V23 — the actual visor is one continuous shared object.
   One wheel gesture enters; one reverse gesture returns. No separate-image hard cuts.
   Original 3344x1882 homepage file is never transformed or altered at rest. */
(()=>{'use strict';if(window.matchMedia('(max-width: 720px)').matches)return;
 const outer=document.querySelector('.story-journey'),pin=outer?.querySelector('.story-pin'),hero=pin?.querySelector('.hero-exact'),statement=pin?.querySelector('.visor-statement');
 const shared=pin?.querySelector('.shared-visor'),absence=pin?.querySelector('.visor-absence');
 if(!outer||!pin||!hero||!statement||!shared||!absence)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce){statement.classList.add('visible-to-pointer');return;}
 const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
 const sm=x=>{x=clamp(x);return x*x*(3-2*x)};
 const soft=x=>{x=clamp(x);return x*x*x*(x*(6*x-15)+10)};
 const ramp=(p,a,b)=>sm((p-a)/(b-a));
 let progress=0,raf=0,moving=false,lastDirection=0,cooldown=0,lastWheel=0,moveToken=0,geo=null;
 const bats=[...pin.querySelectorAll('.bat')];
 const source={w:1672,h:941,x:516,y:213,wg:644,hg:345};
 const distance=()=>Math.max(1,innerHeight); // V27: first viewport remains the locked visor moonwalk; extra scroll drives only golden bridge
 const startY=()=>scrollY+outer.getBoundingClientRect().top;
 const endY=()=>startY()+distance();
 // Match CSS object-fit:cover AND mobile scale so the glass sits exactly on the source.
 function geometry(){
  const r=hero.getBoundingClientRect(),vw=r.width,vh=r.height;
  const mobile=matchMedia('(max-width:720px)').matches;
  const artScale=mobile?1.04:1;
  const fit=Math.max(vw/source.w,vh/source.h)*artScale;
  const drawnW=source.w*fit,drawnH=source.h*fit;
  const left=(vw-drawnW)/2+source.x*fit,top=(vh-drawnH)/2+source.y*fit;
  const w=source.wg*fit,h=source.hg*fit;
  const centerX=left+w/2,centerY=top+h/2;
  // Project forward like a gently approaching physical object, without exceeding viewport.
  const endW=mobile?Math.max(vw*1.34,530):Math.min(vw*.83,vh*1.44);
  const endScale=mobile?Math.max(1.16,endW/w):endW/w;
  const endX=vw*.5,endY=vh*.51;
  geo={left,top,w,h,endScale,dx:endX-centerX,dy:endY-centerY,vw,vh};
  pin.style.setProperty('--visor-left',left+'px');pin.style.setProperty('--visor-top',top+'px');
  pin.style.setProperty('--visor-width',w+'px');pin.style.setProperty('--visor-height',h+'px');
 }
 function paintBats(p){
   // Delicate silhouettes orbit the far LEFT and RIGHT periphery only, then fade.
   // Deterministic progress means reverse scrolling follows the exact same positions.
   const defs=[
    {x:.31,y:.39,side:-1,delay:.07,size:.74,dir:-1},
    {x:.65,y:.30,side: 1,delay:.13,size:.48,dir: 1},
    {x:.40,y:.64,side:-1,delay:.19,size:.55,dir:-1},
    {x:.60,y:.56,side: 1,delay:.24,size:.36,dir: 1}
   ];
   bats.forEach((el,i)=>{
    const b=defs[i],q=clamp((p-b.delay-.20)/.40);
    const phase=sm(q),visibility=sm((q-.06)/.20)*(1-sm((q-.58)/.35));
    const x=geo.vw*(b.x+b.side*.39*phase),y=geo.vh*(b.y-.20*phase+Math.sin(phase*Math.PI)*.028);
    el.style.opacity=(visibility*.48).toFixed(3);
    el.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${(b.size*(.9-.22*phase)).toFixed(3)}) rotate(${b.dir*(14+18*phase)}deg)`;
   });
 }
 function apply(value){
  const p=progress=clamp(value);if(!geo)geometry();
  // One object motion: first free the glass from its face, then lift it toward the viewer.
  const lift=soft(p),floating=Math.sin(Math.PI*p)*(-60);
  const scale=1+(geo.endScale-1)*lift;
  pin.style.setProperty('--visor-scale',scale.toFixed(5));
  pin.style.setProperty('--visor-dx',(geo.dx*lift).toFixed(2)+'px');
  pin.style.setProperty('--visor-dy',(geo.dy*lift+floating).toFixed(2)+'px');
  // The glasses stay frontmost as the face dissolves; a softened dark cavity under
  // the moving visor prevents a second pair from appearing attached to the face.
  const heroAlpha=1-ramp(p,.17,.74);
  pin.style.setProperty('--face-opacity',heroAlpha.toFixed(4));
  pin.style.setProperty('--absence-opacity',(ramp(p,.035,.33)*(1-ramp(p,.58,.87))*.96).toFixed(4));
  const gray=ramp(p,.24,.70);
  pin.style.setProperty('--visor-mono',gray.toFixed(4));
  const bg=ramp(p,.42,.88);
  pin.style.setProperty('--statement-opacity',bg.toFixed(4));
  const cp=ramp(p,.62,.955);
  pin.style.setProperty('--statement-copy',cp.toFixed(4));
  pin.style.setProperty('--statement-shift',((1-cp)*17).toFixed(2)+'px');
  pin.style.setProperty('--line-one',ramp(p,.69,.91).toFixed(4));
  pin.style.setProperty('--line-two',ramp(p,.74,.985).toFixed(4));
  // Sheen appears only after separation: original locked homepage pixels stay intact at rest.
  const sheen=ramp(p,.085,.34)*(.68+.12*Math.sin(Math.PI*p));
  pin.style.setProperty('--visor-rim-opacity',sheen.toFixed(4));
  // Short vapor release from the lower/outer edges, dissolving before the words fully settle.
  const mistPhase=ramp(p,.09,.61);
  const mistIntensity=Math.pow(Math.sin(Math.PI*mistPhase),1.45)*.47;
  pin.style.setProperty('--detach-mist-opacity',(p>.09&&p<.61?mistIntensity:0).toFixed(4));
  pin.style.setProperty('--mist-drift-left',(-27*mistPhase).toFixed(1)+'px');
  pin.style.setProperty('--mist-drift-right',(27*mistPhase).toFixed(1)+'px');
  pin.style.setProperty('--mist-drift-up',(-25*mistPhase).toFixed(1)+'px');
  pin.style.setProperty('--mist-drift-down',(22*mistPhase).toFixed(1)+'px');
  pin.style.setProperty('--visor-depth-shadow',(24*Math.sin(Math.PI*p)).toFixed(1)+'px');
  pin.style.setProperty('--visor-blur',(30*Math.sin(Math.PI*p)).toFixed(1)+'px');
  paintBats(p);
  const atStatement=p>.94;
  statement.classList.toggle('visible-to-pointer',atStatement);
  hero.style.pointerEvents=p>.06?'none':'auto';
  document.body.classList.toggle('vision-active',atStatement);
 }
 function fixGeometry(){geometry();apply(progress)}
 addEventListener('resize',fixGeometry,{passive:true});
 let scrollQueued=false;
 addEventListener('scroll',()=>{if(moving||scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;if(!moving)apply((scrollY-startY())/distance())})},{passive:true});
 geometry();apply((scrollY-startY())/distance());
 document.getElementById("mrktr-vision-startup-guard")?.remove();
 function exactScroll(y){const html=document.documentElement,previous=html.style.scrollBehavior;
  html.style.scrollBehavior='auto';scrollTo({top:y,behavior:'instant'});
  requestAnimationFrame(()=>html.style.scrollBehavior=previous);
 }
 function travel(target){
  cancelAnimationFrame(raf);const token=++moveToken;
  moving=true;lastDirection=target?1:-1;
  const from=progress,to=target?1:0,diff=Math.abs(to-from);
  const dur=Math.max(640,2260*diff),started=performance.now();
  const hair=hero.querySelector('.hair-video');if(hair)hair.pause();
  function tick(now){if(token!==moveToken)return;
   const t=clamp((now-started)/dur);
   apply(from+(to-from)*soft(t));
   if(t<1){raf=requestAnimationFrame(tick);return;}
   exactScroll(target?endY():startY());apply(to);moving=false;
   cooldown=performance.now()+510;
   if(!target&&hair&&hair.autoplay)hair.play().catch(()=>{});
  }
  raf=requestAnimationFrame(tick);
 }
 const menuOpen=()=>Boolean(document.querySelector('.premium-nav.open'));
 const atStart=()=>scrollY>=startY()-5 && scrollY<endY()-45;
 const atEnd=()=>Math.abs(scrollY-endY())<45;
 function gesture(dir){
  if(menuOpen())return false;
  if(moving){
    // Mid-transition reversal is softly retargeted from the CURRENT frame, with no pop.
    if(dir!==lastDirection)travel(dir>0?1:0);
    return true;
  }
  if(dir>0&&atStart()){travel(1);return true;}
  if(dir<0&&atEnd()){travel(0);return true;}
  return false;
 }
 addEventListener('hashchange',()=>requestAnimationFrame(()=>apply((scrollY-startY())/distance())));
 window.MRKTR_previewTransition=(p)=>{cancelAnimationFrame(raf);moving=false;apply(p)};
 window.MRKTR_V35_Visor={toStatement:()=>travel(1),toHome:()=>travel(0)};
 // Canvas smoke textures reused from the existing homepage. Only spawns after
 // pointer movement; never turns the statement into a permanently foggy scene.
 const canvas=statement.querySelector('.statement-smoke'),ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx)return;
 let W=1,H=1,dpr=1,last=0,lastX=null,lastY=null,queued=0,prev=0,visible=true;
 const particles=[],rings=[],textures=[1,2,3,4].map(i=>{let im=new Image();im.src='assets/pointer-smoke-'+i+'.png';return im});
 const cursor=pin.querySelector('.vision-cursor');let cx=-99,cy=-99,tx=-99,ty=-99,cursorAlive=false;
 const random=(a,b)=>a+Math.random()*(b-a);
 function resize(){const r=statement.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
 new ResizeObserver(resize).observe(statement);resize();
 const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)start()},{threshold:0});io.observe(statement);
 function start(){if(!queued&&!document.hidden&&visible)queued=requestAnimationFrame(draw)}
 function spawn(x,y,dx,dy,click){
  for(let i=0;i<(click?9:2);i++){
   particles.push({x:x+random(-12,12),y:y+random(-12,12),vx:random(-20,10)-dx*.12,vy:random(-32,-7)-dy*.07,angle:random(-.12,.12),spin:random(-.04,.04),size:random(165,300)*(click?1.2:1),life:random(1.6,2.9),age:0,alpha:random(.12,.29),tex:textures[Math.floor(Math.random()*textures.length)]});
  }if(particles.length>92)particles.splice(0,particles.length-92);start();
 }
 statement.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;
  const r=statement.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  tx=x;ty=y;cursorAlive=true;cursor.classList.add('active');
  const now=performance.now(),dx=lastX===null?0:x-lastX,dy=lastY===null?0:y-lastY;
  if(now-last>37&&Math.hypot(dx,dy)>3){spawn(x-dx*.6,y-dy*.6,dx,dy,false);last=now}lastX=x;lastY=y;start();
 },{passive:true});
 statement.addEventListener('pointerleave',()=>{cursorAlive=false;cursor.classList.remove('active');lastX=lastY=null});
 statement.addEventListener('pointerdown',e=>{const r=statement.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;spawn(x,y,0,0,true);rings.push({x,y,age:0});start()},{passive:true});
 function draw(t){queued=0;if(document.hidden||!visible)return;const dt=Math.min(.052,((t-prev)||16)/1000);prev=t;
  ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='screen';
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.age+=dt;if(p.age>=p.life){particles.splice(i,1);continue}
   const k=p.age/p.life,fade=Math.sin(Math.PI*Math.pow(k,.7));p.x+=p.vx*dt;p.y+=p.vy*dt;p.angle+=p.spin*dt;
   if(!p.tex.complete||!p.tex.naturalWidth)continue;
   const s=p.size*(.65+k*.7),aspect=p.tex.naturalWidth/p.tex.naturalHeight;
   ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.globalAlpha=p.alpha*fade;ctx.drawImage(p.tex,-s/2,-s/aspect/2,s,s/aspect);ctx.restore();
  }
  for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.age+=dt;const k=r.age/1.35;if(k>=1){rings.splice(i,1);continue}
   const radius=30+k*130,g=ctx.createRadialGradient(r.x,r.y,radius*.35,r.x,r.y,radius);
   g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.75,'rgba(255,255,255,'+((1-k)*.04)+')');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(r.x,r.y,radius,0,Math.PI*2);ctx.fill();
  }
  if(cursorAlive){cx+=(tx-cx)*.28;cy+=(ty-cy)*.28;cursor.style.transform='translate3d('+(cx-17)+'px,'+(cy-17)+'px,0)'}
  if(particles.length||rings.length||cursorAlive)start();
 }
})();
