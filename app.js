// Configuration - Set your Google Apps Script deployment URL here
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxeVZ279ARV6k4SzR_pqry544M93ua1nc2V1BtT3YbWqQf8ygn_S89Mx3uL1NQmw08bww/exec';

// Base rate suggestions for Philippine market (in Philippine Peso)
const BASE_RATE_SUGGESTIONS = {
    monthly: {
        label: 'Suggested Monthly Salary',
        examples: '₱15,000 - ₱35,000',
        average: 25000
    },
    daily: {
        label: 'Suggested Daily Rate',
        examples: '₱700 - ₱1,600',
        average: 1150
    },
    hourly: {
        label: 'Suggested Hourly Rate',
        examples: '₱150 - ₱300',
        average: 225
    }
};

let isEditMode = false;
let currentEditId = null;
let allEmployees = [];
let selectedEmployee = null;
let payrollHistory = [];

// Inline logo so html2canvas export works even on `file://` (avoids tainted canvas).
const COMS_LOGO_DATA_URL = "data:image/jpeg;base64,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";

// DOM Elements
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const employeeModal = document.getElementById('employeeModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const employeeForm = document.getElementById('employeeForm');
const employeeTableContainer = document.getElementById('employeeTableContainer');
const alertContainer = document.getElementById('alertContainer');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const salaryTypeSelect = document.getElementById('salaryType');
const baseRateInput = document.getElementById('baseRate');
const employeeIdInput = document.getElementById('employeeId');
const employeeCountBadge = document.getElementById('employeeCountBadge');
const payslipPreviewModal = document.getElementById('payslipPreviewModal');
const payslipModalCloseBtn = document.getElementById('payslipModalCloseBtn');
const closePayslipPreviewBtn = document.getElementById('closePayslipPreviewBtn');
const downloadPayslipPngBtn = document.getElementById('downloadPayslipPngBtn');
const payslipPreviewContent = document.getElementById('payslipPreviewContent');

// Event Listeners
addEmployeeBtn.addEventListener('click', () => openModal());
modalCloseBtn.addEventListener('click', () => closeModal());
modalCancelBtn.addEventListener('click', () => closeModal());
employeeForm.addEventListener('submit', handleFormSubmit);
salaryTypeSelect.addEventListener('change', updateBaseRateSuggestion);
if (payslipModalCloseBtn) payslipModalCloseBtn.addEventListener('click', closePayslipPreviewModal);
if (closePayslipPreviewBtn) closePayslipPreviewBtn.addEventListener('click', closePayslipPreviewModal);
if (downloadPayslipPngBtn) downloadPayslipPngBtn.addEventListener('click', downloadPayslipAsPNG);

employeeTableContainer.addEventListener('click', (event) => {
    const employeeRow = event.target.closest('.employee-row');
    if (!employeeRow) return;

    const employeeId = employeeRow.dataset.employeeId;
    if (employeeId) selectEmployee(employeeId);
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closePayslipPreviewModal();
    }
});

// Close modal when clicking outside
employeeModal.addEventListener('click', (e) => {
    if (e.target === employeeModal) closeModal();
});
if (payslipPreviewModal) {
    payslipPreviewModal.addEventListener('click', (e) => {
        if (e.target === payslipPreviewModal) closePayslipPreviewModal();
    });
}

/**
 * Generates the next employee ID
 */
function generateEmployeeId() {
    if (allEmployees.length === 0) {
        return 'EMP-001';
    }
    
    const maxNumber = Math.max(...allEmployees.map(emp => {
        const match = emp.id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }));
    
    const nextNumber = maxNumber + 1;
    return `EMP-${String(nextNumber).padStart(3, '0')}`;
}

/**
 * Opens the modal for adding or editing an employee
 */
function openModal(employee = null) {
    isEditMode = !!employee;
    currentEditId = employee?.id || null;

    employeeForm.reset();
    salaryTypeSelect.value = '';
    baseRateInput.placeholder = 'Enter amount';

    if (isEditMode && employee) {
        modalTitle.textContent = 'Edit Employee';
        submitBtn.textContent = 'Update Employee';
        employeeIdInput.value = employee.id;
        document.getElementById('employeeName').value = employee.name;
        document.getElementById('employeeRole').value = employee.role;
        salaryTypeSelect.value = employee.salaryType;
        baseRateInput.value = employee.baseRate;
    } else {
        modalTitle.textContent = 'Add New Employee';
        submitBtn.textContent = 'Add Employee';
        employeeIdInput.value = generateEmployeeId();
    }

    updateBaseRateSuggestion();
    employeeModal.classList.add('active');
}

/**
 * Closes the modal and resets the form
 */
function closeModal() {
    employeeModal.classList.remove('active');
    employeeForm.reset();
    isEditMode = false;
    currentEditId = null;
    selectedEmployee = null;
    updatePayrollPanel();
}

/**
 * Updates base rate suggestion based on salary type
 */
function updateBaseRateSuggestion() {
    const salaryType = salaryTypeSelect.value;
    const suggestion = salaryType && BASE_RATE_SUGGESTIONS[salaryType] ? BASE_RATE_SUGGESTIONS[salaryType] : null;

    if (suggestion) {
        baseRateInput.placeholder = `${suggestion.examples} • avg ${new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0
        }).format(suggestion.average)}`;
    } else {
        baseRateInput.placeholder = 'Enter amount';
    }

    if (!isEditMode) {
        baseRateInput.value = '';
    }
}

/**
 * Fetches employees from the backend and displays them in the table
 */
