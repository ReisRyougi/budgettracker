const balanceBtn = document.getElementById('balanceBtn');
const transactionsBtn = document.getElementById('transactionsBtn');
const balanceSection = document.getElementById('balance');
const transactionsSection = document.getElementById('transactions');

function switchTab(showSection, activeBtn, hideSection, inactiveBtn) {
    showSection.classList.add('active');
    hideSection.classList.remove('active');
    activeBtn.classList.add('active');
    activeBtn.disabled = true;
    inactiveBtn.classList.remove('active');
    inactiveBtn.disabled = false;
}

balanceBtn.onclick = () => switchTab(balanceSection, balanceBtn, transactionsSection, transactionsBtn);
transactionsBtn.onclick = () => switchTab(transactionsSection, transactionsBtn, balanceSection, balanceBtn);