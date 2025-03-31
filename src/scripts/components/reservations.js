document.addEventListener("DOMContentLoaded", function () {
  const createModal = document.getElementById("createReservationModal");
  const form = document.getElementById("createReservationForm");
  const submitBtn = document.getElementById("submitReservation");
  const reservationsList = document.querySelector(".list-group");

  // Demo reservations array
  let reservations = [
    {
      area: "BBQ",
      date: "22-11-2024",
      time: "14:00",
    },
  ];

  // Function to create reservation item HTML
  function createReservationItem(area, date, time) {
    return `
          <div class="list-group-item">
              <div class="d-flex justify-content-between align-items-center">
                  <div>
                      <h6 class="mb-1">${area}</h6>
                      <small class="text-muted">${date} - ${time}</small>
                  </div>
                  <div>
                      <button class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal" data-bs-target="#viewReservationModal">
                          <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete(this)">
                          <i class="bi bi-trash"></i>
                      </button>
                  </div>
              </div>
          </div>
      `;
  }

  // Function to update reservations list
  function updateReservationsList() {
    reservationsList.innerHTML = "";
    reservations.forEach((res) => {
      reservationsList.innerHTML += createReservationItem(
        res.area,
        res.date,
        res.time
      );
    });
  }

  // Initialize Flatpickr for create modal
  flatpickr("#createFecha", {
    locale: 'es',
    minDate: 'today',
    maxDate: new Date().fp_incr(90),
    dateFormat: "Y-m-d",
    disableMobile: "true"
  });

  // Handle form submission
  submitBtn.addEventListener("click", function () {
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const commonArea = document.getElementById("commonArea").value;
    const fecha = document.getElementById("createFecha").value;
    const time = document.getElementById("reservationTime").value;

    if (!commonArea || !fecha || !time) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos",
      });
      return;
    }

    // Format date for display
    const formattedDate = new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Add new reservation to array
    reservations.push({
      area: commonArea,
      date: formattedDate,
      time: time,
    });

    Swal.fire({
      icon: "success",
      title: "Reserva Creada",
      text: `Se ha creado la reserva para ${commonArea} el día ${formattedDate} a las ${time}`,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Reset form
        form.reset();
        form.classList.remove("was-validated");

        // Close modal and remove backdrop
        const modalInstance = bootstrap.Modal.getInstance(createModal);
        modalInstance.hide();
        
        // Remove modal backdrop manually if it persists
        const modalBackdrops = document.getElementsByClassName('modal-backdrop');
        while(modalBackdrops.length > 0) {
          modalBackdrops[0].remove();
        }
        
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');

        // Update reservations list
        updateReservationsList();
      }
    });
  });

  // Reset form when modal is closed
  createModal.addEventListener("hidden.bs.modal", function () {
    form.reset();
    form.classList.remove("was-validated");
  });

  // Initialize reservations list
  updateReservationsList();
});

// Function to handle reservation deletion
function confirmDelete(button) {
  Swal.fire({
    title: "¿Está seguro?",
    text: "No podrá revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const listItem = button.closest(".list-group-item");
      listItem.remove();
      Swal.fire("Eliminada", "La reserva ha sido eliminada.", "success");
    }
  });
}

class ReservationManager {
  constructor() {
    this.occupiedDates = [
      { date: '2025-04-07', hours: ['10:00', '14:00'], tooltip: 'Reservado: 10:00, 14:00' },
      { date: '2025-04-15', hours: ['08:00', '16:00'], tooltip: 'Reservado: 08:00, 16:00' },
      { date: '2025-04-22', hours: ['12:00'], tooltip: 'Reservado: 12:00' }
    ];

    this.init();

    // Add event listener for modal events
    const createModal = document.getElementById('createReservationModal');
    createModal.addEventListener('hidden.bs.modal', () => {
      this.initializeTooltips(); // Reinitialize tooltips when modal is hidden
    });

    createModal.addEventListener('shown.bs.modal', () => {
      this.initializeTooltips(); // Reinitialize tooltips when modal is shown
    });
  }

  init() {
    // Initialize Flatpickr with Spanish locale
    flatpickr.localize(flatpickr.l10ns.es);

    // Initialize main calendar
    this.mainCalendar = flatpickr("#mainCalendar", {
      inline: true,
      locale: 'es',
      defaultDate: 'today',
      minDate: 'today',
      maxDate: new Date().fp_incr(90),
      disable: this.occupiedDates.map(d => d.date), // Disable occupied dates
      onDayCreate: (dObj, dStr, fp, dayElem) => this.handleDayCreate(dayElem),
      onChange: (selectedDates, dateStr) => this.handleDateSelection(selectedDates, dateStr),
      onMonthChange: () => this.updateMonthTitle(),
      onReady: () => this.initializeTooltips()
    });

    // Initialize month navigation
    this.initializeMonthNavigation();
    this.updateMonthTitle();
  }

  handleDayCreate(dayElem) {
    const dateStr = dayElem.dateObj.toISOString().split('T')[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Remove any existing status classes
    dayElem.classList.remove('available', 'occupied');

    // Only process dates from today onwards
    if (dayElem.dateObj >= today) {
      const occupiedDate = this.occupiedDates.find(d => d.date === dateStr);
      
      if (occupiedDate) {
        dayElem.classList.add('occupied');
        dayElem.classList.add('disabled'); // Add disabled class
        dayElem.setAttribute('data-tooltip', occupiedDate.tooltip); // Add tooltip data
      } else {
        dayElem.classList.add('available');
      }
    }
  }

  initializeTooltips() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-tooltip]');
    tooltipTriggerList.forEach(element => {
      new bootstrap.Tooltip(element, {
        title: element.getAttribute('data-tooltip'),
        placement: 'top',
        trigger: 'hover',
        container: 'body'
      });
    });
  }

  isDateOccupied(dateStr) {
    return this.occupiedDates.some(d => d.date === dateStr);
  }

  handleDateSelection(selectedDates, dateStr) {
    if (!selectedDates[0]) return;
    
    // Only handle available dates
    if (!this.isDateOccupied(dateStr)) {
      const modal = new bootstrap.Modal(document.getElementById('createReservationModal'));
      modal.show();
    }
  }

  updateMonthTitle() {
    const monthName = this.mainCalendar.l10n.months.longhand[this.mainCalendar.currentMonth];
    const year = this.mainCalendar.currentYear;
    document.getElementById('monthYearLabel').textContent = `${monthName} ${year}`;
    
    // Reinitialize tooltips after month change
    setTimeout(() => this.initializeTooltips(), 100);
  }

  initializeMonthNavigation() {
    document.getElementById('prevMonth')?.addEventListener('click', () => {
      this.mainCalendar.changeMonth(-1);
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
      this.mainCalendar.changeMonth(1);
    });
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const reservationManager = new ReservationManager();
});