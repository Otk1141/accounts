/* ============================================================
   script.js – Complete JavaScript (with page fade-in)
   ============================================================ */

// ============================================================
// PAGE FADE-IN
// ============================================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// ============================================================
// LANGUAGE TOGGLE – FIXED
// ============================================================
function setLanguage(lang) {
    const body = document.body;
    const btnEn = document.getElementById('btnEn');
    const btnAr = document.getElementById('btnAr');

    body.classList.remove('lang-en', 'lang-ar');
    body.classList.add('lang-' + lang);
    body.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    btnEn.classList.toggle('active', lang === 'en');
    btnAr.classList.toggle('active', lang === 'ar');

    updateBilingualContent(lang);
    localStorage.setItem('otk1-lang', lang);
}

function updateBilingualContent(lang) {
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text) el.textContent = text;
    });
}

// ============================================================
// TABS
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('tab-' + tabId).classList.add('active');
        document.querySelector('.tabs-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ============================================================
// FAQ
// ============================================================
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
    if (!isOpen) {
        item.classList.add('open');
        setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
}

// ============================================================
// TOAST
// ============================================================
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');
    toastMsg.textContent = message;
    if (isError) {
        icon.className = 'fas fa-exclamation-circle';
        toast.classList.add('error');
    } else {
        icon.className = 'fas fa-check-circle';
        toast.classList.remove('error');
    }
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// PRICE MODAL
// ============================================================
let selectedPlan = null;
let currentRank = { name: '', icon: '', prefix: '' };

function openPriceModal(rankName, rankIcon, rankPrefix) {
    currentRank = { name: rankName, icon: rankIcon, prefix: rankPrefix };
    selectedPlan = null;

    document.getElementById('modalRankIcon').textContent = rankIcon;
    document.getElementById('modalRankName').textContent = rankName;
    document.getElementById('modalRankPrefix').textContent = rankPrefix;

    document.querySelectorAll('.modal-option').forEach(el => el.classList.remove('selected'));
    document.getElementById('modalConfirmBtn').disabled = true;
    document.getElementById('priceModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePriceModal() {
    document.getElementById('priceModal').classList.remove('active');
    document.body.style.overflow = '';
    selectedPlan = null;
}

function selectPlan(element) {
    document.querySelectorAll('.modal-option').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.modal-option .opt-check').forEach(el => el.style.opacity = '0');

    element.classList.add('selected');
    const check = element.querySelector('.opt-check');
    if (check) check.style.opacity = '1';

    selectedPlan = element.dataset.plan;
    document.getElementById('modalConfirmBtn').disabled = false;
}

function confirmPlan() {
    if (!selectedPlan) return;
    const planNames = { weekly: 'Weekly', monthly: 'Monthly', '3months': '3 Months', lifetime: 'Lifetime' };
    const planPrices = { weekly: '$5', monthly: '$20', '3months': '$60', lifetime: '$120' };
    const planEmojis = { weekly: '⚡', monthly: '🔥', '3months': '💎', lifetime: '👑' };
    const rankName = currentRank.name;
    const planName = planNames[selectedPlan] || selectedPlan;
    const price = planPrices[selectedPlan] || '';
    showToast(`✅ ${rankName} • ${planEmojis[selectedPlan]} ${planName} • ${price} — Added to cart!`);
    setTimeout(() => closePriceModal(), 300);
}

document.getElementById('priceModal').addEventListener('click', function(e) {
    if (e.target === this) closePriceModal();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePriceModal();
});

// ============================================================
// COPY IP
// ============================================================
function copyIp() {
    const ip = document.getElementById('serverIp').textContent;
    navigator.clipboard.writeText(ip).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.classList.add('copied');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> <span data-en="Copied!" data-ar="تم النسخ!"></span>';
        updateBilingualContent(document.body.classList.contains('lang-en') ? 'en' : 'ar');
        showToast('IP copied to clipboard!');
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalHTML;
        }, 2500);
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        const btn = document.getElementById('copyBtn');
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fas fa-check"></i> <span data-en="Copied!" data-ar="تم النسخ!"></span>';
        showToast('IP copied to clipboard!');
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '<i class="fas fa-copy"></i> <span data-en="Copy IP" data-ar="نسخ الآي بي"></span>';
        }, 2500);
    });
}

