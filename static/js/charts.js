// Financial Charts Handler using Chart.js — Modern Fintech Light Theme

const FIN_CHART_COLORS = {
    primary: '#2563EB',
    primarySoft: 'rgba(37, 99, 235, 0.12)',
    teal: '#0D9488',
    tealSoft: 'rgba(13, 148, 136, 0.12)',
    purple: '#A78BFA',
    purpleSoft: 'rgba(167, 139, 250, 0.15)',
    green: '#16A34A',
    greenSoft: 'rgba(22, 163, 74, 0.12)',
    amber: '#F59E0B',
    amberSoft: 'rgba(245, 158, 11, 0.15)',
    red: '#EF4444',
    redSoft: 'rgba(239, 68, 68, 0.12)',
    textMain: '#1E293B',
    textMuted: '#64748B',
    gridLine: '#F1F5F9',
    palette: [
        '#2563EB', '#0D9488', '#A78BFA', '#16A34A', '#F59E0B',
        '#EC4899', '#38BDF8', '#6366F1', '#14B8A6', '#84CC16',
        '#F97316', '#64748B'
    ]
};

// Common Chart.js tooltip configuration for light mode
const LIGHT_TOOLTIP_CONFIG = {
    backgroundColor: '#FFFFFF',
    titleColor: '#1E293B',
    bodyColor: '#475569',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    padding: 10,
    boxPadding: 6,
    usePointStyle: true,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.08)'
};

function renderIncomeExpenseChart(canvasId, labels, incomeData, expenseData, currency = '₹') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: FIN_CHART_COLORS.green,
                    borderRadius: 6,
                    maxBarThickness: 28
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: FIN_CHART_COLORS.primary,
                    borderRadius: 6,
                    maxBarThickness: 28
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: { family: "'Inter', sans-serif", size: 12, weight: 500 },
                        color: FIN_CHART_COLORS.textMain
                    }
                },
                tooltip: {
                    ...LIGHT_TOOLTIP_CONFIG,
                    callbacks: {
                        label: function (context) {
                            return ` ${context.dataset.label}: ${currency}${Number(context.parsed.y).toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: FIN_CHART_COLORS.gridLine, drawBorder: false },
                    ticks: {
                        callback: function (value) {
                            return `${currency}${value >= 1000 ? (value / 1000) + 'k' : value}`;
                        },
                        font: { family: "'Inter', sans-serif", size: 11 },
                        color: FIN_CHART_COLORS.textMuted
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: "'Inter', sans-serif", size: 11 },
                        color: FIN_CHART_COLORS.textMuted
                    }
                }
            }
        }
    });
}

function renderCategoryDoughnut(canvasId, labels, data, currency = '₹') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (!data || data.length === 0 || data.every(v => v === 0)) {
        ctx.parentNode.innerHTML = `
            <div class="text-center py-5 text-muted">
                <div style="font-size: 2.2rem; color: #CBD5E1; margin-bottom: 8px;">📊</div>
                <div class="small fw-medium">No expense records found for this period</div>
            </div>`;
        return;
    }

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: FIN_CHART_COLORS.palette.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#FFFFFF',
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 14,
                        font: { family: "'Inter', sans-serif", size: 12 },
                        color: FIN_CHART_COLORS.textMain
                    }
                },
                tooltip: {
                    ...LIGHT_TOOLTIP_CONFIG,
                    callbacks: {
                        label: function (context) {
                            const val = context.parsed;
                            return ` ${context.label}: ${currency}${Number(val).toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
}

function renderSavingsLineChart(canvasId, labels, savingsData, currency = '₹') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Net Monthly Savings',
                data: savingsData,
                borderColor: FIN_CHART_COLORS.teal,
                backgroundColor: FIN_CHART_COLORS.tealSoft,
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: FIN_CHART_COLORS.teal,
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    ...LIGHT_TOOLTIP_CONFIG,
                    callbacks: {
                        label: function (context) {
                            return ` Net Savings: ${currency}${Number(context.parsed.y).toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: FIN_CHART_COLORS.gridLine, drawBorder: false },
                    ticks: {
                        callback: function (value) {
                            return `${currency}${value >= 1000 ? (value / 1000) + 'k' : value}`;
                        },
                        font: { family: "'Inter', sans-serif", size: 11 },
                        color: FIN_CHART_COLORS.textMuted
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: "'Inter', sans-serif", size: 11 },
                        color: FIN_CHART_COLORS.textMuted
                    }
                }
            }
        }
    });
}

function renderBudgetUtilizationChart(canvasId, categories, spentData, limitData, currency = '₹') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [
                {
                    label: 'Actual Spent',
                    data: spentData,
                    backgroundColor: FIN_CHART_COLORS.amber,
                    borderRadius: 4
                },
                {
                    label: 'Budget Limit',
                    data: limitData,
                    backgroundColor: FIN_CHART_COLORS.primary,
                    borderRadius: 4
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 10,
                        usePointStyle: true,
                        font: { family: "'Inter', sans-serif", size: 12 },
                        color: FIN_CHART_COLORS.textMain
                    }
                },
                tooltip: {
                    ...LIGHT_TOOLTIP_CONFIG,
                    callbacks: {
                        label: function (ctx) {
                            return ` ${ctx.dataset.label}: ${currency}${Number(ctx.parsed.x).toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: FIN_CHART_COLORS.gridLine, drawBorder: false },
                    ticks: {
                        callback: function (val) {
                            return `${currency}${val}`;
                        },
                        color: FIN_CHART_COLORS.textMuted
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        color: FIN_CHART_COLORS.textMain,
                        font: { family: "'Inter', sans-serif", size: 12 }
                    }
                }
            }
        }
    });
}
