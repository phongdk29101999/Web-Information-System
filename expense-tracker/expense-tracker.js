const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const trans = document.getElementById('transaction');
const category = document.getElementById('category');

const categoryData = [
  { transaction: 'expense', category_id: '1', category: 'Food & Beverage' },
  { transaction: 'expense', category_id: '2', category: 'Bills & Utilities' },
  { transaction: 'expense', category_id: '3', category: 'Transportation' },
  { transaction: 'expense', category_id: '4', category: 'Shopping' },
  { transaction: 'expense', category_id: '5', category: 'Entertainment' },
  { transaction: 'expense', category_id: '6', category: 'Travel' },
  { transaction: 'expense', category_id: '7', category: 'Health & Fitness' },
  { transaction: 'expense', category_id: '8', category: 'Friends & Love' },
  { transaction: 'expense', category_id: '9', category: 'Family' },
  { transaction: 'expense', category_id: '10', category: 'Education' },
  { transaction: 'expense', category_id: '11', category: 'Others' },
  { transaction: 'income', category_id: '12', category: 'Award' },
  { transaction: 'income', category_id: '13', category: 'Salary' },
  { transaction: 'income', category_id: '14', category: 'Gifts' },
  { transaction: 'income', category_id: '15', category: 'Selling' },
  { transaction: 'income', category_id: '16', category: 'Interest Money' },
  { transaction: 'income', category_id: '17', category: 'Others' },
];

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ];

// select category
function categoryVal() {
  category.innerHTML = "<option value='' disabled selected style='display:none;'>Select category...</option>";
  let count = 0;
  for (count = 0; count < categoryData.length; count++) {
    if (trans.value == categoryData[count].transaction) {
      let option = document.createElement('option');
      option.value = categoryData[count].category_id;
      option.innerHTML = categoryData[count].category;
      category.appendChild(option);
    }
  }
}

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || trans.value.trim() === '' || category.value.trim() === '') {
    alert('Please select transaction type and category or add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      type: trans.value,
      category: category.value,
      text: text.value,
      amount: trans.value == 'expense' ? -amount.value : +amount.value,
    };
    // console.log(transaction);    
    transactions.push(transaction);
    // console.log(transactions); 
    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    trans.value = '';
    category.value = '';
    text.value = '';
    amount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.type == 'expense' ? '-' : '+';

  const item = document.createElement('li');

  //get category name
  let cateName = "";
  let count = 0;
  for (count = 0; count < categoryData.length; count++) {
    if (categoryData[count].category_id == transaction.category) {
      cateName = categoryData[count].category;
    }
  }
  
  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    <div class="img">
      <img src="./icon/${transaction.category}.svg" alt="">
    </div>
    <div class="info">
      ${cateName}
      <span class="num">${sign}${Math.abs(transaction.amount)}</span> 
      <small class="des">${transaction.text}</small> 
    </div>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  // item.innerHTML = `
  //   <img src="/expense-tracker/icon/${transaction.category}.svg" alt="">
  //   <p>${cateName}</p>
  //   <small>${transaction.text}</small> 
  //   <span>${sign}${Math.abs(transaction.amount)}</span> 
  //   <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  // `;

  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  // console.log(amounts);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)
    ;

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `${total}$`;
  money_plus.innerText = `${income}$`;
  money_minus.innerText = `${expense}$`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
