// Initial dummy data for demonstration
let owners = [
    {
        id: 1,
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@email.com",
        phone: "3001234567",
        idType: "CC",
        idNumber: "123456789",
        birthDate: "1980-01-15",
        tower: "1",
        apartment: "101"
    }
];

// Initialize DataTable
let table;
document.addEventListener('DOMContentLoaded', function() {
    table = $('#ownersTable').DataTable({
        data: owners,
        columns: [
            { data: 'firstName' },
            { data: 'lastName' },
            { data: 'tower' },
            { data: 'apartment' },
            { 
                data: null,
                render: function(data) {
                    return `${data.idType} ${data.idNumber}`;
                }
            },
            { data: 'phone' },
            { data: 'email' },
            {
                data: null,
                render: function(data) {
                    return `
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="viewOwner(${data.id})">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button type="button" class="btn btn-outline-secondary btn-sm" onclick="editOwner(${data.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteOwner(${data.id})">
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
document.getElementById('ownerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        idType: document.getElementById('idType').value,
        idNumber: document.getElementById('idNumber').value,
        birthDate: document.getElementById('birthDate').value,
        tower: document.getElementById('tower').value,
        apartment: document.getElementById('apartment').value
    };

    if (this.dataset.editId) {
        // Update existing owner
        const index = owners.findIndex(owner => owner.id === parseInt(this.dataset.editId));
        owners[index] = { ...owners[index], ...formData };
        delete this.dataset.editId;
    } else {
        // Add new owner
        owners.push(formData);
    }

    // Update table
    table.clear().rows.add(owners).draw();
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('ownerModal'));
    modal.hide();
    this.reset();

    // Show success alert
    Swal.fire({
        title: '¡Éxito!',
        text: 'Propietario guardado correctamente',
        icon: 'success',
        confirmButtonColor: '#198754',
        timer: 2000,
        timerProgressBar: true
    });
});

// View owner details
function viewOwner(id) {
    const owner = owners.find(o => o.id === id);
    Swal.fire({
        title: 'Detalles del Propietario',
        html: `
            <div class="text-start">
                <p><strong>Nombre:</strong> ${owner.firstName} ${owner.lastName}</p>
                <p><strong>Documento:</strong> ${owner.idType} ${owner.idNumber}</p>
                <p><strong>Fecha de Nacimiento:</strong> ${owner.birthDate}</p>
                <p><strong>Email:</strong> ${owner.email}</p>
                <p><strong>Teléfono:</strong> ${owner.phone}</p>
                <p><strong>Ubicación:</strong> Torre ${owner.tower} - Apto ${owner.apartment}</p>
            </div>
        `,
        confirmButtonText: 'Cerrar'
    });
}

// Edit owner
function editOwner(id) {
    const owner = owners.find(o => o.id === id);
    
    // Populate form
    document.getElementById('firstName').value = owner.firstName;
    document.getElementById('lastName').value = owner.lastName;
    document.getElementById('email').value = owner.email;
    document.getElementById('phone').value = owner.phone;
    document.getElementById('idType').value = owner.idType;
    document.getElementById('idNumber').value = owner.idNumber;
    document.getElementById('birthDate').value = owner.birthDate;
    document.getElementById('tower').value = owner.tower;
    document.getElementById('apartment').value = owner.apartment;

    // Set edit mode
    const form = document.getElementById('ownerForm');
    form.dataset.editId = id;

    // Update modal title
    const modal = document.getElementById('ownerModal');
    modal.querySelector('.modal-title').textContent = 'Editar Propietario';
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Delete owner
function deleteOwner(id) {
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
            owners = owners.filter(owner => owner.id !== id);
            table.clear().rows.add(owners).draw();
            
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El propietario ha sido eliminado.',
                icon: 'success',
                confirmButtonColor: '#198754',
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
}
