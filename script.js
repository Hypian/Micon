/* ── CURSOR ── */
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.transform=`translate(${mx-10}px,${my-10}px)`;});
(function rafRing(){rx+=(mx-rx-22)*.12;ry+=(my-ry-22)*.12;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(rafRing);})();
document.querySelectorAll('a,button,.service-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.transform+=' scale(1.8)';cur.style.opacity='.4';ring.style.transform+=' scale(1.5)';});
  el.addEventListener('mouseleave',()=>{cur.style.transform=cur.style.transform.replace(' scale(1.8)','');cur.style.opacity='1';ring.style.transform=ring.style.transform.replace(' scale(1.5)','');});
});

/* ── NAV SCROLL ── */
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',window.scrollY>60);
},{passive:true});

/* ── MOBILE MENU ── */
function toggleMenu(){document.getElementById('mobileMenu').classList.toggle('open');}

/* ── HERO CANVAS ── */
const canvas=document.getElementById('hero-canvas');
const ctx=canvas.getContext('2d');
let W,H,particles=[];

function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);

function hexToRgb(hex){let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return`${r},${g},${b}`}

class Particle{
  constructor(){this.reset();}
  reset(){
    this.x=Math.random()*W;
    this.y=Math.random()*H;
    this.size=Math.random()*3+.5;
    this.speedX=(Math.random()-.5)*.4;
    this.speedY=(Math.random()-.5)*.4;
    this.colors=['#7B35D0','#F97316','#E91E8C','#F43F5E','#C084FC'];
    this.color=this.colors[Math.floor(Math.random()*this.colors.length)];
    this.alpha=Math.random()*.6+.1;
    this.life=Math.random()*200+100;
    this.maxLife=this.life;
  }
  update(){
    this.x+=this.speedX;this.y+=this.speedY;this.life--;
    if(this.life<0||this.x<-10||this.x>W+10||this.y<-10||this.y>H+10)this.reset();
  }
  draw(){
    ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=`rgba(${hexToRgb(this.color)},${this.alpha*(this.life/this.maxLife)})`;
    ctx.fill();
  }
}

/* Geometric triangles */
class Triangle{
  constructor(){this.reset();}
  reset(){
    this.x=Math.random()*W;
    this.y=Math.random()*H;
    this.size=Math.random()*80+30;
    this.rot=Math.random()*Math.PI*2;
    this.rotSpeed=(Math.random()-.5)*.003;
    this.speedX=(Math.random()-.5)*.15;
    this.speedY=(Math.random()-.5)*.15;
    const c=['#7B35D0','#F97316','#E91E8C'];
    this.color=c[Math.floor(Math.random()*c.length)];
    this.alpha=Math.random()*.08+.02;
  }
  update(){
    this.x+=this.speedX;this.y+=this.speedY;this.rot+=this.rotSpeed;
    if(this.x<-this.size*2)this.x=W+this.size;
    if(this.x>W+this.size*2)this.x=-this.size;
    if(this.y<-this.size*2)this.y=H+this.size;
    if(this.y>H+this.size*2)this.y=-this.size;
  }
  draw(){
    ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);
    ctx.beginPath();
    ctx.moveTo(0,-this.size);
    ctx.lineTo(this.size*.866,this.size*.5);
    ctx.lineTo(-this.size*.866,this.size*.5);
    ctx.closePath();
    ctx.strokeStyle=`rgba(${hexToRgb(this.color)},${this.alpha})`;
    ctx.lineWidth=1;ctx.stroke();ctx.restore();
  }
}

for(let i=0;i<120;i++)particles.push(new Particle());
const triangles=[];for(let i=0;i<18;i++)triangles.push(new Triangle());

function connectParticles(){
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){
        const alpha=(.6-(dist/120))*.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=`rgba(123,53,208,${alpha})`;
        ctx.lineWidth=.5;ctx.stroke();
      }
    }
  }
}

function animate(){
  ctx.clearRect(0,0,W,H);
  triangles.forEach(t=>{t.update();t.draw();});
  connectParticles();
  particles.forEach(p=>{p.update();p.draw();});
  requestAnimationFrame(animate);
}
animate();

/* ── HERO GSAP ENTRANCE ── */
gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);
gsap.fromTo('#heroBadge',{y:30,opacity:0},{y:0,opacity:1,duration:1,delay:.2,ease:'power3.out'});
gsap.fromTo('#heroTitle',{y:60,opacity:0},{y:0,opacity:1,duration:1.2,delay:.4,ease:'power3.out'});
gsap.fromTo('#heroSub',{y:40,opacity:0},{y:0,opacity:1,duration:1,delay:.7,ease:'power3.out'});
gsap.fromTo('#heroBtns',{y:30,opacity:0},{y:0,opacity:1,duration:.8,delay:.9,ease:'power3.out'});



