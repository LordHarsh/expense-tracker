/* Wait for the page to finish loading */
window.addEventListener("load", function () {

    /* Get references to HTML elements */
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const filterForm = document.getElementById("filter-form");
    const filterDate = document.getElementById("filter-date");
    const filterCategory = document.getElementById("filter-category");
  
    /* Define function to render expense list */
    function renderExpenseList(expenses) {
      expenseList.innerHTML = "";
  
      if (expenses.length === 0) {
        expenseList.innerHTML = "<tr><td colspan='4'>No expenses found</td></tr>";
      } else {
        expenses.forEach(function (expense) {
          expenseList.innerHTML += `
            <tr>
              <td>${expense.name}</td>
              <td>${expense.amount}</td>
              <td>${expense.date}</td>
              <td>${expense.category}</td>
              <td>
                <a href="/expenses/${expense._id}/edit">Edit</a>
                <a href="/expenses/${expense._id}/delete" onclick="return confirm('Are you sure you want to delete this expense?')">Delete</a>
              </td>
            </tr>
          `;
        });
      }
    }
  
    /* Add event listener to expense form */
    expenseForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      /* Get form data */
      const name = document.getElementById("name").value;
      const amount = document.getElementById("amount").value;
      const date = document.getElementById("date").value;
      const category = document.getElementById("category").value;
  
      /* Create expense object */
      const expense = {
        name: name,
        amount: amount,
        date: date,
        category: category
      };
  
      /* Send POST request to server to add expense */
      fetch("/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(expense)
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        /* Clear form inputs */
        document.getElementById("name").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("date").value = "";
        document.getElementById("category").value = "";
  
        /* Refresh expense list */
        renderExpenseList(data);
      })
      .catch(function (error) {
        console.error(error);
      });
    });
  
    /* Add event listener to filter form */
    filterForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      /* Get filter data */
      const date = filterDate.value;
      const category = filterCategory.value;
  
      /* Send GET request to server to filter expenses */
      fetch(`/expenses?date=${date}&category=${category}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        /* Render filtered expense list */
        renderExpenseList(data);
      })
      .catch(function (error) {
        console.error(error);
      });
    });
  
    /* Load all expenses on page load */
    fetch("/expenses")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      /* Render expense list */
      renderExpenseList(data);
    })
    .catch(function (error) {
      console.error(error);
    });
  
  });
  