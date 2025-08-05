const endpoint = 'http://localhost:3000/leer.php';

let tempChart, humChart;

const fetchData = async () => {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error('Error al obtener los datos del servidor.');
        }

        return data.datos;
    } catch (error) {
        console.error(error);
        alert('Hubo un problema al cargar los datos.');
        return [];
    }
};

const renderChart = (canvasId, label, data, color, existingChart, yRange) => {
    const ctx = document.getElementById(canvasId);

    const chartData = {
        labels: data.map(d => d.fecha),
        datasets: [{
            label,
            data: data.map(d => d[label.toLowerCase()]),
            borderColor: color,
            backgroundColor: `${color}33`,
            fill: true,
            tension: 0.3
        }]
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false,
                ...(yRange && { min: yRange.min, max: yRange.max }) // solo si yRange está definido
            }
        }
    };

    if (existingChart) {
        existingChart.data = chartData;
        existingChart.options = options;
        existingChart.update();
        return existingChart;
    }

    return new Chart(ctx, {
        type: 'line',
        data: chartData,
        options
    });
};

const actualizarUltimaFecha = () => {
    const span = document.getElementById('ultima-actualizacion');
    const ahora = new Date();
    const fechaFormateada = ahora.toLocaleString();
    span.textContent = `Última actualización: ${fechaFormateada}`;
};

const actualizarDashboard = async () => {
    const datos = await fetchData();
    if (datos.length === 0) return;

    tempChart = renderChart('tempChart', 'Temp', datos, 'rgba(255, 99, 132, 1)', tempChart, { min: 0, max: 100 });
    humChart = renderChart('humChart', 'Hum', datos, 'rgba(54, 162, 235, 1)', humChart, { min: 0, max: 100 });

    actualizarUltimaFecha();
};

const initDashboard = () => {
    actualizarDashboard();
    setInterval(actualizarDashboard, 30000); // cada 30 segundos
};

document.addEventListener('DOMContentLoaded', initDashboard);
