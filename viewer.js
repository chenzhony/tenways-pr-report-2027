'use strict';
(async function(){
  const image=document.getElementById('currentSlide'), zoom=document.getElementById('zoom');
  const previous=document.getElementById('previous'), next=document.getElementById('next');
  const response=await fetch('slides.json');
  if(!response.ok)throw new Error('报告目录暂时无法加载，请刷新页面或下载完整PPT。');
  const slides=await response.json();
  let current=0;
  const links=slides.map((slide,index)=>{
    const a=document.createElement('a');a.href='#slide-'+(index+1);
    const n=document.createElement('span');n.textContent=String(index+1).padStart(2,'0');
    a.append(n,document.createTextNode(slide.title));
    a.addEventListener('click',()=>document.querySelector('.reader').scrollIntoView({behavior:'smooth',block:'start'}));
    document.getElementById('contents').append(a);return a;
  });
  function show(index){
    current=Math.max(0,Math.min(slides.length-1,index));
    const slide=slides[current];image.src=slide.image;zoom.href=slide.image;
    image.alt='第'+(current+1)+'页：'+slide.title;
    document.getElementById('pageNumber').textContent=String(current+1).padStart(2,'0')+' / '+slides.length;
    document.getElementById('slideTitle').textContent=slide.title;
    previous.disabled=current===0;next.disabled=current===slides.length-1;
    links.forEach((a,i)=>{a.classList.toggle('active',i===current);if(i===current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(slides[current+1]){const preload=new Image();preload.src=slides[current+1].image;}
  }
  function fromHash(){const match=location.hash.match(/^#slide-(\d+)$/);show(match?Number(match[1])-1:0);}
  function move(delta){location.hash='slide-'+Math.max(1,Math.min(slides.length,current+1+delta));}
  previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  window.addEventListener('hashchange',fromHash);
  window.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}});
  fromHash();
})().catch(error=>{document.getElementById('slideTitle').textContent=error.message;});
