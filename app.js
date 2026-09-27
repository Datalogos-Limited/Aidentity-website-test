/* Datalogos corporate site interactions and content feeds.
   Production note: replace these sample posts with a CMS/API feed, and connect
   the library form to the authenticated backend described in README.md. */
const posts = [
  {category:'AI GOVERNANCE', title:'From AI ambition to governed adoption', summary:'A practical path from scattered experiments to accountable, measurable AI capability.', date:'FIELD NOTE · 6 MIN READ', href:'#advisory'},
  {category:'DATA ASSURANCE', title:'What does it mean to trust a dataset?', summary:'Provenance, validation and evidence help teams explain what has—and has not—been checked.', date:'PERSPECTIVE · 8 MIN READ', href:'#products'},
  {category:'PRODUCT THINKING', title:'The truth goes with the data', summary:'Why portable records need source context, permissions and integrity evidence to travel with them.', date:'PRODUCT NOTE · 5 MIN READ', href:'#products'}
];
const grid=document.querySelector('#blog-grid');
if(grid){grid.innerHTML=posts.map(post=>`<article class="insight-card"><div class="insight-visual" aria-hidden="true"><div class="visual-lines"></div></div><span>${post.category}</span><h3>${post.title}</h3><p>${post.summary}</p><a href="${post.href}">${post.date} <span>↗</span></a></article>`).join('');}
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#primary-nav');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open)});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Open navigation')}));
document.querySelector('#year').textContent=new Date().getFullYear();
const form=document.querySelector('#library-form');
const message=document.querySelector('#form-message');
const emailInput=document.querySelector('#enterprise-email');
const personalDomains=new Set(['gmail.com','googlemail.com','yahoo.com','yahoo.co.uk','hotmail.com','hotmail.co.uk','outlook.com','outlook.co.uk','live.com','icloud.com','me.com','aol.com','proton.me','protonmail.com','gmx.com','mail.com','yandex.com']);
form?.addEventListener('submit',async event=>{
  event.preventDefault();message.textContent='';message.className='form-message';
  const fullName=form.elements.fullName.value.trim();
  const company=form.elements.company.value.trim();
  const email=emailInput.value.trim().toLowerCase();
  const domain=email.split('@')[1]||'';
  if(!fullName||!company||!email){message.textContent='Please complete all three fields.';message.classList.add('error');return}
  if(!emailInput.checkValidity()||!domain||personalDomains.has(domain)){message.textContent='Please enter a valid work email address for your organisation.';message.classList.add('error');emailInput.focus();return}
  const endpoint=window.DATALOGOS_LIBRARY_ENDPOINT;
  if(!endpoint){message.textContent='The library request form is ready for connection. Access requests are not being sent yet; please contact hello@aidentity.uk.';message.classList.add('notice');return}
  const submit=form.querySelector('button[type="submit"]');submit.disabled=true;submit.setAttribute('aria-busy','true');
  try{
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fullName,company,email})});
    if(!response.ok)throw new Error('Request failed');
    message.textContent='Thank you. Your request has been received and will be reviewed.';message.classList.add('success');form.reset();
  }catch(error){message.textContent='We could not submit your request. Please try again or email hello@aidentity.uk.';message.classList.add('error')}
  finally{submit.disabled=false;submit.removeAttribute('aria-busy')}
});
