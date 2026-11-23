// Enhance only the new testimonials chapter; no modifications to the locked cinematic sections.
(() => {
 const root=document.querySelector('.testimonials-v26');
 if(!root)return;
 const visual=root.querySelector('.t26-visual');
 const observer=new IntersectionObserver(([e])=>{ if(e.isIntersecting){visual.classList.add('t26-inview');observer.disconnect();} },{threshold:.1});
 observer.observe(visual);
})();
