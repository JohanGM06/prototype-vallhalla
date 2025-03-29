
document.getElementById("sidebarToggle").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("collapsed");
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth < 992) {
      // Less than lg
      const sidebar = document.getElementById("sidebar");
      if (!sidebar.classList.contains("collapsed")) {
        sidebar.classList.toggle("collapsed");
      }
    }
    console.log("loaded");
  });
  
  // Parking data structure
  let parkingSpots = [
    { id: 1, number: "01", status: "occupied" },
    { id: 2, number: "02", status: "occupied" },
    { id: 3, number: "03", status: "available" },
  ];
  
  let sortAscending = true;
  
  // Initialize tooltips
  function initTooltips() {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach((tooltip) => new bootstrap.Tooltip(tooltip));
  }
  
  // Render parking grid
  function renderParkingGrid() {
    const grid = document.getElementById("parkingGrid");
    grid.innerHTML = "";
  
    // Sort parking spots if needed
    const sortedSpots = [...parkingSpots].sort((a, b) => {
      return sortAscending
        ? a.number.localeCompare(b.number)
        : b.number.localeCompare(a.number);
    });
  
    sortedSpots.forEach((spot) => {
      const card = document.createElement("div");
      card.className = "col-md-4 col-lg-3";
  
      const isOccupied = spot.status === "occupied";
      const statusClass = isOccupied ? "danger" : "success";
      const statusDot = isOccupied ? "red" : "green";
  
      card.innerHTML = `
            <div class="card ${isOccupied ? "opacity-75" : ""}" 
                 ${
                   isOccupied
                     ? 'data-bs-toggle="tooltip" data-bs-title="Parqueadero ocupado"'
                     : ""
                 }
                 ${
                   !isOccupied
                     ? 'onclick="openParkingModal(' + spot.id + ')"'
                     : ""
                 }
                 style="cursor: ${isOccupied ? "not-allowed" : "pointer"}">
              <div class="card-body text-center">
                <div class="position-absolute top-0 end-0 p-2">
                  <span class="badge bg-${statusClass} rounded-circle" style="width: 10px; height: 10px; display: inline-block;"></span>
                </div>
                <i class="bi bi-car-front display-4"></i>
                <h5 class="mt-2">Parqueadero ${spot.number}</h5>
              </div>
            </div>
          `;
  
      grid.appendChild(card);
    });
  
    initTooltips();
  }
  
  // Toggle sort order
  function toggleSortOrder() {
    sortAscending = !sortAscending;
    renderParkingGrid();
  }
  
  // Filter parkings
  function filterParkings(searchTerm) {
    const cards = document.querySelectorAll(".card");
    searchTerm = searchTerm.toLowerCase();
  
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.parentElement.style.display = text.includes(searchTerm) ? "" : "none";
    });
  }
  
  // Simple toggle function for vehicle fields
  function toggleVehicleFields() {
    const vehicleType = document.getElementById("vehicleType").value;
    const carFields = document.getElementById("carFields");
    const motorcycleFields = document.getElementById("motorcycleFields");
    const totalAmount = document.getElementById("totalAmount");
  
    carFields.style.display = "none";
    motorcycleFields.style.display = "none";
  
    if (vehicleType === "car") {
      carFields.style.display = "block";
      totalAmount.value = "$50.000";
    } else if (vehicleType === "motorcycle") {
      motorcycleFields.style.display = "block";
      totalAmount.value = "$25.000";
    } else {
      totalAmount.value = "$0";
    }
  }
  
  // Reset form when opening modal
  function openParkingModal(parkingId) {
    const parkingModal = new bootstrap.Modal(
      document.getElementById("parkingModal")
    );
    const form = document.getElementById("parkingForm");
    form.reset();
    document.getElementById("carFields").style.display = "none";
    document.getElementById("motorcycleFields").style.display = "none";
    document.getElementById("totalAmount").value = "$0";
    form.dataset.parkingId = parkingId;
    parkingModal.show();
  }
  
  // Modify the proceedToPayment function to show PayU modal
  function proceedToPayment() {
    const form = document.getElementById("parkingForm");
    const parkingId = form.dataset.parkingId;
  
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
  
    // Close parking form modal and open PayU modal
    bootstrap.Modal.getInstance(document.getElementById("parkingModal")).hide();
    const payuModal = new bootstrap.Modal(document.getElementById("payuModal"));
    payuModal.show();
  }
  
  // Add PayU related functions
  function togglePaymentForm() {
    const cardForm = document.getElementById("cardPaymentForm");
    const pseForm = document.getElementById("psePaymentForm");
    const installmentsSection = document.getElementById("installmentsSection");
  
    if (document.getElementById("pse").checked) {
      cardForm.classList.add("d-none");
      pseForm.classList.remove("d-none");
    } else {
      cardForm.classList.remove("d-none");
      pseForm.classList.add("d-none");
      installmentsSection.style.display = document.getElementById("creditCard")
        .checked
        ? "block"
        : "none";
    }
  }
  
  function processPayuPayment() {
    const selectedMethod = document.querySelector(
      'input[name="paymentMethod"]:checked'
    ).value;
    let isValid = true;
  
    if (selectedMethod !== "pse") {
      const inputs = document.querySelectorAll(
        "#cardPaymentForm input[required]"
      );
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          input.classList.add("is-invalid");
          isValid = false;
        } else {
          input.classList.remove("is-invalid");
        }
      });
    }
  
    if (!isValid) {
      Swal.fire({
        icon: "error",
        title: "Error de Validación",
        text: "Por favor complete todos los campos requeridos",
        confirmButtonText: "Entendido",
      });
      return;
    }
  
    // Close PayU modal
    bootstrap.Modal.getInstance(document.getElementById("payuModal")).hide();
  
    // Show processing animation
    Swal.fire({
      title: "Procesando pago...",
      text: "Por favor espere",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
  
    // Simulate payment processing
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "¡Pago Exitoso!",
        text: "El parqueadero ha sido reservado exitosamente",
        confirmButtonText: "Aceptar",
      }).then(() => {
        // Update parking spot status
        const parkingId =
          document.getElementById("parkingForm").dataset.parkingId;
        const spotIndex = parkingSpots.findIndex(
          (spot) => spot.id === parseInt(parkingId)
        );
        if (spotIndex !== -1) {
          parkingSpots[spotIndex].status = "occupied";
          renderParkingGrid();
        }
      });
    }, 2000);
  }
  
  // Initialize the grid on page load
  document.addEventListener("DOMContentLoaded", () => {
    renderParkingGrid();
  });
  