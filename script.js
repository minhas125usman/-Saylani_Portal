const DB={attendance:'smit_attendance',fees:'smit_fees',courses:'smit_courses',profile:'smit_profile'}
function read(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
function el(s){return document.querySelector(s)}
function qAll(s){return Array.from(document.querySelectorAll(s))}
function seedDefaults(){
  if(!localStorage.getItem(DB.attendance)){
    const total=53,present=48,arr=[]
    const today=new Date().toISOString().slice(0,10)
    for(let i=0;i<present;i++)arr.push({name:`Student ${i+1}`,status:'present',date:today})
    for(let i=0;i<total-present;i++)arr.push({name:`Student A${i+1}`,status:'absent',date:today})
    write(DB.attendance,arr)
  }
  if(!localStorage.getItem(DB.courses))write(DB.courses,[{title:'Modern Web Application Development',code:'WMA'}])
  if(!localStorage.getItem(DB.fees))write(DB.fees,[{month:'Nov 2025',name:'M. Usman Minhas',amount:1000,date:'2025-11-08',voucher:'202511373098',invoice:'10033303912530500952',status:'PAID'}])
  if(!localStorage.getItem(DB.profile))write(DB.profile,{name:'M. Usman Minhas',email:'',phone:'0300-9214479',cnic:'42301-7909592-1',bio:'Student, learning Web & Mobile development'})
}
function addAttendance(it){const a=read(DB.attendance);a.unshift(it);write(DB.attendance,a)}
function removeAttendance(i){const a=read(DB.attendance);a.splice(i,1);write(DB.attendance,a)}
function addFee(it){const a=read(DB.fees);a.unshift(it);write(DB.fees,a)}
function removeFee(i){const a=read(DB.fees);a.splice(i,1);write(DB.fees,a)}
function addCourse(it){const a=read(DB.courses);a.unshift(it);write(DB.courses,a)}
function removeCourse(i){const a=read(DB.courses);a.splice(i,1);write(DB.courses,a)}
function saveProfile(p){write(DB.profile,p)}
function readProfile(){return JSON.parse(localStorage.getItem(DB.profile)||'null')}
function esc(s){if(!s&&s!==0)return'';return String(s).replace(/[&<>"']/g,function(a){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[a]})}
function renderAttendance(){
  const out=el('#attendance-list');if(!out)return
  const items=read(DB.attendance)
  if(!items.length){out.innerHTML='<p>No records yet.</p>';return}
  out.innerHTML=items.map((it,i)=>`<div class="item"><div><strong>${esc(it.name)}</strong> — ${esc(it.status)}<br><small>${esc(it.date)}</small></div><div><button class="btn secondary" data-del-att="${i}">Delete</button></div></div>`).join('')
  qAll('[data-del-att]').forEach(b=>b.addEventListener('click',()=>{removeAttendance(Number(b.getAttribute('data-del-att')));renderAttendance();updateDashboardSummary()}))
}
function renderFees(){
  const out=el('#fees-list');if(!out)return
  const items=read(DB.fees)
  if(!items.length){out.innerHTML='<p>No payments recorded.</p>';return}
  out.innerHTML=items.map((it,i)=>`<div class="item"><div><strong>${esc(it.name)}</strong> — Rs ${Number(it.amount).toFixed(0)}<br><small>${esc(it.date)}</small></div><div><button class="btn secondary" data-del-fee="${i}">Delete</button></div></div>`).join('')
  qAll('[data-del-fee]').forEach(b=>b.addEventListener('click',()=>{removeFee(Number(b.getAttribute('data-del-fee')));renderFees();updateFeeSummary();updateDashboardSummary()}))
}
function renderCourses(){
  const out=el('#courses-list');if(!out)return
  const items=read(DB.courses)
  if(!items.length){out.innerHTML='<p>No courses yet.</p>';return}
  out.innerHTML=items.map((it,i)=>`<div class="item"><div><strong>${esc(it.title)}</strong> — ${esc(it.code)}</div><div><button class="btn secondary" data-del-course="${i}">Delete</button></div></div>`).join('')
  qAll('[data-del-course]').forEach(b=>b.addEventListener('click',()=>{removeCourse(Number(b.getAttribute('data-del-course')));renderCourses();updateDashboardSummary()}))
}
function renderProfile(){
  const out=el('#profile-preview');if(!out)return
  const p=readProfile()
  if(!p){out.innerHTML='<p>No profile saved yet.</p>';return}
  out.innerHTML=`<h3>${esc(p.name||'')}</h3><p><strong>Email:</strong> ${esc(p.email||'')}</p><p><strong>Phone:</strong> ${esc(p.phone||'')}</p><p><strong>CNIC:</strong> ${esc(p.cnic||'')}</p><p>${esc(p.bio||'')}</p>`
  const sn=el('#sidebar-name');const av=el('#sidebar-avatar')
  if(sn)sn.textContent=p.name||'User'
  if(av)av.textContent=(p.name||'U').slice(0,1)
}
function updateFeeSummary(){const totalEl=el('#fees-total');if(!totalEl)return;const sum=read(DB.fees).reduce((s,it)=>s+Number(it.amount||0),0);totalEl.textContent=`Rs ${sum.toFixed(0)}`
}
function updateDashboardSummary(){
  const a=read(DB.attendance).length
  const total=read(DB.attendance).length||0
  const f=read(DB.fees).length
  const c=read(DB.courses).length
  const p=readProfile()
  const dashA=el('#att-display');if(dashA)dashA.textContent=`${a}/${total}`
  const dashF=el('#assign-display');if(dashF)dashF.textContent=`${0}`
  const dashC=el('#dash-courses-summary');if(dashC)dashC.textContent=`${c} course(s)`
  const prog=el('#course-progress');const pct=el('#course-percent');if(prog)prog.style.width='39%';if(pct)pct.textContent='39%'
  const psum=el('#progress-summary');if(psum)psum.textContent=`${c} course(s) • ${f} payments • ${a} attendance records`
}
function renderFeeTable(){
  const tbody=el('#fees-tbody');if(!tbody)return
  const items=read(DB.fees)
  tbody.innerHTML=items.map(it=>`<tr><td>${esc(it.month||'')}</td><td>Rs: ${Number(it.amount||0).toFixed(0)}</td><td>${esc(it.date||'')}</td><td>${esc(it.voucher||'')}</td><td>${esc(it.invoice||'')}</td><td>${esc(it.status||'')}</td></tr>`).join('')
}
function renderCalendar(){
  const wk=el('#calendar-week');if(!wk)return
  const names=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];const now=new Date();const out=[]
  for(let i=0;i<7;i++){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-now.getDay()+i);out.push(`<button class="day${d.toDateString()===now.toDateString()?' active':''}">${names[i]} ${String(d.getDate()).padStart(2,'0')}</button>`)}
  wk.innerHTML=out.join('')
}
document.addEventListener('DOMContentLoaded',function(){
  seedDefaults()
  renderAttendance();renderFees();renderCourses();renderProfile();updateFeeSummary();updateDashboardSummary();renderFeeTable();renderCalendar()
  const attForm=el('#attendance-form');if(attForm)attForm.addEventListener('submit',function(e){e.preventDefault();const name=el('#att-name').value.trim();const status=el('#att-status').value;const date=el('#att-date').value;if(!name||!date){alert('Please fill name and date');return}addAttendance({name,status,date});attForm.reset();renderAttendance();updateDashboardSummary()})
  const feesForm=el('#fees-form');if(feesForm)feesForm.addEventListener('submit',function(e){e.preventDefault();const name=el('#fee-name').value.trim();const amount=Number(el('#fee-amount').value);const date=el('#fee-date').value;const month=el('#fee-month').value.trim();const voucher=el('#fee-voucher').value.trim();const invoice=el('#fee-invoice').value.trim();const status=el('#fee-status').value;if(!name||!amount||!date){alert('Please fill all fields');return}addFee({month,name,amount,date,voucher,invoice,status});feesForm.reset();renderFees();updateFeeSummary();updateDashboardSummary();renderFeeTable()})
  const courseForm=el('#course-form');if(courseForm)courseForm.addEventListener('submit',function(e){e.preventDefault();const title=el('#course-title').value.trim();const code=el('#course-code').value.trim();if(!title||!code){alert('Please fill both');return}addCourse({title,code});courseForm.reset();renderCourses();updateDashboardSummary()})
  const profileForm=el('#profile-form');if(profileForm){const nameIn=el('#prof-name'),emailIn=el('#prof-email'),phoneIn=el('#prof-phone'),cnicIn=el('#prof-cnic'),bioIn=el('#prof-bio');const p=readProfile();if(p){nameIn.value=p.name||'';emailIn.value=p.email||'';phoneIn.value=p.phone||'';cnicIn.value=p.cnic||'';bioIn.value=p.bio||''}profileForm.addEventListener('submit',function(e){e.preventDefault();const p={name:nameIn.value.trim(),email:emailIn.value.trim(),phone:phoneIn.value.trim(),cnic:cnicIn.value.trim(),bio:bioIn.value.trim()};saveProfile(p);renderProfile();updateDashboardSummary();alert('Profile saved')})}
  qAll('.nav-link').forEach(a=>a.addEventListener('click',function(e){e.preventDefault();qAll('.nav-link').forEach(n=>n.classList.remove('active'));this.classList.add('active');const t=this.getAttribute('data-target');qAll('[data-page]').forEach(p=>p.hidden=true);const page=el(`#${t}`);if(page)page.hidden=false;const title=(this.textContent||'').trim();const crumb=el('#crumb-title');if(crumb)crumb.textContent=title;if(window.innerWidth<=1000){el('#sidebar').classList.remove('open')}}))
  const openBtn=el('#open-sidebar'),closeBtn=el('#close-sidebar');if(openBtn)openBtn.addEventListener('click',()=>el('#sidebar').classList.add('open'));if(closeBtn)closeBtn.addEventListener('click',()=>el('#sidebar').classList.remove('open'))
})
