const loggedInUser = JSON.parse(localStorage.getItem('loggedprinter'));

if (loggedInUser) {
    
  document.getElementById('user').textContent = loggedInUser.Name;
  document.getElementById('pos').textContent = loggedInUser.position;

} else {
  window.location.href = '/'; 
}

const userText = document.getElementById('user').textContent.trim();
const positionText = document.getElementById('pos').textContent.trim();

const boldParagraphs = document.querySelectorAll('p > b');
const positionElements = document.querySelectorAll('p.position');

boldParagraphs.forEach(bTag => {
  bTag.textContent = userText;
});
positionElements.forEach(el => {
  el.textContent = positionText;
});

document.querySelectorAll('.logout-button').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault(); // prevent default <a> link behavior
    localStorage.clear(); 
    window.location.href = '/'; 
  });
});




const use = "USER"

if (loggedInUser.position === "USER") {
  document.querySelectorAll('.payment-close-link').forEach(el => {
    el.style.display = 'none';
  });
}


const sideMenu = document.querySelector('aside')
const meuBtn = document.querySelector('#menu-bar')
const closeBtn = document.querySelector('#close-btn')

const links = document.querySelectorAll('.slidebar a');
const pages = document.querySelectorAll('.container');

links.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        
        pages.forEach(page => page.classList.remove('active'));
        
        
        const targetId = link.id.replace('-link', '');
        document.getElementById(targetId).classList.add('active');
    });
});

const sheetID = '1bBWFUUVH4Y75_RHiXOeUAwA2QRsE7URF_RqhlL8hsuA';
const sheetName = 'Students';
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

const classSelect = document.getElementById('slct-clAs');
const classSelect1 = document.getElementById('slct-clas');
const reportTableBody = document.getElementById('report-table-body');
let reportStudentsData = []; // Store data globally for filtering

fetch(url)
  .then(response => response.text())
  .then(data => {
    const jsonData = JSON.parse(data.substring(47).slice(0, -2));

    const tableBody1 = document.getElementById('students-table-body');
    const tableBody2 = document.getElementById('report-table-body');


    let studentsCount = 0;

    jsonData.table.rows.forEach(row => {
      const adNo = row.c[0] ? row.c[0].v : '';
      const name = row.c[1] ? row.c[1].v : '';
      const dues = row.c[2] ? row.c[2].v : '';
      const studentClass = row.c[3] ? row.c[3].v : '';

      // Add to Students Table
      const tr1 = document.createElement('tr');
      tr1.innerHTML = `
        <td>${adNo}</td>
        <td class="nm">${name}</td>
        <td>${dues}</td>
        <td>${studentClass}</td>
      `;
      tableBody1.appendChild(tr1);

      // Add to Report Table
      const studentData = { adNo, name, dues, studentClass };
      reportStudentsData.push(studentData);

      const tr2 = document.createElement('tr');
      tr2.innerHTML = `
        <td>${adNo}</td>
        <td class="nm">${name}</td>
        <td>${Math.abs(dues)}</td>
        <td>${studentClass}</td>
      `;
      tableBody2.appendChild(tr2);
      
      studentsCount++;
    });

    document.getElementById('students-count').textContent = studentsCount;
  })
  .catch(error => console.error('Error fetching data:', error));
  

// ✅ Filter report table when class is selected
classSelect.addEventListener('change', () => {
  const selectedClass = classSelect.value;
  const filtered = reportStudentsData.filter(s => s.studentClass === selectedClass);

  reportTableBody.innerHTML = ''; // Clear current rows
  filtered.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.adNo}</td>
      <td class="nm">${s.name}</td>
      <td>${s.dues}</td>
      <td>${s.studentClass}</td>
    `;
    reportTableBody.appendChild(tr);
  });
});

classSelect1.addEventListener('change', () => {
  const selectedClass = classSelect1.value;
  const filtered = reportStudentsData.filter(s => s.studentClass === selectedClass);

  reportTableBody.innerHTML = ''; // Clear current rows
  filtered.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.adNo}</td>
      <td class="nm">${s.name}</td>
      <td>${s.dues}</td>
      <td>${s.studentClass}</td>
    `;
    reportTableBody.appendChild(tr);
  });
});


