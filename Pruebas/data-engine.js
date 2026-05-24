/**
 * Aether Analytics - Data Engine
 * Módulo de simulación de datos, estadística y motores de regresión.
 */

class DataEngine {
  constructor() {
    // Inicializar semillas para reproducibilidad si es necesario
  }

  // --- MÉTODOS ESTADÍSTICOS BÁSICOS ---

  calculateMean(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  calculateStandardDeviation(arr, mean = null) {
    if (!arr || arr.length <= 1) return 0;
    const avg = mean !== null ? mean : this.calculateMean(arr);
    const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = this.calculateMean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  /**
   * Calcula la regresión lineal simple: y = mx + b
   * @param {Array<number>} y - Valores dependientes (por ejemplo, ingresos históricos)
   * @returns {Object} { slope, intercept, r2 }
   */
  calculateLinearRegression(y) {
    const n = y.length;
    const x = Array.from({ length: n }, (_, i) => i); // [0, 1, 2, ..., n-1]

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, val, idx) => sum + val * y[idx], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calcular coeficiente de determinación R² (calidad de ajuste)
    const yMean = sumY / n;
    const ssTot = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
    const ssRes = y.reduce((sum, val, idx) => {
      const pred = slope * x[idx] + intercept;
      return sum + Math.pow(val - pred, 2);
    }, 0);

    const r2 = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);

    return { slope, intercept, r2 };
  }

  // --- SIMULADORES DE DATOS ---

  /**
   * Obtiene la comparación de atributos promedio para seleccionados vs rechazados
   */
  getSelectionAttributeComparison() {
    const data = window.internshipData || [];
    const selected = data.filter(d => d.selected === 1);
    const rejected = data.filter(d => d.selected === 0);

    const attributes = ['CGPA', 'skills_score', 'projects_count', 'communication_score', 'coding_test_score', 'resume_score'];
    
    const selectedAverages = attributes.map(attr => {
      const vals = selected.map(d => d[attr]);
      return parseFloat(this.calculateMean(vals).toFixed(2));
    });

    const rejectedAverages = attributes.map(attr => {
      const vals = rejected.map(d => d[attr]);
      return parseFloat(this.calculateMean(vals).toFixed(2));
    });

    return {
      labels: ['CGPA (Académico)', 'Habilidades (1-10)', 'Proyectos', 'Comunicación (1-10)', 'Prueba Técnica (1-10)', 'Currículum (1-10)'],
      selected: selectedAverages,
      rejected: rejectedAverages
    };
  }

  /**
   * Genera 12 meses de datos históricos de E-commerce
   */
  generateEcomData() {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    // Estacionalidad de ventas típica: pico en verano (rebajas) y gran pico en Nov/Dic (Black Friday, Navidad)
    const seasonality = [0.9, 0.85, 1.0, 1.05, 1.1, 1.2, 1.15, 0.95, 1.0, 1.15, 1.5, 1.8];
    const baseSales = 25000;

    return months.map((month, idx) => {
      const growthTrend = 1 + (idx * 0.025); // Tendencia de crecimiento subyacente
      const noise = 1 + (Math.random() * 0.1 - 0.05); // +/- 5% de ruido
      const sales = Math.round(baseSales * seasonality[idx] * growthTrend * noise);
      
      const aov = Math.round(65 + (Math.random() * 10 - 5)); // Valor promedio de pedido
      const orders = Math.round(sales / aov);
      const traffic = Math.round(orders / (0.022 + Math.random() * 0.008)); // Tasa de conversión de 2.2% a 3%
      
      return {
        month,
        sales,
        orders,
        aov,
        traffic,
        conversionRate: parseFloat(((orders / traffic) * 100).toFixed(2)),
        acquisition: {
          organic: Math.round(sales * 0.35),
          paidSearch: Math.round(sales * 0.28),
          socialMedia: Math.round(sales * 0.22),
          email: Math.round(sales * 0.15)
        },
        topProducts: [
          { name: "Auriculares Inalámbricos Pro", sales: Math.round(sales * 0.3) },
          { name: "Reloj Inteligente Fit", sales: Math.round(sales * 0.25) },
          { name: "Cargador Solar Portátil", sales: Math.round(sales * 0.2) },
          { name: "Teclado Mecánico RGB", sales: Math.round(sales * 0.15) },
          { name: "Soporte Ergonómico", sales: Math.round(sales * 0.1) }
        ]
      };
    });
  }

  // --- MOTORES DE PREDICCIÓN ---

