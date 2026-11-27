// MRKTR V52 — equal sized interactive service network, no resizing or hover traps.
(()=>{'use strict';
const root=document.querySelector('.services-v35');if(!root)return;
if(!document.querySelector('link[href*="editorial-refinement.css"]')){const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('editorial-refinement.css',document.currentScript.src).href;document.head.append(link);}
const style=document.createElement('style');style.id='mrktr-service-panel-style';style.textContent="\n#services .s52-detail-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,30%);gap:24px;align-items:start;}\n#services .s52-service-detail{min-width:0;box-sizing:border-box;padding:24px;border:1px solid #303030;border-radius:16px;background:#141414;color:#eee;font-family:Inter,Arial,sans-serif;text-align:left;}\n#services .s52-service-detail h3{font-size:23px;line-height:1.2;margin:0 0 12px;font-weight:600;color:#fff;}\n#services .s52-service-detail h4{font-size:13px;font-weight:600;margin:0 0 10px;color:#bbb;}\n#services .s52-service-detail p,#services .s52-service-detail li{font-size:14px;line-height:1.6;color:#ccc;margin:0;}\n#services .s52-service-detail hr{border:0;border-top:1px solid #333;margin:18px 0;}\n#services .s52-service-detail ul{list-style:none;padding:0;margin:0;}\n#services .s52-service-detail li{padding:3px 0 3px 20px;position:relative;}\n#services .s52-service-detail li:before{content:'\u2713';color:#d4af37;position:absolute;left:0;}\n#services .s52-enquire{display:block;width:100%;border:0;border-radius:8px;background:#d4af37;color:#111;padding:13px 10px;margin-top:24px;font:600 13px Inter,Arial,sans-serif;cursor:pointer;}\n#services .s52-enquire:focus-visible{outline:2px solid white;outline-offset:3px;}\n#services .s52-detail-layout .s35-shelf{min-width:0;}\n@media(min-width:901px) and (max-width:1200px){#services .s52-detail-layout .s35-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;}}\n@media(max-width:900px){#services .s52-detail-layout{display:block;}#services .s52-service-detail{grid-column:1/-1;width:100%;padding:20px;}}\n#mrktr-enquiry-form{scroll-margin-top:90px;}\n\n@media(min-width:901px){#services .s52-detail-layout{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(300px,32%)!important;width:100%;align-items:start;}#services .s52-detail-layout .s35-shelf{width:100%;margin:0!important;}#services .s52-detail-layout .s35-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;}#services .s52-service-detail{align-self:start;margin:0!important;}}\n#services .s52-enquire{appearance:none!important;background:#d4af37!important;color:#101010!important;border:1px solid #d4af37!important;min-height:48px;font-size:14px!important;transition:background .2s;}#services .s52-enquire:hover{background:#edc85a!important;}\n@media(max-width:900px){#services .s52-service-detail{grid-column:1/-1!important;}}";style.textContent+="\n#services .s52-learn-more{display:block;margin-top:18px;color:#d4af37;font-size:14px;font-weight:600;text-decoration:underline;text-underline-offset:4px;}";document.head.append(style);
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
const details=[
[['Search campaign setup','Keyword and negative keyword research','Conversion tracking','Ongoing optimisation'],'Reach people actively searching for your services.'],
[['Creative testing','Audience and retargeting strategy','Lead form optimisation','Pixel and CAPI planning'],'Generate relevant enquiries across Facebook and Instagram.'],
[['Short-form creative strategy','Audience testing','Campaign setup','Performance reporting'],'Reach new audiences with relevant video content.'],
[['Technical SEO audit','Keyword research','On-page optimisation','Local search strategy'],'Improve organic visibility and qualified traffic.'],
[['AI search visibility audit','Entity and content strategy','Structured data recommendations'],'Improve discoverability in AI-powered search.'],
[['Responsive design','Landing pages','Performance optimisation','Enquiry integration'],'Turn website visits into meaningful enquiries.'],
[['Positioning','Content strategy','Profile optimisation'],'Build a credible and recognisable professional presence.'],
[['Creative direction','Photography','Video production','Editing'],'Tell your story through original visuals.'],
[['Video campaign strategy','Audience targeting','Creative testing','Measurement'],'Reach relevant viewers and measure their response.'],
[['Channel readiness assessment','Creative concepts','Measurement planning'],'Explore conversational advertising where available.'],
[['Workflow audit','Tool selection','Practical implementation'],'Reduce manual effort in everyday marketing.'],
[['B2B audience strategy','Campaign setup','Lead generation','Reporting'],'Reach relevant business decision-makers.'],
[['Brand positioning','Visual identity direction','Messaging'],'Build a consistent, recognisable brand.'],
[['Concept development','AI-assisted production','Editing and review'],'Produce distinctive video concepts efficiently.'],
[['GA4 and GTM setup','Conversion tracking','Attribution review','Dashboards'],'Understand which marketing activities drive results.'],
[['Process mapping','Tool integration','Workflow testing'],'Reduce repetitive tasks and improve consistency.']
];
const landingPages=["google-ads-dubai", "meta-ads-dubai", "tiktok-ads-dubai", "seo-geo-aeo-dubai", "seo-geo-aeo-dubai", "creative-digital-services-dubai", "creative-digital-services-dubai", "creative-digital-services-dubai", "youtube-ads-dubai", "chatgpt-ai-advertising-dubai", null, null, "creative-digital-services-dubai", "creative-digital-services-dubai", "marketing-analytics-dubai", null];
let page=0,active=-1;const perPage=8;
const shelf=root.querySelector('.s35-shelf');
const layout=document.createElement('div');layout.className='s52-detail-layout';shelf.before(layout);layout.append(shelf);
const panel=document.createElement('aside');panel.className='s52-service-detail';panel.setAttribute('aria-label','Selected service details');panel.innerHTML='<div class="s52-detail-content" aria-live="polite"></div><button type="button" class="s52-enquire">Enquire about this service ↗</button>';layout.append(panel);
const content=panel.firstElementChild,cta=panel.lastElementChild;
const mobile=matchMedia('(max-width: 900px)');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function place(){if(mobile.matches){const card=grid.querySelector(`[data-idx="${active}"]`);if(card)card.after(panel);}else layout.append(panel);}
function select(n){active=n;grid.querySelectorAll('.s35-card').forEach(c=>{const on=Number(c.dataset.idx)===n;c.classList.toggle('is-active',on);c.setAttribute('aria-pressed',String(on));});const s=services[n],d=details[n];content.innerHTML=`<h3>${esc(s[0])}</h3><p>${esc(s[2])}</p><hr><h4>What’s included</h4><ul>${d[0].map(x=>`<li>${esc(x)}</li>`).join('')}</ul><hr><h4>Business objective</h4><p>${esc(d[1])}</p>`;if(landingPages[n]){const link=document.createElement("a");link.className="s52-learn-more";link.href=landingPages[n]+"/";link.textContent="Explore this service ↗";content.append(link);}panel.hidden=false;place();}
function render(){layout.append(panel);grid.innerHTML=services.slice(page*perPage,(page+1)*perPage).map((s,i)=>`<button type="button" class="s35-card" data-idx="${page*perPage+i}" aria-label="${esc(s[0])}" aria-pressed="false"><span class="s35-card-top"><span class="s35-icon-wrap"><img src="${esc(s[1])}" alt="" loading="lazy" decoding="async"/></span><span class="s35-open" aria-hidden="true">↗</span></span><span class="s35-card-name">${esc(s[0])}</span></button>`).join('');counter.textContent=`0${page+1} / 02`;dots.forEach((x,i)=>{x.classList.toggle('is-current',i===page);if(i===page)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')});select(page*perPage);}
function change(delta){page=(page+delta+2)%2;render();}
grid.addEventListener('click',e=>{const c=e.target.closest('.s35-card');if(c)select(Number(c.dataset.idx));});
root.querySelector('.s35-prev').addEventListener('click',()=>change(-1));root.querySelector('.s35-next').addEventListener('click',()=>change(1));dots.forEach((el,i)=>el.addEventListener('click',()=>{if(i!==page)change(i-page)}));
mobile.addEventListener('change',place);
cta.addEventListener('click',()=>{const field=document.getElementById('lead-service'),form=document.getElementById('mrktr-enquiry-form');if(!field||!form)return;const name=services[active][0];if(!Array.from(field.options).some(o=>o.value===name))field.add(new Option(name,name));field.value=name;field.dispatchEvent(new Event('change',{bubbles:true}));form.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});field.focus({preventScroll:true});});
let touchX=null;grid.addEventListener('touchstart',e=>{touchX=e.target.closest('.s35-card')&&e.touches.length===1?e.touches[0].clientX:null},{passive:true});grid.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>72)change(dx<0?1:-1);touchX=null},{passive:true});
render();
})();