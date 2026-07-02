const balanceBtn = document.getElementById('balanceBtn');
const transactionsBtn = document.getElementById('transactionsBtn');
const balanceSection = document.getElementById('balance');
const transactionsSection = document.getElementById('transactions');
const addWalletBtn = document.getElementById('addWalletBtn');
const overlay = document.getElementById('overlay');
const closeModalBtn = document.getElementById('closeModalBtn');

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

document.querySelectorAll('.colorOption').forEach(option => {
    option.onclick = () => {
        // remove selected class from all
        document.querySelectorAll('.colorOption').forEach(o => o.classList.remove('selected'));
        // add to clicked one
        option.classList.add('selected');
        // save the value
        document.getElementById('selectedColor').value = option.dataset.color;
    }
});

addWalletBtn.onclick = () => {
    overlay.classList.add('open');
}

closeModalBtn.onclick = () => {
    overlay.classList.remove('open');
}
