
// Enable all tooltips
document.addEventListener("DOMContentLoaded", function () {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Función mínima para habilitar/deshabilitar campos
function toggleEditableFields() {
  const inputs = document.querySelectorAll(".profile-input");
  const editButtons = document.getElementById("editButtons");
  const isEditable = inputs[0].readOnly;

  // Cambiar estado de solo lectura en todos los campos
  inputs.forEach((input) => {
    input.readOnly = !isEditable;
    input.classList.toggle("border-primary", !isEditable);

    // Guardar valores originales para posible cancelación
    if (isEditable) {
      input.setAttribute("data-original", input.value);
    }
  });

  // Mostrar/ocultar botones de guardar/cancelar
  editButtons.style.display = isEditable ? "block" : "none";
}

// Función simple para guardar cambios
function saveChanges() {
  toggleEditableFields();
  // Aquí iría la lógica para enviar los datos al servidor
  alert("Cambios guardados correctamente");
}

// Función simple para cancelar cambios
function cancelEdit() {
  const inputs = document.querySelectorAll(".profile-input");

  // Restaurar valores originales
  inputs.forEach((input) => {
    input.value = input.getAttribute("data-original");
  });

  // Volver al modo de solo lectura
  toggleEditableFields();
}

// Add this new code after the existing functions:

// Store residents data
let residents = [
  {
    name: "Alicia R. Hernández",
    age: 34,
    relationship: "Esposa",
    id: "1234567890",
  },
  {
    name: "Mateo Correa",
    age: 12,
    relationship: "Hijo",
    id: "9876543210",
  },
];

// Function to render residents table
function renderResidents() {
  const tbody = document.querySelector("#residentsSection table tbody");
  tbody.innerHTML = residents
    .map(
      (resident) => `
  <tr>
      <td><input type="text" class="form-control resident-input" value="${resident.name}" readonly></td>
      <td><input type="number" class="form-control resident-input" value="${resident.age}" readonly></td>
      <td><input type="text" class="form-control resident-input" value="${resident.relationship}" readonly></td>
      <td><input type="text" class="form-control resident-input" value="${resident.id}" readonly></td>
      <td class="text-center">
          <button class="btn btn-sm btn-outline-primary me-1" onclick="editResident('${resident.id}')">
              <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteResident('${resident.id}')">
              <i class="bi bi-trash"></i>
          </button>
      </td>
  </tr>
`
    )
    .join("");
}

// Function to delete resident
function deleteResident(residentId) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      residents = residents.filter(
        (resident) => resident.id !== residentId
      );
      renderResidents();
      Swal.fire(
        "¡Eliminado!",
        "El residente ha sido eliminado.",
        "success"
      );
    }
  });
}

// Function to edit resident
function editResident(residentId) {
  const row = document.querySelector(
    `tr:has(input[value="${residentId}"])`
  );
  const inputs = row.querySelectorAll(".resident-input");
  const isEditing = inputs[0].readOnly;

  if (isEditing) {
    // Enable editing
    inputs.forEach((input) => {
      input.readOnly = false;
      input.classList.add("border-primary");
      input.dataset.original = input.value;
    });

    // Change edit button to save
    const editButton = row.querySelector(".btn-outline-primary");
    editButton.innerHTML = '<i class="bi bi-check"></i>';
    editButton.classList.remove("btn-outline-primary");
    editButton.classList.add("btn-success");

    // Change delete button to cancel
    const deleteButton = row.querySelector(".btn-outline-danger");
    deleteButton.innerHTML = '<i class="bi bi-x"></i>';
    deleteButton.onclick = () => cancelEditResident(residentId);
  } else {
    // Save changes
    const newValues = {
      name: inputs[0].value,
      age: parseInt(inputs[1].value),
      relationship: inputs[2].value,
      id: inputs[3].value,
    };

    residents = residents.map((resident) =>
      resident.id === residentId ? newValues : resident
    );

    renderResidents();
    Swal.fire("¡Guardado!", "Los cambios han sido guardados.", "success");
  }
}

