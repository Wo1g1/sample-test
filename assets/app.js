/* ===== 설정 ===== */
const AXES = {
  M:{left:"반마법", right:"친마법"},
  E:{left:"평등",  right:"권위"},
  L:{left:"자유",  right:"규제"},
  P:{left:"진보",  right:"보수"},
};
const RESP = {1:-1.2, 2:-1.0, 3:0, 4:+1.0, 5:+1.2};

/* 이름 맵(임시) — E-L-P 조합 */
const NAME_MAP = {
  '좌-좌-좌':'혁명주의','좌-좌-중도':'진보적 자유평등','좌-좌-우':'자유보수주의',
  '좌-중도-좌':'진보적 평등주의','좌-중도-중도':'중도적 평등주의','좌-중도-우':'평등적 자유보수주의',
  '좌-우-좌':'사회주의','좌-우-중도':'중도적 규제평등','좌-우-우':'보수적 평등주의',
  '중도-좌-좌':'자유평등 개혁주의','중도-좌-중도':'자유평등 중도주의','중도-좌-우':'자유보수 평등주의',
  '중도-중도-좌':'중도적 개혁주의','중도-중도-중도':'중도주의','중도-중도-우':'중도적 보수주의',
  '중도-우-좌':'진보적 규제주의','중도-우-중도':'중도적 규제주의','중도-우-우':'보수적 규제주의',
  '우-좌-좌':'엘리트 개혁주의','우-좌-중도':'엘리트 자유주의','우-좌-우':'엘리트 자유보수',
  '우-중도-좌':'보수적 평등개혁','우-중도-중도':'중도적 권위주의','우-중도-우':'권위적 보수주의',
  '우-우-좌':'권위적 개혁주의','우-우-중도':'권위적 규제주의','우-우-우':'국가주의',
};

