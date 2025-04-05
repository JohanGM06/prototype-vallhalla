
document.addEventListener("DOMContentLoaded", function () {
  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");

  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("d-none");
  });

  // Handle parking type change for Add Modal
  const parkingTypeSelect = document.getElementById("parkingType");
  const residentFields = document.querySelector(".resident-fields");
  const visitorFields = document.querySelector(".visitor-fields");

  parkingTypeSelect?.addEventListener("change", function () {
    handleParkingTypeChange(this, residentFields, visitorFields);
  });

  // Handle parking type change for Edit Modal
  const editParkingTypeSelect =
    document.getElementById("editParkingType");
  const editResidentFields = document.querySelector(
    ".edit-resident-fields"
  );
  const editVisitorFields = document.querySelector(
    ".edit-visitor-fields"
  );

  editParkingTypeSelect?.addEventListener("change", function () {
    handleParkingTypeChange(this, editResidentFields, editVisitorFields);
  });

  function handleParkingTypeChange(
    select,
    residentFields,
    visitorFields
  ) {
    if (select.value === "residente") {
      residentFields.classList.remove("d-none");
      visitorFields.classList.add("d-none");
      toggleRequiredFields(false, true);
    } else if (select.value === "visitante") {
      residentFields.classList.add("d-none");
      visitorFields.classList.remove("d-none");
      toggleRequiredFields(false, false);
    }
  }

  function toggleRequiredFields(isEdit, isResident) {
    const prefix = isEdit ? "edit" : "";
    if (isResident) {
      document.getElementById(`${prefix}OwnerName`).required = true;
      document.getElementById(`${prefix}Apartment`).required = true;
      document.getElementById(`${prefix}VisitorName`).required = false;
      document.getElementById(
        `${prefix}VisitingApartment`
      ).required = false;
    } else {
      document.getElementById(`${prefix}OwnerName`).required = false;
      document.getElementById(`${prefix}Apartment`).required = false;
      document.getElementById(`${prefix}VisitorName`).required = true;
      document.getElementById(
        `${prefix}VisitingApartment`
      ).required = true;
    }
  }

  // Form validation
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });

  // Edit button functionality
  const editButtons = document.querySelectorAll(
    '[data-bs-target="#editModal"]'
  );
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".card");

      // Get values from the card using data attributes
      const parkingData = {
        number: getCardValue(
          card,
          "[data-parking-number]",
          "Parqueadero "
        ),
        type: getCardValue(card, "[data-parking-type]", "Tipo: "),
        owner: getCardValue(card, "[data-owner-name]", "Propietario: "),
        apartment: getCardValue(
          card,
          "[data-apartment]",
          "Apartamento: "
        ),
        plate: getCardValue(card, "[data-license-plate]", "Placa: "),
        vehicleType: getCardValue(card, "[data-vehicle-type]", "Tipo: "),
        model: getCardValue(card, "[data-vehicle-model]", "Modelo: "),
      };

      // Populate edit form with the data
      document.getElementById("editParkingNumber").value =
        parkingData.number;
      document.getElementById("editParkingType").value =
        parkingData.type.toLowerCase();
      document.getElementById("editOwnerName").value = parkingData.owner;
      document.getElementById("editApartment").value =
        parkingData.apartment;
      document.getElementById("editLicensePlate").value =
        parkingData.plate;
      document.getElementById("editVehicleType").value =
        parkingData.vehicleType.toLowerCase();
      document.getElementById("editCarModel").value = parkingData.model;

      // Show/hide fields based on parking type
      const editParkingTypeSelect =
        document.getElementById("editParkingType");
      const editResidentFields = document.querySelector(
        ".edit-resident-fields"
      );
      const editVisitorFields = document.querySelector(
        ".edit-visitor-fields"
      );

      if (parkingData.type.toLowerCase() === "residente") {
        editResidentFields.classList.remove("d-none");
        editVisitorFields.classList.add("d-none");
      } else {
        editResidentFields.classList.add("d-none");
        editVisitorFields.classList.remove("d-none");
      }
    });
  });

  // View button functionality
  const viewButtons = document.querySelectorAll(
    '[data-bs-target="#viewModal"]'
  );
  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".card");

      // Get values from the card
      document.getElementById("view-parkingNumber").textContent =
        getCardValue(card, "[data-parking-number]", "Parqueadero ");
      document.getElementById("view-parkingType").textContent =
        getCardValue(card, "[data-parking-type]", "Tipo: ");
      document.getElementById("view-ownerName").textContent =
        getCardValue(card, "[data-owner-name]", "Propietario: ");
      document.getElementById("view-apartment").textContent =
        getCardValue(card, "[data-apartment]", "Apartamento: ");
      document.getElementById("view-licensePlate").textContent =
        getCardValue(card, "[data-license-plate]", "Placa: ");
      document.getElementById("view-vehicleType").textContent =
        getCardValue(card, "[data-vehicle-type]", "Tipo: ");
      document.getElementById("view-carModel").textContent = getCardValue(
        card,
        "[data-vehicle-model]",
        "Modelo: "
      );
    });
  });

  // Helper function to get card values
  function getCardValue(card, selector, prefix) {
    const element = card.querySelector(selector);
    return element ? element.textContent.replace(prefix, "").trim() : "";
  }

  // Form validation for visitor parking
  const visitorForm = document.getElementById("visitorParkingForm");
  if (visitorForm) {
    visitorForm.addEventListener("submit", function (event) {
      if (!this.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.classList.add("was-validated");
    });
  }

  // Container for parking spots
  const parkingContainer = document.querySelector('#guardsContainer') || document.querySelector('.row.g-4');

  // Handle regular parking form submission
  const parkingForm = document.getElementById('parkingForm');
  parkingForm?.addEventListener('submit', function(event) {
      event.preventDefault();
      if (this.checkValidity()) {
          // Get form values
          const parkingData = {
              number: document.getElementById('parkingNumber').value,
              type: document.getElementById('parkingType').value,
              owner: document.getElementById('ownerName').value,
              apartment: document.getElementById('apartment').value,
              plate: document.getElementById('licensePlate').value,
              vehicleType: document.getElementById('vehicleType').value,
              model: document.getElementById('carModel').value
          };

          // Add new parking card
          addParkingCard(parkingData);

          // Close modal and reset form
          const modal = bootstrap.Modal.getInstance(document.getElementById('parkingModal'));
          modal.hide();
          this.reset();
          this.classList.remove('was-validated');
      } else {
          this.classList.add('was-validated');
      }
  });

  // Handle visitor parking form submission
  const visitorParkingForm = document.getElementById('visitorParkingForm');
  visitorParkingForm?.addEventListener('submit', function(event) {
      event.preventDefault();
      if (this.checkValidity()) {
          // Get form values
          const visitorData = {
              number: document.getElementById('visitorParkingNumber').value,
              type: 'visitante',
              owner: document.getElementById('visitorName').value,
              apartment: document.getElementById('visitingApartment').value,
              plate: document.getElementById('visitorLicensePlate').value,
              vehicleType: document.getElementById('visitorVehicleType').value,
              model: document.getElementById('visitorCarModel').value,
              duration: document.getElementById('visitDuration').value
          };

          // Add new visitor parking card
          addParkingCard(visitorData);

          // Close modal and reset form
          const modal = bootstrap.Modal.getInstance(document.getElementById('visitorParkingModal'));
          modal.hide();
          this.reset();
          this.classList.remove('was-validated');
      } else {
          this.classList.add('was-validated');
      }
  });

  // Function to handle parking status toggle
  function handleStatusToggle(switchInput) {
      const card = switchInput.closest('.card');
      const statusBadge = card.querySelector('.badge');
      
      if (switchInput.checked) {
          statusBadge.className = 'badge bg-success';
          statusBadge.textContent = 'Disponible';
      } else {
          statusBadge.className = 'badge bg-danger';
          statusBadge.textContent = 'Ocupado';
      }
      
      // Show status change alert
      showAlert(`Parqueadero ${switchInput.checked ? 'habilitado' : 'deshabilitado'}`, 
               switchInput.checked ? 'success' : 'danger');
  }

  // Add event listeners to existing switches
  document.querySelectorAll('.form-check-input').forEach(switchInput => {
      switchInput.addEventListener('change', function() {
          handleStatusToggle(this);
      });
  });

  // Modify the addParkingCard function to include the toggle functionality
  function addParkingCard(data) {
      const card = document.createElement('article');
      card.className = 'col-xl-3 col-lg-4 col-md-6';
      
      const isVisitor = data.type === 'visitante';
      const status = isVisitor ? 'Temporal' : 'Disponible';
      const statusClass = isVisitor ? 'bg-warning' : 'bg-success';

      card.innerHTML = `
          <div class="card h-100 shadow-sm">
              <header class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                  <span class="badge ${statusClass}">${status}</span>
                  <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" role="switch" aria-label="Toggle parking availability" checked>
                  </div>
              </header>
              <div class="card-body text-center">
                  <i class="bi bi-car-front display-4 mb-3" aria-hidden="true"></i>
                  <h3 class="card-title h5" data-parking-number>Parqueadero ${data.number}</h3>
                  <dl class="small text-muted mb-3">
                      <dt class="visually-hidden">Tipo:</dt>
                      <dd data-parking-type>Tipo: ${data.type}</dd>
                      <dt class="visually-hidden">Propietario:</dt>
                      <dd data-owner-name>Propietario: ${data.owner}</dd>
                      <dt class="visually-hidden">Apartamento:</dt>
                      <dd data-apartment>Apartamento: ${data.apartment}</dd>
                      <dt class="visually-hidden">Placa:</dt>
                      <dd data-license-plate>Placa: ${data.plate}</dd>
                      <dt class="visually-hidden">Tipo Vehículo:</dt>
                      <dd data-vehicle-type>Tipo: ${data.vehicleType}</dd>
                      <dt class="visually-hidden">Modelo:</dt>
                      <dd data-vehicle-model>Modelo: ${data.model}</dd>
                      ${isVisitor ? `<dt class="visually-hidden">Duración:</dt><dd>${data.duration} horas</dd>` : ''}
                  </dl>
              </div>
              <footer class="card-footer bg-transparent border-0">
                  <div class="btn-group w-100" role="group" aria-label="Acciones de parqueadero">
                      <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#viewModal">
                          <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editModal">
                          <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-sm" onclick="deleteCard(this)">
                          <i class="bi bi-trash"></i>
                      </button>
                  </div>
              </footer>
          </div>
      `;

      // Add event listener to the new switch
      const newSwitch = card.querySelector('.form-check-input');
      newSwitch.addEventListener('change', function() {
          handleStatusToggle(this);
      });

      parkingContainer.appendChild(card);
      showAlert('Parqueadero agregado exitosamente', 'success');
  }

  // Function to delete parking card
  window.deleteCard = function(button) {
      if (confirm('¿Está seguro que desea eliminar este parqueadero?')) {
          const card = button.closest('.col-xl-3');
          card.remove();
          showAlert('Parqueadero eliminado exitosamente', 'danger');
      }
  };

  // Function to show alerts
  function showAlert(message, type) {
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
      alertDiv.role = 'alert';
      alertDiv.innerHTML = `
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      document.body.appendChild(alertDiv);
      
      // Remove alert after 3 seconds
      setTimeout(() => {
          alertDiv.remove();
      }, 3000);
  }
});