async function loadEmployees() {
    try {
        employeeTableContainer.innerHTML = '<div class="loading"><span class="spinner"></span>Loading employees...</div>';

        const response = await fetch(`${SCRIPT_URL}?action=listEmployees`);
        const data = await response.json();

        if (!data.success) {
            showAlert('Error loading employees', 'error');
            return;
        }

        allEmployees = data.employees || [];
        displayEmployees(allEmployees);
        updatePayrollPanel();
        await loadPayrollHistory();
    } catch (error) {
        console.error('Error:', error);
        employeeTableContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12" y2="13" />
                        <circle cx="12" cy="17" r="1" />
                    </svg>
                </div>
                <p>Failed to load employees. Make sure the script URL is configured.</p>
            </div>
        `;
    }
}

/**
 * Displays employees in a table
 */
function displayEmployees(employees) {
    const sortedEmployees = (employees || []).slice().sort((a, b) =>
        a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
    );
    const count = sortedEmployees.length;
    employeeCountBadge.textContent = count;

    if (count === 0) {
        employeeTableContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M9 11a4 4 0 1 1 6 0 4 4 0 0 1-6 0z" />
                        <path d="M2 21c1.333-3 4-5 7-5h6c3 0 5.667 2 7 5" />
                    </svg>
                </div>
                <p>No employees yet. Click "Add Employee" to get started.</p>
            </div>
        `;
        return;
    }

    const listHTML = `
        <div class="employee-list">
            ${sortedEmployees.map(emp => `
                <article class="employee-row ${selectedEmployee && selectedEmployee.id === emp.id ? 'selected' : ''}" data-employee-id="${emp.id}">
                    <div class="emp-avatar">${escapeHtml(emp.name.charAt(0) || '?')}</div>
                    <div class="emp-info">
                        <p class="emp-name">${escapeHtml(emp.name)}</p>
                        <p class="emp-meta">${escapeHtml(emp.role)} • ${escapeHtml(emp.salaryType)} • ${new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2
                        }).format(emp.baseRate)}</p>
                    </div>
                    <span class="emp-type-tag emp-type-${emp.salaryType}">${escapeHtml(emp.salaryType)}</span>
                    <div class="emp-actions">
                        <button class="btn-emp-action btn-edit" onclick="event.stopPropagation(); handleEditEmployee('${emp.id}')" title="Edit employee">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.999 3 21 4 17l12.5-12.5z" />
                            </svg>
                        </button>
                        <button class="btn-emp-action btn-emp-delete" onclick="event.stopPropagation(); handleDeleteEmployee('${emp.id}')" title="Delete employee">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                            </svg>
                        </button>
                    </div>
                </article>
            `).join('')}
        </div>
    `;

    employeeTableContainer.innerHTML = listHTML;
}

/**
 * Selects an employee for payroll computation
 */
function selectEmployee(employeeId) {
    const employee = allEmployees.find(emp => emp.id === employeeId);
    if (employee) {
        selectedEmployee = employee;
        displayEmployees(allEmployees); // Re-render to show selected state
        updatePayrollPanel();
    }
}

/**
 * Updates the payroll panel with selected employee information
 */
function updatePayrollPanel() {
    const summaryName = document.querySelector('.summary-name');
    const summaryMeta = document.querySelector('.summary-meta');

    if (selectedEmployee) {
        summaryName.textContent = selectedEmployee.name;
        summaryMeta.textContent = `${selectedEmployee.role} • ${selectedEmployee.salaryType} • Base rate: ${new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(selectedEmployee.baseRate)}`;

        // Enable payroll inputs
        const payrollInputs = document.querySelectorAll('.payroll-body input');
        payrollInputs.forEach(input => {
            input.disabled = false;
            input.value = input.type === 'date'
                ? (input.dataset.default || '')
                : (input.dataset.default || '0');
        });
    } else {
        summaryName.textContent = 'No employee selected';
        summaryMeta.textContent = 'Choose an employee to compute payroll';

        // Disable payroll inputs
        const payrollInputs = document.querySelectorAll('.payroll-body input');
        payrollInputs.forEach(input => {
            input.disabled = true;
            input.value = input.type === 'date'
                ? (input.dataset.default || '')
                : (input.dataset.default || '0');
        });
    }
}

/**
 * Formats a date to mm-dd-yyyy format
 */
function formatDateMMDDYYYY(dateStr) {
    if (!dateStr) return '';
    // Avoid timezone shifts when parsing `yyyy-mm-dd` strings (treated as UTC by `new Date()`).
    const date = parseLocalDate(dateStr) || new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
}

function parseLocalDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    const s = String(value).trim();
    // yyyy-mm-dd (from <input type="date"> and Apps Script formatting)
    const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymd) {
        const y = Number(ymd[1]);
        const m = Number(ymd[2]);
        const d = Number(ymd[3]);
        return new Date(y, m - 1, d);
    }
    // mm-dd-yyyy (legacy/display)
    const mdy = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (mdy) {
        const m = Number(mdy[1]);
        const d = Number(mdy[2]);
        const y = Number(mdy[3]);
        return new Date(y, m - 1, d);
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * Loads payroll history from the backend
 */
async function loadPayrollHistory() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=listPayrollHistory`);
        const data = await response.json();

        if (!data.success) {
            showAlert('Error loading payroll history', 'error');
            return;
        }

        displayPayrollHistory(data.payrollHistory || []);
    } catch (error) {
        console.error('Error loading payroll history:', error);
        showAlert('Error loading payroll history', 'error');
    }
}

/**
 * Displays payroll history in the table
 */
function displayPayrollHistory(history) {
    payrollHistory = history;
    const historyBody = document.getElementById('payrollHistoryBody');
    if (!historyBody) return;

    if (!history || history.length === 0) {
        historyBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-history">No payroll history yet.</td>
            </tr>
        `;
        return;
    }

    historyBody.innerHTML = history.map((item, index) => {
        const employee = allEmployees.find(emp => emp.name === item.name);
        const hourlyRate = employee ? calculateHourlyRate(employee, item) : 0;
        const otPay = (hourlyRate * 1.25) * (item.otHours || 0);
        const ndPay = (hourlyRate * 0.1) * (item.ndHours || 0);
        const holidayRegularPay = hourlyRate * (item.holReg || 0);
        const holidaySpecialPay = (hourlyRate * (item.holSpcl || 0)) * 0.3;
        const holidayPay = holidayRegularPay + holidaySpecialPay;
        const latePay = (hourlyRate / 60) * (item.utHours || 0);

        const computedGrossPay = (item.basicSalary || 0) + otPay + ndPay + holidayPay + (item.leavePay || 0) + (item.allowance || 0) + (item.incentive || 0) + (item.otherEarnings || 0);
        const fallbackGrossPay = item.grossPay || 0;
        const grossPayToShow = employee ? computedGrossPay : fallbackGrossPay;

        const baseDeductions = (item.sss || 0) + (item.philhealth || 0) + (item.pagibig || 0) + (item.loansCA || 0) + (item.otherDeductions || 0);
        const totalDeductions = employee
            ? baseDeductions + latePay
            : ((fallbackGrossPay - (item.netPay || 0)) || baseDeductions);

        const additionsToShow = grossPayToShow - (item.basicSalary || 0);
        const netPayToShow = grossPayToShow - totalDeductions;

        return `
        <tr>
            <td>${escapeHtml(item.name)}</td>
            <td>${item.cutoffStart ? formatDateMMDDYYYY(item.cutoffStart) : ''}</td>
            <td>${item.cutoffEnd ? formatDateMMDDYYYY(item.cutoffEnd) : ''}</td>
            <td>${new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(item.basicSalary || 0)}</td>
            <td>${new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(additionsToShow)}</td>
            <td>${new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(totalDeductions)}</td>
            <td>${new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(grossPayToShow)}</td>
            <td>${new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(netPayToShow)}</td>
            <td class="payroll-actions">
                <button class="btn-action btn-download" onclick="previewPayslip(${index}, '${escapeHtml(item.name)}')" title="Preview Payslip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </button>
                <button class="btn-action btn-edit" onclick="editPayroll(${index})" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.999 3 21 4 17l12.5-12.5z" />
                    </svg>
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

function deriveRates(employee) {
    if (!employee) return { monthly: 0, daily: 0, hourly: 0 };
    const base = Number(employee.baseRate) || 0;
    const type = employee.salaryType;
    let monthly = 0;
    let daily = 0;
    let hourly = 0;

    if (type === 'monthly') {
        monthly = base;
        daily = base / 22;
        hourly = daily / 8;
    } else if (type === 'daily') {
        daily = base;
        monthly = base * 22;
        hourly = base / 8;
    } else if (type === 'hourly') {
        hourly = base;
        daily = base * 8;
        monthly = daily * 22;
    }
    return { monthly, daily, hourly };
}

function computeRecord(item, employeeMap) {
    const employee = employeeMap[item.name] || null;
    const rates = deriveRates(employee || { salaryType: item.salaryType, baseRate: item.baseRate });

    const hr = rates.hourly;
    const otPay = (hr * 1.25) * (item.otHours || 0);
    const utPay = (hr / 60) * (item.utHours || 0);
    const ndPay = (hr * 0.10) * (item.ndHours || 0);
    const holRegPay = hr * (item.holReg || 0);
    const holSpclPay = (hr * (item.holSpcl || 0)) * 0.3;

    const rawLeaveDays = Number(item.leaveDays);
    const leaveDays = Number.isFinite(rawLeaveDays) && rawLeaveDays >= 0 && rawLeaveDays <= 366
        ? rawLeaveDays
        : (rates.daily > 0 ? (Number(item.leavePay || 0) / rates.daily) : 0);
    const leavePay = rates.daily * leaveDays;

    const allowance = Number(item.allowance || 0);
    const incentive = Number(item.incentive || 0);
    const otherEarnings = Number(item.otherEarnings || 0);
    const sss = Number(item.sss || 0);
    const philhealth = Number(item.philhealth || 0);
    const pagibig = Number(item.pagibig || 0);
    const loansCA = Number(item.loansCA || 0);
    const otherDed = Number(item.otherDeductions || 0);
    const basicSalary = Number(item.basicSalary || 0);

    const grossPay = basicSalary + otPay + ndPay + holRegPay + holSpclPay + leavePay + allowance + incentive + otherEarnings;
    const totalDed = sss + philhealth + pagibig + loansCA + otherDed + utPay;
    const netPay = grossPay - totalDed;

    const formatDateMDY = (value) => {
        const d = parseLocalDate(value);
        if (!d) return value || '';
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    };

    return {
        name: item.name || '',
        cutoffStart: formatDateMDY(item.cutoffStart || ''),
        cutoffEnd: formatDateMDY(item.cutoffEnd || ''),
        payrollDate: formatDateMDY(item.payrollDate || ''),
        monthly: rates.monthly,
        daily: rates.daily,
        hourly: rates.hourly,
        basicSalary,
        otHours: Number(item.otHours || 0),
        otPay,
        utHours: Number(item.utHours || 0),
        utPay,
        ndHours: Number(item.ndHours || 0),
        ndPay,
        allowance,
        incentive,
        holReg: Number(item.holReg || 0),
        holRegPay,
        holSpcl: Number(item.holSpcl || 0),
        holSpclPay,
        leaveDays,
        leavePay,
        otherEarnings,
        otherDed,
        loansCA,
        sss,
        philhealth,
        pagibig,
        grossPay,
        netPay,
    };
}

/**
 * Exports payroll history as XLSX (ExcelJS).
 */
async function exportHistoryAsCSV() {
    if (!payrollHistory || payrollHistory.length === 0) {
        showAlert('No payroll history to export.', 'error');
        return;
    }

    if (typeof ExcelJS === 'undefined') {
        showAlert('ExcelJS library is not loaded. Check your HTML includes the ExcelJS CDN script.', 'error');
        return;
    }

    const employeeMap = {};
    (allEmployees || []).forEach(e => { employeeMap[e.name] = e; });
    const records = payrollHistory.map(item => computeRecord(item, employeeMap));

    const wb = new ExcelJS.Workbook();
    wb.creator = 'COMS Payroll System';
    wb.created = new Date();

    const ws = wb.addWorksheet('Payroll History', {
        pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
        views: [{ state: 'frozen', ySplit: 6 }],
    });

    const C = {
        // Complementary-leaning palette: cool blues vs warm oranges/reds.
        blue: '2F6FAE',
        blueSoft: 'DCEBFA',
        orange: 'E08A3E',
        orangeSoft: 'FCE9D7',
        red: 'C94C4C',
        redSoft: 'F8DEDE',
        green: '4F8A5B',
        greenSoft: 'E1F0E4',
        gray200: 'E2E8F0',
        dark: '111827',
        white: 'FFFFFF',
        totals: '0F172A',
    };

    const style = (bg, fgColor = 'FFFFFF', bold = false, size = 10, hAlign = 'center') => ({
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } },
        font: { name: 'Arial', size, bold, color: { argb: fgColor } },
        alignment: { horizontal: hAlign, vertical: 'middle', wrapText: true },
    });

    const rateFmt = '₱#,##0.00';
    const intFmt = '0.##';

    const COLS = [
        { header: 'Cutoff Start', key: 'cutoffStart', width: 13, section: 'emp' },
        { header: 'Cutoff End', key: 'cutoffEnd', width: 13, section: 'emp' },
        { header: 'Employee', key: 'name', width: 22, section: 'emp' },
        { header: 'Monthly Rate', key: 'monthly', width: 14, section: 'emp', numFormat: rateFmt },
        { header: 'Daily Rate', key: 'daily', width: 12, section: 'emp', numFormat: rateFmt },
        { header: 'Hourly Rate', key: 'hourly', width: 12, section: 'emp', numFormat: rateFmt },
        { header: 'Basic Salary', key: 'basicSalary', width: 14, section: 'earn', numFormat: rateFmt },
        { header: 'OT\n(hrs)', key: 'otHours', width: 9, section: 'earn', numFormat: intFmt },
        { header: 'OT Pay', key: 'otPay', width: 12, section: 'earn', numFormat: rateFmt },
        { header: 'UT/Late\n(min)', key: 'utHours', width: 10, section: 'earn', numFormat: intFmt },
        { header: 'UT/Late\nPay', key: 'utPay', width: 12, section: 'earn', numFormat: rateFmt },
        { header: 'ND\n(hrs)', key: 'ndHours', width: 9, section: 'earn', numFormat: intFmt },
        { header: 'ND Pay', key: 'ndPay', width: 12, section: 'earn', numFormat: rateFmt },
        { header: 'Allowance', key: 'allowance', width: 13, section: 'earn', numFormat: rateFmt },
        { header: 'Incentives', key: 'incentive', width: 13, section: 'earn', numFormat: rateFmt },
        { header: 'HOL REG (hours)', key: 'holReg', width: 16, section: 'earn', numFormat: intFmt },
        { header: 'HOL REG Pay', key: 'holRegPay', width: 14, section: 'earn', numFormat: rateFmt },
        { header: 'HOL SPCL (hours)', key: 'holSpcl', width: 16, section: 'earn', numFormat: intFmt },
        { header: 'HOL SPCL Pay', key: 'holSpclPay', width: 14, section: 'earn', numFormat: rateFmt },
        { header: 'Leave\n(days)', key: 'leaveDays', width: 10, section: 'earn', numFormat: intFmt },
        { header: 'Leave Pay', key: 'leavePay', width: 12, section: 'earn', numFormat: rateFmt },
        { header: 'Other\nEarnings', key: 'otherEarnings', width: 13, section: 'earn', numFormat: rateFmt },
        { header: 'Other\nDeductions', key: 'otherDed', width: 13, section: 'ded', numFormat: rateFmt },
        { header: 'Loan / CA', key: 'loansCA', width: 12, section: 'ded', numFormat: rateFmt },
        { header: 'SSS', key: 'sss', width: 11, section: 'ded', numFormat: rateFmt },
        { header: 'PhilHealth', key: 'philhealth', width: 11, section: 'ded', numFormat: rateFmt },
        { header: 'PAGIBIG', key: 'pagibig', width: 11, section: 'ded', numFormat: rateFmt },
        { header: 'Gross Pay', key: 'grossPay', width: 14, section: 'sum', numFormat: rateFmt },
        { header: 'Net Pay', key: 'netPay', width: 14, section: 'sum', numFormat: rateFmt },
    ];

    ws.columns = COLS.map(c => ({ key: c.key, width: c.width }));
    const totalCols = COLS.length;

    ws.addRow([]);
    const r1 = ws.lastRow;
    r1.height = 30;
    ws.mergeCells(r1.number, 1, r1.number, totalCols);
    const r1c = r1.getCell(1);
    r1c.value = 'COMS  ·  Payroll Services  ·  Export Report';
    Object.assign(r1c, style(C.blue, C.white, true, 14, 'center'));

    ws.addRow([]);
    const r2 = ws.lastRow;
    r2.height = 18;
    ws.mergeCells(r2.number, 1, r2.number, totalCols);
    const r2c = r2.getCell(1);
    const now = new Date();
    const fmtMDY = (v) => {
        const d = parseLocalDate(v);
        if (!d) return '';
        return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    };
    const uniqueStarts = new Set(records.map(r => (r.cutoffStart || '').trim()).filter(Boolean));
    const uniqueEnds = new Set(records.map(r => (r.cutoffEnd || '').trim()).filter(Boolean));
    const cutoffStartLabel = uniqueStarts.size === 1 ? fmtMDY([...uniqueStarts][0]) : '';
    const cutoffEndLabel = uniqueEnds.size === 1 ? fmtMDY([...uniqueEnds][0]) : '';
    const cutoffLabel = (cutoffStartLabel && cutoffEndLabel)
        ? `${cutoffStartLabel} - ${cutoffEndLabel}`
        : (records.length > 0 ? 'Multiple cutoffs' : '');
    r2c.value = `Cutoff: ${cutoffLabel}  ·  Total Records: ${records.length}`;
    Object.assign(r2c, style(C.orangeSoft, C.dark, false, 10, 'center'));

    ws.addRow([]);
    const r3 = ws.lastRow;
    r3.height = 20;

    const sectionRanges = { emp: [], earn: [], ded: [], sum: [] };
    COLS.forEach((c, i) => sectionRanges[c.section].push(i + 1));
    const mergeSectionHeader = (colIndices, label, bg, fg = C.white) => {
        const start = colIndices[0];
        const end = colIndices[colIndices.length - 1];
        ws.mergeCells(r3.number, start, r3.number, end);
        const cell = r3.getCell(start);
        cell.value = label;
        Object.assign(cell, style(bg, fg, true, 10, 'center'));
    };

    mergeSectionHeader(sectionRanges.emp, '▸ EMPLOYEE INFO', C.blue, C.white);
    mergeSectionHeader(sectionRanges.earn, '▸ EARNINGS', C.green, C.white);
    mergeSectionHeader(sectionRanges.ded, '▸ DEDUCTIONS', C.red, C.white);
    mergeSectionHeader(sectionRanges.sum, '▸ SUMMARY', C.orange, C.white);

    ws.addRow([]);
    const r4 = ws.lastRow;
    r4.height = 4;
    ws.mergeCells(r4.number, 1, r4.number, totalCols);
    r4.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.blue } };

    ws.addRow([]);
    const r5 = ws.lastRow;
    r5.height = 38;
    const sectionBg = { emp: C.blue, earn: C.green, ded: C.red, sum: C.orange };
    const sectionText = { emp: C.white, earn: C.white, ded: C.white, sum: C.white };
    COLS.forEach((c, i) => {
        const cell = r5.getCell(i + 1);
        cell.value = c.header;
        Object.assign(cell, style(sectionBg[c.section], sectionText[c.section], true, 9, 'center'));
        cell.border = {
            top: { style: 'medium', color: { argb: C.white } },
            left: { style: 'thin', color: { argb: C.white } },
            bottom: { style: 'medium', color: { argb: C.white } },
            right: { style: 'thin', color: { argb: C.white } },
        };
    });

    const sectionFill = { emp: C.blueSoft, earn: C.greenSoft, ded: C.redSoft, sum: C.orangeSoft };
    const altFill = { emp: 'CFE2F7', earn: 'D6EADA', ded: 'F3D1D1', sum: 'F8DFC8' };
    records.forEach((rec, rowIdx) => {
        const isAlt = rowIdx % 2 === 1;
        const rowData = COLS.map(c => rec[c.key] !== undefined ? rec[c.key] : '');
        ws.addRow(rowData);
        const dr = ws.lastRow;
        dr.height = 18;

        COLS.forEach((c, i) => {
            const cell = dr.getCell(i + 1);
            const bg = isAlt ? altFill[c.section] : sectionFill[c.section];
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
            cell.font = { name: 'Arial', size: 9, color: { argb: C.totals } };
            cell.alignment = { horizontal: c.numFormat ? 'right' : 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'hair', color: { argb: C.gray200 } },
                left: { style: 'hair', color: { argb: C.gray200 } },
                bottom: { style: 'hair', color: { argb: C.gray200 } },
                right: { style: 'hair', color: { argb: C.gray200 } },
            };
            if (c.numFormat) cell.numFmt = c.numFormat;
        });
    });

    const firstDataRow = 6;
    const lastDataRow = 5 + records.length;
    ws.addRow([]);
    const tr = ws.lastRow;
    tr.height = 22;

    ws.mergeCells(tr.number, 1, tr.number, 5);
    const labelCell = tr.getCell(1);
    labelCell.value = 'TOTALS';
    Object.assign(labelCell, style(C.blue, C.white, true, 10, 'center'));
    labelCell.border = { top: { style: 'medium', color: { argb: C.blue } } };

    COLS.forEach((c, i) => {
        if (i < 5) return;
        const colLetter = ws.getColumn(i + 1).letter;
        const cell = tr.getCell(i + 1);
        cell.value = records.length > 0 ? { formula: `SUM(${colLetter}${firstDataRow}:${colLetter}${lastDataRow})` } : 0;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.blue } };
        cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: C.white } };
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = c.numFormat || rateFmt;
        cell.border = {
            top: { style: 'medium', color: { argb: C.blue } },
            bottom: { style: 'medium', color: { argb: C.blue } },
            left: { style: 'hair', color: { argb: C.dark } },
            right: { style: 'hair', color: { argb: C.dark } },
        };
    });

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const dateStr = now.toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payroll_Export_${dateStr}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showAlert('✓ Payroll history exported successfully as XLSX', 'success');
}

/**
 * Clears all payroll history
 */
async function clearPayrollHistory() {
    if (!confirm('Are you sure you want to clear all payroll history? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'clearPayrollHistory',
            }),
        });

        const data = await response.json();

        if (data.success) {
            showAlert('✓ Payroll history cleared successfully', 'success');
            await loadPayrollHistory();
        } else {
            showAlert(data.error || 'Error clearing payroll history', 'error');
        }
    } catch (error) {
        console.error('Error clearing payroll history:', error);
        showAlert('Error clearing payroll history', 'error');
    }
}

/**
 * Handles form submission for adding or updating employee
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        id: employeeIdInput.value.trim(),
        name: document.getElementById('employeeName').value.trim(),
        role: document.getElementById('employeeRole').value.trim(),
        salaryType: salaryTypeSelect.value,
        baseRate: parseFloat(baseRateInput.value),
    };

    if (!formData.id || !formData.name || !formData.role || !formData.salaryType || isNaN(formData.baseRate)) {
        showAlert('All fields are required', 'error');
        return;
    }

    if (formData.baseRate <= 0) {
        showAlert('Base rate must be greater than 0', 'error');
        return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';

    try {
        const action = isEditMode ? 'updateEmployee' : 'appendEmployee';
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: action,
                employee: formData,
            }),
        });

        const data = await response.json();

        if (data.success) {
            showAlert(isEditMode ? '✓ Employee updated successfully' : '✓ Employee added successfully', 'success');
            closeModal();
            loadEmployees();
        } else {
            showAlert(data.error || 'Error processing employee', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error processing employee', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Handles editing an employee
 */
async function handleEditEmployee(id) {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=listEmployees`);
        const data = await response.json();

        if (data.success) {
            const employee = data.employees.find(e => e.id === id);
            if (employee) {
                openModal(employee);
            } else {
                showAlert('Employee not found', 'error');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error loading employee details', 'error');
    }
}

/**
 * Handles deleting an employee
 */
async function handleDeleteEmployee(id) {
    const employee = allEmployees.find(e => e.id === id);
    const employeeName = employee ? employee.name : id;

    if (!confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
        return;
    }

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'deleteEmployee',
                id: id,
            }),
        });

        const data = await response.json();

        if (data.success) {
            showAlert('✓ Employee deleted successfully', 'success');
            // Clear selection if deleted employee was selected
            if (selectedEmployee && selectedEmployee.id === id) {
                selectedEmployee = null;
            }
            loadEmployees();
        } else {
            showAlert(data.error || 'Error deleting employee', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error deleting employee', 'error');
    }
}

