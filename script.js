const balanceBtn = document.getElementById('balanceBtn');
const transactionsBtn = document.getElementById('transactionsBtn');
const balanceSection = document.getElementById('balance');
const transactionsSection = document.getElementById('transactions');
const addWalletBtn = document.getElementById('addWalletBtn');
const overlay = document.getElementById('overlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const addWalletModal = document.getElementById('addWalletModal');
const transactionModal = document.getElementById('transactionModal');
const addTransactionBtn = document.getElementById('addTransactionBtn');

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

const emptyChart = document.getElementById('emptyChart');
const walletChart = document.getElementById('walletChart');

let wallets = JSON.parse(localStorage.getItem('wallets')) || [];

let chart = null;

const incomeCategories = ['Income', 'Gift'];
const expenseCategories = ['Rent', 'Food', 'Internet/Orders'];

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

async function renderWallets() {
    walletList.innerHTML = '';

    const cryptoWallets = wallets.filter(w => w.type === 'crypto');
    const coinIds = cryptoWallets.map(w => w.coin).join(',');
    
    let prices = {};
    if (cryptoWallets.length > 0) {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=eur`);
        prices = await response.json();
        console.log(prices);
    }

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
        // price calculation for crypto
        const balanceEl = document.createElement('span');
        if (wallet.type === 'crypto') {
            const price = prices[wallet.coin]?.eur ?? '?';
            const euroValue = price !== '?' ? (wallet.amount * price).toFixed(2) : '?';
            balanceEl.innerText = `${wallet.amount} ${wallet.coin} (≈ ${euroValue})`;
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
    renderChart(prices);
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
    addWalletModal.classList.add('active');
}

closeModalBtn.onclick = () => {
    closeOverlay();
}

overlay.onclick = (event) => {
    if (!addWalletModal.contains(event.target) && !transactionModal.contains(event.target)) {
        closeOverlay();
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
    closeOverlay();
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

function renderChart(prices) {
    const labels = [];
    const colors = [];
    const values = [];
    // fill arrays
    wallets.forEach(wallet => {
        labels.push(wallet.name);
        colors.push(wallet.color);
        if (wallet.type === 'crypto') {
            values.push((wallet.amount * (prices[wallet.coin]?.eur ?? 0)));
        }
        else {
            values.push(wallet.balance);
        }
    })

    if (chart) {
        chart.destroy();
        chart = null;
    }
    // remove existing chart so they don't stack
    if (wallets.length > 0) {
        emptyChart.style.display = 'none';
        walletChart.style.display = 'block';
    }
    else {
        emptyChart.style.display = 'flex';
        walletChart.style.display = 'none';
    }

    chart = new Chart(walletChart.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: false,
            }
    });
}

function closeOverlay() {
    overlay.classList.remove('open');
    addWalletModal.classList.remove('active');
    transactionModal.classList.remove('active');
}

addTransactionBtn.onclick = () => {
    buildTransactionModal();
    overlay.classList.add('open');
    transactionModal.classList.add('active');
};

// creates entire modal in js and not html because al wallets values are here
function buildTransactionModal() {
    transactionModal.innerHTML = '';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.innerText = '✕';
    closeBtn.onclick = () => closeOverlay();

    const title = document.createElement('h3');
    title.innerText = 'Add Transaction';

    const form = document.createElement('form');
    form.id = 'transactionForm';

    // type of transaction
    const typeP = document.createElement('p');
    typeP.innerHTML = `
        <input type="radio" name="txType" id="txIncome" value="income" checked>
        <label for="txIncome">Income</label>
        <input type="radio" name="txType" id="txExpense" value="expense">
        <label for="txExpense">Expense</label>
        <input type="radio" name="txType" id="txTransfer" value="transfer">
        <label for="txTransfer">Transfer</label>
    `;

    // first wallet
    const walletDiv = document.createElement('div');
    const walletLabel = document.createElement('label');
    walletLabel.innerText = 'Wallet:';
    const walletSelect = document.createElement('select');
    walletSelect.id = 'txWallet';
    wallets.filter(w => w.type !== 'crypto').forEach(w => {
        const option = document.createElement('option');
        option.value = w.id;
        option.innerText = w.name;
        walletSelect.appendChild(option);
    });
    walletDiv.appendChild(walletLabel);
    walletDiv.appendChild(walletSelect);

    // second wallet
    const toWalletDiv = document.createElement('div');
    toWalletDiv.style.display = 'none';
    const toWalletLabel = document.createElement('label');
    toWalletLabel.innerText = 'To Wallet:';
    const toWalletSelect = document.createElement('select');
    toWalletSelect.id = 'txToWallet';
    wallets.filter(w => w.type !== 'crypto').forEach(w => {
        const option = document.createElement('option');
        option.value = w.id;
        option.innerText = w.name;
        toWalletSelect.appendChild(option);
    });
    toWalletDiv.appendChild(toWalletLabel);
    toWalletDiv.appendChild(toWalletSelect);

    // money
    const amountDiv = document.createElement('div');
    const amountLabel = document.createElement('label');
    amountLabel.innerText = 'Amount:';
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.id = 'txAmount';
    amountInput.min = '0';
    amountInput.step = '0.01';
    amountDiv.appendChild(amountLabel);
    amountDiv.appendChild(amountInput);

    // reason of spending or getting
    const categoryDiv = document.createElement('div');
    const categoryLabel = document.createElement('label');
    categoryLabel.innerText = 'Category:';
    const categorySelect = document.createElement('select');
    categorySelect.id = 'txCategory';
    // populate with income categories by default
    incomeCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.innerText = cat;
        categorySelect.appendChild(option);
    });
    categoryDiv.appendChild(categoryLabel);
    categoryDiv.appendChild(categorySelect);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.innerText = 'Add Transaction';

    // logic for type change, also made function inside a function because doing radio.onchange = () => {...} would use more memory
    // runs whenever a type radio is clicked
    function onTypeChange() {
        const type = document.querySelector('input[name="txType"]:checked').value;

        // show/hide second wallet
        toWalletDiv.style.display = type === 'transfer' ? 'block' : 'none';

        // show/hide category, update options
        if (type === 'transfer') {
            categoryDiv.style.display = 'none';
        } else {
            categoryDiv.style.display = 'block';
            categorySelect.innerHTML = '';
            const cats = type === 'income' ? incomeCategories : expenseCategories;
            cats.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.innerText = cat;
                categorySelect.appendChild(option);
            });
        }
    }

    // attach onTypeChange to all three radios
    typeP.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.onchange = onTypeChange;
    });

    form.onsubmit = (event) => {
        event.preventDefault();
        submitTransaction(walletSelect, toWalletSelect, amountInput, categorySelect);
    };

    // assemble form
    form.appendChild(typeP);
    form.appendChild(walletDiv);
    form.appendChild(toWalletDiv);
    form.appendChild(amountDiv);
    form.appendChild(categoryDiv);
    form.appendChild(submitBtn);

    transactionModal.appendChild(closeBtn);
    transactionModal.appendChild(title);
    transactionModal.appendChild(form);
}

function submitTransaction(walletSelect, toWalletSelect, amountInput, categorySelect) {
    const type = document.querySelector('input[name="txType"]:checked').value;
    const amount = parseFloat(amountInput.value);

    // validation
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    if (type === 'transfer' && walletSelect.value === toWalletSelect.value) {
        alert('Cannot transfer to the same wallet.');
        return;
    }

    // build transaction object
    const transaction = {
        id: Date.now(),
        type: type,
        amount: amount,
        date: new Date().toISOString().split('T')[0]
    };

    if (type === 'transfer') {
        transaction.fromWalletId = parseInt(walletSelect.value);
        transaction.toWalletId = parseInt(toWalletSelect.value);
    } else {
        transaction.walletId = parseInt(walletSelect.value);
        transaction.category = categorySelect.value;
    }

    // update wallet balances
    if (type === 'income') {
        const wallet = wallets.find(w => w.id === transaction.walletId);
        if (wallet) wallet.balance += amount;
    } else if (type === 'expense') {
        const wallet = wallets.find(w => w.id === transaction.walletId);
        if (wallet) wallet.balance -= amount;
    } else if (type === 'transfer') {
        const fromWallet = wallets.find(w => w.id === transaction.fromWalletId);
        const toWallet = wallets.find(w => w.id === transaction.toWalletId);
        if (fromWallet) fromWallet.balance -= amount;
        if (toWallet) toWallet.balance += amount;
    }

    // save everything
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('wallets', JSON.stringify(wallets));

    // close and refresh
    closeOverlay();
    renderWallets();
    renderTransactions();
}

function renderTransactions() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';

    if (transactions.length === 0) {
        const empty = document.createElement('p');
        empty.innerText = 'No transactions yet.';
        transactionList.appendChild(empty);
        return;
    }

    // newest first — reverse without modifying original array
    [...transactions].reverse().forEach(transaction => {
        const row = document.createElement('div');
        row.className = 'transactionRow';

        // date
        const dateEl = document.createElement('span');
        dateEl.innerText = transaction.date;
        dateEl.className = 'txDate';

        // type badge
        const typeEl = document.createElement('span');
        typeEl.innerText = transaction.type;
        typeEl.className = `txType ${transaction.type}`; // e.g. 'txType income'

        // amount
        const amountEl = document.createElement('span');
        amountEl.className = 'txAmount';
        if (transaction.type === 'income') {
            amountEl.innerText = `+${transaction.amount} €`;
            amountEl.style.color = '#27ae60';
        } else if (transaction.type === 'expense') {
            amountEl.innerText = `-${transaction.amount} €`;
            amountEl.style.color = '#c0392b';
        } else {
            amountEl.innerText = `${transaction.amount} €`;
        }

        // wallet name(s)
        const walletEl = document.createElement('span');
        walletEl.className = 'txWallet';
        if (transaction.type === 'transfer') {
            const from = wallets.find(w => w.id === transaction.fromWalletId);
            const to = wallets.find(w => w.id === transaction.toWalletId);
            walletEl.innerText = `${from ? from.name : 'Deleted'} → ${to ? to.name : 'Deleted'}`;
        } else {
            const wallet = wallets.find(w => w.id === transaction.walletId);
            walletEl.innerText = wallet ? wallet.name : 'Deleted wallet';
        }

        // category (not for transfers)
        const categoryEl = document.createElement('span');
        categoryEl.className = 'txCategory';
        categoryEl.innerText = transaction.category || '';

        row.appendChild(dateEl);
        row.appendChild(typeEl);
        row.appendChild(amountEl);
        row.appendChild(walletEl);
        row.appendChild(categoryEl);

        transactionList.appendChild(row);
    });
}

renderWallets();
renderTransactions();