let db;

const request = indexedDB.open("Budget_tracker", 1);

request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;

  db.createObjectStore("New_transaction", { autoIncrement: true });
};

request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  if (navigator.onLine) {
    // we haven't created this yet, but we will soon, so let's comment it out for now
    uploadBudget();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["New_transaction"], "readwrite");

  // access the object store for `new_pizza`
  const transactionObjectStore = transaction.objectStore("New_transaction");

  // add record to your store with add method
  transactionObjectStore.add(record);
}

function uploadBudget() {
  const transaction = db.transaction(["New_transaction"], "readwrite");

  const budgetObjectStore = transaction.objectStore("New_transaction");

  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(["New_transaction"], "readwrite");

          const budgetObjectStore = transaction.objectStore("New_transaction");

          budgetObjectStore.clear();

          alert("All saved budget info has been submitted!");
        })
        .catch((err) => console.log(err));
    }
  };
}
