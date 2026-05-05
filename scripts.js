const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "");

    value = Number(value) / 100;

    amount.value = formatCurrencyBRL(value);
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    return value;
}

form.onsubmit = (event) => {
    event.preventDefault();

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }
    expenseAdd(newExpense);
}    

function expenseAdd(newExpense) {
    try {
        // Cria o elemento para adicionar a nova despesa na lista
        const expenseItem = document.createElement("li");
        expenseItem.classList.add("expense");

        // Cria o icone da categoria
        const expenseIcon = document.createElement("img");
        expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", newExpense.category_name);

        // Cria o texto da despesa (info)
        const expenseInfo = document.createElement("div");
        expenseInfo.classList.add("expense-info");

        // Cria o nome da despesa
        const expenseName = document.createElement("strong");
        expenseName.textContent = newExpense.expense;

        // Cria a categoria da despesa
        const expenseCategory = document.createElement("span");
        expenseCategory.textContent = newExpense.category_name;

        // Adciona nome e categoria na div de info
        expenseInfo.append(expenseName, expenseCategory);

        // Cria o valor da despesa
        const expenseAmount = document.createElement("span");
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`;

        // Cria o ícone de remover
        const removeIcon = document.createElement("img");
        removeIcon.classList.add("remove-icon");
        removeIcon.setAttribute("src", "./img/remove.svg");
        removeIcon.setAttribute("alt", "remover");
        
        // Adiciona as informações da despesa no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

        // Adiciona o item na lista de despesas
        expenseList.append(expenseItem);
        
        clearForm();

        // Atualiza os totais
        updateTotals();

    } catch (error) {
        alert("Ocorreu um erro ao adicionar a despesa.");
        console.log(error);
    }
}

function updateTotals() {
    try {
        // Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children

        // Atualiza a quantidade de despesas
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

        // Variável para armazenar o total das despesas
        let total = 0;

        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            // Remove os caracteres não numéricos e troca a vírgula por ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".");
            // Converte o valor para float
            value = parseFloat(value)

            // Verifica se o valor é um número válido antes de somar
            if (isNaN(value)) {
                return alert("Valor inválido encontrado em uma despesa. Verifique os valores e tente novamente.");
            }

            total += Number(value);
        }
        
        // Cria uma span para adcionar o R$ formatado
        const symbolBRL = document.createElement("small");
        symbolBRL.textContent = "R$";

        // Formata o valor e remove o R$ que será exibido pela small com um estilo personalizado
        total = formatCurrencyBRL(total).replace("R$", "");

        // Limpa o conteúdo do elemento
        expensesTotal.innerHTML = "";

        expensesTotal.append(symbolBRL, total);

    } catch (error) {
        alert("Ocorreu um erro ao atualizar os totais.");
        console.log(error);
    }
}

expenseList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-icon")) {
        const item = event.target.closest(".expense");
        item.remove();
    }
    updateTotals();
});

function clearForm() {
    expense.value = "";
    category.value = "";
    amount.value = "";

    expense.focus();
}