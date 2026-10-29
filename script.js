function switchTab(tabId, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
}

function toggleTheme() {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';
  body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeToggle').innerText = isDark ? '🌙' : '☀️';
}

function simulateAIScan(event) {
  if (event.target.files && event.target.files[0]) {
    document.getElementById('scanText').innerText = "Analyzing timetable with AI OCR...";
    setTimeout(() => {
      alert("Success! AI successfully extracted your schedule classes.");
      document.getElementById('scanText').innerText = "Click to upload another schedule image";
      const list = document.getElementById('scheduleList');
      list.innerHTML += `
        <div class="sched-item">
          <div class="sched-info">
            <b class="subj-title">Web Systems and Technologies</b>
            <span class="subj-meta">Fri • Room 301</span>
          </div>
          <span class="time-badge">01:00 PM - 04:00 PM</span>
        </div>`;
    }, 1500);
  }
}

function exportSchedule() {
  const items = document.querySelectorAll('#scheduleList .sched-item');
  if (items.length === 0) return alert("No schedule items to export!");

  let content = "========================================\n";
  content += "           ESKWELA CLASS SCHEDULE       \n";
  content += "========================================\n\n";

  items.forEach((item, idx) => {
    const title = item.querySelector('.subj-title')?.innerText || "Subject";
    const meta = item.querySelector('.subj-meta')?.innerText || "";
    const time = item.querySelector('.time-badge')?.innerText || "";
    
    content += `${idx + 1}. ${title}\n`;
    content += `   Days/Location: ${meta}\n`;
    content += `   Time: ${time}\n`;
    content += "----------------------------------------\n";
  });

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "eskwela_schedule.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

function addTask() {
  const name = document.getElementById('taskName').value.trim();
  const sub = document.getElementById('taskSubject').value.trim();
  if (!name) return alert("Please enter a task name.");
  
  const taskList = document.getElementById('taskList');
  taskList.innerHTML += `
    <div class="sched-item">
      <div class="sched-info">
        <b>${name}</b>
        <span>Subject: ${sub || 'General'}</span>
      </div>
      <div class="time-badge" style="background:var(--chip-bg); color:var(--chip-text);">In Progress</div>
    </div>`;
  document.getElementById('taskName').value = '';
  document.getElementById('taskSubject').value = '';
}

function sendToEsky() {
  const input = document.getElementById('chatInput');
  const txt = input.value.trim();
  if (!txt) return;

  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML += `<div class="msg user">${txt}</div>`;
  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    let reply = "Sige! Nauunawaan ko ang iyong tanong. Makakatulong ako diyan sa iyong pag-aaral!";
    const lower = txt.toLowerCase();
    if (lower.includes('gwa') || lower.includes('grade')) {
      reply = "Para sa iyong GWA, siguraduhing pumasok sa mga pagsusulit at subaybayan ang iyong Prelim, Midterm, Pre-Final, at Finals weight!";
    } else if (lower.includes('hello') || lower.includes('hi')) {
      reply = "Hello! Ready ka na ba para sa mga klase mo ngayong linggo?";
    }
    chatBox.innerHTML += `<div class="msg esky">${reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800);
}