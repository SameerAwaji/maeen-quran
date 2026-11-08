
/* ============ ثوابت ============ */
const SURAHS="الفاتحة:7|البقرة:286|آل عمران:200|النساء:176|المائدة:120|الأنعام:165|الأعراف:206|الأنفال:75|التوبة:129|يونس:109|هود:123|يوسف:111|الرعد:43|إبراهيم:52|الحجر:99|النحل:128|الإسراء:111|الكهف:110|مريم:98|طه:135|الأنبياء:112|الحج:78|المؤمنون:118|النور:64|الفرقان:77|الشعراء:227|النمل:93|القصص:88|العنكبوت:69|الروم:60|لقمان:34|السجدة:30|الأحزاب:73|سبأ:54|فاطر:45|يس:83|الصافات:182|ص:88|الزمر:75|غافر:85|فصلت:54|الشورى:53|الزخرف:89|الدخان:59|الجاثية:37|الأحقاف:35|محمد:38|الفتح:29|الحجرات:18|ق:45|الذاريات:60|الطور:49|النجم:62|القمر:55|الرحمن:78|الواقعة:96|الحديد:29|المجادلة:22|الحشر:24|الممتحنة:13|الصف:14|الجمعة:11|المنافقون:11|التغابن:18|الطلاق:12|التحريم:12|الملك:30|القلم:52|الحاقة:52|المعارج:44|نوح:28|الجن:28|المزمل:20|المدثر:56|القيامة:40|الإنسان:31|المرسلات:50|النبأ:40|النازعات:46|عبس:42|التكوير:29|الانفطار:19|المطففين:36|الانشقاق:25|البروج:22|الطارق:17|الأعلى:19|الغاشية:26|الفجر:30|البلد:20|الشمس:15|الليل:21|الضحى:11|الشرح:8|التين:8|العلق:19|القدر:5|البينة:8|الزلزلة:8|العاديات:11|القارعة:11|التكاثر:8|العصر:3|الهمزة:9|الفيل:5|قريش:4|الماعون:7|الكوثر:3|الكافرون:6|النصر:3|المسد:5|الإخلاص:4|الفلق:5|الناس:6".split("|").map(s=>{const[n,a]=s.split(":");return{n,a:+a}});
const GR={5:"ممتاز",4:"جيد جداً",3:"جيد",2:"مقبول",1:"إعادة"};
const ATT={present:"حاضر",late:"متأخر",absent:"غائب",excused:"مستأذن"};
const ATT_CLS={present:"p-ok",late:"p-warn",absent:"p-bad",excused:"p-info"};
const KIND={hifz:"حفظ جديد",murajaa:"مراجعة",tilawa:"تلاوة",tafsir:"تفسير",program:"برنامج",other:"أخرى"};
const TRACK={hifz:"مسار الحفظ",tilawa:"مسار التلاوة"};
const ROLE={director:"مدير البرنامج",admin:"مشرف عام",supervisor:"مشرف حلقات",teacher:"معلم",assistant:"معلم مساعد",examiner:"مُختبِر",student:"طالب",parent:"ولي أمر"};
const STAFF_ROLES=["director","admin","supervisor","teacher","assistant","examiner"];
const PERM_GROUPS=[
 ["الطلاب والأعضاء",[["view.students","عرض الطلاب وملفاتهم"],["students.edit","إضافة الطلاب وتعديل بياناتهم وملاحظاتهم الثابتة"],["members.approve","اعتماد تسجيل الطلاب الجدد"],["members.manage","إدارة كل الأعضاء وأدوارهم وحذفهم"],["circles.manage","إنشاء الحلقات وتعديلها وتوزيع الطلاب"]]],
 ["المتابعة والتعليم",[["daily.log","التحضير وتسجيل المتابعة اليومية ووضع التسميع"],["logs.delete","حذف سجلات المتابعة"],["plans.edit","تعديل الخطط وخريطة الحفظ"],["tasks.edit","إسناد المهام وتعديلها"],["sessions.manage","إدارة مواعيد التسميع"],["programs.manage","إدارة البرامج المصاحبة ودروسها"],["recits.review","تقييم التسميع الصوتي"],["notes.private","رؤية الملاحظات الداخلية وكتابتها"]]],
 ["الاختبارات والشهادات",[["exams.manage","تسجيل الاختبارات وتعديلها"],["certs.issue","إصدار الشهادات وحذفها"]]],
 ["التقارير والإدارة",[["reports.view","عرض التقارير"],["reports.export","تنزيل التقارير ونسخها"],["admin.dashboard","لوحة المشرف ومقارنة الحلقات"],["tatt.manage","تسجيل حضور المعلمين"],["settings.manage","إعدادات الحلقة والخصوصية"],["ui.customize","تخصيص الواجهة: القوائم والمسميات والألوان"]]]];
const PERMS=PERM_GROUPS.flatMap(g=>g[1]);
const ALLP=PERMS.map(p=>p[0]);
const DEF_PERMS={
 admin:{scope:"all",perms:ALLP},
 supervisor:{scope:"circles",perms:["view.students","students.edit","members.approve","daily.log","logs.delete","plans.edit","tasks.edit","sessions.manage","programs.manage","recits.review","notes.private","exams.manage","certs.issue","reports.view","reports.export","admin.dashboard","tatt.manage"]},
 teacher:{scope:"own",perms:["view.students","students.edit","members.approve","circles.manage","daily.log","plans.edit","tasks.edit","sessions.manage","programs.manage","recits.review","notes.private","exams.manage","certs.issue","reports.view","reports.export"]},
 assistant:{scope:"circles",perms:["view.students","daily.log","tasks.edit","sessions.manage","recits.review","reports.view"]},
 examiner:{scope:"all",perms:["view.students","exams.manage","certs.issue","reports.view"]}};
const SCOPE={all:"كل الطلاب",circles:"حلقاته المسندة",own:"طلابه وحلقاته فقط"};
const TAJWEED=["المدود","الغنة","النون الساكنة والتنوين","الميم الساكنة","القلقلة","مخارج الحروف","صفات الحروف","التفخيم والترقيق","الوقف والابتداء","اللامات"];
const PKIND={tafsir:"تفسير",tajweed:"تجويد",mutoon:"متون",tadabbur:"تدبر",sira:"سيرة",other:"عام"};
const DAYS=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const DEF_CFG={circleName:"حلقة القرآن الكريم",leaderboard:false,showPoints:true,parentsEnabled:true,studentSeeGrades:true,studentSeeNotes:true,studentSeeReport:true,parentSeeReport:true,parentSeeNotes:true};
const LOGO_MARK="data:image/png;base64,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";
const LOGO_FULL="data:image/png;base64,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";
const STAR=`<svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="22" height="22" rx="2"/><rect x="9" y="9" width="22" height="22" rx="2" transform="rotate(45 20 20)"/></g><circle cx="20" cy="20" r="4" fill="currentColor"/></svg>`;
const ICON={sun:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,moon:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,gear:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>`,up:"↑",down:"↓",xls:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8l6 8M15 8l-6 8"/></svg>`,pdf:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 14h8M8 17h5"/></svg>`,check:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5 9-10"/></svg>`,video:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-4v12l-6-4"/></svg>`,cal:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`};

/* ============ أدوات ============ */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad=n=>String(n).padStart(2,"0");
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>ymd(new Date());
const addDays=(s,n)=>{const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return ymd(d)};
const dow=s=>new Date(s+"T12:00:00").getDay();
const LOC="ar-SA-u-ca-gregory-nu-latn";
const fmtD=(s,o={weekday:"long",day:"numeric",month:"long"})=>new Intl.DateTimeFormat(LOC,o).format(new Date(s+"T12:00:00"));
const fmtShort=s=>fmtD(s,{weekday:"short",day:"numeric",month:"short"});
const hijri=d=>{try{return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura-nu-latn",{day:"numeric",month:"long",year:"numeric"}).format(d)}catch(e){return""}};
const fmtDT=iso=>new Intl.DateTimeFormat(LOC,{weekday:"long",day:"numeric",month:"long",hour:"numeric",minute:"2-digit"}).format(new Date(iso));
const fmtT=iso=>new Intl.DateTimeFormat(LOC,{hour:"numeric",minute:"2-digit"}).format(new Date(iso));
const gen=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const initials=n=>String(n||"؟").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join(" ");
const monthRange=m=>{const[y,mo]=m.split("-").map(Number);const last=new Date(y,mo,0).getDate();return[`${m}-01`,`${m}-${pad(last)}`]};
const monthName=m=>new Intl.DateTimeFormat(LOC,{month:"long",year:"numeric"}).format(new Date(m+"-15T12:00:00"));
const toLocalInput=iso=>{const d=new Date(iso);return `${ymd(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`};
const n0=v=>Number(v)||0;
const nS=l=>(l.noteStudent??l.note??"")||"";
const nP=l=>(l.noteParent??l.note??"")||"";
function notesCell(l,who){
  const tj=(l.tajweed||[]).length?`<span class="small" style="color:var(--warn)">تجويد: ${esc(l.tajweed.join("، "))}</span><br>`:"";
  const tn=l.tajweedNote?esc(l.tajweedNote)+"<br>":"";
  if(who==="staff")return tj+tn+[[nS(l),"للطالب","p-pri"],[nP(l),"لولي الأمر","p-acc"],[can(me(),"notes.private")?l.noteStaff:"","داخلية","p-warn"]].filter(x=>x[0]).map(([t,lb,c])=>`<span class="pill ${c}">${lb}</span> ${esc(t)}`).join("<br>");
  return tj+tn+esc(who==="parent"?nP(l):nS(l));
}
const firstName=n=>{const w=String(n||"").replace(/^(أ\.|أ\/|الأستاذ|الشيخ|د\.)\s*/,"").trim().split(/\s+/);return w[0]||n};

/* ============ الحالة والتخزين ============ */
const COLS=["members","tasks","logs","sessions","programs","progress","config","circles","exams","certs","recits","tatt"];
const LIVE={},DEMO={};COLS.forEach(c=>{LIVE[c]=[];DEMO[c]=[]});
let S=LIVE, MODE="loading", PREV="loading", DB=null, USER=null, UID=null, OWNER=false, ASSETS=null, DL=null, SLOW=false;
const READY=new Set();
const ui={mpage:1,tasmee:false,mstu:"",marks:{},msurah:null,cmode:"month",ptab:"programs",wk:null,skind:"all",pm:"this",from:null,to:null,rtype:"students",circle:"all",cid:null,view:null,sid:null,stab:"plan",date:today(),month:today().slice(0,7),pid:null,q:"",track:"all",teacher:"all",demoAs:null,rsid:null};
const chains={};
let modalCtx=null,modalPresetCircle="";

const DRAFT={};
const get=(c,id)=>{if(c==="config"&&Object.prototype.hasOwnProperty.call(DRAFT,id))return DRAFT[id]?{...DRAFT[id],id}:undefined;return S[c].find(x=>x.id===id)};
function stageConfig(id,data){DRAFT[id]=data?{...data}:null;render()}
const hasDrafts=()=>Object.keys(DRAFT).length>0;
function saveDrafts(){Object.entries(DRAFT).forEach(([id,d])=>{if(d===null)del("config",id);else put("config",id,d)});Object.keys(DRAFT).forEach(k=>delete DRAFT[k]);toast("حُفظت التعديلات");render()}
function discardDrafts(){Object.keys(DRAFT).forEach(k=>delete DRAFT[k]);toast("أُلغيت التعديلات");render()}
window.addEventListener("beforeunload",e=>{if(hasDrafts()){e.preventDefault();e.returnValue=""}});
function local(c,id,data){const a=S[c];const i=a.findIndex(x=>x.id===id);if(data===null){if(i>=0)a.splice(i,1)}else{const o={...data,id};if(i>=0)a[i]=o;else a.push(o)}}
function put(c,id,data){
  data={...data};delete data.id;data.updatedAt=Date.now();
  local(c,id,data);render();
  if(MODE!=="live")return Promise.resolve();
  const k=c+"/"+id;
  chains[k]=(chains[k]||Promise.resolve()).then(()=>remotePut(c,id,data)).catch(e=>{console.error(e);toast(errMsg(e,"تعذّر الحفظ"),"err");reloadTable(c)});
  return chains[k];
}
function patch(c,id,p){const cur=get(c,id)||{};return put(c,id,{...cur,...p})}
function del(c,id){local(c,id,null);render();if(MODE!=="live")return;const k=c+"/"+id;chains[k]=(chains[k]||Promise.resolve()).then(()=>remoteDel(c,id)).catch(e=>{console.error(e);toast(errMsg(e,"تعذّر الحذف"),"err");reloadTable(c)})}
const cfg=()=>({...DEF_CFG,...(get("config","main")||{})});

/* ============ الأدوار ============ */
function me(){if(MODE==="demo")return get("members",ui.demoAs);return S.members.find(m=>m.uid&&m.uid===UID)}
const isOwnerM=m=>false;
const isStaff=m=>m&&m.status==="active"&&(STAFF_ROLES.includes(m.role)||isOwnerM(m));
function roleCfg(r){const P=get("config","perms");const base=DEF_PERMS[r]||{scope:"own",perms:[]};const o=P&&P.roles&&P.roles[r];return{scope:(o&&o.scope)||base.scope,attScope:(o&&o.attScope)||base.attScope||"data",perms:o&&o.perms?{...Object.fromEntries(ALLP.map(k=>[k,base.perms.includes(k)])),...o.perms}:Object.fromEntries(ALLP.map(k=>[k,base.perms.includes(k)]))}}
function can(m,k){if(!m)return false;if(isOwnerM(m)||m.role==="director")return true;if(k==="perms.manage")return false;if(!isStaff(m))return false;const ov=(m.permOverrides||{})[k];if(ov===true||ov===false)return ov;return !!roleCfg(m.role).perms[k]}
function scopeOf(m){if(!m)return"own";if(isOwnerM(m)||m.role==="director")return"all";return m.scopeOverride||roleCfg(m.role).scope}
const isAdmin=m=>!!m&&isStaff(m)&&scopeOf(m)==="all";
function attScopeOf(m){if(!m)return"data";if(isOwnerM(m)||m.role==="director")return"data";return m.attScopeOverride||roleCfg(m.role).attScope||"data"}
const attRestricted=m=>attScopeOf(m)==="circle";
function inMyCircles(m,s){const c=get("circles",s.circleId);return !!c&&((m.circleIds||[]).includes(c.id)||c.teacherId===m.id)}
function canAttend(m,s){if(!can(m,"daily.log"))return false;if(!s)return true;if(!inScope(m,s))return false;return attScopeOf(m)==="circle"?inMyCircles(m,s):true}
function inScope(m,s){const sc=scopeOf(m);if(sc==="all")return true;const c=get("circles",s.circleId);if(sc==="circles"&&(m.circleIds||[]).includes(s.circleId))return true;return s.teacherId===m.id||(c&&c.teacherId===m.id)}
const teachers=()=>S.members.filter(m=>m.status==="active"&&["teacher","supervisor","admin","director"].includes(m.role));
const allStudents=()=>S.members.filter(m=>m.role==="student"&&m.status==="active").sort((a,b)=>a.name.localeCompare(b.name,"ar"));
function myStudents(m){m=m||me();let st=allStudents().filter(s=>inScope(m,s));if(isAdmin(m)&&ui.teacher!=="all")st=st.filter(s=>s.teacherId===ui.teacher);return st}
const nameOf=id=>(get("members",id)||{}).name||"—";
const sessStu=s=>s.circleId&&get("circles",s.circleId)?circleStudents(s.circleId).map(x=>x.id):(s.studentIds&&s.studentIds.length?s.studentIds:(s.studentId?[s.studentId]:[]));
const isGroup=s=>!!s.circleId||(s.studentIds||[]).length>1;
const sessTitle=s=>s.circleId&&get("circles",s.circleId)?"حلقة: "+get("circles",s.circleId).name:(s.studentIds||[]).length>1?`مجموعة (${s.studentIds.length}): `+s.studentIds.map(nameOf).join("، "):nameOf(sessStu(s)[0]);
const circleStudents=cid=>allStudents().filter(x=>x.circleId===cid);
function myCircles(m){m=m||me();if(isStaff(m))return S.circles.filter(c=>isAdmin(m)||c.teacherId===m.id||(scopeOf(m)==="circles"&&(m.circleIds||[]).includes(c.id))).sort((a,b)=>a.name.localeCompare(b.name,"ar"));if(m.role==="student")return S.circles.filter(c=>c.id===m.circleId);return S.circles.filter(c=>(m.childIds||[]).some(id=>(get("members",id)||{}).circleId===c.id))}
const scoped=m=>{const st=myStudents(m);return ui.circle==="all"?st:st.filter(s=>s.circleId===ui.circle)};
function groupHTML(st,fn,cls,headFn){
  const by={};st.forEach(s=>{const k=s.circleId&&get("circles",s.circleId)?s.circleId:"";(by[k]=by[k]||[]).push(s)});
  const keys=Object.keys(by).sort((a,b)=>!a?1:!b?-1:get("circles",a).name.localeCompare(get("circles",b).name,"ar"));
  const single=keys.length===1&&!keys[0];
  return `<div class="stack" style="gap:22px">${keys.map(k=>{const c=k?get("circles",k):null;const acts=headFn?headFn(c,k||"none"):"";
    return `<section class="cgroup">${single?(acts?`<div class="row">${acts}</div>`:""):`<div class="cg-h"><div><h2>${c?esc(c.name):"بدون حلقة"}</h2><span class="small muted">${c?esc(nameOf(c.teacherId))+" · ":""}${by[k].length} طالب${c&&(c.days||[]).length?" · "+c.days.map(x=>DAYS[x]).join("، "):""}${c&&c.time?" · "+esc(c.time):""}</span></div>${acts?`<div class="row">${acts}</div>`:""}</div>`}<div class="${cls}">${by[k].map(fn).join("")}</div></section>`}).join("")}</div>`;
}
function circleFilter(m){const cs=myCircles(m);if(!cs.length)return"";return `<select data-change="circle" id="cf">${[["all","كل الحلقات"],...cs.map(c=>[c.id,c.name])].map(([k,l])=>`<option value="${k}" ${ui.circle===k?"selected":""}>${esc(l)}</option>`).join("")}</select>`}
const DAYCODES=["SU","MO","TU","WE","TH","FR","SA"];
const platName=u=>{u=String(u||"").toLowerCase();return u.includes("zoom.")?"Zoom":u.includes("meet.google")?"Meet":u.includes("teams.")?"Teams":"الاجتماع"};
const hasTime=c=>!!(c&&(c.days||[]).length&&c.time);
const schedTxt=c=>{const d=(c.days||[]).map(x=>DAYS[x]).join("، ");if(!d&&!c.time)return"حلقة دائمة بدون وقت محدد";return (d||"")+(c.time?(d?" · ":"")+"الساعة "+esc(c.time):"")+(c.time&&c.duration?` (${c.duration} دقيقة)`:"")};
function circleCal(c){const t=c.time||"17:00";let d=today();for(let i=0;i<7;i++){if((c.days||[]).includes(dow(d)))break;d=addDays(d,1)}
  const st=new Date(d+"T"+t+":00"),en=new Date(st.getTime()+n0(c.duration||60)*60000);const f=x=>x.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(c.name)}&dates=${f(st)}/${f(en)}&details=${encodeURIComponent(`${cfg().circleName}${c.meetLink?"\nرابط "+platName(c.meetLink)+": "+c.meetLink:""}`)}&location=${encodeURIComponent(c.meetLink||"")}${(c.days||[]).length?"&recur="+encodeURIComponent("RRULE:FREQ=WEEKLY;BYDAY="+c.days.map(x=>DAYCODES[x]).join(",")):""}`}
const teacherOf=s=>get("members",s.teacherId);
function canSeeStudent(m,sid){if(isStaff(m))return true;if(m.role==="student")return m.id===sid;if(m.role==="parent")return (m.childIds||[]).includes(sid);return false}

/* ============ حسابات ============ */
const logsOf=(sid,from,to)=>S.logs.filter(l=>l.studentId===sid&&(!from||l.date>=from)&&(!to||l.date<=to)).sort((a,b)=>a.date<b.date?1:-1);
const tasksOf=(sid,from,to)=>S.tasks.filter(t=>t.studentId===sid&&(!from||t.date>=from)&&(!to||t.date<=to));
function stats(sid,from,to){
  const L=logsOf(sid,from,to),T=tasksOf(sid,from,to);
  const c={present:0,late:0,absent:0,excused:0};L.forEach(l=>{if(c[l.attendance]!=null)c[l.attendance]++});
  const counted=c.present+c.late+c.absent;
  const grades=[];L.forEach(l=>[l.newGrade,l.revGrade,l.tGrade].forEach(g=>{if(n0(g))grades.push(n0(g))}));
  const avg=grades.length?grades.reduce((a,b)=>a+b,0)/grades.length:0;
  const excellent=grades.filter(g=>g===5).length;
  const done=T.filter(t=>t.done).length;
  const sess=S.sessions.filter(s=>sessStu(s).includes(sid)&&s.status==="done"&&s.start.slice(0,10)>=from&&s.start.slice(0,10)<=to).length;
  return{logs:L,att:c,rate:counted?Math.round((c.present+c.late)/counted*100):null,
    newPages:L.reduce((a,l)=>a+n0(l.newPages),0),revPages:L.reduce((a,l)=>a+n0(l.revPages),0),
    tPages:L.reduce((a,l)=>a+n0(l.tPages),0),errJ:L.reduce((a,l)=>a+n0(l.errJali),0),errK:L.reduce((a,l)=>a+n0(l.errKhafi),0),
    avg,tasks:T.length,done,sess,points:done+2*(c.present+c.late)+3*excellent};
}
function streak(sid){let d=today(),n=0;for(let i=0;i<60;i++){const T=S.tasks.filter(t=>t.studentId===sid&&t.date===d);if(T.length){if(T.every(t=>t.done))n++;else if(i>0)break}d=addDays(d,-1)}return n}
function totalPages(s){const p=s.plan||{};const L=logsOf(s.id);return n0(p.basePages)+(s.track==="tilawa"?L.reduce((a,l)=>a+n0(l.tPages),0):L.reduce((a,l)=>a+n0(l.newPages),0))}
const gradeTxt=g=>n0(g)?GR[Math.round(n0(g))]:"—";
const gradeCls=g=>{g=n0(g);return g>=4.5?"p-ok":g>=3.5?"p-pri":g>=2.5?"p-acc":g?"p-bad":""};
function amountTxt(l){
  const out=[];
  if(l.newSurah||n0(l.newPages))out.push(`حفظ: ${esc(l.newSurah||"")} ${l.newFrom?esc(l.newFrom)+"–"+esc(l.newTo||""):""}${n0(l.newPages)?` (${l.newPages} وجه)`:""}`);
  if(l.revDesc||n0(l.revPages))out.push(`مراجعة: ${esc(l.revDesc||"")}${n0(l.revPages)?` (${l.revPages} وجه)`:""}`);
  if(l.tSurah||n0(l.tPages))out.push(`تلاوة: ${esc(l.tSurah||"")} ${l.tFrom?esc(l.tFrom)+"–"+esc(l.tTo||""):""}${n0(l.tPages)?` (${l.tPages} وجه)`:""}`);
  return out.join(" · ")||"—";
}
function gcal(s){
  const f=d=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  const st=new Date(s.start),en=new Date(st.getTime()+n0(s.duration||30)*60000);
  const t=isGroup(s)?`${sessTitle(s)} — ${nameOf(s.teacherId)}`:`تسميع: ${nameOf(sessStu(s)[0])} مع ${nameOf(s.teacherId)}`;
  const det=`موعد تسميع — ${cfg().circleName}${s.link?"\nرابط "+platName(s.link)+": "+s.link:""}${s.note?"\n"+s.note:""}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t)}&dates=${f(st)}/${f(en)}&details=${encodeURIComponent(det)}&location=${encodeURIComponent(s.link||"")}`;
}
function sessState(s){const now=Date.now(),st=new Date(s.start).getTime(),en=st+n0(s.duration||30)*60000;if(s.status!=="confirmed")return s.status;if(now>=st-10*60000&&now<=en)return"live";if(now>en)return"past";return"upcoming"}
const SESS_LBL={requested:["بانتظار التأكيد","p-warn"],confirmed:["مؤكد","p-pri"],done:["تم التسميع","p-ok"],cancelled:["ملغى","p-bad"],missed:["لم يحضر","p-bad"]};

/* ============ واجهة عامة ============ */
function toast(msg,kind){const t=$("#toast");t.innerHTML=`<div class="toast ${kind||""}">${esc(msg)}</div>`;clearTimeout(toast._t);toast._t=setTimeout(()=>t.innerHTML="",3800)}
function openModal(title,body,form,ctx,submitLbl="حفظ",extraFoot=""){
  modalCtx=ctx||{};
  setTimeout(()=>{applyPerms($("#modal"));applyReplace($("#modal"))},0);
  $("#modal").innerHTML=`<div class="modal" data-act="backdrop"><form class="dlg" data-form="${form}" autocomplete="off"><div class="dlg-h"><h3>${title}</h3><button type="button" class="btn ghost sm" data-act="close" aria-label="إغلاق">✕</button></div><div class="dlg-b">${body}</div><div class="dlg-f"><button class="btn pri" type="submit">${submitLbl}</button><button type="button" class="btn" data-act="close">إلغاء</button>${extraFoot}</div></form></div>`;
  const f=$("#modal input:not([type=hidden]),#modal select,#modal textarea");if(f&&window.innerWidth>700)f.focus();
}
const closeModal=()=>{$("#modal").innerHTML="";modalCtx=null};
const sel=(name,opts,v,extra="")=>`<select name="${name}" id="f-${name}" ${extra}>${opts.map(([k,l])=>`<option value="${esc(k)}" ${String(k)===String(v??"")?"selected":""}>${esc(l)}</option>`).join("")}</select>`;
const fld=(label,html,hint)=>`<label class="f">${label}${html}${hint?`<span class="hint">${hint}</span>`:""}</label>`;
const inp=(name,v,type="text",extra="")=>`<input name="${name}" id="f-${name}" type="${type}" value="${esc(v??"")}" ${extra}>`;
const surahSel=(name,v)=>sel(name,[["","— اختر السورة —"],...SURAHS.map(s=>[s.n,s.n])],v);
const gradeSel=(name,v)=>sel(name,[["","—"],...[5,4,3,2,1].map(g=>[g,GR[g]])],v);
const empty=(t)=>`<div class="empty">${t}</div>`;
const kindTag=k=>`<span class="kind k-${k}">${KIND[k]||k}</span>`;
const pbar=(v,max)=>{const p=max?Math.min(100,Math.round(v/max*100)):0;return `<div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div>`};

/* ============ الهيكل ============ */
function navFor(m){return orderNav(m,baseNav(m))}
function baseNav(m){
  const c=cfg();
  if(isStaff(m)){const NP={custom:"ui.customize",students:"view.students",circles:"view.students",daily:"daily.log",reports:"reports.view",admin:"admin.dashboard",perms:"perms.manage"};
    return [["home","الرئيسية"],["daily","السجل اليومي"],["students","الطلاب"],["circles","الحلقات"],["sessions","المواعيد"],["programs","البرامج"],["reports","التقارير"],["board","لوحة الشرف"],["mushaf","المصحف"],["admin","لوحة المشرف"],["perms","الهيكل والصلاحيات"],["custom","التخصيص"],["settings",can(m,"members.manage")||can(m,"settings.manage")?"الإدارة":"حسابي"]].filter(([k])=>!NP[k]||can(m,NP[k]))}
  if(m.role==="student")return[["today","يومي"],["plan","خطتي"],["mushaf","المصحف"],["recite","التسميع"],["programs","البرامج"],["sessions","المواعيد"],["record","سجلي"],...(c.leaderboard?[["board","لوحة الشرف"]]:[])];
  if(m.role==="parent")return[["child","أبنائي"],["notes","الملاحظات"],["sessions","المواعيد"],["mushaf","المصحف"],...(c.leaderboard?[["board","لوحة الشرف"]]:[])];
  return[];
}
function header(m){
  const c=cfg();
  const nav=m&&m.status==="active"?navFor(m):[];
  if(m&&nav.length&&!nav.some(n=>n[0]===ui.view)&&!["student","report","program","circle","more"].includes(ui.view))ui.view=nav[0][0];
  if(isApp(m))return `${MODE==="demo"?demoBar():""}<header class="top app-top"><div class="wrap"><div class="top-in"><div class="brand">${brand().hideLogo?"":`<img class="logo" src="${LOGO_MARK}" alt="الشعار">`}<div style="min-width:0">${brand().tagline?`<div class="b-par">${esc(brand().tagline)}</div>`:""}<div class="b-name">${esc(c.circleName)}</div></div></div><div class="row" style="gap:6px;flex:none"><span class="b-sub app-date">${hijri(new Date())}</span><button class="btn ghost sm themebtn" data-act="themeToggle" aria-label="${isDark()?"الوضع الفاتح":"الوضع الليلي"}">${isDark()?ICON.sun:ICON.moon}</button></div></div>
  <nav class="nav app-nav" aria-label="الأقسام">${nav.map(([k,l])=>`<button data-act="go" data-v="${k}" class="${ui.view===k||(k==="programs"&&ui.view==="program")||(k==="child"&&ui.view==="report")?"on":""}"><span class="ni">${NAVICON[k]||""}</span>${esc(l)}</button>`).join("")}</nav></div></header>`;
  return `${MODE==="demo"?demoBar():""}<header class="top"><div class="wrap"><div class="top-in"><div class="brand">${brand().hideLogo?"":`<img class="logo" src="${LOGO_MARK}" alt="الشعار">`}<div style="min-width:0">${brand().tagline?`<div class="b-par">${esc(brand().tagline)}</div>`:""}<div class="b-name">${esc(c.circleName)}</div><div class="b-sub">${fmtD(today(),{weekday:"long",day:"numeric",month:"long"})} · ${hijri(new Date())}</div></div></div><div class="who"><button class="btn ghost sm themebtn" data-act="themeToggle" title="${isDark()?"الوضع الفاتح":"الوضع الليلي"}" aria-label="${isDark()?"الوضع الفاتح":"الوضع الليلي"}">${isDark()?ICON.sun:ICON.moon}</button>${m?`<button class="btn ghost sm" data-act="myNav" title="ترتيب قائمتي" aria-label="ترتيب قائمتي">${ICON.gear}</button><span class="role-pill">${ROLE[m.role]||""}</span><span>${esc(m.name)}</span>`:""}</div></div>
  ${nav.length?`<nav class="nav" aria-label="الأقسام">${nav.map(([k,l])=>`<button data-act="go" data-v="${k}" class="${ui.view===k||(k==="students"&&ui.view==="student")||(k==="reports"&&ui.view==="report"&&isStaff(m))||(k==="programs"&&ui.view==="program")||(k==="circles"&&ui.view==="circle")?"on":""}">${l}</button>`).join("")}</nav>`:""}</div></header>`;
}
function demoBar(){
  const opts=S.members.filter(x=>x.status==="active").map(x=>[x.id,`${ROLE[x.role]}: ${x.name}${x.track&&x.role==="student"?" ("+TRACK[x.track]+")":""}`]);
  return `<div class="demo-bar"><div class="wrap"><strong>عرض تجريبي</strong><span class="muted">بيانات وهمية للتجربة، لا تُحفظ.</span><label class="row">اعرض بصفة: <select data-change="demoAs" id="demo-as" style="padding:4px 8px;border-radius:8px;border:1px solid var(--line);background:var(--surface)">${opts.map(([k,l])=>`<option value="${k}" ${k===ui.demoAs?"selected":""}>${esc(l)}</option>`).join("")}</select></label><button class="btn sm" data-act="exitDemo">الخروج من التجربة</button></div></div>`;
}

let lastFocus=null;
function render(){if(DRAG){PENDING=true;return}
  const ae=document.activeElement;const fid=ae&&ae.id&&$("#app").contains(ae)?ae.id:null;const pos=fid&&ae.selectionStart!=null?ae.selectionStart:null;
  applyTerms();applyTheme();try{const _m=MODE==="loading"||MODE==="nodb"?null:me();document.body.classList.toggle("app",isApp(_m));document.body.classList.toggle("staff",!!_m&&isStaff(_m)&&_m.status==="active")}catch(e){}
  $("#app").innerHTML=page();applyPerms($("#app"));applyReplace($("#app"));
  if(fid){const el=document.getElementById(fid);if(el){el.focus();if(pos!=null&&el.setSelectionRange)try{el.setSelectionRange(pos,pos)}catch(e){}}}
}
function page(){
  if(MODE==="loading")return header(null)+`<main class="wrap"><div class="empty">جاري فتح المنصة…</div></main>`;
  if(MODE==="nodb")return header(null)+welcome();
  if(MODE==="auth")return header(null)+authView();
  if(MODE==="live"&&READY.size<COLS.length)return header(null)+`<main class="wrap"><div class="empty">${SLOW?"تعذّر الوصول إلى البيانات حتى الآن. تحقق من اتصالك، وستظهر البيانات تلقائياً عند توفرها.":"جاري تحميل بيانات الحلقة…"}</div></main>`;
  const m=me();
  if(!m)return header(null)+register();
  if(m.status!=="active")return header(m)+pending(m);
  const v=ui.view;
  let body="";
  try{
    if(isStaff(m))body=({home:staffHome,students:studentsView,student:()=>studentDetail(ui.sid),daily:dailyView,more:moreView,circles:circlesView,circle:()=>circleDetail(ui.cid),sessions:sessionsView,programs:programsView,program:()=>programDetail(ui.pid),reports:reportsView,report:()=>reportDetail(ui.rsid,true),board:boardView,settings:settingsView,mushaf:mushafView,admin:adminView,perms:permsView,custom:customView}[v]||staffHome)(m);
    else if(m.role==="student")body=({today:studentToday,plan:()=>juzMapHTML(m,false)+planView(m),recite:reciteView,mushaf:mushafView,programs:programsView,program:()=>programDetail(ui.pid),sessions:sessionsView,record:()=>recordView(m.id),board:boardView,more:moreView}[v]||studentToday)(m);
    else if(m.role==="parent")body=({child:parentView,notes:parentNotes,more:moreView,mushaf:mushafView,sessions:sessionsView,board:boardView,report:()=>reportDetail(ui.rsid,false)}[v]||parentView)(m);
  }catch(e){console.error(e);body=empty("حدث خطأ في عرض هذه الصفحة: "+esc(e.message))}
  return header(m)+`<main class="wrap">${body}</main>`+(hasDrafts()?`<div class="savebar" role="status"><div class="sb-in"><span><b>لديك تعديلات غير محفوظة</b><small>تظهر لك الآن كمعاينة، ولن تُطبَّق على الجميع حتى تضغط حفظ.</small></span><div class="row"><button class="btn pri" data-act="saveDrafts">حفظ التعديلات</button><button class="btn" data-act="discardDrafts">تراجع</button></div></div></div>`:"")+(isApp(m)?bottomBar(m,"appbar"):isStaff(m)?bottomBar(m,"staffbar"):"");
}

/* ============ الترحيب والتسجيل ============ */
function welcome(){
  return `<main class="wrap"><div class="center-page"><img class="welcome-logo" src="${LOGO_FULL}" alt="مَعين"><h1>منصة متابعة الحلقة</h1><p class="muted">خطط الحفظ والتلاوة، المهام اليومية، السجل والتقديرات، البرامج العلمية، ومواعيد التسميع عن بُعد، مع تقارير شهرية لكل طالب.</p>
  <div class="card"><p>${!(window.APP_CONFIG&&window.APP_CONFIG.supabaseUrl)?"لم يُضبط اتصال قاعدة البيانات بعد: ملف <b>config.js</b> المرفوع فارغ أو قديم. ارفع مجلد <b>public</b> الأخير ثم أعد تحميل الصفحة.":!window.supabase?"تعذّر تحميل مكتبة قاعدة البيانات: الملف <b>vendor/supabase.js</b> غير موجود في الموقع المرفوع. ارفع مجلد <b>public</b> كاملاً.":"تعذّر تهيئة الاتصال بقاعدة البيانات."}</p><p class="hint">رمز التشخيص: ${window.APP_CONFIG&&window.APP_CONFIG.supabaseUrl?"cfg✓":"cfg✗"} · ${window.supabase?"lib✓":"lib✗"}</p></div>
  <div class="row"><button class="btn pri" data-act="demo">جرّب العرض التجريبي</button></div></div></main>`;
}
function register(){
  const first=!S.members.length;
  return `<main class="wrap"><div class="center-page"><img class="welcome-logo" src="${LOGO_FULL}" alt="مَعين"><h1>${OWNER?"إعداد المنصة":"التسجيل في المنصة"}</h1>
  <p class="muted">${OWNER?"أنت أول من يسجّل، وستكون مدير البرنامج. بعدها أرسل رابط الموقع للمعلمين والطلاب وأولياء الأمور ليسجّلوا.":"عبّئ بياناتك فقط. بعد اعتماد تسجيلك يتولى المسؤول عن الحسابات إسنادك إلى حلقتك."}</p>
  <form class="card stack" data-form="register">
  <div class="fg">${fld("الاسم الكامل",inp("name",(USERMETA&&USERMETA.name)||"","text","required"))}${OWNER?"":fld("التسجيل بصفة",sel("role",[["student","طالب"],["teacher","معلم"],["parent","ولي أمر"]],"student",`data-change="regRole"`))}</div>
  ${OWNER?"":`<div id="reg-track" class="stack"><b>اختر برنامجك</b><div class="grid g2" style="gap:10px">
   <label class="track-card"><input type="radio" name="track" value="hifz" checked><span><b>برنامج الحفظ</b><span class="small muted">حفظ جديد يومي مع مراجعة منتظمة، وخطة تصل بك إلى هدفك من الأجزاء.</span></span></label>
   <label class="track-card"><input type="radio" name="track" value="tilawa"><span><b>برنامج التلاوة</b><span class="small muted">تصحيح التلاوة وتطبيق أحكام التجويد، مع متابعة الأخطاء ومقدار القراءة.</span></span></label></div></div>
  <div class="fg">${fld("رقم الجوال",inp("phone",(USERMETA&&USERMETA.phone)||"","tel"))}</div>${fld("ملاحظة للمشرف",`<textarea name="note" id="f-note" placeholder="مثال: ولي أمر الطالب عبدالرحمن، أو المحفوظ السابق"></textarea>`)}`}
  <div class="row"><button class="btn pri">${OWNER?"ابدأ":"إرسال طلب التسجيل"}</button><button class="btn" type="button" data-act="logout">تسجيل الخروج</button></div></form></div></main>`;
}
function pending(m){return `<main class="wrap"><div class="center-page"><h1>طلبك قيد المراجعة</h1><p class="muted">سجّلت باسم «${esc(m.name)}» بصفة ${ROLE[m.role]}. سيظهر لك محتواك فور اعتماد المشرف لتسجيلك.</p><div class="row"><button class="btn" data-act="demo">تصفّح العرض التجريبي</button><button class="btn" data-act="logout">تسجيل الخروج</button></div></div></main>`}

/* ============ المعلم: الرئيسية ============ */
function staffHome(m){
  const st=myStudents(m),d=today();
  const L=S.logs.filter(l=>l.date===d&&st.some(s=>s.id===l.studentId));
  const T=S.tasks.filter(t=>t.date===d&&st.some(s=>s.id===t.studentId));
  const sess=S.sessions.filter(s=>s.start.slice(0,10)===d&&sessStu(s).some(id=>st.some(x=>x.id===id))&&s.status!=="cancelled").sort((a,b)=>a.start<b.start?-1:1);
  const req=S.sessions.filter(s=>s.status==="requested"&&sessStu(s).some(id=>st.some(x=>x.id===id)));
  const pend=S.members.filter(x=>x.status==="pending"&&(can(m,"members.manage")||(can(m,"members.approve")&&x.role==="student")));
  const B={};B.hero=`<div class="hero greet pattern"><div>${brand().verse?`<div class="verse">${esc(brand().verse)}</div>`:""}<h1>السلام عليكم، ${esc(firstName(m.name))}</h1><div class="date">${fmtD(d)} · ${hijri(new Date())}</div></div><div class="row"><button class="btn pri" data-act="go" data-v="daily">تسجيل متابعة اليوم</button><button class="btn" data-act="newSession">موعد تسميع</button></div></div>`;
  B.stats=`<div class="stats"><div class="stat"><b>${st.length}</b><span>${isAdmin(m)?"طلاب الحلقة":"طلابي"}</span></div><div class="stat"><b>${L.filter(l=>l.attendance==="present"||l.attendance==="late").length}/${st.length}</b><span>حضور اليوم</span></div><div class="stat"><b>${T.filter(t=>t.done).length}/${T.length}</b><span>مهام اليوم المنجزة</span></div><div class="stat"><b>${sess.length}</b><span>مواعيد اليوم</span></div></div>`;
  B.pending=`${pend.length||req.length?`<div class="card"><div class="card-h"><h2>بانتظار إجراء منك</h2></div><div class="list">
   ${pend.map(x=>`<div class="li"><div class="avatar">${esc(initials(x.name))}</div><div class="grow"><div class="t">${esc(x.name)}</div><div class="small muted">طلب تسجيل بصفة ${ROLE[x.role]}${x.track&&x.role==="student"?" · "+TRACK[x.track]:""}${x.note?" · "+esc(x.note):""}</div></div><button class="btn sm pri" data-act="approve" data-id="${x.id}">اعتماد</button></div>`).join("")}
   ${req.map(s=>`<div class="li"><div class="avatar">${esc(initials(nameOf(s.studentId)))}</div><div class="grow"><div class="t">${esc(nameOf(s.studentId))} يطلب موعد تسميع</div><div class="small muted">${fmtDT(s.start)}${s.note?" · "+esc(s.note):""}</div></div><button class="btn sm pri" data-act="editSession" data-id="${s.id}">مراجعة وتأكيد</button></div>`).join("")}
  </div></div>`:""}`;
  B.alerts=staffAlerts(m);B.recits=pendingRecits(m);
  B.sessions=`<div class="card"><div class="card-h"><h2>مواعيد اليوم</h2><button class="btn sm" data-act="go" data-v="sessions">كل المواعيد</button></div>${sess.length?`<div class="list">${sess.map(sessRow).join("")}</div>`:empty("لا مواعيد تسميع اليوم.")}</div>`;
  B.students=`<div class="card"><div class="card-h"><h2>حال الطلاب اليوم</h2></div>${st.length?`<div class="list">${st.map(s=>{const l=L.find(x=>x.studentId===s.id);const tt=T.filter(t=>t.studentId===s.id);return `<div class="li clickable" data-act="openStudent" data-id="${s.id}"><div class="avatar">${esc(initials(s.name))}</div><div class="grow"><div class="t">${esc(s.name)}</div><div class="small muted">${TRACK[s.track]||""} · المهام ${tt.filter(t=>t.done).length}/${tt.length}</div></div>${l?`<span class="pill ${ATT_CLS[l.attendance]||""}">${ATT[l.attendance]||"مسجّل"}</span>`:`<span class="pill">لم يُسجَّل</span>`}</div>`}).join("")}</div>`:empty(`لا يوجد طلاب بعد. <button class="btn sm" data-act="addStudent">إضافة طالب</button>`)}</div>`;
  return homeLayout("staff",B);
}

/* ============ الطلاب ============ */
function teacherFilter(m){if(!isAdmin(m))return"";return `<select data-change="teacher" id="tf">${[["all","كل المعلمين"],...teachers().map(t=>[t.id,t.name])].map(([k,l])=>`<option value="${k}" ${ui.teacher===k?"selected":""}>${esc(l)}</option>`).join("")}</select>`}
function studentsView(m){
  let st=scoped(m);
  if(ui.track!=="all")st=st.filter(s=>s.track===ui.track);
  if(ui.q)st=st.filter(s=>s.name.includes(ui.q));
  const mf=monthRange(today().slice(0,7));
  return `<div class="hero"><h1>الطلاب</h1><button class="btn pri" data-act="addStudent">إضافة طالب</button></div>
  <div class="toolbar"><input id="q" placeholder="بحث بالاسم" value="${esc(ui.q)}" data-input="q"><select data-change="track" id="trk"><option value="all">كل المسارات</option><option value="hifz" ${ui.track==="hifz"?"selected":""}>${TRACK.hifz}</option><option value="tilawa" ${ui.track==="tilawa"?"selected":""}>${TRACK.tilawa}</option></select>${teacherFilter(m)}${circleFilter(m)}</div>
  ${st.length?groupHTML(st,s=>{const p=s.plan||{};const tot=totalPages(s);const x=stats(s.id,mf[0],mf[1]);return `<div class="card clickable" data-act="openStudent" data-id="${s.id}"><div class="row" style="margin-bottom:10px"><div class="avatar">${esc(initials(s.name))}</div><div style="min-width:0;flex:1"><div class="t" style="font-weight:600">${esc(s.name)}</div><div class="small muted">${esc(nameOf(s.teacherId))}</div></div><span class="pill ${s.track==="tilawa"?"p-info":"p-pri"}">${s.track==="tilawa"?"تلاوة":"حفظ"}</span></div>
   <div class="small row between"><span>${s.track==="tilawa"?"المقروء":"المحفوظ"}: <b class="num">${tot}</b> وجه${p.targetPages?` من ${p.targetPages}`:""}</span><span class="muted">${(tot/20).toFixed(1)} جزء</span></div>${pbar(tot,n0(p.targetPages)||604)}
   <div class="small muted row between" style="margin-top:8px"><span>حضور الشهر: ${x.rate==null?"—":x.rate+"%"}</span><span>${s.uid?"له حساب":"بدون حساب"}</span></div></div>`},"grid g3",c=>c?`<button class="btn sm" data-act="openCircle" data-id="${c.id}">صفحة الحلقة</button>`:""):empty("لا يوجد طلاب مطابقون.")}`;
}

function studentDetail(sid){
  const s=get("members",sid);if(!s)return empty("الطالب غير موجود.");
  const tabs=[["plan","الخطة والخريطة"],["tasks","المهام"],["logs","السجل اليومي"],["exams","الاختبارات"],["recits","التسميع الصوتي"],["certs","الشهادات"],["sessions","المواعيد"],["programs","البرامج"],["report","التقرير"]];
  let body="";
  if(ui.stab==="plan")body=juzMapHTML(s,true)+planView(s,true);
  else if(ui.stab==="exams")body=`<div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newExam" data-sid="${s.id}">اختبار جديد</button></div>${examsTable(examsOf(s.id),true)}`;
  else if(ui.stab==="recits")body=`<div class="stack">${recitsOf(s.id).map(r=>recitItem(r,true)).join("")||empty("لم يرسل الطالب تسميعاً صوتياً بعد.")}</div>`;
  else if(ui.stab==="certs")body=`<div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newCert" data-sid="${s.id}">إصدار شهادة</button></div>${certsList(s.id,true)}`;
  else if(ui.stab==="tasks")body=tasksPanel(s,true);
  else if(ui.stab==="logs")body=logsTable(s,logsOf(s.id).slice(0,60),true);
  else if(ui.stab==="sessions")body=`<div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newSession" data-sid="${s.id}">موعد جديد</button></div>${sessList(S.sessions.filter(x=>sessStu(x).includes(s.id)))}`;
  else if(ui.stab==="programs")body=studentPrograms(s,true);
  else body=periodPicker()+reportInner(s.id,curRange(s.id),true);
  return `<div><button class="btn ghost sm" data-act="go" data-v="students">→ رجوع للطلاب</button></div>
  <div class="card"><div class="row between"><div class="row"><div class="avatar" style="width:48px;height:48px;font-size:1.1rem">${esc(initials(s.name))}</div><div><h1 style="font-size:1.35rem">${esc(s.name)}</h1><div class="small muted">${TRACK[s.track]||""} · المعلم: ${esc(nameOf(s.teacherId))}${s.phone?" · "+esc(s.phone):""}${s.guardianPhone?" · ولي الأمر: "+esc(s.guardianPhone):""}</div></div></div><div class="row"><button class="btn sm" data-act="logFor" data-id="${s.id}">تسجيل اليوم</button>${s.uid?(s.username?`<button class="btn sm" data-act="acctReset" data-id="${s.id}">كلمة مرور جديدة</button>`:""):`<button class="btn sm pri" data-act="acctCreate" data-id="${s.id}">إنشاء حساب دخول</button>`}<button class="btn sm" data-act="editMsgs" data-id="${s.id}">الملاحظات الثابتة</button><button class="btn sm" data-act="editMember" data-id="${s.id}">تعديل البيانات</button></div></div>${s.note?`<p class="small muted" style="margin-top:8px">${esc(s.note)}</p>`:""}
  ${s.msgStudent||s.msgParent?`<div class="grid g2" style="margin-top:12px;gap:10px">${s.msgStudent?`<div class="stat"><span class="pill p-pri">للطالب</span><p style="white-space:pre-wrap;margin-top:4px">${esc(s.msgStudent)}</p></div>`:""}${s.msgParent?`<div class="stat"><span class="pill p-acc">لولي الأمر</span><p style="white-space:pre-wrap;margin-top:4px">${esc(s.msgParent)}</p></div>`:""}</div>`:""}</div>
  ${badgesHTML(s.id)}<div class="subtabs">${tabs.map(([k,l])=>`<button data-act="stab" data-v="${k}" class="${ui.stab===k?"on":""}">${l}</button>`).join("")}</div>${body}`;
}

/* ============ الخطة ============ */
function planView(s,staff){
  const p=s.plan||{};const tot=totalPages(s);const target=n0(p.targetPages)||(s.track==="tilawa"?604:0);
  const isT=s.track==="tilawa";
  if(!s.plan)return `<div class="card">${staff?empty(`لم تُحدَّد خطة لهذا الطالب بعد. <button class="btn sm pri" data-act="editPlan" data-id="${s.id}">إنشاء الخطة</button>`):empty("لم يضع معلمك خطتك بعد.")}</div>`;
  const remain=target?Math.max(0,target-tot):0;
  return `<div class="grid g2"><div class="card"><div class="card-h"><h2>${isT?"خطة التلاوة":"خطة الحفظ"}</h2>${staff?`<button class="btn sm" data-act="editPlan" data-id="${s.id}">تعديل الخطة</button>`:""}</div>
  <div class="stack">${p.goal?`<p><b>الهدف:</b> ${esc(p.goal)}</p>`:""}
  <div class="grid g2" style="gap:8px">${isT?`<div><span class="muted small">المقدار اليومي</span><div>${esc(p.dailyTilawa||"—")}</div></div><div><span class="muted small">أحكام التركيز</span><div>${esc(p.focus||"—")}</div></div>`:`<div><span class="muted small">الحفظ اليومي</span><div>${esc(p.dailyNew||"—")}</div></div><div><span class="muted small">المراجعة اليومية</span><div>${esc(p.dailyRev||"—")}</div></div><div><span class="muted small">الاتجاه</span><div>${esc(p.direction||"—")}</div></div><div><span class="muted small">نقطة البداية</span><div>${esc(p.startPoint||"—")}</div></div>`}
  <div><span class="muted small">أيام الحلقة</span><div>${(p.days||[]).map(d=>DAYS[d]).join("، ")||"—"}</div></div><div><span class="muted small">المدة</span><div class="num">${p.startDate?fmtShort(p.startDate):"—"} ← ${p.endDate?fmtShort(p.endDate):"—"}</div></div></div></div></div>
  <div class="card"><div class="card-h"><h2>التقدم</h2></div><div class="stack"><div class="row between"><span>${isT?"المقروء":"المحفوظ"}</span><b class="num">${tot} / ${target||"—"} وجه</b></div>${pbar(tot,target||604)}
  <div class="stats"><div class="stat"><b>${(tot/20).toFixed(1)}</b><span>جزء تقريباً</span></div><div class="stat"><b>${remain}</b><span>وجه متبقٍّ</span></div><div class="stat"><b>${streak(s.id)}</b><span>أيام متتالية بإنجاز كامل</span></div></div>
  ${staff?`<button class="btn" data-act="genWeek" data-id="${s.id}">إنشاء مهام الأسبوع من الخطة</button><span class="hint">ينشئ مهام ${isT?"التلاوة":"الحفظ والمراجعة"} للأيام السبعة القادمة حسب أيام الحلقة، دون تكرار ما هو موجود.</span>`:""}</div></div></div>`;
}

/* ============ المهام ============ */
function taskItem(t,canToggle,showStudent){
  return `<div class="check ${t.done?"done":""}"><button class="cb ${t.done?"on":""}" ${canToggle?`data-act="toggleTask" data-id="${t.id}"`:"disabled"} aria-label="${t.done?"إلغاء الإنجاز":"تم الإنجاز"}">${t.done?ICON.check:""}</button><div class="grow" style="flex:1;min-width:0"><div class="row">${kindTag(t.kind)}<span class="t" style="font-weight:600">${esc(t.title)}</span></div>${showStudent?`<div class="small muted">${esc(nameOf(t.studentId))}</div>`:""}${t.details?`<div class="small muted" style="white-space:pre-wrap">${esc(t.details)}</div>`:""}${t.programId&&get("programs",t.programId)?`<div class="small" style="color:var(--accent)">ضمن برنامج: ${esc(get("programs",t.programId).title)}</div>`:""}<div class="row">${t.link?`<a class="btn sm" href="${esc(t.link)}" target="_blank" rel="noopener">فتح الرابط ↗</a>`:""}${t.fileUrl?`<a class="btn sm" href="${esc(t.fileUrl)}" target="_blank" rel="noopener">📎 ${esc(t.fileName||"المرفق")}</a>`:""}</div>${t.done&&t.doneAt?`<div class="small" style="color:var(--ok)">أُنجزت ${fmtT(t.doneAt)}</div>`:""}</div>${canToggle==="staff"?`<button class="btn ghost sm" data-act="editTask" data-id="${t.id}">تعديل</button>`:""}</div>`;
}
function tasksPanel(s,staff){
  const from=addDays(today(),-7),to=addDays(today(),14);
  const T=tasksOf(s.id,from,to).sort((a,b)=>a.date<b.date?-1:1);
  const by={};T.forEach(t=>(by[t.date]=by[t.date]||[]).push(t));
  return `<div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newTask" data-sid="${s.id}">مهمة جديدة</button><button class="btn sm" data-act="genWeek" data-id="${s.id}">مهام الأسبوع من الخطة</button><span class="hint">يعرض من أسبوع مضى إلى أسبوعين قادمين</span></div>
  ${Object.keys(by).length?Object.keys(by).map(d=>`<div class="stack" style="margin-bottom:14px"><h3 class="row">${fmtD(d)}${d===today()?' <span class="pill p-acc">اليوم</span>':""}</h3>${by[d].map(t=>taskItem(t,staff?"staff":true)).join("")}</div>`).join(""):empty("لا مهام في هذه الفترة.")}`;
}

/* ============ السجل ============ */
function logsTable(s,L,staff){
  const c=cfg();const m=me();
  const showG=staff||c.studentSeeGrades,showN=staff||(m.role==="parent"?c.parentSeeNotes:c.studentSeeNotes);
  const isT=s.track==="tilawa";
  if(!L.length)return empty("لا يوجد سجل متابعة بعد.");
  return `<div class="tbl-wrap"><table><thead><tr><th>التاريخ</th><th>الحضور</th><th>المقدار</th>${showG?(isT?"<th>الأخطاء (جلي/خفي)</th><th>التقدير</th>":"<th>تقدير الحفظ</th><th>تقدير المراجعة</th>"):""}${showN?"<th>ملاحظات</th>":""}${staff?"<th></th>":""}</tr></thead><tbody>
  ${L.map(l=>`<tr><td class="num">${fmtShort(l.date)}</td><td><span class="pill ${ATT_CLS[l.attendance]||""}">${ATT[l.attendance]||"—"}</span></td><td class="wrapc">${amountTxt(l)}</td>${showG?(isT?`<td class="num">${n0(l.errJali)} / ${n0(l.errKhafi)}</td><td><span class="pill ${gradeCls(l.tGrade)}">${gradeTxt(l.tGrade)}</span></td>`:`<td><span class="pill ${gradeCls(l.newGrade)}">${gradeTxt(l.newGrade)}</span></td><td><span class="pill ${gradeCls(l.revGrade)}">${gradeTxt(l.revGrade)}</span></td>`):""}${showN?`<td class="wrapc">${notesCell(l,staff?"staff":m.role==="parent"?"parent":"student")}</td>`:""}${staff?`<td><button class="btn ghost sm" data-act="editLog" data-id="${l.id}">تعديل</button></td>`:""}</tr>`).join("")}</tbody></table></div>`;
}
function dailyView(m){
  const st=scoped(m).filter(s=>canAttend(m,s)),d=ui.date;const mode=ui.dmode||"quick";
  const done=st.filter(s=>get("logs",`${s.id}_${d}`)).length;
  const head=`<div class="hero"><div><h1>السجل اليومي</h1><div class="date">${fmtD(d)} · حُضّر ${done} من ${st.length}</div></div><div class="toolbar"><button class="btn sm" data-act="day" data-n="-1">→ اليوم السابق</button><input type="date" id="dd" value="${d}" data-change="date"><button class="btn sm" data-act="day" data-n="1">اليوم التالي ←</button>${teacherFilter(m)}${circleFilter(m)}</div></div>
  <div class="row between"><div class="seg modeseg"><button data-act="dmode" data-v="quick" class="${mode==="quick"?"on":""}">تحضير سريع</button><button data-act="dmode" data-v="detail" class="${mode==="detail"?"on":""}">بطاقات التفاصيل</button></div>${attRestricted(m)?'<span class="pill p-info">صلاحيتك: تحضير حلقتك فقط</span>':""}</div>`;
  if(!st.length)return head+empty(attRestricted(m)?"لا توجد حلقة مسندة إليك للتحضير. اطلب من مدير البرنامج إسنادها إليك.":"لا يوجد طلاب.");
  const H=(c,k)=>{const list=st.filter(s=>(s.circleId&&get("circles",s.circleId)?s.circleId:"none")===k);const done=list.filter(s=>get("logs",`${s.id}_${d}`)).length;return `<span class="pill ${done===list.length?"p-ok":""}">حُضّر ${done}/${list.length}</span>${c&&c.meetLink?`<a class="btn sm meet" href="${esc(c.meetLink)}" target="_blank" rel="noopener">${ICON.video} ${platName(c.meetLink)} الحلقة</a>`:""}<button class="btn sm pri" data-act="attAll" data-v="present" data-cid="${k}">الكل حاضر</button><button class="btn sm" data-act="attAll" data-v="absent" data-cid="${k}">الباقي غائب</button>`};
  if(mode==="quick")return head+`<p class="hint">اضغط حالة كل طالب، أو «الكل حاضر» ثم عدّل الغائبين. «الباقي غائب» يسجّل الغياب لمن لم يُحضَّر بعد.</p>`+groupHTML(st,s=>{const l=get("logs",`${s.id}_${d}`);const has=l&&(l.newSurah||l.tSurah||l.revDesc||n0(l.newPages)||n0(l.tPages)||n0(l.newGrade)||n0(l.tGrade));return `<div class="arow ${l?"is-"+l.attendance:""}"><div class="aname"><b>${esc(s.name)}</b><small>${TRACK[s.track]||""}${has?" · "+gradeTxt(l.newGrade||l.tGrade)+" ✓":""}</small></div><div class="seg">${Object.keys(ATT).map(k=>`<button data-act="att" data-id="${s.id}" data-v="${k}" class="${l&&l.attendance===k?"on-"+k:""}">${ATT[k]}</button>`).join("")}</div><button class="btn ghost sm" data-act="logFor" data-id="${s.id}">${has?"تعديل التفاصيل":"التفاصيل"}</button></div>`},"attlist",H);
  return head+`<p class="hint">اضغط حالة الحضور لتسجيلها مباشرة، ثم «التفاصيل» لتسجيل المقدار والتقدير والأخطاء.</p>`+groupHTML(st,s=>{const l=get("logs",`${s.id}_${d}`);return `<div class="card"><div class="row between"><div class="row" style="min-width:0"><div class="avatar">${esc(initials(s.name))}</div><div style="min-width:0"><div style="font-weight:600">${esc(s.name)}</div><div class="small muted">${TRACK[s.track]} · ${esc((s.plan||{})[s.track==="tilawa"?"dailyTilawa":"dailyNew"]||"بدون خطة")}</div></div></div>
  <div class="row"><div class="seg">${Object.keys(ATT).map(k=>`<button data-act="att" data-id="${s.id}" data-v="${k}" class="${l&&l.attendance===k?"on-"+k:""}">${ATT[k]}</button>`).join("")}</div><button class="btn sm pri" data-act="logFor" data-id="${s.id}">التفاصيل</button><button class="btn sm ghost" data-act="mushafFor" data-id="${s.id}" title="فتح المصحف في وضع التسميع">المصحف</button></div></div>
  ${l&&(l.newSurah||l.tSurah||l.revDesc||n0(l.newPages)||n0(l.tPages)||nS(l)||l.noteParent)?`<div class="small" style="margin-top:8px">${amountTxt(l)}${n0(l.newGrade)?` · حفظ: <b>${gradeTxt(l.newGrade)}</b>`:""}${n0(l.revGrade)?` · مراجعة: <b>${gradeTxt(l.revGrade)}</b>`:""}${n0(l.tGrade)?` · أداء: <b>${gradeTxt(l.tGrade)}</b> · أخطاء ${n0(l.errJali)}/${n0(l.errKhafi)}`:""}${nS(l)?` · للطالب: ${esc(nS(l))}`:""}${l.noteParent?` · لولي الأمر: ${esc(l.noteParent)}`:""}</div>`:""}</div>`},"stack",H);
}
function logForm(sid,d,l){
  const s=get("members",sid);const isT=s.track==="tilawa";l=l||{};
  const body=`<div class="fg">${fld("التاريخ",inp("date",d,"date","required"))}${fld("الحضور",sel("attendance",Object.entries(ATT),l.attendance||"present"))}</div>
  ${isT?`<fieldset><legend>التلاوة</legend><div class="fg">${fld("السورة",surahSel("tSurah",l.tSurah))}${fld("من آية",inp("tFrom",l.tFrom,"number","min=1"))}${fld("إلى آية",inp("tTo",l.tTo,"number","min=1"))}${fld("عدد الأوجه",inp("tPages",l.tPages,"number","min=0 step=0.5"))}</div>
   <div class="fg">${fld("أخطاء جلية",inp("errJali",l.errJali,"number","min=0"))}${fld("أخطاء خفية",inp("errKhafi",l.errKhafi,"number","min=0"))}${fld("تقدير الأداء",gradeSel("tGrade",l.tGrade))}</div>
   <div><div class="small muted" style="margin-bottom:6px">أحكام تحتاج تدريباً</div><div class="chips">${TAJWEED.map(t=>`<label><input type="checkbox" name="tajweed" value="${t}" ${(l.tajweed||[]).includes(t)?"checked":""}>${t}</label>`).join("")}</div></div>
   ${fld("ملاحظات التجويد",`<textarea name="tajweedNote" id="f-tajweedNote">${esc(l.tajweedNote||"")}</textarea>`)}</fieldset>`
  :`<fieldset><legend>الحفظ الجديد</legend><div class="fg">${fld("السورة",surahSel("newSurah",l.newSurah))}${fld("من آية",inp("newFrom",l.newFrom,"number","min=1"))}${fld("إلى آية",inp("newTo",l.newTo,"number","min=1"))}${fld("عدد الأوجه",inp("newPages",l.newPages,"number","min=0 step=0.25"))}${fld("التقدير",gradeSel("newGrade",l.newGrade))}</div></fieldset>
   <fieldset><legend>المراجعة</legend><div class="fg">${fld("المقطع",inp("revDesc",l.revDesc,"text","placeholder='مثال: جزء عم أو البقرة 1–40'"))}${fld("عدد الأوجه",inp("revPages",l.revPages,"number","min=0 step=0.5"))}${fld("التقدير",gradeSel("revGrade",l.revGrade))}</div></fieldset>
   <fieldset><legend>التجويد</legend><div class="chips">${TAJWEED.map(t=>`<label><input type="checkbox" name="tajweed" value="${t}" ${(l.tajweed||[]).includes(t)?"checked":""}>${t}</label>`).join("")}</div></fieldset>`}
  <fieldset><legend>الملاحظات</legend>
  ${fld("ملاحظة للطالب",`<textarea name="noteStudent" id="f-noteStudent" placeholder="يراها الطالب في صفحته">${esc(l.id?nS(l):"")}</textarea>`)}
  ${fld("ملاحظة لولي الأمر",`<textarea name="noteParent" id="f-noteParent" placeholder="يراها ولي الأمر فقط، ولا تظهر للطالب">${esc(l.id?nP(l):"")}</textarea>`)}
  ${can(me(),"notes.private")?fld("ملاحظة داخلية",`<textarea name="noteStaff" id="f-noteStaff" placeholder="للمعلمين والمشرف فقط">${esc(l.noteStaff||"")}</textarea>`):""}</fieldset>`;
  openModal(`متابعة: ${esc(s.name)}`,body,"log",{sid},"حفظ المتابعة",l.id?`<button type="button" class="btn danger" data-act="delLog" data-id="${l.id}">حذف</button>`:"");
}

/* ============ المواعيد ============ */
function sessRow(s){
  const st=sessState(s);const[lbl,cls]=st==="live"?["الآن","p-ok"]:SESS_LBL[s.status]||["",""];
  const m=me();const staff=isStaff(m);
  const canJoin=s.link&&s.status==="confirmed"&&st!=="past";
  const grp=isGroup(s);
  return `<div class="li"><div class="avatar" style="${grp?"background:var(--accent-soft);color:var(--accent)":""}">${grp?(sessStu(s).length):esc(initials(staff?sessTitle(s):nameOf(s.teacherId)))}</div><div class="grow"><div class="t">${staff?esc(sessTitle(s)):(grp?esc(sessTitle(s))+" · ":"")+"مع "+esc(nameOf(s.teacherId))}</div><div class="small muted num">${fmtDT(s.start)} · ${n0(s.duration)||30} دقيقة${s.note?" · "+esc(s.note):""}</div></div>
  <span class="pill ${cls}">${lbl}</span>
  <div class="row">${canJoin?`<a class="btn sm meet" href="${esc(s.link)}" target="_blank" rel="noopener">${ICON.video} دخول ${platName(s.link)}</a>`:""}${s.status==="confirmed"?`<a class="btn sm" href="${gcal(s)}" target="_blank" rel="noopener" title="أضف إلى تقويم Google">${ICON.cal} التقويم</a>`:""}${staff&&sessStu(s).length===1?`<button class="btn ghost sm" data-act="mushafFor" data-id="${sessStu(s)[0]}">المصحف</button>`:""}${staff||s.status==="requested"?`<button class="btn ghost sm" data-act="editSession" data-id="${s.id}">${staff?"إدارة":"تعديل"}</button>`:""}</div></div>`;
}
function sessList(arr){
  const now=Date.now()-3*3600000;
  const up=arr.filter(s=>new Date(s.start).getTime()>=now&&s.status!=="cancelled"&&s.status!=="done").sort((a,b)=>a.start<b.start?-1:1);
  const past=arr.filter(s=>!up.includes(s)).sort((a,b)=>a.start<b.start?1:-1).slice(0,30);
  return `<div class="card"><div class="card-h"><h2>القادمة</h2></div>${up.length?`<div class="list">${up.map(sessRow).join("")}</div>`:empty("لا مواعيد قادمة.")}</div>
  <div class="card"><div class="card-h"><h2>السابقة</h2></div>${past.length?`<div class="list">${past.map(sessRow).join("")}</div>`:empty("لا مواعيد سابقة.")}</div>`;
}
function sessionsView(m){
  let arr;
  if(isStaff(m))arr=S.sessions.filter(s=>s.teacherId===m.id||sessStu(s).some(id=>myStudents(m).some(x=>x.id===id)));
  else if(m.role==="student")arr=S.sessions.filter(s=>sessStu(s).includes(m.id));
  else arr=S.sessions.filter(s=>sessStu(s).some(id=>(m.childIds||[]).includes(id)));
  const t=m.role==="student"?teacherOf(m):null;
  return `<div class="hero"><div><h1>مواعيد التسميع</h1><div class="date">التسميع عن بُعد عبر Google Meet أو Zoom</div></div><div class="row">${isStaff(m)?`<button class="btn pri" data-act="newSession">موعد جديد</button>`:m.role==="student"?`<button class="btn pri" data-act="newSession">اطلب موعداً</button>`:""}<a class="btn" href="https://meet.google.com/new" target="_blank" rel="noopener">${ICON.video} إنشاء Meet</a><a class="btn" href="https://zoom.us/meeting/schedule" target="_blank" rel="noopener">${ICON.video} إنشاء Zoom</a></div></div>
  ${m.role==="student"&&t&&t.meetLink?`<div class="next-sess"><div class="grow"><b>رابط حلقة معلمك الثابت</b><div class="small muted">${esc(t.meetLink)}</div></div><a class="btn meet" href="${esc(t.meetLink)}" target="_blank" rel="noopener">${ICON.video} دخول</a></div>`:""}
  ${sessList(arr)}`;
}
function sessionForm(s,presetSid){
  const m=me();const staff=isStaff(m);s=s||{};
  const sid=s.studentId||(s.studentIds||[])[0]||presetSid||(m.role==="student"?m.id:"");
  const kind=s.circleId||presetSid==="__circle"?"circle":(s.studentIds||[]).length>1?"group":"single";
  const pc=s.circleId||modalPresetCircle||"";
  const stu=get("members",sid);const t=stu?teacherOf(stu):(staff?m:null);
  const def=new Date();def.setDate(def.getDate()+1);def.setHours(17,0,0,0);
  const circ=pc?get("circles",pc):null;
  const body=`${staff?`${fld("نوع الموعد",sel("skind",[["single","طالب واحد"],["group","مجموعة طلاب أختارهم"],["circle","حلقة كاملة"]],pc?"circle":kind,`data-change="skind"`))}
  <div id="sk-single" ${(pc?"circle":kind)==="single"?"":"hidden"}>${fld("الطالب",sel("studentId",[["","— اختر —"],...myStudents(m).map(x=>[x.id,x.name])],sid))}</div>
  <div id="sk-group" ${(pc?"circle":kind)==="group"?"":"hidden"}><div class="small muted" style="margin-bottom:6px">اختر الطلاب</div><div class="chips">${myStudents(m).map(x=>`<label><input type="checkbox" name="studentIds" value="${x.id}" ${(s.studentIds||[]).includes(x.id)?"checked":""}>${esc(x.name)}</label>`).join("")}</div></div>
  <div id="sk-circle" ${(pc?"circle":kind)==="circle"?"":"hidden"}>${fld("الحلقة",sel("circleId",[["","— اختر —"],...myCircles(m).map(c=>[c.id,`${c.name} (${circleStudents(c.id).length} طالب)`])],pc),"كل طلاب الحلقة يرون الموعد ورابط الاجتماع، ومن ينضم للحلقة لاحقاً يراه أيضاً.")}</div>`:""}
  <div class="fg">${fld("الموعد",inp("start",s.start?toLocalInput(s.start):toLocalInput(def.toISOString()),"datetime-local","required"))}${fld("المدة (دقيقة)",sel("duration",[[15,"15"],[20,"20"],[30,"30"],[45,"45"],[60,"60"]],s.duration||30))}</div>
  ${staff?`${fld("رابط الاجتماع (Google Meet أو Zoom)",inp("link",s.link||(circ&&circ.meetLink)||(t&&t.meetLink)||(m.meetLink||""),"url","placeholder='https://meet.google.com/xxx-xxxx-xxx'"),"يُملأ تلقائياً برابطك الثابت من «حسابي». لإنشاء رابط جديد: اضغط «إنشاء Meet» أو «إنشاء Zoom» ثم انسخ رابط الاجتماع والصقه هنا.")}
  <div class="row"><a class="btn sm" href="https://meet.google.com/new" target="_blank" rel="noopener">${ICON.video} إنشاء Meet</a><a class="btn sm" href="https://zoom.us/meeting/schedule" target="_blank" rel="noopener">${ICON.video} إنشاء Zoom</a>${t&&t.meetLink?"":`<span class="hint">احفظ رابطك الثابت من «حسابي» ليُملأ دائماً.</span>`}</div>
  ${fld("الحالة",sel("status",[["confirmed","مؤكد"],["requested","بانتظار التأكيد"],["done","تم التسميع"],["missed","لم يحضر"],["cancelled","ملغى"]],s.status||"confirmed"))}`:`<p class="hint">سيصل طلبك لمعلمك ليؤكده، وبعد التأكيد يظهر لك زر الدخول إلى الاجتماع وزر الإضافة لتقويم Google.</p>`}
  ${fld("ملاحظة",inp("note",s.note,"text","placeholder='مثال: تسميع سورة الملك كاملة'"))}`;
  openModal(s.id?"إدارة الموعد":staff?"موعد تسميع جديد":"طلب موعد تسميع",body,"session",{id:s.id,sid},staff?"حفظ الموعد":"إرسال الطلب",s.id?`<button type="button" class="btn danger" data-act="delSession" data-id="${s.id}">حذف</button>`:"");
}

/* ============ الحلقات ============ */
const CTRACK={hifz:"حفظ",tilawa:"تلاوة",mixed:"حفظ وتلاوة"};
function circlesView(m){
  const cs=myCircles(m);
  return `<div class="hero"><div><h1>سجل الحلقات</h1><div class="date">كل حلقة بمعلمها وطلابها ومواعيدها ورابط الاجتماع الخاص بها</div></div><button class="btn pri" data-act="newCircle">حلقة جديدة</button></div>
  ${cs.length?`<div class="grid g3">${cs.map(c=>{const st=circleStudents(c.id);const d=today();const pres=st.filter(s=>{const l=get("logs",`${s.id}_${d}`);return l&&(l.attendance==="present"||l.attendance==="late")}).length;const meets=(c.days||[]).includes(dow(d));
   return `<div class="card clickable" data-act="openCircle" data-id="${c.id}"><div class="row between" style="margin-bottom:6px"><span class="pill ${c.track==="tilawa"?"p-info":c.track==="hifz"?"p-pri":"p-acc"}">${CTRACK[c.track]||""}</span>${meets?'<span class="pill p-ok">تنعقد اليوم</span>':""}</div><h3>${esc(c.name)}</h3><div class="small muted">${esc(nameOf(c.teacherId))} · ${st.length} طالب</div><div class="small muted">${schedTxt(c)}</div>${meets?`<div class="small" style="margin-top:6px">حضور اليوم: <b class="num">${pres}/${st.length}</b></div>`:""}</div>`}).join("")}</div>`:empty("لا حلقات بعد. أنشئ حلقة وحدّد معلمها وطلابها وأيامها ورابط الاجتماع الخاص بها.")}
  ${cs.length&&allStudents().some(s=>!s.circleId)&&can(m,"circles.manage")&&isAdmin(m)?`<p class="hint">يوجد ${allStudents().filter(s=>!s.circleId).length} طالب بدون حلقة. أضفهم من «تعديل الحلقة».</p>`:""}`;
}
function circleDetail(cid){
  const c=get("circles",cid);if(!c)return empty("الحلقة غير موجودة.");
  const st=circleStudents(cid);const ids=st.map(s=>s.id);
  const dates=[...new Set(S.logs.filter(l=>ids.includes(l.studentId)).map(l=>l.date))].sort().reverse().slice(0,30);
  const rec=dates.map(d=>{const L=S.logs.filter(l=>l.date===d&&ids.includes(l.studentId));const k={present:0,late:0,absent:0,excused:0};L.forEach(l=>{if(k[l.attendance]!=null)k[l.attendance]++});
    const pages=L.reduce((a,l)=>a+n0(l.newPages)+n0(l.tPages),0);const g=[];L.forEach(l=>[l.newGrade,l.tGrade].forEach(x=>{if(n0(x))g.push(n0(x))}));
    const absent=L.filter(l=>l.attendance==="absent").map(l=>nameOf(l.studentId));
    return {d,k,pages,avg:g.length?g.reduce((a,b)=>a+b,0)/g.length:0,absent,total:st.length}});
  const sess=S.sessions.filter(s=>s.circleId===cid||sessStu(s).some(id=>ids.includes(id)));
  return `<div><button class="btn ghost sm" data-act="go" data-v="circles">→ رجوع للحلقات</button></div>
  <div class="card"><div class="row between"><div><span class="pill ${c.track==="tilawa"?"p-info":"p-pri"}">${CTRACK[c.track]||""}</span><h1 style="margin-top:6px">${esc(c.name)}</h1><div class="small muted">المعلم: ${esc(nameOf(c.teacherId))} · ${schedTxt(c)}</div>${c.description?`<p class="small muted" style="margin-top:6px">${esc(c.description)}</p>`:""}</div>
  <div class="row">${c.meetLink?`<a class="btn meet" href="${esc(c.meetLink)}" target="_blank" rel="noopener">${ICON.video} دخول ${platName(c.meetLink)} الحلقة</a>`:`<a class="btn" href="https://meet.google.com/new" target="_blank" rel="noopener">${ICON.video} إنشاء Meet</a><a class="btn" href="https://zoom.us/meeting/schedule" target="_blank" rel="noopener">${ICON.video} إنشاء Zoom</a>`}${hasTime(c)?`<a class="btn" href="${circleCal(c)}" target="_blank" rel="noopener">${ICON.cal} إضافة المواعيد الأسبوعية للتقويم</a>`:""}</div></div>
  <div class="row" style="margin-top:12px"><button class="btn sm pri" data-act="circleDaily" data-id="${c.id}">تحضير وتسجيل اليوم</button><button class="btn sm" data-act="newSession" data-cid="${c.id}" data-sid="__circle">موعد للحلقة</button><button class="btn sm" data-act="editCircle" data-id="${c.id}">تعديل الحلقة والطلاب</button></div></div>
  <div class="grid g2"><div class="card"><div class="card-h"><h2>الطلاب (${st.length})</h2></div>${st.length?`<div class="list">${st.map(s=>{const l=get("logs",`${s.id}_${today()}`);return `<div class="li clickable" data-act="openStudent" data-id="${s.id}"><div class="avatar">${esc(initials(s.name))}</div><div class="grow"><div class="t">${esc(s.name)}</div><div class="small muted">${TRACK[s.track]} · ${totalPages(s)} وجه</div></div>${l?`<span class="pill ${ATT_CLS[l.attendance]||""}">${ATT[l.attendance]}</span>`:""}</div>`}).join("")}</div>`:empty("لا طلاب في الحلقة. أضفهم من «تعديل الحلقة والطلاب».")}</div>
  <div class="card"><div class="card-h"><h2>مواعيد الحلقة</h2></div>${(()=>{const up=sess.filter(s=>new Date(s.start).getTime()>=Date.now()-3*3600000&&s.status!=="cancelled").sort((a,b)=>a.start<b.start?-1:1).slice(0,8);return up.length?`<div class="list">${up.map(sessRow).join("")}</div>`:empty("لا مواعيد قادمة.")})()}</div></div>
  <div class="card"><div class="card-h"><h2>سجل لقاءات الحلقة</h2><span class="small muted">آخر 30 لقاءً مسجّلاً</span></div>
  ${rec.length?`<div class="tbl-wrap"><table><thead><tr><th>التاريخ</th><th>حاضر</th><th>متأخر</th><th>غائب</th><th>مستأذن</th><th>نسبة الحضور</th><th>الأوجه</th><th>متوسط التقدير</th><th>الغائبون</th></tr></thead><tbody>${rec.map(r=>{const cnt=r.k.present+r.k.late+r.k.absent;return `<tr class="clickable" data-act="circleDay" data-id="${c.id}" data-d="${r.d}"><td class="num">${fmtShort(r.d)}</td><td class="num">${r.k.present}</td><td class="num">${r.k.late}</td><td class="num">${r.k.absent}</td><td class="num">${r.k.excused}</td><td class="num">${cnt?Math.round((r.k.present+r.k.late)/cnt*100)+"%":"—"}</td><td class="num">${r.pages}</td><td><span class="pill ${gradeCls(r.avg)}">${r.avg?r.avg.toFixed(1):"—"}</span></td><td class="wrapc small">${esc(r.absent.join("، "))||"—"}</td></tr>`}).join("")}</tbody></table></div><p class="hint">اضغط على أي يوم لفتح سجله التفصيلي وتعديله.</p>`:empty("لم يُسجَّل أي لقاء بعد. ابدأ بـ«تحضير وتسجيل اليوم».")}</div>`;
}
function circleForm(c){
  const m=me();c=c||{track:"hifz",days:[],time:"",duration:60,teacherId:m.id};const timed=(c.days||[]).length>0||!!c.time;
  const cur=c.id?circleStudents(c.id).map(s=>s.id):[];
  const pool=allStudents().filter(s=>inScope(m,s)||cur.includes(s.id));
  const body=`<div class="fg">${fld("اسم الحلقة",inp("name",c.name,"text","required placeholder='مثال: حلقة الفرقان'"))}${isAdmin(m)||scopeOf(m)==="circles"?fld("المعلم",sel("teacherId",teachers().map(t=>[t.id,t.name]),c.teacherId)):`<input type="hidden" name="teacherId" value="${m.id}">`}${fld("المسار",sel("track",Object.entries(CTRACK),c.track))}</div>
  <fieldset><legend>وقت الحلقة (اختياري)</legend><p class="hint">الحلقة دائمة يُضاف إليها الطلاب، والوقت للتوضيح فقط عند الحاجة.</p>
  <label class="switch" style="border:0;padding:0"><span>تحديد أيام ووقت للحلقة</span><input type="checkbox" name="timed" id="f-timed" data-change="timed" ${timed?"checked":""}></label>
  <div id="timed-box" class="stack" ${timed?"":"hidden"}><div class="chips">${DAYS.map((d,i)=>`<label><input type="checkbox" name="days" value="${i}" ${(c.days||[]).includes(i)?"checked":""}>${d}</label>`).join("")}</div>
  <div class="fg">${fld("الوقت",inp("time",c.time,"time"))}${fld("المدة (دقيقة)",inp("duration",c.duration||60,"number","min=10 step=5"))}</div></div></fieldset>
  ${fld("رابط اجتماع الحلقة (Google Meet أو Zoom)",inp("meetLink",c.meetLink,"url","placeholder='https://meet.google.com/xxx-xxxx-xxx'"),"رابط ثابت لكل لقاءات الحلقة. لإنشائه: «إنشاء Meet» أو «إنشاء Zoom» ثم انسخ الرابط والصقه هنا.")}
  <div><a class="btn sm" href="https://meet.google.com/new" target="_blank" rel="noopener">${ICON.video} إنشاء Meet</a><a class="btn sm" href="https://zoom.us/meeting/schedule" target="_blank" rel="noopener">${ICON.video} إنشاء Zoom</a></div>
  ${fld("وصف",`<textarea name="description" id="f-description">${esc(c.description||"")}</textarea>`)}
  <fieldset><legend>طلاب الحلقة</legend>${pool.length?`<div class="chips">${pool.map(s=>{const oc=s.circleId&&s.circleId!==c.id?get("circles",s.circleId):null;return `<label><input type="checkbox" name="students" value="${s.id}" ${cur.includes(s.id)?"checked":""}>${esc(s.name)}${oc?` <span class="hint">(في ${esc(oc.name)})</span>`:""}</label>`}).join("")}</div><span class="hint">الطالب يكون في حلقة واحدة؛ اختياره هنا ينقله من حلقته السابقة.</span>`:'<span class="hint">لا طلاب بعد.</span>'}</fieldset>`;
  openModal(c.id?"تعديل الحلقة":"حلقة جديدة",body,"circle",{id:c.id},"حفظ",c.id?`<button type="button" class="btn danger" data-act="delCircle" data-id="${c.id}">حذف الحلقة</button>`:"");
}

/* ============ البرامج ============ */
function visiblePrograms(m){
  if(isStaff(m))return S.programs;
  const vis=S.programs.filter(p=>!p.hidden);
  const ids=m.role==="student"?[m.id]:(m.childIds||[]);
  return vis.filter(p=>ids.some(id=>{const s=get("members",id);return p.audience==="all"||(p.audience==="selected"?(p.studentIds||[]).includes(id):s&&p.audience===s.track)}));
}
const progOf=(sid,pid)=>(get("progress",`${sid}__${pid}`)||{done:[]}).done||[];
function programsView(m){
  if(isStaff(m)&&ui.ptab==="schedule")return programsTabs()+scheduleView(m);
  const P=visiblePrograms(m);
  return `${isStaff(m)?programsTabs():""}<div class="hero"><div><h1>البرامج العلمية</h1><div class="date">تفسير، تجويد، متون، تدبر… مع الدروس والمرفقات</div></div>${isStaff(m)?`<button class="btn pri" data-act="newProgram">برنامج جديد</button>`:""}</div>
  ${P.length?`<div class="grid g3">${P.map(p=>{const L=p.lessons||[];const mine=m.role==="student"?progOf(m.id,p.id).length:null;return `<div class="card clickable" data-act="openProgram" data-id="${p.id}" style="${p.hidden?"opacity:.6":""}"><div class="row between" style="margin-bottom:6px"><span class="row"><span class="pill p-acc">${PKIND[p.kind]||"عام"}</span>${p.hidden?'<span class="pill">مخفي عن الطلاب</span>':""}</span><span class="small muted">${L.length} درس</span></div><h3>${esc(p.title)}</h3><p class="small muted" style="margin-top:4px">${esc((p.description||"").slice(0,120))}</p>${mine!=null?`<div style="margin-top:10px">${pbar(mine,L.length)}<div class="small muted">أنجزت ${mine} من ${L.length}</div></div>`:`<div class="small muted" style="margin-top:8px">${p.audience==="all"?"لكل الطلاب":p.audience==="selected"?(p.studentIds||[]).length+" طالب":TRACK[p.audience]}</div>`}</div>`}).join("")}</div>`:empty(isStaff(m)?"لا برامج بعد. أنشئ برنامجاً مثل «تفسير جزء عم» وأضف له الدروس والمرفقات.":"لا برامج مسندة إليك حالياً.")}`;
}
function programsTabs(){return `<div class="subtabs"><button data-act="ptab" data-v="programs" class="${ui.ptab!=="schedule"?"on":""}">البرامج</button><button data-act="ptab" data-v="schedule" class="${ui.ptab==="schedule"?"on":""}">جداول الطلاب</button></div>`}
const tkLabel=t=>{if(t.programId&&get("programs",t.programId))return get("programs",t.programId).title;return ["hifz","murajaa","tilawa"].includes(t.kind)?KIND[t.kind]:(t.title||KIND[t.kind])};
function scheduleView(m){
  const wk=ui.wk||addDays(today(),-dow(today()));const days=[...Array(7)].map((_,i)=>addDays(wk,i));const td=today();
  const st=scoped(m);
  const fk=t=>ui.skind==="all"||(ui.skind==="programs"?!!t.programId||t.kind==="program"||t.kind==="tafsir":ui.skind==="hifz"?t.kind==="hifz"||t.kind==="murajaa":t.kind===ui.skind);
  const by={};st.forEach(s=>{const k=s.circleId&&get("circles",s.circleId)?s.circleId:"";(by[k]=by[k]||[]).push(s)});
  const keys=Object.keys(by).sort((a,b)=>!a?1:!b?-1:get("circles",a).name.localeCompare(get("circles",b).name,"ar"));
  const row=s=>{let D=0,N=0;const cells=days.map(d=>{const T=S.tasks.filter(t=>t.studentId===s.id&&t.date===d&&fk(t));T.forEach(t=>{N++;if(t.done)D++});
    return `<td class="${d===td?"today":""}">${T.map(t=>{const st2=t.done?"done":d<td?"miss":"open";return `<button class="tk tk-${st2}" data-act="toggleTask" data-id="${t.id}" title="${esc(t.title)}"><b>${t.done?"✓":st2==="miss"?"✗":"○"}</b><span>${esc(tkLabel(t).slice(0,16))}</span></button>`}).join("")}<button class="addc" data-act="newTaskAt" data-sid="${s.id}" data-d="${d}" aria-label="إضافة مهمة">+</button></td>`}).join("");
    return `<tr><td class="sn"><a href="#student" data-act="openStudent" data-id="${s.id}" style="color:inherit;text-decoration:none">${esc(s.name)}</a></td>${cells}<td><span class="pill ${N&&D===N?"p-ok":D?"p-pri":N?"p-bad":""}">${D}/${N}</span></td></tr>`};
  return `<div class="hero"><div><h1>جداول الطلاب</h1><div class="date">أسبوع ${fmtShort(days[0])} ← ${fmtShort(days[6])}</div></div><div class="toolbar"><button class="btn sm" data-act="wk" data-n="-7">→ الأسبوع السابق</button><button class="btn sm" data-act="wk" data-n="0">هذا الأسبوع</button><button class="btn sm" data-act="wk" data-n="7">الأسبوع التالي ←</button></div></div>
  <div class="toolbar"><select data-change="schedKind" id="sk">${[["all","كل المهام"],["programs","البرامج المصاحبة فقط"],["hifz","الحفظ والمراجعة"],["tilawa","التلاوة"]].map(([k,l])=>`<option value="${k}" ${ui.skind===k?"selected":""}>${l}</option>`).join("")}</select>${teacherFilter(m)}${circleFilter(m)}<button class="btn sm pri" data-act="newTask">مهمة لعدة طلاب</button></div>
  <div class="legend"><span><b style="color:var(--ok)">✓</b> منجزة</span><span><b style="color:var(--bad)">✗</b> لم تُنجز (فات يومها)</span><span><b>○</b> قادمة أو اليوم</span><span>اضغط المهمة لتبديل حالتها، و«+» لإضافة مهمة في ذلك اليوم.</span></div>
  ${st.length?`<div class="tbl-wrap"><table class="sched"><thead><tr><th class="sn">الطالب</th>${days.map(d=>`<th class="${d===td?"today":""}">${fmtD(d,{weekday:"long"})}<br><span class="num">${fmtD(d,{day:"numeric",month:"numeric"})}</span></th>`).join("")}<th>الإنجاز</th></tr></thead><tbody>
  ${keys.map(k=>`${keys.length>1||k?`<tr class="grp"><td colspan="9">${k?esc(get("circles",k).name):"بدون حلقة"} · ${by[k].length} طالب</td></tr>`:""}${by[k].map(row).join("")}`).join("")}</tbody></table></div>`:empty("لا يوجد طلاب.")}`;
}
function studentPrograms(s){
  const P=S.programs.filter(p=>!p.hidden).filter(p=>p.audience==="all"||(p.audience==="selected"?(p.studentIds||[]).includes(s.id):p.audience===s.track));
  return P.length?`<div class="stack">${P.map(p=>{const d=progOf(s.id,p.id).length,L=(p.lessons||[]).length;return `<div class="li clickable" data-act="openProgram" data-id="${p.id}"><div class="grow"><div class="t">${esc(p.title)}</div>${pbar(d,L)}</div><span class="small num">${d}/${L}</span></div>`}).join("")}</div>`:empty("لا برامج لهذا الطالب.");
}
function programDetail(pid){
  const p=get("programs",pid);if(!p)return empty("البرنامج غير موجود.");
  const m=me();const staff=isStaff(m);const L=p.lessons||[];
  const students=allStudents().filter(s=>p.audience==="all"||(p.audience==="selected"?(p.studentIds||[]).includes(s.id):p.audience===s.track)).filter(s=>!staff||inScope(m,s));
  const done=m.role==="student"?progOf(m.id,p.id):[];
  return `<div><button class="btn ghost sm" data-act="go" data-v="programs">→ رجوع للبرامج</button></div>
  <div class="card"><div class="row between"><div><span class="pill p-acc">${PKIND[p.kind]||"عام"}</span><h1 style="margin-top:6px">${esc(p.title)}</h1></div>${staff?`<div class="row"><button class="btn sm pri" data-act="newLesson" data-id="${p.id}">إضافة درس</button><button class="btn sm" data-act="editProgram" data-id="${p.id}">تعديل البرنامج</button><button class="btn sm" data-act="hideProgram" data-id="${p.id}">${p.hidden?"إظهار للطلاب":"إخفاء عن الطلاب"}</button></div>`:""}</div>${p.hidden&&staff?`<p class="small" style="margin-top:8px;color:var(--warn)">هذا البرنامج مخفي حالياً: لا يراه الطلاب ولا أولياء الأمور، ومهامه السابقة تبقى في سجلاتهم.</p>`:""}${p.description?`<p class="muted" style="margin-top:8px;white-space:pre-wrap">${esc(p.description)}</p>`:""}
  ${m.role==="student"?`<div style="margin-top:12px">${pbar(done.length,L.length)}<div class="small muted">أنجزت ${done.length} من ${L.length} درس</div></div>`:""}</div>
  <div class="stack">${L.length?L.map((l,i)=>{const isDone=done.includes(l.id);const cnt=staff?students.filter(s=>progOf(s.id,p.id).includes(l.id)).length:0;return `<div class="lesson"><div class="row between"><div class="row"><span class="rank">${i+1}</span><h3>${esc(l.title)}</h3>${l.date?`<span class="small muted">${fmtShort(l.date)}</span>`:""}</div>${m.role==="student"?`<button class="btn sm ${isDone?"":"pri"}" data-act="lessonDone" data-pid="${p.id}" data-id="${l.id}">${isDone?"✓ أنجزته":"أنهيت الدرس"}</button>`:staff?`<div class="row"><span class="small muted">أنجزه ${cnt}/${students.length}</span><button class="btn sm" data-act="lessonTask" data-pid="${p.id}" data-id="${l.id}">${S.tasks.some(t=>t.lessonId===l.id)?"أُرسل كمهمة ✓ إعادة":"إرسال كمهمة"}</button><button class="btn ghost sm" data-act="editLesson" data-pid="${p.id}" data-id="${l.id}">تعديل</button></div>`:""}</div>${l.body?`<div class="lesson-body">${esc(l.body)}</div>`:""}<div class="row">${l.link?`<a class="btn sm" href="${esc(l.link)}" target="_blank" rel="noopener">فتح الرابط ↗</a>`:""}${l.fileUrl?`<a class="btn sm" href="${esc(l.fileUrl)}" target="_blank" rel="noopener">المرفق: ${esc(l.fileName||"ملف")} ↗</a>`:""}</div></div>`}).join(""):empty("لا دروس بعد.")}</div>`;
}

/* ============ الطالب ============ */
function recordView(sid){
  const c=cfg();
  if(!c.studentSeeReport)return `<div class="app-stack"><h1>سجلي</h1>${logsCards(get("members",sid),logsOf(sid).slice(0,40),"student")}</div>`;
  return `<div class="app-stack"><div class="hero"><h1>سجلي وتقريري</h1></div>${periodPicker()}${reportInner(sid,curRange(sid),false)}</div>`;
}

/* ============ التقارير ============ */
function earliestLog(sid){let mn=null;S.logs.forEach(l=>{if((!sid||l.studentId===sid)&&(!mn||l.date<mn))mn=l.date});return mn}
function curRange(sid){
  const t=today();
  if(ui.pm==="custom"){if(ui.cmode==="range"&&ui.from&&ui.to){let f=ui.from,e=ui.to;if(f>e)[f,e]=[e,f];return[f,e]}return monthRange(ui.month)}
  if(ui.pm==="all"){const c=cfg();const st=sid&&get("members",sid);const f=c.termStart||(st&&st.plan&&st.plan.startDate)||earliestLog(sid)||addDays(t,-30);const e=c.termEnd&&c.termEnd<t?c.termEnd:t;return[f,e]}
  return monthRange(t.slice(0,7));
}
function periodLabel(r){r=r||curRange();const c=cfg();const lb={this:"هذا الشهر",custom:ui.cmode==="range"&&ui.from&&ui.to?"مخصص":"مخصص ("+monthName(ui.month)+")",all:"كامل "+(c.termName||"البرنامج")}[ui.pm]||"";return `${lb}: ${fmtShort(r[0])} ← ${fmtShort(r[1])}`}
function periodPicker(){
  const c=cfg();const opts=[["this","هذا الشهر"],["custom","مخصص"],["all","كامل "+(c.termName||"البرنامج")]];
  return `<div class="card period"><div class="row" style="gap:10px"><span class="small muted">فترة التقرير</span><div class="seg pseg">${opts.map(([k,l])=>`<button data-act="pm" data-v="${k}" class="${ui.pm===k?"on":""}">${l}</button>`).join("")}</div>
  ${ui.pm==="custom"?`<div class="row custom-box"><label class="row small ${ui.cmode!=="range"?"act":""}">الشهر <input type="month" id="mp" value="${ui.month}" data-change="month"></label><span class="small muted">أو</span><label class="row small ${ui.cmode==="range"?"act":""}">من <input type="date" id="pf" value="${ui.from||""}" data-change="pfrom"></label><label class="row small ${ui.cmode==="range"?"act":""}">إلى <input type="date" id="pt" value="${ui.to||""}" data-change="pto"></label>${ui.cmode==="range"&&!(ui.from&&ui.to)?'<span class="hint">أكمل التاريخين، وحتى ذلك يُعرض الشهر المختار</span>':""}</div>`:""}
  </div><div class="small muted" style="margin-top:6px">${periodLabel()}${ui.pm==="all"&&!c.termStart?" · حدّد تاريخ بداية البرنامج من «الإدارة» ليكون التقرير أدق":""}</div></div>`;
}
function monthPicker(){return periodPicker()}
function reportsView(m){
  const st=scoped(m);const[f,t]=curRange();
  const rows=st.map(s=>({s,x:stats(s.id,...(ui.pm==="all"?curRange(s.id):[f,t]))}));
  const tabs=`<div class="subtabs"><button data-act="rtype" data-v="students" class="${ui.rtype==="students"?"on":""}">تقرير الطلاب</button><button data-act="rtype" data-v="programs" class="${ui.rtype==="programs"?"on":""}">تقرير البرامج المصاحبة</button></div>`;
  if(ui.rtype==="programs")return `<div class="hero"><h1>التقارير</h1></div>${tabs}${periodPicker()}${programsReport(m)}`;
  return `<div class="hero"><h1>التقارير</h1><div class="toolbar"><select data-change="rstudent" id="rs"><option value="">تقرير طالب محدد…</option>${st.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select>${teacherFilter(m)}${circleFilter(m)}<button class="btn" data-act="xlsAll">${ICON.xls} Excel</button><button class="btn" data-act="pdfAll">${ICON.pdf} PDF</button><button class="btn" data-act="copyAll">نسخ الملخص</button></div></div>${tabs}${periodPicker()}
  <div class="stats"><div class="stat"><b>${rows.length}</b><span>طالب</span></div><div class="stat"><b>${(()=>{const r=rows.filter(r=>r.x.rate!=null);return r.length?Math.round(r.reduce((a,b)=>a+b.x.rate,0)/r.length)+"%":"—"})()}</b><span>متوسط الحضور</span></div><div class="stat"><b>${rows.reduce((a,r)=>a+r.x.newPages,0)}</b><span>أوجه حفظ جديد</span></div><div class="stat"><b>${rows.reduce((a,r)=>a+r.x.tPages,0)}</b><span>أوجه تلاوة</span></div><div class="stat"><b>${rows.reduce((a,r)=>a+r.x.done,0)}/${rows.reduce((a,r)=>a+r.x.tasks,0)}</b><span>مهام منجزة</span></div></div>
  ${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>الطالب</th><th>المسار</th><th>الحضور</th><th>غياب</th><th>حفظ جديد</th><th>مراجعة</th><th>تلاوة</th><th>أخطاء ج/خ</th><th>متوسط التقدير</th><th>المهام</th><th>التسميع</th><th>النقاط</th></tr></thead><tbody>
  ${rows.map(({s,x})=>`<tr class="clickable" data-act="openReport" data-id="${s.id}"><td><b>${esc(s.name)}</b></td><td>${s.track==="tilawa"?"تلاوة":"حفظ"}</td><td class="num">${x.rate==null?"—":x.rate+"%"}</td><td class="num">${x.att.absent}</td><td class="num">${x.newPages}</td><td class="num">${x.revPages}</td><td class="num">${x.tPages}</td><td class="num">${x.errJ}/${x.errK}</td><td><span class="pill ${gradeCls(x.avg)}">${x.avg?x.avg.toFixed(1)+" "+gradeTxt(x.avg):"—"}</span></td><td class="num">${x.done}/${x.tasks}</td><td class="num">${x.sess}</td><td class="num"><b>${x.points}</b></td></tr>`).join("")}</tbody></table></div><p class="hint">اضغط اسم الطالب لفتح تقريره المفصّل. النقاط = مهمة منجزة (1) + يوم حضور (2) + تقدير ممتاز (3).</p>`:empty("لا يوجد طلاب.")}`;
}
function programsReport(m){
  const[f,t]=curRange();const P=visiblePrograms(m);
  if(!P.length)return empty("لا برامج مصاحبة بعد.");
  return P.map(p=>{const st=programStudents(p);const L=p.lessons||[];
    const T=S.tasks.filter(x=>x.programId===p.id&&x.date>=f&&x.date<=t);
    const avg=st.length&&L.length?Math.round(st.reduce((a,s)=>a+progOf(s.id,p.id).filter(id=>L.some(l=>l.id===id)).length,0)/(st.length*L.length)*100):0;
    return `<div class="card"><div class="card-h"><div><span class="pill p-acc">${PKIND[p.kind]||"عام"}</span>${p.hidden?' <span class="pill">مخفي</span>':""}<h2 style="margin-top:4px">${esc(p.title)}</h2></div><div class="row"><button class="btn sm" data-act="xlsProg" data-id="${p.id}">${ICON.xls} Excel</button><button class="btn sm" data-act="pdfProg" data-id="${p.id}">${ICON.pdf} PDF</button><button class="btn sm" data-act="copyProgram" data-id="${p.id}">نسخ</button></div></div>
    <div class="stats" style="margin-bottom:12px"><div class="stat"><b>${L.length}</b><span>درس</span></div><div class="stat"><b>${st.length}</b><span>طالب مسجّل</span></div><div class="stat"><b>${avg}%</b><span>متوسط إنجاز الدروس</span></div><div class="stat"><b>${T.filter(x=>x.done).length}/${T.length}</b><span>مهام البرنامج في الفترة</span></div></div>
    ${st.length&&L.length?`<div class="tbl-wrap"><table><thead><tr><th>الطالب</th>${L.map((l,i)=>`<th title="${esc(l.title)}">${i+1}. ${esc(l.title.slice(0,18))}</th>`).join("")}<th>الإنجاز</th></tr></thead><tbody>${st.map(s=>{const d=progOf(s.id,p.id);const n=L.filter(l=>d.includes(l.id)).length;return `<tr><td><b>${esc(s.name)}</b></td>${L.map(l=>`<td style="text-align:center">${d.includes(l.id)?'<span style="color:var(--ok);font-weight:700">✓</span>':'<span class="muted">—</span>'}</td>`).join("")}<td><span class="pill ${n===L.length?"p-ok":n?"p-pri":""}">${Math.round(n/L.length*100)}%</span></td></tr>`}).join("")}</tbody></table></div>`:empty("لا طلاب أو دروس في هذا البرنامج.")}</div>`}).join("");
}
function programReportText(pid){const p=get("programs",pid);const st=programStudents(p);const L=p.lessons||[];
  return `تقرير برنامج «${p.title}» — ${cfg().circleName}\nعدد الدروس: ${L.length}\n\n`+st.map(s=>{const d=progOf(s.id,p.id);const n=L.filter(l=>d.includes(l.id)).length;return `${s.name}: ${n} من ${L.length} (${L.length?Math.round(n/L.length*100):0}%)`}).join("\n")}
function reportDetail(sid,staff){
  const s=get("members",sid);if(!s)return empty("غير موجود");
  return `<div><button class="btn ghost sm" data-act="go" data-v="${staff?"reports":"child"}">→ رجوع</button></div><div class="hero"><h1>تقرير ${esc(s.name)}</h1></div>${periodPicker()}`+reportInner(sid,curRange(sid),staff);
}
function reportInner(sid,[f,t],staff,compact){
  const s=get("members",sid);const x=stats(sid,f,t);const c=cfg();const isT=s.track==="tilawa";
  const showG=staff||c.studentSeeGrades;
  return `<div class="stack" style="gap:14px"><div class="row between"><span class="muted">الفترة: ${fmtShort(f)} ← ${fmtShort(t)}</span><div class="row">${staff?"":`<span></span>`}<button class="btn sm" data-act="xlsOne" data-id="${sid}">${ICON.xls} Excel</button><button class="btn sm" data-act="pdfOne" data-id="${sid}">${ICON.pdf} PDF</button><button class="btn sm" data-act="copyOne" data-id="${sid}">نسخ التقرير</button>${staff?`<button class="btn sm" data-act="copyParent" data-id="${sid}">نسخ تقرير ولي الأمر</button>`:""}</div></div>
  <div class="stats"><div class="stat"><b>${x.rate==null?"—":x.rate+"%"}</b><span>نسبة الحضور</span></div><div class="stat"><b>${x.att.present}/${x.att.late}/${x.att.absent}/${x.att.excused}</b><span>حاضر/متأخر/غائب/مستأذن</span></div>
  ${isT?`<div class="stat"><b>${x.tPages}</b><span>أوجه التلاوة</span></div><div class="stat"><b>${x.errJ}/${x.errK}</b><span>أخطاء جلية/خفية</span></div>`:`<div class="stat"><b>${x.newPages}</b><span>أوجه الحفظ الجديد</span></div><div class="stat"><b>${x.revPages}</b><span>أوجه المراجعة</span></div>`}
  ${showG?`<div class="stat"><b>${x.avg?x.avg.toFixed(1):"—"}</b><span>متوسط التقدير ${x.avg?"("+gradeTxt(x.avg)+")":""}</span></div>`:""}<div class="stat"><b>${x.done}/${x.tasks}</b><span>المهام المنجزة</span></div><div class="stat"><b>${x.sess}</b><span>جلسات تسميع</span></div>${c.showPoints?`<div class="stat"><b>${x.points}</b><span>النقاط</span></div>`:""}</div>
  ${(()=>{const tj={};x.logs.forEach(l=>(l.tajweed||[]).forEach(k=>tj[k]=(tj[k]||0)+1));const k=Object.entries(tj).sort((a,b)=>b[1]-a[1]);return k.length&&(staff||c.studentSeeNotes)?`<div class="card"><h3 style="margin-bottom:8px">أحكام تكرر التنبيه عليها</h3><div class="chips">${k.map(([n,v])=>`<span class="pill p-warn">${n} × ${v}</span>`).join("")}</div></div>`:""})()}
  ${(()=>{const E=examsOf(sid,f,t);return E.length?`<div class="card"><div class="card-h"><h3>الاختبارات في الفترة</h3><span class="pill p-pri">المتوسط ${Math.round(E.reduce((a,e)=>a+n0(e.score),0)/E.length)}</span></div>${examsTable(E,false)}</div>`:""})()}
  ${staff?logsTable(s,x.logs,staff):logsCards(s,x.logs,me().role==="parent"?"parent":"student")}</div>`;
}
function reportText(sid,[f,t],forParent){
  const s=get("members",sid),x=stats(sid,f,t),isT=s.track==="tilawa";
  return `تقرير ${s.name} — ${cfg().circleName}\nالفترة: ${f} إلى ${t}\nالمسار: ${TRACK[s.track]}\nالحضور: ${x.rate==null?"—":x.rate+"%"} (غياب ${x.att.absent}، تأخر ${x.att.late}، استئذان ${x.att.excused})\n${isT?`التلاوة: ${x.tPages} وجه · الأخطاء: ${x.errJ} جلي / ${x.errK} خفي`:`الحفظ الجديد: ${x.newPages} وجه · المراجعة: ${x.revPages} وجه`}\nمتوسط التقدير: ${x.avg?x.avg.toFixed(1)+" ("+gradeTxt(x.avg)+")":"—"}\nالمهام: ${x.done} من ${x.tasks} · جلسات التسميع: ${x.sess}\nإجمالي ${isT?"المقروء":"المحفوظ"}: ${totalPages(s)} وجه${forParent?(()=>{const ns=x.logs.filter(l=>nP(l)).map(l=>`• ${l.date}: ${nP(l)}`);return (s.msgParent?`\n\nملاحظة المعلم: ${s.msgParent}`:"")+(ns.length?`\n\nملاحظات المتابعة:\n${ns.join("\n")}`:"")})():""}`;
}
function boardView(m){
  const[f,t]=curRange();let rows=allStudents().map(s=>({s,x:stats(s.id,f,t)})).sort((a,b)=>b.x.points-a.x.points);
  if(MODE==="live"&&!isStaff(m)){loadLB(f,t);rows=(LB.rows||[]).map(r=>({s:{id:r.id,name:r.name,track:r.track},x:{points:r.points,tPages:+r.t_pages,newPages:+r.new_pages,rate:r.rate}}));
    if(!LB.rows)return `<div class="hero"><h1>لوحة الشرف</h1></div>${periodPicker()}${empty("جاري التحميل…")}`}
  return `<div class="hero"><div><h1>لوحة الشرف</h1><div class="date">${isStaff(m)?`${cfg().leaderboard?"ظاهرة للطلاب":"مخفية عن الطلاب حالياً"}`:""}</div></div></div>${periodPicker()}
  <div class="card">${rows.length?`<div class="list">${rows.map((r,i)=>`<div class="li"><span class="rank ${i===0&&r.x.points?"r1":""}">${i+1}</span><div class="grow"><div class="t">${esc(r.s.name)}${r.s.id===m.id?' <span class="pill p-acc">أنت</span>':""}</div><div class="small muted">${TRACK[r.s.track]} · ${r.s.track==="tilawa"?r.x.tPages+" وجه تلاوة":r.x.newPages+" وجه حفظ"} · حضور ${r.x.rate==null?"—":r.x.rate+"%"}</div></div><b class="num">${r.x.points}</b><span class="small muted">نقطة</span></div>`).join("")}</div>`:empty("لا بيانات.")}</div><p class="hint">النقاط = مهمة منجزة (1) + يوم حضور (2) + تقدير ممتاز (3).</p>`;
}

/* ============ الإعدادات ============ */
function settingsView(m){
  const c=cfg();
  const prof=`<div class="card"><div class="card-h"><h2>حسابي</h2></div><form class="stack" data-form="profile"><div class="fg">${fld("الاسم",inp("name",m.name,"text","required"))}${fld("الجوال",inp("phone",m.phone,"tel"))}</div>${fld("رابط الاجتماع الثابت (Google Meet أو Zoom)",inp("meetLink",m.meetLink,"url","placeholder='https://meet.google.com/abc-defg-hij'"),"أنشئ اجتماعاً متكرراً في Google Meet أو Zoom والصق رابطه هنا. يظهر لطلابك ويُملأ تلقائياً في المواعيد.")}<div class="row"><button class="btn pri">حفظ</button><button type="button" class="btn" data-act="changePass">تغيير كلمة المرور</button><button type="button" class="btn danger" data-act="logout">تسجيل الخروج</button><a class="btn" href="https://meet.google.com/new" target="_blank" rel="noopener">${ICON.video} إنشاء Meet</a><a class="btn" href="https://zoom.us/meeting/schedule" target="_blank" rel="noopener">${ICON.video} إنشاء Zoom</a></div></form></div>`;
  if(!can(m,"members.manage")&&!can(m,"settings.manage")){
    const pend=can(m,"members.approve")?S.members.filter(x=>x.status==="pending"&&x.role==="student"):[];
    return `<h1>حسابي</h1>${prof}${pend.length?`<div class="card"><div class="card-h"><h2>طلبات تسجيل الطلاب</h2></div><div class="list">${pend.map(x=>`<div class="li"><div class="grow"><div class="t">${esc(x.name)}</div><div class="small muted">${TRACK[x.track]||""} ${esc(x.note||"")}</div></div><button class="btn sm pri" data-act="approve" data-id="${x.id}">اعتماد</button></div>`).join("")}</div></div>`:""}`;
  }
  const sw=(k,l,h)=>`<label class="switch"><span><b>${l}</b>${h?`<br><span class="hint">${h}</span>`:""}</span><input type="checkbox" data-change="cfg" data-k="${k}" id="cfg-${k}" ${c[k]?"checked":""}></label>`;
  const order={pending:0,active:1,disabled:2};
  const mem=[...S.members].sort((a,b)=>(order[a.status]-order[b.status])||a.role.localeCompare(b.role)||a.name.localeCompare(b.name,"ar"));
  return `<h1>الإدارة</h1>
  <div class="grid g2">${prof}
  ${can(m,"settings.manage")?`<div class="card"><div class="card-h"><h2>الحلقة والخصوصية</h2></div><form class="stack" data-form="circleName" style="margin-bottom:10px"><div class="fg">${fld("اسم المنصة / البرنامج",inp("circleName",c.circleName,"text","required"),"يظهر أعلى الموقع. والحلقات نفسها تُدار من «الحلقات»")}${fld("اسم البرنامج / الفصل",inp("termName",c.termName,"text","placeholder='مثال: الفصل الأول 1448'"))}</div><div class="fg">${fld("بداية البرنامج",inp("termStart",c.termStart,"date"))}${fld("نهاية البرنامج",inp("termEnd",c.termEnd,"date"))}</div><span class="hint">تُستخدم في تقرير «كامل البرنامج».</span><div><button class="btn sm pri">حفظ</button></div></form>
  ${sw("studentSeeGrades","إظهار التقديرات للطالب","تقدير الحفظ والمراجعة والأداء في سجله")}${sw("studentSeeNotes","إظهار ملاحظات المعلم للطالب")}${sw("studentSeeReport","إظهار التقرير الشهري للطالب")}${sw("parentsEnabled","تفعيل حسابات أولياء الأمور")}${sw("parentSeeReport","إظهار التقرير الكامل لولي الأمر")}${sw("parentSeeNotes","إظهار الملاحظات لولي الأمر")}${sw("showPoints","نظام النقاط","يظهر للطالب نقاطه الشهرية")}${sw("leaderboard","لوحة الشرف للطلاب","ترتيب الطلاب بالنقاط ظاهر للجميع")}</div>`:""}</div>
  ${can(m,"perms.manage")?`<div class="card"><div class="card-h"><h2>النسخ الاحتياطي</h2><button class="btn sm pri" data-act="backup">تنزيل نسخة احتياطية</button></div><p class="small muted">ملف واحد فيه كل بيانات المنصة (الأعضاء، الحلقات، السجلات، المهام، الاختبارات، الإعدادات…). احفظه دورياً. ويمكنك استيراد نسخة احتياطية (مثلاً من نسخة المنصة التجريبية) لتُضاف إلى البيانات الحالية.</p><div class="row" style="margin-top:8px"><label class="btn sm">استيراد نسخة احتياطية<input type="file" accept="application/json,.json" id="imp-file" data-change="importFile" hidden></label></div></div>`:""}
  ${can(m,"members.manage")?`<div class="card"><div class="card-h"><h2>الأعضاء</h2><div class="row"><button class="btn sm pri" data-act="addStudent">إضافة طالب</button><button class="btn sm" data-act="addMember">إضافة عضو</button></div></div>
  <div class="tbl-wrap"><table><thead><tr><th>الاسم</th><th>الصفة</th><th>الحالة</th><th>المسار</th><th>المعلم / الأبناء</th><th>الحساب</th><th></th></tr></thead><tbody>${mem.map(x=>`<tr><td><b>${esc(x.name)}</b>${x.note?`<div class="small muted" style="white-space:normal;max-width:240px">${esc(x.note)}</div>`:""}</td><td>${ROLE[x.role]||x.role}${(x.circleIds||[]).length&&["supervisor","assistant"].includes(x.role)?`<div class="small muted">${esc(x.circleIds.map(id=>(get("circles",id)||{}).name).filter(Boolean).join("، "))}</div>`:""}${Object.keys(x.permOverrides||{}).length?' <span class="pill p-acc">صلاحيات خاصة</span>':""}</td><td><span class="pill ${x.status==="active"?"p-ok":x.status==="pending"?"p-warn":""}">${x.status==="active"?"نشط":x.status==="pending"?"بانتظار الاعتماد":"موقوف"}</span></td><td>${x.role==="student"?(x.track==="tilawa"?"تلاوة":"حفظ"):"—"}</td><td>${x.role==="student"?esc(nameOf(x.teacherId)):x.role==="parent"?esc((x.childIds||[]).map(nameOf).join("، ")||"—"):"—"}</td><td>${x.uid?(x.username?`<span class="small">اسم المستخدم: <b dir="ltr">${esc(x.username)}</b></span>`:(x.email?`<span class="small" dir="ltr">${esc(x.email)}</span>`:"مرتبط")):(x.role!=="director"&&x.status!=="pending"?`<button class="btn sm" data-act="acctCreate" data-id="${x.id}">إنشاء حساب</button>`:"بدون حساب")}${x.uid&&x.username?` <button class="btn ghost sm" data-act="acctReset" data-id="${x.id}">كلمة مرور جديدة</button>`:""}</td><td><div class="row">${x.status==="pending"?`<button class="btn sm pri" data-act="approve" data-id="${x.id}">اعتماد</button>`:""}<button class="btn ghost sm" data-act="editMember" data-id="${x.id}">تعديل</button></div></td></tr>`).join("")}</tbody></table></div>
  <p class="hint" style="margin-top:8px">لدعوة المعلمين والطلاب: من زر المشاركة في أعلى الصفحة أضفهم أو فعّل الوصول بالرابط بصلاحية «مساهم» (Contributor)، ثم أرسل لهم الرابط ليسجّلوا.</p></div>`:""}`;
}
function memberForm(x,forceRole){
  const m=me();x=x||{role:forceRole||"student",status:"active",track:"hifz",teacherId:["teacher"].includes(m.role)?m.id:""};
  const role=x.role;const admin=can(m,"members.manage");const pm=can(m,"perms.manage");
  if(x.id&&x.role!=="student"&&!admin){toast("تعديل هذا العضو يحتاج صلاحية إدارة الأعضاء","err");return}
  const roleOpts=Object.entries(ROLE).filter(([k])=>k!=="director"||pm);
  const staffR=STAFF_ROLES.filter(r=>r!=="director");
  const unlinked=S.members.filter(s=>!s.uid&&s.id!==x.id&&s.role===x.role&&s.status!=="pending");
  const body=`<div class="fg">${fld("الاسم",inp("name",x.name,"text","required"))}${admin?fld("الصفة",sel("role",roleOpts,role,`data-change="mrole"`)):`<input type="hidden" name="role" value="${role}">`}${admin?fld("الحالة",sel("status",[["active","نشط"],["pending","بانتظار الاعتماد"],["disabled","موقوف"]],x.status)):`<input type="hidden" name="status" value="${x.status==="pending"?"active":x.status}">`}</div>
  <div id="role-student" ${role==="student"?"":"hidden"}><div class="fg">${fld("المسار",sel("track",[["hifz",TRACK.hifz],["tilawa",TRACK.tilawa]],x.track||"hifz"))}${fld("المعلم",sel("teacherId",[["","— اختر —"],...teachers().map(t=>[t.id,t.name])],x.teacherId||(admin?"":m.id)))}${fld("الحلقة",sel("circleId",[["","— بدون حلقة —"],...S.circles.map(c=>[c.id,c.name])],x.circleId||(ui.view==="circle"?ui.cid:"")))}${fld("جوال ولي الأمر",inp("guardianPhone",x.guardianPhone,"tel"))}${fld("العمر / المرحلة",inp("level",x.level))}</div>
  </div>
  <div id="role-parent" ${role==="parent"?"":"hidden"}><div class="small muted" style="margin-bottom:6px">الأبناء</div><div class="chips">${allStudents().map(s=>`<label><input type="checkbox" name="childIds" value="${s.id}" ${(x.childIds||[]).includes(s.id)?"checked":""}>${esc(s.name)}</label>`).join("")||'<span class="hint">لا طلاب بعد</span>'}</div></div>
  <div id="role-teach" ${role==="teacher"&&(admin||can(m,"circles.manage"))?"":"hidden"}><div class="small muted" style="margin-bottom:6px">الحلقات التي يدرّسها <span class="hint">(يصبح معلم الحلقة)</span></div><div class="chips">${S.circles.map(c=>`<label><input type="checkbox" name="teachCircles" value="${c.id}" ${x.id&&c.teacherId===x.id?"checked":""}>${esc(c.name)}${c.teacherId&&c.teacherId!==x.id?` <span class="hint">(حالياً: ${esc(nameOf(c.teacherId))})</span>`:""}</label>`).join("")||'<span class="hint">لا حلقات بعد. أنشئها من «الحلقات».</span>'}</div><input type="hidden" name="teachSync" value="1"></div>
  <div id="role-circles" ${staffR.includes(role)?"":"hidden"}><div class="small muted" style="margin-bottom:6px">الحلقات المسندة إليه <span class="hint">(لمشرف الحلقات والمعلم المساعد، ولمن يُقيَّد تحضيره بحلقته)</span></div><div class="chips">${S.circles.map(c=>`<label><input type="checkbox" name="circleIds" value="${c.id}" ${(x.circleIds||[]).includes(c.id)?"checked":""}>${esc(c.name)}</label>`).join("")||'<span class="hint">لا حلقات بعد</span>'}</div></div>
  ${pm?`<details id="role-ov" class="ovbox" ${staffR.includes(role)?"":"hidden"} ${Object.keys(x.permOverrides||{}).length||x.scopeOverride||x.attScopeOverride?"open":""}><summary>صلاحيات خاصة لهذا الشخص <span class="hint">(تتجاوز صلاحيات دوره)</span></summary>
   <div class="fg" style="margin-top:8px">${fld("نطاق البيانات",sel("scopeOv",[["","حسب الدور"],...Object.entries(SCOPE)],x.scopeOverride||""))}${fld("نطاق التحضير",sel("attOv",[["","حسب الدور"],["data","كل من في نطاقه"],["circle","حلقته فقط"]],x.attScopeOverride||""),"«حلقته فقط»: الحلقات التي هو معلمها أو المسندة إليه أعلاه")}</div>
   <div class="ovgrid">${PERMS.map(([k,l])=>{const v=(x.permOverrides||{})[k];return `<label class="ovrow"><span>${l}</span><select name="ov_${k}" id="f-ov_${k}"><option value="" ${v==null?"selected":""}>حسب الدور</option><option value="1" ${v===true?"selected":""}>سماح</option><option value="0" ${v===false?"selected":""}>منع</option></select></label>`}).join("")}</div></details>`:""}
  ${x.status==="pending"&&x.uid&&unlinked.length?fld("ربط بسجل موجود (اختياري)",sel("linkTo",[["","— لا، سجل جديد —"],...unlinked.map(s=>[s.id,s.name])],""),"إذا كان له سجل سابق بدون حساب (مثلاً من النسخة الاحتياطية)، اربطه هنا ليحتفظ بسجله وخطته."):""}
  ${!x.id&&role==="student"?`<fieldset><legend>حساب الدخول</legend><label class="switch" style="border:0;padding:0"><span>إنشاء حساب دخول للطالب الآن <span class="hint">(للطالب الذي ليس لديه إيميل)</span></span><input type="checkbox" name="mkAcct" id="f-mkAcct" data-change="mkAcct"></label><div id="mk-box" class="fg" hidden>${fld("اسم المستخدم",inp("username","","text","dir='ltr' autocapitalize='off' autocomplete='off' placeholder='ahmad.salem'"),"حروف إنجليزية وأرقام فقط")}${fld("كلمة المرور",inp("password",genPass(),"text","dir='ltr' autocomplete='off' minlength=8"),"يمكنك تغييرها")}</div></fieldset>`:""}
  <div class="fg">${fld("الجوال",inp("phone",x.phone,"tel"))}</div>${x.email?`<p class="small muted">الإيميل: ${esc(x.email)}</p>`:""}${fld("ملاحظات",`<textarea name="note" id="f-note">${esc(x.note||"")}</textarea>`)}`;
  openModal(x.id?(x.status==="pending"?"اعتماد التسجيل":"تعديل البيانات"):role==="student"?"إضافة طالب":"إضافة عضو",body,"member",{id:x.id},x.status==="pending"?"اعتماد":"حفظ",x.id&&admin&&x.id!==m.id?`<button type="button" class="btn danger" data-act="delMember" data-id="${x.id}">حذف</button>`:"");
}
function planForm(s){
  const p=s.plan||{days:[0,1,2,3,4],startDate:today()};const isT=s.track==="tilawa";
  const body=`<p class="hint">${TRACK[s.track]} — يمكن تغيير المسار من «تعديل البيانات».</p>${fld("الهدف",inp("goal",p.goal,"text",isT?"placeholder='مثال: ختمة مجوّدة خلال الفصل'":"placeholder='مثال: حفظ جزء تبارك وعم خلال الفصل'"))}
  ${isT?`<div class="fg">${fld("المقدار اليومي",inp("dailyTilawa",p.dailyTilawa,"text","placeholder='مثال: وجهان'"))}${fld("أحكام التركيز",inp("focus",p.focus,"text","placeholder='مثال: المدود والغنة'"))}</div>`
  :`<div class="fg">${fld("الحفظ اليومي",inp("dailyNew",p.dailyNew,"text","placeholder='مثال: نصف وجه'"))}${fld("المراجعة اليومية",inp("dailyRev",p.dailyRev,"text","placeholder='مثال: جزء كامل'"))}${fld("اتجاه الحفظ",sel("direction",[["من الناس صعوداً","من الناس صعوداً"],["من البقرة نزولاً","من البقرة نزولاً"],["مخصص","مخصص"]],p.direction))}${fld("نقطة البداية",inp("startPoint",p.startPoint,"text","placeholder='مثال: سورة الملك'"))}</div>`}
  <div class="fg">${fld(isT?"المقروء سابقاً (وجه)":"المحفوظ سابقاً (وجه)",inp("basePages",p.basePages||0,"number","min=0"))}${fld("المستهدف (وجه)",inp("targetPages",p.targetPages||(isT?604:""),"number","min=0"),"المصحف 604 أوجه، والجزء 20 وجهاً تقريباً")}${fld("بداية الخطة",inp("startDate",p.startDate,"date"))}${fld("نهاية الخطة",inp("endDate",p.endDate,"date"))}</div>
  <div><div class="small muted" style="margin-bottom:6px">أيام الحلقة</div><div class="chips">${DAYS.map((d,i)=>`<label><input type="checkbox" name="days" value="${i}" ${(p.days||[]).includes(i)?"checked":""}>${d}</label>`).join("")}</div></div>`;
  openModal(`خطة ${esc(s.name)}`,body,"plan",{sid:s.id},"حفظ الخطة");
}
function taskForm(t,sid){
  t=t||{date:today(),kind:"hifz"};
  const body=`<div class="fg">${fld("التاريخ",inp("date",t.date,"date","required"))}${fld("النوع",sel("kind",Object.entries(KIND),t.kind))}</div>${fld("العنوان",inp("title",t.title,"text","required placeholder='مثال: حفظ سورة الملك 1–10'"))}${fld("التفاصيل",`<textarea name="details" id="f-details">${esc(t.details||"")}</textarea>`)}${fld("رابط (اختياري)",inp("link",t.link,"url","placeholder='https://'"),"مقطع تلاوة، ملف Drive، درس تفسير…")}
  ${ASSETS?fld("إرفاق ملف (صفحة تفسير، PDF، صورة، صوت)",`<input type="file" name="file" id="f-file" accept=".pdf,image/*,audio/*,video/*,.txt,.md,.csv">`,t.fileName?"المرفق الحالي: "+esc(t.fileName):"حتى 20 ميجابايت"):`<p class="hint">رفع الملفات متاح لمن لديه صلاحية «محرر» على الرابط، ويمكن وضع رابط Google Drive بدلاً منه.</p>`}
  ${t.id?"":(sid||t.studentId)?`<label class="switch" style="border:0"><span>إسناد المهمة نفسها لكل طلابي</span><input type="checkbox" name="all" id="f-all"></label>`:`<fieldset><legend>الطلاب</legend><label class="switch" style="border:0;padding:0"><span>كل طلابي${ui.circle!=="all"&&get("circles",ui.circle)?" في "+esc(get("circles",ui.circle).name):""}</span><input type="checkbox" name="all" id="f-all"></label><div class="chips">${scoped(me()).map(x=>`<label><input type="checkbox" name="sids" value="${x.id}">${esc(x.name)}</label>`).join("")}</div></fieldset>`}`;
  openModal(t.id?"تعديل المهمة":"مهمة جديدة",body,"task",{id:t.id,sid:t.studentId||sid},"حفظ",t.id?`<button type="button" class="btn danger" data-act="delTask" data-id="${t.id}">حذف</button>`:"");
}
function programForm(p){
  p=p||{kind:"tafsir",audience:"all",studentIds:[]};const m=me();
  const body=`<div class="fg">${fld("اسم البرنامج",inp("title",p.title,"text","required placeholder='مثال: تفسير جزء عم'"))}${fld("النوع",sel("kind",Object.entries(PKIND),p.kind))}${fld("موجه إلى",sel("audience",[["all","كل الطلاب"],["hifz",TRACK.hifz],["tilawa",TRACK.tilawa],["selected","طلاب محددون"]],p.audience,`data-change="aud"`))}</div>
  ${fld("الوصف",`<textarea name="description" id="f-description">${esc(p.description||"")}</textarea>`)}
  <label class="switch" style="border:0;padding:0"><span>إخفاء البرنامج عن الطلاب مؤقتاً</span><input type="checkbox" name="hidden" id="f-hidden" ${p.hidden?"checked":""}></label>
  <div id="aud-sel" ${p.audience==="selected"?"":"hidden"}><div class="small muted" style="margin-bottom:6px">الطلاب</div><div class="chips">${myStudents(m).map(s=>`<label><input type="checkbox" name="studentIds" value="${s.id}" ${(p.studentIds||[]).includes(s.id)?"checked":""}>${esc(s.name)}</label>`).join("")}</div></div>`;
  openModal(p.id?"تعديل البرنامج":"برنامج جديد",body,"program",{id:p.id},"حفظ",p.id?`<button type="button" class="btn danger" data-act="delProgram" data-id="${p.id}">حذف البرنامج</button>`:"");
}
function lessonForm(pid,l){
  l=l||{};
  const body=`<div class="fg">${fld("عنوان الدرس",inp("title",l.title,"text","required placeholder='مثال: تفسير سورة النبأ 1–16'"))}${fld("التاريخ",inp("date",l.date||today(),"date"))}</div>${fld("المحتوى أو الفوائد",`<textarea name="body" id="f-body" style="min-height:120px">${esc(l.body||"")}</textarea>`)}${fld("رابط (يوتيوب، Drive، PDF…)",inp("link",l.link,"url","placeholder='https://'"))}
  ${ASSETS?fld("رفع ملف مرفق",`<input type="file" name="file" id="f-file" accept=".pdf,image/*,audio/*,video/*,.txt,.md,.csv">`,l.fileName?"المرفق الحالي: "+esc(l.fileName):"PDF أو صورة أو صوت حتى 20 ميجابايت"):`<p class="hint">رفع الملفات متاح لمن لديه صلاحية «محرر». يمكن إضافة رابط Google Drive بدلاً من ذلك.</p>`}`;
  const body2=body+(l.id?"":`<fieldset><legend>إرساله كمهمة للطلاب</legend><label class="switch" style="border:0;padding:0"><span>أضفه مهمةً في جدول طلاب البرنامج</span><input type="checkbox" name="asTask" id="f-asTask" checked></label>${fld("تاريخ المهمة",inp("taskDate",l.date||today(),"date"))}</fieldset>`);
  openModal(l.id?"تعديل الدرس":"درس جديد",body2,"lesson",{pid,id:l.id},"حفظ",l.id?`<button type="button" class="btn danger" data-act="delLesson" data-pid="${pid}" data-id="${l.id}">حذف</button>`:"");
}

/* ============ الأحداث ============ */
function go(v){ui.view=v;window.scrollTo(0,0);try{history.replaceState(null,"","#"+v)}catch(e){}render()}
async function copy(text){try{await navigator.clipboard.writeText(text);toast("نُسخ. الصقه في واتساب أو أي مكان.")}catch(e){openModal("انسخ النص",`<textarea id="f-copy" style="min-height:220px;width:100%;padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--bg)">${esc(text)}</textarea>`,"noop",{}, "تم");setTimeout(()=>{const t=$("#f-copy");t&&t.select()},50)}}
function genWeek(sid){
  const s=get("members",sid);const p=s.plan;if(!p){toast("أنشئ الخطة أولاً","err");return}
  let n=0;const days=p.days&&p.days.length?p.days:[0,1,2,3,4];
  for(let i=0;i<7;i++){const d=addDays(today(),i);if(!days.includes(dow(d)))continue;if(p.endDate&&d>p.endDate)continue;
    const mk=(kind,title)=>{if(!title||S.tasks.some(t=>t.studentId===sid&&t.date===d&&t.kind===kind))return;put("tasks","t"+gen(),{studentId:sid,date:d,kind,title,details:"",done:false,createdBy:me().id});n++};
    if(s.track==="tilawa")mk("tilawa","تلاوة "+(p.dailyTilawa||"الورد اليومي"));else{mk("hifz","حفظ "+(p.dailyNew||"المقرر اليومي"));mk("murajaa","مراجعة "+(p.dailyRev||"المقرر"))}}
  toast(n?`أُنشئت ${n} مهمة للأسبوع القادم`:"المهام موجودة مسبقاً");
}
function programStudents(p){const m=me();return allStudents().filter(s=>p.audience==="all"||(p.audience==="selected"?(p.studentIds||[]).includes(s.id):p.audience===s.track)).filter(s=>inScope(m,s))}
function lessonToTasks(p,l,date){const st=programStudents(p);const kind=p.kind==="tafsir"?"tafsir":"program";
  st.forEach(s=>{if(S.tasks.some(t=>t.studentId===s.id&&t.lessonId===l.id&&t.date===date))return;put("tasks","t"+gen(),{studentId:s.id,date,kind,title:`${p.title}: ${l.title}`,details:l.body||"",link:l.link||"",fileUrl:l.fileUrl||"",fileName:l.fileName||"",programId:p.id,lessonId:l.id,done:false,createdBy:me().id})});return st.length}
const A={
  hideProgram:el=>{const p=get("programs",el.dataset.id);patch("programs",p.id,{hidden:!p.hidden});toast(p.hidden?"البرنامج ظاهر للطلاب الآن":"أُخفي البرنامج عن الطلاب")},
  lessonTask:el=>{const p=get("programs",el.dataset.pid);const l=(p.lessons||[]).find(x=>x.id===el.dataset.id);openModal("إرسال الدرس كمهمة",`<p>سيُضاف «${esc(l.title)}» بمحتواه ومرفقاته مهمةً في جدول ${programStudents(p).length} طالب.</p>${fld("تاريخ المهمة",inp("taskDate",today(),"date","required"))}`,"lessonTask",{pid:p.id,lid:l.id},"إرسال")},
  go:el=>go(el.dataset.v),
  stab:el=>{ui.stab=el.dataset.v;render()},
  openStudent:el=>{ui.sid=el.dataset.id;ui.stab="plan";go("student")},
  openReport:el=>{ui.rsid=el.dataset.id;go("report")},
  openProgram:el=>{ui.pid=el.dataset.id;go("program")},
  close:()=>closeModal(),
  backdrop:(el,e)=>{if(e.target===el)closeModal()},
  demo:()=>startDemo(),
  exitDemo:()=>{S=LIVE;MODE=PREV==="loading"?"auth":PREV;ui.view=null;render()},
  day:el=>{ui.date=addDays(ui.date,+el.dataset.n);render()},
  month:el=>{const[y,m]=ui.month.split("-").map(Number);const d=new Date(y,m-1+(+el.dataset.n),15);ui.month=ymd(d).slice(0,7);render()},
  attAll:el=>{const k=el.dataset.cid,v=el.dataset.v||"present";const m=me();let n=0;scoped(m).filter(s=>canAttend(m,s)&&(!k||(s.circleId&&get("circles",s.circleId)?s.circleId:"none")===k)).forEach(s=>{const id=`${s.id}_${ui.date}`;if(!get("logs",id)){n++;patch("logs",id,{studentId:s.id,date:ui.date,teacherId:m.id,attendance:v})}});toast(n?`سُجّل ${ATT[v]} لـ ${n} طالب`:"كل الطلاب مُحضَّرون مسبقاً")},
  circleDay:el=>{ui.circle=el.dataset.id;ui.date=el.dataset.d;go("daily")},
  openCircle:el=>{ui.cid=el.dataset.id;go("circle")},
  newCircle:()=>circleForm(),
  editCircle:el=>circleForm(get("circles",el.dataset.id)),
  delCircle:el=>{if(modalCtx&&modalCtx.confirmDel!==el.dataset.id){modalCtx.confirmDel=el.dataset.id;el.textContent="اضغط مرة أخرى للتأكيد (الطلاب لا يُحذفون)";return}const id=el.dataset.id;circleStudents(id).forEach(s=>patch("members",s.id,{circleId:null}));del("circles",id);closeModal();go("circles")},
  circleDaily:el=>{ui.circle=el.dataset.id;ui.date=today();go("daily")},
  editMsgs:el=>{const s=get("members",el.dataset.id);openModal(`الملاحظات الثابتة: ${esc(s.name)}`,`<p class="hint">ملاحظات تبقى ظاهرة أعلى صفحة الطالب أو ولي الأمر حتى تعدّلها أو تحذفها. لكل يوم ملاحظاته الخاصة في السجل اليومي.</p>${fld("ملاحظة للطالب",`<textarea name="msgStudent" id="f-msgStudent" style="min-height:90px" placeholder="مثال: ركّز هذا الأسبوع على تثبيت سورة الملك قبل الانتقال">${esc(s.msgStudent||"")}</textarea>`,"يراها الطالب فقط")}${fld("ملاحظة لولي الأمر",`<textarea name="msgParent" id="f-msgParent" style="min-height:90px" placeholder="مثال: نرجو متابعة المراجعة في البيت يومياً">${esc(s.msgParent||"")}</textarea>`,"يراها ولي الأمر فقط، ولا تظهر للطالب")}`,"msgs",{sid:s.id})},
  pm:el=>{ui.pm=el.dataset.v;if(ui.pm==="custom"&&!ui.cmode)ui.cmode="month";render()},
  rtype:el=>{ui.rtype=el.dataset.v;render()},
  copyParent:el=>copy(reportText(el.dataset.id,curRange(el.dataset.id),true)),
  copyProgram:el=>copy(programReportText(el.dataset.id)),
  juz:el=>{const s=get("members",el.dataset.sid);const mp={...(s.hifzMap||{})};const j=el.dataset.j;const nx={undefined:"m",m:"x",x:"r",r:undefined}[mp[j]];if(nx)mp[j]=nx;else delete mp[j];patch("members",s.id,{hifzMap:mp})},
  newExam:el=>examForm(null,el.dataset.sid),
  editExam:el=>examForm(get("exams",el.dataset.id)),
  delExam:el=>{del("exams",el.dataset.id);closeModal()},
  newCert:el=>certForm(el.dataset.sid),
  delCert:el=>{if(modalCtx?.confirmDel!==el.dataset.id&&!el.dataset.ok){el.dataset.ok=1;el.textContent="تأكيد الحذف";return}del("certs",el.dataset.id)},
  certDl:el=>downloadCert(el.dataset.id),
  alertMsg:el=>{const s=get("members",el.dataset.id);const txt=alertMsgText(s,el.dataset.k,el.dataset.n);const num=waNum(s.guardianPhone);
    openModal("رسالة لولي الأمر",`${fld("نص الرسالة",`<textarea id="f-msg" data-input="wa" style="min-height:170px">${esc(txt)}</textarea>`)}<div class="row"><button type="button" class="btn" data-act="copyMsg">نسخ الرسالة</button>${num?`<a id="wa-link" class="btn meet" href="https://wa.me/${num}?text=${encodeURIComponent(txt)}" target="_blank" rel="noopener">فتح واتساب</a>`:`<span class="hint">لا يوجد رقم ولي أمر صحيح لهذا الطالب. أضفه من «تعديل البيانات».</span>`}</div>`,"noop",{num},"إغلاق")},
  copyMsg:()=>copy($("#f-msg").value),
  reviewRecit:el=>recitReviewForm(get("recits",el.dataset.id)),
  delRecit:el=>{del("recits",el.dataset.id);closeModal()},
  tatt:el=>{const id=`${el.dataset.id}_${el.dataset.d}`;const cur=get("tatt",id);const order=["present","late","absent","excused"];const i=cur?order.indexOf(cur.status):-1;if(i===order.length-1)del("tatt",id);else put("tatt",id,{teacherId:el.dataset.id,date:el.dataset.d,status:order[i+1],by:me().id})},
  ayah:el=>{const g=el.dataset.g;const nx={undefined:"j",j:"k",k:"t",t:undefined}[ui.marks[g]];if(nx)ui.marks[g]=nx;else delete ui.marks[g];render()},
  clearMarks:()=>{ui.marks={};render()},
  mNav:el=>{ui.mpage=Math.min(604,Math.max(1,(ui.mpage||1)+(+el.dataset.n)));render();window.scrollTo(0,0)},
  mushafFor:el=>{const s=get("members",el.dataset.id);if(s){ui.mstu=s.id;ui.tasmee=true;ui.marks={};const l=logsOf(s.id)[0];ui.msurah=(l&&(l.newSurah||l.tSurah))||(s.plan&&s.plan.startPoint)||null}go("mushaf")},
  saveTasmee:()=>{const s=get("members",ui.mstu);if(!s)return;if(!canAttend(me(),s)){toast("لا تملك صلاحية تسجيل متابعة هذا الطالب","err");return}const G={j:[],k:[],t:[]};Object.entries(ui.marks).forEach(([g,v])=>{const[si,a]=sa(+g);G[v].push(`${Q.s[si][0]} ${a}`)});
    const id=`${s.id}_${today()}`;const cur=get("logs",id)||{studentId:s.id,date:today(),teacherId:me().id,attendance:"present"};
    const note=[G.j.length?"جلي: "+G.j.join("، "):"",G.k.length?"خفي: "+G.k.join("، "):"",G.t.length?"تنبيه: "+G.t.join("، "):""].filter(Boolean).join(" · ");
    patch("logs",id,{...cur,errJali:n0(cur.errJali)+G.j.length,errKhafi:n0(cur.errKhafi)+G.k.length,tajweedNote:((cur.tajweedNote?cur.tajweedNote+" | ":"")+"مواضع التسميع — "+note)});ui.marks={};toast("حُفظت الأخطاء في سجل اليوم")},
  resetPerms:el=>{if(!el.dataset.ok){el.dataset.ok=1;el.textContent="اضغط مرة أخرى للتأكيد";return}stageConfig("perms",null)},
  xlsAll:()=>{const d=studentsReportData(me());exportXLSX(`تقرير-الطلاب-${d.f}_${d.t}`,[{name:"الطلاب",title:d.title,sub:d.sub,head:d.head,rows:d.full}])},
  pdfAll:()=>{const d=studentsReportData(me());exportPDF(`تقرير-الطلاب-${d.f}_${d.t}`,{title:d.title,sub:d.sub,summary:d.summary,tables:[{head:d.ph,rows:d.pr}]})},
  xlsOne:el=>{const d=studentReportData(el.dataset.id);exportXLSX(`تقرير-${d.s.name}`,[{name:"المتابعة",title:d.title,sub:d.sub,head:d.head,rows:d.rows},{name:"الملخص",title:d.title,sub:d.sub,head:["البند","القيمة"],rows:d.summary},...(d.er.length?[{name:"الاختبارات",title:d.title,sub:d.sub,head:d.eh,rows:d.er}]:[])])},
  pdfOne:el=>{const d=studentReportData(el.dataset.id);exportPDF(`تقرير-${d.s.name}`,{title:d.title,sub:d.sub,summary:d.summary,tables:[...(d.er.length?[{title:"الاختبارات",head:d.eh,rows:d.er}]:[]),{title:"سجل المتابعة",head:d.head,rows:d.rows,maxW:{2:520}}]})},
  xlsProg:el=>{const d=programReportData(el.dataset.id);exportXLSX(d.title,[{name:"البرنامج",title:d.title,sub:d.sub,head:d.head,rows:d.rows}])},
  pdfProg:el=>{const d=programReportData(el.dataset.id);exportPDF(d.title,{title:d.title,sub:d.sub,tables:[{head:d.head,rows:d.rows}]})},
  ctab:el=>{ui.ctab=el.dataset.v;render()},
  navMove:el=>{const r=el.dataset.r;const items=roleNavItems(r);const i=items.findIndex(x=>x.k===el.dataset.k),j=i+(+el.dataset.n);if(j<0||j>=items.length)return;[items[i],items[j]]=[items[j],items[i]];saveNav(r,items)},
  navReset:el=>{const nav={...(uiCfg().nav||{})};delete nav[el.dataset.r];saveUi({nav});},
  homeMove:el=>{const g=el.dataset.g;const items=homeOrder(g);const i=items.findIndex(x=>x.k===el.dataset.k),j=i+(+el.dataset.n);if(j<0||j>=items.length)return;[items[i],items[j]]=[items[j],items[i]];saveHome(g,items)},
  homeReset:el=>{const home={...(uiCfg().home||{})};delete home[el.dataset.g];saveUi({home})},
  termsReset:el=>{if(!el.dataset.ok){el.dataset.ok=1;el.textContent="اضغط مرة أخرى للتأكيد";return}saveUi({terms:{}});},
  replAdd:()=>{saveUi({replace:[...(uiCfg().replace||[]),["",""]]})},
  replDel:el=>{const L=[...(uiCfg().replace||[])];L.splice(+el.dataset.i,1);saveUi({replace:L})},
  colorsReset:()=>{saveUi({brand:{...brand(),primary:"",accent:"",bg:"",surface:"",header:"",light:{},dark:{},darkAuto:true}})},
  cmodeTab:el=>{ui.cmodeTab=el.dataset.v;setThemeMode(el.dataset.v)},
  tokClear:el=>{const b=brand();const m=el.dataset.m,k=el.dataset.k;const t={...(b[m]||{})};delete t[k];const patch={[m]:t};if(m==="light"&&["primary","accent","bg","surface","header"].includes(k))patch[k]="";saveUi({brand:{...b,...patch}})},
  fontGoogle:()=>{const n=cssName(($("#cf-name")||{}).value);if(!n){toast("اكتب اسم الخط أولاً","err");return}const b=brand();const cf=[...(b.customFonts||[])].filter(f=>cssName(f.name)!==n);cf.push({name:n,google:true});saveUi({brand:{...b,customFonts:cf,fontBody:n}});toast("أُضيف الخط. إذا لم يتغير الشكل فتأكد من كتابة الاسم كما في Google Fonts")},
  fontDel:el=>{const b=brand();const cf=[...(b.customFonts||[])];const [d]=cf.splice(+el.dataset.i,1);const n=d?cssName(d.name):"";saveUi({brand:{...b,customFonts:cf,fontBody:b.fontBody===n?"":b.fontBody,fontHead:b.fontHead===n?"":b.fontHead}})},
  brandClear:el=>{saveUi({brand:{...brand(),[el.dataset.k]:""}})},
  fontsReset:()=>{saveUi({brand:{...brand(),fontBody:"",fontHead:"",fontScale:1}})},
  fontScale:el=>{saveUi({brand:{...brand(),fontScale:Number(el.dataset.v)}})},
  pickFont:el=>{saveUi({brand:{...brand(),fontBody:el.dataset.v}})},
  myNav:()=>myNavModal(),
  myNavMove:el=>{const items=[...modalCtx.items];const i=+el.dataset.i,j=i+(+el.dataset.n);if(j<0||j>=items.length)return;[items[i],items[j]]=[items[j],items[i]];myNavModal(items)},
  myNavReset:()=>{patch("members",me().id,{navPref:[]});closeModal();toast("أُعيد الترتيب الافتراضي")},
  saveDrafts:()=>saveDrafts(),
  discardDrafts:()=>discardDrafts(),
  themeToggle:()=>{setThemeMode(isDark()?"light":"dark")},
  themeSet:el=>setThemeMode(el.dataset.v),
  colorPreset:el=>{const p=COLOR_PRESETS.find(x=>x[0]===el.dataset.v);if(p){const b=brand();saveUi({brand:{...b,primary:p[2],accent:p[3],light:{...(b.light||{}),primary:p[2],accent:p[3]}}})}},
  ptab:el=>{ui.ptab=el.dataset.v;render()},
  wk:el=>{const n=+el.dataset.n;ui.wk=n?addDays(ui.wk||addDays(today(),-dow(today())),n):null;render()},
  newTaskAt:el=>taskForm({date:el.dataset.d,kind:"program"},el.dataset.sid),
  backup:()=>{const data={app:"halaqa",version:1,exportedAt:new Date().toISOString(),circleName:cfg().circleName,collections:{}};COLS.forEach(c=>data.collections[c]=S[c]);saveBlob(`نسخة-احتياطية-${today()}.json`,new Blob([JSON.stringify(data,null,1)],{type:"application/json"}));toast("جاري تجهيز النسخة الاحتياطية…")},
  kid:el=>{ui.kid=el.dataset.id;render()},
  dmode:el=>{ui.dmode=el.dataset.v;render()},
  att:el=>{if(!canAttend(me(),get("members",el.dataset.id))){toast("لا تملك صلاحية تحضير هذا الطالب","err");return}const sid=el.dataset.id,id=`${sid}_${ui.date}`;const cur=get("logs",id);if(cur&&cur.attendance===el.dataset.v)return;patch("logs",id,{studentId:sid,date:ui.date,teacherId:me().id,attendance:el.dataset.v})},
  logFor:el=>{const sid=el.dataset.id;if(!canAttend(me(),get("members",sid))){toast("لا تملك صلاحية تسجيل متابعة هذا الطالب","err");return}const d=ui.view==="daily"?ui.date:today();logForm(sid,d,get("logs",`${sid}_${d}`))},
  editLog:el=>{const l=get("logs",el.dataset.id);logForm(l.studentId,l.date,l)},
  delLog:el=>{del("logs",el.dataset.id);closeModal();toast("حُذف السجل")},
  toggleTask:el=>{const t=get("tasks",el.dataset.id);patch("tasks",t.id,{done:!t.done,doneAt:!t.done?new Date().toISOString():null});if(t.programId&&t.lessonId){const pid=`${t.studentId}__${t.programId}`;const d=progOf(t.studentId,t.programId);const nd=!t.done?[...new Set([...d,t.lessonId])]:d.filter(x=>x!==t.lessonId);put("progress",pid,{studentId:t.studentId,programId:t.programId,done:nd})}if(!t.done&&me().role==="student"){const T=tasksOf(t.studentId,t.date,t.date);if(t.date===today()&&T.length&&T.every(z=>z.id===t.id||z.done))celebrate("ما شاء الله! أنجزت كل مهام اليوم");else toast("بارك الله فيك! أُنجزت المهمة")}},
  newTask:el=>taskForm(null,el.dataset.sid),
  editTask:el=>taskForm(get("tasks",el.dataset.id)),
  delTask:el=>{del("tasks",el.dataset.id);closeModal()},
  genWeek:el=>genWeek(el.dataset.id),
  editPlan:el=>planForm(get("members",el.dataset.id)),
  newSession:el=>{modalPresetCircle=el.dataset.cid||"";sessionForm(null,el.dataset.sid||(ui.view==="student"?ui.sid:""));modalPresetCircle=""},
  editSession:el=>sessionForm(get("sessions",el.dataset.id)),
  delSession:el=>{del("sessions",el.dataset.id);closeModal()},
  newProgram:()=>programForm(),
  editProgram:el=>programForm(get("programs",el.dataset.id)),
  delProgram:el=>{if(modalCtx&&modalCtx.confirmDel!==el.dataset.id){modalCtx.confirmDel=el.dataset.id;el.textContent="اضغط مرة أخرى لتأكيد الحذف";return}del("programs",el.dataset.id);closeModal();go("programs")},
  newLesson:el=>lessonForm(el.dataset.id),
  editLesson:el=>lessonForm(el.dataset.pid,(get("programs",el.dataset.pid).lessons||[]).find(l=>l.id===el.dataset.id)),
  delLesson:el=>{const p=get("programs",el.dataset.pid);patch("programs",p.id,{lessons:(p.lessons||[]).filter(l=>l.id!==el.dataset.id)});closeModal()},
  lessonDone:el=>{const m=me(),id=`${m.id}__${el.dataset.pid}`;const d=progOf(m.id,el.dataset.pid);const nd=d.includes(el.dataset.id)?d.filter(x=>x!==el.dataset.id):[...d,el.dataset.id];put("progress",id,{studentId:m.id,programId:el.dataset.pid,done:nd})},
  addStudent:()=>memberForm(null,"student"),
  addMember:()=>memberForm(null,"teacher"),
  editMember:el=>memberForm(get("members",el.dataset.id)),
  approve:el=>{const x=get("members",el.dataset.id);const m=me();if(x.role==="student"&&!can(m,"members.manage")){patch("members",x.id,{status:"active",teacherId:m.id});toast("اعتُمد الطالب وأُسند إليك");return}memberForm(x)},
  delMember:el=>{const x=get("members",el.dataset.id);if(modalCtx&&modalCtx.confirmDel!==x.id){modalCtx.confirmDel=x.id;el.textContent="اضغط مرة أخرى للتأكيد";return}del("members",x.id);closeModal();toast("حُذف العضو")},
  csv:async()=>{const m=me();const[f,t]=curRange();const head=["الطالب","المسار","الحلقة","المعلم","نسبة الحضور","حاضر","متأخر","غائب","مستأذن","حفظ جديد (وجه)","مراجعة (وجه)","تلاوة (وجه)","أخطاء جلية","أخطاء خفية","متوسط التقدير","مهام منجزة","إجمالي المهام","جلسات تسميع","النقاط","إجمالي المحفوظ/المقروء"];
    const rows=scoped(m).map(s=>{const x=stats(s.id,f,t);return[s.name,TRACK[s.track],(get("circles",s.circleId)||{}).name||"",nameOf(s.teacherId),x.rate??"",x.att.present,x.att.late,x.att.absent,x.att.excused,x.newPages,x.revPages,x.tPages,x.errJ,x.errK,x.avg?x.avg.toFixed(2):"",x.done,x.tasks,x.sess,x.points,totalPages(s)]});
    const csv="﻿"+[head,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    if(DL){try{await DL.save({filename:`تقرير-${f}_${t}.csv`,data:new Blob([csv],{type:"text/csv"})});return}catch(e){if(e&&e.code==="declined")return}}
    copy(csv.slice(1));},
  copyAll:()=>{copy(scoped(me()).map(s=>reportText(s.id,curRange(s.id))).join("\n\n———\n\n"))},
  copyOne:el=>copy(reportText(el.dataset.id,curRange(el.dataset.id),me().role==="parent")),
};
const CH={
  demoAs:el=>{ui.demoAs=el.value;ui.view=null;render()},
  teacher:el=>{ui.teacher=el.value;render()},
  track:el=>{ui.track=el.value;render()},
  date:el=>{if(el.value){ui.date=el.value;render()}},
  month:el=>{if(el.value){ui.month=el.value;ui.cmode="month";render()}},
  pfrom:el=>{ui.from=el.value;ui.cmode="range";render()},
  pto:el=>{ui.to=el.value;ui.cmode="range";render()},
  crole:el=>{ui.crole=el.value;render()},
  chome:el=>{ui.chome=el.value;render()},
  navLabel:el=>{const r=el.dataset.r;const items=roleNavItems(r);const it=items.find(x=>x.k===el.dataset.k);it.l=el.value.trim()||it.dl;saveNav(r,items)},
  navShow:el=>{const r=el.dataset.r;const items=roleNavItems(r);items.find(x=>x.k===el.dataset.k).h=!el.checked;saveNav(r,items)},
  homeShow:el=>{const g=el.dataset.g;const items=homeOrder(g);items.find(x=>x.k===el.dataset.k).h=!el.checked;saveHome(g,items)},
  term:el=>{const T=JSON.parse(JSON.stringify(uiCfg().terms||{}));const d=el.dataset.d;T[d]=T[d]||{};const v=el.value.trim();if(v)T[d][el.dataset.k]=v;else delete T[d][el.dataset.k];saveUi({terms:T})},
  repl:el=>{const L=(uiCfg().replace||[]).map(r=>[...r]);L[+el.dataset.i][+el.dataset.f]=el.value;saveUi({replace:L})},
  listTaj:el=>{saveUi({lists:{...(uiCfg().lists||{}),tajweed:el.value.split("\n").map(x=>x.trim()).filter(Boolean)}});},
  listCert:el=>{saveUi({lists:{...(uiCfg().lists||{}),certs:el.value.split("\n").map(x=>x.trim()).filter(Boolean)}});},
  brand:el=>{saveUi({brand:{...brand(),[el.dataset.k]:el.value.trim()}})},
  brandLogo:el=>{saveUi({brand:{...brand(),hideLogo:el.checked}})},
  tokSet:el=>{if(!HEX.test(el.value))return;const b=brand();const m=el.dataset.m,k=el.dataset.k;const t={...(b[m]||{}),[k]:el.value};const patch={[m]:t};if(m==="light"&&["primary","accent","bg","surface","header"].includes(k))patch[k]=el.value;saveUi({brand:{...b,...patch}})},
  darkAuto:el=>{saveUi({brand:{...brand(),darkAuto:el.checked}})},
  fontUpload:async el=>{const f=el.files&&el.files[0];if(!f)return;const n=cssName(($("#cf-name")||{}).value)||cssName(f.name.replace(/\.[^.]+$/,""));
    if(!/\.(woff2?|ttf|otf)$/i.test(f.name)){toast("الصيغ المدعومة: woff2, woff, ttf, otf","err");return}if(f.size>5*1024*1024){toast("ملف الخط أكبر من 5 ميجابايت","err");return}
    try{let url;if(MODE==="demo"&&!ASSETS){url=URL.createObjectURL(f)}else{toast("جاري رفع الخط…");const r=await ASSETS.upload(f);url=r.url}
      const b=brand();const cf=[...(b.customFonts||[])].filter(x=>cssName(x.name)!==n);cf.push({name:n,url});saveUi({brand:{...b,customFonts:cf,fontBody:n}});toast("رُفع الخط وطُبّق كمعاينة")}catch(e){toast("تعذّر رفع الخط: "+(e&&(e.code||e.message)||""),"err")}el.value=""},
  brandFont:el=>{saveUi({brand:{...brand(),[el.dataset.k]:el.value}})},
  brandColor:el=>{if(HEX.test(el.value))saveUi({brand:{...brand(),[el.dataset.k]:el.value}})},
  myNavShow:el=>{const items=[...modalCtx.items];items[+el.dataset.i]={...items[+el.dataset.i],h:!el.checked};modalCtx.items=items;el.closest(".crow").classList.toggle("off",!el.checked)},
  perm:el=>{const roles=permsDoc();roles[el.dataset.r].perms[el.dataset.k]=el.checked;stageConfig("perms",{roles});},
  pattscope:el=>{const roles=permsDoc();roles[el.dataset.r].attScope=el.value;stageConfig("perms",{roles});},
  pscope:el=>{const roles=permsDoc();roles[el.dataset.r].scope=el.value;stageConfig("perms",{roles});},
  mSurah:el=>{ui.mpage=pageOf(Q.ss[+el.value]);render()},
  mJuz:el=>{ui.mpage=pageOf(Q.j[+el.value]);render()},
  mPage:el=>{ui.mpage=Math.min(604,Math.max(1,n0(el.value)||1));render()},
  tasmee:el=>{ui.tasmee=el.checked;if(!el.checked)ui.marks={};render()},
  mStu:el=>{ui.mstu=el.value;render()},
  schedKind:el=>{ui.skind=el.value;render()},
  rstudent:el=>{if(el.value){ui.rsid=el.value;go("report")}},
  cfg:el=>{const cur=get("config","main")||{};stageConfig("main",{...DEF_CFG,...cur,[el.dataset.k]:el.checked})},
  mrole:el=>{$("#role-student").hidden=el.value!=="student";$("#role-parent").hidden=el.value!=="parent";$("#role-circles").hidden=!STAFF_ROLES.includes(el.value)||el.value==="director";{const t=$("#role-teach");if(t)t.hidden=el.value!=="teacher"}const o=$("#role-ov");if(o)o.hidden=!STAFF_ROLES.includes(el.value)||el.value==="director"},
  timed:el=>{$("#timed-box").hidden=!el.checked},
  skind:el=>{["single","group","circle"].forEach(k=>{$("#sk-"+k).hidden=el.value!==k})},
  circle:el=>{ui.circle=el.value;render()},
  regRole:el=>{const t=$("#reg-track");if(t)t.hidden=el.value!=="student"},
  aud:el=>{$("#aud-sel").hidden=el.value!=="selected"},
};
const FORMS={
  register:async fd=>{const id="m"+gen();const name=fd.get("name").trim();if(!name)return;
    if(OWNER){await put("members",id,{uid:UID,name,phone:(USERMETA&&USERMETA.phone)||"",email:USEREMAIL,role:"director",status:"active",joined:today()});OWNER=false;await reloadAll();if(fd.get("circleName"))put("config","main",{...DEF_CFG,...(get("config","main")||{}),circleName:fd.get("circleName")})}
    else{await put("members",id,{uid:UID,name,email:USEREMAIL,role:fd.get("role"),track:fd.get("role")==="student"?fd.get("track"):null,phone:fd.get("phone"),note:fd.get("note"),status:"pending",joined:today()});}},
  profile:fd=>{patch("members",me().id,{name:fd.get("name"),phone:fd.get("phone"),meetLink:fd.get("meetLink")});toast("حُفظ")},
  circleName:fd=>{const cur=get("config","main")||{};put("config","main",{...DEF_CFG,...cur,circleName:fd.get("circleName"),termName:fd.get("termName"),termStart:fd.get("termStart"),termEnd:fd.get("termEnd")});toast("حُفظ")},
  member:async fd=>{const id=modalCtx.id||"m"+gen();const cur=get("members",id)||{joined:today()};
    const d={...cur,name:fd.get("name"),role:fd.get("role"),status:fd.get("status")||"active",phone:fd.get("phone"),note:fd.get("note")};
    if(d.role==="student"){d.track=fd.get("track");d.teacherId=fd.get("teacherId");d.circleId=fd.get("circleId")||null;d.guardianPhone=fd.get("guardianPhone");d.level=fd.get("level")}
    if(d.role==="parent")d.childIds=fd.getAll("childIds");
    if(STAFF_ROLES.includes(d.role))d.circleIds=fd.getAll("circleIds");
    if(d.role==="teacher"&&fd.get("teachSync")){const tc=new Set(fd.getAll("teachCircles"));setTimeout(()=>S.circles.forEach(c=>{if(tc.has(c.id)&&c.teacherId!==id)patch("circles",c.id,{teacherId:id});else if(!tc.has(c.id)&&c.teacherId===id)patch("circles",c.id,{teacherId:""})}),300)}
    if(fd.has("scopeOv")){d.scopeOverride=fd.get("scopeOv")||null;d.attScopeOverride=fd.get("attOv")||null;const ov={};ALLP.forEach(k=>{const v=fd.get("ov_"+k);if(v==="1")ov[k]=true;else if(v==="0")ov[k]=false});d.permOverrides=ov}
    if(cur.status==="pending"&&d.status==="pending")d.status="active";
    const link=fd.get("linkTo");
    if(link&&cur.uid){const lk=get("members",link)||{};const uid=cur.uid;del("members",id);setTimeout(()=>patch("members",link,{uid,email:cur.email||lk.email||"",status:"active",phone:d.phone||lk.phone}),400);toast("رُبط الحساب بالسجل السابق");return}
    await put("members",id,d);toast("حُفظ");
    if(fd.get("mkAcct")&&!cur.uid){await createAccount(id,fd.get("username"),fd.get("password"))}},
  plan:fd=>{const s=get("members",modalCtx.sid);const p={};["goal","dailyNew","dailyRev","direction","startPoint","dailyTilawa","focus","startDate","endDate"].forEach(k=>{if(fd.has(k))p[k]=fd.get(k)});p.basePages=n0(fd.get("basePages"));p.targetPages=n0(fd.get("targetPages"));p.days=fd.getAll("days").map(Number);patch("members",s.id,{plan:p});toast("حُفظت الخطة")},
  task:async fd=>{const d={date:fd.get("date"),kind:fd.get("kind"),title:fd.get("title"),details:fd.get("details"),link:fd.get("link")};
    const file=fd.get("file");if(file&&file.size&&ASSETS){try{toast("جاري رفع الملف…");const r=await ASSETS.upload(file);d.fileUrl=r.url;d.fileId=r.id;d.fileName=file.name}catch(e){toast("تعذّر رفع الملف: "+(e&&e.code||""),"err")}}
    if(modalCtx.id){patch("tasks",modalCtx.id,d);return}
    const ids=fd.get("all")?(modalCtx.sid?myStudents(me()):scoped(me())).map(s=>s.id):modalCtx.sid?[modalCtx.sid]:fd.getAll("sids");
    if(!ids.length){toast("اختر طالباً واحداً على الأقل","err");throw new Error("اختر الطلاب")}
    ids.forEach(sid=>put("tasks","t"+gen(),{...d,studentId:sid,done:false,createdBy:me().id}));toast(ids.length>1?`أُسندت لـ ${ids.length} طالب`:"أُضيفت المهمة")},
  log:fd=>{const sid=modalCtx.sid,date=fd.get("date"),id=`${sid}_${date}`;const d={studentId:sid,date,teacherId:me().id,attendance:fd.get("attendance"),noteStudent:fd.get("noteStudent"),noteParent:fd.get("noteParent"),noteStaff:fd.has("noteStaff")?fd.get("noteStaff"):((get("logs",`${sid}_${date}`)||{}).noteStaff||""),tajweed:fd.getAll("tajweed")};
    ["newSurah","newFrom","newTo","newPages","newGrade","revDesc","revPages","revGrade","tSurah","tFrom","tTo","tPages","errJali","errKhafi","tGrade","tajweedNote"].forEach(k=>{if(fd.has(k))d[k]=fd.get(k)});
    put("logs",id,d);toast("حُفظت المتابعة")},
  session:fd=>{const m=me();const staff=isStaff(m);const sk=staff?fd.get("skind"):"single";
    const cur=modalCtx.id?{...get("sessions",modalCtx.id)}:{};delete cur.studentId;delete cur.studentIds;delete cur.circleId;
    let tgt={},s=null,t=null;
    if(sk==="circle"){const c=get("circles",fd.get("circleId"));if(!c){toast("اختر الحلقة","err");throw new Error("اختر الحلقة")}tgt={circleId:c.id,studentIds:[]};t=get("members",c.teacherId)}
    else if(sk==="group"){const ids=fd.getAll("studentIds");if(ids.length<1){toast("اختر طالباً واحداً على الأقل","err");throw new Error("اختر الطلاب")}tgt={studentIds:ids,studentId:ids[0]};s=get("members",ids[0])}
    else{const sid=staff?fd.get("studentId"):(m.role==="parent"?modalCtx.sid:m.id);s=get("members",sid);if(!s){toast("اختر الطالب","err");throw new Error("اختر الطالب")}tgt={studentId:sid,studentIds:[sid]}}
    if(s&&!t)t=teacherOf(s);
    const d={...cur,...tgt,teacherId:cur.teacherId||(sk==="circle"&&t?t.id:null)||(s&&s.teacherId)||m.id,start:new Date(fd.get("start")).toISOString(),duration:n0(fd.get("duration"))||30,note:fd.get("note")};
    if(staff){d.link=fd.get("link");d.status=fd.get("status")}else{d.status="requested";d.link=d.link||(t&&t.meetLink)||"";d.requestedBy=m.role}
    put("sessions",modalCtx.id||"s"+gen(),d);toast(staff?"حُفظ الموعد":"أُرسل طلب الموعد لمعلمك")},
  program:fd=>{const id=modalCtx.id||"p"+gen();const cur=get("programs",id)||{lessons:[],createdBy:me().id};put("programs",id,{...cur,title:fd.get("title"),kind:fd.get("kind"),audience:fd.get("audience"),description:fd.get("description"),studentIds:fd.getAll("studentIds"),hidden:!!fd.get("hidden")});if(!modalCtx.id){ui.pid=id;go("program")}},
  lesson:async fd=>{const p=get("programs",modalCtx.pid);const L=[...(p.lessons||[])];const i=L.findIndex(l=>l.id===modalCtx.id);
    const l={...(i>=0?L[i]:{id:"l"+gen()}),title:fd.get("title"),date:fd.get("date"),body:fd.get("body"),link:fd.get("link")};
    const file=fd.get("file");
    if(file&&file.size&&ASSETS){try{toast("جاري رفع الملف…");const r=await ASSETS.upload(file);l.fileUrl=r.url;l.fileId=r.id;l.fileName=file.name}catch(e){toast("تعذّر رفع الملف: "+(e&&e.code||""),"err")}}
    if(i>=0)L[i]=l;else L.push(l);patch("programs",p.id,{lessons:L});
    if(fd.get("asTask")){const n=lessonToTasks(p,l,fd.get("taskDate")||today());toast(`أُضيف الدرس وأُرسل مهمةً لـ ${n} طالب`)}},
  noop:()=>{},
  myNav:()=>{const items=modalCtx.items;patch("members",me().id,{navPref:items.map(x=>({k:x.k,...(x.h?{h:true}:{})}))});toast("حُفظ ترتيب قائمتك")},
  exam:fd=>{const m=me();const id=modalCtx.id||"e"+gen();const cur=get("exams",id)||{studentId:modalCtx.sid,examiner:m.id};
    const d={...cur,date:fd.get("date"),scope:fd.get("scope"),juzFrom:n0(fd.get("juzFrom"))||null,juzTo:n0(fd.get("juzTo"))||null,score:n0(fd.get("score")),errJali:n0(fd.get("errJali")),errKhafi:n0(fd.get("errKhafi")),tanbih:n0(fd.get("tanbih")),notes:fd.get("notes")};
    put("exams",id,d);
    if(fd.get("markJuz")&&d.score>=70&&d.juzFrom){const s=get("members",d.studentId);const mp={...(s.hifzMap||{})};const a=Math.min(d.juzFrom,d.juzTo||d.juzFrom),b=Math.max(d.juzFrom,d.juzTo||d.juzFrom);for(let j=a;j<=b;j++)mp[j]="x";patch("members",s.id,{hifzMap:mp})}
    toast("حُفظ الاختبار")},
  cert:fd=>{put("certs","z"+gen(),{studentId:modalCtx.sid,title:fd.get("title"),body:fd.get("body"),date:fd.get("date")||today(),signer:fd.get("signer"),issuedBy:me().id});toast("أُصدرت الشهادة، ويراها الطالب وولي الأمر")},
  recit:async fd=>{const m=me();const file=fd.get("file");const d={studentId:m.id,teacherId:m.teacherId||"",date:today(),createdAt:new Date().toISOString(),title:fd.get("title"),note:fd.get("note"),status:"pending"};
    if(file&&file.size){if(!ASSETS){toast("رفع الملفات غير متاح لحسابك","err");throw new Error("no assets")}toast("جاري رفع التسجيل…");try{const r=await ASSETS.upload(file);d.fileUrl=r.url;d.fileId=r.id;d.fileName=file.name}catch(e){toast("تعذّر رفع الملف: "+(e&&e.code||""),"err");throw e}}
    else if(MODE!=="demo"){toast("اختر ملف الصوت","err");throw new Error("no file")}
    put("recits","r"+gen(),d);toast("أُرسل التسميع لمعلمك")},
  recitReview:fd=>{patch("recits",modalCtx.id,{status:"reviewed",grade:n0(fd.get("grade"))||null,errJali:n0(fd.get("errJali")),errKhafi:n0(fd.get("errKhafi")),feedback:fd.get("feedback"),reviewedBy:me().id,reviewedAt:new Date().toISOString()});toast("حُفظ التقييم")},
  msgs:fd=>{patch("members",modalCtx.sid,{msgStudent:fd.get("msgStudent").trim(),msgParent:fd.get("msgParent").trim()});toast("حُفظت الملاحظات")},
  circle:fd=>{const m=me();const id=modalCtx.id||"c"+gen();const cur=get("circles",id)||{createdBy:m.id};
    const d={...cur,name:fd.get("name"),teacherId:fd.get("teacherId")||m.id,track:fd.get("track"),...(fd.get("timed")?{days:fd.getAll("days").map(Number),time:fd.get("time")||"",duration:n0(fd.get("duration"))||60}:{days:[],time:"",duration:null}),meetLink:fd.get("meetLink"),description:fd.get("description")};
    put("circles",id,d);const sel=new Set(fd.getAll("students"));
    allStudents().forEach(s=>{if(sel.has(s.id)&&s.circleId!==id)patch("members",s.id,{circleId:id});else if(!sel.has(s.id)&&s.circleId===id)patch("members",s.id,{circleId:null})});
    toast("حُفظت الحلقة");if(!modalCtx.id){ui.cid=id;go("circle")}},
  lessonTask:fd=>{const p=get("programs",modalCtx.pid);const l=(p.lessons||[]).find(x=>x.id===modalCtx.lid);const n=lessonToTasks(p,l,fd.get("taskDate"));toast(`أُرسل لـ ${n} طالب`)},
};
const ACT_PERM={addStudent:"students.edit",editMsgs:"students.edit",addMember:"members.manage",delMember:"members.manage",approve:"members.approve",newCircle:"circles.manage",editCircle:"circles.manage",delCircle:"circles.manage",
 editPlan:"plans.edit",juz:"plans.edit",genWeek:"tasks.edit",newTask:"tasks.edit",editTask:"tasks.edit",delTask:"tasks.edit",newTaskAt:"tasks.edit",
 att:"daily.log",attAll:"daily.log",logFor:"daily.log",editLog:"daily.log",delLog:"logs.delete",saveTasmee:"daily.log",circleDaily:"daily.log",circleDay:"daily.log",mushafFor:"daily.log",
 editSession:"sessions.manage",delSession:"sessions.manage",newProgram:"programs.manage",editProgram:"programs.manage",delProgram:"programs.manage",hideProgram:"programs.manage",newLesson:"programs.manage",editLesson:"programs.manage",delLesson:"programs.manage",lessonTask:"programs.manage",
 newExam:"exams.manage",editExam:"exams.manage",delExam:"exams.manage",newCert:"certs.issue",delCert:"certs.issue",reviewRecit:"recits.review",delRecit:"recits.review",tatt:"tatt.manage",
 csv:"reports.export",copyAll:"reports.export",copyParent:"reports.export",copyProgram:"reports.export",backup:"perms.manage",navMove:"ui.customize",navReset:"ui.customize",homeMove:"ui.customize",homeReset:"ui.customize",termsReset:"ui.customize",replAdd:"ui.customize",replDel:"ui.customize",colorsReset:"ui.customize",brandClear:"ui.customize",cmodeTab:"ui.customize",tokClear:"ui.customize",fontGoogle:"ui.customize",fontDel:"ui.customize",fontsReset:"ui.customize",fontScale:"ui.customize",pickFont:"ui.customize",xlsAll:"reports.export",pdfAll:"reports.export",xlsOne:"reports.export",pdfOne:"reports.export",xlsProg:"reports.export",pdfProg:"reports.export",openReport:"reports.view",openStudent:"view.students"};
const ACT_PERM_STAFF={newSession:"sessions.manage",toggleTask:"daily.log"};
function actPerm(a){const m=me();if(!m||!isStaff(m))return null;return ACT_PERM[a]||ACT_PERM_STAFF[a]||null}
function applyPerms(root){const m=me();if(!m||!isStaff(m))return;root.querySelectorAll("[data-act]").forEach(el=>{const p=actPerm(el.dataset.act);if(p&&!can(m,p)){if(el.classList.contains("tk")||el.classList.contains("cb")||el.classList.contains("clickable")||el.tagName==="TR"){el.removeAttribute("data-act");el.classList.remove("clickable");if(el.tagName==="BUTTON")el.disabled=true}else el.hidden=true}})}
document.addEventListener("click",e=>{const el=e.target.closest("[data-act]");if(!el)return;if(el.dataset.act==="backdrop"&&e.target!==el)return;{const a=e.target.closest("a,input,select,textarea");if(a&&a!==el&&el.contains(a))return}const f=A[el.dataset.act];if(!f)return;{const p=actPerm(el.dataset.act);if(p&&!can(me(),p)){e.preventDefault();toast("ليست لديك صلاحية لهذا الإجراء","err");return}}if(el.tagName==="A")return;e.preventDefault();f(el,e)});
document.addEventListener("change",e=>{const el=e.target.closest("[data-change]");if(el&&CH[el.dataset.change])CH[el.dataset.change](el)});
let qT;document.addEventListener("input",e=>{const el=e.target;if(el.dataset.input==="wa"){const a=$("#wa-link");if(a&&modalCtx&&modalCtx.num)a.href=`https://wa.me/${modalCtx.num}?text=${encodeURIComponent(el.value)}`;return}if(el.dataset.input==="q"){ui.q=el.value.trim();clearTimeout(qT);qT=setTimeout(render,200)}});
document.addEventListener("submit",async e=>{const f=e.target.closest("form[data-form]");if(!f)return;e.preventDefault();const fn=FORMS[f.dataset.form];if(!fn)return;const inModal=$("#modal").contains(f);try{await fn(new FormData(f))}catch(err){console.error(err);if(!/no file|no assets|اختر/.test(err.message||""))toast("حدث خطأ: "+err.message,"err");return}if(inModal)closeModal();else if(f.dataset.form==="recit")f.reset()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modalCtx)closeModal();
  if((e.key==="Enter"||e.key===" ")&&e.target.classList&&e.target.classList.contains("tap-task")){e.preventDefault();e.target.click();return}
  if(ui.view==="mushaf"&&!modalCtx&&Q&&!/INPUT|SELECT|TEXTAREA/.test((e.target.tagName||""))){if(e.key==="ArrowLeft"){ui.mpage=Math.min(604,ui.mpage+1);render()}else if(e.key==="ArrowRight"){ui.mpage=Math.max(1,ui.mpage-1);render()}}});
window.addEventListener("hashchange",()=>{const v=location.hash.slice(1);if(v&&v!==ui.view){ui.view=v;render()}});

/* ============ العرض التجريبي ============ */
function startDemo(){
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;const pick=a=>a[Math.floor(rnd()*a.length)];
  COLS.forEach(c=>DEMO[c]=[]);PREV=MODE;S=DEMO;MODE="demo";
  const P=(id,d)=>DEMO.members.push({id,status:"active",joined:addDays(today(),-60),...d});
  P("d-admin",{name:"أ. خالد العتيبي",role:"director",meetLink:"https://meet.google.com/abc-defg-hij",phone:"0500000001"});
  P("d-t1",{name:"أ. فهد القحطاني",role:"teacher",meetLink:"https://meet.google.com/xyz-uvwx-rst",phone:"0500000002"});
  P("d-sup",{name:"أ. سعد المطيري",role:"supervisor",circleIds:["c1","c2"],phone:"0500000003"});
  P("d-asst",{name:"عبدالله الزهراني",role:"assistant",circleIds:["c3"],attScopeOverride:"circle"});
  P("d-exam",{name:"الشيخ محمد الشمراني",role:"examiner",permOverrides:{"daily.log":true}});
  const ST=[["d-s1","عبدالرحمن السالم","hifz","d-admin",{goal:"حفظ جزء تبارك خلال الفصل",dailyNew:"نصف وجه",dailyRev:"جزء عم كاملاً",direction:"من الناس صعوداً",startPoint:"سورة الملك",basePages:23,targetPages:43,days:[0,1,2,3,4]}],
    ["d-s2","يوسف الحربي","hifz","d-admin",{goal:"إتمام جزء قد سمع",dailyNew:"وجه",dailyRev:"نصف جزء",direction:"من الناس صعوداً",startPoint:"سورة المجادلة",basePages:60,targetPages:80,days:[0,1,2,3]}],
    ["d-s3","إبراهيم الغامدي","hifz","d-t1",{goal:"حفظ جزء عم",dailyNew:"5 آيات",dailyRev:"3 أوجه",direction:"من الناس صعوداً",startPoint:"سورة الناس",basePages:4,targetPages:23,days:[0,1,2,3,4]}],
    ["d-s4","عمر الشهري","tilawa","d-admin",{goal:"ختمة مجوّدة خلال الفصل",dailyTilawa:"وجهان",focus:"المدود والغنة",basePages:120,targetPages:604,days:[0,1,2,3,4]}],
    ["d-s5","سلمان الدوسري","tilawa","d-t1",{goal:"تصحيح التلاوة في قصار السور",dailyTilawa:"وجه",focus:"مخارج الحروف",basePages:10,targetPages:100,days:[0,2,4]}]];
  ST.forEach(([id,name,track,teacherId,plan])=>P(id,{name,role:"student",track,teacherId,plan:{...plan,startDate:addDays(today(),-45),endDate:addDays(today(),75)},guardianPhone:"05xxxxxxxx",level:"المرحلة المتوسطة"}));
  DEMO.circles.push({id:"c1",name:"حلقة الفرقان",teacherId:"d-admin",track:"hifz",days:[0,1,2,3,4],time:"20:00",duration:60,meetLink:"https://meet.google.com/abc-defg-hij",description:"حلقة الحفظ المسائية للمرحلة المتوسطة"},
    {id:"c2",name:"حلقة التلاوة المجوّدة",teacherId:"d-admin",track:"tilawa",days:[0,2,4],time:"17:30",duration:45,meetLink:"https://meet.google.com/tlw-abcd-efg"},
    {id:"c3",name:"حلقة البراعم",teacherId:"d-t1",track:"mixed",days:[],time:"",meetLink:"https://meet.google.com/xyz-uvwx-rst"});
  const CM={"d-s1":"c1","d-s2":"c1","d-s4":"c2","d-s3":"c3","d-s5":"c3"};DEMO.members.forEach(x=>{if(CM[x.id])x.circleId=CM[x.id]});
  P("d-p1",{name:"أبو عبدالرحمن السالم",role:"parent",childIds:["d-s1"]});
  const hifzS=["الملك","القلم","الحاقة","المعارج","نوح"];
  ST.forEach(([sid,,track,tid,plan])=>{
    for(let i=40;i>=0;i--){const d=addDays(today(),-i);if(!plan.days.includes(dow(d)))continue;
      if(i===0){continue}
      const r=rnd();const att=r<.78?"present":r<.86?"late":r<.94?"absent":"excused";const l={id:`${sid}_${d}`,studentId:sid,date:d,teacherId:tid,attendance:att,tajweed:[]};
      if(att==="present"||att==="late"){if(track==="hifz"){const s=pick(hifzS);const f=1+Math.floor(rnd()*20);Object.assign(l,{newSurah:s,newFrom:f,newTo:f+4,newPages:pick([0.5,0.5,1,0.25]),newGrade:pick([5,5,4,4,3]),revDesc:pick(["جزء عم","النبأ–عبس","التكوير–الطارق"]),revPages:pick([3,5,10]),revGrade:pick([5,4,4,3])});if(rnd()<.3)l.tajweed=[pick(TAJWEED)]}
        else{const si=60+Math.floor(rnd()*50);const s=SURAHS[si];Object.assign(l,{tSurah:s.n,tFrom:1,tTo:Math.min(s.a,10+Math.floor(rnd()*20)),tPages:pick([1,2,2,3]),errJali:Math.floor(rnd()*3),errKhafi:Math.floor(rnd()*6),tGrade:pick([5,4,4,3,3]),tajweed:rnd()<.6?[pick(TAJWEED),pick(TAJWEED)].filter((v,i,a)=>a.indexOf(v)===i):[]})}
        if(rnd()<.3){l.noteStudent=pick(["أحسنت، استمر.","ثبّت المقطع قبل الانتقال.","تحسن واضح هذا الأسبوع.","انتبه لمواضع الوقف."]);l.noteParent=pick(["نرجو متابعة المراجعة في البيت.","الطالب متميز هذا الأسبوع.","يحتاج تشجيعاً على الحضور مبكراً."])}}
      DEMO.logs.push(l)}
    for(let i=-7;i<=4;i++){const d=addDays(today(),i);if(!plan.days.includes(dow(d))&&i!==0)continue;const past=i<0;
      if(track==="tilawa")DEMO.tasks.push({id:`t-${sid}-${i}a`,studentId:sid,date:d,kind:"tilawa",title:"تلاوة "+plan.dailyTilawa,details:"مع تطبيق أحكام "+plan.focus,done:past&&rnd()<.85,doneAt:past?new Date().toISOString():null});
      else{DEMO.tasks.push({id:`t-${sid}-${i}a`,studentId:sid,date:d,kind:"hifz",title:"حفظ "+plan.dailyNew,details:"",done:past&&rnd()<.85||(i===0&&sid==="d-s1"),doneAt:new Date().toISOString()});DEMO.tasks.push({id:`t-${sid}-${i}b`,studentId:sid,date:d,kind:"murajaa",title:"مراجعة "+plan.dailyRev,details:"",done:past&&rnd()<.8,doneAt:new Date().toISOString()})}}
  });
  DEMO.tasks.push({id:"t-tf1",studentId:"d-s1",date:today(),kind:"tafsir",title:"تفسير جزء تبارك: سورة القلم (1–33)",details:"اقرأ تفسير الصفحة، ودوّن ثلاث فوائد من قصة أصحاب الجنة.",link:"https://quran.ksu.edu.sa/tafseer/",programId:"pr1",lessonId:"l3",done:false});
  const at=(dd,h,mi)=>{const d=new Date();d.setDate(d.getDate()+dd);d.setHours(h,mi,0,0);return d.toISOString()};
  DEMO.sessions.push({id:"ss1",studentId:"d-s1",teacherId:"d-admin",start:at(0,20,0),duration:30,link:"https://meet.google.com/abc-defg-hij",status:"confirmed",note:"تسميع سورة الملك كاملة"});
  DEMO.sessions.push({id:"ss2",studentId:"d-s4",teacherId:"d-admin",start:at(1,17,30),duration:20,link:"https://meet.google.com/abc-defg-hij",status:"confirmed",note:"اختبار المدود"});
  DEMO.sessions.push({id:"ss3",studentId:"d-s2",teacherId:"d-admin",start:at(2,19,0),duration:30,link:"",status:"requested",note:"أرغب في تسميع المجادلة"});
  DEMO.sessions.push({id:"ss4",studentId:"d-s1",teacherId:"d-admin",start:at(-6,20,0),duration:30,link:"https://meet.google.com/abc-defg-hij",status:"done"});
  DEMO.sessions.push({id:"ss6",circleId:"c1",studentIds:[],teacherId:"d-admin",start:at(1,20,0),duration:60,link:"https://meet.google.com/abc-defg-hij",status:"confirmed",note:"اختبار شهري لجزء تبارك"});
  DEMO.sessions.push({id:"ss7",studentIds:["d-s4","d-s5"],studentId:"d-s4",teacherId:"d-admin",start:at(3,18,0),duration:40,link:"https://meet.google.com/grp-tjwd-xyz",status:"confirmed",note:"درس تطبيقي في المدود"});
  DEMO.sessions.push({id:"ss5",studentId:"d-s3",teacherId:"d-t1",start:at(0,18,0),duration:15,link:"https://meet.google.com/xyz-uvwx-rst",status:"confirmed"});
  DEMO.programs.push({id:"pr1",title:"تفسير جزء تبارك",kind:"tafsir",audience:"hifz",description:"درس أسبوعي مختصر في تفسير السور التي يحفظها الطلاب، مع فوائد وتدبر.",lessons:[{id:"l1",title:"سورة الملك (1–14)",date:addDays(today(),-14),body:"• معنى «تبارك»\n• الحكمة من خلق الموت والحياة\n• فائدة: «ليبلوكم أيكم أحسن عملاً» ولم يقل أكثر عملاً",link:"https://quran.ksu.edu.sa/tafseer/"},{id:"l2",title:"سورة الملك (15–30)",date:addDays(today(),-7),body:"تأملات في نعمة الرزق والأمن."},{id:"l3",title:"سورة القلم (1–33)",date:today(),body:"قصة أصحاب الجنة ودروسها."}]});
  DEMO.programs.push({id:"pr2",title:"تحفة الأطفال",kind:"tajweed",audience:"all",description:"شرح متن تحفة الأطفال في أحكام النون الساكنة والتنوين والمدود.",lessons:[{id:"l4",title:"مقدمة وأحكام النون الساكنة",body:"الإظهار، الإدغام، الإقلاب، الإخفاء."},{id:"l5",title:"أحكام الميم الساكنة"},{id:"l6",title:"المدود وأقسامها"}]});
  DEMO.progress.push({id:"d-s1__pr1",studentId:"d-s1",programId:"pr1",done:["l1","l2"]},{id:"d-s1__pr2",studentId:"d-s1",programId:"pr2",done:["l4"]},{id:"d-s4__pr2",studentId:"d-s4",programId:"pr2",done:["l4","l5"]});
  DEMO.config.push({id:"main",...DEF_CFG,circleName:"حلقة الفرقان (تجريبية)",leaderboard:true,termName:"الفصل الأول",termStart:addDays(today(),-45),termEnd:addDays(today(),75)});
  const s1=DEMO.members.find(x=>x.id==="d-s1");s1.msgStudent="ممتاز يا عبدالرحمن، هدفنا هذا الأسبوع إتمام سورة القلم مع تثبيت الملك.";s1.msgParent="الطالب منضبط، نرجو متابعة المراجعة اليومية في البيت قبل النوم.";
  const hm={"d-s1":{30:"x",29:"m",28:"r"},"d-s2":{30:"x",29:"x",28:"m",27:"m"},"d-s3":{30:"m"},"d-s4":{1:"m",2:"m",3:"m",4:"m",5:"m",6:"m"},"d-s5":{30:"m"}};DEMO.members.forEach(x=>{if(hm[x.id])x.hifzMap=hm[x.id]});
  DEMO.exams.push({id:"e1",studentId:"d-s1",date:addDays(today(),-20),scope:"جزء عم كاملاً",juzFrom:30,juzTo:30,score:96,errJali:0,errKhafi:2,tanbih:3,examiner:"d-admin",notes:"أداء متميز"},{id:"e2",studentId:"d-s2",date:addDays(today(),-12),scope:"جزءا عم وتبارك",juzFrom:29,juzTo:30,score:88,errJali:1,errKhafi:4,tanbih:5,examiner:"d-admin"},{id:"e3",studentId:"d-s3",date:addDays(today(),-5),scope:"من الناس إلى البروج",juzFrom:30,juzTo:30,score:74,errJali:3,errKhafi:5,tanbih:6,examiner:"d-t1",notes:"يحتاج تثبيت الانفطار"});
  DEMO.certs.push({id:"z1",studentId:"d-s1",title:"شهادة إتمام حفظ جزء عم",body:"لإتمامه حفظ جزء عم بإتقان في حلقة الفرقان، سائلين الله له التوفيق والسداد.",date:addDays(today(),-19),signer:"أ. خالد العتيبي",issuedBy:"d-admin"});
  DEMO.recits.push({id:"r1",studentId:"d-s1",teacherId:"d-admin",date:today(),createdAt:new Date().toISOString(),title:"سورة القلم 1–16",note:"راجعتها مرتين",status:"pending"},{id:"r2",studentId:"d-s4",teacherId:"d-admin",date:addDays(today(),-2),title:"سورة يس 1–20",status:"reviewed",grade:4,errJali:1,errKhafi:3,feedback:"انتبه لمدّ اللين ومواضع الإخفاء.",reviewedBy:"d-admin",reviewedAt:new Date().toISOString()});
  for(let i=13;i>=0;i--){const d=addDays(today(),-i);if(dow(d)>4)continue;["d-admin","d-t1"].forEach(t=>{const r=rnd();DEMO.tatt.push({id:`${t}_${d}`,teacherId:t,date:d,status:r<.82?"present":r<.92?"late":r<.96?"excused":"absent"})})}
  const s5=DEMO.logs.filter(l=>l.studentId==="d-s5").sort((a,b)=>a.date<b.date?1:-1);s5.slice(0,2).forEach(l=>{l.attendance="absent";["tSurah","tPages","tGrade","errJali","errKhafi"].forEach(k=>delete l[k])});
  ui.demoAs="d-admin";ui.view=null;render();
}

/* ============ خريطة الحفظ ============ */
const JUZ_NAMES=["الم","سيقول","تلك الرسل","لن تنالوا","والمحصنات","لا يحب الله","وإذا سمعوا","ولو أننا","قال الملأ","واعلموا","يعتذرون","وما من دابة","وما أبرئ","ربما","سبحان","قال ألم","اقترب","قد أفلح","وقال الذين","أمن خلق","اتل ما أوحي","ومن يقنت","وما لي","فمن أظلم","إليه يرد","حم","قال فما خطبكم","قد سمع","تبارك","عم"];
const JST={m:["محفوظ","jm"],x:["متقن","jx"],r:["يحتاج مراجعة","jr"]};
function juzMapHTML(s,staff){
  const mp=s.hifzMap||{};const cnt={m:0,x:0,r:0};Object.values(mp).forEach(v=>{if(cnt[v]!=null)cnt[v]++});
  const isT=s.track==="tilawa";
  return `<div class="card"><div class="card-h"><h2>${isT?"خريطة التلاوة":"خريطة الحفظ"}</h2><div class="legend">${Object.entries(JST).map(([k,[l,c]])=>`<span><i class="jdot ${c}"></i>${l} (${cnt[k]})</span>`).join("")}</div></div>
  <div class="jgrid">${Array.from({length:30},(_,i)=>{const j=i+1,v=mp[j];return `<button class="jc ${v?JST[v][1]:""}" ${staff?`data-act="juz" data-sid="${s.id}" data-j="${j}"`:"disabled"} title="الجزء ${j}${v?": "+JST[v][0]:""}"><b class="num">${j}</b><span>${JUZ_NAMES[i]}</span></button>`}).join("")}</div>
  ${staff?`<p class="hint" style="margin-top:8px">اضغط الجزء لتغيير حالته: محفوظ ← متقن ← يحتاج مراجعة ← غير محفوظ.</p>`:""}</div>`;
}

/* ============ الاختبارات ============ */
const examGrade=sc=>{sc=n0(sc);return sc>=95?["ممتاز مرتفع","p-ok"]:sc>=90?["ممتاز","p-ok"]:sc>=80?["جيد جداً","p-pri"]:sc>=70?["جيد","p-acc"]:sc>=60?["مقبول","p-warn"]:["لم يجتز","p-bad"]};
const examsOf=(sid,f,t)=>S.exams.filter(e=>e.studentId===sid&&(!f||e.date>=f)&&(!t||e.date<=t)).sort((a,b)=>a.date<b.date?1:-1);
function examsTable(list,staff){
  if(!list.length)return empty("لا اختبارات مسجّلة.");
  return `<div class="tbl-wrap"><table><thead><tr><th>التاريخ</th><th>المقرر</th><th>الدرجة</th><th>التقدير</th><th>أخطاء ج/خ</th><th>تنبيهات</th><th>المختبِر</th><th>ملاحظات</th>${staff?"<th></th>":""}</tr></thead><tbody>${list.map(e=>{const[g,c]=examGrade(e.score);return `<tr><td class="num">${fmtShort(e.date)}</td><td>${esc(e.scope||"")}</td><td class="num"><b>${n0(e.score)}</b>/100</td><td><span class="pill ${c}">${g}</span></td><td class="num">${n0(e.errJali)}/${n0(e.errKhafi)}</td><td class="num">${n0(e.tanbih)}</td><td>${esc(nameOf(e.examiner))}</td><td class="wrapc">${esc(e.notes||"")}</td>${staff?`<td><button class="btn ghost sm" data-act="editExam" data-id="${e.id}">تعديل</button></td>`:""}</tr>`}).join("")}</tbody></table></div>`;
}
function examForm(e,sid){
  e=e||{date:today()};sid=e.studentId||sid;
  const jz=[["","—"],...Array.from({length:30},(_,i)=>[i+1,`${i+1}. ${JUZ_NAMES[i]}`])];
  const body=`<div class="fg">${fld("التاريخ",inp("date",e.date,"date","required"))}${fld("المقرر",inp("scope",e.scope,"text","required placeholder='مثال: جزء عم كاملاً'"))}</div>
  <div class="fg">${fld("من الجزء",sel("juzFrom",jz,e.juzFrom))}${fld("إلى الجزء",sel("juzTo",jz,e.juzTo))}</div>
  <div class="fg">${fld("الدرجة من 100",inp("score",e.score,"number","required min=0 max=100 step=0.5"))}${fld("أخطاء جلية",inp("errJali",e.errJali,"number","min=0"))}${fld("أخطاء خفية",inp("errKhafi",e.errKhafi,"number","min=0"))}${fld("تنبيهات",inp("tanbih",e.tanbih,"number","min=0"))}</div>
  ${fld("ملاحظات",`<textarea name="notes" id="f-notes">${esc(e.notes||"")}</textarea>`)}
  <label class="switch" style="border:0;padding:0"><span>عند الاجتياز (70 فأعلى) اعتمد الأجزاء «متقنة» في خريطة الحفظ</span><input type="checkbox" name="markJuz" id="f-markJuz" ${e.id?"":"checked"}></label>`;
  openModal(e.id?"تعديل الاختبار":`اختبار: ${esc(nameOf(sid))}`,body,"exam",{id:e.id,sid},"حفظ",e.id?`<button type="button" class="btn danger" data-act="delExam" data-id="${e.id}">حذف</button>`:"");
}

/* ============ الشهادات ============ */
function certsList(sid,staff){
  const L=S.certs.filter(c=>c.studentId===sid).sort((a,b)=>a.date<b.date?1:-1);
  if(!L.length)return staff?empty("لا شهادات بعد."):"";
  return `<div class="grid g3">${L.map(c=>`<div class="cert-card"><div class="cert-ic">${STAR}</div><div style="min-width:0;flex:1"><b>${esc(c.title)}</b><div class="small muted">${fmtShort(c.date)}</div></div><div class="row"><button class="btn sm pri" data-act="certDl" data-id="${c.id}">تحميل</button>${staff?`<button class="btn ghost sm danger" data-act="delCert" data-id="${c.id}">حذف</button>`:""}</div></div>`).join("")}</div>`;
}
const CERT_SUG=["شهادة إتمام حفظ جزء عم","شهادة إتمام حفظ جزء تبارك","شهادة إتمام حفظ خمسة أجزاء","شهادة ختم القرآن الكريم","شهادة إتمام برنامج التلاوة المجوّدة","شهادة تميّز","شهادة إتمام برنامج تفسير"];
function certForm(sid){
  const s=get("members",sid);const c=cfg();
  const L=uiCfg().lists||{};const sug=L.certs&&L.certs.length?L.certs:CERT_SUG;const _x=["شهادة إتمام حفظ جزء تبارك","شهادة إتمام حفظ خمسة أجزاء","شهادة ختم القرآن الكريم","شهادة إتمام برنامج التلاوة المجوّدة","شهادة تميّز","شهادة إتمام برنامج تفسير"];
  const body=`${fld("عنوان الشهادة",`<input name="title" id="f-title" list="cert-sug" required value="${esc(sug[0])}"><datalist id="cert-sug">${sug.map(x=>`<option value="${x}">`).join("")}</datalist>`)}
  ${fld("نص الشهادة",`<textarea name="body" id="f-body" style="min-height:90px">لإتمامه ${s.track==="tilawa"?"برنامج التلاوة المجوّدة":"حفظ المقرر"} في ${esc(c.circleName)} بإتقان، سائلين الله له التوفيق والسداد، وأن يجعله من أهل القرآن الذين هم أهل الله وخاصته.</textarea>`)}
  <div class="fg">${fld("التاريخ",inp("date",today(),"date"))}${fld("اسم الموقِّع",inp("signer",me().name))}</div>`;
  openModal(`شهادة: ${esc(s.name)}`,body,"cert",{sid},"إصدار الشهادة");
}
function wrapLines(x,text,maxW){const words=String(text).split(/\s+/);const lines=[];let cur="";words.forEach(w=>{const t=cur?cur+" "+w:w;if(x.measureText(t).width>maxW&&cur){lines.push(cur);cur=w}else cur=t});if(cur)lines.push(cur);return lines}
async function certBlob(c){
  const s=get("members",c.studentId)||{name:""};const W=1754,H=1240;const cv=document.createElement("canvas");cv.width=W;cv.height=H;const x=cv.getContext("2d");
  try{await Promise.all([document.fonts.load('800 60px Tajawal'),document.fonts.load('500 30px Tajawal')])}catch(e){}
  x.fillStyle="#fffdf7";x.fillRect(0,0,W,H);
  x.strokeStyle="#284a70";x.lineWidth=16;x.strokeRect(36,36,W-72,H-72);
  x.strokeStyle="#c9a53a";x.lineWidth=3;x.strokeRect(70,70,W-140,H-140);
  const orn=(cx,cy)=>{x.save();x.translate(cx,cy);x.strokeStyle="#c9a53a";x.lineWidth=3;x.strokeRect(-22,-22,44,44);x.rotate(Math.PI/4);x.strokeRect(-22,-22,44,44);x.restore()};
  [[110,110],[W-110,110],[110,H-110],[W-110,H-110]].forEach(([a,b])=>orn(a,b));
  const img=new Image();img.src=LOGO_FULL;try{await img.decode();x.drawImage(img,W/2-70,105,140,215)}catch(e){}
  x.direction="rtl";x.textAlign="center";
  x.fillStyle="#284a70";x.font='800 72px Tajawal, Tahoma, sans-serif';x.fillText(c.title,W/2,420);
  x.fillStyle="#6a7686";x.font='500 30px Tajawal, Tahoma, sans-serif';x.fillText(`${cfg().circleName}${brand().tagline?" · "+brand().tagline:""}`,W/2,470);
  x.fillStyle="#1c2a3b";x.font='500 38px Tajawal, Tahoma, sans-serif';x.fillText("تتشرّف إدارة الحلقة بمنح الطالب",W/2,575);
  x.fillStyle="#a8862a";x.font='800 76px Tajawal, Tahoma, sans-serif';x.fillText(s.name,W/2,672);
  x.fillStyle="#1c2a3b";x.font='500 36px Tajawal, Tahoma, sans-serif';wrapLines(x,c.body||"",1250).slice(0,4).forEach((l,i)=>x.fillText(l,W/2,760+i*58));
  x.font='500 28px Tajawal, Tahoma, sans-serif';x.fillStyle="#5b6979";
  x.textAlign="right";x.fillText("التاريخ: "+fmtD(c.date,{day:"numeric",month:"long",year:"numeric"}),W-200,H-190);x.fillText(hijri(new Date(c.date+"T12:00:00")),W-200,H-148);
  x.textAlign="left";x.fillText("المعلم: "+(c.signer||nameOf(c.issuedBy)),200,H-190);x.strokeStyle="#c9a53a";x.lineWidth=2;x.beginPath();x.moveTo(200,H-140);x.lineTo(520,H-140);x.stroke();
  return new Promise(r=>cv.toBlob(r,"image/png"));
}
async function downloadCert(id){
  const c=get("certs",id);if(!c)return;toast("جاري تجهيز الشهادة…");const blob=await certBlob(c);const name=`شهادة-${(nameOf(c.studentId)||"").replace(/\s+/g,"-")}.png`;
  if(DL){try{await DL.save({filename:name,data:blob});return}catch(e){if(e&&e.code==="declined")return}}
  const url=URL.createObjectURL(blob);openModal(esc(c.title),`<img src="${url}" alt="الشهادة" style="width:100%;border-radius:8px;border:1px solid var(--line)"><p class="hint">اضغط مطولاً على الصورة أو انقر بالزر الأيمن لحفظها.</p>`,"noop",{},"إغلاق");
}

/* ============ التنبيهات ============ */
function alertsFor(st){
  const out=[];const d=today();
  st.forEach(s=>{const L=logsOf(s.id).filter(l=>l.date<=d);
    let n=0;for(const l of L){if(l.attendance==="absent")n++;else break}
    if(n>=2)out.push({s,k:"absent",n,t:`غاب ${n} مرات متتالية`});
    const miss=tasksOf(s.id,addDays(d,-3),addDays(d,-1)).filter(t=>!t.done).length;if(miss>=3)out.push({s,k:"tasks",n:miss,t:`لم يُنجز ${miss} مهام في آخر 3 أيام`});
    if(!L.length||L[0].date<addDays(d,-7))out.push({s,k:"idle",t:L.length?"لا متابعة منذ أكثر من أسبوع":"لم تُسجَّل له أي متابعة بعد"});
  });return out;
}
function staffAlerts(m){
  const A=alertsFor(myStudents(m));if(!A.length)return"";
  return `<div class="card alert-card"><div class="card-h"><h2>تنبيهات تحتاج متابعة</h2><span class="pill p-bad">${A.length}</span></div><div class="list">${A.slice(0,12).map(a=>`<div class="li"><span class="pill ${a.k==="absent"?"p-bad":a.k==="tasks"?"p-warn":""}">${a.k==="absent"?"غياب":a.k==="tasks"?"مهام":"انقطاع"}</span><div class="grow clickable" data-act="openStudent" data-id="${a.s.id}"><div class="t">${esc(a.s.name)}</div><div class="small muted">${a.t}</div></div><button class="btn sm" data-act="alertMsg" data-id="${a.s.id}" data-k="${a.k}" data-n="${a.n||0}">رسالة لولي الأمر</button></div>`).join("")}</div></div>`;
}
const waNum=p=>{let d=String(p||"").replace(/\D/g,"");if(d.startsWith("00"))d=d.slice(2);if(d.startsWith("05")&&d.length===10)d="966"+d.slice(1);else if(d.startsWith("5")&&d.length===9)d="966"+d;return d.length>=11?d:""};
function alertMsgText(s,k,n){
  const c=cfg();const t=nameOf(s.teacherId);
  const body=k==="absent"?`نفيدكم بأن ابنكم تغيّب عن الحلقة ${n} مرات متتالية، ونأمل حرصكم على انتظامه في الحضور، ونسعد بتواصلكم معنا إن كان هناك عذر.`:
    k==="tasks"?`نفيدكم بأن ابنكم لم يُنجز ${n} من مهامه اليومية في الأيام الثلاثة الماضية، ونأمل متابعته في البيت وتشجيعه على الإنجاز.`:
    `نود الاطمئنان على ابنكم، فلم تُسجَّل له متابعة في الحلقة منذ مدة، ونأمل التواصل معنا.`;
  return `السلام عليكم ورحمة الله وبركاته\nولي أمر الطالب ${s.name} الكريم،\n${body}\nجزاكم الله خيراً.\n${t} — ${c.circleName}`;
}

/* ============ الأوسمة ============ */
function badges(sid){
  const s=get("members",sid);if(!s)return[];const b=[];const L=logsOf(sid);const d=today();const[mf,mt]=monthRange(d.slice(0,7));
  const last5=L.slice(0,5);if(last5.length===5&&last5.every(l=>l.attendance==="present"))b.push(["منتظم","5 لقاءات متتالية دون غياب أو تأخر"]);
  const st=streak(sid);if(st>=7)b.push(["سلسلة ذهبية",`${st} أيام متتالية بإنجاز كامل`]);else if(st>=3)b.push(["سلسلة إنجاز",`${st} أيام متتالية بإنجاز كامل`]);
  const x=stats(sid,mf,mt);const ex=x.logs.reduce((a,l)=>a+[l.newGrade,l.revGrade,l.tGrade].filter(g=>n0(g)===5).length,0);if(ex>=10)b.push(["متقن",`${ex} تقدير ممتاز هذا الشهر`]);
  const jz=Object.values(s.hifzMap||{}).filter(v=>v==="m"||v==="x").length;if(jz>=1)b.push([jz===1?"حافظ جزء":jz===2?"حافظ جزأين":`حافظ ${jz} ${jz<=10?"أجزاء":"جزءاً"}`,"حسب خريطة الحفظ"]);
  if(S.exams.some(e=>e.studentId===sid&&n0(e.score)>=95))b.push(["متفوق","درجة 95 فأعلى في اختبار"]);
  if(x.tPages>=40)b.push(["قارئ مجتهد",`${x.tPages} وجه تلاوة هذا الشهر`]);
  const wk=tasksOf(sid,addDays(d,-6),d);if(wk.length>=5&&wk.every(t=>t.done))b.push(["منجز","أنجز كل مهام الأسبوع"]);
  if(S.certs.some(c=>c.studentId===sid))b.push(["حاصل على شهادة",S.certs.filter(c=>c.studentId===sid).length+" شهادة"]);
  return b;
}
function badgesHTML(sid,title){const b=badges(sid);if(!b.length)return"";return `<div class="card"><div class="card-h"><h2>${title||"الأوسمة"}</h2></div><div class="badges">${b.map(([t,h])=>`<span class="badge"><i aria-hidden="true">✦</i><span><b>${esc(t)}</b><small>${esc(h)}</small></span></span>`).join("")}</div></div>`}

/* ============ التسميع الصوتي ============ */
const recitsOf=sid=>S.recits.filter(r=>r.studentId===sid).sort((a,b)=>(a.createdAt||a.date)<(b.createdAt||b.date)?1:-1);
function recitItem(r,staff){
  const st=r.status==="reviewed";
  return `<div class="lesson"><div class="row between"><div><b>${esc(r.title||"تسميع")}</b>${staff?` · <span class="muted">${esc(nameOf(r.studentId))}</span>`:""}<div class="small muted">${fmtShort(r.date)}${r.note?" · "+esc(r.note):""}</div></div><div class="row"><span class="pill ${st?"p-ok":"p-warn"}">${st?"قُيّم":"بانتظار التقييم"}</span>${st&&n0(r.grade)?`<span class="pill ${gradeCls(r.grade)}">${gradeTxt(r.grade)}</span>`:""}${staff?`<button class="btn sm ${st?"":"pri"}" data-act="reviewRecit" data-id="${r.id}">${st?"تعديل التقييم":"استماع وتقييم"}</button>`:""}</div></div>
  ${r.fileUrl?`<audio controls preload="none" src="${esc(r.fileUrl)}" style="width:100%"></audio>`:`<div class="hint">ملف تجريبي بدون صوت</div>`}
  ${st&&(r.feedback||n0(r.errJali)||n0(r.errKhafi))?`<div class="small"><b>ملاحظات المعلم:</b> ${esc(r.feedback||"")}${n0(r.errJali)||n0(r.errKhafi)?` · أخطاء جلية ${n0(r.errJali)} وخفية ${n0(r.errKhafi)}`:""}</div>`:""}</div>`;
}
function reciteView(m){
  const L=recitsOf(m.id);
  return `<div class="hero"><div><h1>التسميع الصوتي</h1><div class="date">سجّل تسميعك بالجوال وارفعه، ويستمع له معلمك ويقيّمه.</div></div></div>
  <div class="card"><h2 style="margin-bottom:10px">تسميع جديد</h2>${ASSETS||MODE==="demo"?`<form class="stack" data-form="recit"><div class="fg">${fld("المقطع المسمَّع",inp("title","","text","required placeholder='مثال: سورة الملك 1–15'"))}${fld("ملف الصوت",`<input type="file" name="file" id="f-rfile" accept="audio/*" ${MODE==="demo"?"":"required"}>`,"سجّل بتطبيق التسجيل في جوالك ثم اختر الملف، حتى 20 ميجابايت.")}</div>${fld("ملاحظة لمعلمك (اختياري)",inp("note",""))}<div><button class="btn pri">إرسال التسميع</button></div></form>`:`<p class="muted">رفع الملفات غير متاح لحسابك حالياً. اطلب من المشرف منحك صلاحية «مساهم» أو أعلى على المنصة.</p>`}</div>
  <div class="stack">${L.length?L.map(r=>recitItem(r,false)).join(""):empty("لم ترسل أي تسميع صوتي بعد.")}</div>`;
}
function recitReviewForm(r){
  const body=`<p><b>${esc(nameOf(r.studentId))}</b> · ${esc(r.title||"")} · <span class="muted">${fmtShort(r.date)}</span></p>${r.note?`<p class="small muted">ملاحظة الطالب: ${esc(r.note)}</p>`:""}
  ${r.fileUrl?`<audio controls src="${esc(r.fileUrl)}" style="width:100%"></audio>`:`<p class="hint">ملف تجريبي بدون صوت</p>`}
  <div class="fg">${fld("التقدير",gradeSel("grade",r.grade))}${fld("أخطاء جلية",inp("errJali",r.errJali,"number","min=0"))}${fld("أخطاء خفية",inp("errKhafi",r.errKhafi,"number","min=0"))}</div>
  ${fld("ملاحظاتك للطالب",`<textarea name="feedback" id="f-feedback">${esc(r.feedback||"")}</textarea>`)}`;
  openModal("تقييم التسميع الصوتي",body,"recitReview",{id:r.id},"حفظ التقييم",`<button type="button" class="btn danger" data-act="delRecit" data-id="${r.id}">حذف</button>`);
}
function pendingRecits(m){
  const ids=new Set(myStudents(m).map(s=>s.id));const L=S.recits.filter(r=>r.status!=="reviewed"&&ids.has(r.studentId)).sort((a,b)=>a.date<b.date?-1:1);
  if(!L.length)return"";return `<div class="card"><div class="card-h"><h2>تسميعات صوتية بانتظار التقييم</h2><span class="pill p-warn">${L.length}</span></div><div class="list">${L.slice(0,8).map(r=>`<div class="li"><div class="avatar">${esc(initials(nameOf(r.studentId)))}</div><div class="grow"><div class="t">${esc(nameOf(r.studentId))}</div><div class="small muted">${esc(r.title||"")} · ${fmtShort(r.date)}</div></div><button class="btn sm pri" data-act="reviewRecit" data-id="${r.id}">استماع وتقييم</button></div>`).join("")}</div></div>`;
}

/* ============ لوحة المشرف ============ */
const TATT={present:["ح","حاضر","p-ok"],late:["ت","متأخر","p-warn"],absent:["غ","غائب","p-bad"],excused:["م","مستأذن","p-info"]};
const mbar=(v,max)=>{const p=max?Math.max(0,Math.min(100,Math.round(v/max*100))):0;return `<div class="mbar"><i style="width:${p}%"></i></div>`};
function circleAgg(ids,f,t){
  let pres=0,cnt=0,np=0,tp=0,gs=[],td=0,tt=0;
  ids.forEach(id=>{const x=stats(id,f,t);pres+=x.att.present+x.att.late;cnt+=x.att.present+x.att.late+x.att.absent;np+=x.newPages;tp+=x.tPages;if(x.avg)gs.push(x.avg);td+=x.done;tt+=x.tasks});
  const ex=S.exams.filter(e=>ids.includes(e.studentId)&&e.date>=f&&e.date<=t);
  return{rate:cnt?Math.round(pres/cnt*100):null,np,tp,avg:gs.length?gs.reduce((a,b)=>a+b,0)/gs.length:0,task:tt?Math.round(td/tt*100):null,td,tt,ex:ex.length?Math.round(ex.reduce((a,e)=>a+n0(e.score),0)/ex.length):null,exn:ex.length,alerts:alertsFor(ids.map(id=>get("members",id)).filter(Boolean)).length};
}
function adminView(m){
  if(!can(m,"admin.dashboard"))return empty("ليست لديك صلاحية لوحة المشرف.");
  const[f,t]=curRange();const cs=myCircles(m);const mine=myStudents(m);
  const rows=cs.map(c=>({c,ids:circleStudents(c.id).map(s=>s.id)}));const none=mine.filter(s=>!s.circleId||!get("circles",s.circleId)).map(s=>s.id);if(none.length)rows.push({c:null,ids:none});
  const R=rows.map(r=>({...r,a:circleAgg(r.ids,f,t)}));
  const all=circleAgg(mine.map(s=>s.id),f,t);
  const T=isAdmin(m)?teachers():teachers().filter(x=>cs.some(c=>c.teacherId===x.id));const days=[...Array(14)].map((_,i)=>addDays(today(),i-13));
  return `<div class="hero"><div><h1>لوحة المشرف</h1><div class="date">مقارنة الحلقات ومتابعة المعلمين</div></div></div>${periodPicker()}
  <div class="stats"><div class="stat"><b>${mine.length}</b><span>طالب</span></div><div class="stat"><b>${cs.length}</b><span>حلقة</span></div><div class="stat"><b>${T.length}</b><span>معلم</span></div><div class="stat"><b>${all.rate==null?"—":all.rate+"%"}</b><span>متوسط الحضور</span></div><div class="stat"><b>${all.task==null?"—":all.task+"%"}</b><span>إنجاز المهام</span></div><div class="stat"><b>${all.np+all.tp}</b><span>أوجه حفظ وتلاوة</span></div><div class="stat"><b>${all.ex==null?"—":all.ex}</b><span>متوسط الاختبارات</span></div><div class="stat"><b>${all.alerts}</b><span>تنبيهات مفتوحة</span></div></div>
  <div class="card"><div class="card-h"><h2>مقارنة الحلقات</h2></div>${R.length?`<div class="tbl-wrap"><table><thead><tr><th>الحلقة</th><th>المعلم</th><th>الطلاب</th><th style="min-width:150px">الحضور</th><th style="min-width:150px">إنجاز المهام</th><th>حفظ جديد</th><th>تلاوة</th><th>متوسط التقدير</th><th>الاختبارات</th><th>تنبيهات</th></tr></thead><tbody>
  ${R.map(({c,ids,a})=>`<tr ${c?`class="clickable" data-act="openCircle" data-id="${c.id}"`:""}><td><b>${c?esc(c.name):"بدون حلقة"}</b></td><td>${c?esc(nameOf(c.teacherId)):"—"}</td><td class="num">${ids.length}</td><td><div class="row" style="flex-wrap:nowrap">${mbar(a.rate||0,100)}<span class="num small">${a.rate==null?"—":a.rate+"%"}</span></div></td><td><div class="row" style="flex-wrap:nowrap">${mbar(a.task||0,100)}<span class="num small">${a.task==null?"—":a.task+"%"}</span></div></td><td class="num">${a.np}</td><td class="num">${a.tp}</td><td><span class="pill ${gradeCls(a.avg)}">${a.avg?a.avg.toFixed(1):"—"}</span></td><td class="num">${a.ex==null?"—":a.ex+" ("+a.exn+")"}</td><td>${a.alerts?`<span class="pill p-bad">${a.alerts}</span>`:'<span class="pill p-ok">0</span>'}</td></tr>`).join("")}</tbody></table></div>`:empty("لا حلقات بعد.")}</div>
  <div class="card"><div class="card-h"><h2>المعلمون</h2><span class="small muted">${periodLabel([f,t])}</span></div>${T.length?`<div class="tbl-wrap"><table><thead><tr><th>المعلم</th><th>الحلقات</th><th>الطلاب</th><th>سجلات المتابعة</th><th>أيام حضوره</th><th>تأخر/غياب</th><th>تسميعات قيّمها</th><th>اختبارات أجراها</th></tr></thead><tbody>${T.map(tc=>{const A=S.tatt.filter(a=>a.teacherId===tc.id&&a.date>=f&&a.date<=t);return `<tr><td><b>${esc(tc.name)}</b></td><td class="num">${S.circles.filter(c=>c.teacherId===tc.id).length}</td><td class="num">${mine.filter(s=>s.teacherId===tc.id).length}</td><td class="num">${S.logs.filter(l=>l.teacherId===tc.id&&l.date>=f&&l.date<=t).length}</td><td class="num">${A.filter(a=>a.status==="present"||a.status==="late").length}</td><td class="num">${A.filter(a=>a.status==="late").length}/${A.filter(a=>a.status==="absent").length}</td><td class="num">${S.recits.filter(r=>r.reviewedBy===tc.id&&(r.reviewedAt||"").slice(0,10)>=f&&(r.reviewedAt||"").slice(0,10)<=t).length}</td><td class="num">${S.exams.filter(e=>e.examiner===tc.id&&e.date>=f&&e.date<=t).length}</td></tr>`}).join("")}</tbody></table></div>`:empty("لا معلمين.")}</div>
  <div class="card"><div class="card-h"><h2>سجل حضور المعلمين</h2><span class="small muted">آخر 14 يوماً · اضغط الخانة للتبديل: حاضر ← متأخر ← غائب ← مستأذن ← فارغ</span></div>${T.length?`<div class="tbl-wrap"><table class="tatt"><thead><tr><th>المعلم</th>${days.map(d=>`<th class="${d===today()?"today":""}">${fmtD(d,{weekday:"short"})}<br><span class="num">${fmtD(d,{day:"numeric",month:"numeric"})}</span></th>`).join("")}</tr></thead><tbody>${T.map(tc=>`<tr><td><b>${esc(tc.name)}</b></td>${days.map(d=>{const a=get("tatt",`${tc.id}_${d}`);const st=a&&TATT[a.status];const lc=S.logs.filter(l=>l.teacherId===tc.id&&l.date===d).length;return `<td class="${d===today()?"today":""}"><button class="tcell ${st?st[2]:""}" data-act="tatt" data-id="${tc.id}" data-d="${d}" title="${st?st[1]:"لم يُسجَّل"}${lc?" · "+lc+" سجل متابعة":""}">${st?st[0]:"·"}</button>${lc?`<div class="tiny num">${lc}</div>`:""}</td>`}).join("")}</tr>`).join("")}</tbody></table></div><p class="hint" style="margin-top:6px">الرقم أسفل الخانة = عدد سجلات المتابعة التي أدخلها المعلم ذلك اليوم.</p>`:""}</div>
  ${(()=>{const A=alertsFor(mine);return A.length?`<div class="card"><div class="card-h"><h2>كل التنبيهات</h2><span class="pill p-bad">${A.length}</span></div><div class="list">${A.map(a=>`<div class="li"><div class="grow clickable" data-act="openStudent" data-id="${a.s.id}"><div class="t">${esc(a.s.name)} <span class="small muted">· ${esc((get("circles",a.s.circleId)||{}).name||"")} · ${esc(nameOf(a.s.teacherId))}</span></div><div class="small muted">${a.t}</div></div><button class="btn sm" data-act="alertMsg" data-id="${a.s.id}" data-k="${a.k}" data-n="${a.n||0}">رسالة لولي الأمر</button></div>`).join("")}</div></div>`:""})()}`;
}

/* ============ المصحف ============ */
let Q=null,QLOAD=null;
const AR_D=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
function loadQuran(){
  if(Q||QLOAD)return;
  QLOAD=fetch("quran.json").then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>{Q=d;Q.ss=[];let c=0;Q.s.forEach(([n,a])=>{Q.ss.push(c);c+=a});render()}).catch(()=>{QLOAD="err";render()});
}
function sa(g){let lo=0,hi=Q.ss.length-1;while(lo<hi){const mid=(lo+hi+1)>>1;if(Q.ss[mid]<=g)lo=mid;else hi=mid-1}return[lo,g-Q.ss[lo]+1]}
function pageOf(g){let lo=0,hi=603;while(lo<hi){const mid=(lo+hi+1)>>1;if(Q.p[mid]<=g)lo=mid;else hi=mid-1}return lo+1}
function juzOf(g){let k=0;for(let i=0;i<30;i++)if(Q.j[i]<=g)k=i;return k+1}
const MK={j:["خطأ جلي","mk-j"],k:["خطأ خفي","mk-k"],t:["تنبيه","mk-t"]};
function mushafView(m){
  if(!Q){loadQuran();return `<div class="hero"><h1>المصحف الشريف</h1></div>${QLOAD==="err"?empty("تعذّر تحميل المصحف. تحقق من الاتصال ثم أعد فتح الصفحة."):empty("جاري تحميل المصحف…")}`}
  if(ui.msurah){const i=SURAHS.findIndex(x=>ui.msurah.includes(x.n));if(i>=0)ui.mpage=pageOf(Q.ss[i]);ui.msurah=null}
  const pg=Math.min(604,Math.max(1,ui.mpage||1));ui.mpage=pg;
  const from=Q.p[pg-1],to=(pg<604?Q.p[pg]:Q.v.length)-1;const[fs]=sa(from);const jz=juzOf(from);
  const staff=isStaff(m);const tm=staff&&ui.tasmee;
  let html="",para=[];
  const flush=()=>{if(para.length){html+=`<p class="mp">${para.join(" ")}</p>`;para=[]}};
  for(let g=from;g<=to;g++){const[si,a]=sa(g);
    if(a===1){flush();html+=`<div class="sura-h"><span>سورة ${Q.s[si][0]}</span></div>`;if(si!==0&&si!==8)html+=`<div class="basm">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>`}
    const mk=ui.marks[g];para.push(`<span class="ay ${mk?MK[mk][1]:""} ${tm?"tap":""}" ${tm?`data-act="ayah" data-g="${g}"`:""}>${Q.v[g]}<span class="an">﴿${AR_D(a)}﴾</span></span>`)}
  flush();
  const cnt={j:0,k:0,t:0};Object.values(ui.marks).forEach(v=>cnt[v]++);
  const firstSA=sa(from);
  return `<div class="hero"><div><h1>المصحف الشريف</h1><div class="date">رواية حفص عن عاصم · ${604} صفحة</div></div><div class="toolbar">
   <select data-change="mSurah" id="m-s">${SURAHS.map((x,i)=>`<option value="${i}" ${i===fs?"selected":""}>${i+1}. ${x.n}</option>`).join("")}</select>
   <select data-change="mJuz" id="m-j">${JUZ_NAMES.map((n,i)=>`<option value="${i}" ${i+1===jz?"selected":""}>الجزء ${i+1}</option>`).join("")}</select>
   <label class="row small">صفحة <input type="number" id="m-p" min="1" max="604" value="${pg}" data-change="mPage" style="width:80px"></label></div></div>
  ${staff?`<div class="card tasmee ${tm?"on":""}"><div class="row between"><label class="row"><input type="checkbox" id="m-tm" data-change="tasmee" ${tm?"checked":""} style="width:18px;height:18px;accent-color:var(--primary)"><b>وضع التسميع</b></label>
   ${tm?`<div class="row"><select id="m-stu" data-change="mStu"><option value="">— الطالب —</option>${myStudents(m).filter(s=>canAttend(m,s)).map(s=>`<option value="${s.id}" ${ui.mstu===s.id?"selected":""}>${esc(s.name)}</option>`).join("")}</select>
   <span class="pill p-bad">جلي ${cnt.j}</span><span class="pill p-warn">خفي ${cnt.k}</span><span class="pill p-info">تنبيه ${cnt.t}</span>
   <button class="btn sm pri" data-act="saveTasmee" ${ui.mstu&&(cnt.j+cnt.k+cnt.t)?"":"disabled"}>حفظ في سجل اليوم</button><button class="btn sm" data-act="clearMarks">مسح العلامات</button></div>`:`<span class="hint">فعّله أثناء تسميع الطالب، ثم اضغط على الآية لتعليم الخطأ.</span>`}</div>
   ${tm?`<p class="hint" style="margin-top:6px">الضغطة الأولى: خطأ جلي، الثانية: خطأ خفي، الثالثة: تنبيه، الرابعة: إزالة.</p>`:""}</div>`:""}
  <div class="mushaf-wrap"><div class="mushaf-top"><span>${Q.s[fs][0]}</span><span>الجزء ${AR_D(jz)}</span></div>
  <div class="mushaf" lang="ar">${html}</div>
  <div class="mushaf-foot"><button class="btn sm" data-act="mNav" data-n="-1" ${pg<=1?"disabled":""}>→ الصفحة السابقة</button><span class="pgno">${AR_D(pg)}</span><button class="btn sm" data-act="mNav" data-n="1" ${pg>=604?"disabled":""}>الصفحة التالية ←</button></div></div>
  <div class="row" style="justify-content:center"><a class="btn sm" href="https://quran.ksu.edu.sa/index.php?l=ar#aya=${firstSA[0]+1}_${firstSA[1]}&m=hafs&qaree=husary" target="_blank" rel="noopener">صفحة المصحف المصوّر والتلاوة ↗</a><a class="btn sm" href="https://apps.apple.com/app/id706037876" target="_blank" rel="noopener">تطبيق آية ↗</a></div>
  <p class="hint" style="text-align:center">النص القرآني بالرسم العثماني من موسوعة القرآن الكريم (quranenc.com). استخدم الأسهم في لوحة المفاتيح للتنقل بين الصفحات.</p>`;
}

/* ============ الهيكل والصلاحيات ============ */
function permsView(m){
  if(!can(m,"perms.manage"))return empty("هذه الصفحة لمدير البرنامج.");
  const roles=["admin","supervisor","teacher","assistant","examiner"];
  const RC=Object.fromEntries(roles.map(r=>[r,roleCfg(r)]));
  const people=r=>S.members.filter(x=>x.status==="active"&&(x.role===r||(r==="director"&&isOwnerM(x)&&x.role!=="director"))).filter((x,i,a)=>a.indexOf(x)===i);
  const det=x=>{if(["supervisor","assistant"].includes(x.role))return (x.circleIds||[]).map(id=>(get("circles",id)||{}).name).filter(Boolean).join("، ")||"لا حلقات مسندة";
    if(x.role==="teacher"){const cs=S.circles.filter(c=>c.teacherId===x.id);return `${cs.map(c=>c.name).join("، ")||"بدون حلقة"} · ${allStudents().filter(s=>s.teacherId===x.id).length} طالب`}return x.phone||""};
  const chip=x=>`<button class="pchip" data-act="editMember" data-id="${x.id}"><span class="avatar">${esc(initials(x.name))}</span><span class="pc-t"><b>${esc(x.name)}</b><small>${esc(det(x))}</small></span>${Object.keys(x.permOverrides||{}).length||x.scopeOverride?'<span class="pill p-acc">خاص</span>':""}</button>`;
  const levels=[["director","مدير البرنامج","كل الصلاحيات"],...roles.map(r=>[r,{admin:"المشرفون العامّون",supervisor:"مشرفو الحلقات",teacher:"المعلمون",assistant:"المعلمون المساعدون",examiner:"المختبِرون"}[r],SCOPE[RC[r].scope]])];
  const ovs=S.members.filter(x=>Object.keys(x.permOverrides||{}).length||x.scopeOverride||x.attScopeOverride);
  return `<div class="hero"><div><h1>الهيكل والصلاحيات</h1><div class="date">من يرى ماذا، ومن يعدّل ماذا</div></div><div class="row"><button class="btn pri" data-act="addMember">إضافة عضو</button></div></div>
  <div class="card"><div class="card-h"><h2>الهيكل التنظيمي</h2><span class="hint">اضغط على أي شخص لتعديل دوره أو حلقاته أو صلاحياته الخاصة</span></div>
  <div class="org">${levels.map(([r,l,sc])=>`<div class="org-lv"><div class="org-h"><b>${l}</b><span class="small muted">${people(r).length} · ${sc}</span></div><div class="org-row">${people(r).map(chip).join("")||'<span class="hint">لا أحد بعد</span>'}</div></div>`).join("")}
  <div class="org-lv"><div class="org-h"><b>الطلاب وأولياء الأمور</b></div><div class="org-row"><span class="pill p-pri">${S.circles.length} حلقة</span><span class="pill p-pri">${allStudents().length} طالب</span><span class="pill p-pri">${S.members.filter(x=>x.role==="parent"&&x.status==="active").length} ولي أمر</span></div></div></div></div>
  <div class="card"><div class="card-h"><h2>جدول الصلاحيات</h2><button class="btn sm danger" data-act="resetPerms">إعادة الافتراضي</button></div>
  <p class="hint" style="margin-bottom:10px">عدّل ما تريد ثم اضغط «حفظ التعديلات» أسفل الشاشة ليطبَّق على كل من يحمل الدور. مدير البرنامج يملك كل الصلاحيات دائماً.</p>
  <div class="tbl-wrap"><table class="pmx"><thead><tr><th>الصلاحية</th><th>مدير البرنامج</th>${roles.map(r=>`<th>${ROLE[r]}</th>`).join("")}</tr></thead><tbody>
  <tr class="scope-row"><td><b>نطاق البيانات</b><div class="small muted">الطلاب الذين يراهم ويعمل عليهم</div></td><td>كل الطلاب</td>${roles.map(r=>`<td><select data-change="pscope" data-r="${r}" id="ps-${r}">${Object.entries(SCOPE).map(([k,l])=>`<option value="${k}" ${RC[r].scope===k?"selected":""}>${l}</option>`).join("")}</select></td>`).join("")}</tr>
  <tr class="scope-row"><td><b>نطاق التحضير</b><div class="small muted">من يستطيع تحضيرهم وتسجيل متابعتهم</div></td><td>الجميع</td>${roles.map(r=>`<td><select data-change="pattscope" data-r="${r}" id="pa-${r}"><option value="data" ${RC[r].attScope!=="circle"?"selected":""}>كل من في نطاقه</option><option value="circle" ${RC[r].attScope==="circle"?"selected":""}>حلقته فقط</option></select></td>`).join("")}</tr>
  ${PERM_GROUPS.map(([g,ps])=>`<tr class="grp"><td colspan="${roles.length+2}">${g}</td></tr>${ps.map(([k,l])=>`<tr><td>${l}</td><td class="c"><span class="lock">✓</span></td>${roles.map(r=>`<td class="c"><input type="checkbox" data-change="perm" data-r="${r}" data-k="${k}" id="pm-${r}-${k.replace(".","_")}" ${RC[r].perms[k]?"checked":""} aria-label="${l} — ${ROLE[r]}"></td>`).join("")}</tr>`).join("")}`).join("")}
  <tr class="grp"><td colspan="${roles.length+2}">خاص بالمدير</td></tr><tr><td>إدارة الهيكل والصلاحيات</td><td class="c"><span class="lock">✓</span></td>${roles.map(()=>`<td class="c muted">—</td>`).join("")}</tr>
  </tbody></table></div>
  <p class="hint" style="margin-top:8px">«حلقاته المسندة»: الحلقات التي تحددها لمشرف الحلقات أو المعلم المساعد من بطاقة العضو. «طلابه وحلقاته فقط»: الطلاب المسندون إليه والحلقات التي هو معلمها.</p></div>
  <div class="card"><div class="card-h"><h2>صلاحيات خاصة بأشخاص</h2></div>${ovs.length?`<div class="list">${ovs.map(x=>`<div class="li"><div class="grow"><div class="t">${esc(x.name)} <span class="small muted">· ${ROLE[x.role]}</span></div><div class="chips" style="margin-top:4px">${x.scopeOverride?`<span class="pill p-info">النطاق: ${SCOPE[x.scopeOverride]}</span>`:""}${x.attScopeOverride?`<span class="pill p-info">التحضير: ${x.attScopeOverride==="circle"?"حلقته فقط":"كل نطاقه"}</span>`:""}${Object.entries(x.permOverrides||{}).map(([k,v])=>`<span class="pill ${v?"p-ok":"p-bad"}">${v?"سماح":"منع"}: ${(PERMS.find(p=>p[0]===k)||[,k])[1]}</span>`).join("")}</div></div><button class="btn sm" data-act="editMember" data-id="${x.id}">تعديل</button></div>`).join("")}</div>`:empty("لا استثناءات. من بطاقة أي عضو افتح «صلاحيات خاصة لهذا الشخص» لتمنحه صلاحية إضافية أو تمنعها عنه.")}</div>`;
}
function permsDoc(){const roles={};["admin","supervisor","teacher","assistant","examiner"].forEach(r=>{const c=roleCfg(r);roles[r]={scope:c.scope,attScope:c.attScope,perms:{...c.perms}}});return roles}

/* ============ التصدير: Excel و PDF ============ */
const LIBS={};
function lib(src,glob){return LIBS[src]||(LIBS[src]=new Promise((res,rej)=>{if(window[glob])return res(window[glob]);const sc=document.createElement("script");sc.src=src;sc.onload=()=>window[glob]?res(window[glob]):rej(new Error("lib"));sc.onerror=()=>{delete LIBS[src];rej(new Error("load"))};document.head.appendChild(sc)}))}
const XLSX_SRC="/vendor/xlsx.full.min.js",JSPDF_SRC="/vendor/jspdf.umd.min.js";
async function saveBlob(name,blob){
  if(DL){try{await DL.save({filename:name,data:blob});return}catch(e){if(e&&e.code==="declined")return;toast("تعذّر التنزيل ("+(e&&e.code||"")+")","err");return}}
  if(MODE==="demo"){const url=URL.createObjectURL(blob);openModal("الملف جاهز",`<p>في العرض التجريبي خارج المنصة لا يتوفر التنزيل المباشر.</p><p class="hint">${esc(name)} · ${Math.round(blob.size/1024)} ك.ب</p>`,"noop",{},"إغلاق");return url}
  toast("التنزيل غير متاح في هذا العرض","err");
}
const fname=t=>String(t).replace(/[\\/:*?"<>|]+/g,"").replace(/\s+/g,"-");
async function exportXLSX(name,sheets){
  toast("جاري تجهيز ملف Excel…");let X;try{X=await lib(XLSX_SRC,"XLSX")}catch(e){toast("تعذّر تحميل أداة Excel. تحقق من الاتصال.","err");return}
  const wb=X.utils.book_new();wb.Workbook={Views:[{RTL:true}]};
  sheets.forEach((sh,i)=>{const aoa=[[sh.title],[sh.sub||""],[],sh.head,...sh.rows];const ws=X.utils.aoa_to_sheet(aoa);
    ws["!cols"]=sh.head.map((h,c)=>({wch:Math.min(45,Math.max(8,...[h,...sh.rows.map(r=>r[c])].map(v=>String(v??"").length+2)))}));
    ws["!merges"]=[{s:{r:0,c:0},e:{r:0,c:Math.max(0,sh.head.length-1)}},{s:{r:1,c:0},e:{r:1,c:Math.max(0,sh.head.length-1)}}];
    X.utils.book_append_sheet(wb,ws,(sh.name||("ورقة"+(i+1))).replace(/[\\/?*[\]:]/g,"").slice(0,31))});
  const out=X.write(wb,{bookType:"xlsx",type:"array"});
  await saveBlob(fname(name)+".xlsx",new Blob([out],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
}
async function exportPDF(name,doc){
  toast("جاري تجهيز ملف PDF…");let J;try{J=await lib(JSPDF_SRC,"jspdf")}catch(e){toast("تعذّر تحميل أداة PDF. تحقق من الاتصال.","err");return}
  try{await Promise.all([document.fonts.load('800 30px Tajawal'),document.fonts.load('500 20px Tajawal')])}catch(e){}
  const W=1754,H=1240,M=70,F="Tajawal, Tahoma, sans-serif";const pages=[];let cv,x,y;
  const logo=new Image();logo.src=LOGO_MARK;try{await logo.decode()}catch(e){}
  const fit=(t,w)=>{t=String(t??"");if(x.measureText(t).width<=w)return t;while(t.length>1&&x.measureText(t+"…").width>w)t=t.slice(0,-1);return t+"…"};
  const newPage=()=>{cv=document.createElement("canvas");cv.width=W;cv.height=H;x=cv.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,W,H);x.direction="rtl";
    try{x.drawImage(logo,W-M-64,38,64,64)}catch(e){}
    x.textAlign="right";x.fillStyle="#284a70";x.font=`800 34px ${F}`;x.fillText(doc.title,W-M-84,76);
    x.fillStyle="#5b6979";x.font=`500 20px ${F}`;x.fillText(doc.sub||"",W-M-84,106);
    x.textAlign="left";x.fillText(cfg().circleName+(brand().tagline?" · "+brand().tagline:""),M,76);
    const gw=(W-2*M)/3;[["#e3c45a",0],["#2b8ea8",1],["#284a70",2]].forEach(([c,i])=>{x.fillStyle=c;x.fillRect(M+i*gw,124,gw,4)});
    y=160;pages.push(cv)};
  const foot=()=>{x.direction="rtl";x.textAlign="center";x.fillStyle="#8a96a3";x.font=`500 17px ${F}`;x.fillText(`صفحة ${pages.length} · صُدِّر في ${fmtD(today(),{day:"numeric",month:"long",year:"numeric"})}`,W/2,H-34)};
  newPage();
  if(doc.summary&&doc.summary.length){const per=6,gap=14,bw=(W-2*M-(per-1)*gap)/per,bh=86;
    doc.summary.forEach(([l,v],i)=>{const r=Math.floor(i/per),c=i%per;const bx=W-M-(c+1)*bw-c*gap,by=y+r*(bh+gap);
      x.fillStyle="#f3f6f8";x.fillRect(bx,by,bw,bh);x.strokeStyle="#dce3e9";x.lineWidth=1.5;x.strokeRect(bx,by,bw,bh);
      x.textAlign="right";x.fillStyle="#284a70";x.font=`800 32px ${F}`;x.fillText(fit(v,bw-28),bx+bw-14,by+42);x.fillStyle="#5b6979";x.font=`500 18px ${F}`;x.fillText(fit(l,bw-28),bx+bw-14,by+72)});
    y+=Math.ceil(doc.summary.length/per)*(bh+gap)+16}
  (doc.tables||[]).forEach(tb=>{
    if(!tb.rows.length)return;
    x.font=`500 19px ${F}`;const n=tb.head.length;const want=tb.head.map((h,c)=>Math.min(tb.maxW?.[c]||420,Math.max(70,...[h,...tb.rows.slice(0,200).map(r=>r[c])].map(v=>{x.font=`500 19px ${F}`;return x.measureText(String(v??"")).width+26}))));
    const tot=want.reduce((a,b)=>a+b,0);const avail=W-2*M;const cw=want.map(w=>w*avail/tot);
    const rh=40;
    const head=()=>{x.fillStyle="#e2e9f2";x.fillRect(M,y,avail,rh);let cx=W-M;x.fillStyle="#284a70";x.font=`700 18px ${F}`;x.textAlign="right";tb.head.forEach((h,c)=>{x.fillText(fit(h,cw[c]-16),cx-8,y+26);cx-=cw[c]});y+=rh};
    if(y+90>H-M){foot();newPage()}
    if(tb.title){x.textAlign="right";x.fillStyle="#1c2a3b";x.font=`800 24px ${F}`;x.fillText(tb.title,W-M,y+20);y+=40}
    head();
    tb.rows.forEach((r,i)=>{if(y+rh>H-M-20){foot();newPage();head()}
      if(i%2){x.fillStyle="#f7f9fa";x.fillRect(M,y,avail,rh)}
      let cx=W-M;x.fillStyle="#1c2a3b";x.font=`500 18px ${F}`;x.textAlign="right";r.forEach((v,c)=>{x.fillText(fit(v,cw[c]-16),cx-8,y+26);cx-=cw[c]});
      x.strokeStyle="#e6ebef";x.lineWidth=1;x.beginPath();x.moveTo(M,y+rh);x.lineTo(W-M,y+rh);x.stroke();y+=rh});
    y+=26});
  foot();
  const pdf=new J.jsPDF({orientation:"landscape",unit:"pt",format:"a4"});const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
  pages.forEach((c,i)=>{if(i)pdf.addPage();pdf.addImage(c.toDataURL("image/jpeg",0.9),"JPEG",0,0,pw,ph)});
  await saveBlob(fname(name)+".pdf",pdf.output("blob"));
}
function studentsReportData(m){
  const st=scoped(m);const[f,t]=curRange();
  const rows=st.map(s=>{const x=stats(s.id,...(ui.pm==="all"?curRange(s.id):[f,t]));const E=examsOf(s.id,f,t);return{s,x,ex:E.length?Math.round(E.reduce((a,e)=>a+n0(e.score),0)/E.length):""}});
  const head=["الطالب","المسار","الحلقة","المعلم","نسبة الحضور %","حاضر","متأخر","غائب","مستأذن","حفظ جديد (وجه)","مراجعة (وجه)","تلاوة (وجه)","أخطاء جلية","أخطاء خفية","متوسط التقدير","مهام منجزة","إجمالي المهام","جلسات تسميع","متوسط الاختبارات","النقاط","إجمالي المحفوظ/المقروء"];
  const full=rows.map(({s,x,ex})=>[s.name,TRACK[s.track],(get("circles",s.circleId)||{}).name||"",nameOf(s.teacherId),x.rate??"",x.att.present,x.att.late,x.att.absent,x.att.excused,x.newPages,x.revPages,x.tPages,x.errJ,x.errK,x.avg?+x.avg.toFixed(2):"",x.done,x.tasks,x.sess,ex,x.points,totalPages(s)]);
  const ph=["الطالب","الحلقة","الحضور","غياب","حفظ","مراجعة","تلاوة","أخطاء ج/خ","التقدير","المهام","الاختبار","النقاط"];
  const pr=rows.map(({s,x,ex})=>[s.name,(get("circles",s.circleId)||{}).name||"—",x.rate==null?"—":x.rate+"%",x.att.absent,x.newPages,x.revPages,x.tPages,`${x.errJ}/${x.errK}`,x.avg?x.avg.toFixed(1)+" "+gradeTxt(x.avg):"—",`${x.done}/${x.tasks}`,ex===""?"—":ex,x.points]);
  const rr=rows.filter(r=>r.x.rate!=null);
  const summary=[["طالب",rows.length],["متوسط الحضور",rr.length?Math.round(rr.reduce((a,b)=>a+b.x.rate,0)/rr.length)+"%":"—"],["أوجه حفظ جديد",rows.reduce((a,r)=>a+r.x.newPages,0)],["أوجه مراجعة",rows.reduce((a,r)=>a+r.x.revPages,0)],["أوجه تلاوة",rows.reduce((a,r)=>a+r.x.tPages,0)],["مهام منجزة",`${rows.reduce((a,r)=>a+r.x.done,0)}/${rows.reduce((a,r)=>a+r.x.tasks,0)}`]];
  const scopeName=ui.circle!=="all"&&get("circles",ui.circle)?" — "+get("circles",ui.circle).name:"";
  return{title:"تقرير الطلاب"+scopeName,sub:periodLabel(),head,full,ph,pr,summary,f,t};
}
function studentReportData(sid){
  const s=get("members",sid);const[f,t]=curRange(sid);const x=stats(sid,f,t);const isT=s.track==="tilawa";const m=me();const staff=isStaff(m);const c=cfg();
  const showG=staff||c.studentSeeGrades;const who=staff?"staff":m.role==="parent"?"parent":"student";
  const note=l=>who==="staff"?[nS(l)&&"للطالب: "+nS(l),nP(l)&&"لولي الأمر: "+nP(l),can(m,"notes.private")&&l.noteStaff&&"داخلية: "+l.noteStaff].filter(Boolean).join(" | "):who==="parent"?nP(l):nS(l);
  const amt=l=>amountTxt(l).replace(/<[^>]+>/g,"").replace(/&[a-z#0-9]+;/g,"");
  const head=["التاريخ","الحضور","المقدار",...(showG?(isT?["أخطاء جلية","أخطاء خفية","التقدير"]:["تقدير الحفظ","تقدير المراجعة"]):[]),"أحكام التجويد","الملاحظات"];
  const rows=x.logs.slice().reverse().map(l=>[l.date,ATT[l.attendance]||"",amt(l),...(showG?(isT?[n0(l.errJali),n0(l.errKhafi),gradeTxt(l.tGrade)]:[gradeTxt(l.newGrade),gradeTxt(l.revGrade)]):[]),(l.tajweed||[]).join("، "),[l.tajweedNote,note(l)].filter(Boolean).join(" — ")]);
  const E=examsOf(sid,f,t);
  const eh=["التاريخ","المقرر","الدرجة","التقدير","أخطاء جلية","أخطاء خفية","تنبيهات","ملاحظات"];const er=E.map(e=>[e.date,e.scope||"",n0(e.score),examGrade(e.score)[0],n0(e.errJali),n0(e.errKhafi),n0(e.tanbih),e.notes||""]);
  const summary=[["نسبة الحضور",x.rate==null?"—":x.rate+"%"],["حاضر/متأخر/غائب/مستأذن",`${x.att.present}/${x.att.late}/${x.att.absent}/${x.att.excused}`],...(isT?[["أوجه التلاوة",x.tPages],["أخطاء جلية/خفية",`${x.errJ}/${x.errK}`]]:[["حفظ جديد (وجه)",x.newPages],["مراجعة (وجه)",x.revPages]]),...(showG?[["متوسط التقدير",x.avg?x.avg.toFixed(1)+" "+gradeTxt(x.avg):"—"]]:[]),["المهام المنجزة",`${x.done}/${x.tasks}`],["جلسات التسميع",x.sess],["إجمالي "+(isT?"المقروء":"المحفوظ"),totalPages(s)+" وجه"],...(E.length?[["متوسط الاختبارات",Math.round(E.reduce((a,e)=>a+n0(e.score),0)/E.length)]]:[]),...(c.showPoints?[["النقاط",x.points]]:[])];
  return{s,title:"تقرير الطالب: "+s.name,sub:`${TRACK[s.track]} · المعلم: ${nameOf(s.teacherId)} · ${periodLabel([f,t])}`,head,rows,eh,er,summary};
}
function programReportData(pid){
  const p=get("programs",pid);const st=programStudents(p);const L=p.lessons||[];
  const head=["الطالب",...L.map((l,i)=>`${i+1}. ${l.title}`),"المنجز","النسبة %"];
  const rows=st.map(s=>{const d=progOf(s.id,p.id);const n=L.filter(l=>d.includes(l.id)).length;return[s.name,...L.map(l=>d.includes(l.id)?"✓":"—"),`${n}/${L.length}`,L.length?Math.round(n/L.length*100):0]});
  return{title:"تقرير برنامج: "+p.title,sub:`${PKIND[p.kind]||""} · ${L.length} درس · ${st.length} طالب`,head,rows};
}

/* ============ التخصيص ============ */
const uiCfg=()=>get("config","ui")||{};
const DEF_BRAND={tagline:"أحد برامج مَعين",verse:"«خيرُكم مَن تعلَّم القرآنَ وعلَّمه»",primary:"",accent:"",bg:"",surface:"",header:"",fontBody:"",fontHead:"",fontScale:1,hideLogo:false};
const FONT_HOST="self";
const FONTS=[["Tajawal","تجوال","عصري وواضح"],["Cairo","القاهرة","عريض ومقروء"],["Almarai","المراعي","بسيط وهادئ"],["IBM Plex Sans Arabic","IBM Plex عربي","رسمي ومتوازن"],["Readex Pro","ريدكس","حديث ودائري"],["Noto Kufi Arabic","نوتو كوفي","كوفي هندسي"],["Reem Kufi","ريم كوفي","كوفي زخرفي للعناوين"],["Noto Naskh Arabic","نوتو نسخ","نسخ تقليدي"],["Amiri","أميري","نسخ كلاسيكي"]];
const FONT_STACK=f=>`"${f}","Tajawal",Tahoma,"Segoe UI",sans-serif`;
const lum=h=>{const n=parseInt(h.slice(1),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255;const L=c=>c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4);return .2126*L(r)+.7152*L(g)+.0722*L(b)};
const brand=()=>({...DEF_BRAND,...(uiCfg().brand||{})});
function saveUi(patch){return stageConfig("ui",{...uiCfg(),...patch})}
let TDEF=null;
const TERM_DICTS=()=>[["ROLE","الأدوار",ROLE,null],["TRACK","المسارات",TRACK,null],["CTRACK","مسارات الحلقات",CTRACK,null],["ATT","حالات الحضور",ATT,null],["GR","التقديرات",GR,null],["KIND","أنواع المهام",KIND,null],["PKIND","أنواع البرامج المصاحبة",PKIND,null],["JST","حالات خريطة الحفظ",JST,0],["SESS_LBL","حالات المواعيد",SESS_LBL,0],["TATT","حالات حضور المعلمين",TATT,1]];
function applyTerms(){
  const D=TERM_DICTS();if(!TDEF){TDEF={};D.forEach(([n,,o])=>TDEF[n]=JSON.parse(JSON.stringify(o)));TDEF.TAJ=[...TAJWEED]}
  const T=uiCfg().terms||{};
  D.forEach(([n,,o,idx])=>{Object.keys(TDEF[n]).forEach(k=>{const dv=TDEF[n][k];const ov=(T[n]||{})[k];if(idx==null)o[k]=ov||dv;else{o[k]=[...dv];if(ov)o[k][idx]=ov}})});
  const L=uiCfg().lists||{};const tj=L.tajweed&&L.tajweed.length?L.tajweed:TDEF.TAJ;TAJWEED.splice(0,TAJWEED.length,...tj);
}
const HEX=/^#[0-9a-f]{6}$/i;
const THEME_KEY="halaqa-theme";
function getThemeMode(){try{return localStorage.getItem(THEME_KEY)||"system"}catch(e){return"system"}}
const isDark=()=>{const t=getThemeMode();if(t==="dark")return true;if(t==="light")return false;const a=document.documentElement.getAttribute("data-theme");if(a)return a==="dark";return !!(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)};
function applyThemeMode(){const t=getThemeMode(),r=document.documentElement;if(t==="system"){if(r.dataset.userTheme){r.removeAttribute("data-theme");delete r.dataset.userTheme}}else{r.setAttribute("data-theme",t);r.dataset.userTheme="1"}}
function setThemeMode(t){try{if(t==="system")localStorage.removeItem(THEME_KEY);else localStorage.setItem(THEME_KEY,t)}catch(e){}applyThemeMode();render()}
try{applyThemeMode();window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>render())}catch(e){}
const COLOR_PRESETS=[["maeen","ألوان مَعين","#284a70","#a8862a"],["green","أخضر المصحف","#1f6b52","#b07d2a"],["teal","تركوازي هادئ","#17707d","#b8862e"],["burgundy","عنابي","#7a2e3b","#b8892f"],["brown","بني وذهبي","#6b4a2b","#b8902f"],["indigo","نيلي","#33407a","#b0862c"]];
const TOKENS=[["primary","اللون الأساسي","الأزرار والعناوين والقائمة"],["accent","لون التمييز","الذهبي والزخارف والتنبيهات اللطيفة"],["bg","خلفية الواجهة","لون الصفحة كلها"],["surface","البطاقات","خلفية البطاقات والنوافذ"],["surface2","الخلفيات الثانوية","مربعات الأرقام وخلفيات الجداول"],["header","الشريط العلوي",""],["ink","النصوص",""],["muted","النصوص الثانوية","التواريخ والتوضيحات"],["line","الحدود",""],["ok","حاضر / نجاح",""],["warn","متأخر / تنبيه",""],["bad","غائب / خطأ",""],["info","مستأذن / معلومة",""]];
const TOKEN_DEF={light:{primary:"#284a70",accent:"#a8862a",bg:"#f3f5f6",surface:"#ffffff",surface2:"#edf1f4",header:"#ffffff",ink:"#1c2a3b",muted:"#5b6979",line:"#dce3e9",ok:"#2c7a55",warn:"#a46b12",bad:"#b0453c",info:"#217f98"},dark:{primary:"#86aedb",accent:"#ddbd5c",bg:"#0f151d",surface:"#161f2a",surface2:"#1c2733",header:"#161f2a",ink:"#e5ebf1",muted:"#97a5b4",line:"#2a3645",ok:"#5cc08d",warn:"#e2ac4f",bad:"#e57d72",info:"#5cc2db"}};
const okHex=v=>HEX.test(v||"")?v:"";
function lightTokens(b){const legacy={primary:b.primary,accent:b.accent,bg:b.bg,surface:b.surface,header:b.header};const o={};Object.entries({...legacy,...(b.light||{})}).forEach(([k,v])=>{if(okHex(v))o[k]=v});return o}
function darkTokens(b){const o={};Object.entries(b.dark||{}).forEach(([k,v])=>{if(okHex(v))o[k]=v});return o}
function tokenVars(t,dark){
  let v="";const B=t.bg||TOKEN_DEF[dark?"dark":"light"].bg;const set=(k,x)=>{v+=`--${k}:${x};`};
  if(t.primary){set("primary",t.primary);set("primary-soft",`color-mix(in srgb,${t.primary} ${dark?28:12}%,${B})`);set("primary-ink",lum(t.primary)>.42?"#0c1420":"#ffffff");set("teal",t.primary)}
  if(t.accent){set("accent",t.accent);set("gold",t.accent);set("accent-soft",`color-mix(in srgb,${t.accent} ${dark?22:14}%,${B})`)}
  if(t.bg)set("bg",t.bg);if(t.surface)set("surface",t.surface);if(t.surface2)set("surface-2",t.surface2);if(t.ink)set("ink",t.ink);if(t.muted)set("muted",t.muted);if(t.line)set("line",t.line);
  ["ok","warn","bad","info"].forEach(k=>{if(t[k]){set(k,t[k]);set(k+"-soft",`color-mix(in srgb,${t[k]} ${dark?22:14}%,${B})`)}});
  if(t.header){const d=lum(t.header)<.35;set("top",t.header);set("top-ink",d?"#ffffff":(t.ink||"#1c2a3b"));set("top-muted",d?"rgba(255,255,255,.75)":(t.muted||"#5b6979"));set("top-on",d?"rgba(255,255,255,.18)":"var(--primary)");set("top-on-ink",d?"#ffffff":"var(--primary-ink)")}
  return v;
}
function autoDarkVars(L){let v="";const p=L.primary,a=L.accent;
  if(p)v+=`--primary:color-mix(in srgb,${p} 62%,white);--primary-ink:#0c1420;--primary-soft:color-mix(in srgb,${p} 30%,#0f151d);`;
  if(a)v+=`--accent:color-mix(in srgb,${a} 75%,white);--accent-soft:color-mix(in srgb,${a} 22%,#0f151d);--gold:color-mix(in srgb,${a} 75%,white);`;
  if(L.bg)v+=`--bg:color-mix(in srgb,${L.bg} 10%,#0b1016);--surface-2:color-mix(in srgb,${L.bg} 12%,#18212b);`;
  if(L.surface)v+=`--surface:color-mix(in srgb,${L.surface} 10%,#151d27);`;
  if(L.header)v+=`--top:color-mix(in srgb,${L.header} 45%,#0b1016);--top-ink:#ffffff;--top-muted:rgba(255,255,255,.72);--top-on:rgba(255,255,255,.16);--top-on-ink:#ffffff;`;
  return v}
const cssName=n=>String(n||"").replace(/["'\;{}<>]/g,"").trim().slice(0,60);
function allFonts(){const b=brand();return [...FONTS,...(b.customFonts||[]).filter(f=>f&&f.name).map(f=>[cssName(f.name),cssName(f.name),f.google?"من Google Fonts":"خط مرفوع",f])]}
function applyTheme(){
  const b=brand();const L=lightTokens(b),D=darkTokens(b);const auto=b.darkAuto!==false;
  const lv=tokenVars(L,false);const dv=auto?autoDarkVars(L)+tokenVars(D,true):tokenVars(D,true);
  const known=allFonts().map(f=>f[0]);const fb=b.fontBody&&known.includes(b.fontBody)?b.fontBody:"",fh=b.fontHead&&known.includes(b.fontHead)?b.fontHead:"";
  const sc=Math.min(1.3,Math.max(.85,Number(b.fontScale)||1));
  const faces=(b.customFonts||[]).filter(f=>f&&f.url&&/^(https:\/\/|\/|blob:)/.test(f.url)).map(f=>`@font-face{font-family:"${cssName(f.name)}";src:url("${String(f.url).replace(/["\\]/g,"")}");font-weight:100 900;font-display:swap}`).join("");
  const fv=(fb?`--f-body:${FONT_STACK(fb)};`:"")+(fh||fb?`--f-display:${FONT_STACK(fh||fb)};`:"");
  const css=faces+(lv||dv?`:root{${lv}}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${dv}}}:root[data-theme="light"]{${lv}}:root[data-theme="dark"]{${dv}}`:"")+(fv?`:root{${fv}}`:"")+(sc!==1?`html{font-size:${sc*100}%}body{font-size:${(16*sc).toFixed(1)}px}`:"");
  let el=document.getElementById("ctheme");if(!el){el=document.createElement("style");el.id="ctheme";document.head.appendChild(el)}if(el.textContent!==css)el.textContent=css;
  const gnames=new Set((b.customFonts||[]).filter(f=>f&&f.google).map(f=>cssName(f.name)));
  const need=[...new Set([fb,fh].filter(f=>f&&f!=="Tajawal"&&(FONT_HOST==="google"&&FONTS.some(x=>x[0]===f)||gnames.has(f))))];
  const href=need.length?"https://fonts.googleapis.com/css2?"+need.map(f=>"family="+encodeURIComponent(f).replace(/%20/g,"+")+(gnames.has(f)?"":":wght@400;700")).join("&")+"&display=swap":"";
  let l=document.getElementById("gfont");if(href){if(!l){l=document.createElement("link");l.id="gfont";l.rel="stylesheet";document.head.appendChild(l)}if(l.getAttribute("href")!==href)l.setAttribute("href",href)}else if(l)l.remove();
}
function colorsCardHTML(b){
  const mode=ui.cmodeTab||(isDark()?"dark":"light");const auto=b.darkAuto!==false;const T=mode==="dark"?darkTokens(b):lightTokens(b);const D=TOKEN_DEF[mode];
  const rows=TOKENS.map(([k,l,h])=>`<label class="crow"><span class="swatch" style="background:${T[k]||D[k]}"></span><b class="grow">${l}${h?`<br><small class="muted" style="font-weight:400">${h}</small>`:""}${T[k]?"":` <span class="hint">(افتراضي)</span>`}</b>${T[k]?`<button type="button" class="btn ghost sm" data-act="tokClear" data-m="${mode}" data-k="${k}">افتراضي</button>`:""}<input type="color" id="tk-${mode}-${k}" value="${T[k]||D[k]}" data-change="tokSet" data-m="${mode}" data-k="${k}"></label>`).join("");
  return `<div class="card" style="grid-column:1/-1"><div class="card-h"><h2>الألوان</h2><button class="btn sm" data-act="colorsReset">ألوان مَعين الأصلية</button></div>
  <div class="stack"><div class="presets">${COLOR_PRESETS.map(([k,l,p,a])=>`<button class="preset" data-act="colorPreset" data-v="${k}"><span class="sw" style="background:${p}"></span><span class="sw" style="background:${a}"></span>${l}</button>`).join("")}</div>
  <div class="subtabs"><button data-act="cmodeTab" data-v="light" class="${mode==="light"?"on":""}">${ICON.sun} ألوان الوضع الفاتح</button><button data-act="cmodeTab" data-v="dark" class="${mode==="dark"?"on":""}">${ICON.moon} ألوان الوضع الليلي</button></div>
  <p class="hint">عند اختيار تبويب يتحول عرضك إلى ذلك الوضع لتشاهد التعديل مباشرة.</p>
  ${mode==="dark"?`<label class="switch" style="border:0;padding:0"><span><b>اشتقاق ألوان الليلي تلقائياً من الفاتح</b><br><span class="hint">أطفئه لتختار كل لون في الوضع الليلي بنفسك</span></span><input type="checkbox" id="b-dauto" data-change="darkAuto" ${auto?"checked":""}></label>`:""}
  ${mode==="dark"&&auto?`<p class="hint">ألوان الليلي الآن مشتقة من ألوان الفاتح. ما تغيّره هنا يُطبَّق فوق الاشتقاق.</p>`:""}
  <div class="tok-grid">${rows}</div></div></div>`;
}
function fontsCardHTML(b){
  const F=allFonts();const cf=b.customFonts||[];
  return `<div class="card" style="grid-column:1/-1"><div class="card-h"><h2>الخطوط</h2><button class="btn sm" data-act="fontsReset">الخط الافتراضي</button></div>
    <div class="fg">${fld("خط النصوص",`<select id="b-fbody" data-change="brandFont" data-k="fontBody">${F.map(([f,l,h])=>`<option value="${esc(f)}" ${(b.fontBody||"Tajawal")===f?"selected":""}>${esc(l)} — ${esc(h)}</option>`).join("")}</select>`)}${fld("خط العناوين",`<select id="b-fhead" data-change="brandFont" data-k="fontHead"><option value="">نفس خط النصوص</option>${F.map(([f,l,h])=>`<option value="${esc(f)}" ${b.fontHead===f?"selected":""}>${esc(l)} — ${esc(h)}</option>`).join("")}</select>`)}</div>
    <div class="row" style="gap:10px"><span class="small muted">حجم الخط</span><div class="seg modeseg">${[[0.9,"صغير"],[1,"عادي"],[1.1,"كبير"],[1.2,"كبير جداً"]].map(([v,l])=>`<button data-act="fontScale" data-v="${v}" class="${Math.abs((Number(b.fontScale)||1)-v)<.01?"on":""}">${l}</button>`).join("")}</div></div>
    <div class="font-prev"><h3>منصة حلقات القرآن الكريم</h3><p>بسم الله نبدأ: حضر الطالب اليوم، وسمّع وجهين من سورة الملك بتقدير ممتاز، ٠١٢٣ 0123.</p></div>
    <div class="font-grid">${F.map(([f,l,h])=>`<button class="font-card ${(b.fontBody||"Tajawal")===f?"on":""}" data-act="pickFont" data-v="${esc(f)}" style="font-family:${FONT_STACK(f).replace(/"/g,"&quot;")}"><b>${esc(l)}</b><span>حلقات القرآن الكريم</span><small>${esc(h)}</small></button>`).join("")}</div>
    <fieldset><legend>إضافة خط خارجي</legend>
     <div class="fg">${fld("اسم الخط",`<input id="cf-name" placeholder="مثال: خطي الخاص أو Lalezar" maxlength="60">`,"للخط من Google اكتب اسمه كما هو في fonts.google.com")}</div>
     <div class="row" style="gap:8px">${ASSETS||MODE==="demo"?`<label class="btn sm pri">رفع ملف خط (woff2, woff, ttf, otf)<input type="file" id="cf-file" accept=".woff2,.woff,.ttf,.otf,font/*" data-change="fontUpload" hidden></label>`:`<span class="hint">رفع الملفات يحتاج صلاحية رفع على المنصة.</span>`}<button type="button" class="btn sm" data-act="fontGoogle">إضافة من Google Fonts</button></div>
     ${cf.length?`<div class="list">${cf.map((f,i)=>`<div class="li"><span class="grow" style="font-family:${FONT_STACK(cssName(f.name)).replace(/"/g,"&quot;")}"><b>${esc(f.name)}</b> <span class="small muted">· ${f.google?"Google Fonts":"ملف مرفوع"}</span> — حلقات القرآن الكريم</span><button class="btn ghost sm danger" data-act="fontDel" data-i="${i}">حذف</button></div>`).join("")}</div>`:""}
    </fieldset>
    <p class="hint">اضغط أي خط لتجربته على المنصة كلها، ثم «حفظ التعديلات».</p></div>`;
}

function applyReplace(root){
  const L=(uiCfg().replace||[]).filter(r=>r&&r[0]);if(!L.length||!root)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const todo=[];
  while((n=w.nextNode())){if(!n.nodeValue.trim())continue;const pe=n.parentElement;if(!pe||pe.closest(".mushaf,[data-noreplace],textarea,script,style"))continue;todo.push(n)}
  todo.forEach(n=>{let t=n.nodeValue;const o=t;L.forEach(([a,b])=>{if(t.includes(a))t=t.split(a).join(b||"")});if(t!==o)n.nodeValue=t});
}
function navItems(m,base,noP){
  const rc=((uiCfg().nav||{})[m.role])||[];
  let items=base.map(([k,l])=>{const o=rc.find(x=>x.k===k)||{};return{k,dl:l,l:o.l||l,h:!!o.h,i:rc.findIndex(x=>x.k===k)}});
  items.sort((a,b)=>(a.i<0?999:a.i)-(b.i<0?999:b.i));
  if(!noP&&(m.navPref||[]).length){const P=m.navPref;items.forEach(it=>{const j=P.findIndex(x=>x.k===it.k);it.pi=j<0?999:j;it.ph=j<0?false:!!P[j].h});items.sort((a,b)=>a.pi-b.pi)}
  return items;
}
function orderNav(m,base){const items=navItems(m,base,false);const vis=items.filter(it=>!it.h&&!it.ph);return (vis.length?vis:items.slice(0,1)).map(it=>[it.k,it.l])}
const fakeM=r=>({id:"_preview",role:r,status:"active",circleIds:[],childIds:[]});
const roleNavItems=r=>{const f=fakeM(r);return navItems(f,baseNav(f),true)};
function saveNav(r,items){const nav={...(uiCfg().nav||{})};nav[r]=items.map(x=>({k:x.k,...(x.l!==x.dl?{l:x.l}:{}),...(x.h?{h:true}:{})}));saveUi({nav})}
const HOME_BLOCKS={staff:[["hero","الترحيب والأزرار السريعة",1],["stats","الأرقام السريعة",1],["pending","بانتظار إجراء منك",1],["alerts","التنبيهات",1],["recits","التسميع الصوتي بانتظار التقييم",1],["sessions","مواعيد اليوم",0],["students","حال الطلاب اليوم",0]],
  student:[["hero","بطاقة اليوم",1],["stats","الأرقام السريعة",1],["msg","رسالة المعلم",1],["tasks","مهام اليوم",1],["next","موعد التسميع القادم",1],["circle","بطاقة الحلقة",1],["side","آخر متابعة والأيام القادمة",1],["badges","الأوسمة",1],["certs","الشهادات",1]]};
function homeOrder(g){const U=((uiCfg().home||{})[g])||[];const items=HOME_BLOCKS[g].map(([k,l,full])=>{const o=U.find(x=>x.k===k)||{};return{k,l,full,h:!!o.h,i:U.findIndex(x=>x.k===k)}});items.sort((a,b)=>(a.i<0?999:a.i)-(b.i<0?999:b.i));return items}
function homeLayout(g,B){let out="",half=[];const flush=()=>{if(half.length){out+=half.length>1?`<div class="grid g2">${half.join("")}</div>`:half[0];half=[]}};
  homeOrder(g).forEach(it=>{if(it.h||!B[it.k])return;if(it.full){flush();out+=B[it.k]}else half.push(B[it.k])});flush();return out}
function saveHome(g,items){const home={...(uiCfg().home||{})};home[g]=items.map(x=>({k:x.k,...(x.h?{h:true}:{})}));saveUi({home})}
const GRIP=`<svg width="14" height="20" viewBox="0 0 14 20" aria-hidden="true"><g fill="currentColor"><circle cx="4" cy="4" r="1.7"/><circle cx="10" cy="4" r="1.7"/><circle cx="4" cy="10" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="4" cy="16" r="1.7"/><circle cx="10" cy="16" r="1.7"/></g></svg>`;
let DRAG=null,PENDING=false;
function commitSort(list,keys,focusKey){
  const t=list.dataset.sort;
  if(t==="nav"){const r=list.dataset.r;const items=roleNavItems(r);saveNav(r,keys.map(k=>items.find(x=>x.k===k)).filter(Boolean))}
  else if(t==="home"){const g=list.dataset.g;const items=homeOrder(g);saveHome(g,keys.map(k=>items.find(x=>x.k===k)).filter(Boolean))}
  else if(t==="mynav"){myNavModal(keys.map(k=>modalCtx.items.find(x=>x.k===k)).filter(Boolean))}
  if(focusKey)setTimeout(()=>{const g=document.querySelector(`.clist[data-sort="${t}"] .crow[data-key="${focusKey}"] .grip`);if(g)g.focus()},30);
}
document.addEventListener("pointerdown",e=>{const g=e.target.closest(".grip");if(!g)return;const row=g.closest(".crow"),list=row&&row.parentElement;if(!list||!list.dataset.sort)return;
  e.preventDefault();const b=row.getBoundingClientRect();DRAG={row,list,id:e.pointerId,order:[...list.querySelectorAll(":scope > .crow")].map(r=>r.dataset.key),dy:e.clientY-b.top};row.classList.add("dragging");list.classList.add("sorting");try{g.setPointerCapture(e.pointerId)}catch(_){}});
document.addEventListener("pointermove",e=>{if(!DRAG||e.pointerId!==DRAG.id)return;const{row,list}=DRAG;
  const rows=[...list.querySelectorAll(":scope > .crow")].filter(r=>r!==row);let before=null;
  for(const r of rows){const b=r.getBoundingClientRect();if(e.clientY<b.top+b.height/2){before=r;break}}
  if(before){if(row.nextElementSibling!==before)list.insertBefore(row,before)}else if(list.lastElementChild!==row)list.appendChild(row);
  const sc=row.closest(".dlg")||window;const dy=e.clientY<70?-14:e.clientY>innerHeight-70?14:0;if(dy)sc.scrollBy(0,dy)});
function endDrag(e){if(!DRAG||(e&&e.pointerId!==DRAG.id))return;const{row,list,order}=DRAG;row.classList.remove("dragging");list.classList.remove("sorting");DRAG=null;
  const keys=[...list.querySelectorAll(":scope > .crow")].map(r=>r.dataset.key);if(keys.join()!==order.join())commitSort(list,keys);else if(PENDING){PENDING=false;render()}}
document.addEventListener("pointerup",endDrag);document.addEventListener("pointercancel",endDrag);
document.addEventListener("keydown",e=>{const g=e.target.closest&&e.target.closest(".grip");if(!g||(e.key!=="ArrowUp"&&e.key!=="ArrowDown"))return;e.preventDefault();e.stopPropagation();
  const row=g.closest(".crow"),list=row.parentElement;const keys=[...list.querySelectorAll(":scope > .crow")].map(r=>r.dataset.key);const i=keys.indexOf(row.dataset.key),j=i+(e.key==="ArrowUp"?-1:1);if(j<0||j>=keys.length)return;[keys[i],keys[j]]=[keys[j],keys[i]];commitSort(list,keys,row.dataset.key)},true);
const moveBtns=(act,attrs,i,len)=>`<button class="btn ghost sm" data-act="${act}" ${attrs} data-n="-1" ${i===0?"disabled":""} aria-label="لأعلى">↑</button><button class="btn ghost sm" data-act="${act}" ${attrs} data-n="1" ${i===len-1?"disabled":""} aria-label="لأسفل">↓</button>`;
function customView(m){
  if(!can(m,"ui.customize"))return empty("ليست لديك صلاحية التخصيص.");
  const tabs=[["nav","القائمة العلوية"],["home","الصفحة الرئيسية"],["terms","المسميات"],["texts","استبدال النصوص"],["lists","القوائم"],["brand","الهوية والألوان"]];
  const t=ui.ctab||"nav";let body="";
  if(t==="nav"){const r=ui.crole||"teacher";const items=roleNavItems(r);
    body=`<div class="card"><div class="card-h"><div class="row"><h2>قائمة</h2><select data-change="crole" id="c-role">${Object.entries(ROLE).map(([k,l])=>`<option value="${k}" ${k===r?"selected":""}>${esc(l)}</option>`).join("")}</select></div><button class="btn sm" data-act="navReset" data-r="${r}">إعادة الافتراضي</button></div>
    <p class="hint" style="margin-bottom:10px">اسحب أي قسم من المقبض <b>⠿</b> لأعلى أو لأسفل لترتيبه. رتّب أقسام القائمة العلوية لهذا الدور، وغيّر أسماءها، وأخفِ ما لا يحتاجه. ما يظهر هنا محكوم أيضاً بصلاحيات الدور. ويستطيع كل مستخدم ترتيب قائمته الشخصية من زر الإعدادات بجانب اسمه.</p>
    <div class="clist" data-sort="nav" data-r="${r}">${items.map((it,i)=>`<div class="crow ${it.h?"off":""}" data-key="${it.k}"><button type="button" class="grip" aria-label="اسحب لإعادة الترتيب، أو استخدم الأسهم" title="اسحب لأعلى أو لأسفل">${GRIP}</button><span class="num muted"></span><input id="nl-${r}-${it.k}" value="${esc(it.l)}" data-change="navLabel" data-r="${r}" data-k="${it.k}" placeholder="${esc(it.dl)}" aria-label="اسم القسم"><span class="hint">${it.l!==it.dl?"الأصلي: "+esc(it.dl):""}</span><label class="row small"><input type="checkbox" id="ns-${r}-${it.k}" data-change="navShow" data-r="${r}" data-k="${it.k}" ${it.h?"":"checked"}> ظاهر</label></div>`).join("")}</div>
    <div class="navprev"><span class="hint">معاينة:</span>${items.filter(x=>!x.h).map((x,i)=>`<span class="${i===0?"on":""}">${esc(x.l)}</span>`).join("")}</div></div>`}
  else if(t==="home"){const g=ui.chome||"staff";const items=homeOrder(g);
    body=`<div class="card"><div class="card-h"><div class="row"><h2>الصفحة الرئيسية لـ</h2><select data-change="chome" id="c-home"><option value="staff" ${g==="staff"?"selected":""}>المعلمين والمشرفين</option><option value="student" ${g==="student"?"selected":""}>الطلاب</option></select></div><button class="btn sm" data-act="homeReset" data-g="${g}">إعادة الافتراضي</button></div>
    <p class="hint" style="margin-bottom:10px">اسحب أي قسم من المقبض <b>⠿</b> لترتيبه. رتّب أقسام الصفحة الرئيسية وأخفِ ما لا تريده. الأقسام المتجاورة من نوع «نصف عرض» تظهر جنباً إلى جنب.</p>
    <div class="clist" data-sort="home" data-g="${g}">${items.map((it,i)=>`<div class="crow ${it.h?"off":""}" data-key="${it.k}"><button type="button" class="grip" aria-label="اسحب لإعادة الترتيب، أو استخدم الأسهم" title="اسحب لأعلى أو لأسفل">${GRIP}</button><span class="num muted"></span><b class="grow">${esc(it.l)}</b><span class="pill">${it.full?"عرض كامل":"نصف عرض"}</span><label class="row small"><input type="checkbox" id="hs-${g}-${it.k}" data-change="homeShow" data-g="${g}" data-k="${it.k}" ${it.h?"":"checked"}> ظاهر</label></div>`).join("")}</div></div>`}
  else if(t==="terms"){const T=uiCfg().terms||{};
    body=`<p class="hint">غيّر أي مسمّى داخلي، فيتغير في كل مكان يظهر فيه. اترك الحقل فارغاً للعودة إلى الاسم الأصلي.</p><div class="grid g2">${TERM_DICTS().map(([n,label,,idx])=>`<div class="card"><div class="card-h"><h3>${label}</h3></div><div class="stack" style="gap:6px">${Object.keys(TDEF[n]).map(k=>{const dv=idx==null?TDEF[n][k]:TDEF[n][k][idx];return `<label class="trow"><span class="muted small">${esc(dv)}</span><input id="t-${n}-${k}" value="${esc((T[n]||{})[k]||"")}" placeholder="${esc(dv)}" data-change="term" data-d="${n}" data-k="${k}"></label>`}).join("")}</div></div>`).join("")}</div><div><button class="btn sm danger" data-act="termsReset">إعادة كل المسميات</button></div>`}
  else if(t==="texts"){const L=uiCfg().replace||[];
    body=`<div class="card"><div class="card-h"><h2>استبدال النصوص</h2><button class="btn sm pri" data-act="replAdd">إضافة استبدال</button></div><p class="hint" style="margin-bottom:10px">لتغيير أي عبارة تظهر في الواجهة، مثل «السجل اليومي» إلى «دفتر المتابعة». يُطبَّق على كل النصوص ما عدا نص المصحف الشريف وما يكتبه المستخدمون في الحقول.</p>
    ${L.length?`<div class="clist">${L.map((r,i)=>`<div class="crow"><input id="r-${i}-0" value="${esc(r[0]||"")}" placeholder="النص الحالي" data-change="repl" data-i="${i}" data-f="0"><span>←</span><input id="r-${i}-1" value="${esc(r[1]||"")}" placeholder="النص الجديد" data-change="repl" data-i="${i}" data-f="1"><button class="btn ghost sm danger" data-act="replDel" data-i="${i}">حذف</button></div>`).join("")}</div>`:empty("لا استبدالات بعد.")}</div>`}
  else if(t==="lists"){const L=uiCfg().lists||{};
    body=`<div class="grid g2"><div class="card"><div class="card-h"><h2>أحكام التجويد</h2></div>${fld("حكم في كل سطر",`<textarea id="l-taj" data-change="listTaj" style="min-height:220px">${esc((L.tajweed&&L.tajweed.length?L.tajweed:TDEF.TAJ).join("\n"))}</textarea>`,"تظهر عند تسجيل المتابعة واختيار الأحكام التي تحتاج تدريباً")}</div>
    <div class="card"><div class="card-h"><h2>عناوين الشهادات المقترحة</h2></div>${fld("عنوان في كل سطر",`<textarea id="l-cert" data-change="listCert" style="min-height:220px">${esc((L.certs&&L.certs.length?L.certs:CERT_SUG).join("\n"))}</textarea>`,"تظهر كاقتراحات عند إصدار شهادة")}</div></div>`}
  else{const b=brand();
    body=`<div class="grid g2"><div class="card"><div class="card-h"><h2>النصوص</h2></div><div class="stack">${fld("السطر أعلى اسم الحلقة",`<input id="b-tag" value="${esc(b.tagline)}" data-change="brand" data-k="tagline">`,"اتركه فارغاً لإخفائه")}${fld("العبارة فوق التحية",`<input id="b-verse" value="${esc(b.verse)}" data-change="brand" data-k="verse">`,"آية أو حديث، أو اتركه فارغاً")}<label class="switch" style="border:0;padding:0"><span>إخفاء الشعار من الشريط العلوي</span><input type="checkbox" id="b-logo" data-change="brandLogo" ${b.hideLogo?"checked":""}></label><p class="hint">اسم الحلقة نفسه يُعدَّل من «الإدارة».</p></div></div>
    ${colorsCardHTML(b)}${fontsCardHTML(b)}</div>`}
  return `<div class="hero"><div><h1>التخصيص</h1><div class="date">رتّب وسمِّ وغيّر الواجهة كما تريد، ثم اضغط «حفظ التعديلات» لتظهر للجميع</div></div></div>
  <div class="subtabs">${tabs.map(([k,l])=>`<button data-act="ctab" data-v="${k}" class="${t===k?"on":""}">${l}</button>`).join("")}</div><div data-noreplace class="stack" style="gap:16px">${body}</div>`;
}
function myNavModal(items){
  const m=me();items=items||navItems(m,baseNav(m),false).filter(x=>!x.h).map(x=>({k:x.k,l:x.l,h:!!x.ph}));
  const body=`<p class="hint">اسحب أي قسم من المقبض <b>⠿</b> لأعلى أو لأسفل، وأخفِ ما لا تستخدمه. هذا الترتيب لك وحدك.</p><div class="clist" data-sort="mynav">${items.map((it,i)=>`<div class="crow ${it.h?"off":""}" data-key="${it.k}"><button type="button" class="grip" aria-label="اسحب لإعادة الترتيب، أو استخدم الأسهم" title="اسحب لأعلى أو لأسفل">${GRIP}</button><span class="num muted"></span><b class="grow">${esc(it.l)}</b><label class="row small"><input type="checkbox" data-change="myNavShow" data-i="${i}" id="mn-${it.k}" ${it.h?"":"checked"}> ظاهر</label></div>`).join("")}</div>`;
  openModal("ترتيب قائمتي",body,"myNav",{items},"حفظ",`<button type="button" class="btn" data-act="myNavReset">الترتيب الافتراضي</button>`);
}

/* ============ واجهة الجوال للطالب وولي الأمر ============ */
const isApp=m=>!!m&&m.status==="active"&&(m.role==="student"||m.role==="parent")&&!isStaff(m);
const SV=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const NAVICON={today:SV('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),plan:SV('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),mushaf:SV('<path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5z"/><path d="M12 6v14"/>'),recite:SV('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),programs:SV('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),sessions:SV('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),record:SV('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),board:SV('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),child:SV('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5.5 5"/>'),notes:SV('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'),home:SV('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),daily:SV('<path d="M9 11l2 2 4-4"/><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 17h8"/>'),students:SV('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5.5 5"/>'),circles:SV('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="7" r="1.5"/><circle cx="7" cy="14" r="1.5"/><circle cx="17" cy="14" r="1.5"/>'),reports:SV('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),admin:SV('<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>'),perms:SV('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),custom:SV('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),settings:SV('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),more:SV('<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>')};
function appTabs(m){const nav=navFor(m);if(nav.length<=5)return{bar:nav,more:[]};return{bar:[...nav.slice(0,4),["more","المزيد"]],more:nav.slice(4)}}
function bottomBar(m,cls){
  const{bar,more}=appTabs(m);const v=ui.view;const inMore=more.some(x=>x[0]===v)||v==="more";
  return `<nav class="tabbar ${cls||""}" aria-label="التنقل"><div class="in" style="--n:${bar.length}">${bar.map(([k,l])=>{const on=k===v||(k==="more"&&inMore)||(k==="programs"&&v==="program")||(k==="child"&&v==="report")||(k==="students"&&v==="student")||(k==="circles"&&v==="circle")||(k==="reports"&&v==="report"&&isStaff(m));return `<button data-act="go" data-v="${k}" class="${on?"on":""}" aria-current="${on?"page":"false"}"><span class="ti">${NAVICON[k]||NAVICON.more}</span><span>${esc(l)}</span></button>`}).join("")}</div></nav>`;
}
function moreView(m){
  const{more}=appTabs(m);const circ=m.role==="student"?get("circles",m.circleId):null;
  return `<div class="card me-card"><div class="avatar" style="width:52px;height:52px;font-size:1.1rem">${esc(initials(m.name))}</div><div style="min-width:0"><h2>${esc(m.name)}</h2><div class="small muted">${ROLE[m.role]}${m.role==="student"?" · "+(TRACK[m.track]||""):""}${circ?" · "+esc(circ.name):""}${isStaff(m)?" · "+esc(myCircles(m).map(c=>c.name).join("، ")):""}</div></div></div>
  ${more.length?`<div class="menu">${more.map(([k,l])=>`<button class="mrow" data-act="go" data-v="${k}"><span class="ti">${NAVICON[k]||NAVICON.more}</span><b>${esc(l)}</b><span class="chev">‹</span></button>`).join("")}</div>`:""}
  <div class="card"><div class="row between"><b>المظهر</b><div class="seg modeseg">${[["system","تلقائي"],["light","فاتح"],["dark","ليلي"]].map(([k,l])=>`<button data-act="themeSet" data-v="${k}" class="${getThemeMode()===k?"on":""}">${l}</button>`).join("")}</div></div></div>
  <div class="menu"><button class="mrow" data-act="myNav"><span class="ti">${ICON.gear}</span><b>ترتيب قائمتي</b><span class="chev">‹</span></button><button class="mrow" data-act="changePass"><span class="ti">${NAVICON.perms||ICON.gear}</span><b>تغيير كلمة المرور</b><span class="chev">‹</span></button><button class="mrow" data-act="logout"><span class="ti" style="color:var(--bad)">${NAVICON.more}</span><b style="color:var(--bad)">تسجيل الخروج</b><span class="chev">‹</span></button></div>
  <details class="fold"><summary>أضف المنصة إلى شاشة جوالك</summary><div class="stack small" style="padding-top:8px"><p><b>آيفون:</b> افتح الرابط في Safari، ثم زر المشاركة <span class="muted">(المربع والسهم)</span>، ثم «إضافة إلى الشاشة الرئيسية».</p><p><b>أندرويد:</b> افتح الرابط في Chrome، ثم القائمة <span class="muted">(⋮)</span>، ثم «إضافة إلى الشاشة الرئيسية».</p><p class="muted">تظهر لك أيقونة تفتح المنصة مباشرة مثل التطبيق.</p></div></details>`;
}
function ring(done,total,size){size=size||76;const r=size/2-7,C=2*Math.PI*r,p=total?done/total:0;
  return `<div class="ring" style="width:${size}px;height:${size}px" role="img" aria-label="أنجزت ${done} من ${total}"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="7"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${p===1?"var(--ok)":"var(--primary)"}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p)}" transform="rotate(-90 ${size/2} ${size/2})"/></svg><div class="ring-t"><b>${done}/${total}</b></div></div>`}
function taskTap(t){
  return `<div class="tap-task ${t.done?"done":""}" data-act="toggleTask" data-id="${t.id}" role="button" tabindex="0" aria-pressed="${t.done}"><span class="cb ${t.done?"on":""}" aria-hidden="true">${t.done?ICON.check:""}</span><div class="tt"><div class="row" style="gap:6px">${kindTag(t.kind)}<b class="t">${esc(t.title)}</b></div>${t.details?`<div class="small muted" style="white-space:pre-wrap">${esc(t.details)}</div>`:""}${t.programId&&get("programs",t.programId)?`<div class="small" style="color:var(--accent)">${esc(get("programs",t.programId).title)}</div>`:""}${t.link||t.fileUrl?`<div class="row" style="margin-top:4px">${t.link?`<a class="btn sm" href="${esc(t.link)}" target="_blank" rel="noopener">فتح الرابط ↗</a>`:""}${t.fileUrl?`<a class="btn sm" href="${esc(t.fileUrl)}" target="_blank" rel="noopener">📎 ${esc(t.fileName||"المرفق")}</a>`:""}</div>`:""}</div></div>`;
}
function celebrate(msg){
  const el=document.createElement("div");el.className="celebrate";el.innerHTML=`<div class="cel-box">${Array.from({length:14},(_,i)=>`<i style="--a:${i*26}deg;--d:${(i%4)*60}ms"></i>`).join("")}<b>${esc(msg)}</b></div>`;
  document.body.appendChild(el);setTimeout(()=>el.remove(),2600);
}
function foldHTML(title,count,inner,open){return `<details class="fold" ${open?"open":""}><summary><span>${title}</span>${count!=null?`<span class="pill">${count}</span>`:""}</summary><div class="fold-b">${inner}</div></details>`}
function logsCards(s,L,who){
  const c=cfg();const showG=c.studentSeeGrades;const showN=who==="parent"?c.parentSeeNotes:c.studentSeeNotes;const isT=s.track==="tilawa";
  if(!L.length)return empty("لا يوجد سجل متابعة في هذه الفترة.");
  return `<div class="lcards">${L.map(l=>{const n=who==="parent"?nP(l):nS(l);return `<div class="lcard"><div class="row between"><b class="num">${fmtD(l.date,{weekday:"long",day:"numeric",month:"long"})}</b><span class="pill ${ATT_CLS[l.attendance]||""}">${ATT[l.attendance]||"—"}</span></div>
   ${amountTxt(l)!=="—"?`<div class="small">${amountTxt(l)}</div>`:""}
   ${showG?`<div class="row" style="gap:6px">${isT?`${n0(l.tGrade)?`<span class="pill ${gradeCls(l.tGrade)}">الأداء: ${gradeTxt(l.tGrade)}</span>`:""}${n0(l.errJali)||n0(l.errKhafi)?`<span class="pill">أخطاء ${n0(l.errJali)} جلي · ${n0(l.errKhafi)} خفي</span>`:""}`:`${n0(l.newGrade)?`<span class="pill ${gradeCls(l.newGrade)}">الحفظ: ${gradeTxt(l.newGrade)}</span>`:""}${n0(l.revGrade)?`<span class="pill ${gradeCls(l.revGrade)}">المراجعة: ${gradeTxt(l.revGrade)}</span>`:""}`}</div>`:""}
   ${showN&&((l.tajweed||[]).length||l.tajweedNote||n)?`<div class="small lnote">${(l.tajweed||[]).length?`<span style="color:var(--warn)">تجويد: ${esc(l.tajweed.join("، "))}</span><br>`:""}${esc(l.tajweedNote||"")} ${esc(n)}</div>`:""}</div>`}).join("")}</div>`;
}
function studentToday(m){
  const d=today();const T=tasksOf(m.id,d,d);const late=tasksOf(m.id,addDays(d,-3),addDays(d,-1)).filter(t=>!t.done);
  const up=tasksOf(m.id,addDays(d,1),addDays(d,3)).sort((a,b)=>a.date<b.date?-1:1);
  const next=S.sessions.filter(s=>sessStu(s).includes(m.id)&&s.status==="confirmed"&&new Date(s.start).getTime()+n0(s.duration||30)*60000>Date.now()).sort((a,b)=>a.start<b.start?-1:1)[0];
  const c=cfg();const mr=monthRange(d.slice(0,7));const x=stats(m.id,mr[0],mr[1]);const lastLog=logsOf(m.id)[0];const circ=get("circles",m.circleId);
  const doneN=T.filter(t=>t.done).length;const sessToday=next&&next.start.slice(0,10)===new Date().toISOString().slice(0,10)||next&&ymd(new Date(next.start))===d;
  const primary=sessToday&&next.link?`<a class="btn meet big" href="${esc(next.link)}" target="_blank" rel="noopener">${ICON.video} دخول التسميع · ${fmtT(next.start)}</a>`:circ&&circ.meetLink?`<a class="btn meet big" href="${esc(circ.meetLink)}" target="_blank" rel="noopener">${ICON.video} دخول الحلقة</a>`:"";
  const jz=Object.values(m.hifzMap||{}).filter(v=>v==="m"||v==="x").length;
  const B={};
  B.hero=`<section class="today-card pattern"><div class="tc-top"><div style="min-width:0">${brand().verse?`<div class="verse">${esc(brand().verse)}</div>`:""}<h1>السلام عليكم، ${esc(firstName(m.name))}</h1><div class="date">${fmtD(d)}</div><div class="small muted">${doneN===T.length&&T.length?"أنجزت مهام اليوم، بارك الله فيك":T.length?`باقي ${T.length-doneN} من مهام اليوم`:"لا مهام اليوم"}</div></div>${ring(doneN,T.length)}</div>${primary?`<div class="tc-actions">${primary}</div>`:""}</section>`;
  B.stats=`<div class="chipbar">${[[streak(m.id),"أيام متتالية"],...(c.showPoints?[[x.points,"نقطة هذا الشهر"]]:[]),[totalPages(m),m.track==="tilawa"?"وجه مقروء":"وجه محفوظ"],...(jz?[[jz,"أجزاء في خريطتي"]]:[]),[x.rate==null?"—":x.rate+"%","حضور الشهر"]].map(([v,l])=>`<div class="chipstat"><b class="num">${v}</b><span>${l}</span></div>`).join("")}</div>`;
  B.msg=m.msgStudent?`<div class="msg-card"><span class="small muted">رسالة من معلمك</span><p>${esc(m.msgStudent)}</p></div>`:"";
  B.tasks=`<section class="card"><div class="card-h"><h2>مهام اليوم</h2><span class="pill ${doneN===T.length&&T.length?"p-ok":""}">${doneN}/${T.length}</span></div><div class="stack" style="gap:8px">${T.length?T.map(taskTap).join(""):empty("لا مهام اليوم. استمر في وردك.")}</div>${late.length?foldHTML("مهام متأخرة",late.length,`<div class="stack" style="gap:8px">${late.map(taskTap).join("")}</div>`,true):""}</section>`;
  B.next=next&&!(sessToday&&next.link)?`<div class="row-card"><span class="ti ti-teal">${NAVICON.sessions}</span><div class="grow"><b>موعد التسميع القادم</b><div class="small muted">${fmtDT(next.start)}${next.note?" · "+esc(next.note):""}</div></div><div class="row">${next.link?`<a class="btn sm meet" href="${esc(next.link)}" target="_blank" rel="noopener">${platName(next.link)}</a>`:""}<a class="btn sm" href="${gcal(next)}" target="_blank" rel="noopener" aria-label="أضف للتقويم">${ICON.cal}</a></div></div>`:"";
  B.circle=circ?`<div class="row-card"><span class="ti">${NAVICON.child}</span><div class="grow"><b>${esc(circ.name)}</b><div class="small muted">${hasTime(circ)?schedTxt(circ)+" · ":""}${esc(nameOf(circ.teacherId))}</div></div><div class="row">${circ.meetLink&&!primary.includes(circ.meetLink)?`<a class="btn sm meet" href="${esc(circ.meetLink)}" target="_blank" rel="noopener">دخول</a>`:""}${hasTime(circ)?`<a class="btn sm" href="${circleCal(circ)}" target="_blank" rel="noopener" aria-label="مواعيد الحلقة في التقويم">${ICON.cal}</a>`:""}</div></div>`:"";
  const showLL=lastLog&&(c.studentSeeNotes||c.studentSeeGrades);
  B.side=(showLL?foldHTML(`آخر متابعة من معلمك <span class="small muted">· ${fmtShort(lastLog.date)}</span>`,null,logsCards(m,[lastLog],"student"),true):"")+(up.length?foldHTML("الأيام القادمة",up.length,`<div class="list">${up.map(t=>`<div class="li"><span class="small muted num" style="width:84px">${fmtShort(t.date)}</span>${kindTag(t.kind)}<span class="grow">${esc(t.title)}</span></div>`).join("")}</div>`):"");
  const bd=badges(m.id);B.badges=bd.length?foldHTML("أوسمتي",bd.length,`<div class="badges">${bd.map(([t,h])=>`<span class="badge"><i aria-hidden="true">✦</i><span><b>${esc(t)}</b><small>${esc(h)}</small></span></span>`).join("")}</div>`):"";
  const cn=S.certs.filter(z=>z.studentId===m.id).length;B.certs=cn?foldHTML("شهاداتي",cn,certsList(m.id,false)):"";
  return `<div class="app-stack">${homeLayout("student",B)}</div>`;
}
function kidTabs(kids){return kids.length>1?`<div class="kidtabs" role="tablist">${kids.map(k=>`<button role="tab" data-act="kid" data-id="${k.id}" class="${k.id===ui.kid?"on":""}" aria-selected="${k.id===ui.kid}"><span class="avatar">${esc(initials(k.name))}</span>${esc(firstName(k.name))}</button>`).join("")}</div>`:""}
function parentKids(m){return (m.childIds||[]).map(id=>get("members",id)).filter(Boolean)}
function parentView(m){
  const c=cfg();const kids=parentKids(m);
  if(!c.parentsEnabled)return empty("متابعة أولياء الأمور غير مفعّلة حالياً من المشرف.");
  if(!kids.length)return empty("لم يُربط حسابك بأي طالب بعد. سيربطه المشرف قريباً.");
  if(!ui.kid||!kids.some(k=>k.id===ui.kid))ui.kid=kids[0].id;
  const s=get("members",ui.kid);const d=today();const T=tasksOf(s.id,d,d);const l=get("logs",`${s.id}_${d}`);const mr=monthRange(d.slice(0,7));const x=stats(s.id,mr[0],mr[1]);
  const t=teacherOf(s);const wa=t&&waNum(t.phone);const circ=get("circles",s.circleId);const doneN=T.filter(z=>z.done).length;
  const next=S.sessions.filter(z=>sessStu(z).includes(s.id)&&z.status==="confirmed"&&new Date(z.start).getTime()>Date.now()-3600000).sort((a,b)=>a.start<b.start?-1:1)[0];
  const bd=badges(s.id),cn=S.certs.filter(z=>z.studentId===s.id).length;
  return `<div class="app-stack">${kidTabs(kids)}
  <section class="today-card pattern"><div class="tc-top"><div style="min-width:0"><span class="small muted">متابعة ابنك</span><h1>${esc(s.name)}</h1><div class="small muted">${TRACK[s.track]||""}${circ?" · "+esc(circ.name):""} · ${esc(nameOf(s.teacherId))}</div></div>${ring(doneN,T.length)}</div>
   <div class="kid-sum"><div><span>اليوم</span><b class="pill ${l?ATT_CLS[l.attendance]:""}">${l?ATT[l.attendance]:"لم يُسجَّل"}</b></div><div><span>حضور الشهر</span><b class="num">${x.rate==null?"—":x.rate+"%"}</b></div><div><span>${s.track==="tilawa"?"المقروء":"المحفوظ"}</span><b class="num">${totalPages(s)} وجه</b></div></div>
   <div class="tc-actions">${wa?`<a class="btn meet" href="https://wa.me/${wa}" target="_blank" rel="noopener">واتساب المعلم</a>`:""}<button class="btn" data-act="newSession" data-sid="${s.id}">${NAVICON.sessions.replace("<svg",'<svg width="16" height="16"')} اطلب موعداً</button></div></section>
  ${s.msgParent?`<div class="msg-card"><span class="small muted">ملاحظة من المعلم</span><p>${esc(s.msgParent)}</p></div>`:""}
  ${next?`<div class="row-card"><span class="ti ti-teal">${NAVICON.sessions}</span><div class="grow"><b>موعد التسميع القادم</b><div class="small muted">${fmtDT(next.start)}</div></div><a class="btn sm" href="${gcal(next)}" target="_blank" rel="noopener" aria-label="أضف للتقويم">${ICON.cal}</a></div>`:""}
  ${T.length?foldHTML("مهام اليوم",`${doneN}/${T.length}`,`<div class="stack" style="gap:8px">${T.map(z=>`<div class="tap-task ${z.done?"done":""}" style="cursor:default"><span class="cb ${z.done?"on":""}">${z.done?ICON.check:""}</span><div class="tt"><div class="row" style="gap:6px">${kindTag(z.kind)}<b class="t">${esc(z.title)}</b></div></div></div>`).join("")}</div>`):""}
  ${bd.length?foldHTML("الأوسمة",bd.length,`<div class="badges">${bd.map(([q,h])=>`<span class="badge"><i aria-hidden="true">✦</i><span><b>${esc(q)}</b><small>${esc(h)}</small></span></span>`).join("")}</div>`):""}
  ${cn?foldHTML("الشهادات",cn,certsList(s.id,false)):""}
  ${foldHTML("التقرير التفصيلي",null,c.parentSeeReport?periodPicker()+reportInner(s.id,curRange(s.id),false,true):logsCards(s,logsOf(s.id).slice(0,20),"parent"))}</div>`;
}
function parentNotes(m){
  const c=cfg();const kids=parentKids(m);if(!kids.length)return empty("لم يُربط حسابك بأي طالب بعد.");
  const items=[];kids.forEach(s=>{if(s.msgParent)items.push({pin:1,s,date:"",t:s.msgParent});if(c.parentSeeNotes)logsOf(s.id).forEach(l=>{if(nP(l))items.push({s,date:l.date,t:nP(l),att:l.attendance})});
    S.recits.filter(r=>r.studentId===s.id&&r.status==="reviewed"&&r.feedback).forEach(r=>items.push({s,date:r.date,t:"على التسميع الصوتي «"+(r.title||"")+"»: "+r.feedback}))});
  items.sort((a,b)=>(b.pin||0)-(a.pin||0)||(a.date<b.date?1:-1));
  return `<div class="app-stack"><div class="hero"><h1>ملاحظات المعلم</h1></div>${items.length?`<div class="stack" style="gap:10px">${items.slice(0,80).map(i=>`<div class="note-item ${i.pin?"pin":""}"><div class="row between"><span class="row" style="gap:6px">${kids.length>1?`<span class="pill p-pri">${esc(firstName(i.s.name))}</span>`:""}${i.pin?'<span class="pill p-acc">مثبّتة</span>':""}</span><span class="small muted">${i.date?fmtShort(i.date):""}</span></div><p>${esc(i.t)}</p></div>`).join("")}</div>`:empty("لا ملاحظات بعد.")}</div>`;
}

/* ============ التشغيل ============ */

/* ============ الربط مع Supabase ============ */
const CFG=window.APP_CONFIG||{};
const SB=(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase)?window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
const TABLES=["members","circles","config","programs","tasks","logs","progress","exams","certs","recits","notes","sessions","tatt"];
const RAW={};TABLES.forEach(t=>RAW[t]=new Map());
let USERMETA={},USEREMAIL="",CHANNEL=null,ME_SIG="",RENDER_Q=false;
const BOOT={};
function errMsg(e,pre){const m=String((e&&(e.message||e.code))||"");
  if(/row-level security|not allowed|permission/i.test(m))return pre+": ليست لديك صلاحية لهذا الإجراء";
  if(/Failed to fetch|network/i.test(m))return pre+": تحقق من اتصال الإنترنت";
  return pre+(m?" ("+m.slice(0,80)+")":"")}
async function upsertRow(t,id,data){const{error}=await SB.from(t).upsert({id,data});if(error)throw error}
async function deleteRow(t,id){const{error}=await SB.from(t).delete().eq("id",id);if(error)throw error}
async function syncNote(ref,aud,text,sid){const id=ref+"|"+aud;const cur=RAW.notes.get(id);const curT=cur&&cur.data?cur.data.text:"";
  if(String(text||"").trim()===String(curT||"").trim())return;
  if(text&&String(text).trim())await upsertRow("notes",id,{ref,audience:aud,studentId:sid,text:String(text)});
  else if(RAW.notes.has(id))await deleteRow("notes",id)}
async function remotePut(c,id,data){
  if(c==="logs"){const{noteStudent,noteParent,noteStaff,note,...rest}=data;await upsertRow("logs",id,rest);
    const sid=data.studentId;const mm=me();
    if(noteStudent!==undefined||note!==undefined)await syncNote(id,"student",noteStudent??note,sid);
    if(noteParent!==undefined||note!==undefined)await syncNote(id,"parent",noteParent??note,sid);
    if(noteStaff!==undefined&&can(mm,"notes.private"))await syncNote(id,"staff",noteStaff,sid);return}
  if(c==="members"){const{msgParent,...rest}=data;await upsertRow("members",id,rest);
    if(msgParent!==undefined&&isStaff(me())&&rest.role==="student")await syncNote("m:"+id,"parent",msgParent,id);return}
  await upsertRow(c,id,data);
}
async function remoteDel(c,id){
  await deleteRow(c,id);
  if(c==="logs")for(const a of ["student","parent","staff"]){const k=id+"|"+a;if(RAW.notes.has(k))try{await deleteRow("notes",k)}catch(e){}}
}
function rebuild(){
  const N={};RAW.notes.forEach(r=>{const d=r.data||{};(N[d.ref]=N[d.ref]||{})[d.audience]=d.text});
  COLS.forEach(c=>{const rows=RAW[c]?[...RAW[c].values()]:[];LIVE[c]=rows.map(r=>{const o={...(r.data||{}),id:r.id};
    if(c==="logs"){const n=N[r.id]||{};if(n.student!=null)o.noteStudent=n.student;if(n.parent!=null)o.noteParent=n.parent;if(n.staff!=null)o.noteStaff=n.staff}
    if(c==="members"){const n=N["m:"+r.id]||{};if(n.parent!=null)o.msgParent=n.parent}
    return o})});
  const m=LIVE.members.find(x=>x.uid===UID);const sig=m?[m.role,m.status,m.scopeOverride,m.attScopeOverride,JSON.stringify(m.circleIds||[]),JSON.stringify(m.childIds||[]),JSON.stringify(m.permOverrides||{}),m.circleId,m.teacherId].join("|"):"";
  if(ME_SIG&&sig!==ME_SIG){ME_SIG=sig;setTimeout(reloadAll,300)}else ME_SIG=sig;
}
function scheduleRender(){if(RENDER_Q)return;RENDER_Q=true;requestAnimationFrame(()=>{RENDER_Q=false;rebuild();if(S===LIVE)render()})}
async function loadTable(t){const map=new Map();let from=0;for(;;){const{data,error}=await SB.from(t).select("id,data").range(from,from+999);if(error)throw error;data.forEach(r=>map.set(r.id,r));if(data.length<1000)break;from+=1000}RAW[t]=map}
async function reloadTable(c){if(!SB||MODE!=="live")return;try{await loadTable(c);if(c==="logs"||c==="members")await loadTable("notes");scheduleRender()}catch(e){}}
async function reloadAll(){if(!SB)return;try{await Promise.all(TABLES.map(loadTable));rebuild();const cfgp=get("config","perms");void cfgp;if(S===LIVE)render()}catch(e){console.error(e);toast(errMsg(e,"تعذّر تحميل البيانات"),"err")}}
function subscribe(){
  if(CHANNEL)SB.removeChannel(CHANNEL);
  CHANNEL=SB.channel("halaqa-db");
  TABLES.forEach(t=>CHANNEL.on("postgres_changes",{event:"*",schema:"public",table:t},pl=>{
    if(pl.eventType==="DELETE"){const id=pl.old&&pl.old.id;if(id)RAW[t].delete(id)}else if(pl.new&&pl.new.id)RAW[t].set(pl.new.id,{id:pl.new.id,data:pl.new.data});
    scheduleRender()}));
  CHANNEL.subscribe(st=>{if(st==="CHANNEL_ERROR"||st==="TIMED_OUT")SLOW=true});
}
async function startSession(sess){
  if(UID===sess.user.id&&MODE==="live")return;
  UID=sess.user.id;USERMETA=sess.user.user_metadata||{};USEREMAIL=sess.user.email||"";
  MODE="live";S=LIVE;READY.clear();render();
  const timer=setTimeout(()=>{if(READY.size<COLS.length){SLOW=true;render()}},10000);
  try{const{data}=await SB.rpc("has_director");OWNER=!data}catch(e){OWNER=false}
  ASSETS={async upload(file){
    if(file.size>20*1024*1024)throw{code:"الملف أكبر من 20 ميجابايت"};
    const ext=(String(file.name).split(".").pop()||"bin").replace(/[^a-z0-9]/gi,"").slice(0,8)||"bin";
    const path=`${UID}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}.${ext}`;
    const up=await SB.storage.from("files").upload(path,file,{contentType:file.type||"application/octet-stream",upsert:false});if(up.error)throw{code:up.error.message};
    const sg=await SB.storage.from("files").createSignedUrl(path,60*60*24*365*2);if(sg.error)throw{code:sg.error.message};
    return{id:path,url:sg.data.signedUrl}}};
  await reloadAll();subscribe();clearTimeout(timer);SLOW=false;COLS.forEach(c=>READY.add(c));
  const h=location.hash.slice(1);if(h&&!/access_token|type=/.test(h))ui.view=h;
  render();
}
function stopSession(){if(CHANNEL){SB.removeChannel(CHANNEL);CHANNEL=null}UID=null;ME_SIG="";TABLES.forEach(t=>{if(t!=="config")RAW[t]=new Map()});COLS.forEach(c=>LIVE[c]=[]);READY.clear()}
DL={async save({filename,data}){const blob=data instanceof Blob?data:new Blob([data]);const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}};

/* ============ حسابات الدخول التي ينشئها المعلم ============ */
function genPass(){const a="abcdefghjkmnpqrstuvwxyz23456789";let p="";const r=new Uint32Array(9);crypto.getRandomValues(r);r.forEach(v=>p+=a[v%a.length]);return p}
const USERDOM=()=>(CFG.usernameDomain||"s.maeen.com.sa").toLowerCase();
async function callAcct(body){
  if(MODE==="demo"||!SB)return{ok:true,username:body.username,demo:true};
  const{data,error}=await SB.functions.invoke("create-account",{body});
  if(error){let msg="";try{const j=await error.context.json();msg=j.error}catch(e){}throw new Error(msg||error.message||"تعذّر الاتصال بالخادم")}
  if(data&&data.error)throw new Error(data.error);return data;
}
function acctShare(s,username,password){
  const site=location.origin;const msg=`السلام عليكم\nبيانات دخول ${s.name} إلى ${cfg().circleName}:\nالرابط: ${site}\nاسم المستخدم: ${username}\nكلمة المرور: ${password}\nيمكن تغيير كلمة المرور بعد الدخول من «المزيد».`;
  const num=waNum(s.guardianPhone||s.phone);
  openModal("بيانات الدخول",`<div class="cred"><div><span>الرابط</span><b dir="ltr">${esc(site)}</b></div><div><span>اسم المستخدم</span><b dir="ltr">${esc(username)}</b></div><div><span>كلمة المرور</span><b dir="ltr">${esc(password)}</b></div></div>
   <p class="hint">احفظها أو أرسلها لولي الأمر الآن؛ لن تظهر كلمة المرور مرة أخرى. يمكنك دائماً تعيين كلمة مرور جديدة.</p>
   <textarea id="f-msg" data-input="wa" style="min-height:130px;width:100%;padding:8px;border:1px solid var(--line);border-radius:9px;background:var(--bg)">${esc(msg)}</textarea>
   <div class="row"><button type="button" class="btn" data-act="copyMsg">نسخ</button>${num?`<a id="wa-link" class="btn meet" href="https://wa.me/${num}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">إرسال لولي الأمر بواتساب</a>`:""}</div>`,"noop",{num},"تم");
}
async function createAccount(id,username,password){
  const s=get("members",id);username=String(username||"").trim().toLowerCase();
  if(!/^[a-z0-9._-]{3,30}$/.test(username)){toast("اسم المستخدم: من 3 إلى 30 حرفاً إنجليزياً أو رقماً","err");return false}
  if(String(password||"").length<8){toast("كلمة المرور 8 أحرف على الأقل","err");return false}
  try{toast("جاري إنشاء الحساب…");const r=await callAcct({action:"create",memberId:id,username,password});
    if(r.demo){local("members",id,{...s,uid:"demo-"+username,username,email:username+"@"+USERDOM(),status:"active"});render()}
    else await reloadTable("members");
    setTimeout(()=>acctShare(s,username,password),150);return true}catch(e){toast(e.message,"err");return false}
}
function acctForm(s,reset){
  openModal(reset?`كلمة مرور جديدة: ${esc(s.name)}`:`حساب دخول: ${esc(s.name)}`,`${reset?`<p class="small">اسم المستخدم: <b dir="ltr">${esc(s.username||s.email||"")}</b></p>`:fld("اسم المستخدم",inp("username","","text","required dir='ltr' autocapitalize='off' autocomplete='off' placeholder='ahmad.salem'"),"حروف إنجليزية وأرقام ونقطة فقط، ويدخل به الطالب بدل الإيميل")}
  ${fld("كلمة المرور",inp("password",genPass(),"text","required dir='ltr' minlength=8 autocomplete='off'"),"كلمة مولّدة عشوائياً، ويمكنك كتابة غيرها")}<div><button type="button" class="btn sm" data-act="regenPass">توليد كلمة أخرى</button></div>`,reset?"acctReset":"acctCreate",{id:s.id},reset?"تعيين":"إنشاء الحساب");
}
Object.assign(FORMS,{
  acctCreate:async fd=>{const ok=await createAccount(modalCtx.id,fd.get("username"),fd.get("password"));if(!ok)throw new Error("اختر")},
  acctReset:async fd=>{const id=modalCtx.id,s=get("members",id),pw=fd.get("password");
    try{await callAcct({action:"reset",memberId:id,password:pw});setTimeout(()=>acctShare(s,s.username||s.email,pw),150)}catch(e){toast(e.message,"err");throw new Error("اختر")}},
});
Object.assign(A,{
  acctCreate:el=>acctForm(get("members",el.dataset.id),false),
  acctReset:el=>acctForm(get("members",el.dataset.id),true),
  regenPass:()=>{const i=$("#f-password");if(i)i.value=genPass()},
});
Object.assign(ACT_PERM,{acctCreate:"students.edit",acctReset:"students.edit"});
CH.mkAcct=el=>{$("#mk-box").hidden=!el.checked;if(el.checked){const u=$("#f-username");if(u)u.focus()}};

/* ============ الدخول والتسجيل ============ */
function authView(){
  const t=ui.auth||"login";let f="";
  if(t==="login")f=`<form class="card stack" data-form="login"><h2>تسجيل الدخول</h2>${fld("الإيميل أو اسم المستخدم",inp("email","","text","required dir='ltr' autocapitalize='off' autocomplete='username'"))}${fld("كلمة المرور",inp("password","","password","required autocomplete='current-password'"))}<button class="btn pri big">دخول</button><div class="row between"><button type="button" class="btn ghost sm" data-act="authTab" data-v="forgot">نسيت كلمة المرور؟</button><button type="button" class="btn ghost sm" data-act="authTab" data-v="signup">حساب جديد</button></div></form>`;
  else if(t==="signup")f=`<form class="card stack" data-form="signup"><h2>إنشاء حساب</h2>${fld("الاسم الكامل",inp("name","","text","required"))}${fld("الإيميل",inp("email","","email","required autocomplete='username'"))}${fld("رقم الجوال",inp("phone","","tel","required placeholder='05xxxxxxxx'"))}${fld("كلمة المرور",inp("password","","password","required minlength=8 autocomplete='new-password'"),"8 أحرف على الأقل")}${fld("تأكيد كلمة المرور",inp("password2","","password","required minlength=8 autocomplete='new-password'"))}<button class="btn pri big">إنشاء الحساب</button><p class="hint">سيصلك إيميل لتأكيد حسابك، ثم تختار صفتك (طالب، معلم، ولي أمر) وبرنامجك.</p><button type="button" class="btn ghost sm" data-act="authTab" data-v="login">لديّ حساب، تسجيل الدخول</button></form>`;
  else if(t==="forgot")f=`<form class="card stack" data-form="forgot"><h2>استعادة كلمة المرور</h2>${fld("الإيميل",inp("email","","email","required"))}<button class="btn pri big">إرسال رابط الاستعادة</button><button type="button" class="btn ghost sm" data-act="authTab" data-v="login">العودة لتسجيل الدخول</button></form>`;
  else if(t==="reset")f=`<form class="card stack" data-form="newpass"><h2>كلمة مرور جديدة</h2>${fld("كلمة المرور الجديدة",inp("password","","password","required minlength=8 autocomplete='new-password'"))}${fld("تأكيدها",inp("password2","","password","required minlength=8 autocomplete='new-password'"))}<button class="btn pri big">حفظ كلمة المرور</button></form>`;
  else f=`<div class="card stack"><h2>تحقق من بريدك</h2><p>أرسلنا لك رسالة على <b>${esc(ui.authEmail||"")}</b>. افتحها واضغط الرابط${ui.auth==="sent"?" لتأكيد حسابك":" لتعيين كلمة مرور جديدة"}، ثم ارجع هنا.</p><p class="hint">لم تصلك؟ افحص مجلد الرسائل غير المرغوبة.</p><button type="button" class="btn" data-act="authTab" data-v="login">تسجيل الدخول</button></div>`;
  return `<main class="wrap"><div class="center-page auth-page"><img class="welcome-logo" src="${LOGO_FULL}" alt="مَعين"><h1>${esc(cfg().circleName)}</h1><p class="muted">منصة متابعة حلقات القرآن الكريم: الحفظ والتلاوة، المتابعة اليومية، البرامج والتقارير.</p>${f}<div class="row"><button class="btn ghost sm" data-act="demo">جرّب العرض التجريبي</button></div></div></main>`;
}
const AUTH_ERR=e=>{const m=String(e&&e.message||"");if(/Invalid login/i.test(m))return"الإيميل أو كلمة المرور غير صحيحة";if(/not confirmed/i.test(m))return"أكّد إيميلك أولاً من الرسالة التي وصلتك";if(/already registered|already been registered/i.test(m))return"هذا الإيميل مسجّل مسبقاً، سجّل الدخول أو استعد كلمة المرور";if(/rate|too many/i.test(m))return"محاولات كثيرة، انتظر قليلاً ثم أعد المحاولة";if(/Password/i.test(m))return"كلمة المرور ضعيفة: استخدم 8 أحرف على الأقل";return m||"حدث خطأ"};
Object.assign(FORMS,{
  login:async fd=>{let id=fd.get("email").trim().toLowerCase();if(!id.includes("@"))id=id+"@"+USERDOM();const{error}=await SB.auth.signInWithPassword({email:id,password:fd.get("password")});if(error){toast(AUTH_ERR(error),"err");return}},
  signup:async fd=>{const email=fd.get("email").trim(),pw=fd.get("password");if(pw!==fd.get("password2")){toast("كلمتا المرور غير متطابقتين","err");return}
    const{data,error}=await SB.auth.signUp({email,password:pw,options:{data:{name:fd.get("name").trim(),phone:fd.get("phone").trim()},emailRedirectTo:location.origin}});
    if(error){toast(AUTH_ERR(error),"err");return}if(!data.session){ui.auth="sent";ui.authEmail=email;render()}},
  forgot:async fd=>{const email=fd.get("email").trim();const{error}=await SB.auth.resetPasswordForEmail(email,{redirectTo:location.origin});if(error){toast(AUTH_ERR(error),"err");return}ui.auth="sentReset";ui.authEmail=email;render()},
  newpass:async fd=>{const pw=fd.get("password");if(pw!==fd.get("password2")){toast("كلمتا المرور غير متطابقتين","err");return}const{error}=await SB.auth.updateUser({password:pw});if(error){toast(AUTH_ERR(error),"err");return}toast("تم تغيير كلمة المرور");ui.auth="login";const{data}=await SB.auth.getSession();if(data.session)startSession(data.session);else{MODE="auth";render()}},
});
Object.assign(A,{
  authTab:el=>{ui.auth=el.dataset.v;render()},
  logout:async()=>{if(MODE==="demo"){S=LIVE;MODE=PREV}await SB.auth.signOut();stopSession();MODE="auth";ui.auth="login";ui.view=null;render()},
  changePass:()=>openModal("تغيير كلمة المرور",`${fld("كلمة المرور الجديدة",inp("password","","password","required minlength=8 autocomplete='new-password'"))}${fld("تأكيدها",inp("password2","","password","required minlength=8 autocomplete='new-password'"))}`,"newpass2",{},"حفظ"),
});
FORMS.newpass2=async fd=>{const pw=fd.get("password");if(pw!==fd.get("password2")){toast("كلمتا المرور غير متطابقتين","err");throw new Error("اختر")}const{error}=await SB.auth.updateUser({password:pw});if(error){toast(AUTH_ERR(error),"err");throw new Error("اختر")}toast("تم تغيير كلمة المرور")};
ACT_PERM.backup="perms.manage";
CH.importFile=async el=>{const f=el.files&&el.files[0];if(!f)return;try{const j=JSON.parse(await f.text());const cols=j.collections||{};let n=0,fail=0;const order=["config","circles","members","programs","tasks","logs","progress","exams","certs","recits","sessions","tatt"];
  toast("جاري الاستيراد…");for(const c of order){for(const d of (cols[c]||[])){const{id,...data}=d;if(!id)continue;if(c==="config"&&id==="perms"&&!isOwnerM(me())&&me().role!=="director")continue;if(c==="members"){if(data.uid===UID)continue;delete data.uid}try{await remotePut(c,id,data);n++}catch(e){fail++}}}
  await reloadAll();toast(`استُورد ${n} سجل${fail?` · تعذّر ${fail}`:""}`)}catch(e){toast("ملف غير صالح","err")}el.value=""};

/* لوحة الشرف للطلاب وأولياء الأمور: تُحسب على الخادم (أسماء ونقاط فقط) */
const LB={key:"",rows:null};
async function loadLB(f,t){const key=f+t;if(LB.key===key&&LB.rows)return;LB.key=key;LB.rows=null;const{data,error}=await SB.rpc("leaderboard",{p_from:f,p_to:t});LB.rows=error?[]:data;render()}

async function boot(){
  render();
  if(!SB){MODE="nodb";render();return}
  SB.auth.onAuthStateChange((ev,sess)=>{
    if(ev==="PASSWORD_RECOVERY"){ui.auth="reset";MODE="auth";render();return}
    if((ev==="SIGNED_IN"||ev==="INITIAL_SESSION"||ev==="TOKEN_REFRESHED")&&sess&&ui.auth!=="reset"){if(MODE!=="demo")startSession(sess);return}
    if(ev==="SIGNED_OUT"){stopSession();if(MODE!=="demo"){MODE="auth";ui.auth="login";render()}}});
  const{data}=await SB.auth.getSession();
  if(!data.session&&MODE==="loading"){MODE="auth";ui.auth=ui.auth||"login";render();
    try{await loadTable("config");rebuild();if(MODE==="auth")render()}catch(e){}}
}
boot();

