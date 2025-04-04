// Sample data structure for pets
const pets = [{
    id: 1,
    name: "Luna",
    species: "Perro",
    breed: "Golden Retriever",
    owner: "Juan Pérez - Apto 101",
    vaccineCard: "vacunas_luna.pdf",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    ownerId: 1
}];

// DOM Elements
const petForm = document.getElementById('petForm');
const petsContainer = document.getElementById('petsContainer');
const modalTitle = document.getElementById('modalTitle');
const addPetModal = document.getElementById('addPetModal');
const viewPetModal = document.getElementById('viewPetModal');

// Form Elements
const formElements = {
    id: document.getElementById('petId'),
    name: document.getElementById('petName'),
    species: document.getElementById('petSpecies'),
    breed: document.getElementById('petBreed'),
    owner: document.getElementById('petOwner'),
    vaccineCard: document.getElementById('petVaccineCard'),
    image: document.getElementById('petImage')
};

// Render Functions
function renderPetCard(pet) {
    return `
        <div class="col">
            <div class="card h-100 shadow-sm">
                <img src="${pet.image}" class="card-img-top" alt="${pet.name}" 
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${pet.name}</h5>
                    <p class="card-text">
                        <strong>Especie:</strong> ${pet.species}<br>
                        <strong>Raza:</strong> ${pet.breed}<br>
                        <strong>Propietario:</strong> ${pet.owner}
                    </p>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <div class="btn-group w-100" role="group">
                        <button class="btn btn-outline-primary" onclick="viewPet(${pet.id})" title="Ver detalles">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-outline-secondary" onclick="editPet(${pet.id})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deletePet(${pet.id})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderPetDetails(pet) {
    return `
        <div class="text-center mb-4">
            <img src="${pet.image}" alt="${pet.name}" 
                 style="max-width: 200px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        </div>
        <dl class="row">
            <dt class="col-sm-4">Nombre</dt>
            <dd class="col-sm-8">${pet.name}</dd>
            <dt class="col-sm-4">Especie</dt>
            <dd class="col-sm-8">${pet.species}</dd>
            <dt class="col-sm-4">Raza</dt>
            <dd class="col-sm-8">${pet.breed}</dd>
            <dt class="col-sm-4">Propietario</dt>
            <dd class="col-sm-8">${pet.owner}</dd>
            <dt class="col-sm-4">Carnet de Vacunas</dt>
            <dd class="col-sm-8">
                <a href="#" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-file-earmark-pdf me-1"></i>Ver documento
                </a>
            </dd>
        </dl>
    `;
}

function renderPets() {
    petsContainer.innerHTML = pets.map(pet => renderPetCard(pet)).join('');
}

// CRUD Operations
function savePet() {
    const form = document.getElementById('petForm');
    
    if (!form.checkValidity()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor complete todos los campos requeridos'
        });
        return;
    }

    const newPet = {
        id: document.getElementById('petId').value || Date.now(),
        name: document.getElementById('petName').value,
        species: document.getElementById('petSpecies').value,
        breed: document.getElementById('petBreed').value,
        owner: document.getElementById('petOwner').options[document.getElementById('petOwner').selectedIndex].text,
        ownerId: document.getElementById('petOwner').value
    };

    // File validation
    const imageFile = document.getElementById('petImage').files[0];
    const vaccineFile = document.getElementById('petVaccineCard').files[0];

    // Basic file validation
    if (imageFile && !imageFile.type.startsWith('image/')) {
        Swal.fire({
            icon: 'error',
            text: 'Por favor seleccione un archivo de imagen válido'
        });
        return;
    }

    if (vaccineFile && !['application/pdf', 'image/jpeg', 'image/png'].includes(vaccineFile.type)) {
        Swal.fire({
            icon: 'error',
            text: 'Por favor seleccione un archivo PDF o imagen para el carnet de vacunas'
        });
        return;
    }

    // Add files to pet object if they exist
    if (imageFile) {
        newPet.image = URL.createObjectURL(imageFile);
    }
    if (vaccineFile) {
        newPet.vaccineCard = vaccineFile.name;
    }

    const existingPetIndex = pets.findIndex(p => p.id == newPet.id);
    if (existingPetIndex >= 0) {
        pets[existingPetIndex] = { ...pets[existingPetIndex], ...newPet };
    } else {
        pets.push(newPet);
    }

    renderPets();
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById('addPetModal')).hide();
    
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Mascota guardada correctamente',
        timer: 1500
    });
}

function viewPet(id) {
    const pet = pets.find(p => p.id == id);
    if (!pet) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Mascota no encontrada',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    document.getElementById('petDetails').innerHTML = renderPetDetails(pet);
    new bootstrap.Modal(viewPetModal).show();
}

function editPet(id) {
    const pet = pets.find(p => p.id == id);
    if (!pet) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Mascota no encontrada',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    formElements.id.value = pet.id;
    formElements.name.value = pet.name;
    formElements.species.value = pet.species;
    formElements.breed.value = pet.breed;
    formElements.owner.value = pet.ownerId;

    modalTitle.textContent = 'Editar Mascota';
    
    const modal = new bootstrap.Modal(addPetModal);
    modal.show();
}

function deletePet(id) {
    const pet = pets.find(p => p.id == id);
    if (!pet) return;

    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea eliminar a ${pet.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const index = pets.findIndex(p => p.id == id);
            if (index > -1) {
                pets.splice(index, 1);
                renderPets();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: `${pet.name} ha sido eliminado correctamente`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        }
    });
}

// Utility Functions
function resetForm() {
    petForm.reset();
    petForm.classList.remove('was-validated');
    formElements.id.value = '';
    modalTitle.textContent = 'Agregar Mascota';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderPets();
    
    // Reset form when modal is hidden
    addPetModal.addEventListener('hidden.bs.modal', resetForm);
    
    // Preview image when selected
    formElements.image.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // You could add image preview functionality here
                console.log('Imagen seleccionada:', e.target.result);
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Add validation alerts for file uploads
    formElements.image.addEventListener('change', function() {
        if (this.files[0]) {
            const fileSize = this.files[0].size / 1024 / 1024; // in MB
            if (fileSize > 5) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo muy grande',
                    text: 'La imagen debe ser menor a 5MB'
                });
                this.value = '';
            }
        }
    });

    formElements.vaccineCard.addEventListener('change', function() {
        if (this.files[0]) {
            const fileSize = this.files[0].size / 1024 / 1024; // in MB
            if (fileSize > 10) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo muy grande',
                    text: 'El documento debe ser menor a 10MB'
                });
                this.value = '';
            }
        }
    });

    // Add form validation alert
    function showValidationError() {
        Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            text: 'Por favor complete todos los campos requeridos correctamente',
            timer: 2000,
            showConfirmButton: false
        });
    }
});