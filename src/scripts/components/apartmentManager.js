// Add this at the beginning of your file
const dummyOwners = [
    { id: 1, text: 'Juan Pérez - CC 123456789' },
    { id: 2, text: 'María López - CC 987654321' },
    { id: 3, text: 'Carlos Rodríguez - CC 456789123' },
    { id: 4, text: 'Ana Martínez - CC 789123456' },
    { id: 5, text: 'Luis González - CC 321654987' },
    { id: 6, text: 'Laura Torres - CC 654987321' },
    { id: 7, text: 'Pedro Ramírez - CC 147258369' },
    { id: 8, text: 'Sofia Castro - CC 369258147' },
    { id: 9, text: 'Diego Morales - CC 258369147' },
    { id: 10, text: 'Valentina Herrera - CC 741852963' }
];

const dummyTenants = [
    { id: 1, text: 'Roberto Silva - CC 159753468' },
    { id: 2, text: 'Carmen Ortiz - CC 357951684' },
    { id: 3, text: 'Fernando Díaz - CC 852963741' },
    { id: 4, text: 'Patricia Ruiz - CC 963741852' },
    { id: 5, text: 'Miguel Vargas - CC 741852963' }
];

// Initial dummy data for demonstration
let apartments = [
    {
        id: 1,
        tower: 1,
        number: 101,
        status: 'occupied',
        owner: 'Juan Pérez',
        tenant: null
    },
    {
        id: 2,
        tower: 1,
        number: 102,
        status: 'rented',
        owner: 'María López',
        tenant: 'Carlos Ruiz'
    },
    // Add more dummy data as needed
];

// DOM Elements
const apartmentsGrid = document.getElementById('apartmentsGrid');
const apartmentForm = document.getElementById('apartmentForm');
const statusSelect = document.getElementById('status');
const tenantField = document.querySelector('.tenant-field');

// Show/hide tenant field based on status
statusSelect.addEventListener('change', function() {
    tenantField.style.display = this.value === 'rented' ? 'block' : 'none';
    document.getElementById('tenant').required = this.value === 'rented';
});

// Render apartments grid
function renderApartments(apartments) {
    apartmentsGrid.innerHTML = apartments.map(apt => `
        <div class="col">
            <article class="card h-100 apartment-card" onclick="viewApartment(${apt.id})">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h2 class="h5 card-title mb-0">Torre ${apt.tower} - Apto ${apt.number}</h2>
                        <span class="badge bg-${getStatusBadgeColor(apt.status)}">${getStatusLabel(apt.status)}</span>
                    </div>
                    <p class="card-text mb-1"><strong>Propietario:</strong> ${apt.owner}</p>
                    ${apt.tenant ? `<p class="card-text mb-0"><strong>Arrendatario:</strong> ${apt.tenant}</p>` : ''}
                </div>
                <div class="card-footer bg-transparent">
                    <div class="btn-group w-100" role="group">
                        <button class="btn btn-outline-primary btn-sm" onclick="editApartment(${apt.id}); event.stopPropagation();">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteApartment(${apt.id}); event.stopPropagation();">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </article>
        </div>
    `).join('');
}

// Helper functions
function getStatusBadgeColor(status) {
    const colors = {
        vacant: 'secondary',
        occupied: 'success',
        rented: 'primary'
    };
    return colors[status] || 'secondary';
}

function getStatusLabel(status) {
    const labels = {
        vacant: 'Vacío',
        occupied: 'Ocupado',
        rented: 'Arrendado'
    };
    return labels[status] || status;
}

// CRUD Operations
function viewApartment(id) {
    const apt = apartments.find(a => a.id === id);
    Swal.fire({
        title: `Torre ${apt.tower} - Apartamento ${apt.number}`,
        html: `
            <div class="text-start">
                <p><strong>Estado:</strong> ${getStatusLabel(apt.status)}</p>
                <p><strong>Propietario:</strong> ${apt.owner}</p>
                ${apt.tenant ? `<p><strong>Arrendatario:</strong> ${apt.tenant}</p>` : ''}
            </div>
        `,
        confirmButtonText: 'Cerrar'
    });
}