/**
 * Displays alert messages
 */
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

/**
 * Escapes HTML to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

function roundToTwo(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
}

/**
 * Clears all payroll computation inputs
 */
function clearPayrollInputs() {
    const payrollInputs = document.querySelectorAll('.payroll-body input');
    payrollInputs.forEach(input => {
        // Keep cutoff dates to minimize data entry mistakes.
        if (input.id === 'cutoffStart' || input.id === 'cutoffEnd') return;
        input.value = input.type === 'date'
            ? (input.dataset.default || '')
            : (input.dataset.default || '0');
    });
}

/**
 * Handle payroll generation
 */
async function handlePayrollGeneration() {
    if (!selectedEmployee) {
        alert('Please select an employee first.');
        return;
    }

    // Get all input values
    const daysWorked = parseFloat(document.getElementById('daysWorked').value) || 0;
    const overtimeHours = parseFloat(document.getElementById('overtimeHours').value) || 0;
    const lateUndertime = parseFloat(document.getElementById('lateUndertime').value) || 0;
    const nightDiff = parseFloat(document.getElementById('nightDiff').value) || 0;
    const loansCashAdvance = parseFloat(document.getElementById('loansCashAdvance').value) || 0;
    const sssDeduction = parseFloat(document.getElementById('sssDeduction').value) || 0;
    const philhealthDeduction = parseFloat(document.getElementById('philhealthDeduction').value) || 0;
    const pagibigDeduction = parseFloat(document.getElementById('pagibigDeduction').value) || 0;
    const allowance = parseFloat(document.getElementById('allowance').value) || 0;
    const incentives = parseFloat(document.getElementById('incentives').value) || 0;
    const holidayRegular = parseFloat(document.getElementById('holidayRegular').value) || 0;
    const holidaySpecial = parseFloat(document.getElementById('holidaySpecial').value) || 0;
    const leaveDaysInput = parseFloat(document.getElementById('leavePay').value) || 0;
    const otherEarnings = parseFloat(document.getElementById('otherEarnings').value) || 0;
    const otherDeductions = parseFloat(document.getElementById('otherDeductions').value) || 0;
    const cutoffStart = (document.getElementById('cutoffStart')?.value || '').trim();
    const cutoffEnd = (document.getElementById('cutoffEnd')?.value || '').trim();

    if (!cutoffStart || !cutoffEnd) {
        showAlert('Please select both Cutoff Start and Cutoff End dates.', 'error');
        return;
    }

    // Calculate basic pay
    let basicPay = 0;
    let dailyRate = 0;
    let hourlyRate = 0;
    const baseRate = parseFloat(selectedEmployee.baseRate);

    if (selectedEmployee.salaryType === 'monthly') {
        // Monthly salary: divide monthly base rate by 22 working days
        dailyRate = baseRate / 22;
        hourlyRate = dailyRate / 8;
        basicPay = dailyRate * daysWorked;
    } else if (selectedEmployee.salaryType === 'daily') {
        // Daily salary
        dailyRate = baseRate;
        hourlyRate = baseRate / 8;
        basicPay = baseRate * daysWorked;
    } else if (selectedEmployee.salaryType === 'hourly') {
        // Hourly salary
        hourlyRate = baseRate;
        dailyRate = baseRate * 8;
        basicPay = baseRate * 8 * daysWorked;
    }

    // Excel Formula: OT=(E*1.25)*I where E=hourlyRate, I=overtimeHours
    const overtimePay = (hourlyRate * 1.25) * overtimeHours;

    // Excel Formula: UT/LATE=(E/60)*K where E=hourlyRate, K=lateUndertime in minutes
    const latePay = (hourlyRate / 60) * lateUndertime;

    // Excel Formula: ND=(E*0.1)*M where E=hourlyRate, M=nightDiff in hours
    const nightDiffPay = (hourlyRate * 0.1) * nightDiff;

    // Excel Formula: HOL REG=S*E where S=holidayRegular days, E=hourlyRate
    const holidayRegularPay = holidayRegular * hourlyRate;

    // Excel Formula: HOL SPCL=(U*E)*0.3 where U=holidaySpecial days, E=hourlyRate
    const holidaySpecialPay = (holidaySpecial * hourlyRate) * 0.3;

    // Excel Formula: LEAVE=D*W where D=dailyRate, W=leavePay (in days)
    const leavePayCalc = dailyRate * leaveDaysInput;

    // Gross pay adds earnings, but UT/Late is a deduction.
    const grossPay = basicPay + overtimePay + nightDiffPay + holidayRegularPay + holidaySpecialPay + leavePayCalc + allowance + incentives + otherEarnings;

    // Calculate total additional earnings (all earnings except basic pay)
    const totalAdditionalEarnings = overtimePay + nightDiffPay + holidayRegularPay + holidaySpecialPay + leavePayCalc + allowance + incentives + otherEarnings;

    // Calculate total deductions, including UT/Late
    const totalDeductions = loansCashAdvance + sssDeduction + philhealthDeduction + pagibigDeduction + otherDeductions + latePay;

    // Excel Formula: NET PAY=Gross Pay - Total Deductions
    const netPay = grossPay - totalDeductions;

    const roundedBasicPay = roundToTwo(basicPay);
    const roundedAdditions = roundToTwo(totalAdditionalEarnings);
    const roundedGrossPay = roundToTwo(grossPay);
    const roundedDeductions = roundToTwo(totalDeductions);
    const roundedNetPay = roundToTwo(netPay);

    // Display results in a modal
    showPayrollResults(roundedBasicPay, roundedAdditions, roundedGrossPay, roundedDeductions, roundedNetPay);

    // Save payroll results to the backend

    // Save payroll results to the backend
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'savePayroll',
                payroll: {
                    employeeId: selectedEmployee.id,
                    daysPresent: daysWorked,
                    otHours: overtimeHours,
                    utHours: lateUndertime,
                    ndHours: nightDiff,
                    allowance: roundToTwo(allowance),
                    incentive: roundToTwo(incentives),
                    holReg: holidayRegular,
                    holSpcl: holidaySpecial,
                    leavePay: roundToTwo(leavePayCalc),
                    leaveDays: roundToTwo(leaveDaysInput),
                    otherEarnings: roundToTwo(otherEarnings),
                    loansCA: roundToTwo(loansCashAdvance),
                    otherDeductions: roundToTwo(otherDeductions),
                    sss: roundToTwo(sssDeduction),
                    philhealth: roundToTwo(philhealthDeduction),
                    pagibig: roundToTwo(pagibigDeduction),
                    basicSalary: roundedBasicPay,
                    grossPay: roundedGrossPay,
                    netPay: roundedNetPay,
                    cutoffStart,
                    cutoffEnd,
                },
            }),
        });

        const data = await response.json();
        if (!data.success) {
            showAlert(`Payroll save failed: ${data.error || 'Unknown error'}`, 'error');
        } else {
            showAlert('Payroll generated and saved successfully', 'success');
            clearPayrollInputs();
            await loadPayrollHistory();
        }
    } catch (error) {
        console.error('Error saving payroll:', error);
        showAlert('Failed to save payroll to the backend', 'error');
    }
}

