// 全局数据对象
let dashboardData = {
    monthlySales: [],
    regionalSales: [],
    staffSales: []
};

// 初始化应用
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderDashboard();
    renderDataManagement();
});

// 加载数据
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();
        dashboardData = { ...data };
        
        // 从浏览器本地存储读取以支持编辑
        const savedData = localStorage.getItem('dashboardData');
        if (savedData) {
            dashboardData = JSON.parse(savedData);
        }
    } catch (error) {
        console.error('Error loading data:', error);
        alert('加载数据失败，使用默认数据');
        loadDefaultData();
    }
}

// 加载默认数据
function loadDefaultData() {
    dashboardData = {
        monthlySales: [
            { month: "2025年1月", amount: 450000 },
            { month: "2025年2月", amount: 520000 },
            { month: "2025年3月", amount: 610000 },
            { month: "2025年4月", amount: 580000 },
            { month: "2025年5月", amount: 720000 },
            { month: "2025年6月", amount: 890000 },
            { month: "2025年7月", amount: 750000 },
            { month: "2025年8月", amount: 920000 },
            { month: "2025年9月", amount: 1100000 },
            { month: "2025年10月", amount: 1350000 },
            { month: "2025年11月", amount: 1200000 },
            { month: "2025年12月", amount: 1600000 }
        ],
        regionalSales: [
            { region: "华东地区", amount: 850000 },
            { region: "华北地区", amount: 720000 },
            { region: "华中地区", amount: 580000 },
            { region: "华南地区", amount: 950000 },
            { region: "东北地区", amount: 420000 },
            { region: "西北地区", amount: 380000 },
            { region: "西南地区", amount: 520000 }
        ],
        staffSales: [
            { name: "张三", currentSales: 380000, lastMonthSales: 320000 },
            { name: "李四", currentSales: 350000, lastMonthSales: 380000 },
            { name: "王五", currentSales: 320000, lastMonthSales: 300000 },
            { name: "赵六", currentSales: 290000, lastMonthSales: 250000 },
            { name: "孙七", currentSales: 260000, lastMonthSales: 280000 },
            { name: "周八", currentSales: 250000, lastMonthSales: 240000 }
        ]
    };
}

// ==================== 仪表板相关函数 ====================

function renderDashboard() {
    renderMonthlySalesChart();
    renderRegionalMap();
    renderStaffSalesList();
    renderMetrics();
}

// 1. 渲染近12个月销售柱状图
function renderMonthlySalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // 销毁旧图表
    if (window.salesChartInstance) {
        window.salesChartInstance.destroy();
    }

    const labels = dashboardData.monthlySales.map(item => item.month);
    const amounts = dashboardData.monthlySales.map(item => item.amount);

    window.salesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '销售金额',
                data: amounts,
                backgroundColor: 'rgba(102, 126, 234, 0.7)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 4,
                hoverBackgroundColor: 'rgba(102, 126, 234, 0.9)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '¥' + (value / 10000).toFixed(0) + '万';
                        }
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

// 2. 渲染中国地图
function renderRegionalMap() {
    const mapContainer = document.getElementById('mapChart');
    if (!mapContainer) return;

    const myChart = echarts.init(mapContainer);

    // 创建地图数据
    const mapData = dashboardData.regionalSales.map(item => ({
        name: item.region,
        value: item.amount
    }));

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (params.componentSubType === 'scatter') {
                    return params.name + ': ¥' + (params.value / 10000).toFixed(0) + '万';
                }
                return params.name;
            }
        },
        visualMap: {
            min: 0,
            max: Math.max(...dashboardData.regionalSales.map(item => item.amount)),
            text: ['高', '低'],
            realtime: true,
            inRange: {
                color: ['#E0FFFF', '#006EFF']
            }
        },
        series: [
            {
                name: '销售金额',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: [
                    { name: "华东地区", value: [120, 30, dashboardData.regionalSales[0].amount] },
                    { name: "华北地区", value: [110, 40, dashboardData.regionalSales[1].amount] },
                    { name: "华中地区", value: [115, 35, dashboardData.regionalSales[2].amount] },
                    { name: "华南地区", value: [125, 20, dashboardData.regionalSales[3].amount] },
                    { name: "东北地区", value: [130, 50, dashboardData.regionalSales[4].amount] },
                    { name: "西北地区", value: [80, 45, dashboardData.regionalSales[5].amount] },
                    { name: "西南地区", value: [100, 25, dashboardData.regionalSales[6].amount] }
                ],
                symbolSize: function(val) {
                    return val[2] / 100000 * 30;
                },
                itemStyle: {
                    color: '#667eea'
                }
            }
        ]
    };

    myChart.setOption(option);
    window.addEventListener('resize', () => {
        myChart.resize();
    });
}