  /**
   * Calcula la regresión lineal múltiple para predecir la selección
   */
  calculateMultipleLinearRegression() {
    const data = window.internshipData || [];
    if (data.length === 0) return { beta: [0, 0, 0, 0], r2: 0 };

    const X = data.map(d => [1, d.CGPA, d.skills_score, d.coding_test_score]);
    const Y = data.map(d => d.selected);
    const N = X.length;
    const P = 4; // Beta0, Beta1, Beta2, Beta3

    // XtX y XtY
    const XtX = Array.from({ length: P }, () => Array(P).fill(0));
    const XtY = Array(P).fill(0);

    for (let i = 0; i < N; i++) {
      const row = X[i];
      const yVal = Y[i];
      for (let r = 0; r < P; r++) {
        for (let c = 0; c < P; c++) {
          XtX[r][c] += row[r] * row[c];
        }
        XtY[r] += row[r] * yVal;
      }
    }

    // Resolución por eliminación Gaussiana
    const A = XtX.map(row => [...row]);
    const B = [...XtY];

    for (let i = 0; i < P; i++) {
      let maxRow = i;
      for (let k = i + 1; k < P; k++) {
        if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
          maxRow = k;
        }
      }
      const tempA = A[i]; A[i] = A[maxRow]; A[maxRow] = tempA;
      const tempB = B[i]; B[i] = B[maxRow]; B[maxRow] = tempB;

      const pivot = A[i][i];
      if (Math.abs(pivot) < 1e-12) continue;

      for (let k = i + 1; k < P; k++) {
        const factor = A[k][i] / pivot;
        for (let j = i; j < P; j++) {
          A[k][j] -= factor * A[i][j];
        }
        B[k] -= factor * B[i];
      }
    }

    const beta = Array(P).fill(0);
    for (let i = P - 1; i >= 0; i--) {
      let sum = B[i];
      for (let j = i + 1; j < P; j++) {
        sum -= A[i][j] * beta[j];
      }
      beta[i] = sum / A[i][i];
    }

    // Calcular R2
    const yMean = this.calculateMean(Y);
    let ssTot = 0;
    let ssRes = 0;
    for (let i = 0; i < N; i++) {
      const yVal = Y[i];
      const row = X[i];
      const yPred = beta[0] + beta[1] * row[1] + beta[2] * row[2] + beta[3] * row[3];
      ssTot += Math.pow(yVal - yMean, 2);
      ssRes += Math.pow(yVal - yPred, 2);
    }
    const r2 = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);

    return { beta, r2 };
  }

  /**
   * Obtiene la comparación entre el estudiante configurado y el promedio de seleccionados
   */
  getComparisonData(cgpa, skills, coding) {
    const data = window.internshipData || [];
    const selected = data.filter(d => d.selected === 1);
    
    const avgSelectedCGPA = this.calculateMean(selected.map(d => d.CGPA));
    const avgSelectedSkills = this.calculateMean(selected.map(d => d.skills_score));
    const avgSelectedCoding = this.calculateMean(selected.map(d => d.coding_test_score));

    return {
      labels: ['CGPA', 'Habilidades', 'Programación'],
      configured: [cgpa, skills, coding],
      selected: [
        parseFloat(avgSelectedCGPA.toFixed(2)),
        parseFloat(avgSelectedSkills.toFixed(2)),
        parseFloat(avgSelectedCoding.toFixed(2))
      ]
    };
  }

  /**
   * Genera una proyección futura de E-commerce ajustada por sliders
   */
  generateEcomForecast(historicalData, growthModifier = 1.0, marketingSpendModifier = 1.0, monthsToForecast = 6) {
    const lastData = historicalData[historicalData.length - 1];
    const salesHistory = historicalData.map(d => d.sales);
    const { slope, intercept } = this.calculateLinearRegression(salesHistory);

    const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const lastMonthIdx = monthLabels.indexOf(lastData.month);

    const forecast = [];

    for (let i = 1; i <= monthsToForecast; i++) {
      const nextMonthIdx = (lastMonthIdx + i) % 12;
      const label = monthLabels[nextMonthIdx] + ' (Proy)';

      // Estacionalidad esperada para el mes proyectado
      const seasonality = [0.9, 0.85, 1.0, 1.05, 1.1, 1.2, 1.15, 0.95, 1.0, 1.15, 1.5, 1.8];
      const monthSeason = seasonality[nextMonthIdx];

      // Base proyectada lineal
      const baseTrendSales = slope * (historicalData.length - 1 + i) + intercept;
      
      // Ajustar con estacionalidad, modificador de crecimiento y modificador de inversión en marketing
      const marketingImpact = 1 + (marketingSpendModifier - 1) * 0.15; // 15% de correlación de marketing
      const growthImpact = growthModifier;
      
      let projectedSales = Math.round(baseTrendSales * monthSeason * growthImpact * marketingImpact);
      projectedSales = Math.max(5000, projectedSales); // Límite inferior realista

      const projectedOrders = Math.round(projectedSales / lastData.aov);
      const projectedTraffic = Math.round(projectedOrders / (lastData.conversionRate / 100));

      forecast.push({
        month: label,
        sales: projectedSales,
        orders: projectedOrders,
        traffic: projectedTraffic
      });
    }

    return forecast;
  }
}

// Exportar para navegadores
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataEngine;
} else {
  window.DataEngine = DataEngine;
}
