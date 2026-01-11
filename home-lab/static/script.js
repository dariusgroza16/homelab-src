function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const btn = document.getElementById('theme-toggle');
    if(btn) btn.textContent = next === 'dark' ? '🌙' : '☀️';
}

function applySavedTheme(){
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('theme-toggle');
    if(btn) btn.textContent = saved === 'dark' ? '🌙' : '☀️';
}

function revealOnScroll(){
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
            if(e.isIntersecting) e.target.classList.add('visible');
        });
    },{threshold:.1});
    els.forEach(el=>io.observe(el));
}

function setupCardsAndModal(){
    const cards = document.querySelectorAll('.card');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.getElementById('modal-close');

    cards.forEach(card=>{
        card.addEventListener('click', ()=>{
            const title = card.dataset.title || card.querySelector('h3')?.textContent || 'Details';
            modalTitle.textContent = title;
            modalBody.innerHTML = card.querySelector('p')?.outerHTML || card.querySelector('ul')?.outerHTML || '<p>No details yet.</p>';
            modal.setAttribute('aria-hidden','false');
        });
    });

    closeBtn.addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','true'); });
    modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true'); });
}

function setupHeroButtons(){
    const about = document.getElementById('about-btn');
    if(about){
        about.addEventListener('click', ()=>{
            const modal = document.getElementById('modal');
            document.getElementById('modal-title').textContent = 'About this Homelab';
            document.getElementById('modal-body').innerHTML = '<p>Runs k3s, Prometheus, Grafana, Node-RED and custom automation with Ansible.</p>';
            modal.setAttribute('aria-hidden','false');
        });
    }
}

function setupTabs(){
    const buttons = Array.from(document.querySelectorAll('.tab-button'));
    const slider = document.getElementById('tab-slider');
    const panels = Array.from(document.querySelectorAll('.tab-panel'));
    if(!buttons.length || !slider || !panels.length) return;

    function activate(key, btn){
        buttons.forEach(b=>b.classList.toggle('active', b.dataset.tab===key));
        panels.forEach(p=>{
            if(p.dataset.tab===key){ p.removeAttribute('hidden'); p.classList.add('visible'); }
            else { p.setAttribute('hidden',''); p.classList.remove('visible'); }
        });
        // move slider (bubble) under active button
        const rect = btn.getBoundingClientRect();
        const parentRect = btn.parentElement.getBoundingClientRect();
        const left = rect.left - parentRect.left;
        slider.style.width = rect.width + 'px';
        slider.style.transform = `translateX(${left}px)`;
        // show/hide decorative side images and set body data attribute for blending
        if(key === 'k3s') document.body.setAttribute('data-active-tab','k3s'); else document.body.removeAttribute('data-active-tab');
    }

    // click handlers
    buttons.forEach(btn=>btn.addEventListener('click', (e)=>{
        const key = btn.dataset.tab;
        activate(key, btn);
        // make sure first reveal items are handled
        revealOnScroll();
    }));

    // initialize to explore or persisted
    const saved = localStorage.getItem('activeTab') || 'explore';
    const initial = buttons.find(b=>b.dataset.tab===saved) || buttons[0];
    if(initial) activate(initial.dataset.tab, initial);
    // persist on change
    buttons.forEach(b=>b.addEventListener('click', ()=>localStorage.setItem('activeTab', b.dataset.tab)));
    // handle window resize to reposition slider
    window.addEventListener('resize', ()=>{
        const active = document.querySelector('.tab-button.active');
        if(active) {
            const rect = active.getBoundingClientRect();
            const parentRect = active.parentElement.getBoundingClientRect();
            slider.style.width = rect.width + 'px';
            slider.style.transform = `translateX(${rect.left - parentRect.left}px)`;
        }
    });
}

function setupThemeToggle(){
    const t = document.getElementById('theme-toggle');
    if(t) t.addEventListener('click', toggleTheme);
}

function particleBackground(){
    const canvas = document.getElementById('bg-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w,h,particles=[];
    function resize(){ w=canvas.width=canvas.offsetWidth; h=canvas.height=canvas.offsetHeight }
    window.addEventListener('resize', resize); resize();

    function make(){
        particles = Array.from({length:20}).map(()=>({x:Math.random()*w,y:Math.random()*h, r:10+Math.random()*40, vx:(Math.random()-0.5)*.4, vy:(Math.random()-0.5)*.4}));
    }
    make();

    function draw(){
        ctx.clearRect(0,0,w,h);
        particles.forEach(p=>{
            p.x += p.vx; p.y += p.vy;
            if(p.x<-100) p.x=w+100; if(p.x>w+100) p.x=-100;
            if(p.y<-100) p.y=h+100; if(p.y>h+100) p.y=-100;
            const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
            g.addColorStop(0,'rgba(255,77,79,0.14)');
            g.addColorStop(0.5,'rgba(255,77,79,0.06)');
            g.addColorStop(1,'rgba(255,77,79,0.008)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    setupThemeToggle();
    revealOnScroll();
    setupCardsAndModal();
    particleBackground();
    setupTabs();
});
