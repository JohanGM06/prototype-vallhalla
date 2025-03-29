// Form validation
document.addEventListener('DOMContentLoaded', function() {
  // Get all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        // Here you would normally submit the form data to a server
        Swal.fire({
          title: '¡Éxito!',
          text: 'Mascota registrada correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
          const modal = bootstrap.Modal.getInstance(document.getElementById('addPetModal'));
          modal.hide();
          form.reset();
        });
      }
      
      form.classList.add('was-validated');
    }, false);
  });

  // Handle edit form submission
  const editForm = document.getElementById('editPetForm');
  if (editForm) {
    editForm.addEventListener('submit', function(event) {
      event.preventDefault();
      if (!editForm.checkValidity()) {
        event.stopPropagation();
      } else {
        // Here you would normally submit the form data to a server
        Swal.fire({
          title: '¡Éxito!',
          text: 'Mascota actualizada correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
          const modal = bootstrap.Modal.getInstance(document.getElementById('editPetModal'));
          modal.hide();
        });
      }
      editForm.classList.add('was-validated');
    });
  }

  // Optional: Add click handlers to populate the view modal with actual data
  document.querySelectorAll('[data-bs-target="#viewPetModal"]').forEach(button => {
    button.addEventListener('click', function() {
      // Here you would normally fetch the pet's data from your data source
      // For demo purposes, we're using static data
      document.getElementById('viewPetName').textContent = 'Rodrigo';
      document.getElementById('viewOwnerName').textContent = 'Carlos Armando';
      document.getElementById('viewApartment').textContent = 'Torre 3 apto 104';
      document.getElementById('viewPhone').textContent = '3126193172';
      document.getElementById('viewSpecies').textContent = 'Perro';
      document.getElementById('viewSize').textContent = 'Mediano';
      document.getElementById('viewVaccinated').textContent = 'Sí';
    });
  });

  // Optional: Add click handlers to populate the edit modal with actual data
  document.querySelectorAll('[data-bs-target="#editPetModal"]').forEach(button => {
    button.addEventListener('click', function() {
      // Here you would normally fetch the pet's data and populate the form
      // The form is currently pre-populated with static data in the HTML
    });
  });

  // Form validation for add form
  const petForm = document.getElementById('petForm');
  const petsContainer = document.querySelector('.row-cols-1'); // Container for pet cards

  function createPetCard(formData) {
    // Create card elements
    const colDiv = document.createElement('div');
    colDiv.className = 'col';

    const cardHtml = `
      <div class="card h-100">
        <img src="${URL.createObjectURL(formData.get('petPhoto'))}" class="card-img-top" alt="Foto de mascota">
        <div class="card-body">
          <h5 class="card-title">${formData.get('petName')}</h5>
          <p class="card-text">
            <small class="text-muted">Especie: ${formData.get('species')}</small><br>
            <small class="text-muted">Raza: ${formData.get('breed')}</small><br>
            <small class="text-muted">Propietario: ${formData.get('owner')}</small>
          </p>
        </div>
        <div class="card-footer bg-transparent border-top-0">
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#viewPetModal">
              <i class="bi bi-eye"></i>
            </button>
            <button type="button" class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#editPetModal">
              <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="deletePet(this)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    colDiv.innerHTML = cardHtml;
    return colDiv;
  }

  if (petForm) {
    petForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Basic form validation
      if (!petForm.checkValidity()) {
        event.stopPropagation();
        petForm.classList.add('was-validated');
        return;
      }

      // Collect form data
      const formData = new FormData(petForm);
      
      // Validate required fields
      const requiredFields = ['petName', 'species', 'breed', 'owner'];
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!formData.get(field)) {
          isValid = false;
          const input = petForm.querySelector(`[name="${field}"]`);
          input.classList.add('is-invalid');
        }
      });

      // Validate file inputs
      const petPhoto = formData.get('petPhoto');
      const vaccineCard = formData.get('vaccineCard');

      if (!petPhoto || !vaccineCard) {
        isValid = false;
        if (!petPhoto) {
          petForm.querySelector('[name="petPhoto"]').classList.add('is-invalid');
        }
        if (!vaccineCard) {
          petForm.querySelector('[name="vaccineCard"]').classList.add('is-invalid');
        }
      }

      if (!isValid) {
        return;
      }

      try {
        // Create and add new pet card
        const newPetCard = createPetCard(formData);
        petsContainer.insertBefore(newPetCard, petsContainer.firstChild);

        // Show success message
        Swal.fire({
          title: '¡Éxito!',
          text: 'Mascota registrada correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
          // Reset form and close modal
          petForm.reset();
          petForm.classList.remove('was-validated');
          const modal = bootstrap.Modal.getInstance(document.getElementById('addPetModal'));
          modal.hide();
        });

      } catch (error) {
        console.error('Error creating pet card:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al crear la mascota',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });

    // Add input event listeners for real-time validation
    petForm.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', function() {
        if (this.value) {
          this.classList.remove('is-invalid');
        }
      });
    });
  }
});

// Delete pet function
function deletePet(button) {
  Swal.fire({
    title: '¿Está seguro?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Here you would normally delete the pet from the server
      button.closest('.col').remove();
      Swal.fire(
        '¡Eliminado!',
        'La mascota ha sido eliminada.',
        'success'
      );
    }
  });
} 