// Function to cancel editing
function cancelEditResident(residentId) {
  const row = document.querySelector(
    `tr:has(input[value="${residentId}"])`
  );
  const inputs = row.querySelectorAll(".resident-input");

  inputs.forEach((input) => {
    input.value = input.dataset.original;
    input.readOnly = true;
    input.classList.remove("border-primary");
  });

  renderResidents();
}

// Initialize residents table when page loads
document.addEventListener("DOMContentLoaded", function () {
  renderResidents();
  // ... existing DOMContentLoaded code ...
});

// ... existing code ...

// Add this new code after the residents functions:

// Store pets data
let pets = [
  {
    id: "pet1",
    name: "Max",
    type: "Perro",
    breed: "Golden Retriever",
    age: 5
  },
  {
    id: "pet2",
    name: "Luna",
    type: "Gato",
    breed: "Siamés",
    age: 3
  }
];

// Function to render pets
function renderPets() {
  const petsContainer = document.querySelector("#petsSection .row");
  petsContainer.innerHTML = pets.map(pet => `
    <div class="col-md-6 mb-3">
      <div class="card h-100 border">
        <div class="row g-0">
          <div class="col-md-4">
            <div class="h-100 d-flex align-items-center justify-content-center bg-light p-2">
              <i class="bi bi-heart" style="font-size: 3rem"></i>
            </div>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title pet-text" data-field="name">${pet.name}</h5>
              <p class="card-text mb-1">
                <small><strong>Tipo:</strong> 
                  <span class="pet-text" data-field="type">${pet.type}</span>
                </small>
              </p>
              <p class="card-text mb-1">
                <small><strong>Raza:</strong> 
                  <span class="pet-text" data-field="breed">${pet.breed}</span>
                </small>
              </p>
              <p class="card-text mb-1">
                <small><strong>Edad:</strong> 
                  <span class="pet-text" data-field="age">${pet.age}</span>
                </small>
              </p>
              <div class="mt-2">
                <button class="btn btn-sm btn-outline-primary" onclick="editPet('${pet.id}')">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletePet('${pet.id}')">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Function to delete pet
function deletePet(petId) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      pets = pets.filter(pet => pet.id !== petId);
      renderPets();
      Swal.fire(
        '¡Eliminado!',
        'La mascota ha sido eliminada.',
        'success'
      );
    }
  });
}

// Function to edit pet
function editPet(petId) {
  const petCard = document.querySelector(`[onclick*="${petId}"]`).closest('.card');
  const textElements = petCard.querySelectorAll('.pet-text');
  const isEditing = textElements[0].contentEditable !== 'true';

  if (isEditing) {
    // Enable editing
    textElements.forEach(element => {
      element.contentEditable = true;
      element.classList.add('border', 'border-primary', 'p-1');
      element.dataset.original = element.textContent.trim();
    });

    // Change edit button to save
    const editButton = petCard.querySelector('.btn-outline-primary');
    editButton.innerHTML = '<i class="bi bi-check"></i>';
    editButton.classList.remove('btn-outline-primary');
    editButton.classList.add('btn-success');

    // Change delete button to cancel
    const deleteButton = petCard.querySelector('.btn-outline-danger');
    deleteButton.innerHTML = '<i class="bi bi-x"></i>';
    deleteButton.onclick = () => cancelEditPet(petId);
  } else {
    // Save changes
    const newValues = {
      id: petId,
      name: textElements[0].textContent.trim(),
      type: textElements[1].textContent.trim(),
      breed: textElements[2].textContent.trim(),
      age: parseInt(textElements[3].textContent.trim())
    };

    pets = pets.map(pet => 
      pet.id === petId ? newValues : pet
    );

    renderPets();
    Swal.fire('¡Guardado!', 'Los cambios han sido guardados.', 'success');
  }
}

// Function to cancel editing
function cancelEditPet(petId) {
  const petCard = document.querySelector(`[onclick*="${petId}"]`).closest('.card');
  const textElements = petCard.querySelectorAll('.pet-text');
  
  textElements.forEach(element => {
    element.textContent = element.dataset.original;
    element.contentEditable = false;
    element.classList.remove('border', 'border-primary', 'p-1');
  });

  renderPets();
}

// Update the DOMContentLoaded event listener to include pets initialization
document.addEventListener("DOMContentLoaded", function () {
  // ... existing code ...
  renderResidents();
  renderPets();
});
