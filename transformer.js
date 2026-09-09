(()=>{
const source='<div class="source"><a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener noreferrer">Vaswani 외 · Attention Is All You Need ↗</a></div>';
function attention(query,keys,values){const scores=keys.map(key=>key.reduce((n,v,i)=>n+v*query[i],0)/Math.sqrt(query.length));const max=Math.max(...scores),exps=scores.map(s=>Math.exp(s-max)),sum=exps.reduce((a,b)=>a+b,0),weights=exps.map(e=>e/sum);return {scores,weights,output:values[0].map((_,j)=>values.reduce((n,v,i)=>n+v[j]*weights[i],0))};}
const allowed=(row,col,causal)=>!causal||col<=row;
function addSlides(sections,insertAfter,split,lab){
 insertAfter('reward','transformer-tokens','02 / Transformer · 1/4 · 토큰과 순서','문장을 조각으로, 순서도 정보로.',
 split(`<p class="lead">같은 단어라도 순서가 바뀌면<br>누가 누구를 쫓는지 달라집니다.</p><p>텍스트를 <strong>토큰</strong>으로 나누고, 각 토큰을 숫자 벡터로 표현합니다. 순서 정보도 모델에 전달합니다.</p><p class="small">토큰은 단어·단어 일부·문장부호 등이 될 수 있습니다. 아래 분할은 설명용이며 특정 모델의 실제 토크나이저 출력은 아닙니다.</p>${source}`,lab('예제 / 단어와 순서 비교',`<div class="row"><button id="tr-order" aria-pressed="false">쫓는 주체 바꾸기</button><button id="tr-pieces" aria-pressed="false">더 작은 조각 보기</button></div><p id="tr-sentence" class="output"></p><div id="tr-tokens" class="tr-token-strip"></div><p id="tr-meaning" aria-live="polite"></p><p class="small">각 조각 아래 숫자는 위치입니다. 토큰 벡터와 위치 정보는 서로 다른 역할을 합니다.</p>`)),
 '1분. The dog chased the cat과 The cat chased the dog를 비교하세요. 단어 목록은 같지만 순서가 달라 주체와 대상이 바뀝니다. 더 작은 조각은 토큰이 단어와 일치하지 않을 수 있음을 보여주는 임의 분할입니다. 실제 모델에서는 학습된 토큰 임베딩과 위치 인코딩 또는 상대 위치 방식 등을 씁니다.');
 const context=sections.find(s=>s.id==='attention');context.kicker='02 / Transformer · 2/4 · 문맥 참고';
 insertAfter('attention','transformer-qkv','02 / Transformer · 3/4 · Q · K · V','얼마나 참고할지, 숫자로 계산합니다.',
 `<p class="lead"><strong>Q</strong>는 찾는 정보, <strong>K</strong>는 비교할 단서, <strong>V</strong>는 가져올 정보입니다.</p><div class="tr-qkv-layout"><div><label>찾는 단서 바꾸기 · 금융 ↔ 식물<input id="tr-query" type="range" min="0" max="100" value="0"></label><div id="tr-query-vector" class="tr-vector"></div><p class="small">두 축은 설명용입니다. 실제 벡터의 각 차원이 이렇게 이름 붙은 의미를 갖는 것은 아닙니다.</p></div><div><div id="tr-qkv-rows"></div></div></div><div id="tr-weighted-output" class="cnn-equation" aria-live="polite"></div><p class="small">점수 = Q·K ÷ √2 → softmax로 비중 만들기 → V의 가중합. 주어진 작은 벡터로 실제 계산하지만, 벡터 자체는 사람이 정한 예시입니다. 다음 단어의 확률이 아니라 정보를 섞는 비중입니다.</p>${source}`,
 '2분. Q를 바꾸면 돈·대출·잎의 점수와 비중이 어떻게 달라지는지 확인하세요. 점수는 유사도를 나타내고 softmax 비중의 합은 1입니다. Value가 가중합되어 출력 벡터가 됩니다. 실제 self-attention은 같은 입력 표현에서 학습된 변환으로 Q/K/V를 만들며 여러 head와 MLP·잔차 연결 등을 함께 사용합니다.');
 insertAfter('transformer-qkv','transformer-mask','02 / Transformer · 4/4 · 마스킹','다음 말을 맞힐 때, 뒤를 가립니다.',
 split(`<p class="lead">“나는 오늘 학교에 …”<br>다음 토큰을 예측한다면?</p><p>자동회귀 생성 모델의 <strong>causal mask</strong>는 뒤에 나올 토큰을 참고하지 못하게 합니다.</p><p class="small">양방향 인코더는 양쪽 문맥을 참고할 수 있습니다. Transformer가 모두 같은 마스크를 사용하는 것은 아닙니다.</p><p class="small">학습 때는 마스크를 적용해 여러 위치를 병렬로 계산할 수 있지만, 일반적인 생성은 새 토큰을 하나씩 이어 갑니다.</p>${source}`,lab('예제 / 참고할 수 있는 위치',`<label>모델 방식<select id="tr-mask-mode"><option value="causal">다음 토큰 생성 · 뒤쪽 가리기</option><option value="bidirectional">양방향 인코더 · 양쪽 문맥</option></select></label><label>지금 읽는 위치<input id="tr-mask-position" type="range" min="0" max="4" value="2"></label><div id="tr-mask-grid" class="tr-mask-grid"></div><div id="tr-mask-caption" class="tr-mask-caption" aria-live="polite"></div><p class="small">행: 읽는 위치 · 열: 참고할 위치<br>● 참고 가능 · × 가림 · 실제 attention 비중 표는 아닙니다.</p>`)),
 '1분. 학교에 행을 고르면 나는/오늘/학교에까지 참고하고 가서/공부했다는 가립니다. 화면에는 교육 목적으로 전체 정답 문장이 보이지만 모델에는 가려진 위치의 정보가 전달되지 않습니다. 인코더 방식으로 바꾸면 양쪽 문맥을 참고할 수 있음을 봅니다. 이 표는 허용 여부이며 실제 attention 강도를 나타내지 않습니다.');
}
function init(){
 const $=s=>document.querySelector(s);let swapped=false,pieces=false;
 function tokens(){const words=swapped?['The','cat','chased','the','dog']:['The','dog','chased','the','cat'];const units=pieces?words.flatMap(w=>w==='chased'?['chase','d']:[w]):words;$('#tr-sentence').textContent=words.join(' ');$('#tr-tokens').innerHTML=units.map((word,i)=>`<div><strong>${word}</strong><span>위치 ${i+1}</span></div>`).join('');$('#tr-meaning').textContent=swapped?'고양이가 개를 쫓았다.':'개가 고양이를 쫓았다.';$('#tr-order').setAttribute('aria-pressed',swapped);$('#tr-pieces').setAttribute('aria-pressed',pieces);}
 $('#tr-order').onclick=()=>{swapped=!swapped;tokens();};$('#tr-pieces').onclick=()=>{pieces=!pieces;tokens();};tokens();
 const keys=[[2,0],[1.5,.2],[0,2]],values=[[1,0],[.8,.1],[0,1]],names=['돈','대출','잎'];
 function calculate(){const t=+$('#tr-query').value/100,q=[1-t,t],r=attention(q,keys,values);$('#tr-query-vector').textContent=`Q = [${q.map(x=>x.toFixed(2)).join(', ')}]`;
 $('#tr-qkv-rows').innerHTML=names.map((name,i)=>`<div class="tr-attention-row"><strong>${name}</strong><span>K [${keys[i].join(', ')}]<br>V [${values[i].join(', ')}]</span><span>점수 ${r.scores[i].toFixed(2)}<br><b>${(r.weights[i]*100).toFixed(1)}%</b></span><div class="tr-attention-track"><div style="width:${r.weights[i]*100}%"></div></div></div>`).join('');
 $('#tr-weighted-output').textContent=`출력 = ${r.weights.map((w,i)=>`${w.toFixed(3)} × V(${names[i]})`).join(' + ')} ≈ [${r.output.map(x=>x.toFixed(3)).join(', ')}]`;
 }
 $('#tr-query').oninput=calculate;calculate();
 const words=['나는','오늘','학교에','가서','공부했다'];
 function mask(){const row=+$('#tr-mask-position').value,causal=$('#tr-mask-mode').value==='causal';let html='<span></span>'+words.map(w=>`<span class="tr-axis">${w}</span>`).join('');
 words.forEach((word,i)=>{html+=`<span class="tr-axis${i===row?' tr-current':''}">${word}</span>`;words.forEach((_,j)=>{const yes=allowed(i,j,causal);html+=`<span class="tr-mask-cell ${yes?'tr-open':'tr-closed'}${i===row?' tr-current':''}" aria-label="${word} 위치에서 ${words[j]} ${yes?'참고 가능':'가림'}">${yes?'●':'×'}</span>`;});});$('#tr-mask-grid').innerHTML=html;
 $('#tr-mask-caption').textContent=causal?`“${words[row]}” 위치: ${words.slice(0,row+1).join(' · ')}까지 참고합니다.`:`“${words[row]}” 위치: 앞뒤의 모든 토큰을 참고할 수 있습니다.`;
 }
 $('#tr-mask-position').oninput=mask;$('#tr-mask-mode').onchange=mask;mask();
}
globalThis.TransformerExamples={addSlides,init,attention,allowed};
})();
