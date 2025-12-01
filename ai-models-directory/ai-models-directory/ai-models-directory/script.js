const cardsEl = document.getElementById('cards');
const searchEl = document.getElementById('search');
const catFilter = document.getElementById('categoryFilter');
const clearBtn = document.getElementById('clearBtn');

let models = [];

fetch('models.json')
  .then(r => r.json())
  .then(data => {
    models = data;
    populateCategoryFilter();
    render(models);
  })
  .catch(err => {
    cardsEl.innerHTML = '<p class="small">Failed to load models.json — check file present.</p>';
  });

function populateCategoryFilter(){
  const cats = Array.from(new Set(models.map(m => m.category))).sort();
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    catFilter.appendChild(opt);
  });
}

function render(list){
  if(!list.length){
    cardsEl.innerHTML = '<p class="small">No models found.</p>';
    return;
  }
  cardsEl.innerHTML = '';
  list.forEach(m => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3>${escapeHtml(m.name)}</h3>
          <span class="badge">${escapeHtml(m.category)}</span>
        </div>
        <div class="meta">${escapeHtml(m.best_for)}</div>
        <p class="small">${escapeHtml(m.notes || '')}</p>
      </div>
      <div class="actions">
        <a class="btn" href="${m.link}" target="_blank" rel="noopener">Official</a>
        <button onclick="showDetails('${m.id}')" class="btn" style="border:1px solid #e7eefc;background:#fff;color:#0b63d0">Details</button>
      </div>
    `;
    cardsEl.appendChild(div);
  });
}

function filterAndRender(){
  const q = searchEl.value.trim().toLowerCase();
  const cat = catFilter.value;
  const out = models.filter(m => {
    if(cat && m.category !== cat) return false;
    if(!q) return true;
    const hay = (m.name + ' ' + (m.task||[]).join(' ') + ' ' + (m.best_for || '') + ' ' + (m.notes || '')).toLowerCase();
    return hay.includes(q);
  });
  render(out);
}

searchEl.addEventListener('input', filterAndRender);
catFilter.addEventListener('change', filterAndRender);
clearBtn.addEventListener('click', ()=>{ searchEl.value=''; catFilter.value=''; filterAndRender(); });

function showDetails(id){
  const m = models.find(x=>x.id===id);
  if(!m) return alert('Model not found.');
  alert(`${m.name}\nCategory: ${m.category}\nBest for: ${m.best_for}\nNotes: ${m.notes}\nLink: ${m.link}`);
}

function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
