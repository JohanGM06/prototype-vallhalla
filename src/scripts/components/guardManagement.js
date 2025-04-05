// Initial dummy data for demonstration
let guards = [
    {
        id: 1,
        name: "LOREM IPSUM 31",
        email: "LOREM@LOREM.COM",
        phone: "1234567890",
        idType: "CC",
        idNumber: "123456",
        arl: "COLPATRIA",
        eps: "NUEVA EPS",
        status: true,
        imageUrl: "/src/styles/img/person.jpg"
    }
];

// Current guard being edited
let currentGuardId = null;

// Function to render all guards
function renderGuards() {
    const guardsContainer = document.getElementById('guardsContainer');
    guardsContainer.innerHTML = guards.map(guard => `
        <div class="col-12 col-md-6 col-lg-3" data-guard-id="${guard.id}">
            <div class="card h-100 shadow-sm">
                <div class="text-center pt-3">
                    <img src="${guard.imageUrl}" 
                         class="rounded-circle" 
                         alt="${guard.name}"
                         style="width: 100px; height: 100px; object-fit: cover;" />
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h3 class="card-title h6 mb-1">${guard.name}</h3>
                        <span class="badge ${guard.status ? 'bg-success' : 'bg-danger'} rounded-pill">
                            ${guard.status ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <p class="card-text small mb-2">
                        <i class="bi bi-person-vcard"></i> ${guard.idType}: ${guard.idNumber}<br>
                        <i class="bi bi-envelope"></i> ${guard.email}<br>
                        <i class="bi bi-telephone"></i> ${guard.phone}
                    </p>
                    <div class="d-flex justify-content-between mt-2">
                        <button onclick="viewGuard(${guard.id})" class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editGuard(${guard.id})" class="btn btn-outline-warning btn-sm">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button onclick="deleteGuard(${guard.id})" class="btn btn-outline-danger btn-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle form submission
document.getElementById('guardForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        id: currentGuardId || Date.now(),
        name: document.getElementById('nombreCompleto').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('telefono').value,
        idType: document.getElementById('tipoId').value,
        idNumber: document.getElementById('numeroCedula').value,
        arl: document.getElementById('arl').value,
        eps: document.getElementById('eps').value,
        status: document.getElementById('guardStatus')?.checked ?? true,
        imageUrl: document.getElementById('guardPhoto').src
    };

    // Validate form data
    if (!validateFormData(formData)) {
        return;
    }

    try {
        if (currentGuardId) {
            // Update existing guard
            const index = guards.findIndex(g => g.id === currentGuardId);
            if (index === -1) throw new Error('Guard not found');
            guards[index] = { ...guards[index], ...formData };
            showSuccessMessage('Vigilante actualizado exitosamente');
        } else {
            // Add new guard
            guards.push(formData);
            showSuccessMessage('Vigilante creado exitosamente');
        }

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('guardModal'));
        modal.hide();
        resetForm();
        renderGuards();
    } catch (error) {
        console.error('Error saving guard:', error);
        Swal.fire('Error', 'Hubo un problema al guardar los datos', 'error');
    }
});

// Validate form data
function validateFormData(data) {
    let isValid = true;
    let errorMessage = '';

    // Name validation
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{3,50}$/.test(data.name)) {
        errorMessage = 'Ingrese un nombre válido (solo letras y espacios)';
        isValid = false;
    }

    // ID number validation
    if (!/^\d{6,12}$/.test(data.idNumber)) {
        errorMessage = 'Ingrese un número de identificación válido';
        isValid = false;
    }

    // Phone validation
    if (!/^\d{10}$/.test(data.phone)) {
        errorMessage = 'Ingrese un número de teléfono válido (10 dígitos)';
        isValid = false;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errorMessage = 'Ingrese un correo electrónico válido';
        isValid = false;
    }

    if (!isValid) {
        Swal.fire('Error', errorMessage, 'error');
    }

    return isValid;
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('is-invalid');
    
    // Create or update error message
    let errorDiv = field.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    errorDiv.textContent = message;
}

// Show success message using SweetAlert2
function showSuccessMessage(message) {
    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: message,
        showConfirmButton: false,
        timer: 1500
    });
}

// Reset form
function resetForm() {
    const form = document.getElementById('guardForm');
    form.reset();
    document.getElementById('guardPhoto').src = '/src/styles/img/person.jpg';
    document.getElementById('guardModalLabel').textContent = 'Añadir Vigilante';
    
    // Remove status toggle if it exists
    const statusToggle = document.getElementById('guardStatus')?.closest('.form-check');
    if (statusToggle) {
        statusToggle.remove();
    }

    // Update submit button text
    const submitButton = document.querySelector('#guardForm button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Crear';
    }
    
    currentGuardId = null;
    
    // Reset validation states
    form.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });
    form.querySelectorAll('.invalid-feedback').forEach(feedback => {
        feedback.remove();
    });
}

// Handle image upload
document.getElementById('imageUpload').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('guardPhoto').src = e.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    renderGuards();
    
    // Reset form when modal is hidden
    document.getElementById('guardModal').addEventListener('hidden.bs.modal', resetForm);
});

// Export functions for use in HTML
window.viewGuard = viewGuard;
window.editGuard = editGuard;
window.deleteGuard = deleteGuard;

// Function to view guard details
function viewGuard(id) {
    const guard = guards.find(g => g.id === id);
    if (!guard) return;

    currentGuardId = id;

    try {
        // Populate view data
        populateViewData(guard);
        
        // Show in view mode
        setViewMode();

        // Show modal
        const viewModal = new bootstrap.Modal(document.getElementById('viewGuardModal'));
        viewModal.show();

        // Add click handler for Editar Datos button
        const editButton = document.querySelector('#editDatosBtn');
        if (editButton) {
            // Remove any existing click handlers
            editButton.replaceWith(editButton.cloneNode(true));
            // Get the new button reference after cloning
            const newEditButton = document.querySelector('#editDatosBtn');
            // Add new click handler
            newEditButton.addEventListener('click', () => {
                populateEditForm(guard);
                setEditMode();
            });
        } else {
            console.error('Edit button not found');
        }

    } catch (error) {
        console.error('Error in viewGuard:', error);
        Swal.fire('Error', 'Hubo un problema al mostrar los datos', 'error');
    }
}

function populateViewData(guard) {
    document.getElementById('viewGuardPhoto').src = guard.imageUrl;
    document.getElementById('viewNombre').textContent = guard.name;
    document.getElementById('viewIdentificacion').textContent = `${guard.idType} ${guard.idNumber}`;
    document.getElementById('viewEmail').textContent = guard.email;
    document.getElementById('viewTelefono').textContent = guard.phone;
    document.getElementById('viewArl').textContent = guard.arl;
    document.getElementById('viewEps').textContent = guard.eps;
    
    const statusToggle = document.getElementById('viewStatus');
    if (statusToggle) {
        statusToggle.checked = guard.status;
        statusToggle.disabled = true; // Disabled in view mode
    }
}

function populateEditForm(guard) {
    document.getElementById('editNombre').value = guard.name;
    document.getElementById('editEmail').value = guard.email;
    document.getElementById('editTelefono').value = guard.phone;
    document.getElementById('editTipoId').value = guard.idType;
    document.getElementById('editNumeroId').value = guard.idNumber;
    document.getElementById('editArl').value = guard.arl;
    document.getElementById('editEps').value = guard.eps;
    
    const statusToggle = document.getElementById('viewStatus');
    if (statusToggle) {
        statusToggle.disabled = false; // Enable in edit mode
    }
}

function setViewMode() {
    document.querySelectorAll('.view-mode').forEach(el => el.classList.remove('d-none'));
    document.querySelectorAll('.edit-mode').forEach(el => el.classList.add('d-none'));
    document.getElementById('viewGuardModalLabel').textContent = 'DATOS BASICOS';
}

function setEditMode() {
    document.querySelectorAll('.view-mode').forEach(el => el.classList.add('d-none'));
    document.querySelectorAll('.edit-mode').forEach(el => el.classList.remove('d-none'));
    document.getElementById('viewGuardModalLabel').textContent = 'Editar Vigilante';
}

// Add event listeners for cancel and save buttons
document.addEventListener('DOMContentLoaded', function() {
    // Cancel button handler
    document.querySelector('#cancelEdit')?.addEventListener('click', () => {
        setViewMode();
    });

    // Save button handler
    document.querySelector('#saveEdit')?.addEventListener('click', () => {
        const guard = guards.find(g => g.id === currentGuardId);
        if (guard) {
            saveGuardChanges(guard);
        }
    });
});

function saveGuardChanges(guard) {
    const updatedData = {
        name: document.getElementById('editNombre').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editTelefono').value.trim(),
        idType: document.getElementById('editTipoId').value,
        idNumber: document.getElementById('editNumeroId').value.trim(),
        arl: document.getElementById('editArl').value.trim(),
        eps: document.getElementById('editEps').value.trim(),
        status: document.getElementById('viewStatus').checked
    };

    if (!validateFormData(updatedData)) return;

    try {
        // Update guard data
        Object.assign(guard, updatedData);

        // Update in main array
        const index = guards.findIndex(g => g.id === guard.id);
        if (index !== -1) {
            guards[index] = guard;
        }

        // Update view
        populateViewData(guard);
        setViewMode();
        renderGuards();

        showSuccessMessage('Datos actualizados exitosamente');
    } catch (error) {
        console.error('Error saving changes:', error);
        Swal.fire('Error', 'Hubo un problema al guardar los cambios', 'error');
    }
}

// Function to edit guard
function editGuard(id) {
    const guard = guards.find(g => g.id === id);
    if (!guard) {
        console.error('Guard not found');
        return;
    }

    currentGuardId = id;

    try {
        // Populate form fields with guard data
        const formFields = {
            'nombreCompleto': guard.name,
            'email': guard.email,
            'telefono': guard.phone,
            'tipoId': guard.idType,
            'numeroCedula': guard.idNumber,
            'arl': guard.arl,
            'eps': guard.eps
        };

        // Update all form fields
        Object.entries(formFields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value || '';
            }
        });

        // Set guard photo
        const photoElement = document.getElementById('guardPhoto');
        if (photoElement) {
            photoElement.src = guard.imageUrl;
        }

        // Set guard status
        const statusToggle = document.createElement('div');
        statusToggle.className = 'form-check form-switch mt-3';
        statusToggle.innerHTML = `
            <input class="form-check-input" type="checkbox" id="guardStatus" ${guard.status ? 'checked' : ''}>
            <label class="form-check-label" for="guardStatus">Estado del vigilante</label>
        `;

        // Add status toggle to form
        const form = document.getElementById('guardForm');
        form.appendChild(statusToggle);

        // Add status change listener
        document.getElementById('guardStatus').addEventListener('change', function(e) {
            guard.status = e.target.checked;
            renderGuards();
            showSuccessMessage(`Estado del vigilante ${guard.status ? 'activado' : 'desactivado'}`);
        });

        // Update modal title
        document.getElementById('guardModalLabel').textContent = 'Editar Vigilante';
        
        // Update submit button text
        const submitButton = document.querySelector('#guardForm button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Actualizar';
        }

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('guardModal'));
        modal.show();

    } catch (error) {
        console.error('Error in editGuard:', error);
        Swal.fire('Error', 'Hubo un problema al cargar los datos para editar', 'error');
    }
}

// Function to delete guard
function deleteGuard(id) {
    const guard = guards.find(g => g.id === id);
    document.getElementById('deleteGuardName').textContent = guard.name;

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();

    document.getElementById('confirmDelete').onclick = function() {
        guards = guards.filter(g => g.id !== id);
        deleteModal.hide();
        renderGuards();
        
        Swal.fire({
            title: '¡Eliminado!',
            text: 'Vigilante eliminado correctamente',
            icon: 'success',
            confirmButtonColor: '#198754'
        });
    };
}

// Initialize autocomplete for ARL and EPS
function initializeAutocomplete() {
    const arlInput = document.getElementById('arl');
    const epsInput = document.getElementById('eps');

    // ARL autocomplete
    arlInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const options = document.getElementById('arlOptions').options;
        let found = false;

        for (let option of options) {
            if (option.value.toLowerCase().startsWith(value)) {
                found = true;
                break;
            }
        }

        if (!found && value.length > 0) {
            this.setCustomValidity('Seleccione una ARL válida de la lista');
        } else {
            this.setCustomValidity('');
        }
    });

    // EPS autocomplete
    epsInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const options = document.getElementById('epsOptions').options;
        let found = false;

        for (let option of options) {
            if (option.value.toLowerCase().startsWith(value)) {
                found = true;
                break;
            }
        }

        if (!found && value.length > 0) {
            this.setCustomValidity('Seleccione una EPS válida de la lista');
        } else {
            this.setCustomValidity('');
        }
    });
}

// Add event listener for the edit form submission
document.addEventListener('DOMContentLoaded', function() {
    // Save button handler
    document.getElementById('saveEdit').addEventListener('click', function() {
        const guard = guards.find(g => g.id === currentGuardId);
        if (!guard) return;

        const updatedData = {
            name: document.getElementById('editNombre').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            phone: document.getElementById('editTelefono').value.trim(),
            idType: document.getElementById('editTipoId').value,
            idNumber: document.getElementById('editNumeroId').value.trim(),
            arl: document.getElementById('editArl').value.trim(),
            eps: document.getElementById('editEps').value.trim(),
            status: document.getElementById('editStatus').checked,
            imageUrl: document.getElementById('editGuardPhoto').src
        };

        // Validate the updated data
        if (!validateFormData(updatedData)) {
            return;
        }

        try {
            // Update guard data
            Object.assign(guard, updatedData);

            // Update in main array
            const index = guards.findIndex(g => g.id === currentGuardId);
            if (index !== -1) {
                guards[index] = guard;
            }

            // Update view
            populateViewData(guard);
            setViewMode();
            renderGuards();

            showSuccessMessage('Datos actualizados exitosamente');
        } catch (error) {
            console.error('Error saving changes:', error);
            Swal.fire('Error', 'Hubo un problema al guardar los cambios', 'error');
        }
    });

    // Cancel button handler
    document.getElementById('cancelEdit').addEventListener('click', function() {
        const guard = guards.find(g => g.id === currentGuardId);
        if (guard) {
            populateViewData(guard);
            setViewMode();
        }
    });
});