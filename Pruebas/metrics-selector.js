// metrics-selector.js
// Simple client-side metric chips and selection logic.

(function(){
  const csvPath = 'reporte001_2025-01-01_2025-01-31_0.csv';
  const availableMetrics = [
    'Total Citas', 'Citas Completadas', 'Citas Incumplidas', 'Tasa de Cumplimiento',
    'Citas por Médico (Top 5)'
  ];

  const metricsList = document.getElementById('metrics-list');
  const searchInput = document.getElementById('metrics-search');
  const selected = [];
  let table = []; // array de objetos parsed CSV

  function parseCSV(text){
    // semicolon-separated; primera línea es cabecera
    const lines = text.split(/\r?\n/).filter(l=>l.trim()!=='');
    if(lines.length === 0) return [];
    const header = lines[0].split(';').map(h => h.trim());
    return lines.slice(1).map(line => {
      const cols = line.split(';');
      const obj = {};
      for(let i=0;i<header.length;i++){
        obj[header[i]] = (cols[i] || '').trim();
      }
      return obj;
    });
  }

  async function loadCSV(){
    try{
      const res = await fetch(csvPath);
      if(!res.ok) throw new Error('CSV no encontrado');
      const text = await res.text();
      table = parseCSV(text);
      console.log('CSV cargado, filas:', table.length);
      renderChips();
    } catch(err){
      console.warn('No se pudo cargar CSV:', err.message);
      // igual renderizar chips para permitir UX sin datos
      renderChips();
    }
  }

  function renderChips(filter = ''){
    metricsList.innerHTML = '';
    const q = filter.trim().toLowerCase();
    availableMetrics.filter(m => m.toLowerCase().includes(q)).forEach(metric => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'metric-chip';
      btn.textContent = metric;
      if(selected.includes(metric)) btn.classList.add('selected');
      btn.addEventListener('click', () => toggleMetric(metric, btn));
      metricsList.appendChild(btn);
    });
  }

  function toggleMetric(metric, btn){
    if(selected.includes(metric)){
      const idx = selected.indexOf(metric);
      selected.splice(idx,1);
      btn.classList.remove('selected');
      updateSelectedCards();
      return;
    }
    if(selected.length >= 2){
      alert('Solo puedes seleccionar hasta 2 métricas a la vez.');
      return;
    }
    selected.push(metric);
    btn.classList.add('selected');
    updateSelectedCards();
  }

  function computeMetric(metric){
    const rows = table;
    const total = rows.length;
    const estadoKey = findKeyCaseInsensitive(rows[0] || {}, 'estado_cita') || 'estado_cita';
    const medicoKey = findKeyCaseInsensitive(rows[0] || {}, 'mediconombre') || 'mediconombre';

    const lower = s => (s||'').toString().trim().toLowerCase();

    if(metric === 'Total Citas') return total;

    if(metric === 'Citas Incumplidas'){
      return rows.filter(r => lower(r[estadoKey]) === 'incumplido').length;
    }

    if(metric === 'Citas Completadas'){
      const noShow = rows.filter(r => lower(r[estadoKey]) === 'incumplido').length;
      const cancel = rows.filter(r => lower(r[estadoKey]).includes('cancel')).length;
      return Math.max(0, total - noShow - cancel);
    }

    if(metric === 'Tasa de Cumplimiento'){
      if(total === 0) return '0%';
      const completed = computeMetric('Citas Completadas');
      return ((completed / total) * 100).toFixed(1) + '%';
    }

    if(metric === 'Citas por Médico (Top 5)'){
      const counts = {};
      rows.forEach(r => {
        const name = r[medicoKey] || 'Sin médico';
        counts[name] = (counts[name] || 0) + 1;
      });
      const arr = Object.keys(counts).map(k=>({medico:k,count:counts[k]}));
      arr.sort((a,b)=>b.count-a.count);
      return arr.slice(0,5).map(x=>`${x.medico} (${x.count})`).join(', ');
    }

    return '—';
  }

  function findKeyCaseInsensitive(obj, key){
    const lower = key.toLowerCase();
    for(const k in obj){
      if(k.toLowerCase() === lower) return k;
    }
    return null;
  }

  function updateSelectedCards(){
    const c1 = document.getElementById('metric-card-1');
    const c2 = document.getElementById('metric-card-2');
    const v1 = document.getElementById('metric-value-1');
    const v2 = document.getElementById('metric-value-2');

    if(selected[0]){
      c1.querySelector('.metric-title').textContent = selected[0];
      v1.textContent = 'Cargando...';
      setTimeout(()=>{
        try{ v1.textContent = formatMetricValue(computeMetric(selected[0])); }catch(e){ v1.textContent = '—'; }
      }, 10);
    } else {
      c1.querySelector('.metric-title').textContent = 'Métrica 1';
      v1.textContent = '-';
    }

    if(selected[1]){
      c2.querySelector('.metric-title').textContent = selected[1];
      v2.textContent = 'Cargando...';
      setTimeout(()=>{
        try{ v2.textContent = formatMetricValue(computeMetric(selected[1])); }catch(e){ v2.textContent = '—'; }
      }, 10);
    } else {
      c2.querySelector('.metric-title').textContent = 'Métrica 2';
      v2.textContent = '-';
    }
  }

  function formatMetricValue(v){
    if(typeof v === 'number') return v.toLocaleString();
    return v;
  }

  searchInput.addEventListener('input', (e)=> renderChips(e.target.value));

  // Inicializar carga y render
  loadCSV().then(()=> updateSelectedCards());

})();
