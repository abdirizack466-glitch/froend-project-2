const form = document.getElementById("visitorForm");
const table = document.getElementById("visitorTable");
const visitorId = document.getElementById("visitorId");
const submitBtn = document.getElementById("submitBtn");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const houseInput = document.getElementById("house");
const purposeInput = document.getElementById("purpose");
const dateInput = document.getElementById("date");
const photoInput = document.getElementById("photo");

const API = "http://localhost:3000/visitors";

/* READ */
function loadVisitors() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      table.innerHTML = "";

      data.forEach(visitor => {
        table.innerHTML += `
          <tr>
            <td>
              ${visitor.photo ? `<img src="${visitor.photo}" width="60" height="60" style="object-fit:cover;">` : ""}
            </td>
            <td>${visitor.name}</td>
            <td>${visitor.phone}</td>
            <td>${visitor.house}</td>
            <td>${visitor.purpose}</td>
            <td>${visitor.date}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editVisitor(${visitor.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteVisitor(${visitor.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}

/* CREATE + UPDATE */
function saveVisitor(visitor) {
  if (visitorId.value) {
    fetch(`${API}/${visitorId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitor)
    }).then(resetForm);
  } else {
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitor)
    }).then(resetForm);
  }
}

/* FORM SUBMIT */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const file = photoInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      saveVisitor({
        name: nameInput.value,
        phone: phoneInput.value,
        house: houseInput.value,
        purpose: purposeInput.value,
        date: dateInput.value,
        photo: reader.result
      });
    };
    reader.readAsDataURL(file);
  } else {
    saveVisitor({
      name: nameInput.value,
      phone: phoneInput.value,
      house: houseInput.value,
      purpose: purposeInput.value,
      date: dateInput.value,
      photo: ""
    });
  }
});

/* EDIT */
function editVisitor(id) {
  fetch(`${API}/${id}`)
    .then(res => res.json())
    .then(visitor => {
      visitorId.value = visitor.id;
      nameInput.value = visitor.name;
      phoneInput.value = visitor.phone;
      houseInput.value = visitor.house;
      purposeInput.value = visitor.purpose;
      dateInput.value = visitor.date;
      submitBtn.innerText = "Update Visitor";
    });
}

/* DELETE */
function deleteVisitor(id) {
  if (confirm("Are you sure you want to delete this visitor?")) {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(loadVisitors);
  }
}

/* RESET */
function resetForm() {
  form.reset();
  visitorId.value = "";
  submitBtn.innerText = "Add Visitor";
  loadVisitors();
}

/* INITIAL LOAD */
loadVisitors();
