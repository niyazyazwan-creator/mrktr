// MRKTR V52 — equal sized interactive service network, no resizing or hover traps.
(()=>{'use strict';
const root=document.querySelector('.services-v35');if(!root)return;
const grid=root.querySelector('.s35-grid'), counter=root.querySelector('.s35-counter');
const dots=[...root.querySelectorAll('.s35-page')], popup=root.querySelector('#s52-glass');
const popupTitle=popup.querySelector('.s52-glass-title'),popupDesc=popup.querySelector('.s52-glass-desc');
const services=[
 ['Google Ads','assets/services/google-ads.png','High-intent search campaigns for qualified leads and stronger sales.'],
 ['Meta Ads','assets/services/meta-ads.png','Audience-led campaigns across Facebook and Instagram, built to convert.'],
 ['TikTok Ads','assets/services/tiktok-ads.png','Creative short-form campaigns that reach and inspire relevant audiences.'],
 ['SEO','assets/services-v35/seo.svg','Technical, content and local search optimization to earn visibility.'],
 ['GEO / AI Search','assets/services-v35/geo.svg','Help your business surface in AI-powered search and answer engines.'],
 ['Website Building','assets/services/website-building.svg','Fast, responsive websites designed to turn attention into action.'],
 ['Personal Branding','assets/services/personal-branding.svg','Build a recognizable, credible voice across your digital presence.'],
 ['Photography & Videography','assets/services-v35/photo-video.svg','Original photo and video storytelling with a human point of view.'],
 ['YouTube Ads','assets/services/youtube-ads.png','Video advertising with stronger creative, reach and measurement.'],
 ['ChatGPT Ads','assets/services/chatgpt-ads.png','Explore emerging conversational advertising with an experimental mindset.'],
 ['AI Tools','assets/services-v35/ai-tools.svg','Practical AI for research, content planning and smarter workflows.'],
 ['LinkedIn Ads','assets/services/linkedin-ads.png','B2B campaigns designed to reach relevant professionals.'],
 ['Branding','assets/services/brand-identity.svg','Shape a clear identity and a story people remember.'],
 ['AI Video Generation','assets/services/ai-video-generation.svg','Create original AI-assisted video concepts with thoughtful direction.'],
 ['Analytics & Measurement','assets/services-v35/analytics.svg','GA4, GTM and dashboards that turn numbers into decisions.'],
 ['AI Automation','assets/services-v35/automation.svg','Reduce repetitive tasks with connected AI-enabled workflows.']
];
let page=0, activeCard=null,locked=false,pending=null;const perPage=8;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function isMobile(){return window.matchMedia('(max-width:600px)').matches;}
function movePopup(el){if(!el)return;
 if(isMobile()){popup.style.left='14px';popup.style.top='auto';return;}
 const box=el.getBoundingClientRect(), pw=300, ph=176;
 let left=box.right+12, top=box.top+box.height*.13;
 if(left+pw>innerWidth-24)left=box.left-pw-12;
 if(left<15)left=Math.max(16,Math.min(innerWidth-pw-16,box.left+(box.width-pw)/2));
 if(top+ph>innerHeight-12)top=box.bottom-ph-10;
 top=Math.max(12,top);
 popup.style.left=left+'px';popup.style.top=top+'px';
}
function select(el,stay){if(!el)return;clearTimeout(pending);
 if(activeCard&&activeCard!==el){activeCard.classList.remove('is-active');activeCard.setAttribute('aria-pressed','false');}
 activeCard=el;locked=stay;el.classList.add('is-active');el.setAttribute('aria-pressed','true');
 popupTitle.textContent=services[Number(el.dataset.idx)][0];popupDesc.textContent=services[Number(el.dataset.idx)][2];
 popup.hidden=false;movePopup(el);requestAnimationFrame(()=>popup.classList.add('is-open'));
}
function hide(immediate=false){clearTimeout(pending);if(!activeCard)return;
 activeCard.classList.remove('is-active');activeCard.setAttribute('aria-pressed','false');activeCard=null;locked=false;
 popup.classList.remove('is-open');pending=setTimeout(()=>{if(!activeCard)popup.hidden=true},immediate?0:210);
}
function render(){hide(true);const slice=services.slice(page*perPage,(page+1)*perPage);
 grid.innerHTML=slice.map((s,i)=>`<button type="button" class="s35-card" data-idx="${page*perPage+i}" aria-label="${esc(s[0])}: ${esc(s[2])}" aria-pressed="false"><span class="s35-card-top"><span class="s35-icon-wrap"><img src="${esc(s[1])}" alt="" loading="lazy" decoding="async"/></span><span class="s35-open" aria-hidden="true">↗</span></span><span class="s35-card-name">${esc(s[0])}</span></button>`).join('');
 counter.textContent=`0${page+1} / 0${Math.ceil(services.length/perPage)}`;
 dots.forEach((x,i)=>{x.classList.toggle('is-current',i===page);if(i===page)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')});
}
function change(delta){page=(page+delta+2)%2;grid.classList.add('is-leaving');setTimeout(()=>{render();grid.classList.remove('is-leaving');grid.classList.add('is-entering');requestAnimationFrame(()=>requestAnimationFrame(()=>grid.classList.remove('is-entering')))},120);}
const supportedHover=window.matchMedia('(hover:hover)').matches;
grid.addEventListener('pointerover',e=>{let el=e.target.closest('.s35-card');if(el&&supportedHover&&e.pointerType!=='touch'&&!locked)select(el,false)});
grid.addEventListener('pointerout',e=>{let el=e.target.closest('.s35-card');if(el&&supportedHover&&!locked&&!el.contains(e.relatedTarget))hide()});
grid.addEventListener('focusin',e=>{const el=e.target.closest('.s35-card');if(el)select(el,false)});
grid.addEventListener('focusout',e=>{if(!locked&&e.target.closest('.s35-card'))hide()});
grid.addEventListener('click',e=>{const el=e.target.closest('.s35-card');if(!el)return;
 if(activeCard===el&&locked)hide();else select(el,true);
});
root.querySelector('.s35-prev').addEventListener('click',()=>change(-1));root.querySelector('.s35-next').addEventListener('click',()=>change(1));
dots.forEach((el,i)=>el.addEventListener('click',()=>{if(i!==page)change(i-page)}));
document.addEventListener('pointerdown',e=>{if(activeCard&&!e.target.closest('.s35-card')&&!e.target.closest('.s52-glass'))hide(true)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hide(true)});
window.addEventListener('scroll',()=>{if(!activeCard)return;const b=root.getBoundingClientRect();if(b.bottom<10||b.top>innerHeight-20)hide(true);else if(!isMobile())movePopup(activeCard);},{passive:true});
window.addEventListener('resize',()=>{if(activeCard)movePopup(activeCard)},{passive:true});
let touchX=null;
grid.addEventListener('touchstart',e=>{touchX=e.touches.length===1?e.touches[0].clientX:null},{passive:true});
grid.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>72)change(dx<0?1:-1);touchX=null},{passive:true});
render();
})();