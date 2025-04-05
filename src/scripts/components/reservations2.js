

document.getElementById('sidebarToggle').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

window.addEventListener('resize', () => {
  if (window.innerWidth < 992) { // Less than lg
    const sidebar = document.getElementById('sidebar');
    if (!sidebar.classList.contains('collapsed')) {
      sidebar.classList.add('collapsed');
    }
  } else {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('collapsed')) {
      sidebar.classList.remove('collapsed');
    }
  }
});

// Initialize Flatpickr with Spanish locale
flatpickr.localize(flatpickr.l10ns.es);

// Mock occupied dates with specific hours
const occupiedDates = [
  { date: '2024-03-20', hours: ['10:00', '14:00'] },
  { date: '2024-03-22', hours: ['08:00', '16:00'] },
  { date: '2024-03-25', hours: ['12:00'] },
  { date: '2024-03-28', hours: ['14:00', '16:00'] },
  { date: '2024-04-01', hours: ['08:00', '10:00', '12:00'] },
  { date: '2024-04-05', hours: ['16:00', '18:00'] }
];

let createCalendar, editCalendar;

// Function to initialize a calendar
function initializeCalendar(inputId, existingCalendar) {
  if (existingCalendar) {
    existingCalendar.destroy();
  }

  return flatpickr(`#${inputId}`, {
    locale: 'es',
    inline: true,
    monthSelectorType: 'static',
    dateFormat: 'Y-m-d',
    minDate: 'today',
    maxDate: new Date().fp_incr(90),
    disable: occupiedDates.map(d => d.date),
    onChange: function (selectedDates, dateStr) {
      if (selectedDates[0]) {
        updateAvailableHours(selectedDates[0], inputId.includes('create') ? 'create' : 'edit');
      }
    },
    onDayCreate: function (dObj, dStr, fp, dayElem) {
      const dateStr = dayElem.dateObj.toISOString().split('T')[0];
      const isOccupied = occupiedDates.some(d => d.date === dateStr);

      if (isOccupied) {
        dayElem.title = "Ocupado";
        dayElem.classList.add('occupied-date');
      }
    }
  });
}

// Function to update available hours
function updateAvailableHours(selectedDate, mode) {
  const horaSelect = document.getElementById(`${mode}Hora`);
  const dateStr = selectedDate.toISOString().split('T')[0];
  const occupiedDate = occupiedDates.find(d => d.date === dateStr);

  // Reset hour selection
  horaSelect.value = '';

  // Enable all options first
  Array.from(horaSelect.options).forEach(option => {
    option.disabled = false;
  });

  if (occupiedDate) {
    // Disable occupied hours
    occupiedDate.hours.forEach(hour => {
      const option = Array.from(horaSelect.options).find(opt => opt.value === hour);
      if (option) {
        option.disabled = true;
      }
    });
  }
}

// Initialize calendars when modals are shown
document.addEventListener('DOMContentLoaded', function () {
  // Initialize create modal calendar
  document.getElementById('createReservationModal').addEventListener('shown.bs.modal', function () {
    createCalendar = initializeCalendar('createFecha', createCalendar);
  });

  // Initialize edit modal calendar
  document.getElementById('editReservationModal').addEventListener('shown.bs.modal', function () {
    editCalendar = initializeCalendar('editFecha', editCalendar);
  });

  // Clean up when modals are hidden
  document.getElementById('createReservationModal').addEventListener('hidden.bs.modal', function () {
    if (createCalendar) {
      createCalendar.destroy();
      createCalendar = null;
    }
  });

  document.getElementById('editReservationModal').addEventListener('hidden.bs.modal', function () {
    if (editCalendar) {
      editCalendar.destroy();
      editCalendar = null;
    }
  });
});

// Set min date to today for date inputs
const today = new Date().toISOString().split('T')[0];
document.getElementById('createFecha').min = today;
document.getElementById('editFecha').min = today;

// Update final date min when initial date changes
document.getElementById('createFecha').addEventListener('change', function () {
  document.getElementById('createFecha').value = this.value;
});

document.getElementById('editFecha').addEventListener('change', function () {
  document.getElementById('editFecha').value = this.value;
});

