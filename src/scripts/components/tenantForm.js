// Initial dummy data for demonstration
let tenants = [
  {
    id: 1,
    name: "Cristian Arboleda",
    email: "cristianarboleda2004@gmail.com",
    phone: "3126113172",
    idType: "CC",
    idNumber: "1094044777",
    birthDate: "2004-04-15",
    tower: "1",
    apartment: "104",
    status: "Activo"
  }
];

  // Function to render all tenants
  function renderTenants() {
    const tenantsContainer = document.querySelector('.row.g-4');
    tenantsContainer.innerHTML = tenants.map(tenant => `
      <div class="col-12 col-md-6 col-lg-4" data-tenant-id="${tenant.id}">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <h3 class="card-title h5">${tenant.name}</h3>
              <span class="badge bg-success">${tenant.status}</span>
            </div>
            <p class="card-text">
              <i class="bi bi-envelope"></i> ${tenant.email}<br>
              <i class="bi bi-telephone"></i> ${tenant.phone}<br>
              <i class="bi bi-building"></i> Torre ${tenant.tower} - Apto ${tenant.apartment}
            </p>
            <div class="btn-group" role="group" aria-label="Acciones de arrendatario">
              <button type="button" class="btn btn-outline-primary btn-sm" onclick="viewTenant(${tenant.id})">
                <i class="bi bi-eye"></i> Ver
              </button>
              <button type="button" class="btn btn-outline-secondary btn-sm" onclick="editTenant(${tenant.id})">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteTenant(${tenant.id})">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Form submission handler
  document.getElementById('tenantForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      id: Date.now(), // Simple way to generate unique IDs
      name: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      idType: document.getElementById('idType').value,
      idNumber: document.getElementById('idNumber').value,
      birthDate: document.getElementById('birthDate').value,
      tower: document.getElementById('tower').value,
      apartment: document.getElementById('apartment').value,
      status: 'Activo'
    };

    tenants.push(formData);
    renderTenants();
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTenantModal'));
    modal.hide();
    this.reset();

    // Show success alert
    Swal.fire({
      title: '¡Éxito!',
      text: 'Arrendatario agregado correctamente',
      icon: 'success',
      confirmButtonColor: '#198754',
      customClass: {
        confirmButton: 'btn btn-success'
      },
      timer: 2000,
      timerProgressBar: true
    });
  });

  // Delete tenant
  function deleteTenant(id) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        tenants = tenants.filter(tenant => tenant.id !== id);
        renderTenants();
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El arrendatario ha sido eliminado.',
          icon: 'success',
          confirmButtonColor: '#198754',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    });
  }

  // View tenant details
  function viewTenant(id) {
    const tenant = tenants.find(t => t.id === id);
    const modalContent = `
      <div class="modal" id="viewTenantModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Detalles del Arrendatario</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <dl class="row">
                <dt class="col-sm-4">Nombre:</dt>
                <dd class="col-sm-8">${tenant.name}</dd>
                <dt class="col-sm-4">Email:</dt>
                <dd class="col-sm-8">${tenant.email}</dd>
                <dt class="col-sm-4">Teléfono:</dt>
                <dd class="col-sm-8">${tenant.phone}</dd>
                <dt class="col-sm-4">Identificación:</dt>
                <dd class="col-sm-8">${tenant.idType} ${tenant.idNumber}</dd>
                <dt class="col-sm-4">Fecha de nacimiento:</dt>
                <dd class="col-sm-8">${tenant.birthDate}</dd>
                <dt class="col-sm-4">Apartamento:</dt>
                <dd class="col-sm-8">Torre ${tenant.tower} - Apto ${tenant.apartment}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('viewTenantModal');
    if (existingModal) existingModal.remove();

    // Add new modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewTenantModal'));
    modal.show();
  }

  // Edit tenant
  function editTenant(id) {
    const tenant = tenants.find(t => t.id === id);
    
    // Populate form
    document.getElementById('fullName').value = tenant.name;
    document.getElementById('email').value = tenant.email;
    document.getElementById('phone').value = tenant.phone;
    document.getElementById('idType').value = tenant.idType;
    document.getElementById('idNumber').value = tenant.idNumber;
    document.getElementById('birthDate').value = tenant.birthDate;
    document.getElementById('tower').value = tenant.tower;
    document.getElementById('apartment').value = tenant.apartment;

    // Change modal title and button
    const modal = document.getElementById('addTenantModal');
    modal.querySelector('.modal-title').textContent = 'Editar Arrendatario';
    modal.querySelector('button[type="submit"]').textContent = 'Guardar';

    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Update form submission handler for edit
    const form = document.getElementById('tenantForm');
    form.onsubmit = function(e) {
      e.preventDefault();
      
      // Update tenant data
      tenant.name = document.getElementById('fullName').value;
      tenant.email = document.getElementById('email').value;
      tenant.phone = document.getElementById('phone').value;
      tenant.idType = document.getElementById('idType').value;
      tenant.idNumber = document.getElementById('idNumber').value;
      tenant.birthDate = document.getElementById('birthDate').value;
      tenant.tower = document.getElementById('tower').value;
      tenant.apartment = document.getElementById('apartment').value;

      renderTenants();
      bsModal.hide();
      
      // Reset form and handlers
      form.reset();
      form.onsubmit = null;
      modal.querySelector('.modal-title').textContent = 'Añadir Arrendatario';
      modal.querySelector('button[type="submit"]').textContent = 'Crear';
    };
  }

  // Initial render
  document.addEventListener('DOMContentLoaded', renderTenants);
