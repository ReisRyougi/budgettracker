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
    if (newWalletName.value === '') {
            window.alert('Name cannot be empty.');
        }
    else if(!cryptoRadio.checked && (initialBalance.value === '')) {
        window.alert('Initial balance cannot be empty.')
    }
    else if(cryptoRadio.checked && (coinAmount.value === '')) {
        window.alert('Initial crypto balance cannot be empty.')
    }
    else {
        const walletName = newWalletName.value;
        console.log(walletName);
        if (!cryptoRadio.checked){
            let walletBalance = initialBalance.value;
            console.log(walletBalance);
        }
        else {
            let walletCryptoBalance = coinAmount.value;
            const coinName = cryptoName.value;
            console.log(walletCryptoBalance);
            console.log(coinName);
        }
    }
}