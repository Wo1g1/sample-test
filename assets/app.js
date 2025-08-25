/* ===== 기본 설정 ===== */
const AXES = {
  M:{left:"반마법", right:"친마법"},
  E:{left:"평등", right:"권위"},
  L:{left:"자유",  right:"규제"},
  P:{left:"진보",  right:"보수"},
};
const RESP = {1:-1.2, 2:-1.0, 3:0, 4:+1.0, 5:+1.2};

/* E-L-P 최종 명칭(임시) */
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

/* ===== 데모 문항(10개) — 먼저 페이지 살리고 나중에 교체 ===== */
const QUESTIONS = [
  {id:1,  text:"마법은 인류에 순효과다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1}]},
  {id:2,  text:"마법 연구는 줄여야 한다.", S:1.0, effects:[{axis:'M', side:'반마법', w:1}]},
  {id:3,  text:"법 앞의 평등이 중요하다.", S:1.2, effects:[{axis:'E', side:'평등', w:1}]},
  {id:4,  text:"엘리트의 지도가 필요하다.", S:1.2, effects:[{axis:'E', side:'권위', w:1}]},
  {id:5,  text:"연구·표현의 자유가 우선이다.", S:1.2, effects:[{axis:'L', side:'자유', w:1}]},
  {id:6,  text:"공공안전을 위해 규제가 필요하다.", S:1.0, effects:[{axis:'L', side:'규제', w:1}]},
  {id:7,  text:"사회는 더 진보해야 한다.", S:1.0, effects:[{axis:'P', side:'진보', w:1}]},
  {id:8,  text:"전통 가치를 지켜야 한다.", S:1.0, effects:[{axis:'P', side:'보수', w:1}]},
  {id:9,  text:"마법 원리 연구를 허용해야 한다.", S:1.0, effects:[{axis:'M', side:'친마법', w:1}]},
  {id:10, text:"무규제 연구는 위험하다.", S:1.0, effects:[{axis:'L', side:'규제', w:1}]},
];

/* ===== 전역 상태 ===== */
let ORDERED=[], PAGES_DATA=[], ANSWERS={}, CUR=0;
const PER_PAGE = 10;
const PAGES = Math.ceil(QUESTIONS.length/PER_PAGE);

/* ===== 유틸 ===== */
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
  PAGES_DATA = [];
  for(let i=0;i<PAGES;i++) PAGES_DATA.push(ORDERED.slice(i*PER_PAGE,(i+1)*PER_PAGE));
  ANSWERS = {}; CUR=0;

  const chip=document.getElementById('stageChip'); if(chip) chip.textContent='진행 중';
  const wrap=document.getElementById('quizWrap'); if(wrap) wrap.classList.remove('hidden');

  renderPage();
}

function renderPage(){
  const data=PAGES_DATA[CUR]||[];
  const quizEl=document.getElementById('quiz');
  const pageInfo=document.getElementById('pageInfo');
  const prevBtn=document.getElementById('prevBtn');
  const nextBtn=document.getElementById('nextBtn');
  const finishBtn=document.getElementById('finishBtn');
  const prog=document.getElementById('prog');

  if (pageInfo) pageInfo.textContent = `${CUR+1} / ${PAGES}`;
  if (prog) prog.style.width = `${(CUR)/(Math.max(1,PAGES-1))*100}%`;

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

  if (prevBtn) prevBtn.disabled = CUR===0;
  if (nextBtn) nextBtn.classList.toggle('hidden', CUR===PAGES-1);
  if (finishBtn) finishBtn.classList.toggle('hidden', CUR!==PAGES-1);

  if (prevBtn) prevBtn.onclick = ()=>{ if(CUR>0){ collectCurrentPage(); CUR--; renderPage(); } };
  if (nextBtn) nextBtn.onclick = ()=>{ if(validateCurrentPage()){ collectCurrentPage(); CUR++; renderPage(); } };
  if (finishBtn) finishBtn.onclick = ()=>{ if(validateCurrentPage()){ collectCurrentPage(); finishQuiz(); } };
}

