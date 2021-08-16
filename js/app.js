// ------------ Variables y Selectores ------------
const form = document.querySelector('#agregar-gasto');
const expenseList = document.querySelector('#gastos ul');



// ------------ Listeners ------------
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget);

    form.addEventListener('submit', addExpense);
}



// ------------ Clases ------------
class Budget {
    constructor(budget) {
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    }

    newExpense(expense) {
        this.expenses = [...this.expenses, expense];
        this.calculateRemaining();
    }
    calculateRemaining() {
        const expend = this.expenses.reduce((total, expense) => Number(total) + Number(expense.amount), 0);
        this.remaining = this.budget - expend;
    }
    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining();
    }
}


class UI {
    insertBudget(data) {
        const { budget, remaining } = data;
        document.querySelector('#total').textContent = budget;
        document.querySelector('#restante').textContent = remaining;
    }
    showAlert(alert, type) {
        const divAlert = document.createElement('div');
        divAlert.classList.add('text-center', 'alert');

        if (type === 'error') {
            divAlert.classList.add('alert-danger');
        } else {
            divAlert.classList.add('alert-success');
        }

        divAlert.textContent = alert;

        document.querySelector('.primario').insertBefore(divAlert, form);

        setTimeout(() => {
            divAlert.remove();
        }, 3000);
    }
    showExpenseList(expenses) {
        this.clearHTML();
        // iterar sobre gastos
        expenses.forEach(expense => {
            const { amount, name, id } = expense;

            const newExpense = document.createElement('li');
            newExpense.className = 'list-group-item d-flex justify-content-between align-items-center';
            newExpense.dataset.id = id;

            newExpense.innerHTML = `${name} <span class="badge badge-primary badge-pill">$ ${amount}</span>`;

            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnDelete.innerHTML = 'Borrar &times';
            btnDelete.onclick = () => {
                deleteExpense(id);
            }
            newExpense.appendChild(btnDelete);

            expenseList.appendChild(newExpense);
        });
    }
    clearHTML() {
        while (expenseList.firstChild) {
            expenseList.removeChild(expenseList.firstChild);
        }
    }
    refreshRemaining(remaining) {
        document.querySelector('#restante').textContent = remaining;
    }
    checkBudget(budgetObjt) {
        const { budget, remaining } = budgetObjt;

        const remainingDiv = document.querySelector('.restante');

        if ((budget / 4) > remaining) {
            remainingDiv.classList.remove('alert-success', 'alert-warning');
            remainingDiv.classList.add('alert-danger');
        } else if ((budget / 2) > remaining) {
            remainingDiv.classList.remove('alert-success');
            remainingDiv.classList.add('alert-warning');
        } else {
            remainingDiv.classList.remove('alert-danger', 'alert-warning');
            remainingDiv.classList.add('alert-success');
        }

        if (remaining <= 0) {
            ui.showAlert('El presupuesto se ha agotado', 'error');
            form.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// instanciacion global de la clase UI para acceder y modificar html 
const ui = new UI();

/* // instanciacion dinamica de la clase, toma el lugar en la variable 
 una vez ha sido generada por usuario y ocupa lugar en constructor. */
let budget;


// ------------ Funciones ------------
function askBudget() {
    const userBudget = prompt('Indica tu presupuesto:');

    if (userBudget === '' || userBudget === null || isNaN(userBudget) || userBudget <= 0) {
        askBudget('Indica un presupuesto numerico valido');
    }

    budget = new Budget(userBudget);

    ui.insertBudget(budget);
}

function addExpense(e) {
    e.preventDefault();

    // obtener y validar gasto a agregar
    const name = document.querySelector('#gasto').value;
    let amount = Number(document.querySelector('#cantidad').value);

    if (name === '' || amount === '') {
        ui.showAlert('Ambos campos son obligatorios', 'error');
        return;
    } else if (amount <= 0 || isNaN(amount)) {
        ui.showAlert('Cantidad no valida', 'error');
        return;
    }

    // generar gasto con data suministrada. 
    const expense = { name, amount, id: Date.now() }

    // Invoca funcion y añade gasto generado
    budget.newExpense(expense);
    // Invoca funcion y añade mensaje dinamico
    ui.showAlert('Cantidad añadida');
    // Extraer gastos de objeto
    const { expenses, remaining } = budget;
    ui.showExpenseList(expenses);
    ui.refreshRemaining(remaining);

    ui.checkBudget(budget);

    form.reset();


}

function deleteExpense(id) {
    // Elimina de la clase
    budget.deleteExpense(id);

    // Elimina del html
    const { expenses, remaining } = budget;
    ui.showExpenseList(expenses);

    ui.refreshRemaining(remaining);

    ui.checkBudget(budget);
}