// ✅ Print button to print the filtered report
document.getElementById('Print').addEventListener('click', () => {
  const selectedClass = document.getElementById('slct-clas').value || 'All Classes';

  // Get only the table body rows
  const reportTableBody = document.getElementById('report-table-body');
  const tableBodyClone = reportTableBody.cloneNode(true);

  // Remove minus sign from dues column in cloned rows
  Array.from(tableBodyClone.querySelectorAll('tr')).forEach(row => {
    const duesCell = row.children[2]; // Assuming 3rd column is dues
    if (duesCell) {
      const value = parseFloat(duesCell.textContent);
      if (!isNaN(value)) duesCell.textContent = Math.abs(value);
    }
  });

  // Create a new printable table
  const printableTable = document.createElement('table');
  printableTable.setAttribute('id', 'report-table-print');

  // Create header manually
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['AD No.', 'Name', 'Dues', 'Class'];

  headers.forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  printableTable.appendChild(thead);

  // Add cloned body
  const tbody = document.createElement('tbody');
  tbody.innerHTML = tableBodyClone.innerHTML;
  printableTable.appendChild(tbody);

  // Add a wrapper to center table and add title
  const printWrapper = document.createElement('div');
  printWrapper.setAttribute('id', 'print-wrapper');

  const title = document.createElement('h2');
  title.style.fontSize = '18px'
  title.textContent = `Printing Report of - ${selectedClass}`;
  title.setAttribute('id', 'print-title');
  printWrapper.appendChild(title);
  printWrapper.appendChild(printableTable);

  document.body.appendChild(printWrapper);

  // Add styles
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      body * {
        visibility: hidden !important;
      }

      #print-wrapper, #print-wrapper * {
        visibility: visible !important;
      }

      #print-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 20px;
        background: white;
        font-family: 'Segoe UI', Tahoma, sans-serif;
      }

      #print-title {
        text-align: center;
        margin-bottom: 20px;
        font-size: 20px;
        color: #363949;
      }

      #report-table-print {
        width: 100%;
        border-collapse: collapse;
        box-shadow: none;
        border: 2px solid #363949;
      }

      #report-table-print th {
        background-color: #f3f4f6;
        color: #111827;
        font-size: 15px;
        padding: 10px;
        border: 1px solid #d1d5db;
        text-align: center;
      }

      #report-table-print td {
        font-size: 14px;
        padding: 8px;
        border: 1px solid #e5e7eb;
        text-align: center;
        font-family: monospace;
      }

      @page {
        size: A4;
        margin: 14mm;
      }
    }
  `;
  document.head.appendChild(style);

  // Trigger print
  window.print();

  // Cleanup
  printWrapper.remove();
  style.remove();
});



// Function to fetch the student name based on AD No.
function fetchStudentName(adNo) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const jsonData = JSON.parse(data.substring(47).slice(0, -2));
      let studentName = '';

      // Loop through the rows to find the student with the matching AD No.
      jsonData.table.rows.forEach(row => {
        const studentAdNo = row.c[0] ? row.c[0].v : '';
        if (studentAdNo == adNo) {
          studentName = row.c[1] ? row.c[1].v : ''; // Get the name
        }
      });

      // Set the "Name" input field to the student's name
      const ad_no = document.getElementById('ad-no').value;
      if(ad_no>=600){
        document.getElementById('name').value = studentName || 'Not Found'; // If not found, show 'Not Found'
      }
    })
    .catch(error => console.error('Error fetching student data:', error));
}


// Event listener to fetch the student name when AD No. is entered
document.getElementById('ad-no').addEventListener('input', function() {
  const adNo = this.value;
  if (adNo) {
    fetchStudentName(adNo); // Fetch the student name for the entered AD No.
  } else {
    document.getElementById('name').value = ''; // Clear the name if no AD No. is entered
  }
});


  //Data entry
  document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Ensure Money is negative
    let money = formData.get("Money");
    if (money) {
      money = -Math.abs(parseFloat(money));  // Make it negative
      formData.set("Money", money);          // Replace in formData
    }

    const submitBtn = document.getElementById("submit-button");
    const cancelBtn = document.getElementById("cancel-button");

    // Disable buttons and show "Adding..." in message box
    submitBtn.disabled = true;
    cancelBtn.disabled = true;

      // Show persistent loading notification
      const loadingNotification = showNotification('Adding transaction...', 'info', 0);
      setTimeout(() => {}, 100); // Allow DOM to render it

    fetch("https://script.google.com/macros/s/AKfycbzouQNgupBWh4PqH-R4FrmaQ_VEY5I7ybAi1m47EEWO74f7D0lRsFn4lvj1bCCr6v05ug/exec", {
      method: "POST",
      mode: "no-cors", // Avoids CORS error
      body: formData,
    })
    .then(() => {
      // Update message after successful submission
      showNotification('Transaction added successfully!','success')
      form.reset();
    })
    .catch(error => {
      // Display error if the request fails
      showNotification('An error occured when adding...','error')+error;
    })
    .finally(() => {
      // Remove loading notification
      loadingNotification.classList.remove('show');
      setTimeout(() => loadingNotification.remove(), 300);
      // Re-enable buttons and reset button text after request
      submitBtn.disabled = false;
      cancelBtn.disabled = false;
    });
});

document.getElementById("cancel-button").addEventListener("click", () => {
    // Reset form and hide message when cancel button is clicked
    document.getElementById("form").reset();
});

//payment

document.getElementById("form-payment").addEventListener("submit", function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const submitBtn = document.getElementById("p-submit-button");
  const cancelBtn = document.getElementById("p-cancel-button");

  // Disable buttons
  submitBtn.disabled = true;
  cancelBtn.disabled = true;

  // Show persistent loading notification
  const loadingNotification = showNotification('Adding transaction...', 'info', 0);
  setTimeout(() => {}, 100); // Allow DOM to render it

  fetch("https://script.google.com/macros/s/AKfycbzouQNgupBWh4PqH-R4FrmaQ_VEY5I7ybAi1m47EEWO74f7D0lRsFn4lvj1bCCr6v05ug/exec", {
    method: "POST",
    mode: "no-cors",
    body: formData,
  })
  .then(() => {
    form.reset();
    showNotification('Transaction added successfully!', 'success');
  })
  .catch(error => {
    showNotification('An error occurred while adding.', 'error');
    console.error(error);
  })
  .finally(() => {
    // Remove loading notification
    loadingNotification.classList.remove('show');
    setTimeout(() => loadingNotification.remove(), 300);

    // Re-enable buttons
    submitBtn.disabled = false;
    cancelBtn.disabled = false;
  });
});

document.getElementById("p-cancel-button").addEventListener("click", () => {
  document.getElementById("form-payment").reset();
});


function fetchStudentNameP(adNoP) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const jsonData = JSON.parse(data.substring(47).slice(0, -2));
      let studentNameP = '';

      // Loop through the rows to find the student with the matching AD No.
      jsonData.table.rows.forEach(row => {
        const studentAdNoP = row.c[0] ? row.c[0].v : '';
        if (studentAdNoP == adNoP) {
          studentNameP = row.c[1] ? row.c[1].v : ''; // Get the name
        }
      });

      // Set the "Name" input field to the student's name
      const ad_noP = document.getElementById('p-ad-no').value;
      if(ad_noP>=600){
        document.getElementById('p-name').value = studentNameP || 'Not Found'; // If not found, show 'Not Found'
      }
    })
    .catch(error => console.error('Error fetching student data:', error));
}


// Event listener to fetch the student name when AD No. is entered
document.getElementById('p-ad-no').addEventListener('input', function() {
  const adNoP = this.value;
  if (adNoP) {
    fetchStudentNameP(adNoP); // Fetch the student name for the entered AD No.
  } else {
    document.getElementById('p-name').value = ''; // Clear the name if no AD No. is entered
  }
});

//close payment

const sheetName1 = 'HISTORY';
const url1 = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName1}`;

