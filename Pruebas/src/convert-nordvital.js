const fs = require('fs');
const path = require('path');

try {
  const csvPath = path.join(__dirname, 'reporte001_2025-01-01_2025-01-31_0.csv');
  const jsPath = path.join(__dirname, 'nordvital-data.js');

  const csv = fs.readFileSync(csvPath, 'utf8');
  // Split lines (supporting both LF and CRLF)
  const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');

  if (lines.length < 2) {
    console.error("CSV is empty or too short");
    process.exit(1);
  }

  // The file is SEMICOLON-separated (;)
  const headers = lines[0].split(';').map(h => h.trim());
  
  // Fields to extract (incluyendo 'rotulo' para tipo de atención)
  const fieldsToKeep = [
    'fechacita',
    'nombrecompleto',
    'sexopaciente',
    'edadanios',
    'medicoespecialidad',
    'estado_cita',
    'regimen',
    'nombresede',
    'tipocita',
    'rotulo',           // Campo adicional: tipo de atención (rotulo)
    'oportunidad',
    'mediconombre'
  ];

  // Find column indices
  const indices = {};
  fieldsToKeep.forEach(field => {
    indices[field] = headers.indexOf(field);
  });

  console.log("Found column indices:", indices);

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';').map(v => v.trim());
    if (values.length < headers.length - 2) continue; // Skip malformed lines

    const obj = {};
    fieldsToKeep.forEach(field => {
      const idx = indices[field];
      if (idx !== -1 && values[idx] !== undefined) {
        let val = values[idx];
        if (field === 'edadanios' || field === 'oportunidad') {
          obj[field] = val !== '' && !isNaN(val) ? Number(val) : 0;
        } else {
          obj[field] = val;
        }
      } else {
        obj[field] = '';
      }
    });
    data.push(obj);
  }

  fs.writeFileSync(jsPath, 'window.nordvitalData = ' + JSON.stringify(data) + ';');
  console.log(`Successfully converted ${data.length} rows to nordvital-data.js.`);
} catch (err) {
  console.error("Error converting Nordvital CSV:", err);
  process.exit(1);
}
