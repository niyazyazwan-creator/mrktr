// MRKTR V35: minimalist service shelf, eight at a time with focus, keyboard and touch support.
(()=>{'use strict';
const root=document.querySelector('.services-v35');if(!root)return;
const grid=root.querySelector('.s35-grid'),counter=root.querySelector('.s35-counter'),dots=[...root.querySelectorAll('.s35-page')];
const services=[
 {name:"Google Ads",icon:"assets/services/google-ads.png",description:"High-intent search campaigns built for qualified leads and sales."},
 {name:"Meta Ads",icon:"assets/services/meta-ads.png",description:"Data-driven campaigns that build reach, drive engagement, and convert at scale."},
 {name:"TikTok Ads",icon:"assets/services/tiktok-ads.png",description:"Short-form social campaigns designed to inspire and convert."},
 {name:"SEO",icon:"assets/services-v35/seo.svg",description:"Search visibility built on useful content, technical SEO and trust."},
 {name:"GEO / AI Search",icon:"assets/services-v35/geo.svg",description:"Help your business get discovered in AI-powered search experiences."},
 {name:"Website Building",icon:"assets/services/website-building.svg",description:"Responsive, fast, thoughtful websites that turn visits into action."},
 {name:"Personal Branding",icon:"assets/services/personal-branding.svg",description:"Make your expertise stand out with consistent identity and content."},
 {name:"Professional Photography & Videography",icon:"assets/services-v35/photo-video.svg",description:"Authentic visuals that make your brand feel human and memorable."},
 {name:"YouTube Ads",icon:"assets/services/youtube-ads.png",description:"Reach viewers with video campaigns built for attention and action."},
 {name:"ChatGPT Ads",icon:"assets/services/chatgpt-ads.png",description:"Explore emerging AI advertising formats and smart measurement."},
 {name:"AI Tools",icon:"assets/services-v35/ai-tools.svg",description:"Useful AI systems for research, content, strategy and productivity."},
 {name:"LinkedIn Ads",icon:"assets/services/linkedin-ads.png",description:"Reach professional audiences and build qualified B2B pipelines."},
 {name:"Branding",icon:"assets/services/brand-identity.svg",description:"Define a distinctive identity and message people remember."},
 {name:"AI Video Generation",icon:"assets/services/ai-video-generation.svg",description:"Create compelling AI-assisted scenes with human creative direction."},
 {name:"Analytics & Measurement",icon:"assets/services-v35/analytics.svg",description:"Understand performance with GA4, GTM and readable dashboards."},
 {name:"AI Automation",icon:"assets/services-v35/automation.svg",description:"Connect your tools and make repeatable marketing work effortless."}
];
let page=0,selected=1,busy=false;const size=8;
function escapeHTML(str){return String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function createCard(s,i){const active=i===selected;return `<button class="s35-card${active?' is-active':''}" type="button" aria-label="${escapeHTML(s.name)}: ${escapeHTML(s.description)}" aria-pressed="${active}" data-idx="${i}"><span class="s35-card-edge" aria-hidden="true"></span><span class="s35-card-top"><span class="s35-icon-wrap"><img src="${s.icon}" alt="" decoding="async" loading="lazy"/></span><span class="s35-open" aria-hidden="true">↗</span></span><span class="s35-card-name">${escapeHTML(s.name)}</span><span class="s35-card-rule" aria-hidden="true"></span><span class="s35-card-info">${escapeHTML(s.description)}</span></button>`;}
function setRowWeights(){const rows=[...grid.querySelectorAll('.s36-row')];rows.forEach((row,r)=>{const weights=[1,1,1,1];if(Math.floor(selected/4)===page*2+r){const col=selected%4;weights[col]=1.4;weights.forEach((_,j)=>{if(j!==col)weights[j]=j<col?1.03:.95})}row.style.gridTemplateColumns=weights.map(n=>`${n}fr`).join(' ');});}
function sync(){const subset=services.slice(page*size,page*size+size);grid.innerHTML='<div class="s36-row s36-row-primary">'+subset.slice(0,4).map((s,i)=>createCard(s,page*size+i)).join('')+'</div><div class="s36-row s36-row-secondary">'+subset.slice(4,8).map((s,i)=>createCard(s,page*size+4+i)).join('')+'</div>';setRowWeights();counter.textContent=`0${page+1} / 0${services.length/size}`;dots.forEach((b,i)=>{b.classList.toggle('is-current',page===i);if(page===i)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});}
function changePage(n){if(busy)return;busy=true;grid.classList.add('is-leaving');setTimeout(()=>{page=(n+services.length/size)%(services.length/size);selected=page===0?1:8;sync();grid.classList.remove('is-leaving');grid.classList.add('is-entering');requestAnimationFrame(()=>requestAnimationFrame(()=>grid.classList.remove('is-entering')));setTimeout(()=>{busy=false},440)},230);}
function select(n){if(n===selected)return;const current=grid.querySelector('.s35-card.is-active');const next=grid.querySelector(`[data-idx="${n}"]`);if(current){current.classList.remove('is-active');current.setAttribute('aria-pressed','false')}if(next){next.classList.add('is-active');next.setAttribute('aria-pressed','true')}selected=n;setRowWeights();}
root.querySelector('.s35-prev').addEventListener('click',()=>changePage(page-1));root.querySelector('.s35-next').addEventListener('click',()=>changePage(page+1));
dots.forEach(b=>b.addEventListener('click',()=>changePage(Number(b.dataset.page))));
grid.addEventListener('click',e=>{const card=e.target.closest('.s35-card');if(card)select(Number(card.dataset.idx))});
root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();changePage(page+1)}if(e.key==='ArrowLeft'){e.preventDefault();changePage(page-1)}});
let touchX=null;grid.addEventListener('touchstart',e=>{touchX=e.touches.length===1?e.touches[0].clientX:null},{passive:true});grid.addEventListener('touchend',e=>{if(touchX===null)return;let dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>65)changePage(page+(dx<0?1:-1));touchX=null},{passive:true});
sync();
})();