function validateAndSubmit() {
  console.log("validateAndSubmit function called"); // Debugging line

  const form = document.getElementById('createReservationForm');
  if (!form) {
    console.error("Form not found"); // Debugging line
    return;
  }

  // Validate form
  if (!form.checkValidity()) {
    console.log("Form is not valid"); // Debugging line
    form.classList.add('was-validated');
    return;
  }
  console.log("Form is valid"); // Debugging line

  // Get form values
  const tipoZona = document.getElementById('createTipoZona').value;
  const fecha = document.getElementById('createFecha').value;
  const hora = document.getElementById('createHora').value;

  // Debugging: Log form values
  console.log("Tipo de Zona:", tipoZona);
  console.log("Fecha:", fecha);
  console.log("Hora:", hora);

  // Additional validation
  if (new Date(fecha) < new Date(today)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La fecha no puede ser anterior a la fecha actual'
    });
    return;
  }

  // Show confirmation dialog
  Swal.fire({
    title: '¿Está seguro?',
    text: "¿Desea crear esta reservación?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, crear',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("User confirmed reservation creation"); // Debugging line
      const modal = bootstrap.Modal.getInstance(document.getElementById('createReservationModal'));
      if (modal) {
        modal.hide();
      }
      form.reset();
      form.classList.remove('was-validated');
      // Add new reservation to the list
      const listGroup = document.querySelector('.list-group');
      if (!listGroup) {
        console.error("List group not found"); // Debugging line
        return;
      }
      Swal.fire({
        icon: 'success',
        title: '¡Reserva creada correctamente!',
        text: 'La reservación ha sido creada exitosamente',
        timer: 2000,
        showConfirmButton: false
      })
      const newReservation = document.createElement('div');
      newReservation.className = 'list-group-item';
      newReservation.innerHTML = `
  <div class="d-flex justify-content-between align-items-center">
    <div>
      <h6 class="mb-1">APT #101</h6>
      <small class="text-muted">${fecha} - ${hora}</small>
    </div>
    <div>
      <button class="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal"
        data-bs-target="#editReservationModal">
        <i class="bi bi-pencil"></i>
      </button>
      <button class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal"
        data-bs-target="#viewReservationModal">
        <i class="bi bi-eye"></i>
      </button>
      <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete(this)">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </div>
`;

      // Add the new reservation at the top of the list
      listGroup.prepend(newReservation);

      // Add the date to occupied dates (for calendar)
      const existingDate = occupiedDates.find(d => d.date === fecha);
      if (existingDate) {
        // Add the hour if it doesn't exist
        if (!existingDate.hours.includes(hora)) {
          existingDate.hours.push(hora);
        }
      } else {
        // Add new date with this hour
        occupiedDates.push({ date: fecha, hours: [hora] });
      }


      // Show success message

    }
  });
}
// Reset form when modal is closed
document.getElementById('createReservationModal').addEventListener('hidden.bs.modal', function () {
  const form = document.getElementById('createReservationForm');
  form.reset();
  form.classList.remove('was-validated');
});

// Update editReservation function
function editReservation(id) {
  const reservation = mockReservations.find(r => r.id === id);
  if (reservation) {
    document.getElementById('editTipoZona').value = reservation.tipoZona;
    if (editCalendar) {
      editCalendar.setDate(reservation.fechaInicial);
    }
    document.getElementById('editHora').value = reservation.hora;

    document.getElementById('editReservationForm').setAttribute('data-reservation-id', id);
  }
}

