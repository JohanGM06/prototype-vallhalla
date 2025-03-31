// Initial dummy data for demonstration
let tenants = [
    {
        id: 1,
        firstName: "Ana",
        lastName: "García",
        tower: "2",
        apartment: "301",
        idType: "CC",
        idNumber: "987654321",
        birthDate: "1990-05-20",
        phone: "3109876543",
        owner: "Juan Pérez",
        email: "ana.garcia@email.com"
    }
];

// Initialize DataTable
let table;
document.addEventListener('DOMContentLoaded', function() {
    table = $('#tenantsTable').DataTable({
        data: tenants,
        columns: [
            { data: 'tower' },
            { data: 'apartment' },
            { data: 'firstName' },
            { data: 'lastName' },
            { 
                data: null,
                render: function(data) {
                    return `${data.idType} ${data.idNumber}`;
                }
            },
            { data: 'owner' },
            { data: 'phone' },
            { data: 'email' },
            {
                data: null,
                render: function(data) {
                    return `
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="viewTenant(${data.id})">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button type="button" class="btn btn-outline-secondary btn-sm" onclick="editTenant(${data.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteTenant(${data.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
        }
    });
});

// Form submission handler
document.getElementById('tenantForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        tower: document.getElementById('tower').value,
        apartment: document.getElementById('apartment').value,
        idType: document.getElementById('idType').value,
        idNumber: document.getElementById('idNumber').value,
        birthDate: document.getElementById('birthDate').value,
        phone: document.getElementById('phone').value,
        owner: document.getElementById('owner').value,
        email: document.getElementById('email').value
    };

    if (this.dataset.editId) {
        // Update existing tenant
        const index = tenants.findIndex(tenant => tenant.id === parseInt(this.dataset.editId));
        tenants[index] = { ...tenants[index], ...formData };
        delete this.dataset.editId;
    } else {
        // Add new tenant
        tenants.push(formData);
    }

    // Update table
    table.clear().rows.add(tenants).draw();
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('tenantModal'));
    modal.hide();
    this.reset();

    // Show success alert
    Swal.fire({
        title: '¡Éxito!',
        text: 'Arrendatario guardado correctamente',
        icon: 'success',
        confirmButtonColor: '#198754',
        timer: 2000,
        timerProgressBar: true
    });
});

// View tenant details
function viewTenant(id) {
    const tenant = tenants.find(t => t.id === id);
    Swal.fire({
        title: 'Detalles del Arrendatario',
        html: `
            <div class="text-start">
                <p><strong>Nombre:</strong> ${tenant.firstName} ${tenant.lastName}</p>
                <p><strong>Documento:</strong> ${tenant.idType} ${tenant.idNumber}</p>
                <p><strong>Fecha de Nacimiento:</strong> ${tenant.birthDate}</p>
                <p><strong>Email:</strong> ${tenant.email}</p>
                <p><strong>Teléfono:</strong> ${tenant.phone}</p>
                <p><strong>Ubicación:</strong> Torre ${tenant.tower} - Apto ${tenant.apartment}</p>
                <p><strong>Propietario:</strong> ${tenant.owner}</p>
            </div>
        `,
        confirmButtonText: 'Cerrar'
    });
}

// Edit tenant
function editTenant(id) {
    const tenant = tenants.find(t => t.id === id);
    
    // Populate form
    document.getElementById('firstName').value = tenant.firstName;
    document.getElementById('lastName').value = tenant.lastName;
    document.getElementById('tower').value = tenant.tower;
    document.getElementById('apartment').value = tenant.apartment;
    document.getElementById('idType').value = tenant.idType;
    document.getElementById('idNumber').value = tenant.idNumber;
    document.getElementById('birthDate').value = tenant.birthDate;
    document.getElementById('phone').value = tenant.phone;
    document.getElementById('owner').value = tenant.owner;
    document.getElementById('email').value = tenant.email;

    // Set edit mode
    const form = document.getElementById('tenantForm');
    form.dataset.editId = id;

    // Update modal title
    const modal = document.getElementById('tenantModal');
    modal.querySelector('.modal-title').textContent = 'Editar Arrendatario';
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

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
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            tenants = tenants.filter(tenant => tenant.id !== id);
            table.clear().rows.add(tenants).draw();
            
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El arrendatario ha sido eliminado.',
                icon: 'success',
                confirmButtonColor: '#198754',
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
}