/**
 * Shows payroll computation results in a modal
 */
function showPayrollResults(basicPay, additionalEarnings, grossPay, totalDeductions, netPay) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>Payroll Results</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()" aria-label="Close results modal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="payroll-summary">
                    <div class="summary-row">
                        <span>Basic Pay:</span>
                        <span class="amount">${new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2
                        }).format(basicPay)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Additional Earnings:</span>
                        <span class="amount">${new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2
                        }).format(additionalEarnings)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Gross Pay:</span>
                        <span class="amount">${new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2
                        }).format(grossPay)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Total Deductions:</span>
                        <span class="amount deduction">${new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2
                        }).format(totalDeductions)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Net Pay:</span>
                        <span class="amount net">${new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2
                        }).format(netPay)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Helper: Sanitize text to prevent HTML injection
 */
function sanitize(text) {
    return escapeHtml(text);
}

/**
 * Helper: Format currency as PHP
 */
function php(value) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2
    }).format(value || 0);
}

/**
 * Helper: Build a row in the payslip earnings/deductions section
 */
function buildRow(label, value, isNumericDisplay = false, isDaysWorked = false) {
    const isZero = value === 0 || value === '0';
    const displayValue = isDaysWorked ? value : (isNumericDisplay ? value : php(value));
    return `
        <div class="ps-row">
            <span class="lbl">${sanitize(label)}</span>
            <span class="val ${isZero ? 'zero' : ''}">${sanitize(displayValue.toString())}</span>
        </div>
    `;
}