// Update validateAndSubmitEdit function
function validateAndSubmitEdit() {
  const form = document.getElementById('editReservationForm');
  const id = parseInt(form.getAttribute('data-reservation-id'));

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const tipoZona = document.getElementById('editTipoZona').value;
  const fecha = editCalendar.selectedDates[0];
  const hora = document.getElementById('editHora').value;

  if (!fecha) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor seleccione una fecha'
    });
    return;
  }

  Swal.fire({
    title: '¿Está seguro?',
    text: "¿Desea guardar los cambios en esta reservación?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Update mock data
      const index = mockReservations.findIndex(r => r.id === id);
      if (index > -1) {
        mockReservations[index] = {
          ...mockReservations[index],
          tipoZona,
          fechaInicial: fecha.toISOString().split('T')[0],
          fechaFinal: fecha.toISOString().split('T')[0],
          hora
        };

        renderReservations();

        Swal.fire({
          icon: 'success',
          title: '¡Cambios guardados!',
          text: 'La reservación ha sido actualizada exitosamente',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          const modal = bootstrap.Modal.getInstance(document.getElementById('editReservationModal'));
          modal.hide();
          form.classList.remove('was-validated');
        });
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialize main calendar
  const mainCalendar = flatpickr("#mainCalendar", {
    locale: 'es',
    inline: true,
    monthSelectorType: 'static',
    dateFormat: 'Y-m-d',
    defaultDate: 'today',
    minDate: 'today',
    maxDate: new Date().fp_incr(90),
    onDayCreate: function (dObj, dStr, fp, dayElem) {
      const dateStr = dayElem.dateObj.toISOString().split('T')[0];
      const isOccupied = occupiedDates.some(d => d.date === dateStr);

      if (dayElem.dateObj >= new Date() && dayElem.dateObj <= new Date().fp_incr(90)) {
        if (isOccupied) {
          dayElem.classList.add('occupied');
          dayElem.title = "Ocupado";
        } else {
          dayElem.classList.add('available');
          dayElem.title = "Disponible";
        }
      }
    },
    onChange: function (selectedDates, dateStr) {
      if (selectedDates[0]) {
        const isOccupied = occupiedDates.some(d => d.date === dateStr);
        if (isOccupied) {
          const modal = new bootstrap.Modal(document.getElementById('viewReservationModal'));
          modal.show();
        } else {
          const modal = new bootstrap.Modal(document.getElementById('createReservationModal'));
          modal.show();
        }
      }
    }
  });

  // Update the header buttons to control the main calendar
  document.querySelector('.btn-outline-secondary i.bi-chevron-left').parentElement.addEventListener('click', () => {
    mainCalendar.changeMonth(mainCalendar.currentMonth - 1);
  });

  document.querySelector('.btn-outline-secondary i.bi-chevron-right').parentElement.addEventListener('click', () => {
    mainCalendar.changeMonth(mainCalendar.currentMonth + 1);
  });

  // Update month title
  function updateMonthTitle() {
    const monthYear = mainCalendar.currentYear;
    const monthName = mainCalendar.l10n.months.longhand[mainCalendar.currentMonth];
    document.querySelector('.card-header h5').textContent = `${monthName} ${monthYear}`;
  }

  mainCalendar.config.onMonthChange = function () {
    updateMonthTitle();
  };

  // Initial title update
  updateMonthTitle();
});

// Function to show delete confirmation
function confirmDelete(button) {
  Swal.fire({
    title: '¿Está seguro?',
    text: "Esta reservación será eliminada permanentemente",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Get the list item and remove it
      const listItem = button.closest('.list-group-item');

      // Get date info from the item before removing
      const dateText = listItem.querySelector('small.text-muted').textContent;
      const dateParts = dateText.split(' - ');
      const fecha = dateParts[0];
      const hora = dateParts[1];

      // Remove from DOM
      listItem.remove();

      // Remove from occupiedDates array
      const dateIndex = occupiedDates.findIndex(d => d.date === fecha);
      if (dateIndex !== -1) {
        // If this is the only hour for this date, remove the entire date
        if (occupiedDates[dateIndex].hours.length === 1 && occupiedDates[dateIndex].hours[0] === hora) {
          occupiedDates.splice(dateIndex, 1);
        }
        // Otherwise just remove this hour
        else {
          const hourIndex = occupiedDates[dateIndex].hours.indexOf(hora);
          if (hourIndex !== -1) {
            occupiedDates[dateIndex].hours.splice(hourIndex, 1);
          }
        }
      }

      // Update the calendar if it exists
      if (typeof mainCalendar !== 'undefined') {
        mainCalendar.redraw();
      }

      // Close any open modals
      const openModals = document.querySelectorAll('.modal.show');
      openModals.forEach(modalEl => {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) {
          modal.hide();
        }
      });

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'La reservación ha sido eliminada correctamente',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

   