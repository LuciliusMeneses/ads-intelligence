/**
 * Chart Helper for Google Ads styled line charts
 */
window.createGoogleAdsLineChart = function(canvasId, labels, data, color = '#1A73E8') {
  const ctx = document.getElementById(canvasId).getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        borderColor: color,
        backgroundColor: color + '1A', // 10% opacity
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#202124',
          titleFont: { size: 12, family: 'Roboto' },
          bodyFont: { size: 12, family: 'Roboto' },
          padding: 8,
          displayColors: false
        }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
};