/**
 * Opens payslip preview in modal
 * Uses ONLY existing payroll data structure — maintains 100% compatibility
 */
function previewPayslip(index, employeeName) {
    if (index < 0 || index >= payrollHistory.length) {
        showAlert('Invalid payroll record', 'error');
        return;
    }

    const payroll = payrollHistory[index];
    const employee = allEmployees.find(emp => emp.name === payroll.name);
    
    // Parse date range (prefer stored cutoff if available)
    const payrollDate = parseLocalDate(payroll.payrollDate) || new Date();
    const startDate = payroll.cutoffStart ? (parseLocalDate(payroll.cutoffStart) || payrollDate) : new Date(payrollDate);
    const endDate = payroll.cutoffEnd ? (parseLocalDate(payroll.cutoffEnd) || payrollDate) : new Date(payrollDate);
    if (!payroll.cutoffStart) startDate.setDate(startDate.getDate() - 14); // legacy fallback
    
    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Calculate derived values
    const hourlyRate = calculateHourlyRate(employee, payroll);
    const otPay = (hourlyRate * 1.25) * (payroll.otHours || 0);
    const ndPay = (hourlyRate * 0.1) * (payroll.ndHours || 0);
    const holidayRegularPay = hourlyRate * (payroll.holReg || 0);
    const holidaySpecialPay = (hourlyRate * (payroll.holSpcl || 0)) * 0.3;
    const holidayPay = holidayRegularPay + holidaySpecialPay;
    const computedGrossPay = (payroll.basicSalary || 0) + otPay + ndPay + holidayPay + (payroll.leavePay || 0) + (payroll.allowance || 0) + (payroll.incentive || 0) + (payroll.otherEarnings || 0);
    const latePay = (hourlyRate / 60) * (payroll.utHours || 0);
    const totalDeductions = (payroll.sss || 0) + (payroll.philhealth || 0) + (payroll.pagibig || 0) + 
                           (payroll.loansCA || 0) + latePay + (payroll.otherDeductions || 0);
    const computedNetPay = computedGrossPay - totalDeductions;
    const employeePosition = employee
        ? `${employee.role || 'N/A'} • ${employee.salaryType || 'N/A'}`
        : 'N/A';
    const modalMarkup = `
<div class="payslip" id="payslipPreviewCard">
    <div class="ps-header">
        <div class="company-block">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 100" style="width:300px;height:58px;display:block;border-radius:3px;">
                <defs>
                    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   stop-color="#6B1F1F"/>
                        <stop offset="55%"  stop-color="#9B3535"/>
                        <stop offset="100%" stop-color="#C0533A"/>
                    </linearGradient>
                    <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.07"/>
                        <stop offset="100%" stop-color="#000000" stop-opacity="0.10"/>
                    </linearGradient>
                </defs>
                <!-- Background: horizontal dark-to-warm gradient -->
                <rect width="520" height="100" fill="url(#bgGrad)" rx="3"/>
                <!-- Subtle vertical sheen for depth -->
                <rect width="520" height="100" fill="url(#sheen)" rx="3"/>
                <!-- Primary: COMS — thin/light geometric sans-serif, wide tracking -->
                <text
                    x="260" y="66"
                    font-family="'Gill Sans','Century Gothic','Trebuchet MS','Arial',Helvetica,sans-serif"
                    font-size="54"
                    font-weight="300"
                    fill="#FFFFFF"
                    text-anchor="middle"
                    letter-spacing="22">COMS</text>
                <!-- Secondary: full name, ultra-wide tracking, low opacity -->
                <text
                    x="260" y="86"
                    font-family="'Gill Sans','Century Gothic','Trebuchet MS','Arial',Helvetica,sans-serif"
                    font-size="7.5"
                    font-weight="300"
                    fill="#FFFFFF"
                    fill-opacity="0.55"
                    text-anchor="middle"
                    letter-spacing="6">C. OPERATIONS MANAGEMENT SERVICES</text>
            </svg>
        </div>
        <div class="title-block">
            <div class="doc-label">PAYSLIP</div>
            <div class="period-value">${formatDate(startDate)} - ${formatDate(endDate)}</div>
        </div>
    </div>

    <div class="ps-meta-grid">
        <div class="meta-item">
            <span class="meta-label">Employee</span>
            <span class="meta-value">${escapeHtml(employeeName)}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Role / Type</span>
            <span class="meta-value">${escapeHtml(employeePosition)}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Date Issued</span>
            <span class="meta-value">${formatDate(new Date())}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Period Covered</span>
            <span class="meta-value">${formatDate(startDate)} - ${formatDate(endDate)}</span>
        </div>
    </div>

    <div class="ps-body">
        <div class="cols">
            <section class="ps-section">
                <h3 class="card-title">Earnings</h3>
                <div class="ps-row"><span class="lbl">Basic rate (daily)</span><span class="val">${php((payroll.basicSalary || 0) / (payroll.daysPresent || 1))}</span></div>
                <div class="ps-row"><span class="lbl">Days worked</span><span class="val">${payroll.daysPresent || 0}</span></div>
                <div class="ps-row"><span class="lbl">Basic salary</span><span class="val">${php(payroll.basicSalary || 0)}</span></div>
                <div class="ps-row"><span class="lbl">OT pay</span><span class="val">${php(otPay)}</span></div>
                <div class="ps-row"><span class="lbl">ND pay</span><span class="val">${php(ndPay)}</span></div>
                <div class="ps-row"><span class="lbl">Holiday pay</span><span class="val">${php(holidayPay)}</span></div>
                <div class="ps-row"><span class="lbl">Leave pay</span><span class="val">${php(payroll.leavePay || 0)}</span></div>
                <div class="ps-row"><span class="lbl">Allowance</span><span class="val">${php(payroll.allowance || 0)}</span></div>
                <div class="ps-row"><span class="lbl">Others</span><span class="val">${php(payroll.otherEarnings || 0)}</span></div>
                <div class="row-total">
                    <span class="lbl">Gross Pay</span>
                    <span class="val">${php(computedGrossPay)}</span>
                </div>
            </section>

            <section class="ps-section">
                <h3 class="card-title">Deductions</h3>
                <div class="ps-row"><span class="lbl">SSS</span><span class="val">${php(payroll.sss || 0)}</span></div>
                <div class="ps-row"><span class="lbl">PhilHealth</span><span class="val">${php(payroll.philhealth || 0)}</span></div>
                <div class="ps-row"><span class="lbl">HDMF (Pag-IBIG)</span><span class="val">${php(payroll.pagibig || 0)}</span></div>
                <div class="ps-row"><span class="lbl">Loan / CA</span><span class="val">${php(payroll.loansCA || 0)}</span></div>
                <div class="ps-row"><span class="lbl">Other deductions</span><span class="val">${php(payroll.otherDeductions || 0)}</span></div>
                <div class="ps-row"><span class="lbl">Late (less)</span><span class="val">${php(latePay)}</span></div>
                <div class="row-ded-total">
                    <span class="lbl">Total Deductions</span>
                    <span class="val">${php(totalDeductions)}</span>
                </div>
            </section>
        </div>

        <div class="net-pay">
            <span class="net-label">Net Pay</span>
            <span class="net-value">${php(computedNetPay)}</span>
        </div>

        <div class="signature-grid">
            <div class="signature">
                <div class="sig-name">${escapeHtml(employeeName)}</div>
                <div class="sig-line">Employee Signature over printed name</div>
            </div>
            <div class="signature">
                <div class="sig-name">HR / Payroll Officer</div>
                <div class="sig-line">Authorized Signature over printed name</div>
            </div>
        </div>

        <div class="footer">
            This is a system-generated payslip. Keep this document for your payroll records.
        </div>
    </div>
</div>`;

    if (!payslipPreviewModal || !payslipPreviewContent) {
        showAlert('Payslip preview modal is not available', 'error');
        return;
    }

    payslipPreviewContent.innerHTML = modalMarkup;
    payslipPreviewModal.dataset.fileName = `Payslip_${employeeName.replace(/\s+/g, '_')}_${formatDate(startDate).replace(/\s+/g, '_')}-${formatDate(endDate).replace(/\s+/g, '_')}.png`;
    payslipPreviewModal.classList.add('active');
}

