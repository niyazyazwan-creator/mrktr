(()=>{'use strict';
const shortcut=document.getElementById('v52-home-shortcut');const home=document.getElementById('home');if(!shortcut||!home)return;
let scheduled=false;
function render(){scheduled=false;const r=home.getBoundingClientRect();const off=r.bottom<Math.min(innerHeight*.60,480);
 shortcut.classList.toggle('is-visible',off);
 shortcut.setAttribute('aria-hidden',off?'false':'true');shortcut.tabIndex=off?0:-1;}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
shortcut.addEventListener('click',()=>{document.querySelector('.v50-menu-trigger.is-open')?.click();});
render();
})();