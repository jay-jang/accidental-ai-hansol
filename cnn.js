/* Small, deterministic CNN calculations used by the teaching controls. */
(()=>{
const kernels={vertical:[-1,0,1,-1,0,1,-1,0,1],horizontal:[-1,-1,-1,0,0,0,1,1,1]};
function convolve(input,size,kernel,stride=1){
 const width=Math.floor((size-3)/stride)+1,values=[];
 for(let y=0;y<width;y++)for(let x=0;x<width;x++){
  let value=0;for(let j=0;j<3;j++)for(let i=0;i<3;i++)value+=input[(y*stride+j)*size+x*stride+i]*kernel[j*3+i];
  values.push(value);
 }return {values,width};
}
function pool(input,size,method='max'){
 const width=Math.floor(size/2),values=[];
 for(let y=0;y<width;y++)for(let x=0;x<width;x++){
  const v=[input[y*2*size+x*2],input[y*2*size+x*2+1],input[(y*2+1)*size+x*2],input[(y*2+1)*size+x*2+1]];
  values.push(method==='max'?Math.max(...v):v.reduce((a,b)=>a+b,0)/4);
 }return {values,width};
}
const citation='<div class="source"><a href="https://cs231n.github.io/convolutional-networks/" target="_blank" rel="noopener noreferrer">Stanford CS231n · 합성곱과 풀링 ↗</a></div>';
function addSlides(insertAfter,split,lab){
 insertAfter('deep','cnn-filter','02 / CNN · 2/4 · Filter','필터는 작은 숫자 창입니다.',
 `<p class="lead">같은 위치의 숫자를 곱하고, 아홉 개를 더합니다. 창을 옮겨 반복하면 <strong>특징 맵</strong>이 됩니다.</p><div class="cnn-controls row"><label>필터<select id="cnn-kernel"><option value="vertical">세로 경계</option><option value="horizontal">가로 경계</option></select></label><label>한 번에 이동할 칸 · Stride<select id="cnn-stride"><option value="1">1칸</option><option value="2">2칸</option></select></label><button id="cnn-prev">이전 위치</button><button id="cnn-next">다음 위치</button><button id="cnn-reset">기본 이미지</button></div><div class="cnn-matrices"><div><h3>입력 · 6 × 6</h3><div id="cnn-input"></div><p class="small">칸을 눌러 0 ↔ 1</p></div><div><h3>필터 · 3 × 3</h3><div id="cnn-weights"></div><p class="small">숫자는 패턴에 반응하는 가중치</p></div><div><h3 id="cnn-map-title">특징 맵</h3><div id="cnn-map"></div><p class="small">결과 칸을 누르면 계산 위치 이동</p></div></div><div id="cnn-calculation" class="cnn-equation" aria-live="polite"></div><p class="small">이 실험은 테두리를 채우지 않습니다(Padding 0). 음수도 그대로 표시합니다. 필터를 뒤집지 않는 CNN 연산이며 편향은 0으로 둡니다.</p>${citation}`,
 '3분. 오른쪽 특징 맵의 첫 칸을 고르고 아홉 개의 곱을 읽습니다. 같은 필터를 다음 위치로 옮기는 가중치 공유를 설명하세요. 세로 경계 필터를 가로 경계로 바꾸면 반응이 달라집니다. Stride 1에서는 (6−3)/1+1=4, Stride 2에서는 floor((6−3)/2)+1=2입니다. 사람이 정한 필터로 계산 원리만 보며 학습은 다음 설명에서 구분합니다.');
 insertAfter('cnn-filter','cnn-pooling','02 / CNN · 3/4 · Pooling','네 칸을 한 칸으로 요약하면?',
 `<p class="lead"><strong>Max Pooling</strong>은 가장 큰 반응을, <strong>Average Pooling</strong>은 평균 반응을 남깁니다.</p><div class="cnn-controls row"><label>요약 방법<select id="cnn-pool-method"><option value="max">Max · 최댓값</option><option value="average">Average · 평균</option></select></label><button id="cnn-pool-example">숫자 예제로 초기화</button><button id="cnn-pool-filter">앞 장의 필터 결과 가져오기</button><button id="cnn-pool-next">다음 묶음</button></div><div class="cnn-pool-layout"><div><h3>특징 맵 · 4 × 4</h3><div id="cnn-pool-input"></div><p class="small" id="cnn-pool-origin">설명용 숫자 예제 · 누르면 값 변경</p></div><div class="cnn-pool-rule"><strong>2 × 2 창<br>2칸씩 이동</strong><p>16개 → 4개<br>가로·세로는 절반</p></div><div><h3>요약 맵 · 2 × 2</h3><div id="cnn-pool-output"></div><div id="cnn-pool-calculation" class="cnn-equation" aria-live="polite"></div></div></div><p class="small">작은 위치 변화의 영향을 줄일 수 있지만, 정확한 위치와 일부 정보는 잃습니다. 최댓값·평균 풀링 자체에는 학습할 가중치가 없습니다.</p>${citation}`,
 '3분. 첫 묶음 1,3,0,2의 최댓값 3과 평균 1.5를 비교합니다. 값을 바꿔 2×2 출력이 무엇을 잃는지 물어보세요. 필터 결과 가져오기는 앞 장의 현재 이미지와 필터를 Stride 1로 계산한 뒤 ReLU를 적용합니다. Pooling은 사진의 단순 축소와 목적이 다르며 작은 이동에도 결과가 항상 같다는 뜻은 아닙니다.');
 insertAfter('cnn-pooling','cnn-flow','02 / CNN · 4/4 · 전체 흐름','찾고, 통과시키고, 요약합니다.',
 split(`<p class="lead">앞 장에서 만든 이미지가<br>CNN의 작은 블록을 통과합니다.</p><p><strong>Filter</strong>로 반응을 계산하고, <strong>ReLU</strong>로 음수를 0으로 바꾼 뒤, <strong>Pooling</strong>으로 요약합니다.</p><p>실제 CNN은 여러 필터와 층을 함께 학습합니다. 초기 층의 경계·질감에서 더 복잡한 특징으로 이어질 수 있습니다.</p><p class="small">필터 숫자는 예측 오차를 줄이도록 학습으로 조정됩니다. 여기서는 고정 필터 하나의 순전파만 계산하며, 사물 분류나 학습은 하지 않습니다. 모든 CNN이 풀링을 사용하는 것은 아닙니다.</p>${citation}`,
 lab('CNN / 단계별 실제 계산',`<div class="cnn-stages" role="group" aria-label="CNN 계산 단계"><button data-cnn-stage="0" aria-pressed="true">① 입력</button><button data-cnn-stage="1" aria-pressed="false">② Filter</button><button data-cnn-stage="2" aria-pressed="false">③ ReLU</button><button data-cnn-stage="3" aria-pressed="false">④ Pooling</button></div><h3 id="cnn-flow-title"></h3><div id="cnn-flow-grid"></div><p id="cnn-flow-description" class="small" aria-live="polite"></p><p class="small">6 × 6 → 4 × 4 → 4 × 4 → 2 × 2<br>필터 이동 1칸 · Padding 0 · Max Pooling</p>`)),
 '2분. 네 단계를 차례로 누르고 ReLU에서만 음수가 0으로 바뀜을 확인하세요. Filter는 무엇에 반응할지, Pooling은 어떻게 요약할지라는 차이를 학생 말로 설명하게 합니다. 실제 여러 필터는 여러 특징 맵을 만들고 분류층이 이를 사용합니다. 눈·귀 같은 특징을 반드시 특정 층이 담당한다고 단정하지 마세요.');
}
function init(){
 const $=s=>document.querySelector(s);
 let input=Array.from({length:36},(_,i)=>+(i%6>2)),position=0,block=0,stage=0;
 let poolInput=[1,3,2,0,0,2,4,1,5,1,0,2,2,6,1,3];
 const fmt=n=>Number.isInteger(n)?String(n):n.toFixed(2).replace(/0+$/,'');
 function matrix(el,values,size,selected=[],action){
  el.style.setProperty('--cnn-columns',size);el.className='cnn-grid';
  el.innerHTML=values.map((v,i)=>{const hit=selected.includes(i),attrs=`class="cnn-cell${hit?' is-selected':''}${v<0?' is-negative':''}"`;
   const label=`${Math.floor(i/size)+1}행 ${i%size+1}열, ${fmt(v)}`;
   return action?`<button ${attrs} type="button" data-cell="${i}" aria-label="${label}" aria-pressed="${hit}">${fmt(v)}</button>`:`<span ${attrs} aria-label="${label}">${fmt(v)}</span>`;
  }).join('');if(action)el.querySelectorAll('button').forEach(b=>b.onclick=()=>action(+b.dataset.cell));
 }
 const kernel=()=>kernels[$('#cnn-kernel').value];
 function renderFilter(){
  const stride=+$('#cnn-stride').value,result=convolve(input,6,kernel(),stride);position=Math.min(position,result.values.length-1);
  const y=Math.floor(position/result.width)*stride,x=position%result.width*stride,patch=[];
  for(let j=0;j<3;j++)for(let i=0;i<3;i++)patch.push((y+j)*6+x+i);
  matrix($('#cnn-input'),input,6,patch,i=>{input[i]=1-input[i];renderFilter();renderFlow();});
  matrix($('#cnn-weights'),kernel(),3);
  matrix($('#cnn-map'),result.values,result.width,[position],i=>{position=i;renderFilter();});
  $('#cnn-map-title').textContent=`특징 맵 · ${result.width} × ${result.width}`;
  const rows=[0,1,2].map(row=>patch.slice(row*3,row*3+3).map((index,k)=>`${input[index]} × (${kernel()[row*3+k]})`).join(' + '));
  $('#cnn-calculation').innerHTML=`<span>선택 위치 ${Math.floor(position/result.width)+1}행 ${position%result.width+1}열 · 곱한 뒤 더하기</span><div class="cnn-sums">${rows.map(r=>`<span>${r}</span>`).join('')}</div><strong>합계 = ${fmt(result.values[position])}</strong>`;
  $('#cnn-prev').disabled=position===0;$('#cnn-next').disabled=position===result.values.length-1;
 }
 function renderPool(){
  const method=$('#cnn-pool-method').value,result=pool(poolInput,4,method),y=Math.floor(block/2)*2,x=block%2*2,indices=[y*4+x,y*4+x+1,(y+1)*4+x,(y+1)*4+x+1];
  matrix($('#cnn-pool-input'),poolInput,4,indices,i=>{poolInput[i]=(poolInput[i]+1)%10;$('#cnn-pool-origin').textContent='직접 수정한 특징 맵 · 누르면 값 변경';renderPool();});
  matrix($('#cnn-pool-output'),result.values,2,[block],i=>{block=i;renderPool();});
  const values=indices.map(i=>poolInput[i]);
  $('#cnn-pool-calculation').textContent=method==='max'?`max(${values.join(', ')}) = ${fmt(result.values[block])}`:`(${values.join(' + ')}) ÷ 4 = ${fmt(result.values[block])}`;
 }
 function renderFlow(){
  const conv=convolve(input,6,kernel()),relu=conv.values.map(v=>Math.max(0,v)),pooled=pool(relu,4),items=[
   {values:input,width:6,title:'① 입력 · 6 × 6',description:'각 칸은 픽셀의 값입니다. 필터 장에서 바꾼 이미지를 그대로 사용합니다.'},
   {...conv,title:'② Filter · 4 × 4',description:'같은 3 × 3 필터를 한 칸씩 옮겨 곱하고 더합니다. 음수는 반대 방향의 반응일 수 있습니다.'},
   {values:relu,width:4,title:'③ ReLU · 4 × 4',description:'각 값에 max(0, 값)을 적용합니다. 음수는 0이 되고 양수는 그대로 남습니다.'},
   {...pooled,title:'④ Max Pooling · 2 × 2',description:'2 × 2 묶음의 최댓값만 남깁니다. 가중치를 곱하는 필터와 달리 정해진 요약 규칙입니다.'}
  ],item=items[stage];
  matrix($('#cnn-flow-grid'),item.values,item.width);$('#cnn-flow-title').textContent=item.title;$('#cnn-flow-description').textContent=item.description;
  document.querySelectorAll('[data-cnn-stage]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.cnnStage===stage));
 }
 $('#cnn-kernel').onchange=()=>{position=0;renderFilter();renderFlow();};$('#cnn-stride').onchange=()=>{position=0;renderFilter();};
 $('#cnn-prev').onclick=()=>{position--;renderFilter();};$('#cnn-next').onclick=()=>{position++;renderFilter();};
 $('#cnn-reset').onclick=()=>{input=Array.from({length:36},(_,i)=>+(i%6>2));position=0;renderFilter();renderFlow();};
 $('#cnn-pool-method').onchange=renderPool;
 $('#cnn-pool-next').onclick=()=>{block=(block+1)%4;renderPool();};
 $('#cnn-pool-example').onclick=()=>{poolInput=[1,3,2,0,0,2,4,1,5,1,0,2,2,6,1,3];block=0;$('#cnn-pool-origin').textContent='설명용 숫자 예제 · 누르면 값 변경';renderPool();};
 $('#cnn-pool-filter').onclick=()=>{poolInput=convolve(input,6,kernel()).values.map(v=>Math.max(0,v));block=0;$('#cnn-pool-origin').textContent='앞 장의 현재 필터 · Stride 1 + ReLU로 가져온 값';renderPool();};
 document.querySelectorAll('[data-cnn-stage]').forEach(b=>b.onclick=()=>{stage=+b.dataset.cnnStage;renderFlow();});
 renderFilter();renderPool();renderFlow();
}
globalThis.CNN={convolve,pool,kernels,addSlides,init};
})();
