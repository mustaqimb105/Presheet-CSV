// helpers
const $ = id => document.getElementById(id);

// auto-set date to today
(() => {
  const d = new Date();
  const iso = d.toISOString().split('T')[0];
  if ($('prescDate')) $('prescDate').value = iso;
})();

// logo upload -> template image
$('logoInput').addEventListener('change', e=>{
  const f = e.target.files && e.target.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = ev => {
    $('tplLogo').src = ev.target.result;
    $('tplLogo').style.display = 'inline-block';
  };
  r.readAsDataURL(f);
});

function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g, c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

// populate printable template from form
function populateTemplate(){
  // header
  $('tplLeftText').textContent = $('clinicLeft').value || '';
  $('tplRightText').textContent = $('clinicRight').value || '';

  // patient strip
  $('tplPatientName').textContent = $('patientName').value || '';
  $('tplPatientAge').textContent = $('patientAge').value || '';
  $('tplPatientSex').textContent = $('patientSex').value || '';
  $('tplDate').textContent = $('prescDate').value || '';
  $('tplPatientMob').textContent = $('patientMob') ? $('patientMob').value : '';

  // left column
  $('tplChiefComplaint').textContent = $('chiefComplaint').value || '';
  $('tplOeNotes').textContent = $('oeNotes').value || '';
  $('tplInvestigation').textContent = $('investigation').value || '';

  // medicines => right column rx list
  const rxWrap = $('tplMedList');
  rxWrap.innerHTML = '';
  const lines = ($('medInput').value||'').split('\n');
  let n = 0;
  lines.forEach(raw=>{
    const line = raw.trim();
    if(!line) return;
    n++;
    const parts = line.split('|').map(p=>p.trim());
    const name = escapeHtml(parts[0]||'');
    const dose = escapeHtml(parts[1]||'');
    const freq = escapeHtml(parts[2]||'');
    const dur = escapeHtml(parts[3]||'');
    const div = document.createElement('div');
    div.className = 'rx-item';
    div.innerHTML = `<div class="name">${name}</div>
                     <div class="meta">${dose ? dose + ' · ' : ''}${freq ? freq + ' · ' : ''}${dur ? dur : ''}</div>`;
    rxWrap.appendChild(div);
  });

  // advice example: we can create list from O/E or leave blank
  const advUl = $('tplAdvice');
  advUl.innerHTML = '';
  // you may choose to add custom advice lines programmatically; leave empty for now

  // doctor name and signature
  $('tplDoctorName').textContent = $('doctorName').value || '';

  // bottom bar
  $('tplBottomBar').textContent = $('bottomBarText').value || 'নিয়ম মাফিক ঔষধ খাবেন। ডাক্তারের পরামর্শ ব্যতীত ঔষধ পরিবর্তন করবেন না।';

  // ensure logo visibility handled earlier
}

// button actions
$('generatePdf').addEventListener('click', async () => {
  populateTemplate();
  const el = $('prescriptionTemplate');
  el.style.display = 'block';

  const opt = {
    margin:[8,8,8,8],
    filename: `Prescription_${($('patientName').value||'patient').replace(/\s+/g,'_')}.pdf`,
    image:{ type:'jpeg', quality: 1 },
    html2canvas:{ scale:2, useCORS:true },
    jsPDF:{ unit:'mm', format:'a4', orientation:'portrait' }
  };

  try{
    await html2pdf().set(opt).from(el).save();
  }catch(err){
    console.error('PDF failed', err);
    alert('PDF generation failed: '+ (err && err.message ? err.message : err));
  }finally{
    el.style.display='none';
  }
});

$('previewPdf').addEventListener('click', async ()=>{
  populateTemplate();
  const el = $('prescriptionTemplate');
  el.style.display = 'block';
  try{
    const worker = html2pdf().from(el);
    const blob = await worker.outputPdf('blob');
    window.open(URL.createObjectURL(blob), '_blank');
  }catch(e){
    console.error(e);
    alert('Preview failed');
  }finally{
    el.style.display = 'none';
  }
});

$('printBtn').addEventListener('click', ()=>{
  populateTemplate();
  const el = $('prescriptionTemplate');
  el.style.display = 'block';
  window.print();
  setTimeout(()=> el.style.display = 'none', 600);
});

$('resetBtn').addEventListener('click', ()=>{
  if(!confirm('Reset all fields?')) return;
  [
    'clinicLeft','clinicRight','patientName','patientAge','patientSex','prescDate',
    'patientAddr','patientWt','patientMob','chiefComplaint','oeNotes','investigation',
    'medInput','doctorName','bottomBarText'
  ].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  $('tplLogo').src = '';
  $('tplLogo').style.display = 'none';
});
