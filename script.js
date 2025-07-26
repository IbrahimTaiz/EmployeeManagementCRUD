const empTable = document.getElementById("empTable");
let employees = [];
let editingId = null;
let bonusTargetId = null;

function handleSubmit() {
  clearErrors();
  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value.trim();
  const salaryStr = document.getElementById("salary").value.trim();
  const status = document.getElementById("status").value;

  let valid = true;
  if (!name) { showError("errorName", "Name required"); valid = false; }
  if (!role) { showError("errorRole", "Role required"); valid = false; }
  if (!/^[1-9]\d{3,}$/.test(salaryStr)) { showError("errorSalary", "Salary must be at least 1000 R"); valid = false; }
  if (!status) { showError("errorStatus", "Status required"); valid = false; }
  if (!valid) return;

  const salary = parseFloat(salaryStr);
  if (editingId !== null) {
    Object.assign(employees.find(e => e.id === editingId), { name, role, salary, status });
    editingId = null;
  } else {
    const id = Date.now();
    employees.push({ id, name, role, salary, status, bonus: 0 });
  }
  document.getElementById("empForm").reset();
  renderTable();
}

function showError(elId, msg) {
  document.getElementById(elId).innerText = msg;
}
function clearErrors() {
  ["errorName","errorRole","errorSalary","errorStatus"].forEach(id => document.getElementById(id).innerText = "");
}

function renderTable(data = employees) {
  empTable.innerHTML = "";
  data.forEach(emp => {
    const div = document.createElement("div");
    div.className = "emp-row " + emp.status;
    div.id = `emp-${emp.id}`;

    const base = (t) => {
      const span = document.createElement("span");
      span.innerText = t;
      return span;
    };

    div.appendChild(base(emp.name));
    if (emp.salary >= 100000) {
      const badge = document.createElement("span");
      badge.className = "badge high";
      badge.innerText = "High";
      div.appendChild(badge);
    }
    if (emp.bonus > 0) {
      const badge = document.createElement("span");
      badge.className = "badge bonus";
      badge.innerText = "Bonus";
      div.appendChild(badge);
    }
    div.appendChild(base(emp.role));
    div.appendChild(base(`R ${emp.salary.toFixed(2)}`));
    div.appendChild(base(emp.bonus > 0 ? `Bonus: R ${emp.bonus.toFixed(2)}` : "No bonus"));

    const bonusBtn = document.createElement("input");
    bonusBtn.type = "button";
    bonusBtn.value = "Add Bonus";
    bonusBtn.onclick = () => openBonusModal(emp.id);
    div.appendChild(bonusBtn);

    const editBtn = document.createElement("input");
    editBtn.type = "button";
    editBtn.value = "Edit";
    editBtn.onclick = () => startEdit(emp.id);
    div.appendChild(editBtn);

    const delBtn = document.createElement("input");
    delBtn.type = "button";
    delBtn.value = "Delete";
    delBtn.onclick = () => {
      employees = employees.filter(e => e.id !== emp.id);
      renderTable();
    };
    div.appendChild(delBtn);

    empTable.appendChild(div);
  });
}

function startEdit(id) {
  const emp = employees.find(e => e.id === id);
  editingId = id;
  document.getElementById("name").value = emp.name;
  document.getElementById("role").value = emp.role;
  document.getElementById("salary").value = emp.salary;
  document.getElementById("status").value = emp.status;
}

function openBonusModal(id) {
  bonusTargetId = id;
  document.getElementById("bonusPercent").value = "";
  document.getElementById("bonusModal").classList.remove("hidden");
}

function closeBonusModal() {
  document.getElementById("bonusModal").classList.add("hidden");
}

function applyBonus() {
  const pct = parseFloat(document.getElementById("bonusPercent").value);
  if (isNaN(pct) || pct < 0) return alert("Enter valid bonus percentage");
  const emp = employees.find(e => e.id === bonusTargetId);
  emp.bonus = emp.salary * pct / 100;
  closeBonusModal();
  renderTable();
}

function applyFilters() {
  const name = document.getElementById("filterName").value.trim().toLowerCase();
  const role = document.getElementById("filterRole").value.trim().toLowerCase();
  const minS = parseFloat(document.getElementById("minSalary").value) || 0;
  const maxS = parseFloat(document.getElementById("maxSalary").value) || Infinity;
  const minB = parseFloat(document.getElementById("minBonus").value) || 0;
  const maxB = parseFloat(document.getElementById("maxBonus").value) || Infinity;
  const status = document.getElementById("filterStatus").value;

  const filtered = employees.filter(e => {
    return (!name || e.name.toLowerCase().includes(name)) &&
           (!role || e.role.toLowerCase().includes(role)) &&
           e.salary >= minS && e.salary <= maxS &&
           e.bonus >= minB && e.bonus <= maxB &&
           (!status || e.status === status);
  });
  renderTable(filtered);
}

function clearFilters() {
  document.getElementById("filterName").value = "";
  document.getElementById("filterRole").value = "";
  document.getElementById("minSalary").value = "";
  document.getElementById("maxSalary").value = "";
  document.getElementById("minBonus").value = "";
  document.getElementById("maxBonus").value = "";
  document.getElementById("filterStatus").value = "";
  renderTable();
}

function calculatePayroll() {
  const total = employees.map(e => e.salary).reduce((a,b) => a + b, 0);
  alert(`Total Payroll: R ${total.toFixed(2)}`);
}

function deleteLowSalary() {
  employees = employees.filter(e => e.salary > 20000);
  renderTable();
}

// initial render
renderTable();