/* ===== 데모 문항(10개) — 동작 확인용. 네 문항으로 교체 가능 ===== */
const QUESTIONS = [
  {id:1, text:"마법은 인류에 순효과다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1}]},
  {id:2, text:"마법 연구는 줄여야 한다.", S:1.0, effects:[{axis:'M', side:'반마법', w:1}]},
  {id:3, text:"법 앞의 평등이 중요하다.", S:1.2, effects:[{axis:'E', side:'평등', w:1}]},
  {id:4, text:"엘리트의 지도가 필요하다.", S:1.2, effects:[{axis:'E', side:'권위', w:1}]},
  {id:5, text:"연구·표현의 자유가 우선이다.", S:1.2, effects:[{axis:'L', side:'자유', w:1}]},
  {id:6, text:"공공안전을 위해 규제가 필요하다.", S:1.0, effects:[{axis:'L', side:'규제', w:1}]},
  {id:7, text:"사회는 더 진보해야 한다.", S:1.0, effects:[{axis:'P', side:'진보', w:1}]},
  {id:8, text:"전통 가치를 지켜야 한다.", S:1.0, effects:[{axis:'P', side:'보수', w:1}]},
  {id:9, text:"마법 원리 연구를 허용해야 한다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1}]},
  {id:10,text:"무규제 연구는 위험하다.", S:1.0, effects:[{axis:'L', side:'규제', w:1}]},
];

/* ===== 전역 상태 ===== */
const PER_PAGE = 10;
let ORDERED=[], PAGES=1, PAGES_DATA=[], ANSWERS={}, CUR=0;

/* ===== 유틸 ===== */
const round1 = x => Math.round(x*10)/10;
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function sideToLR(axis, side){
  const m=AXES[axis];
  if (side===m.left) return 'left';
  if (side===m.right) return 'right';
  if (['친마법','평등','자유','진보'].includes(side)) return 'left';
  return 'right';
}

/* ===== 퀴즈 ===== */
function initQuiz(){
  ORDERED = shuffle(QUESTIONS);
  PAGES = Math.max(1, Math.ceil(ORDERED.length / PER_PAGE));
  PAGES_DATA = [];
  for(let i=0;i<PAGES;i++) PAGES_DATA.push(ORDERED.slice(i*PER_PAGE,(i+1)*PER_PAGE));
  ANSWERS = {}; CUR=0;

  const wrap = document.getElementById('quizWrap'); if(wrap) wrap.classList.remove('hidden');
  updatePageUI();
  renderPage();
}
function updatePageUI(){
  const pageInfo=document.getElementById('pageInfo');
  const pageInfo2=document.getElementById('pageInfo2');
  const prevBtn=document.getElementById('prevBtn'), prevBtn2=document.getElementById('prevBtn2');
  const nextBtn=document.getElementById('nextBtn'), nextBtn2=document.getElementById('nextBtn2');
  const finishBtn=document.getElementById('finishBtn'), finishBtn2=document.getElementById('finishBtn2');
  const prog=document.getElementById('prog');

  if (pageInfo)  pageInfo.textContent  = `${CUR+1} / ${PAGES}`;
  if (pageInfo2) pageInfo2.textContent = `${CUR+1} / ${PAGES}`;
  if (prog) prog.style.width = `${(CUR+1)/PAGES*100}%`;

  const isLast = CUR === PAGES-1;
  [nextBtn,nextBtn2].forEach(b=>b && b.classList.toggle('hidden', isLast));
  [finishBtn,finishBtn2].forEach(b=>b && b.classList.toggle('hidden', !isLast));

  if (prevBtn)  prevBtn.disabled  = CUR===0;
  if (prevBtn2) prevBtn2.disabled = CUR===0;

  // 이벤트(중복 바인딩 방지 위해 매번 재설정)
  if (prevBtn)  prevBtn.onclick  = ()=>{ if (CUR>0){ collectCurrentPage(); CUR--; updatePageUI(); renderPage(); } };
  if (prevBtn2) prevBtn2.onclick = ()=>{ if (CUR>0){ collectCurrentPage(); CUR--; updatePageUI(); renderPage(); } };
  if (nextBtn)  nextBtn.onclick  = ()=>{ if (validateCurrentPage()){ collectCurrentPage(); CUR++; updatePageUI(); renderPage(); } };
  if (nextBtn2) nextBtn2.onclick = ()=>{ if (validateCurrentPage()){ collectCurrentPage(); CUR++; updatePageUI(); renderPage(); } };
  if (finishBtn)  finishBtn.onclick  = ()=>{ if (validateCurrentPage()){ collectCurrentPage(); finishQuiz(); } };
  if (finishBtn2) finishBtn2.onclick = ()=>{ if (validateCurrentPage()){ collectCurrentPage(); finishQuiz(); } };
}
function renderPage(){
  const data=PAGES_DATA[CUR]||[];
  const quizEl=document.getElementById('quiz');
  const html = data.map(q=>{
    const v = ANSWERS[q.id] ?? '';
    return `
      <div class="q">
        <div class="qtext">${q.id}. ${q.text}</div>
        <div class="opts">
          ${[1,2,3,4,5].map(n=>`
            <label class="opt">
              <input type="radio" name="q${q.id}" value="${n}" ${v===n?'checked':''}>
              <div>${n}</div>
            </label>`).join('')}
        </div>
      </div>`;
  }).join('');
  if (quizEl) quizEl.innerHTML = html;
}
function validateCurrentPage(){
  const data=PAGES_DATA[CUR]||[];
  for(const q of data){
    if(!document.querySelector(`input[name="q${q.id}"]:checked`)){
      alert('이 페이지 문항을 모두 선택해야 넘어갈 수 있어.');
      return false;
    }
  }
  return true;
}
function collectCurrentPage(){
  const data=PAGES_DATA[CUR]||[];
  data.forEach(q=>{
    const sel=document.querySelector(`input[name="q${q.id}"]:checked`);
    if (sel) ANSWERS[q.id]=Number(sel.value);
  });
}
function finishQuiz(){
  const s = score();
  const payload = {
    M: pickPerc(s.M), E: pickPerc(s.E), L: pickPerc(s.L), P: pickPerc(s.P)
  };
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  location.href = '../result/?s='+b64;
}
function pickPerc(d){ return {
  lp_all:Math.round(d.lp_all), np_all:Math.round(d.np_all), rp_all:Math.round(d.rp_all)
}; }

/* ===== 채점/판정/타이틀 ===== */
function score(){
  const sums={M:{left:0,right:0,neutral:0},E:{left:0,right:0,neutral:0},L:{left:0,right:0,neutral:0},P:{left:0,right:0,neutral:0}};
  ORDERED.forEach(q=>{
    if(!Object.prototype.hasOwnProperty.call(ANSWERS,q.id)) return;
    const v=ANSWERS[q.id]; const f=RESP[v];
    q.effects.forEach(e=>{
      const lr=sideToLR(e.axis,e.side), opp=(lr==='left'?'right':'left');
      if (v===3) sums[e.axis].neutral += 1.0*e.w*q.S;
      else if (f>0) sums[e.axis][lr] += f*e.w*q.S;
      else sums[e.axis][opp] += Math.abs(f)*e.w*q.S;
    });
  });
  const out={};
  Object.keys(sums).forEach(axis=>{
    const {left,right,neutral}=sums[axis];
    const sumAll=left+right+neutral, lr=left+right;
    const lp_all=sumAll?round1(left/sumAll*100):0;
    const np_all=sumAll?round1(neutral/sumAll*100):0;
    const rp_all=sumAll?round1(right/sumAll*100):0;
    let lp_lr=50, rp_lr=50;
    if (lr>0){ lp_lr=round1(left/lr*100); rp_lr=round1(right/lr*100); }
    out[axis]={lp_all,np_all,rp_all,lp_lr,rp_lr};
  });
  return out;
}
function decideSide(d){
  const neutral=d.np_all;
  const diff=Math.abs(d.lp_all - d.rp_all);
  const isMiddle = (neutral < 21 && diff < 7) || (neutral >= 21 && diff < 14);
  if (isMiddle) return '중도';
  return d.lp_all >= d.rp_all ? '좌' : '우';
}
function buildResultTitle(s){
  const m=decideSide(s.M), e=decideSide(s.E), l=decideSide(s.L), p=decideSide(s.P);
  if (m==='중도'&&e==='중도'&&l==='중도'&&p==='중도') return '극단적 중도주의';
  const mprefix = (m==='좌') ? '반마법' : (m==='우') ? '친마법' : '마법중립';
  const key=`${e}-${l}-${p}`;
  return `${mprefix} · ${(NAME_MAP[key]||'중도주의(임시)')}`;
}

/* ===== 결과 렌더 ===== */
function renderResults(payload){
  const el=document.getElementById('results'); if(!el) return;
  const s = payload || (()=>{
    // 공유 파라미터 없을 때 방어 (빈 그래프)
    return {M:{lp_all:0,np_all:0,rp_all:0},E:{lp_all:0,np_all:0,rp_all:0},L:{lp_all:0,np_all:0,rp_all:0},P:{lp_all:0,np_all:0,rp_all:0}};
  })();

  el.innerHTML='';
  const title = buildResultTitle(s);
  const head = document.createElement('div');
  head.className='card';
  // 화면엔 제목만. 설명문은 코드에만 남김.
  // 축별 비율(좌/중립/우)과 좌·우만 비교한 백분율을 함께 보여준다.
  head.innerHTML = `<h2 style="margin:0 0 6px">${title}</h2>`;
  el.appendChild(head);

  ['M','E','L','P'].forEach(axis=>{
    const meta=AXES[axis], d=s[axis];
    const card=document.createElement('div'); card.className='card';
    card.innerHTML = `
      <h3>${axis} — <b>${meta.left}</b> vs <b>${meta.right}</b></h3>
      <div class="barrow">
        <div class="baroverlay">
          <div class="cell bar-left"  style="width:${d.lp_all}%">${d.lp_all?`${d.lp_all}%`:''}</div>
          <div class="cell bar-mid"   style="width:${d.np_all}%">${d.np_all?`${d.np_all}%`:''}</div>
          <div class="cell bar-right" style="width:${d.rp_all}%">${d.rp_all?`${d.rp_all}%`:''}</div>
        </div>
      </div>
      <div class="barlbl"><span>${meta.left}</span><span>${meta.right}</span></div>`;
    el.appendChild(card);
  });

  const actions=document.getElementById('resultsActions'); if(actions) actions.classList.remove('hidden');
}

/* ===== 공유 파라미터로 결과 렌더 ===== */
function tryShared(){
  const sp=new URLSearchParams(location.search);
  const b64=sp.get('s');
  if(!b64) return false;
  try{
    const data=JSON.parse(decodeURIComponent(escape(atob(b64))));
    renderResults(data);
    return true;
  }catch{ return false; }
}

/* ===== 부팅 ===== */
document.addEventListener('DOMContentLoaded', ()=>{
  const isQuiz = !!document.getElementById('quizWrap');
  const isRes  = !!document.getElementById('results');
  if (isQuiz) initQuiz();
  if (isRes)  (tryShared() || renderResults());
});
