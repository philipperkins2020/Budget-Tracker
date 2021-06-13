

let db;

const request = indexedDB.open('BudgetDB', 1);
request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore("trudy", { autoIncrement: true })

}

request.onsuccess = (event) => {
    db = event.target.result;
    if (navigator.onLine) {
        perkdog() 
    }
}
function perkdog() {
    let transaction = db.transaction(['trudy'], 'readwrite');
    const store = transaction.objectStore('trudy');
    const records = store.getAll();
    records.onsuccess = () => {
      if (records.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST", body: JSON.stringify(records.result)
    }).then(response => response.json()).then((res) => {
        if (res.length > 0) {
            let transaction = db.transaction(['trudy'], 'readwrite');
            const store = transaction.objectStore('trudy');
            store.clear()
        }
    })
    }
  }
  }

function saveRecord(record) {
    let transaction = db.transaction(['trudy'], 'readwrite');
    const store = transaction.objectStore('trudy');
    store.add(record)
}

window.addEventListener('online', perkdog);