/**
 * Closes payslip preview modal and clears content
 */
function closePayslipPreviewModal() {
    if (!payslipPreviewModal || !payslipPreviewContent) return;
    payslipPreviewModal.classList.remove('active');
    payslipPreviewContent.innerHTML = '';
}

/**
 * Downloads current payslip preview as PNG image
 */
async function downloadPayslipAsPNG() {
    const payslipCard = document.getElementById('payslipPreviewCard');
    if (!payslipCard) {
        showAlert('No payslip preview available to download', 'error');
        return;
    }
    if (typeof html2canvas !== 'function') {
        showAlert('Image export library is not loaded', 'error');
        return;
    }
    try {
        const canvas = await html2canvas(payslipCard, {
            backgroundColor: '#ffffff',
            scale: 3,
            useCORS: false,
        });
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = payslipPreviewModal?.dataset.fileName || 'payslip.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showAlert('✓ Payslip downloaded as PNG', 'success');
    } catch (error) {
        console.error('Error downloading payslip PNG:', error);
        showAlert('Failed to download payslip as PNG', 'error');
    }
}

/**
 * Helper: Build a payslip table row (for template string rendering)
 */
function buildPayslipRow(label, value, isZero = false) {
    const phpVal = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2
    }).format(num(value));
    const zeroClass = isZero ? ' zero' : '';
    return `
        <div class="ps-row${zeroClass}">
            <span class="row-lbl">${sanitize(label)}</span>
            <span class="row-val">${phpVal}</span>
        </div>
    `;
}

