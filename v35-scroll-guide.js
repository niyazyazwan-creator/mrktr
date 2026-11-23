// MRKTR V35: unobtrusive floating next-section guide, keyboard/click accessible.
(()=>{'use strict';
 const btn=document.querySelector('.v35-scroll-guide'),journey=document.querySelector('.story-journey');if(!btn||!journey)return;
 const sections=[...document.querySelectorAll('#about,#services,#trusted-brands,#testimonials,#contact')];
 const topOf=el=>el.getBoundingClientRect().top+scrollY;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 let busy=false;
 function click(){if(innerWidth<=720){const about=document.querySelector('#about');if(about)about.scrollIntoView({behavior:'smooth'});return;}if(busy)return;busy=true;setTimeout(()=>busy=false,550);
  const y=scrollY,begin=topOf(journey),atQuote=begin+innerHeight,atStrip=begin+journey.offsetHeight-innerHeight;
  if(y<atQuote-52){if(window.MRKTR_V35_Visor)window.MRKTR_V35_Visor.toStatement();else scrollTo({top:atQuote,behavior:reduced()?'instant':'smooth'});return;}
  if(y<atStrip-45){if(window.MRKTR_V28)window.MRKTR_V28.toStrip();else scrollTo({top:atStrip,behavior:reduced()?'instant':'smooth'});return;}
  const target=sections.find(el=>topOf(el)>y+90);
  if(target)window.scrollTo({top:topOf(target),behavior:reduced()?'instant':'smooth'});
 }
 btn.addEventListener('click',click);
 function update(){const end=document.documentElement.scrollHeight-innerHeight;const contact=document.querySelector('#contact');const contactInView=!!contact && contact.getBoundingClientRect().top<innerHeight*.64;const about=document.querySelector('#about');const mobilePastStory=innerWidth<=600 && !!about && about.getBoundingClientRect().top<innerHeight*.60;const hidden=scrollY>end-95 || contactInView || mobilePastStory || !!document.querySelector('.premium-nav.open');btn.classList.toggle('v35-hidden',hidden);btn.tabIndex=hidden?-1:0;btn.setAttribute('aria-hidden',String(hidden));}
 addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
})();