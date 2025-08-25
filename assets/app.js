/* ===== 축/문항 데이터 ===== */
const AXES = { M:{left:"반마법", right:"친마법"}, E:{left:"평등", right:"권위"}, L:{left:"자유", right:"규제"}, P:{left:"진보", right:"보수"} };
const RESP_FACTOR = {1:-1.2, 2:-1.0, 3:0, 4:+1.0, 5:+1.2};

// 조합 명칭 매핑(우리가 정한 명명법 일부 반영)
// key는 'E-L-P' 순서로 '좌/중도/우' 문자열
const NAME_MAP = {
  // (E,L,P)
  '좌-좌-좌': '혁명주의',
  '좌-좌-중도': '자유평등주의',
  '좌-좌-우': '보수적 평등주의',

  '좌-중도-좌': '진보적 평등주의',
  '좌-중도-중도': '중도적 평등주의',
  '좌-중도-우': '평등적 자유보수주의',

  '좌-우-좌': '사회주의',
  '좌-우-중도': '평등적 규제주의',
  '좌-우-우': '보수적 사회주의',

  '중도-좌-좌': '진보적 자유주의',
  '중도-좌-중도': '중도적 자유주의',
  '중도-좌-우': '보수적 자유주의',

  '중도-중도-좌': '중도적 진보주의',
  '중도-중도-중도': '중도주의',               // (참고: M까지 중도면 buildResultTitle에서 “극단적 중도주의”로 표시)
  '중도-중도-우': '중도적 보수주의',

  '중도-우-좌': '진보적 규제주의',
  '중도-우-중도': '중도적 규제주의',
  '중도-우-우': '보수적 규제주의',

  '우-좌-좌': '엘리트 개혁주의',
  '우-좌-중도': '엘리트 자유주의',
  '우-좌-우': '자유보수주의',

  '우-중도-좌': '보수적 평등개혁',             // 필요하면 명칭 바꿔
  '우-중도-중도': '중도적 권위주의',
  '우-중도-우': '진보적 국가주의',

  '우-우-좌': '권위적 개혁주의',
  '우-우-중도': '권위적 규제주의',
  '우-우-우': '국가주의'
};

