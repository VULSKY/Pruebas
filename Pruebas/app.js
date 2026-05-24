/**
 * Aether Analytics - Application Controller
 * Manejo de UI, controladores de eventos, integraciones de Chart.js y carga de datos.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- INICIALIZACIÓN DE MOTOR Y ESTADO ---
  const engine = new DataEngine();
  
  const state = {
    activeTab: 'tab-saas',
    saasData: [],
    ecomData: [],
    customData: {
      headers: [],
      rows: [],
      filteredRows: [],
      currentPage: 1,
      rowsPerPage: 10
    },
    charts: {
      saasHistory: null,
      saasForecast: null,
      ecomForecast: null,
      ecomChannels: null,
      ecomProducts: null
    }
  };

  // --- WIDGET DE FECHA Y HORA ---
  const updateDateTime = () => {
    const timeSpan = document.getElementById('current-time');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = now.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    timeSpan.textContent = `${day}, ${hours}:${minutes}`;
  };
  setInterval(updateDateTime, 1000);
  updateDateTime();

  // --- SISTEMA DE NAVEGACIÓN POR PESTAÑAS (TABS) ---
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');

  const tabMeta = {
    'tab-saas': {
      title: 'Selección de Internos & Predicciones',
      subtitle: 'Analítica avanzada de admisión de estudiantes y motor predictivo de regresión'
    },
    'tab-ecom': {
      title: 'Reporte Nordvital IPS',
      subtitle: 'Análisis de citas médicas y métricas de desempeño del reporte Nordvital'
    },
    'tab-custom': {
      title: 'Explorador y Análisis de CSV',
      subtitle: 'Carga tus propios conjuntos de datos para cálculos estadísticos y minería'
    }
  };
  const ecomElements = document.querySelectorAll('#tab-ecom .nordvital-filters-section, #tab-ecom .kpi-grid, #tab-ecom .nordvital-table-section, #tab-ecom .charts-grid-ecom');
  const saasElements = document.querySelectorAll('#tab-saas .kpi-grid, #tab-saas .charts-grid, #tab-saas .predictor-card');

  function setDashboardVisibility(targetTab){
    ecomElements.forEach(el => { el.style.display = (targetTab === 'tab-ecom') ? '' : 'none'; });
    saasElements.forEach(el => { el.style.display = (targetTab === 'tab-saas') ? '' : 'none'; });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      if (state.activeTab === targetTab) return;

      // Actualizar clases de navegación
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Actualizar paneles de contenido
      tabPanes.forEach(pane => pane.classList.remove('active'));
      document.getElementById(targetTab).classList.add('active');

      state.activeTab = targetTab;

      // Actualizar títulos
      pageTitle.textContent = tabMeta[targetTab].title;
      pageSubtitle.textContent = tabMeta[targetTab].subtitle;

      // Mostrar/ocultar controles y secciones relevantes según pestaña
      setDashboardVisibility(targetTab);

      // Redibujar gráficos para corregir glitches de tamaño de canvas
      setTimeout(() => {
        Object.values(state.charts).forEach(chart => {
          if (chart) chart.resize();
        });
      }, 50);
    });
  });

  // Asegurar visibilidad inicial correcta
  setDashboardVisibility(state.activeTab);

  // --- GRADIENTES PARA GRÁFICOS PREMIUM ---
  const getCanvasGradient = (ctx, colorStart, colorEnd, height = 300) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  };

  // --- SECCIÓN 1: DATOS Y GRÁFICOS SELECCIÓN DE INTERNOS (DATASET PROPIO) ---
  const initSaaSSection = () => {
    // Cargar datos del dataset global
    state.saasData = window.internshipData || [];
    const totalStudents = state.saasData.length;
    const selectedStudents = state.saasData.filter(d => d.selected === 1).length;
    const selectionRate = totalStudents > 0 ? (selectedStudents / totalStudents) * 100 : 0;
    
    const cgpas = state.saasData.map(d => d.CGPA);
    const avgCGPA = engine.calculateMean(cgpas);

    // Cargar tarjetas de métricas
    document.getElementById('val-saas-mrr').textContent = totalStudents.toLocaleString('es-ES');
    document.getElementById('val-saas-users').textContent = selectedStudents.toLocaleString('es-ES');
    document.getElementById('val-saas-churn').textContent = `${selectionRate.toFixed(1)}%`;
    document.getElementById('val-saas-ltv').textContent = avgCGPA.toFixed(2);

    // 1. Gráfico de Comparación de Atributos (Seleccionados vs Rechazados)
    const ctxHistory = document.getElementById('chart-saas-history').getContext('2d');
    const comparison = engine.getSelectionAttributeComparison();

    state.charts.saasHistory = new Chart(ctxHistory, {
      type: 'bar',
      data: {
        labels: comparison.labels,
        datasets: [
          {
            label: 'Seleccionados (Admitidos)',
            data: comparison.selected,
            backgroundColor: 'rgba(0, 229, 255, 0.75)',
            borderColor: '#00e5ff',
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            label: 'Rechazados (No admitidos)',
            data: comparison.rejected,
            backgroundColor: 'rgba(153, 76, 255, 0.4)',
            borderColor: '#994cff',
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#e2e8f0', font: { family: 'Outfit', size: 11 } }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleFont: { family: 'Outfit' },
            bodyFont: { family: 'Inter' },
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#94a3b8', font: { family: 'Inter', size: 9 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#94a3b8' },
            min: 0,
            max: 10
          }
        }
      }
    });

    // 2. Simulador de Selección de Estudiantes
    const ctxForecast = document.getElementById('chart-saas-forecast').getContext('2d');
    const sliderGrowth = document.getElementById('slider-saas-growth');
    const sliderChurn = document.getElementById('slider-saas-churn');
    const sliderCoding = document.getElementById('slider-saas-coding');

    const valGrowth = document.getElementById('val-slider-saas-growth');
    const valChurn = document.getElementById('val-slider-saas-churn');
    const valCoding = document.getElementById('val-slider-saas-coding');

    // Calcular modelo de regresión lineal múltiple
    const { beta, r2 } = engine.calculateMultipleLinearRegression();
    document.getElementById('saas-r2-badge').textContent = `Precisión del modelo: R² = ${r2.toFixed(3)}`;

    const updateSaaSProbability = () => {
      const cgpa = parseFloat(sliderGrowth.value);
      const skills = parseFloat(sliderChurn.value);
      const coding = parseFloat(sliderCoding.value);

      valGrowth.textContent = cgpa.toFixed(1);
      valChurn.textContent = skills;
      valCoding.textContent = coding;

      // Calcular probabilidad lineal: P = b0 + b1*cgpa + b2*skills + b3*coding
      let prob = beta[0] + beta[1] * cgpa + beta[2] * skills + beta[3] * coding;
      prob = Math.max(0, Math.min(100, prob * 100)); // Limitar entre 0% y 100%

      const probVal = document.getElementById('val-saas-probability');
      probVal.textContent = `${prob.toFixed(1)}%`;
      
      // Cambio de color dinámico según probabilidad
      if (prob < 40) {
        probVal.style.color = 'var(--color-danger)';
        probVal.style.textShadow = '0 0 15px rgba(239, 68, 68, 0.4)';
      } else if (prob < 75) {
        probVal.style.color = 'var(--color-accent)';
        probVal.style.textShadow = '0 0 15px rgba(153, 76, 255, 0.4)';
      } else {
        probVal.style.color = 'var(--color-primary)';
        probVal.style.textShadow = '0 0 15px rgba(0, 229, 255, 0.4)';
      }

      document.getElementById('gauge-saas-probability').style.width = `${prob}%`;

      // Obtener datos de comparación
      const comparisonData = engine.getComparisonData(cgpa, skills, coding);

      if (state.charts.saasForecast) {
        state.charts.saasForecast.data.datasets[0].data = comparisonData.configured;
        state.charts.saasForecast.data.datasets[1].data = comparisonData.selected;
        state.charts.saasForecast.update();
      } else {
        state.charts.saasForecast = new Chart(ctxForecast, {
          type: 'bar',
          data: {
            labels: comparisonData.labels,
            datasets: [
              {
                label: 'Alumno Configurado',
                data: comparisonData.configured,
                backgroundColor: 'rgba(0, 229, 255, 0.8)',
                borderColor: '#00e5ff',
                borderWidth: 1.5,
                borderRadius: 4
              },
              {
                label: 'Promedio Admitidos',
                data: comparisonData.selected,
                backgroundColor: 'rgba(153, 76, 255, 0.3)',
                borderColor: '#994cff',
                borderWidth: 1.5,
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: { color: '#e2e8f0', font: { family: 'Inter', size: 9 } }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { size: 9 } }
              },
              y: {
                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                ticks: { color: '#94a3b8', font: { size: 9 } },
                min: 0,
                max: 10
              }
            }
          }
        });
      }
    };

    sliderGrowth.addEventListener('input', updateSaaSProbability);
    sliderChurn.addEventListener('input', updateSaaSProbability);
    sliderCoding.addEventListener('input', updateSaaSProbability);
    updateSaaSProbability();
  };

  // --- SECCIÓN 2: REPORTE NORDVITAL IPS CON FILTROS INTERACTIVOS ---
  const initEcomSection = () => {
    // Cargar datos de Nordvital
    const nordvitalData = window.nordvitalData || [];
    
    if (nordvitalData.length === 0) {
      console.warn('No hay datos de Nordvital disponibles');
      return;
    }

    // Estado para filtros de Nordvital
    state.nordvitalFilters = {
      dateFrom: '',
      dateTo: '',
      tipoCita: '',
      medico: '',
      medicoNombre: '',
      medicoEspecialidad: '',
      filteredData: [...nordvitalData],
      currentPage: 1,
      rowsPerPage: 10
    };

    // Extraer valores únicos para los selectores.
    // Algunos CSV usan 'rotulo' para el tipo de atención; mediconombre contiene el nombre del médico.
    const uniqueTipoCitas = [...new Set(nordvitalData.map(d => (d.tipocita || d.rotulo || '').toString()).filter(Boolean))].sort();
    const uniqueMedicos = [...new Set(nordvitalData.map(d => (d.mediconombre || d.medico || '').toString()).filter(Boolean))].sort();
    const uniqueMedicoNombres = [...new Set(nordvitalData.map(d => (d.mediconombre || '').toString()).filter(Boolean))].sort();
    const uniqueEspecialidades = [...new Set(nordvitalData.map(d => (d.medicoespecialidad || '').toString()).filter(Boolean))].sort();
    
    // Poblar selectores (respetando el estilo existente). Reiniciamos manteniendo la opción "Todos".
    const selectTipoCita = document.getElementById('filter-tipo-cita');
    const selectMedico = document.getElementById('filter-medico');
    const selectMedicoNombre = document.getElementById('filter-medico-nombre');
    const selectEspecialidad = document.getElementById('filter-medico-especialidad');

    // Limpiar y dejar la opción por defecto
    selectTipoCita.innerHTML = '';
    const defaultTipo = document.createElement('option');
    defaultTipo.value = '';
    defaultTipo.textContent = 'Todos los tipos';
    selectTipoCita.appendChild(defaultTipo);

    uniqueTipoCitas.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo;
      option.textContent = tipo;
      selectTipoCita.appendChild(option);
    });

    selectMedico.innerHTML = '';
    const defaultMed = document.createElement('option');
    defaultMed.value = '';
    defaultMed.textContent = 'Todos los médicos';
    selectMedico.appendChild(defaultMed);

    uniqueMedicos.forEach(medico => {
      const option = document.createElement('option');
      option.value = medico;
      option.textContent = medico;
      selectMedico.appendChild(option);
    });

    // Poblar selector de nombre del médico
    selectMedicoNombre.innerHTML = '';
    const defaultMedNombre = document.createElement('option');
    defaultMedNombre.value = '';
    defaultMedNombre.textContent = 'Todos los nombres';
    selectMedicoNombre.appendChild(defaultMedNombre);

    uniqueMedicoNombres.forEach(nombre => {
      const option = document.createElement('option');
      option.value = nombre;
      option.textContent = nombre;
      selectMedicoNombre.appendChild(option);
    });

    // Poblar selector de especialidad
    selectEspecialidad.innerHTML = '';
    const defaultEspec = document.createElement('option');
    defaultEspec.value = '';
    defaultEspec.textContent = 'Todas las especialidades';
    selectEspecialidad.appendChild(defaultEspec);

    uniqueEspecialidades.forEach(especialidad => {
      const option = document.createElement('option');
      option.value = especialidad;
      option.textContent = especialidad;
      selectEspecialidad.appendChild(option);
    });

    // Función para aplicar filtros
    const applyNordvitalFilters = () => {
      state.nordvitalFilters.filteredData = nordvitalData.filter(record => {
        // Filtro por fecha
        if (state.nordvitalFilters.dateFrom && state.nordvitalFilters.dateTo) {
          const recordDate = record.fechacita;
          if (!recordDate || recordDate < state.nordvitalFilters.dateFrom || recordDate > state.nordvitalFilters.dateTo) {
            return false;
          }
        }
        
        // Filtro por tipo de cita (soporta 'tipocita' o 'rotulo')
        const recordTipo = (record.tipocita || record.rotulo || '').toString();
        if (state.nordvitalFilters.tipoCita && recordTipo !== state.nordvitalFilters.tipoCita) {
          return false;
        }
        
        // Filtro por médico (soporta 'mediconombre' o 'medico')
        const recordMedico = (record.mediconombre || record.medico || '').toString();
        if (state.nordvitalFilters.medico && recordMedico !== state.nordvitalFilters.medico) {
          return false;
        }

        // Filtro por nombre del médico
        const recordMedicoNombre = (record.mediconombre || '').toString();
        if (state.nordvitalFilters.medicoNombre && recordMedicoNombre !== state.nordvitalFilters.medicoNombre) {
          return false;
        }

        // Filtro por especialidad del médico
        const recordEspecialidad = (record.medicoespecialidad || '').toString();
        if (state.nordvitalFilters.medicoEspecialidad && recordEspecialidad !== state.nordvitalFilters.medicoEspecialidad) {
          return false;
        }
        
        return true;
      });
      
      state.nordvitalFilters.currentPage = 1;
      updateNordvitalMetrics();
      updateNordvitalCharts();
      renderNordvitalTable();
    };

    // Event listeners para filtros
    document.getElementById('filter-date-from').addEventListener('change', (e) => {
      state.nordvitalFilters.dateFrom = e.target.value;
      applyNordvitalFilters();
    });

    document.getElementById('filter-date-to').addEventListener('change', (e) => {
      state.nordvitalFilters.dateTo = e.target.value;
      applyNordvitalFilters();
    });

    document.getElementById('filter-tipo-cita').addEventListener('change', (e) => {
      state.nordvitalFilters.tipoCita = e.target.value;
      applyNordvitalFilters();
    });

    document.getElementById('filter-medico').addEventListener('change', (e) => {
      state.nordvitalFilters.medico = e.target.value;
      applyNordvitalFilters();
    });

    document.getElementById('filter-medico-nombre').addEventListener('change', (e) => {
      state.nordvitalFilters.medicoNombre = e.target.value;
      applyNordvitalFilters();
    });

    document.getElementById('filter-medico-especialidad').addEventListener('change', (e) => {
      state.nordvitalFilters.medicoEspecialidad = e.target.value;
      applyNordvitalFilters();
    });

    document.getElementById('btn-reset-filters').addEventListener('click', () => {
      document.getElementById('filter-date-from').value = '';
      document.getElementById('filter-date-to').value = '';
      document.getElementById('filter-tipo-cita').value = '';
      document.getElementById('filter-medico').value = '';
      document.getElementById('filter-medico-nombre').value = '';
      document.getElementById('filter-medico-especialidad').value = '';
      
      state.nordvitalFilters.dateFrom = '';
      state.nordvitalFilters.dateTo = '';
      state.nordvitalFilters.tipoCita = '';
      state.nordvitalFilters.medico = '';
      state.nordvitalFilters.medicoNombre = '';
      state.nordvitalFilters.medicoEspecialidad = '';
      
      applyNordvitalFilters();
    });

    // Búsqueda en tabla
    document.getElementById('nordvital-search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query === '') {
        state.nordvitalFilters.filteredData = nordvitalData.filter(record => {
          if (state.nordvitalFilters.dateFrom && state.nordvitalFilters.dateTo) {
            const recordDate = record.fechacita;
            if (!recordDate || recordDate < state.nordvitalFilters.dateFrom || recordDate > state.nordvitalFilters.dateTo) {
              return false;
            }
          }
          if (state.nordvitalFilters.tipoCita) {
            const recordTipo = (record.tipocita || record.rotulo || '').toString();
            if (recordTipo !== state.nordvitalFilters.tipoCita) return false;
          }
          if (state.nordvitalFilters.medico) {
            const recordMedico = (record.mediconombre || record.medico || '').toString();
            if (recordMedico !== state.nordvitalFilters.medico) return false;
          }
          return true;
        });
      } else {
        state.nordvitalFilters.filteredData = nordvitalData.filter(record => {
          // Aplicar otros filtros
          if (state.nordvitalFilters.dateFrom && state.nordvitalFilters.dateTo) {
            const recordDate = record.fechacita;
            if (!recordDate || recordDate < state.nordvitalFilters.dateFrom || recordDate > state.nordvitalFilters.dateTo) {
              return false;
            }
          }
          if (state.nordvitalFilters.tipoCita) {
            const recordTipo = (record.tipocita || record.rotulo || '').toString();
            if (recordTipo !== state.nordvitalFilters.tipoCita) return false;
          }
          if (state.nordvitalFilters.medico) {
            const recordMedico = (record.mediconombre || record.medico || '').toString();
            if (recordMedico !== state.nordvitalFilters.medico) return false;
          }
          
          // Búsqueda por texto
          return Object.values(record).some(val => 
            String(val).toLowerCase().includes(query)
          );
        });
      }
      state.nordvitalFilters.currentPage = 1;
      renderNordvitalTable();
    });

    // Función para actualizar métricas
    const updateNordvitalMetrics = () => {
      const filtered = state.nordvitalFilters.filteredData;
      const totalCitas = filtered.length;
      const completadas = filtered.filter(d => d.estado_cita === 'Completada').length;
      const incumplidas = filtered.filter(d => d.estado_cita === 'INCUMPLIDO' || d.estado_cita === 'Incumplido').length;
      const tasa = totalCitas > 0 ? ((completadas / totalCitas) * 100) : 0;

      document.getElementById('val-ecom-sales').textContent = totalCitas.toLocaleString('es-ES');
      document.getElementById('val-ecom-orders').textContent = completadas.toLocaleString('es-ES');
      document.getElementById('val-ecom-aov').textContent = incumplidas.toLocaleString('es-ES');
      document.getElementById('val-ecom-conv').textContent = `${tasa.toFixed(1)}%`;
    };

    // Función para actualizar gráficos
    const updateNordvitalCharts = () => {
      const filtered = state.nordvitalFilters.filteredData;
      
      // 1. Gráfico de tendencia por fecha
      const citasPorFecha = {};
      filtered.forEach(d => {
        const fecha = d.fechacita || 'Sin fecha';
        citasPorFecha[fecha] = (citasPorFecha[fecha] || 0) + 1;
      });
      
      const fechasOrdenadas = Object.keys(citasPorFecha).sort();
      const countsPorFecha = fechasOrdenadas.map(f => citasPorFecha[f]);

      const ctxTendencia = document.getElementById('chart-ecom-sales-forecast').getContext('2d');
      if (state.charts.ecomForecast) {
        state.charts.ecomForecast.data.labels = fechasOrdenadas.slice(-30);
        state.charts.ecomForecast.data.datasets[0].data = countsPorFecha.slice(-30);
        state.charts.ecomForecast.update();
      } else {
        const grad = getCanvasGradient(ctxTendencia, 'rgba(0, 229, 255, 0.3)', 'rgba(0, 229, 255, 0.0)', 300);
        state.charts.ecomForecast = new Chart(ctxTendencia, {
          type: 'line',
          data: {
            labels: fechasOrdenadas.slice(-30),
            datasets: [{
              label: 'Citas por Día',
              data: countsPorFecha.slice(-30),
              borderColor: '#00e5ff',
              backgroundColor: grad,
              fill: true,
              borderWidth: 3,
              tension: 0.35,
              pointBackgroundColor: '#00e5ff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '#e2e8f0', font: { family: 'Outfit', size: 11 } } }
            },
            scales: {
              x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' } },
              y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' } }
            }
          }
        });
      }

      // 2. Distribución por tipo de atención
      const citasPorTipo = {};
      filtered.forEach(d => {
        const tipo = (d.tipocita || d.rotulo || 'Sin tipo').toString();
        citasPorTipo[tipo] = (citasPorTipo[tipo] || 0) + 1;
      });

      const ctxTipos = document.getElementById('chart-ecom-channels').getContext('2d');
      if (state.charts.ecomChannels) {
        state.charts.ecomChannels.data.labels = Object.keys(citasPorTipo);
        state.charts.ecomChannels.data.datasets[0].data = Object.values(citasPorTipo);
        state.charts.ecomChannels.update();
      } else {
        state.charts.ecomChannels = new Chart(ctxTipos, {
          type: 'doughnut',
          data: {
            labels: Object.keys(citasPorTipo),
            datasets: [{
              data: Object.values(citasPorTipo),
              backgroundColor: ['#00e5ff', '#994cff', '#22c55e', '#f59e0b', '#ef4444'],
              borderWidth: 2,
              borderColor: '#0f172a'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { color: '#e2e8f0', font: { family: 'Inter', size: 10 } }
              }
            },
            cutout: '70%'
          }
        });
      }

      // 3. Top 10 médicos
      const citasPorMedico = {};
      filtered.forEach(d => {
        const medico = (d.mediconombre || d.medico || 'Sin médico').toString();
        citasPorMedico[medico] = (citasPorMedico[medico] || 0) + 1;
      });

      const topMedicos = Object.entries(citasPorMedico)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

      const ctxMedicos = document.getElementById('chart-ecom-products').getContext('2d');
      if (state.charts.ecomProducts) {
        state.charts.ecomProducts.data.labels = topMedicos.map(([m]) => m);
        state.charts.ecomProducts.data.datasets[0].data = topMedicos.map(([,c]) => c);
        state.charts.ecomProducts.update();
      } else {
        state.charts.ecomProducts = new Chart(ctxMedicos, {
          type: 'bar',
          data: {
            labels: topMedicos.map(([m]) => m),
            datasets: [{
              label: 'Cantidad de Citas',
              data: topMedicos.map(([,c]) => c),
              backgroundColor: 'rgba(153, 76, 255, 0.75)',
              borderColor: '#994cff',
              borderWidth: 1.5,
              borderRadius: 6
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#94a3b8', font: { size: 9 } } },
              y: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { size: 9 } } }
            }
          }
        });
      }
    };

    // Función para renderizar tabla
    const renderNordvitalTable = () => {
      const filtered = state.nordvitalFilters.filteredData;
      const page = state.nordvitalFilters.currentPage;
      const perPage = state.nordvitalFilters.rowsPerPage;

      const startIndex = (page - 1) * perPage;
      const endIndex = Math.min(startIndex + perPage, filtered.length);
      const pageRows = filtered.slice(startIndex, endIndex);

      const headers = ['Fecha Cita', 'Paciente', 'Edad', 'Médico', 'Especialidad', 'Tipo de Cita', 'Estado', 'Régimen'];
      const headerRow = document.getElementById('nordvital-headers');
      headerRow.innerHTML = headers.map(h => `<th>${h}</th>`).join('');

      const tableBody = document.getElementById('nordvital-body');
      if (pageRows.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="${headers.length}" style="text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron registros coincidentes</td></tr>`;
      } else {
        tableBody.innerHTML = pageRows.map(row => {
          return `<tr>
            <td>${row.fechacita || '-'}</td>
            <td>${row.nombrecompleto || '-'}</td>
            <td>${row.edadanios || '-'}</td>
            <td>${row.mediconombre || '-'}</td>
            <td>${row.medicoespecialidad || '-'}</td>
            <td>${row.tipocita || '-'}</td>
            <td>${row.estado_cita || '-'}</td>
            <td>${row.regimen || '-'}</td>
          </tr>`;
        }).join('');
      }

      const totalPages = Math.ceil(filtered.length / perPage);
      document.getElementById('nordvital-pagination-info').textContent = `Mostrando ${filtered.length > 0 ? startIndex + 1 : 0} a ${endIndex} de ${filtered.length} registros`;
      
      document.getElementById('btn-nordvital-prev').disabled = page === 1;
      document.getElementById('btn-nordvital-next').disabled = page >= totalPages || totalPages === 0;
    };

    // Event listeners de paginación
    document.getElementById('btn-nordvital-prev').addEventListener('click', () => {
      if (state.nordvitalFilters.currentPage > 1) {
        state.nordvitalFilters.currentPage--;
        renderNordvitalTable();
      }
    });

    document.getElementById('btn-nordvital-next').addEventListener('click', () => {
      const totalPages = Math.ceil(state.nordvitalFilters.filteredData.length / state.nordvitalFilters.rowsPerPage);
      if (state.nordvitalFilters.currentPage < totalPages) {
        state.nordvitalFilters.currentPage++;
        renderNordvitalTable();
      }
    });

    // Inicializar
    updateNordvitalMetrics();
    updateNordvitalCharts();
    renderNordvitalTable();
  };

  // --- SECCIÓN 3: GESTOR DE CARGA CSV PERSONALIZADA (CIENCIA DE DATOS) ---
  const csvDropzone = document.getElementById('csv-dropzone');
  const fileInput = document.getElementById('csv-file-input');
  const btnBrowse = document.getElementById('btn-browse-file');
  const analysisResults = document.getElementById('csv-analysis-results');
  
  // Triggers de subida manual
  btnBrowse.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  csvDropzone.addEventListener('click', () => {
    fileInput.click();
  });

  // Drag and Drop
  csvDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    csvDropzone.classList.add('dragover');
  });

  csvDropzone.addEventListener('dragleave', () => {
    csvDropzone.classList.remove('dragover');
  });

  csvDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    csvDropzone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processCSVFile(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      processCSVFile(e.target.files[0]);
    }
  });

  // Procesar archivo CSV
  const processCSVFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      alert('Por favor, selecciona un archivo formato .CSV válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      parseCSVText(event.target.result);
    };
    reader.readAsText(file);
  };

  // Parser de CSV robusto para desarrollo web sin dependencias externas
  const parseCSVText = (text) => {
    // Función auxiliar para parsear una línea respetando comillas
    const parseCSVLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = null;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if ((char === '"' || char === "'") && (i === 0 || line[i - 1] !== '\\')) {
          if (!inQuotes) {
            inQuotes = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inQuotes = false;
            quoteChar = null;
          } else {
            current += char;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      alert('El archivo CSV está vacío o le faltan filas.');
      return;
    }

    // Extraer cabeceras
    const rawHeaders = parseCSVLine(lines[0]);
    state.customData.headers = rawHeaders.map(h => h.replace(/["']/g, '').trim());

    // Extraer filas
    state.customData.rows = lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const rowObject = {};
      state.customData.headers.forEach((header, index) => {
        let val = values[index] !== undefined ? values[index].replace(/["']/g, '').trim() : '';
        // Intentar parsear a número
        if (!isNaN(val) && val !== '') {
          rowObject[header] = Number(val);
        } else {
          rowObject[header] = val;
        }
      });
      return rowObject;
    });

    state.customData.filteredRows = [...state.customData.rows];
    state.customData.currentPage = 1;

    renderCSVAnalysis();
  };

  // Renderizar los análisis estadísticos de las columnas del CSV
  const renderCSVAnalysis = () => {
    const headers = state.customData.headers;
    const rows = state.customData.rows;

    const statsGrid = document.getElementById('stats-cards-grid');
    statsGrid.innerHTML = ''; // Limpiar

    // Tarjeta de dimensiones del dataset
    const dimCard = document.createElement('div');
    dimCard.className = 'stat-metric-card';
    dimCard.innerHTML = `
      <div class="stat-label">Tamaño del Dataset</div>
      <div class="stat-value">${rows.length} filas × ${headers.length} col</div>
    `;
    statsGrid.appendChild(dimCard);

    // Encontrar columnas numéricas para análisis
    const numericColumns = headers.filter(header => {
      return rows.some(row => typeof row[header] === 'number');
    });

    // Crear análisis descriptivo de hasta 3 columnas numéricas principales
    numericColumns.slice(0, 3).forEach(col => {
      const values = rows.map(r => r[col]).filter(v => typeof v === 'number');
      const mean = engine.calculateMean(values);
      const stdDev = engine.calculateStandardDeviation(values, mean);

      const statCard = document.createElement('div');
      statCard.className = 'stat-metric-card';
      statCard.innerHTML = `
        <div class="stat-label">Promedio (${col})</div>
        <div class="stat-value">$${Math.round(mean).toLocaleString('es-ES')}</div>
        <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.35rem;">
          Desv. Estándar: ±${Math.round(stdDev).toLocaleString('es-ES')}
        </div>
      `;
      statsGrid.appendChild(statCard);
    });

    // Mostrar sección
    analysisResults.style.display = 'flex';
    renderTablePage();
    setupTableEvents();
  };

  // Renderizar la página actual de la tabla interactiva
  const renderTablePage = () => {
    const headers = state.customData.headers;
    const filtered = state.customData.filteredRows;
    const page = state.customData.currentPage;
    const perPage = state.customData.rowsPerPage;

    const headerRow = document.getElementById('table-headers-row');
    const tableBody = document.getElementById('table-body');

    // 1. Dibujar Cabeceras
    headerRow.innerHTML = headers.map(h => `<th>${h}</th>`).join('');

    // 2. Paginación de filas
    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, filtered.length);
    const pageRows = filtered.slice(startIndex, endIndex);

    // 3. Dibujar filas
    if (pageRows.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="${headers.length}" style="text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron registros coincidentes</td></tr>`;
    } else {
      tableBody.innerHTML = pageRows.map(row => {
        return `<tr>${headers.map(h => {
          const val = row[h];
          return `<td>${typeof val === 'number' ? val.toLocaleString('es-ES') : val}</td>`;
        }).join('')}</tr>`;
      }).join('');
    }

    // 4. Actualizar estado de botones y metadatos de paginación
    const totalPages = Math.ceil(filtered.length / perPage);
    document.getElementById('pagination-info').textContent = `Mostrando ${filtered.length > 0 ? startIndex + 1 : 0} a ${endIndex} de ${filtered.length} registros`;
    
    document.getElementById('btn-prev-page').disabled = page === 1;
    document.getElementById('btn-next-page').disabled = page >= totalPages || totalPages === 0;
  };

  // Configurar filtrado interactivo y botones de paginación de la tabla
  const setupTableEvents = () => {
    const searchInput = document.getElementById('table-search-input');
    const btnPrev = document.getElementById('btn-prev-page');
    const btnNext = document.getElementById('btn-next-page');

    // Manejar búsquedas de usuarios
    searchInput.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      state.customData.filteredRows = state.customData.rows.filter(row => {
        return Object.values(row).some(val => 
          String(val).toLowerCase().includes(query)
        );
      });

      state.customData.currentPage = 1;
      renderTablePage();
    };

    btnPrev.onclick = () => {
      if (state.customData.currentPage > 1) {
        state.customData.currentPage--;
        renderTablePage();
      }
    };

    btnNext.onclick = () => {
      const totalPages = Math.ceil(state.customData.filteredRows.length / state.customData.rowsPerPage);
      if (state.customData.currentPage < totalPages) {
        state.customData.currentPage++;
        renderTablePage();
      }
    };
  };

  // Carga de Muestras de Archivos para Demostraciones del Explorador
  document.getElementById('btn-load-sample-saas').addEventListener('click', () => {
    const csvContent = 
`Mes,MRR,Usuarios Activos,Tasa Cancelacion (%),LTV,CAC
Enero,12000,850,3.5,2200,320
Febrero,12480,885,3.2,2350,310
Marzo,13100,920,3.6,2100,335
Abril,13600,955,3.0,2400,305
Mayo,14200,995,3.4,2250,325
Junio,14900,1035,3.1,2500,315
Julio,15600,1080,2.9,2700,300
Agosto,16100,1115,3.5,2100,330
Septiembre,16800,1150,3.2,2350,315
Octubre,17600,1195,3.0,2600,310
Noviembre,18400,1240,2.8,2800,295
Diciembre,19500,1310,2.5,3100,285`;
    
    parseCSVText(csvContent);
  });

  document.getElementById('btn-load-sample-ecom').addEventListener('click', () => {
    const csvContent = 
`Mes,Ventas ($),Pedidos,Ticket Promedio,Tasa de Conversion (%)
Enero,22500,346,65,2.1
Febrero,21250,317,67,2.0
Marzo,25000,378,66,2.3
Abril,26250,403,65,2.4
Mayo,27500,410,67,2.5
Junio,30000,434,69,2.6
Julio,28750,416,69,2.5
Agosto,23750,365,65,2.2
Septiembre,25000,373,67,2.3
Octubre,28750,422,68,2.5
Noviembre,37500,535,70,2.8
Diciembre,45000,625,72,3.1`;

    parseCSVText(csvContent);
  });

  // --- CARGA INICIAL DE SECCIONES ---
  initSaaSSection();
  initEcomSection();
});
