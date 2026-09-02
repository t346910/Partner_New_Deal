// State management for Partner_New_Deal
const STORAGE_KEY = 'partner_new_deal_data';

const initialDeals = [
    {
        id: '1',
        title: 'Skyintegrasjon & Sikkerhet',
        partner: 'Nordic Cloud AS',
        value: 450000,
        status: 'Forhandling',
        createdDate: '2026-08-20',
        notes: 'Inkluderer 24/7 SLA og dedikert rådgivning.'
    },
    {
        id: '2',
        title: 'Betalingsløsning E-handel',
        partner: 'PayQuick Norge',
        value: 180000,
        status: 'Signert',
        createdDate: '2026-08-25',
        notes: 'Lansering planlagt Q4 2026.'
    },
    {
        id: '3',
        title: 'ERP Tilpasning & API',
        partner: 'Viking Data Systems',
        value: 720000,
        status: 'Utkast',
        createdDate: '2026-09-01',
        notes: 'Venter på teknisk spesifikasjon.'
    }
];

function getDeals() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDeals));
        return initialDeals;
    }
    return JSON.parse(saved);
}

function saveDeals(deals) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(amount);
}

// UI Elements
const dealsTableBody = document.getElementById('deals-table-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const statTotalDeals = document.getElementById('stat-total-deals');
const statPendingDeals = document.getElementById('stat-pending-deals');
const statCompletedDeals = document.getElementById('stat-completed-deals');
const statTotalValue = document.getElementById('stat-total-value');

// Modal Elements
const dealModal = document.getElementById('deal-modal');
const btnNewDeal = document.getElementById('btn-new-deal');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const dealForm = document.getElementById('deal-form');

function renderStats(deals) {
    const total = deals.length;
    const pending = deals.filter(d => d.status === 'Forhandling').length;
    const completed = deals.filter(d => d.status === 'Signert').length;
    const totalValue = deals.reduce((sum, d) => sum + Number(d.value || 0), 0);

    statTotalDeals.textContent = total;
    statPendingDeals.textContent = pending;
    statCompletedDeals.textContent = completed;
    statTotalValue.textContent = formatCurrency(totalValue);
}

function renderTable() {
    const deals = getDeals();
    renderStats(deals);

    const query = searchInput.value.toLowerCase().trim();
    const status = statusFilter.value;

    const filtered = deals.filter(deal => {
        const matchesQuery = deal.title.toLowerCase().includes(query) ||
                             deal.partner.toLowerCase().includes(query) ||
                             (deal.notes && deal.notes.toLowerCase().includes(query));
        const matchesStatus = status === 'all' || deal.status === status;
        return matchesQuery && matchesStatus;
    });

    dealsTableBody.innerHTML = '';

    if (filtered.length === 0) {
        dealsTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    Ingen avtaler funnet.
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(deal => {
        const tr = document.createElement('tr');
        const badgeClass = `badge-${deal.status.toLowerCase()}`;

        tr.innerHTML = `
            <td><strong>${escapeHtml(deal.title)}</strong></td>
            <td>${escapeHtml(deal.partner)}</td>
            <td>${formatCurrency(deal.value)}</td>
            <td><span class="badge ${badgeClass}">${escapeHtml(deal.status)}</span></td>
            <td>${deal.createdDate || '-'}</td>
            <td>
                <button class="action-btn" onclick="deleteDeal('${deal.id}')" title="Slett avtale">🗑️ Slett</button>
            </td>
        `;
        dealsTableBody.appendChild(tr);
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.deleteDeal = function(id) {
    if (confirm('Er du sikker på at du vil slette denne avtalen?')) {
        const deals = getDeals().filter(d => d.id !== id);
        saveDeals(deals);
        renderTable();
    }
};

// Modal Handlers
btnNewDeal.addEventListener('click', () => {
    dealForm.reset();
    dealModal.classList.remove('hidden');
});

modalClose.addEventListener('click', () => dealModal.classList.add('hidden'));
modalCancel.addEventListener('click', () => dealModal.classList.add('hidden'));

dealForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('deal-title').value;
    const partner = document.getElementById('deal-partner').value;
    const value = parseFloat(document.getElementById('deal-value').value) || 0;
    const status = document.getElementById('deal-status').value;
    const notes = document.getElementById('deal-notes').value;

    const newDeal = {
        id: Date.now().toString(),
        title,
        partner,
        value,
        status,
        createdDate: new Date().toISOString().split('T')[0],
        notes
    };

    const deals = getDeals();
    deals.unshift(newDeal);
    saveDeals(deals);

    dealModal.classList.add('hidden');
    renderTable();
});

// Search & Filter listeners
searchInput.addEventListener('input', renderTable);
statusFilter.addEventListener('change', renderTable);

// Initialize
document.addEventListener('DOMContentLoaded', renderTable);