function editApartment(id) {
    const apt = apartments.find(a => a.id === id);
    
    // Populate form
    document.getElementById('tower').value = apt.tower;
    document.getElementById('apartment').value = apt.number;
    document.getElementById('status').value = apt.status;
    document.getElementById('owner').value = apt.owner;
    if (apt.tenant) {
        document.getElementById('tenant').value = apt.tenant;
        tenantField.style.display = 'block';
    }

    // Set edit mode
    apartmentForm.dataset.editId = id;

    // Update modal title
    const modal = document.getElementById('apartmentModal');
    modal.querySelector('.modal-title').textContent = 'Editar Apartamento';
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

function deleteApartment(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            apartments = apartments.filter(apt => apt.id !== id);
            renderApartments(apartments);
            
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El apartamento ha sido eliminado.',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
}

// Form submission handler
apartmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: this.dataset.editId ? parseInt(this.dataset.editId) : Date.now(),
        tower: parseInt(document.getElementById('tower').value),
        number: parseInt(document.getElementById('apartment').value),
        status: document.getElementById('status').value,
        owner: document.getElementById('owner').value,
        tenant: document.getElementById('status').value === 'rented' ? document.getElementById('tenant').value : null
    };

    if (this.dataset.editId) {
        // Update existing apartment
        const index = apartments.findIndex(apt => apt.id === parseInt(this.dataset.editId));
        apartments[index] = formData;
        delete this.dataset.editId;
    } else {
        // Add new apartment
        apartments.push(formData);
    }

    // Update grid
    renderApartments(apartments);
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('apartmentModal'));
    modal.hide();
    this.reset();
    tenantField.style.display = 'none';

    // Show success alert
    Swal.fire({
        title: '¡Éxito!',
        text: 'Apartamento guardado correctamente',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderApartments(apartments);

    // Initialize Select2 for owner select
    $('#owner').select2({
        theme: 'bootstrap-5',
        width: '100%',
        placeholder: 'Buscar propietario...',
        data: dummyOwners,
        allowClear: true
    });

    // Initialize Select2 for tenant select
    $('#tenant').select2({
        theme: 'bootstrap-5',
        width: '100%',
        placeholder: 'Buscar arrendatario...',
        data: dummyTenants,
        allowClear: true
    });

    // Handle modal show/hide events to fix Select2 inside Bootstrap modal
    $('#apartmentModal').on('shown.bs.modal', function () {
        $('#owner').select2({
            theme: 'bootstrap-5',
            width: '100%',
            dropdownParent: $('#apartmentModal')
        });
        $('#tenant').select2({
            theme: 'bootstrap-5',
            width: '100%',
            dropdownParent: $('#apartmentModal')
        });
    });

    // Clear selections when modal is hidden
    $('#apartmentModal').on('hidden.bs.modal', function () {
        $('#owner').val(null).trigger('change');
        $('#tenant').val(null).trigger('change');
    });
});

// Filter functionality
document.getElementById('towerFilter').addEventListener('change', filterApartments);
document.getElementById('statusFilter').addEventListener('change', filterApartments);
document.getElementById('searchApartment').addEventListener('input', filterApartments);

function filterApartments() {
    const tower = document.getElementById('towerFilter').value;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchApartment').value.toLowerCase();

    const filtered = apartments.filter(apt => {
        const matchTower = tower ? apt.tower.toString() === tower : true;
        const matchStatus = status ? apt.status === status : true;
        const matchSearch = search ? 
            apt.number.toString().includes(search) ||
            apt.owner.toLowerCase().includes(search) ||
            (apt.tenant && apt.tenant.toLowerCase().includes(search))
            : true;

        return matchTower && matchStatus && matchSearch;
    });

    renderApartments(filtered);
}

// Update your status change handler to work with Select2
document.getElementById('status').addEventListener('change', function() {
    const tenantField = document.querySelector('.tenant-field');
    if (this.value === 'rented') {
        tenantField.style.display = 'block';
        $('#tenant').prop('required', true);
    } else {
        tenantField.style.display = 'none';
        $('#tenant').prop('required', false);
        $('#tenant').val(null).trigger('change');
    }
}); 