function validateCurrentPage(){
  const data=PAGES_DATA[CUR]||[];
  for(const q of data){
    if(!document.querySelector(`input[name="q${q.id}"]:checked`)) return false;
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
  location.href = '../result/?s='+b64; // 폴더명 result(단수) 주의
}
function pickPerc(d){ return {
  lp_all:Math.round(d.lp_all), np_all:Math.round(d.np_all), rp_all:Math.round(d.rp_all)
}; }

/* ===== 채점/타이틀 ===== */
function score(){
  const sums={M:{left:0,right:0,neutral:0},E:{left:0,right:0,neutral:0},L:{left:0,right:0,neutral:0},P:{left:0,right:0,neutral:0}};
  ORDERED.forEach(q=>{
    const has = Object.prototype.hasOwnProperty.call(ANSWERS,q.id);
    if(!has) return; // 미응답 제외
    const v=ANSWERS[q.id]; const f=RESP[v];
    q.effects.forEach(e=>{
      const lr=sideToLR(e.axis,e.side); const opp=(lr==='left'?'right':'left');
      if (v===3) sums[e.axis].neutral += 1.0*e.w*q.S;
      else if (f>0) sums[e.axis][lr] += f*e.w*q.S;
      else sums[e.axis][opp] += Math.abs(f)*e.w*q.S;
    });
  });
  const out={};
  Object.keys(sums).forEach(axis=>{
    const {left,right,neutral}=sums[axis];
    const sumAll=left+right+neutral, totalLR=left+right;
    const lp_all=sumAll?round1(left/sumAll*100):0;
    const np_all=sumAll?round1(neutral/sumAll*100):0;
    const rp_all=sumAll?round1(right/sumAll*100):0;
    let lp_lr=50,rp_lr=50;
    if (totalLR>0){ lp_lr=round1(left/totalLR*100); rp_lr=round1(right/totalLR*100); }
    out[axis]={lp_all,np_all,rp_all,lp_lr,rp_lr};
  });
  return out;
}
function round1(x){ return Math.round(x*10)/10; }

function decideSide(d){
  const neutral = d.np_all;
  const diff = Math.abs(d.lp_all - d.rp_all);
  const isMiddle = (neutral < 21 && diff < 7) || (neutral >= 21 && diff < 14);
  if (isMiddle) return '중도';
  return d.lp_all >= d.rp_all ? '좌' : '우';
}
function buildResultTitle(s){
  const m=decideSide(s.M), e=decideSide(s.E), l=decideSide(s.L), p=decideSide(s.P);
  const mprefix = (m==='좌') ? '반마법' : (m==='우') ? '친마법' : '마법중립';
  if (m==='중도' && e==='중도' && l==='중도' && p==='중도') return '극단적 중도주의';
  const key=`${e}-${l}-${p}`; return `${mprefix} · ${(NAME_MAP[key]||'중도주의(임시)')}`;
}

/* ===== 결과 렌더 ===== */
function renderResults(payload){
  const chip=document.getElementById('stageChip'); if(chip) chip.textContent='결과';
  const s = payload || (console.warn('공유 파라미터 없음 — 빈 렌더 시도'), score());
  const el=document.getElementById('results'); if(!el) return;
  el.innerHTML='';
  const order=['M','E','L','P'];

  const title = buildResultTitle(s);
  const head = document.createElement('div');
  head.className='card';
  // 축별 비율(좌/중립/우)과 좌·우만 비교한 백분율을 함께 보여준다.
  head.innerHTML = `<h2 style="margin:0 0 6px">${title}</h2>`;
  el.appendChild(head);

  order.forEach(axis=>{
    const meta=AXES[axis], d=s[axis];
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`
      <h3>${axis} — <b>${meta.left}</b> vs <b>${meta.right}</b></h3>
      <div class="barrow">
        <div class="baroverlay">
          <div class="cell" style="width:${d.lp_all}%">${d.lp_all?`${d.lp_all}%`:''}</div>
          <div class="cell" style="width:${d.np_all}%"><span style="color:#111">${d.np_all?`${d.np_all}%`:''}</span></div>
          <div class="cell" style="width:${d.rp_all}%">${d.rp_all?`${d.rp_all}%`:''}</div>
        </div>
      </div>
      <div class="barlbl"><span>${meta.left}</span><span>${meta.right}</span></div>`;
    el.appendChild(card);
  });

  const act=document.getElementById('resultsActions'); if(act) act.classList.remove('hidden');
}

/* ===== 자동 부팅 ===== */
document.addEventListener('DOMContentLoaded', ()=>{
  const isQuiz   = !!document.getElementById('quizWrap');
  const isResult = !!document.getElementById('results');

  if (isQuiz){
    initQuiz();
    const finish=document.getElementById('finishBtn');
    if (finish){
      finish.addEventListener('click',(ev)=>{
        ev.preventDefault();
        if (!validateCurrentPage()) return;
        collectCurrentPage();
        finishQuiz();
      });
    }
    const prev=document.getElementById('prevBtn');
    if (prev) prev.addEventListener('click',e=>e.preventDefault());
    const next=document.getElementById('nextBtn');
    if (next) next.addEventListener('click',e=>e.preventDefault());
  }

  if (isResult){
    const sp=new URLSearchParams(location.search);
    const b64=sp.get('s'); let data=null;
    if (b64){ try{ data=JSON.parse(decodeURIComponent(escape(atob(b64)))); }catch(_){ data=null; } }
    renderResults(data||undefined);
    const rb=document.getElementById('restartBtn');
    if (rb) rb.onclick=()=>location.href='../';
  }
});
