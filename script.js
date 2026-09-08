const balanceBtn = document.getElementById('balanceBtn');
const transactionsBtn = document.getElementById('transactionsBtn');
const balanceSection = document.getElementById('balance');
const transactionsSection = document.getElementById('transactions');
const addWalletBtn = document.getElementById('addWalletBtn');
const overlay = document.getElementById('overlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const addWalletModal = document.getElementById('addWalletModal')

const fiatRadio = document.getElementById('newWalletTypeFiat');
const cryptoRadio = document.getElementById('newWalletTypeCrypto');
const fiatFields = document.getElementById('fiatFields');
const cryptoFields = document.getElementById('cryptoFields');

const newWalletName = document.getElementById('newWalletName');

const addWalletForm = document.getElementById('addWalletForm');
const initialBalance = document.getElementById('initialBalance');
const coinAmount = document.getElementById('coinAmount');
const cryptoName = document.getElementById('coinSelect');
const walletList = document.getElementById('walletList');
const selectedColor = document.getElementById('selectedColor');

let wallets = JSON.parse(localStorage.getItem('wallets')) || [];

function renderWallets() {
    walletList.innerHTML = '';

    wallets.forEach(wallet => {
        const card = document.createElement('div');
        card.className = 'walletCard';

        const colorSquare = document.createElement('div');
        colorSquare.className = 'walletColor';
        colorSquare.style.background = wallet.color;

        const nameEl = document.createElement('span');
        nameEl.innerText = wallet.name;

        const typeEl = document.createElement('span');
        typeEl.innerText = wallet.type === 'crypto' ? 'Crypto' : 'Fiat';

        const balanceEl = document.createElement('span');
        if (wallet.type === 'crypto') {
            balanceEl.innerText = `${wallet.amount} ${wallet.coin}`;
        } else {
            balanceEl.innerText = `${wallet.balance} €`;
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = '✕';
        deleteBtn.onclick = () => deleteWallet(wallet.id);

        card.appendChild(colorSquare);
        card.appendChild(nameEl);
        card.appendChild(typeEl);
        card.appendChild(balanceEl);
        card.appendChild(deleteBtn);

        walletList.appendChild(card);
    });
}


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

overlay.onclick = (event) => {
    if(!addWalletModal.contains(event.target)){
        overlay.classList.remove('open')
    }
}

function toggleWalletType() {
    const isCrypto = cryptoRadio.checked;
    fiatFields.style.display = isCrypto ? 'none' : 'block';
    cryptoFields.style.display = isCrypto ? 'block' : 'none';
}

fiatRadio.onchange = toggleWalletType;
cryptoRadio.onchange = toggleWalletType;

addWalletForm.onsubmit = (event) => {
    event.preventDefault();
    submitNewWallet();
}

function submitNewWallet (){
    if(newWalletName.value === '') {
            window.alert('Name cannot be empty.');
            return;
        }

    if(!cryptoRadio.checked && (initialBalance.value === '')) {
        window.alert('Initial balance cannot be empty.');
        return;
    }

    if(cryptoRadio.checked && (coinAmount.value === '')) {
        window.alert('Initial crypto balance cannot be empty.');
        return;
    }

    if(selectedColor.value === '') {
        window.alert('Please select a color.');
        return;
    }
    let wallet;

    if(cryptoRadio.checked){
        wallet = {
            id: Date.now(),
            name: newWalletName.value,
            type: 'crypto',
            coin: cryptoName.value,
            amount: parseFloat(coinAmount.value),
            color: selectedColor.value
        };
    } else {
        wallet = {
            id: Date.now(),
            name: newWalletName.value,
            type: 'manual',
            balance: parseFloat(initialBalance.value),
            color: selectedColor.value
        };
    }

    // save wallet
    wallets.push(wallet);
    localStorage.setItem('wallets', JSON.stringify(wallets));

    // close and reset
    overlay.classList.remove('open');
    addWalletForm.reset();
    document.querySelectorAll('.colorOption').forEach(o => o.classList.remove('selected'));
    cryptoFields.style.display = 'none';
    fiatFields.style.display = 'block';

    console.log('Wallet added:', wallet);
    console.log('All wallets:', wallets);
    renderWallets();
}

function deleteWallet(id) {
    wallets = wallets.filter(w => w.id !== id)
    localStorage.setItem('wallets', JSON.stringify(wallets));
    renderWallets();
}

renderWallets();