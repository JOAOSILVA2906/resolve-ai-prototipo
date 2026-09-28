const app=document.querySelector('#app');const backBtn=document.querySelector('#backBtn');const adminBtn=document.querySelector('#adminBtn');const bottomNav=document.querySelector('#bottomNav');let historyStack=[];let state={service:'Retirar documento',desc:'',pickup:'SRTVN 701, Asa Norte - Brasília - DF',dropoff:'SHS Quadra 06, Asa Sul - Brasília - DF'};
function render(name,push=true){const tpl=document.querySelector(`#${name}`);if(!tpl)return;if(push&&app.dataset.screen&&app.dataset.screen!==name)historyStack.push(app.dataset.screen);app.innerHTML='';app.appendChild(tpl.content.cloneNode(true));app.dataset.screen=name;const isAdmin=name==='admin';bottomNav.style.display=isAdmin?'none':'flex';backBtn.style.visibility=['home','admin'].includes(name)?'hidden':'visible';wire();if(name==='quote'){document.querySelector('#summaryService').textContent=state.service;document.querySelector('#summaryPickup').textContent=state.pickup.split(' - ')[0];document.querySelector('#summaryDropoff').textContent=state.dropoff.split(' - ')[0]}}
function go(name){render(name)}window.go=go;
function wire(){syncAccountNavigation();document.querySelectorAll('[data-go]').forEach(el=>el.onclick=()=>go(el.dataset.go));document.querySelectorAll('[data-service]').forEach(el=>el.onclick=()=>{state.service=el.dataset.service;go('describe')});const d=document.querySelector('#descInput');if(d){d.value=state.desc;d.oninput=()=>{state.desc=d.value;document.querySelector('#count').textContent=`${d.value.length}/500`}}const p=document.querySelector('#pickup');if(p)p.oninput=()=>state.pickup=p.value;const dr=document.querySelector('#dropoff');if(dr)dr.oninput=()=>state.dropoff=dr.value;const stars=document.querySelectorAll('#stars button');stars.forEach((s,i)=>s.onclick=()=>stars.forEach((x,j)=>x.classList.toggle('on',j<=i)))}
const accountBtn = document.querySelector('#accountBtn');
const accountMenu = document.querySelector('#accountMenu');
function closeAccountMenu(restoreFocus = false) {
  accountMenu.hidden = true;
  accountBtn.setAttribute('aria-expanded', 'false');
  if (restoreFocus) accountBtn.focus();
}
accountBtn.onclick = () => {
  const opening = accountMenu.hidden;
  accountMenu.hidden = !opening;
  accountBtn.setAttribute('aria-expanded', String(opening));
};
document.addEventListener('click', event => {
  if (!event.target.closest('.account-control')) closeAccountMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !accountMenu.hidden) closeAccountMenu(true);
});
document.addEventListener('focusin', event => {
  if (!event.target.closest('.account-control')) closeAccountMenu();
});
let reducedMotion = false;
try { reducedMotion = localStorage.getItem('resolve-reduced-motion') === 'true'; } catch {}
document.body.classList.toggle('reduce-motion', reducedMotion);
function syncAccountNavigation() {
  closeAccountMenu(accountMenu.contains(document.activeElement));
  const screen = app.dataset.screen;
  const serviceScreens = ['services', 'describe', 'location', 'quote', 'searching', 'tracking', 'done', 'review'];
  const active = serviceScreens.includes(screen) ? 'services' : screen;
  bottomNav.querySelectorAll('[data-go]').forEach(button => {
    if (button.dataset.go === active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  accountBtn.classList.toggle('active', ['profile', 'settings'].includes(screen));
  const preference = document.querySelector('#reduceMotion');
  if (preference) {
    preference.checked = reducedMotion;
    preference.onchange = () => {
      reducedMotion = preference.checked;
      document.body.classList.toggle('reduce-motion', reducedMotion);
      try { localStorage.setItem('resolve-reduced-motion', String(reducedMotion)); } catch {}
    };
  }
}
backBtn.onclick=()=>{const prev=historyStack.pop()||'home';render(prev,false)};adminBtn.onclick=()=>go('admin');bottomNav.querySelectorAll('button').forEach(b=>b.onclick=()=>go(b.dataset.go));render('home',false);
