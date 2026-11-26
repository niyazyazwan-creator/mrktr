/* One reversible desktop scroll controller. Existing visual renderers are retained. */
(()=>{'use strict';
 const desktop=matchMedia('(min-width: 721px)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const outer=document.querySelector('.story-journey');
 if(!outer||!document.querySelector('.v27-gold-bridge'))return;
 const enabled=()=>desktop.matches&&!reduced.matches;
 const top=()=>scrollY+outer.getBoundingClientRect().top;
 const stops=()=>[top(),top()+innerHeight,top()+outer.offsetHeight-innerHeight*.22];
 let raf=0,goal=null,travelDir=0,lastWheel=-Infinity,lastDir=0;
 const clamp=x=>Math.max(0,Math.min(1,x));
 const paint=y=>{const a=stops();window.MRKTR_previewTransition?.(clamp((y-a[0])/innerHeight));window.MRKTR_previewGoldBridge?.(clamp((y-a[1])/Math.max(1,outer.offsetHeight-2*innerHeight)));};
 function go(i){cancelAnimationFrame(raf);const from=scrollY,to=stops()[i],begin=performance.now();goal=i;travelDir=Math.sign(to-from);
 const duration=i===0||Math.abs(to-from)<=innerHeight*1.05?850:1050;
 function tick(now){const t=clamp((now-begin)/duration),e=t*t*(3-2*t),y=from+(to-from)*e;window.scrollTo({top:y,behavior:'instant'});paint(y);if(t<1)raf=requestAnimationFrame(tick);else{goal=null;raf=0;}}
 raf=requestAnimationFrame(tick);}
 function step(dir){if(!enabled()||document.querySelector('.premium-nav.open'))return false;const a=stops(),y=scrollY;
 if(goal!==null){if(dir===travelDir)return true;const next=goal+dir;if(next>=0&&next<=2)go(next);return true;}
 if(dir>0&&y>=a[0]-8&&y<a[1]-12){go(1);return true;}
 if(dir>0&&y>=a[1]-12&&y<a[2]-12){go(2);return true;}
 if(dir<0&&y>a[1]+12&&y<=a[2]+innerHeight*.35){go(1);return true;}
 if(dir<0&&y>a[0]+12&&y<=a[1]+12){go(0);return true;}
 return false;}
 addEventListener('wheel',e=>{if(!enabled()||e.defaultPrevented||e.ctrlKey||Math.abs(e.deltaY)<.5||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;const dir=Math.sign(e.deltaY),now=performance.now(),same=dir===lastDir&&now-lastWheel<180;lastWheel=now;lastDir=dir;if(same&&(goal!==null||scrollY<=stops()[2]+12&&scrollY>=stops()[0]-8)){e.preventDefault();return;}if(step(dir))e.preventDefault();},{passive:false});
 addEventListener('keydown',e=>{if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.target?.closest?.('input,textarea,select,button,[contenteditable]'))return;const dir=['ArrowDown','PageDown'].includes(e.key)||e.code==='Space'&&!e.shiftKey?1:['ArrowUp','PageUp'].includes(e.key)||e.code==='Space'&&e.shiftKey?-1:0;if(dir&&!e.repeat&&step(dir))e.preventDefault();},{passive:false});
 window.MRKTR_V35_Visor={toStatement:()=>go(1),toHome:()=>go(0)};
 window.MRKTR_V28={toStrip:()=>go(2),toStatement:()=>go(1)};
})();