/**
 * Helper: Safe numeric conversion (returns 0 if invalid)
 */
function num(val) {
    const n = Number(val);
    return isFinite(n) ? n : 0;
}

/**
 * Calculate hourly rate based on salary type
 */
function calculateHourlyRate(employee, payroll) {
    if (!employee) return 0;
    const baseRate = employee.baseRate || 0;
    
    if (employee.salaryType === 'monthly') {
        return (baseRate / 22) / 8;
    } else if (employee.salaryType === 'daily') {
        return baseRate / 8;
    } else if (employee.salaryType === 'hourly') {
        return baseRate;
    }
    return 0;
}

/**
 * Calculate daily rate based on salary type
 */
function calculateDailyRate(employee) {
    if (!employee) return 0;
    const baseRate = Number(employee.baseRate) || 0;

    if (employee.salaryType === 'monthly') {
        return baseRate / 22;
    } else if (employee.salaryType === 'daily') {
        return baseRate;
    } else if (employee.salaryType === 'hourly') {
        return baseRate * 8;
    }
    return 0;
}

/**
 * Edits payroll by loading existing data into computation form
 */
function editPayroll(index) {
    if (index < 0 || index >= payrollHistory.length) {
        showAlert('Invalid payroll record', 'error');
        return;
    }

    const payroll = payrollHistory[index];
    
    // Find and select the employee - use the name to find matching employee
    const employee = allEmployees.find(emp => emp.name === payroll.name);
    if (!employee) {
        showAlert('Employee not found in current roster', 'error');
        return;
    }

    selectedEmployee = employee;
    displayEmployees(allEmployees);
    updatePayrollPanel();

    // Populate the payroll inputs with existing data
    document.getElementById('daysWorked').value = payroll.daysPresent || 0;
    document.getElementById('overtimeHours').value = payroll.otHours || 0;
    document.getElementById('lateUndertime').value = payroll.utHours || 0;
    document.getElementById('nightDiff').value = payroll.ndHours || 0;
    document.getElementById('allowance').value = payroll.allowance || 0;
    document.getElementById('incentives').value = payroll.incentive || 0;
    document.getElementById('holidayRegular').value = payroll.holReg || 0;
    document.getElementById('holidaySpecial').value = payroll.holSpcl || 0;
    const cutoffStartInput = document.getElementById('cutoffStart');
    const cutoffEndInput = document.getElementById('cutoffEnd');
    if (cutoffStartInput) cutoffStartInput.value = payroll.cutoffStart ? String(payroll.cutoffStart).slice(0, 10) : '';
    if (cutoffEndInput) cutoffEndInput.value = payroll.cutoffEnd ? String(payroll.cutoffEnd).slice(0, 10) : '';
    // Prefer the original leave-days input if available; fallback for old records.
    const dailyRate = calculateDailyRate(employee);
    const hasLeaveDaysInput = payroll.leaveDays !== undefined && payroll.leaveDays !== null && payroll.leaveDays !== '';
    const parsedLeaveDaysInput = Number(payroll.leaveDays || 0);
    const isReasonableLeaveDays = Number.isFinite(parsedLeaveDaysInput) && parsedLeaveDaysInput >= 0 && parsedLeaveDaysInput <= 366;
    const rawLeavePay = Number(payroll.leavePay || 0);

    let leaveDays = 0;
    if (hasLeaveDaysInput && isReasonableLeaveDays) {
        // New records: use the exact leave-days input.
        leaveDays = parsedLeaveDaysInput;
    } else if (rawLeavePay > 0 && rawLeavePay <= 31) {
        // Legacy/data-variant fallback: some records saved leave days directly.
        leaveDays = rawLeavePay;
    } else if (dailyRate > 0) {
        // Standard legacy fallback: stored peso leave pay, convert back to days.
        leaveDays = rawLeavePay / dailyRate;
    }

    document.getElementById('leavePay').value = Math.round((leaveDays || 0) * 10000) / 10000;
    document.getElementById('otherEarnings').value = payroll.otherEarnings || 0;
    document.getElementById('loansCashAdvance').value = payroll.loansCA || 0;
    document.getElementById('otherDeductions').value = payroll.otherDeductions || 0;
    document.getElementById('sssDeduction').value = payroll.sss || 0;
    document.getElementById('philhealthDeduction').value = payroll.philhealth || 0;
    document.getElementById('pagibigDeduction').value = payroll.pagibig || 0;

    // Scroll to payroll panel
    document.querySelector('.payroll-card').scrollIntoView({ behavior: 'smooth' });
    showAlert('✓ Payroll data loaded for editing', 'success');
}

/**
 * Deletes a payroll record
 */
async function deletePayroll(index) {
    if (index < 0 || index >= payrollHistory.length) {
        showAlert('Invalid payroll record', 'error');
        return;
    }

    if (!confirm('Are you sure you want to delete this payroll record? This action cannot be undone.')) {
        return;
    }

    const payroll = payrollHistory[index];
    showAlert('Delete functionality requires backend support. Manual deletion in Google Sheets is recommended.', 'warning');
}

// Load employees on page load
document.addEventListener('DOMContentLoaded', () => {
    if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL') {
        alertContainer.innerHTML = `
            <div class="alert alert-error">
                <span class="alert-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12" y2="13" />
                        <circle cx="12" cy="17" r="1" />
                    </svg>
                </span>
                Please configure the Google Apps Script URL in app.js
            </div>
        `;
    } else {
        loadEmployees();
    }
    updatePayrollPanel(); // Initialize payroll panel
});