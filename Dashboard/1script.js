
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
      const AdNo = row.c[0]?.v?.toString() || '';
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
      const AdNo = row.c[0]?.v?.toString() || '';
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
    const rowDate = parseDateFromString(row.formattedTime);
    const matchesAdNo = row.AdNo.toLowerCase().includes(searchAdNo);
    const matchesType = selectedType === 'all'
      || (selectedType === '-' && row.payment < 0)
      || (selectedType === '+' && row.payment > 0);
    const matchesDate = (
      (isNaN(fromDate) && isNaN(toDate)) ||
      (!isNaN(fromDate) && !isNaN(toDate) && rowDate >= fromDate && rowDate <= toDate)
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

document.getElementById('search-adno').addEventListener('input', applyAllFilters);
document.getElementById('slct-type').addEventListener('change', applyAllFilters);
document.getElementById('fromDate').addEventListener('change', applyAllFilters);
document.getElementById('toDate').addEventListener('change', applyAllFilters);
