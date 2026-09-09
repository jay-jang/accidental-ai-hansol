(()=>{
const goSource='<div class="source"><a href="https://deepmind.google/research/alphago/" target="_blank" rel="noopener noreferrer">Google DeepMind · AlphaGo ↗</a></div>';
function addSlides(sections,insertAfter,split,lab){
 insertAfter('reinforcement','alphago-search','02 / AlphaGo · 바둑판으로 이해하기','유망한 수를 고르고, 앞을 읽습니다.',
 split(`<div class="example-stages" role="group" aria-label="AlphaGo 설명 단계"><button data-go-stage="0" aria-pressed="true">① 후보 찾기</button><button data-go-stage="1" aria-pressed="false">② 형세 평가</button><button data-go-stage="2" aria-pressed="false">③ 탐색 후 선택</button></div><div id="go-board" class="go-board"></div><div class="row"><button data-go-choice="0" aria-pressed="true">A 보기</button><button data-go-choice="1" aria-pressed="false">B 보기</button><button data-go-choice="2" aria-pressed="false">C 보기</button></div>`,
 `<h3 id="go-explain-title"></h3><p id="go-explain" class="lead" aria-live="polite"></p><div id="go-search-tree"></div><p class="small">2016년 AlphaGo는 인간 기보 학습과 자기 대국 학습을 사용했습니다. 정책망·가치망에 탐색을 결합합니다.</p><p class="small">9×9 바둑판·후보·평가는 원리 설명을 위해 만든 예입니다. 실제 대국 기보, 신경망 예측, MCTS 실행 결과가 아닙니다.</p>${goSource}`),
 '2분. 바둑을 모르는 학생에게도 A/B/C가 다음 흑돌 후보라는 것만 알려줍니다. 정책망은 어디를 볼지, 가치망은 형세가 어떤지, 탐색은 상대 응수까지 살피는 역할입니다. A가 처음 유망해 보여도 탐색 후 B를 택할 수 있는 예를 보여줍니다. 실제 AlphaGo에는 더 많은 구성 요소가 있고 화면의 단순 트리는 MCTS를 계산하지 않습니다.');
 const diffusion=sections.find(s=>s.id==='diffusion');
 diffusion.title='그림에 잡음을 넣으면 어떻게 될까요?';
 diffusion.body=split(`<p class="lead">학습할 때는 깨끗한 이미지에 잡음을 섞어, 신경망이 잡음 등을 예측하도록 연습합니다.</p><p>슬라이더를 움직이면 같은 책상 그림이 점점 잡음에 묻힙니다. 모델은 다양한 이미지와 잡음 단계로 학습합니다.</p><p class="small">여기서는 원본을 알고 잡음을 더합니다. 슬라이더를 되돌리는 것은 생성 모델 실행이 아닙니다. 실제 생성 과정은 다음 장에서 구분합니다.</p><div class="source"><a href="https://arxiv.org/abs/2006.11239" target="_blank" rel="noopener noreferrer">Ho 외 · DDPM (2020) ↗</a></div>`,
 lab('이미지 실험 / 학습 입력에 잡음 더하기',`<div class="diffusion-pair"><figure><img src="assets/learning-daylight.png" alt="원본 예시: 햇빛이 드는 책상" width="1536" height="1024"><figcaption>원본 예시 · 생성 일러스트</figcaption></figure><figure><canvas id="diffusion-canvas" width="288" height="192" role="img" aria-label="책상 그림에 단계별 가우시안 잡음을 추가한 결과"></canvas><figcaption id="diffusion-label">잡음 0%</figcaption></figure></div><label>잡음 비중 <output id="diffusion-amount">0%</output><input type="range" id="diffusion-noise" min="0" max="100" value="0"></label><div class="row"><button data-noise="0">원본</button><button data-noise="50">중간</button><button data-noise="100">잡음만</button></div><p class="small">픽셀 신호와 가우시안 잡음을 제곱근 비율로 혼합합니다. 화면에 표시할 때 범위를 벗어난 값은 잘라냅니다.</p>`));
 diffusion.note='1분. 원본 → 중간 → 잡음만을 눌러 입력이 바뀌는 것을 봅니다. 역방향 슬라이더는 숨겨진 원본을 드러내지만 실제 생성 모델은 그렇게 작동하지 않는다고 구분하세요. 다음 장에서 학습된 모델의 실제 샘플을 봅니다.';
 insertAfter('diffusion','diffusion-generation','02 / Diffusion · 생성 과정과 실제 결과','잡음에서, 새로운 이미지로.',
 `<div class="example-stages" role="group" aria-label="확산 모델 설명 보기"><button data-diffusion-view="0" aria-pressed="true">① 학습 · 잡음을 더하기</button><button data-diffusion-view="1" aria-pressed="false">② 생성 · 잡음에서 시작</button><button data-diffusion-view="2" aria-pressed="false">③ 실제 생성 결과</button></div><figure class="ddpm-figure"><a id="ddpm-image-link" href="assets/research/ddpm-process.png" target="_blank" rel="noopener noreferrer"><img id="ddpm-image" src="assets/research/ddpm-process.png" alt="DDPM 과정 설명도: 왼쪽 잡음에서 오른쪽 이미지로 가는 생성 방향과 그 반대의 잡음 추가 방향"></a><figcaption id="ddpm-caption">Ho·Jain·Abbeel (2020) · 과정 설명도</figcaption></figure><div class="ddpm-explanation"><h3 id="ddpm-title"></h3><p id="ddpm-description" class="lead" aria-live="polite"></p></div><p class="small">생성할 때는 정답 원본을 꺼내 보는 것이 아닙니다. 학습한 분포를 바탕으로 새 이미지를 만듭니다. 아래 자료는 텍스트 조건 없이 생성한 초기 DDPM 예시입니다.</p><div class="source"><a href="https://hojonathanho.github.io/diffusion/" target="_blank" rel="noopener noreferrer">DDPM 연구진의 공식 자료 · 원본 그림과 생성 예시 ↗</a></div>`,
 '2분. 첫 버튼은 학습 입력을 만드는 방향(오른쪽 원본에서 왼쪽 잡음), 둘째는 생성 방향(왼쪽 잡음에서 오른쪽 이미지)입니다. 과정 그림은 설명도이며 실제 시간별 생성 프레임이 아닙니다. 세 번째는 논문 저자가 공개한 실제 생성 이미지 모음입니다. 이 자료만으로 실시간 생성이나 이미지별 잡음 제거 과정을 보여준다고 말하지 마세요. 오늘날 텍스트 조건 모델은 별도의 조건 정보를 사용할 수 있지만 이 DDPM 예시는 무조건부입니다.');

}
function init(){
 const $=s=>document.querySelector(s),candidates=[[4,3],[5,5],[2,6]],stones=[[2,2,1],[3,2,0],[2,3,0],[4,4,1],[5,4,0],[6,6,1],[6,5,0],[3,5,1]];
 let stage=0,choice=0;
 const explanations=[['정책망 · 어디를 먼저 볼까?','바둑판의 패턴을 보고 유망한 후보 수를 좁힙니다. 이 예에서는 A를 먼저 살펴봅니다.'],['가치망 · 이 형세는 유리할까?','돌을 놓은 뒤의 형세를 평가합니다. 지금 당장 돌을 많이 잡는 것과 마지막에 이기는 것은 다릅니다.'],['탐색 · 상대가 이렇게 응수한다면?','상대 응수와 그다음 수를 살피며 평가를 모읍니다. 이 설명용 예에서는 탐색 뒤 B를 선택합니다.']];
 function board(){
  const pos=n=>28+n*36;let s='<svg viewBox="0 0 344 344" role="img" aria-label="설명용 9 곱하기 9 바둑판. A B C는 흑의 다음 수 후보입니다."><rect width="344" height="344" rx="12" fill="#eee0c3"/>';
  for(let i=0;i<9;i++)s+=`<path d="M28 ${pos(i)}H316 M${pos(i)} 28V316" stroke="#8d8069" stroke-width="1"/>`;
  for(const[x,y,black]of stones)s+=`<circle cx="${pos(x)}" cy="${pos(y)}" r="14" fill="${black?'#21333c':'#fff'}" stroke="#4d5b60"/>`;
  candidates.forEach(([x,y],i)=>{s+=`<circle cx="${pos(x)}" cy="${pos(y)}" r="15" fill="${i===choice?'#256783':'#fff'}" stroke="#256783" stroke-width="2"/><text x="${pos(x)}" y="${pos(y)+6}" text-anchor="middle" fill="${i===choice?'#fff':'#256783'}" font-size="19" font-family="Arial">${'ABC'[i]}</text>`;});
  s+='</svg>';$('#go-board').innerHTML=s;
  $('#go-explain-title').textContent=explanations[stage][0];$('#go-explain').textContent=explanations[stage][1];
  const name='ABC'[choice],detail=stage===0?'먼저 볼 후보':stage===1?'이후 형세를 평가':'상대의 응수 두 가지도 살펴보기';
  $('#go-search-tree').innerHTML=stage<2?`<div class="go-summary"><strong>선택한 후보 ${name}</strong><p>${detail}</p></div>`:`<svg viewBox="0 0 440 190" role="img" aria-label="후보 ${name} 뒤 상대 응수 두 가지를 살펴보는 설명용 탐색 그림"><path d="M220 48L100 112M220 48L340 112" fill="none" stroke="#7397aa" stroke-width="2"/><rect x="155" y="12" width="130" height="46" rx="8" fill="#d5e9f1"/><text x="220" y="42" text-anchor="middle" font-size="22" fill="#173f52">후보 ${name}</text><rect x="30" y="108" width="140" height="48" rx="8" fill="#e9eef0"/><rect x="270" y="108" width="140" height="48" rx="8" fill="#e9eef0"/><text x="100" y="140" text-anchor="middle" font-size="20" fill="#182b3b">상대 응수 ①</text><text x="340" y="140" text-anchor="middle" font-size="20" fill="#182b3b">상대 응수 ②</text><text x="220" y="184" text-anchor="middle" font-size="17" fill="#526675">각 형세를 평가하고 탐색 결과를 모읍니다</text></svg>`;
  document.querySelectorAll('[data-go-stage]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.goStage===stage));document.querySelectorAll('[data-go-choice]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.goChoice===choice));
 }
 document.querySelectorAll('[data-go-stage]').forEach(b=>b.onclick=()=>{stage=+b.dataset.goStage;choice=stage===2?1:0;board();});
 document.querySelectorAll('[data-go-choice]').forEach(b=>b.onclick=()=>{choice=+b.dataset.goChoice;board();});board();
 const canvas=$('#diffusion-canvas'),ctx=canvas.getContext('2d'),image=new Image();let original;
 let seed=912;const random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return(seed+.5)/4294967296;};
 const noise=Array.from({length:canvas.width*canvas.height*3},()=>Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random()));
 function draw(){if(!original)return;const amount=+$('#diffusion-noise').value/100,output=ctx.createImageData(canvas.width,canvas.height);for(let i=0;i<canvas.width*canvas.height;i++){for(let channel=0;channel<3;channel++){const signal=original.data[i*4+channel]/127.5-1;const mixed=Math.sqrt(1-amount)*signal+Math.sqrt(amount)*noise[i*3+channel];output.data[i*4+channel]=Math.max(0,Math.min(255,(mixed+1)*127.5));}output.data[i*4+3]=255;}ctx.putImageData(output,0,0);$('#diffusion-label').textContent=amount===1?'잡음만 · 원본 신호 0%':`잡음 비중 ${Math.round(amount*100)}%`;$('#diffusion-amount').textContent=Math.round(amount*100)+'%';}
 const views=[
  ['학습 입력 · 이미지 → 잡음','그림의 오른쪽 이미지에서 출발해 잡음을 더합니다. 신경망은 다양한 잡음 단계에서 잡음 등을 예측하도록 학습합니다.','ddpm-process.png','과정 설명도 · 점선은 잡음을 더하는 방향'],
  ['생성 · 잡음 → 여러 번의 예측 → 이미지','그림의 왼쪽 잡음에서 출발합니다. 학습된 신경망의 예측으로 샘플을 반복 갱신해 오른쪽과 같은 이미지를 만듭니다.','ddpm-process.png','과정 설명도 · 실선은 생성 방향 · 실제 생성 프레임 기록은 아닙니다'],
  ['연구진이 공개한 생성 결과','얼굴·침실·건물·동물 등 실제 DDPM의 생성 예시입니다. 한 장이 만들어지는 중간 단계가 아니라, 완성된 여러 샘플을 모았습니다.','ddpm-samples.png','실제 모델 생성 결과 모음 · Ho·Jain·Abbeel (2020)']
 ];
 function showDiffusion(index){const [title,description,file,caption]=views[index];$('#ddpm-title').textContent=title;$('#ddpm-description').textContent=description;$('#ddpm-image').src='assets/research/'+file;$('#ddpm-image-link').href='assets/research/'+file;$('#ddpm-image').alt=caption;$('#ddpm-caption').textContent=caption;document.querySelectorAll('[data-diffusion-view]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.diffusionView===index));}
 document.querySelectorAll('[data-diffusion-view]').forEach(b=>b.onclick=()=>showDiffusion(+b.dataset.diffusionView));showDiffusion(0);
 image.onload=()=>{ctx.drawImage(image,0,0,canvas.width,canvas.height);original=ctx.getImageData(0,0,canvas.width,canvas.height);draw();};image.onerror=()=>{$('#diffusion-label').textContent='이미지를 불러오지 못했습니다. 새로고침해 주세요.';};image.src='assets/learning-daylight.png';
 $('#diffusion-noise').oninput=draw;document.querySelectorAll('[data-noise]').forEach(b=>b.onclick=()=>{$('#diffusion-noise').value=b.dataset.noise;draw();});
}
globalThis.VisualExamples={addSlides,init};
})();
