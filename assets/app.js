/* ===== 설정 ===== */
var AXES = window.AXES || {
  M:{left:"반마법", right:"친마법"},
  E:{left:"평등",  right:"권위"},
  L:{left:"자유",  right:"규제"},
}; window.AXES = AXES;

var RESP = window.RESP || {
  1:-1.2, 2:-1.0, 3:0, 4:+1.0, 5:+1.2
}; window.RESP = RESP;

/* 이름 맵(임시) — E-L-P 조합 */
const EL_GRID_LABELS = {
  '좌': {'좌': '급진 자유주의', '중도': '시민 공화주의', '우': '사회민주주의' },
  '중도': { '좌': '시민 자유주의', '중도': '중도주의', '우': '국가주의' }, // - 국가주의는 '국가 통제 우선'의 의미로 사용
  '우': { '좌': '귀족주의', '중도': '입헌군주주의', '우': '전제주의' }
};

var ALL_QUESTIONS = window.QUESTIONS ||  [
  {id:1, text:"마법은 학문으로 인정받아야 하며 장기적으로 인류 복지에 순효과를 낳는다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1.0}]},
  {id:2, text:"마법은 이익보다 피해가 더 크다.", S:1.2, effects:[{axis:'M', side:'반마법', w:1.0}]},
  {id:3, text:"충분히 검증 가능한 마법 원리의 연구는 허용되어야 한다.", S:1.2, effects:[{axis:'M', side:'친마법', w:1.0}]},
  {id:4, text:"마법은 예측 불가능성이 커서 연구 자체를 줄여야 한다.", S:1.0, effects:[{axis:'M', side:'반마법', w:1.0}]},
  {id:5, text:"마법은 과학과 동등한 지적 전통으로 존중받아야 한다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1.0}]},

  {id:6, text:"모든 신분은 법 앞에서 동등해야 한다.", S:1.2, effects:[{axis:'E', side:'평등', w:1.0}]},
  {id:7, text:"사회의 안정에는 상층 엘리트의 지도가 필수적이다.", S:1.2, effects:[{axis:'E', side:'권위', w:1.0}]},
  {id:8, text:"출신과 혈통은 공적 권리에서 우선 고려 요소가 되어야만 한다.", S:1.2, effects:[{axis:'E', side:'권위', w:1.0}]},
  {id:9, text:"출신과 무관하게 공직 진출 기회가 주어져야 한다.", S:1.0, effects:[{axis:'E', side:'평등', w:1.0}]},
  {id:10, text:"위계적 권위는 질서 유지에 도움이 될 때가 많다.", S:0.8, effects:[{axis:'E', side:'권위', w:1.0}]},

  {id:11, text:"연구와 발명은 개인의 자유에 맡겨져야 한다.", S:1.0, effects:[{axis:'L', side:'자유', w:1.0}]},
  {id:12, text:"마법 연구는 잠재적 위험 때문에 더 강한 규제가 필요하다.", S:1.0, effects:[{axis:'L', side:'규제', w:1.0}]},
  {id:13, text:"마법적 효용을 위해서라면 개인 자유가 다소 제한될 수 있다.", S:0.8, effects:[{axis:'L', side:'규제', w:1.0}]},
  {id:14, text:"마법적 기술의 상업적 이용은 가능한 한 자유롭게 허용되어야 한다.", S:1.2, effects:[{axis:'L', side:'자유', w:1.0}]},
  {id:15, text:"치안과 질서를 위해 개인의 자유를 일정 부분 양보해야 한다.", S:0.8, effects:[{axis:'L', side:'규제', w:1.0},{axis:'E']},

  {id:16, text:"마법은 공익을 명분으로 국가가 통제해야 한다.", S:1.0, effects:[{axis:'L', side:'규제', w:1.0},{axis:'M', side:'친마법', w:0.4}]},
  {id:17, text:"마법적 혁신은 국가의 간섭 없이 자율적으로 발전해야 한다.", S:1.0, effects:[{axis:'L', side:'자유', w:1.0},{axis:'M', side:'친마법', w:0.4}]},
  {id:18, text:"사회적 약자를 위해 공권력이 자유를 제한할 수 있다.", S:0.8, effects:[{axis:'L', side:'규제', w:1.0},{axis:'E', side:'평등', w:0.6}]},
  {id:19, text:"세습 특권은 가능한 한 축소되어야 한다.", S:1.0, effects:[{axis:'E', side:'평등', w:1.0},{axis:'L', side:'규제', w:0.4}]},
  {id:20, text:"신분 질서는 사회적 안정의 기초다.", S:1.0, effects:[{axis:'E', side:'권위', w:1.0},{axis:'L', side:'규제', w:0.4}]},

  {id:21, text:"마법사 길드는 공적 권한을 더 많이 가져야 한다.", S:0.8, effects:[{axis:'E', side:'권위', w:1.0},{axis:'M', side:'친마법', w:0.6}]},
  {id:22, text:"동일 가치의 노동에는 임금이 동등하게 보장되어야 한다.", S:1.2, effects:[{axis:'E', side:'평등', w:1.0},{axis:'L', side:'규제', w:0.4}]},
  {id:23, text:"마법 교육은 개인 선택에 맡겨야 한다.", S:1.0, effects:[{axis:'L', side:'자유', w:1.0},{axis:'M', side:'친마법', w:0.4}]},
  {id:24, text:"위험한 마법 실험은 전면 금지되어야 한다.", S:1.2, effects:[{axis:'L', side:'규제', w:1.0},{axis:'M', side:'반마법', w:0.6}]},
  {id:25, text:"마법 기술의 공개는 지식 공유를 촉진한다.", S:1.0, effects:[{axis:'L', side:'자유', w:1.0},{axis:'M', side:'친마법', w:0.4}]},

  {id:26, text:"마법 장비 소지는 허가제로 관리해야 한다.", S:1.0, effects:[{axis:'L', side:'규제', w:1.0},{axis:'E', side:'권위', w:0.4}]},
  {id:27, text:"계층 간 혼인은 장려되어야 한다.", S:0.8, effects:[{axis:'E', side:'평등', w:1.0},{axis:'L', side:'자유', w:0.6}]},
  {id:28, text:"엘리트의 통치가 일반 대중의 의사보다 합리적일 때가 많다.", S:0.8, effects:[{axis:'E', side:'권위', w:1.0},{axis:'L', side:'규제', w:0.6}]},
  {id:29, text:"마법 산업에 대한 규제는 최소한으로 제한해야 한다.", S:1.0, effects:[{axis:'L', side:'자유', w:1.0},{axis:'M', side:'친마법', w:0.8}]},
  {id:30, text:"권리의 보장은 평등의 기초다.", S:1.2, effects:[{axis:'E', side:'평등', w:1.0},{axis:'L', side:'자유', w:0.6}]},

  {id:31, text:"마법 지식과 설계도의 공개는 원칙적으로 자유여야 한다.", S:1.2, effects:[{axis:'L', side:'자유', w:1.0},{axis:'M', side:'친마법', w:0.4}]},
  {id:32, text:"마법 장치의 개인 소지는 기본권으로 보장되는 자유다.", S:1.0, effects:[{axis:'L', side:'자유', w:1.0},{axis:'M', side:'친마법', w:0.4}]},
  {id:33, text:"마법사 자격 시험과 면허는 신분·배경과 무관해야 한다.", S:1.0, effects:[{axis:'E', side:'평등', w:1.0},{axis:'L', side:'규제', w:0.4}]},
  {id:34, text:"마법 공방에는 최소한의 안전 규칙만 적용되어야 한다.", S:1.0, effects:[{axis:'L', side:'자유', w:1.0},{axis:'M', side:'친마법', w:0.4}]},
  {id:35, text:"무면허 마법 실험은 강력히 처벌되어야 한다.", S:1.2, effects:[{axis:'L', side:'규제', w:1.0},{axis:'M', side:'반마법', w:0.4}]},
  {id:36, text:"귀족 특권은 공익을 위해 제한될 수 있다.", S:1.0, effects:[{axis:'E', side:'평등', w:1.0},{axis:'L', side:'규제', w:0.4}]},
  {id:37, text:"왕실이나 정부는 마법 연구를 후원하되 간섭해서는 안 된다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1.0},{axis:'L', side:'자유', w:0.6}]},
  {id:38, text:"경쟁과 거래의 자유가 마법 기술의 질을 높인다.", S:1.0, effects:[{axis:'L', side:'자유', w:1.0},{axis:'M', side:'친마법', w:0.4}]}

];
let QUESTIONS = ALL_QUESTIONS
  .map(q => ({ ...q, effects: q.effects.filter(e => e.axis !== 'P') }))  // P축 효과 제거
  .filter(q => q.effects.length > 0)                                      // 효과 없으면 문항 제거
  .map((q, i) => ({ ...q, id: i + 1 }));                                  // 1..N 재번호

window.QUESTIONS = QUESTIONS;

/* ===== 전역 상태 ===== */
const PER_PAGE = 5;
let ORDERED=[]
let PAGES=1
let PAGES_DATA=[]
let  CUR=0;
let ANSWERS={}

/* ===== 유틸 ===== */
const round1 = x => Math.round(x*10)/10;
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function sideToLR(axis, side){
  const m=AXES[axis];
  if (side===m.left) return 'left';
  if (side===m.right) return 'right';
  if (['친마법','평등','자유'].includes(side)) return 'left';
  return 'right';
}

/* ===== 퀴즈 ===== */
function initQuiz(){
  ORDERED = QUESTIONS.slice().sort(()=>Math.random()-0.5);
  PAGES   = Math.max(1, Math.ceil(ORDERED.length / PER_PAGE));

  PAGES_DATA = [];
  for (let i=0;i<PAGES;i++){
    PAGES_DATA.push(ORDERED.slice(i*PER_PAGE, (i+1)*PER_PAGE));
  }

  ANSWERS = {};
  CUR = 0;

  const wrap = document.getElementById('quizWrap');
  if (wrap) wrap.classList.remove('hidden');
  renderPage();
}

function renderPage(){
  const quizEl = document.getElementById('quiz');
  let list = (PAGES_DATA[CUR] && PAGES_DATA[CUR].length)
    ? PAGES_DATA[CUR]
    : ORDERED.slice(CUR*PER_PAGE, (CUR+1)*PER_PAGE);

  quizEl.innerHTML = '';

  // 필요시 보정
  if (!Array.isArray(list) || list.length === 0) {
    if (!Array.isArray(PAGES_DATA) || PAGES_DATA.length !== PAGES) {
      PAGES_DATA = [];
      for (let i = 0; i < PAGES; i++) {
        PAGES_DATA.push(ORDERED.slice(i*PER_PAGE, (i+1)*PER_PAGE));
      }
    }
    list = PAGES_DATA[CUR] || [];
  }

  // 문항 카드
  list.forEach((q,idx)=>{
    const id = `q_${q.id}`;
    const val = ANSWERS[q.id] ?? null;

    const card = document.createElement('div'); 
    card.className = 'card';
    card.innerHTML = `
      <div class="q">
        <div class="qnum">${CUR*PER_PAGE + idx + 1}</div>
        <div class="qbody">
          <p class="qtext">${q.text}</p>
          <div class="opts" role="radiogroup">
            ${[1,2,3,4,5].map(v=>{
              const lbl = v===1?'전혀 아님':v===2?'대체로 아님':v===3?'중립/모름':v===4?'대체로 동의':'적극 동의';
              const checked = (val===v)?'checked':'';
              return `<label class="opt">
                        <input type="radio" name="${id}" value="${v}" ${checked}/>
                        <span>${v}. ${lbl}</span>
                      </label>`;
            }).join('')}
          </div>
        </div>
      </div>`;
    quizEl.appendChild(card);
  });
  
  // --- 페이지 정보/프로그레스 ---
  const pageInfo = document.getElementById('pageInfo');
  const prog     = document.getElementById('prog');
  if (pageInfo) pageInfo.textContent = `${CUR+1} / ${PAGES}`;
  if (prog)     prog.style.width     = `${Math.round((CUR/PAGES)*100)}%`;

  // --- 하단 페이저(중복 리스너 제거 후 바인딩) ---
  const replaceAndGet = (sel) => {
    const old = document.querySelector(sel);
    if (!old) return null;
    const nn = old.cloneNode(true);         // ← 기존 리스너 싹 제거
    old.parentNode.replaceChild(nn, old);
    return nn;
  };

  const prevBtn   = replaceAndGet('#quizWrap #prevBtn');
  const nextBtn   = replaceAndGet('#quizWrap #nextBtn');
  const finishBtn = replaceAndGet('#quizWrap #finishBtn');

  if (prevBtn)   prevBtn.disabled = (CUR===0);
  if (nextBtn)   nextBtn.classList.toggle('hidden',  CUR===PAGES-1);
  if (finishBtn) finishBtn.classList.toggle('hidden', CUR!==PAGES-1);

  prevBtn?.addEventListener('click', (e)=>{
    e.preventDefault();
    if (CUR>0){ collectCurrentPage(); CUR--; renderPage(); }
  });

  nextBtn?.addEventListener('click', (e)=>{
    e.preventDefault();
    collectCurrentPage();                // ← 먼저 수집
    if (!validateCurrentPage()) return;  // ← 그 다음 검증
    CUR++; renderPage();
  });

  finishBtn?.addEventListener('click', (e)=>{
    e.preventDefault();
    collectCurrentPage();                // ← 먼저 수집
    if (!validateCurrentPage()) return;  // ← 그 다음 검증
    finishQuiz();
  });
  
}

function validateCurrentPage(){
  const groups = Array.from(document.querySelectorAll('#quiz .opts'));
  for (const g of groups){
    if (!g.querySelector('input[type="radio"]:checked')){
      alert('이 페이지 문항을 모두 선택해야 넘어갈 수 있어.');
      return false;
    }
  }
  return true;
}

function collectCurrentPage(){
  const list = PAGES_DATA[CUR] || [];
  list.forEach(q=>{
    const sel = document.querySelector(`input[name="q_${q.id}"]:checked`);
    if (sel) ANSWERS[q.id] = Number(sel.value);
  });
}

function finishQuiz(){
  const s = score();
  const payload = {
    M: pickPerc(s.M), E: pickPerc(s.E), L: pickPerc(s.L)
  };
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

  // 결과 페이지용 로컬 저장 (쿼리파라미터 못 읽을 때 폴백)
  localStorage.setItem('answers_v11', JSON.stringify(ANSWERS));
  localStorage.setItem('order_v11', JSON.stringify(ORDERED.map(q=>q.id)));
  
  location.href = '../result/?s='+b64;
}
function pickPerc(d){ return {
  lp_all:Math.round(d.lp_all), np_all:Math.round(d.np_all), rp_all:Math.round(d.rp_all)
}; }

/* ===== 채점/판정/타이틀 ===== */
function score(){
  const sums = Object.fromEntries(Object.keys(AXES).map(k => [k, { left:0, right:0, neutral:0 }]));
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
  // 좌우만의 비율(중립 제외)
  const diff_lr = Math.abs(d.lp_lr - d.rp_lr);   // 퍼센트 포인트
  const neutral = d.np_all;                      // 전체 중립 비율(%)

  // 1) 중립 비율 무관: 좌우 차 < 5%p → 중도
  // 2) 중립 ≥ 25%일 때: 좌우 차 < 10%p → 중도
  const isMiddle = (diff_lr < 5) || (neutral >= 25 && diff_lr < 10);
  if (isMiddle) return '중도';

  // 3) 그 외엔 중립 비율 무시하고 좌우 큰 쪽으로 판정
  return d.lp_lr >= d.rp_lr ? '좌' : '우';
}

function buildResultTitle(s){
  const m=decideSide(s.M), e=decideSide(s.E), l=decideSide(s.L);
  if (m==='중도' && e==='중도' && l==='중도') return '극단적 중도주의';
  const mprefix = (m==='좌') ? '반마법' : (m==='우') ? '친마법' : '마법중립';
  const label = EL_GRID_LABELS?.[e]?.[l] ?? '중도주의(임시)';
  return `${mprefix} · ${label}`;
}

/* ===== 결과 렌더 ===== */
function renderResults(){
  const chip = document.getElementById('stageChip'); if (chip) chip.textContent = '결과';

  const s=score(); 
  const resultsEl=document.getElementById('results'); 
  resultsEl.innerHTML='';

  const order = Object.keys(AXES);  // ['M','E','L']
  const title=buildResultTitle(s);

  const titleCard=document.createElement('div'); 
  titleCard.className='card';
  // 축별 비율(좌/중립/우)과 좌·우만 비교한 백분율을 함께 보여준다.  // ← 주석만 남김(화면 미표시)
  titleCard.innerHTML=`<h2 style="margin:0 0 6px">${title}</h2>`;
  resultsEl.appendChild(titleCard);

  order.forEach(axis=>{ 
    const meta=AXES[axis]; 
    const d=s[axis];
    const bar=document.createElement('div'); 
    bar.className='bar';
    bar.innerHTML=`
      <h3>${axis} — <b>${meta.left}</b> vs <b>${meta.right}</b></h3>
      <div class="barrow">
        <div class="baroverlay">
          <div class="cell" style="width:${d.lp_all}%">${d.lp_all?`${d.lp_all}%`:''}</div>
          <div class="cell" style="width:${d.np_all}%"><span style="color:#111">${d.np_all?`${d.np_all}%`:''}</span></div>
          <div class="cell" style="width:${d.rp_all}%">${d.rp_all?`${d.rp_all}%`:''}</div>
        </div>
      </div>
      <div class="barlbl"><span>${meta.left}</span><span>${meta.right}</span></div>`;

    // ★ 그라데이션용 CSS 변수 주입(필수)
    const barrow = bar.querySelector('.barrow');
    const blend = 5;
    barrow.style.setProperty('--lp', d.lp_all);
    barrow.style.setProperty('--np', d.np_all);
    barrow.style.setProperty('--blend', blend);
    barrow.classList.toggle('no-neutral', d.np_all <= 0.1);

    resultsEl.appendChild(bar);
  });

  resultsEl.classList.remove('hidden');
  document.getElementById('resultsActions').classList.remove('hidden');
  window.scrollTo({top:resultsEl.offsetTop-20, behavior:'smooth'});
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

  if (isQuiz) {
    initQuiz(); // 첫 페이지 렌더
  }

  if (isRes) {
  // 1) s=… 쿼리 우선 시도
  let loaded = false;
  const qs = new URLSearchParams(location.search).get('s');
  if (qs) {
    try {
      const payload = JSON.parse(decodeURIComponent(atob(qs)));
      if (payload && payload.answers) {
        ANSWERS = payload.answers;
        if (Array.isArray(payload.seed)) {
          ORDERED = payload.seed.map(id => QUESTIONS.find(x=>x.id===id)).filter(Boolean);
        }
        loaded = true;
      }
    } catch(e) {}
  }
  // 2) 실패하면 로컬 저장소 폴백
  if (!loaded) {
    try {
      const a = localStorage.getItem('answers_v11');
      if (a) ANSWERS = JSON.parse(a);
      const o = localStorage.getItem('order_v11');
      if (o) {
        const ids = JSON.parse(o);
        ORDERED = ids.map(id => QUESTIONS.find(x=>x.id===id)).filter(Boolean);
      }
    } catch(e) {}
  }
  // 3) ORDERED 비면 QUESTIONS로 채우고 슬라이스 구성
  if (!Array.isArray(ORDERED) || ORDERED.length===0) ORDERED = QUESTIONS.slice();
  PAGES = Math.max(1, Math.ceil(ORDERED.length / PER_PAGE));
  PAGES_DATA = [];
  for (let i=0;i<PAGES;i++){
    PAGES_DATA.push(ORDERED.slice(i*PER_PAGE,(i+1)*PER_PAGE));
  }
  // 4) 렌더
  renderResults();
}
});