const QUESTIONS = [
  {id:1, text:"마법은 학문으로 인정받아야 하며 장기적으로 인류 복지에 순효과를 낳는다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1.0}]},
  {id:2, text:"마법은 결과적으로 사회에 해를 끼친다.", S:1.2, effects:[{axis:'M', side:'반마법', w:1.0}]},
  {id:3, text:"충분히 검증 가능한 마법 원리의 연구는 허용되어야 한다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1.0}]},
  {id:4, text:"마법은 예측 불가능성이 커서 연구 자체를 줄여야 한다.", S:1.0, effects:[{axis:'M', side:'반마법', w:1.0}]},
  {id:5, text:"마법은 과학과 동등한 지적 전통으로 존중받아야 한다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1.0}]},
  {id:6, text:"모든 신분은 법 앞에서 동등해야 한다.", S:1.2, effects:[{axis:'E', side:'평등', w:1.0}]},
  {id:7, text:"사회의 안정에는 상층 엘리트의 지도가 필수적이다.", S:1.2, effects:[{axis:'E', side:'권위', w:1.0}]},
  {id:8, text:"출신과 혈통은 공적 권리에서 우선 고려 요소가 되어야만 한다.", S:1.2, effects:[{axis:'E', side:'권위', w:1.0}]},
  {id:9, text:"출신과 무관하게 공직 진출 기회가 주어져야 한다.", S:1.0, effects:[{axis:'E', side:'평등', w:1.0}]},
  {id:10, text:"위계적 권위는 질서 유지에 도움이 될 때가 많다.", S:0.8, effects:[{axis:'E', side:'권위', w:1.0}]},
  {id:11, text:"연구와 발명은 개인의 자유에 맡겨져야 한다.", S:1.2, effects:[{axis:'L', side:'자유', w:1.0}]},
  {id:12, text:"위험한 연구는 반드시 공적 허가 절차를 거쳐야 한다.", S:1.2, effects:[{axis:'L', side:'규제', w:1.0}]},
  {id:13, text:"언론과 집회의 자유는 위기에서도 보장돼야 한다.", S:1.2, effects:[{axis:'L', side:'자유', w:1.0}]},
  {id:14, text:"공공 안전을 위해 개인의 권리를 제한할 때가 있다.", S:1.0, effects:[{axis:'L', side:'규제', w:1.0}]},
  {id:15, text:"무규제 연구나 시장은 사회적 혼란을 초래할 가능성이 높다.", S:0.8, effects:[{axis:'L', side:'규제', w:1.0}]},
  {id:16, text:"낡은 제도보다 개혁과 변화가 우선이다.", S:1.0, effects:[{axis:'P', side:'진보', w:1.0}]},
  {id:17, text:"전통적 제도는 지금까지 유지된 분명한 이유가 있다.", S:1.2, effects:[{axis:'P', side:'보수', w:1.0}]},
  {id:18, text:"변화 저항은 사회의 퇴보를 낳는다.", S:1.2, effects:[{axis:'P', side:'진보', w:1.0}]},
  {id:19, text:"과거의 질서는 오늘날에도 유효한 기준을 제공한다.", S:1.0, effects:[{axis:'P', side:'보수', w:1.0}]},
  {id:20, text:"급속한 개혁은 혼란을 키운다.", S:0.8, effects:[{axis:'P', side:'보수', w:1.0}]},
  {id:21, text:"마법은 모든 계급에 개방돼야 한다.", S:1.2, effects:[{axis:'M', side:'친마법', w:1.0},{axis:'E', side:'평등', w:0.8}]},
  {id:22, text:"이론적 마법 교육이 현장에서 쓰이는 마법보다 낫다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1.0},{axis:'E', side:'권위', w:0.8}]},
  {id:23, text:"평등을 위해 마법 교육의 장벽을 낮춰야 한다.", S:1.0, effects:[{axis:'M', side:'친마법', w:0.8},{axis:'E', side:'평등', w:1.0}]},
  {id:24, text:"정규 교육을 받는 마법사만이 마법을 사용해야 한다.", S:0.8, effects:[{axis:'M', side:'친마법', w:0.6},{axis:'E', side:'권위', w:1.0}]},
  {id:25, text:"공개 시험/자격제로 마법 접근을 공정화해야 한다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1.0},{axis:'E', side:'평등', w:0.6}]},
  {id:26, text:"마법 연구는 누구나 자유롭게 시도할 수 있어야 한다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1.0},{axis:'L', side:'자유', w:0.6}]},
  {id:27, text:"위험한 마법 연구의 경우는, 반드시 규제되어야 한다.", S:1.2, effects:[{axis:'M', side:'반마법', w:0.8},{axis:'L', side:'규제', w:1.0}]},
  {id:28, text:"자율 규범만으로도 마법 안전을 지킬 수 있다.", S:0.8, effects:[{axis:'M', side:'친마법', w:0.8},{axis:'L', side:'자유', w:1.0}]},
  {id:29, text:"마법 면허제는 안전한 마법 사용을 위해 필수적이다.", S:1.0, effects:[{axis:'M', side:'친마법', w:0.6},{axis:'L', side:'규제', w:1.0}]},
  {id:30, text:"마법 지식의 공개가 혁신을 가속한다.", S:1.2, effects:[{axis:'M', side:'친마법', w:1.0},{axis:'L', side:'자유', w:0.8}]},
  {id:31, text:"마법은 새로운 제도를 만들어낼 힘이어야 한다.", S:1.0, effects:[{axis:'M', side:'친마법', w:0.8},{axis:'P', side:'진보', w:1.0}]},
  {id:32, text:"현재 마법 산업보다, 과거의 마법이 더 낫다.", S:1.0, effects:[{axis:'M', side:'반마법', w:0.8},{axis:'P', side:'보수', w:1.0}]},
  {id:33, text:"개혁과 함께 마법 제도도 바뀌어야 한다.", S:1.2, effects:[{axis:'M', side:'친마법', w:1.0},{axis:'P', side:'진보', w:0.6}]},
  {id:34, text:"마법 사용의 관습적 규칙은 지금 적용될 수 없다.", S:0.8, effects:[{axis:'M', side:'반마법', w:0.6},{axis:'P', side:'진보', w:1.0}]},
  {id:35, text:"혁신적 마법 응용은 보수적 제도를 교체해야 한다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1.0},{axis:'P', side:'진보', w:0.8}]},
  {id:36, text:"자유는 평등을 위해 필수적이다.", S:1.0, effects:[{axis:'E', side:'평등', w:1.0},{axis:'L', side:'자유', w:0.8}]},
  {id:37, text:"평등을 위해 일부 자유의 제한이 불가피하다.", S:1.2, effects:[{axis:'E', side:'평등', w:1.0},{axis:'L', side:'규제', w:0.6}]},
  {id:38, text:"자유가 없으면 평등도 공허하다.", S:0.8, effects:[{axis:'E', side:'평등', w:0.6},{axis:'L', side:'자유', w:1.0}]},
  {id:39, text:"규제 강화가 불평등을 줄인다.", S:1.0, effects:[{axis:'E', side:'평등', w:0.8},{axis:'L', side:'규제', w:1.0}]},
  {id:40, text:"권리장전 보장이 평등의 기초다.", S:1.2, effects:[{axis:'E', side:'평등', w:1.0},{axis:'L', side:'자유', w:0.6}]},
  {id:41, text:"사회 개혁은 불평등 해소를 목표로 해야 한다.", S:1.2, effects:[{axis:'E', side:'평등', w:1.0},{axis:'P', side:'진보', w:0.6}]},
  {id:42, text:"전통적 위계·질서를 지키는 일이 평등보다 우선이다.", S:1.0, effects:[{axis:'E', side:'권위', w:0.8},{axis:'P', side:'보수', w:1.0}]},
  {id:43, text:"부의 재분배는 개혁의 핵심 과제이다.", S:1.0, effects:[{axis:'E', side:'평등', w:1.0},{axis:'P', side:'진보', w:0.8}]},
  {id:44, text:"관습법과 작위를 존중할 수 있다.", S:0.8, effects:[{axis:'E', side:'권위', w:0.6},{axis:'P', side:'보수', w:1.0}]},
  {id:45, text:"평등한 참정권 확대가 곧 개혁의 출발점이다.", S:1.0, effects:[{axis:'E', side:'평등', w:0.8},{axis:'P', side:'진보', w:1.0}]},
  {id:46, text:"표현·결사의 자유는 개혁의 전제다.", S:1.2, effects:[{axis:'L', side:'자유', w:1.0},{axis:'P', side:'진보', w:0.6}]},
  {id:47, text:"검열·치안 강화를 통해 전통 질서를 지켜야 한다.", S:1.0, effects:[{axis:'L', side:'규제', w:1.0},{axis:'P', side:'보수', w:0.6}]},
  {id:48, text:"자유시장·자유연구가 사회 혁신을 낳는다.", S:1.0, effects:[{axis:'L', side:'자유', w:1.0},{axis:'P', side:'진보', w:0.6}]},
  {id:49, text:"종교·전통 규범을 위해 자유를 제한할 수 있다.", S:0.8, effects:[{axis:'L', side:'규제', w:0.8},{axis:'P', side:'보수', w:1.0}]},
  {id:50, text:"시민적 자유 확대는 보수적 제도와도 양립 가능하다.", S:0.8, effects:[{axis:'L', side:'자유', w:0.8},{axis:'P', side:'보수', w:0.6}]},
];

/* ===== 셔플/페이징 ===== */
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const PER_PAGE = 10; const PAGES = 5;
let ORDERED = []; let PAGES_DATA = []; let ANSWERS = {}; let CUR = 0;

function initQuiz(){
  ORDERED = shuffle(QUESTIONS).slice(0,50);
  PAGES_DATA = [];
  for(let i=0;i<PAGES;i++){ PAGES_DATA.push(ORDERED.slice(i*PER_PAGE,(i+1)*PER_PAGE)); }
  ANSWERS = {}; CUR = 0;
  document.getElementById('stageChip').textContent = '진행 중';
  document.getElementById('start').classList.add('hidden');
  document.getElementById('start').style.display='none';
  document.getElementById('results').innerHTML='';
  document.getElementById('results').classList.add('hidden');
  document.getElementById('resultsActions').classList.add('hidden');
  document.getElementById('quizWrap').classList.remove('hidden');
  renderPage();
}

/* ===== 렌더 ===== */
function renderPage(){
  const quizEl = document.getElementById('quiz');
  const pageInfo = document.getElementById('pageInfo');
  const prog = document.getElementById('prog');
  const list = PAGES_DATA[CUR];
  quizEl.innerHTML = '';
  list.forEach((q,idx)=>{
    const id = `q_${q.id}`; const val = ANSWERS[q.id] ?? null;
    const card = document.createElement('div'); card.className = 'card';
    card.innerHTML = `
      <div class="q">
        <div class="qnum">${CUR*PER_PAGE + idx + 1}</div>
        <div class="qbody">
          <p class="qtext">${q.text}</p>
          <div class="opts" role="radiogroup">
            ${[1,2,3,4,5].map(v=>{
              const lbl = v===1?'전혀 아님':v===2?'대체로 아님':v===3?'중립/모름':v===4?'대체로 동의':'적극 동의';
              const checked = (val===v)?'checked':'';
              return `<label class=\"opt\"><input type=\"radio\" name=\"${id}\" value=\"${v}\" ${checked}/> <span>${v}. ${lbl}</span></label>`;
            }).join('')}
          </div>
        </div>
      </div>`;
    quizEl.appendChild(card);
  });
  pageInfo.textContent = `${CUR+1} / ${PAGES}`;
  prog.style.width = `${Math.round(((CUR)/PAGES)*100)}%`;
  document.getElementById('prevBtn').disabled = (CUR===0);
  document.getElementById('nextBtn').classList.toggle('hidden', CUR===PAGES-1);
  document.getElementById('finishBtn').classList.toggle('hidden', CUR!==PAGES-1);
}

  function validateCurrentPage() {
  const list = PAGES_DATA[CUR];
  for (const q of list) {
    const name = `q_${q.id}`;
    const sel = document.querySelector(`input[name="${name}"]:checked`);
    if (!sel) {
      const card = document.querySelector(`input[name="${name}"]`)?.closest('.card');
      return { ok: false, card };
    }
  }
  return { ok: true, card: null };
}

/* ===== 응답/채점 ===== */
function sideToLR(axis, side){ const a=AXES[axis]; return (side===a.left)?'left':'right'; }
function collectCurrentPage(){
  const list = PAGES_DATA[CUR];
  list.forEach(q=>{
    const name = `q_${q.id}`;
    const sel = document.querySelector(`input[name=\"${name}\"]:checked`);
    if (sel) ANSWERS[q.id] = parseInt(sel.value,10);
  }); 
}
function score(){
  const sums = { M:{left:0,right:0,neutral:0}, E:{left:0,right:0,neutral:0}, L:{left:0,right:0,neutral:0}, P:{left:0,right:0,neutral:0} };
  ORDERED.forEach(q=>{
    const has = Object.prototype.hasOwnProperty.call(ANSWERS, q.id);
    if (!has) return; // 미응답은 완전히 제외(가중치/중립률 모두 불포함)
    const val = ANSWERS[q.id];
    const f = RESP_FACTOR[val];
    q.effects.forEach(e=>{ const lr = sideToLR(e.axis,e.side); const opp=(lr==='left'?'right':'left');
      if(val===3){ sums[e.axis].neutral += 1.0*q.S*e.w; }
      else if(f>0){ sums[e.axis][lr] += f*q.S*e.w; }
      else { sums[e.axis][opp] += Math.abs(f)*q.S*e.w; }
    });
  });
  const out={};
  Object.keys(sums).forEach(axis=>{ const {left,right,neutral}=sums[axis]; const sumAll=left+right+neutral; const totalLR=left+right;
    const lp_all = sumAll>0 ? Math.round((left/sumAll)*1000)/10 : 0;
    const np_all = sumAll>0 ? Math.round((neutral/sumAll)*1000)/10 : 0;
    const rp_all = sumAll>0 ? Math.round((right/sumAll)*1000)/10 : 0;
    let lp_lr=50, rp_lr=50; if(totalLR>0){ lp_lr=Math.round((left/totalLR)*1000)/10; rp_lr=Math.round((right/totalLR)*1000)/10; }
    out[axis]={lp_all,np_all,rp_all,lp_lr,rp_lr};
  });
  return out;
}
function decideSide(d){
  // d: { lp_all, np_all, rp_all, ... }
  // 새 기준:
  // - 중립률 < 21%  && 좌우차 < 7%p  → 중도
  // - 중립률 ≥ 21% && 좌우차 < 14%p → 중도
  const neutral = d.np_all;                      // 중립 비율 (%)
  const diff = Math.abs(d.lp_all - d.rp_all);    // 좌/우 백분율 차이(%p)

  const isMiddle =
    (neutral < 21 && diff < 7) ||
    (neutral >= 21 && diff < 14);

  if (isMiddle) return '중도';
  return d.lp_all >= d.rp_all ? '좌' : '우';
}
function buildResultTitle(s){
  const m=decideSide(s.M), e=decideSide(s.E), l=decideSide(s.L), p=decideSide(s.P);
  const mprefix = (m==='좌') ? '반마법'
              : (m==='우') ? '친마법'
              : '마법중립';
  const key = `${e}-${l}-${p}`;
  // 네 축 모두 중도면: 극단적 중도주의
  if (m==='중도' && e==='중도' && l==='중도' && p==='중도') return '극단적 중도주의';
  // 반드시 매핑 이름만 사용(축별 나열 금지)
  const tri = NAME_MAP[key] || '중도주의(임시)';
  return `${mprefix} · ${tri}`;
}

/* ===== 결과 렌더 ===== */
function renderResults(){
  document.getElementById('stageChip').textContent='결과';
  document.getElementById('quizWrap').classList.add('hidden');
  document.getElementById('start').classList.add('hidden');
  document.getElementById('start').style.display='none';
  const s=score(); const resultsEl=document.getElementById('results'); resultsEl.innerHTML='';
  const order=['M','E','L','P'];
  const title=buildResultTitle(s);
  const titleCard=document.createElement('div'); titleCard.className='card';
  // 축별 비율(좌/중립/우)과 좌·우만 비교한 백분율을 함께 보여준다.
titleCard.innerHTML=`<h2 style="margin:0 0 6px">${title}</h2>`;
  resultsEl.appendChild(titleCard);
  order.forEach(axis=>{ const meta=AXES[axis]; const d=s[axis];
    const bar=document.createElement('div'); bar.className='bar';
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
    const barrow = bar.querySelector('.barrow');
    // CSS 변수에 비율/블렌드 주입
    const blend = 5; // 고정 5%로 더 부드럽게
    barrow.style.setProperty('--lp', d.lp_all);
    barrow.style.setProperty('--np', d.np_all);
    barrow.style.setProperty('--blend', blend);
    barrow.classList.toggle('no-neutral', d.np_all <= 0.1); // 중립 거의 0%면 흰색 제거
    resultsEl.appendChild(bar);
  });
  resultsEl.classList.remove('hidden');
  document.getElementById('resultsActions').classList.remove('hidden');
  window.scrollTo({top:resultsEl.offsetTop-20, behavior:'smooth'});
}

/* ===== 이벤트 ===== */
document.getElementById('startBtn').addEventListener('click', ()=>{ initQuiz(); });

document.getElementById('prevBtn').addEventListener('click', ()=>{
   CUR = Math.max(0, CUR-1);
   renderPage();
});

document.getElementById('nextBtn').addEventListener('click', ()=>{
  const v = validateCurrentPage();
  if (!v.ok) {
    alert('이 페이지의 모든 문항에 응답해줘.');
    v.card?.classList.add('need');
    v.card?.scrollIntoView({behavior:'smooth', block:'center'});
    setTimeout(()=> v.card?.classList.remove('need'), 1200);
    return;
  }
  collectCurrentPage();
  CUR = Math.min(PAGES-1, CUR+1);
  renderPage();
});

document.getElementById('finishBtn').addEventListener('click', ()=>{
  const v = validateCurrentPage();
  if (!v.ok) {
    alert('이 페이지의 모든 문항에 응답해줘.');
    v.card?.classList.add('need');
    v.card?.scrollIntoView({ behavior:'smooth', block:'center' });
    setTimeout(()=> v.card?.classList.remove('need'), 1200);
    return;
  }
  collectCurrentPage();
  renderResults();
});

document.getElementById('restartBtn').addEventListener('click', ()=>{
  ANSWERS={}; ORDERED=[]; PAGES_DATA=[]; CUR=0;
  document.getElementById('results').innerHTML='';
  document.getElementById('results').classList.add('hidden');
  document.getElementById('resultsActions').classList.add('hidden');
  document.getElementById('quizWrap').classList.add('hidden');
  document.getElementById('start').classList.remove('hidden');
  document.getElementById('start').style.display='';
  document.getElementById('stageChip').textContent='시작 전';
  document.getElementById('prog').style.width='0%';
  window.scrollTo({top:0, behavior:'smooth'});
});
document.addEventListener('DOMContentLoaded', () => {
  const hasQuiz = !!document.getElementById('quizWrap');
  const hasResult = !!document.getElementById('results');

  if (hasQuiz) {
    // 네 기존 함수명대로 호출: initQuiz 또는 renderQuiz 중 있는 걸로
    if (typeof initQuiz === 'function') { initQuiz(); }
    else if (typeof renderQuiz === 'function') { renderQuiz(); }
  }

  if (hasResult) {
    // 공유 파라미터 s=?로 들어왔을 때 복원 (나중에 안 쓰면 이 블록은 무시)
    const sp = new URLSearchParams(location.search);
    const s = sp.get('s');
    if (typeof renderResults === 'function') {
      if (s) {
        try {
          const data = JSON.parse(decodeURIComponent(escape(atob(s))));
          renderResults(data);
        } catch { renderResults(); }
      } else {
        renderResults();
      }
    }
    const restart = document.getElementById('restartBtn');
    if (restart) restart.onclick = () => location.href = '../';
  }
});
