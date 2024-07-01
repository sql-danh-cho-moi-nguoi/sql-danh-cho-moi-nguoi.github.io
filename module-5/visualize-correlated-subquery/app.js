const productsTable = document.getElementById('productsTable');
const resultTable = document.getElementById('resultTable');

// Hàm tạo bảng HTML từ dữ liệu
function createTable(data, table) {
  const tbody = table.querySelector('tbody');
  console.log('tbody', tbody);
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
          <td id="${table.id}-${index + 1}-c1">${item.id}</td>
          <td id="${table.id}-${index + 1}-c2">${item.title}</td>
          <td id="${table.id}-${index + 1}-c3">${item.price}</td>
          <td id="${table.id}-${index + 1}-c4">${item.category}</td>
          <td id="${table.id}-${index + 1}-c5">AVG(price) ... WHERE category = p.category</td>
          <td class="pointer" id="${table.id}-${index + 1}6">👈</td>
        `;
    tbody.appendChild(row);
  });
}

// Hàm tính giá trung bình theo category
function calculateAveragePrice(category) {
  const productsInCategory = products.filter(p => p.category === category);
  const sum = productsInCategory.reduce((total, p) => total + parseFloat(p.price), 0);
  return sum / productsInCategory.length;
}

// Hàm thực hiện truy vấn và trực quan hóa
// Hàm thực hiện truy vấn và trực quan hóa
async function executeQuery() {
  const result = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const row = productsTable.rows[i + 1]; // Bỏ qua header
    row.classList.add('highlight');

    await new Promise(resolve => setTimeout(resolve, 1000)); // Tạo độ trễ

    // B1: Hiển thị câu truy vấn con
    row.cells[4].textContent = `AVG(price) ... WHERE category = '${product.category}'`;

    // B2 & B3: Highlight category được so sánh
    const categoryCells = Array
      .from(productsTable.querySelectorAll('td'))
      .filter(cell => cell.id.endsWith('c4') && cell.textContent === product.category);
    categoryCells.forEach(cell => {
      cell.classList.add('joinCondition');
      preCell = productsTable.querySelector('#' + cell.id.replace('c4', 'c3'));
      preCell.classList.add('joinCondition');
    });

    await new Promise(resolve => setTimeout(resolve, 1000)); // Tạo độ trễ

    // B4: Tính toán và hiển thị giá trung bình
    const avgPrice = calculateAveragePrice(product.category);
    row.cells[4].textContent = row.cells[4].textContent = avgPrice.toFixed(2);

    // Highlight điều kiện WHERE
    row.cells[2].classList.add('compareCell');
    row.cells[4].classList.add('compareCell');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Tạo độ trễ


    if (parseFloat(product.price) > avgPrice) {
      result.push(product);
      row.classList.add('matchedRow');

      // Highlight dòng kết quả
      const resultRow = document.createElement('tr');
      resultRow.classList.add('matchedRow');
      resultRow.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.category}</td>
            <td></td>
          `;
      resultTable.querySelector('tbody').appendChild(resultRow);
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Tạo độ trễ

    // Xóa highlight sau khi xử lý xong
    row.cells[2].classList.remove('compareCell');
    row.cells[4].classList.remove('compareCell');

    row.classList.remove('highlight');
    const joinConditionCells = Array
      .from(productsTable.querySelectorAll('td.joinCondition'));
    joinConditionCells.forEach(cell => cell.classList.remove('joinCondition'));
  }

  return result;
}
// Tạo bảng products
createTable(products, productsTable);

// Thực hiện truy vấn khi trang web đã tải xong
window.onload = () => {
  executeQuery()
    .then(result => console.log("Kết quả:", result))
    .catch(error => console.error("Lỗi:", error));
};