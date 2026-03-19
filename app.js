let messages = [
  {side:'right', type:'text', text:'hey you seem really interesting 👀', time:'6:59 AM', img:null},
  {side:'right', type:'text', text:'what makes you say that', time:'6:59 AM', img:null},
  {side:'left',  type:'text', text:'just a vibe honestly 😏', time:'7:01 AM', img:null},
  {side:'right', type:'text', text:'you got a girlfriend?', time:'7:02 AM', img:null},
  {side:'left',  type:'text', text:'why you asking 👀', time:'7:02 AM', img:null},
  {side:'right', type:'text', text:'just curious... no reason', time:'7:03 AM', img:null},
];

let showTime = true;
let showRead = false;
let fileTargetIdx = -1;

function togTime(){
  showTime = !showTime;
  document.getElementById('tog-time').classList.toggle('on', showTime);
  render();
}
function togRead(){
  showRead = !showRead;
  document.getElementById('tog-read').classList.toggle('on', showRead);
  render();
}

function getS(){
  return {
    name: document.getElementById('s-name').value || 'Emily',
    desc: document.getElementById('s-desc').value || 'Subtle Flirt Specialist',
    emoji: document.getElementById('s-emoji').value || '🌸',
    avatarColor: document.getElementById('s-avatar').value,
    bubbleColor: document.getElementById('s-bubble').value,
    activeTab: document.getElementById('s-tab').value,
  };
}

function renderMsgList(){
  const list = document.getElementById('msg-list');
  list.innerHTML = '';
  messages.forEach((m, i) => {
    const row = document.createElement('div');
    row.className = 'msg-row';

    const imgSection = m.img
      ? `<div class="img-preview-wrap">
           <img src="${m.img}" alt="">
           <button class="img-remove" onclick="removeImg(${i})">✕</button>
         </div>`
      : `<button class="img-btn" onclick="pickImg(${i})">+ Add image</button>`;

    row.innerHTML = `
      <div class="msg-row-top">
        <span class="msg-num">${i+1}</span>
        <select onchange="messages[${i}].side=this.value;render()">
          <option value="right" ${m.side==='right'?'selected':''}>Right</option>
          <option value="left"  ${m.side==='left'?'selected':''}>Left</option>
        </select>
        <select onchange="messages[${i}].type=this.value;renderMsgList();render()">
          <option value="text"  ${m.type==='text'?'selected':''}>Text</option>
          <option value="image" ${m.type==='image'?'selected':''}>Image</option>
        </select>
        <input class="msg-text-input"
          value="${m.text.replace(/"/g,'&quot;')}"
          oninput="messages[${i}].text=this.value;render()"
          ${m.type==='image'?'disabled style="opacity:.3"':''}
          placeholder="Message...">
        <button class="del-btn" onclick="messages.splice(${i},1);renderMsgList();render()">✕</button>
      </div>
      ${m.type==='image' ? imgSection : ''}
      <input class="msg-text-input"
        value="${m.time}"
        oninput="messages[${i}].time=this.value;render()"
        placeholder="Time e.g. 9:41 AM"
        style="width:130px;margin-top:5px;font-size:10px">
    `;
    list.appendChild(row);
  });
}

function addMsg(side){
  messages.push({side, type:'text', text:side==='right'?'hey...':'lol okay', time:'9:41 AM', img:null});
  renderMsgList(); render();
}
function clearMsgs(){
  messages = []; renderMsgList(); render();
}
function pickImg(idx){
  fileTargetIdx = idx;
  document.getElementById('file-in').click();
}
function removeImg(idx){
  messages[idx].img = null;
  messages[idx].type = 'text';
  renderMsgList(); render();
}
function handleFile(e){
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    messages[fileTargetIdx].img = ev.target.result;
    messages[fileTargetIdx].type = 'image';
    renderMsgList(); render();
    e.target.value = '';
    fileTargetIdx = -1;
  };
  reader.readAsDataURL(file);
}