// ============================================================
// SUPPORT FORM
// ============================================================
function handleSupport(e) {
    e.preventDefault();
    const name = document.getElementById('supportName').value;
    const email = document.getElementById('supportEmail').value;
    const message = document.getElementById('supportMessage').value;
    if (!name || !email || !message) {
        showToast('Please fill in all fields.', true);
        return false;
    }
    showToast('✅ Ticket sent! We\'ll respond within 24 hours.');
    document.getElementById('supportForm').reset();
    return false;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('otk1-lang') || 'en';
    setLanguage(savedLang);
    updateBilingualContent(savedLang);

    // Player count animation
    const countEl = document.getElementById('playerCount');
    if (countEl) {
        const base = 120;
        const variation = Math.floor(Math.random() * 60);
        countEl.textContent = base + variation;
        setInterval(() => {
            const newVariation = Math.floor(Math.random() * 60);
            countEl.textContent = base + newVariation;
            countEl.style.transition = 'all 0.5s ease';
            countEl.style.transform = 'scale(1.1)';
            setTimeout(() => countEl.style.transform = 'scale(1)', 300);
        }, 30000);
    }

    // Escape key closes FAQ
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        }
    });

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.home-card, .rank-mini, .store-tab-item, .rules-card, .pricing-card, .why-item')
        .forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
            observer.observe(el);
        });

    setTimeout(() => {
        document.querySelectorAll('.home-card, .rank-mini, .store-tab-item, .rules-card, .pricing-card, .why-item')
            .forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
    }, 300);

    // Close FAQ when switching tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        });
    });

    console.log('🚀 Otk1 Network — Fully loaded with animations & emoji fixes!');
});
function closePriceModal() {
    document.getElementById('priceModal').classList.remove('active');
    document.body.style.overflow = '';
    selectedPlan = null;
}

function selectPlan(element) {
    document.querySelectorAll('.modal-option').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.modal-option .opt-check').forEach(el => el.style.opacity = '0');

    element.classList.add('selected');
    const check = element.querySelector('.opt-check');
    if (check) check.style.opacity = '1';

    selectedPlan = element.dataset.plan;
    document.getElementById('modalConfirmBtn').disabled = false;
}

function confirmPlan() {
    if (!selectedPlan) return;
    const planNames = { weekly: 'Weekly', monthly: 'Monthly', '3months': '3 Months', lifetime: 'Lifetime' };
    const planPrices = { weekly: '$5', monthly: '$20', '3months': '$60', lifetime: '$120' };
    const planEmojis = { weekly: '⚡', monthly: '🔥', '3months': '💎', lifetime: '👑' };
    const rankName = currentRank.name;
    const planName = planNames[selectedPlan] || selectedPlan;
    const price = planPrices[selectedPlan] || '';
    showToast(`✅ ${rankName} • ${planEmojis[selectedPlan]} ${planName} • ${price} — Added to cart!`);
    setTimeout(() => closePriceModal(), 300);
}

// Close modal on overlay click or Escape key
document.getElementById('priceModal').addEventListener('click', function(e) {
    if (e.target === this) closePriceModal();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePriceModal();
});

// ============================================================
// COPY IP
// ============================================================
function copyIp() {
    const ip = document.getElementById('serverIp').textContent;
    navigator.clipboard.writeText(ip).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.classList.add('copied');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> <span data-en="Copied!" data-ar="تم النسخ!"></span>';
        updateBilingualContent(document.body.classList.contains('lang-en') ? 'en' : 'ar');
        showToast('IP copied to clipboard!');
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalHTML;
        }, 2500);
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        const btn = document.getElementById('copyBtn');
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fas fa-check"></i> <span data-en="Copied!" data-ar="تم النسخ!"></span>';
        showToast('IP copied to clipboard!');
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '<i class="fas fa-copy"></i> <span data-en="Copy IP" data-ar="نسخ الآي بي"></span>';
        }, 2500);
    });
}

// ============================================================
// SUPPORT FORM
// ============================================================
function handleSupport(e) {
    e.preventDefault();
    const name = document.getElementById('supportName').value;
    const email = document.getElementById('supportEmail').value;
    const message = document.getElementById('supportMessage').value;
    if (!name || !email || !message) {
        showToast('Please fill in all fields.', true);
        return false;
    }
    showToast('✅ Ticket sent! We\'ll respond within 24 hours.');
    document.getElementById('supportForm').reset();
    return false;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Load language preference
    const savedLang = localStorage.getItem('otk1-lang') || 'en';
    setLanguage(savedLang);

    // Update bilingual content on load
    updateBilingualContent(savedLang);

    // Player count animation
    const countEl = document.getElementById('playerCount');
    if (countEl) {
        const base = 120;
        const variation = Math.floor(Math.random() * 60);
        countEl.textContent = base + variation;
        setInterval(() => {
            const newVariation = Math.floor(Math.random() * 60);
            countEl.textContent = base + newVariation;
            countEl.style.transition = 'all 0.5s ease';
            countEl.style.transform = 'scale(1.1)';
            setTimeout(() => countEl.style.transform = 'scale(1)', 300);
        }, 30000);
    }

    // Escape key closes FAQ
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        }
    });

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.home-card, .rank-mini, .store-tab-item, .rules-card, .pricing-card, .why-item')
        .forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
            observer.observe(el);
        });

    setTimeout(() => {
        document.querySelectorAll('.home-card, .rank-mini, .store-tab-item, .rules-card, .pricing-card, .why-item')
            .forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
    }, 300);

    // Close FAQ when switching tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        });
    });

    console.log('🚀 Otk1 Network — Fully loaded with working language toggle!');
});