document.addEventListener("DOMContentLoaded", () => {
  let allHistoryRows = [];

  fetch(url1)
    .then(response => response.text())
    .then(data => {
      const jsonData = JSON.parse(data.substring(47).slice(0, -2));
      const tableBody = document.getElementById('trans-table-body');

      let totalPayment = 0;
      let historyCount = 0;

      function parseGoogleDate(dateString) {
        const match = /Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/.exec(dateString);
        if (!match) return dateString;
        const [, year, month, day, hour, minute, second] = match.map(Number);
        return new Date(year, month, day, hour, minute, second);
      }

      function formatDate(date) {
        const pad = n => String(n).padStart(2, '0');
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ` +
              `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      }

      function formatTimeValue(value) {
        if (typeof value === 'number') {
          const date = new Date((value - 25569) * 86400 * 1000);
          return formatDate(date);
        } else if (typeof value === 'string' && value.startsWith("Date(")) {
          return formatDate(parseGoogleDate(value));
        } else {
          const parsed = new Date(value);
          return isNaN(parsed.getTime()) ? value : formatDate(parsed);
        }
      }

      jsonData.table.rows.reverse().forEach(row => {
        const AdNo = row.c[0]?.v || '';
        const Name = row.c[1]?.v || '';
        const payment = parseFloat(row.c[2]?.v || 0);
        const Time = row.c[3]?.v || '';
        const formattedTime = formatTimeValue(Time);

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${AdNo}</td>
          <td class="nm">${Name}</td>
          <td>${payment}</td>
          <td>${formattedTime}</td>
        `;
        allHistoryRows.push({ AdNo, Name, payment, formattedTime, element: tr });
        tableBody.appendChild(tr);

        totalPayment += payment;
        historyCount++;
      });

      const tableBodyFirstFour = document.getElementById('trans-table-first-four');
      jsonData.table.rows.slice(0, 4).forEach(row => {
        const AdNo = row.c[0]?.v || '';
        const Name = row.c[1]?.v || '';
        const payment = row.c[2]?.v || 0;
        const Time = row.c[3]?.v || '';
        const formattedTime = formatTimeValue(Time);

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${AdNo}</td>
          <td class="nm">${Name}</td>
          <td>${payment}</td>
          <td>${formattedTime}</td>
        `;
        tableBodyFirstFour.appendChild(tr);
      });

      document.getElementById('total-dues').textContent = `₹${Math.abs(Number(totalPayment) || 0).toFixed(2)}`;
      document.getElementById('history-count').textContent = historyCount;

      // Attach event listeners after data is ready
      document.getElementById('search-adno').addEventListener('input', applyAllFilters);
      document.getElementById('slct-type').addEventListener('change', applyAllFilters);
      document.getElementById('fromDate').addEventListener('change', applyAllFilters);
      document.getElementById('toDate').addEventListener('change', applyAllFilters);
    })
    .catch(error => console.error('Error fetching data:', error));

    function applyAllFilters() {
      const searchAdNo = document.getElementById('search-adno').value.toLowerCase();
      const selectedType = document.getElementById('slct-type').value;
      const from = new Date(document.getElementById("fromDate").value);
      const to = new Date(document.getElementById("toDate").value);
      const tableBody = document.getElementById('trans-table-body');
      tableBody.innerHTML = '';
    
      function stripTime(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      }
    
      const fromDate = stripTime(from);
      const toDate = stripTime(to);
    
      allHistoryRows.forEach(row => {
        const rowDate = stripTime(parseDateFromString(row.formattedTime));
        const matchesAdNo = String(row.AdNo).toLowerCase().includes(searchAdNo);
        const matchesType = selectedType === 'all'
          || (selectedType === '-' && row.payment < 0)
          || (selectedType === '+' && row.payment > 0);
        const matchesDate = (
          (isNaN(from.getTime()) && isNaN(to.getTime())) ||
          (!isNaN(from.getTime()) && !isNaN(to.getTime()) && rowDate >= fromDate && rowDate <= toDate)
        );
    
        if (matchesAdNo && matchesType && matchesDate) {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${row.AdNo}</td>
            <td class="nm">${row.Name}</td>
            <td>${row.payment}</td>
            <td>${row.formattedTime}</td>
          `;
          tableBody.appendChild(tr);
        }
      });
    }
    


  function parseDateFromString(dateString) {
    const [day, month, year] = dateString.split(' ')[0].split('/').map(Number);
    return new Date(year, month - 1, day);
  }
});




//Print date to date

document.getElementById('Print-history').addEventListener('click', () => {
  // Get only the visible (filtered) rows
  const historyTableBody = document.getElementById('trans-table-body');
  const tableBodyClone = historyTableBody.cloneNode(true);

  // Create a new printable table
  const printableTable = document.createElement('table');
  printableTable.setAttribute('id', 'trans-table-print');

  // Create header manually
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['AD No.', 'Name', 'Payment', 'Date'];

  headers.forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  printableTable.appendChild(thead);

  // Add cloned body
  const tbody = document.createElement('tbody');
  tbody.innerHTML = tableBodyClone.innerHTML;
  printableTable.appendChild(tbody);

  // Create wrapper
  const printWrapper = document.createElement('div');
  printWrapper.setAttribute('id', 'print-wrapper-history');

  const title = document.createElement('h2');
  const fromInput = document.getElementById("fromDate").value;
  const toInput = document.getElementById("toDate").value;
  const fromDateText = fromInput ? new Date(fromInput).toLocaleDateString('en-GB').replace(/\//g, '-') : "Start";
  const toDateText = toInput ? new Date(toInput).toLocaleDateString('en-GB').replace(/\//g, '-') : "End";  

  title.textContent = `Printing Report of ${fromDateText} - ${toDateText}`;
  title.setAttribute('id', 'print-title');
  printWrapper.appendChild(title);
  printWrapper.appendChild(printableTable);

  document.body.appendChild(printWrapper);

  // Add styles
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      body * {
        visibility: hidden !important;
      }

      #print-wrapper-history, #print-wrapper-history * {
        visibility: visible !important;
      }

      #print-wrapper-history {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 20px;
        background: white;
        font-family: 'Segoe UI', Tahoma, sans-serif;
      }

      #print-title {
        text-align: center;
        margin-bottom: 20px;
        font-size: 20px;
        color: #363949;
      }

      #trans-table-print {
        width: 100%;
        border-collapse: collapse;
        border: 2px solid #363949;
      }

      #trans-table-print th {
        background-color: #f3f4f6;
        color: #111827;
        font-size: 15px;
        padding: 10px;
        border: 1px solid #d1d5db;
        text-align: center;
      }

      #trans-table-print td {
        font-size: 14px;
        padding: 8px;
        border: 1px solid #e5e7eb;
        text-align: center;
        font-family: monospace;
      }

      @page {
        size: A4;
        margin: 14mm;
      }
    }
  `;
  document.head.appendChild(style);

  // Trigger print
  window.print();

  // Cleanup
  printWrapper.remove();
  style.remove();
});



  const bulkAmountInput = document.getElementById('bulkInput');
  const studentsTableBody = document.getElementById('bulk-table-body');
  let studentsData = []; // Store fetched student data
  
  // Fetch and display all students initially
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const jsonData = JSON.parse(data.substring(47).slice(0, -2));
      jsonData.table.rows.forEach(row => {
        const adNo = row.c[0] ? row.c[0].v : '';
        const name = row.c[1] ? row.c[1].v : '';
        const dues = row.c[2] ? row.c[2].v : '';
        const studentClass = row.c[3] ? row.c[3].v : '';
        studentsData.push({ adNo, name, dues, studentClass });
      });
  
      displayStudents(studentsData); // Show all students initially
    });
  
  // Display function
  function displayStudents(data) {
    studentsTableBody.innerHTML = '';
    data.forEach(student => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox" class="student-checkbox" data-adno="${student.adNo}" /></td>
        <td>${student.adNo}</td>
        <td class="nm">${student.name}</td>
        <td>${student.dues}</td>
        <td>${student.studentClass}</td>
      `;
      studentsTableBody.appendChild(tr);
    });
  }
  
  // Select all checkboxes
  document.getElementById('select-all').addEventListener('change', function () {
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(cb => cb.checked = this.checked);
  });
  
  // Filter on class selection
  classSelect.addEventListener('change', () => {
    const selectedClass = classSelect.value;
    const filtered = studentsData.filter(s => s.studentClass === selectedClass);
    displayStudents(filtered);
  });
  
  // Submit bulk payments
  document.getElementById('bulk-submit').addEventListener('click', async () => {
    const paymentAmount = bulkAmountInput.value;
    const selectedCheckboxes = document.querySelectorAll('.student-checkbox:checked');
  
    if (!paymentAmount || selectedCheckboxes.length === 0) {
      return showNotification('Please enter an amount and select students.', 'warning');
    }
  
    const selectedAdNos = Array.from(selectedCheckboxes).map(cb => cb.dataset.adno);
    const selectedStudents = studentsData.filter(s => selectedAdNos.includes(s.adNo.toString()));
  
    if (selectedStudents.length === 0) {
      return showNotification('No students selected.', 'warning');
    }
  
    const loadingNotification = showNotification('Adding transactions...', 'info', 0);
    await new Promise(resolve => setTimeout(resolve, 100)); // Force render
  
    // Delay function
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // Bulk processing
    const batchSize = 100;
    for (let i = 0; i < selectedStudents.length; i += batchSize) {
      const batch = selectedStudents.slice(i, i + batchSize);
      await sendBulkPayments(batch, paymentAmount);
      await delay(500);
    }
  
    // Remove loading and show success
    loadingNotification.classList.remove('show');
    setTimeout(() => loadingNotification.remove(), 300);
  
    showNotification(`${selectedStudents.length} transactions added successfully.`, 'success');
  
    // Reset form
    bulkAmountInput.value = '';
    classSelect.selectedIndex = 0;
    displayStudents(studentsData);
    document.getElementById('select-all').checked = false;
  });
  
  
  // Function to send a batch of payments
  async function sendBulkPayments(batch, paymentAmount) {
    for (let student of batch) {
      const formData = new FormData();
      formData.append('AD No.', student.adNo);
      formData.append('Name', student.name);
      formData.append('Money', -Math.abs(paymentAmount)); // Ensure amount is negative
  
      await fetch("https://script.google.com/macros/s/AKfycbzouQNgupBWh4PqH-R4FrmaQ_VEY5I7ybAi1m47EEWO74f7D0lRsFn4lvj1bCCr6v05ug/exec", {
        method: "POST",
        mode: "no-cors",
        body: formData,
      })
      .then(response => response.text())
      .then(responseData => {
        console.log("Response:", responseData);  // Log the response
      })
      .catch(error => {
        showNotification('Error in payment submission','error')
      });
    }
  }
  
  // Delay function
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  console.log("Selected AD Nos:", selectedAdNos);  // Log selected AD Nos from checkboxes
  console.log("Students Data:", studentsData);    // Log full student data for inspection
  

  
  function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
  
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
  
    container.appendChild(notification);
  
    // Trigger the show animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
  
    // If duration is a number, hide automatically
    if (typeof duration === 'number' && duration > 0) {
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          container.removeChild(notification);
        }, 300);
      }, duration);
    }
  
    // Return the notification so you can manually remove it later
    return notification;
  }