function render(){
  const s = getS();
  const screen = document.getElementById('app-screen');
  screen.innerHTML = '';

  const hdr = document.createElement('div');
  hdr.className = 'app-header';
  hdr.innerHTML = `
    <span class="app-menu-icon">☰</span>
    <div class="app-logo-wrap">
      <span class="app-logo-t">TELR</span>
      <span class="app-logo-b">AI</span>
    </div>
    <span class="app-refresh-icon">↺</span>
  `;
  screen.appendChild(hdr);

  const tabs = document.createElement('div');
  tabs.className = 'app-tabs';
  const rfActive = s.activeTab === 'redflag';
  tabs.innerHTML = `
    <div class="app-tab ${rfActive?'on':''}">🚩 Red Flag</div>
    <div class="app-tab ${!rfActive?'on':''}">👀 Testers</div>
  `;
  screen.appendChild(tabs);

  const nav = document.createElement('div');
  nav.className = 'chat-nav';
  nav.innerHTML = `
    <span class="back-btn">‹</span>
    <div class="chat-avatar" style="background:${s.avatarColor}33">${s.emoji}</div>
    <div class="chat-info">
      <div class="chat-name">${s.name}</div>
      <div class="chat-desc">${s.desc}</div>
    </div>
  `;
  screen.appendChild(nav);

  const msgsEl = document.createElement('div');
  msgsEl.className = 'msgs-area';

  messages.forEach(m => {
    const row = document.createElement('div');
    row.className = m.side === 'right' ? 'msg-row-r' : 'msg-row-l';

    if(m.side === 'left'){
      const av = document.createElement('div');
      av.className = 'av-sm';
      av.style.background = s.avatarColor + '33';
      av.textContent = s.emoji;
      row.appendChild(av);
    }

    if(m.type === 'image' && m.img){
      const wrap = document.createElement('div');
      wrap.className = 'img-bbl';

      const img = document.createElement('img');
      img.src = m.img;
      img.style.width = '260px';
      img.style.display = 'block';
      img.style.borderRadius = '16px';
      img.style.objectFit = 'cover';
      wrap.appendChild(img);

      if(showTime){
        const t = document.createElement('div');
        t.className = 'img-bbl-time';
        t.textContent = m.time;
        wrap.appendChild(t);
      }
      row.appendChild(wrap);

    } else {
      const bbl = document.createElement('div');
      bbl.className = `bbl ${m.side==='right'?'bbl-r':'bbl-l'}`;
      if(m.side === 'right') bbl.style.background = s.bubbleColor;

      const txt = document.createElement('div');
      txt.className = 'bbl-txt';
      txt.textContent = m.text;
      bbl.appendChild(txt);

      if(showTime){
        const t = document.createElement('div');
        t.className = 'bbl-time';
        t.textContent = m.time;
        bbl.appendChild(t);
      }
      if(showRead && m.side === 'right'){
        const r = document.createElement('div');
        r.className = 'bbl-read';
        r.textContent = 'Read';
        bbl.appendChild(r);
      }
      row.appendChild(bbl);
    }

    msgsEl.appendChild(row);
  });

  screen.appendChild(msgsEl);

  const bar = document.createElement('div');
  bar.className = 'input-bar';
  bar.innerHTML = `
    <div class="img-icon-btn">🖼</div>
    <div class="input-fake">Message ${s.name}...</div>
    <div class="send-btn">➤</div>
  `;
  screen.appendChild(bar);
}

function downloadShot(){
  const loading = document.getElementById('loading');
  loading.style.display = 'flex';
  const root = document.getElementById('capture-root');
  html2canvas(root, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'telr-ai-chat.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    loading.style.display = 'none';
  }).catch(() => {
    loading.style.display = 'none';
    alert('Download failed. Try Chrome.');
  });
}

renderMsgList();
render();