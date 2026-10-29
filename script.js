const S = [
  [97.5, '97.50 – 100.00', 1.00, 'Excellent'],
  [94.5, '94.50 – 97.49', 1.25, 'Very Good'],
  [91.5, '91.50 – 94.49', 1.50, 'Very Good'],
  [86.5, '86.50 – 91.49', 1.75, 'Very Good'],
  [81.5, '81.50 – 86.49', 2.00, 'Satisfactory'],
  [76, '76.00 – 81.49', 2.25, 'Satisfactory'],
  [70.5, '70.50 – 75.99', 2.50, 'Satisfactory'],
  [65, '65.00 – 70.49', 2.75, 'Fair'],
  [59.5, '59.50 – 64.99', 3.00, 'Fair'],
  [0, '59.49 and below', 5.00, 'Failed']
];

const $ = id => document.getElementById(id);
const cls = r => ({ 'Excellent': 'ex', 'Very Good': 'vg', 'Satisfactory': 'sa', 'Fair': 'fa', 'Failed': 'f' })[r];

$('scale').innerHTML = S.map((s, i) => `<tr id="r${i}"><td>${s[1]}</td><td class="g">${s[2].toFixed(2)}</td><td><span class="chip ${cls(s[3])}">${s[3]}</span></td></tr>`).join('');
S.slice(0, 9).forEach(s => $('target').insertAdjacentHTML('beforeend', `<option value="${s[0]}">${s[2].toFixed(2)} – ${s[3]}</option>`));

const ids = ['p', 'm', 'pf', 'f'],
      val = id => { const v = $(id).value; return v === '' ? NaN : parseFloat(v); },
      ok = v => !isNaN(v) && v >= 0 && v <= 100;

const band = x => S.findIndex(s => Math.round(x * 100) / 100 >= s[0]);
const empty = '<div class="row"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg><span>Fill all four terms to see your Final Grade.</span></div>';

let fb = '';

function need() {
  const [p, m, pf] = ids.map(val), t = $('target').value;
  if (!(ok(p) && ok(m) && ok(pf)) || t === '') return '';
  const n = (parseFloat(t) - .2 * (p + m + pf)) / .4, tg = S.find(s => s[0] == t)[2].toFixed(2);
  return n > 100 ? `A ${tg} is out of reach with these grades.` : n <= 0 ? `You already secured ${tg}.` : `Need <b>${n.toFixed(2)}</b> in Finals for ${tg}.`;
}

function calc() {
  fb = '';
  ids.forEach(id => $(id).classList.toggle('err', $(id).value !== '' && !ok(val(id))));
  document.querySelectorAll('tbody tr').forEach(r => r.classList.remove('on'));
  
  const [p, m, pf, f] = ids.map(val),
        three = ok(p) && ok(m) && ok(pf),
        four = three && ok(f);
  
  let h = empty;
  if (four) {
    const fg = .2 * p + .2 * m + .2 * pf + .4 * f, i = band(fg), s = S[i];
    $('r' + i).classList.add('on');
    h = `<div class="big">${s[2].toFixed(2)}</div><div>Final Grade ${fg.toFixed(2)} · <span class="chip ${cls(s[3])}">${s[3]}</span></div>`;
  }
  
  const n = need();
  if (n) h = (four ? h : '') + `<div>${n}</div>`;
  
  $('out').innerHTML = h;
  $('submit').disabled = !three;
}

$('submit').onclick = () => {
  const [p, m, pf, f] = ids.map(val), nm = $('name').value.trim() || 'This subject';
  let msg;
  if (ok(f)) {
    const fg = .2 * p + .2 * m + .2 * pf + .4 * f, s = S[band(fg)];
    msg = `${nm}: ${fg.toFixed(2)} average, GWA ${s[2].toFixed(2)} (${s[3]}). ${s[2] <= 3 ? 'Nice work, keep it up!' : 'You may want to talk to your instructor about next steps.'}`;
  } else {
    const part = .2 * (p + m + pf), pass = Math.max(0, (59.5 - part) / .4);
    msg = `${nm}: you need at least ${pass.toFixed(2)} in Finals to pass${need() ? '. ' + need() : ''}`;
  }
  $('out').innerHTML = '<div class="row"><svg viewBox="0 0 24 24"><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg><b>Grade Buddy</b></div><div>' + msg + '</div>';
};

ids.concat(['target']).forEach(id => $(id).addEventListener('input', calc));

$('reset').onclick = () => {
  ids.concat(['name']).forEach(id => $(id).value = '');
  $('target').value = '';
  calc();
};

$('theme').onclick = () => {
  const r = document.documentElement,
        d = getComputedStyle(r).getPropertyValue('--bg').trim() === '#0b1626';
  r.dataset.theme = d ? 'light' : 'dark';
  $('ti').innerHTML = d ? '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>' : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
};

calc();