// 3. 渲染员工销售列表
function renderStaffSalesList() {
    const tbody = document.getElementById('staffTableBody');
    if (!tbody) return;

    // 按销售金额排序
    const sortedStaff = [...dashboardData.staffSales].sort((a, b) => 
        b.currentSales - a.currentSales
    );

    tbody.innerHTML = sortedStaff.map((staff, index) => {
        const growth = staff.currentSales - staff.lastMonthSales;
        const growthPercent = ((growth / staff.lastMonthSales) * 100).toFixed(1);
        const growthClass = growth >= 0 ? 'positive' : 'negative';
        const growthSymbol = growth >= 0 ? '+' : '';

        return `
            <tr>
                <td><span class="rank-badge rank-${index + 1}">${index + 1}</span></td>
                <td>${staff.name}</td>
                <td>¥${(staff.currentSales / 10000).toFixed(1)}万</td>
                <td><span class="${growthClass}">${growthSymbol}${growthPercent}%</span></td>
            </tr>
        `;
    }).join('');

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .rank-badge {
            display: inline-block;
            width: 28px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            border-radius: 50%;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }
        .rank-1 { background: #FFD700; }
        .rank-2 { background: #C0C0C0; }
        .rank-3 { background: #CD7F32; }
        .rank-4, .rank-5, .rank-6 { background: #667eea; }
        .positive { color: #4caf50; font-weight: bold; }
        .negative { color: #f44336; font-weight: bold; }
    `;
    if (!document.head.querySelector('style[data-rank-style]')) {
        style.setAttribute('data-rank-style', 'true');
        document.head.appendChild(style);
    }
}

// 4. 渲染关键指标
function renderMetrics() {
    const totalSales = dashboardData.monthlySales[dashboardData.monthlySales.length - 1]?.amount || 0;
    const totalStaffSales = dashboardData.staffSales.reduce((sum, staff) => sum + staff.currentSales, 0);
    const avgSales = dashboardData.staffSales.length > 0 ? totalStaffSales / dashboardData.staffSales.length : 0;

    document.getElementById('totalSales').textContent = '¥' + (totalSales / 10000).toFixed(1) + '万';
    document.getElementById('avgSales').textContent = '¥' + (avgSales / 10000).toFixed(1) + '万';
    document.getElementById('orderCount').textContent = dashboardData.staffSales.length * 15;
    document.getElementById('staffCount').textContent = dashboardData.staffSales.length;
}

// ==================== 数据管理相关函数 ====================

function renderDataManagement() {
    renderMonthlySalesTable();
    renderRegionalSalesTable();
    renderStaffSalesTable();
}

// 渲染月份销售编辑表
function renderMonthlySalesTable() {
    const tbody = document.getElementById('monthlySalesBody');
    if (!tbody) return;

    tbody.innerHTML = dashboardData.monthlySales.map((item, index) => `
        <tr>
            <td><input type="text" value="${item.month}" onchange="updateMonthlySales(${index}, 'month', this.value)"></td>
            <td><input type="number" value="${item.amount}" onchange="updateMonthlySales(${index}, 'amount', this.value)"></td>
            <td><button class="btn-delete" onclick="deleteMonthlySales(${index})">删除</button></td>
        </tr>
    `).join('');
}

// 渲染地区销售编辑表
function renderRegionalSalesTable() {
    const tbody = document.getElementById('regionalSalesBody');
    if (!tbody) return;

    tbody.innerHTML = dashboardData.regionalSales.map((item, index) => `
        <tr>
            <td><input type="text" value="${item.region}" onchange="updateRegionalSales(${index}, 'region', this.value)"></td>
            <td><input type="number" value="${item.amount}" onchange="updateRegionalSales(${index}, 'amount', this.value)"></td>
            <td><button class="btn-delete" onclick="deleteRegionalSales(${index})">删除</button></td>
        </tr>
    `).join('');
}

// 渲染员工销售编辑表
function renderStaffSalesTable() {
    const tbody = document.getElementById('staffSalesBody');
    if (!tbody) return;

    tbody.innerHTML = dashboardData.staffSales.map((item, index) => `
        <tr>
            <td><input type="text" value="${item.name}" onchange="updateStaffSales(${index}, 'name', this.value)"></td>
            <td><input type="number" value="${item.currentSales}" onchange="updateStaffSales(${index}, 'currentSales', this.value)"></td>
            <td><input type="number" value="${item.lastMonthSales}" onchange="updateStaffSales(${index}, 'lastMonthSales', this.value)"></td>
            <td><button class="btn-delete" onclick="deleteStaffSales(${index})">删除</button></td>
        </tr>
    `).join('');
}

// 更新月份销售数据
function updateMonthlySales(index, field, value) {
    if (field === 'amount') {
        dashboardData.monthlySales[index].amount = parseFloat(value) || 0;
    } else {
        dashboardData.monthlySales[index][field] = value;
    }
}

// 删除月份销售行
function deleteMonthlySales(index) {
    if (confirm('确定删除该行吗？')) {
        dashboardData.monthlySales.splice(index, 1);
        renderMonthlySalesTable();
    }
}

// 添加月份销售行
function addMonthlyRow() {
    const newMonth = new Date();
    const monthStr = `${newMonth.getFullYear()}年${String(newMonth.getMonth() + 1).padStart(2, '0')}月`;
    dashboardData.monthlySales.push({
        month: monthStr,
        amount: 0
    });
    renderMonthlySalesTable();
}

// 更新地区销售数据
function updateRegionalSales(index, field, value) {
    if (field === 'amount') {
        dashboardData.regionalSales[index].amount = parseFloat(value) || 0;
    } else {
        dashboardData.regionalSales[index][field] = value;
    }
}

// 删除地区销售行
function deleteRegionalSales(index) {
    if (confirm('确定删除该行吗？')) {
        dashboardData.regionalSales.splice(index, 1);
        renderRegionalSalesTable();
    }
}

// 添加地区销售行
function addRegionalRow() {
    dashboardData.regionalSales.push({
        region: '新地区',
        amount: 0
    });
    renderRegionalSalesTable();
}

// 更新员工销售数据
function updateStaffSales(index, field, value) {
    if (field === 'currentSales' || field === 'lastMonthSales') {
        dashboardData.staffSales[index][field] = parseFloat(value) || 0;
    } else {
        dashboardData.staffSales[index][field] = value;
    }
}

// 删除员工销售行
function deleteStaffSales(index) {
    if (confirm('确定删除该行吗？')) {
        dashboardData.staffSales.splice(index, 1);
        renderStaffSalesTable();
    }
}

// 添加员工销售行
function addStaffRow() {
    dashboardData.staffSales.push({
        name: '新员工',
        currentSales: 0,
        lastMonthSales: 0
    });
    renderStaffSalesTable();
}

// 保存数据
function saveData() {
    try {
        localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
        alert('数据已保存！');
        renderDashboard();
    } catch (error) {
        console.error('Error saving data:', error);
        alert('保存数据失败');
    }
}

// 重置为默认数据
function resetData() {
    if (confirm('确定要重置为默认数据吗？这将丢失所有修改！')) {
        loadDefaultData();
        localStorage.removeItem('dashboardData');
        renderDataManagement();
        renderDashboard();
        alert('已重置为默认数据');
    }
}

// ==================== 视图切换 ====================

function showDashboard() {
    document.getElementById('dashboard-view').classList.add('active');
    document.getElementById('data-mgmt-view').classList.remove('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 重新渲染图表以确保正确显示
    setTimeout(() => {
        renderDashboard();
    }, 100);
}

function showDataManagement() {
    document.getElementById('dashboard-view').classList.remove('active');
    document.getElementById('data-mgmt-view').classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderDataManagement();
}

// 标签页切换
function switchTab(tabName) {
    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 移除所有按钮的活跃状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签内容
    document.getElementById(tabName).classList.add('active');
    
    // 添加按钮的活跃状态
    event.target.classList.add('active');
}