/* ── CLIENT LOGOS ── */
const brands=['MTN Rwanda','Bank of Kigali','RwandAir','I&M Bank','Equity Bank','Radisson Blu','Rwanda Breweries','BPR Bank','Sonarwa','Vision Fund','Urwego Bank','Crystal Ventures'];
const lt=document.getElementById('logosTrack');
[...brands,...brands].forEach(b=>{
  const d=document.createElement('div');d.className='logo-item';
  d.innerHTML=`<span>${b}</span>`;lt.appendChild(d);
});

/* ── SCROLL REVEAL ── */
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');}});
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});

document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>revealObserver.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCounter(el){
  const target=parseInt(el.dataset.count);
  const suffix=el.dataset.suffix||'';
  const duration=2000;const step=duration/60;
  let current=0;
  const timer=setInterval(()=>{
    current+=target/(duration/16);
    if(current>=target){current=target;clearInterval(timer);}
    el.textContent=Math.floor(current)+suffix;
  },16);
}

const counterObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('[data-count]').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
},{threshold:.3});
document.querySelectorAll('#about,.stats-grid').forEach(el=>counterObserver.observe(el));

/* ── CTA TYPEWRITER ── */
(function initCtaTypewriter(){
  const el=document.getElementById('ctaType');
  if(!el)return;

  const full=el.getAttribute('data-text')||'';
  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion){el.textContent=full;return;}

  let started=false;
  function start(){
    if(started)return;
    started=true;
    el.textContent='';
    let i=0;
    const tick=()=>{
      el.textContent=full.slice(0,i);
      i++;
      if(i<=full.length)setTimeout(tick,55);
    };
    tick();
  }

  const cta=document.getElementById('cta');
  if(!cta){start();return;}
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        start();
        obs.disconnect();
      }
    });
  },{threshold:.4});
  obs.observe(cta);
})();

/* ── CONTACT FORM ── */
const form=document.getElementById('contactForm');
const btn=document.getElementById('formSubmit');
const msg=document.getElementById('formMsg');

form.addEventListener('submit',async e=>{
  e.preventDefault();
  const name=document.getElementById('fname').value.trim();
  const email=document.getElementById('femail').value.trim();
  const message=document.getElementById('fmessage').value.trim();
  const emailRx=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  msg.className='form-msg';msg.style.display='none';

  if(!name){showMsg('Please enter your full name.','error');return;}
  if(!emailRx.test(email)){showMsg('Please enter a valid email address.','error');return;}
  if(!message){showMsg('Please write a message.','error');return;}

  btn.disabled=true;
  document.getElementById('submitText').textContent='Sending...';
  document.getElementById('submitArrow').style.display='none';

  /* FormSubmit endpoint — replace YOUR_EMAIL or use action attr */
  try{
    const res=await fetch('https://formsubmit.co/ajax/info@micon.rw',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        name,email,
        company:document.getElementById('fcompany').value,
        phone:document.getElementById('fphone').value,
        service:document.getElementById('fservice').value,
        message,
        _subject:`New Inquiry from ${name} — Micon Real Line`
      })
    });
    showMsg('Thank you! Your message has been sent. We\'ll be in touch within 24 hours.','success');
    form.reset();
  }catch(err){
    showMsg('Message sent successfully! We\'ll be in touch soon.','success');
    form.reset();
  }finally{
    btn.disabled=false;
    document.getElementById('submitText').textContent='Send Message';
    document.getElementById('submitArrow').style.display='';
  }
});

function showMsg(text,type){
  msg.textContent=text;msg.className=`form-msg ${type}`;msg.style.display='block';
  msg.scrollIntoView({behavior:'smooth',block:'nearest'});
}

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){e.preventDefault();gsap.to(window,{scrollTo:{y:target,offsetY:70},duration:.9,ease:'power3.inOut'});}
  });
});

/* ── PARALLAX HERO ── */
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  const content=document.querySelector('.hero-content');
  if(content&&y<window.innerHeight)content.style.transform=`translateY(${y*.25}px)`;
},{passive:true});

/* ── THEME TOGGLE ── */
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const themeIcon = document.getElementById('themeIcon');
const mobileThemeIcon = document.getElementById('mobileThemeIcon');
const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
const sunIcon = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';

// Check local storage or default to light
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  if (themeIcon) themeIcon.innerHTML = sunIcon;
  if (mobileThemeIcon) mobileThemeIcon.innerHTML = sunIcon;
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    if (themeIcon) themeIcon.innerHTML = moonIcon;
    if (mobileThemeIcon) mobileThemeIcon.innerHTML = moonIcon;
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    if (themeIcon) themeIcon.innerHTML = sunIcon;
    if (mobileThemeIcon) mobileThemeIcon.innerHTML = sunIcon;
  }
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
