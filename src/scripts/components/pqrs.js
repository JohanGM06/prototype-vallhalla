// Sample data structure for PQRS with one example
let pqrsData = [{
    id: 1,
    subject: "Ascensor no funciona",
    category: "reclamo",
    description: "El ascensor del bloque A no está funcionando desde hace 2 días.",
    date: "2024-03-15",
    status: "En Proceso",
    lastUpdate: "2024-03-16",
    responses: [
        {
            id: 1,
            author: "Administración",
            content: "Hemos contactado al servicio técnico del ascensor. Realizarán la revisión mañana a primera hora.",
            date: "2024-03-15 14:30",
            isAdmin: true
        },
        {
            id: 2,
            author: "Servicio Técnico",
            content: "Se identificó un problema en el sistema eléctrico. Se requiere el reemplazo de una pieza que será instalada en las próximas 24 horas.",
            date: "2024-03-16 09:15",
            isAdmin: true
        }
    ]
}];

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the form validation
    const form = document.getElementById('pqrsForm');
    const submitButton = document.getElementById('submitPQRS');

    // Handle form submission
    submitButton.addEventListener('click', function() {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        // Get form data
        const pqrs = {
            id: Date.now(),
            subject: document.getElementById('subject').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            date: new Date().toLocaleDateString(),
            status: 'Pendiente'
        };

        // Add to data array
        pqrsData.push(pqrs);
        
        // Update table
        updatePQRSTable();
        
        // Reset and close form
        form.reset();
        form.classList.remove('was-validated');
        bootstrap.Modal.getInstance(document.getElementById('createPQRSModal')).hide();

        // Show success message
        Swal.fire({
            title: '¡Éxito!',
            text: 'PQRS creado correctamente',
            icon: 'success'
        });
    });

    // Initialize table
    updatePQRSTable();
});

// Function to update the PQRS table
function updatePQRSTable() {
    const tableBody = document.getElementById('pqrsTableBody');
    tableBody.innerHTML = '';

    if (pqrsData.length === 0) {
        // Show no records message
        const noRecordsRow = document.createElement('tr');
        noRecordsRow.innerHTML = `
            <td colspan="6" class="text-center py-4">
                <i class="bi bi-inbox fs-1 d-block mb-2 text-muted"></i>
                <p class="text-muted">No hay PQRS registrados</p>
            </td>
        `;
        tableBody.appendChild(noRecordsRow);
        return;
    }

    pqrsData.forEach(pqrs => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pqrs.id}</td>
            <td>${pqrs.subject}</td>
            <td>${formatCategory(pqrs.category)}</td>
            <td>${pqrs.date}</td>
            <td>${getStatusBadge(pqrs.status)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewPQRS(${pqrs.id})">
                    <i class="bi bi-eye"></i> Ver
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to format category names
function formatCategory(category) {
    const categories = {
        'peticion': 'Petición',
        'queja': 'Queja',
        'reclamo': 'Reclamo',
        'sugerencia': 'Sugerencia'
    };
    return categories[category] || category;
}

// Function to view PQRS details
function viewPQRS(id) {
    const pqrs = pqrsData.find(p => p.id === id);
    if (pqrs) {
        // Update PQRS details
        document.getElementById('viewSubject').textContent = pqrs.subject;
        document.getElementById('viewCategory').textContent = formatCategory(pqrs.category);
        document.getElementById('viewDescription').textContent = pqrs.description;
        document.getElementById('viewStatus').textContent = pqrs.status;
        document.getElementById('viewDate').textContent = pqrs.date;
        document.getElementById('viewLastUpdate').textContent = pqrs.lastUpdate || pqrs.date;

        // Update responses
        const responsesContainer = document.getElementById('responsesList');
        responsesContainer.innerHTML = '';

        if (pqrs.responses && pqrs.responses.length > 0) {
            pqrs.responses.forEach(response => {
                const responseElement = document.createElement('div');
                responseElement.className = `response-item ${response.isAdmin ? 'admin' : ''}`;
                responseElement.innerHTML = `
                    <div class="response-header">
                        <span class="response-author">${response.author}</span>
                        <span class="response-date">${response.date}</span>
                    </div>
                    <div class="response-content">
                        ${response.content}
                    </div>
                `;
                responsesContainer.appendChild(responseElement);
            });
        } else {
            responsesContainer.innerHTML = `
                <div class="no-responses">
                    <i class="bi bi-chat-dots mb-2 d-block"></i>
                    <p>Aún no hay respuestas para este PQRS</p>
                </div>
            `;
        }

        const viewModal = new bootstrap.Modal(document.getElementById('viewPQRSModal'));
        viewModal.show();
    }
}

// Add a function to get the appropriate status badge
function getStatusBadge(status) {
    const badges = {
        'Pendiente': 'bg-warning',
        'En Proceso': 'bg-info',
        'Resuelto': 'bg-success',
        'Cerrado': 'bg-secondary'
    };
    const badgeClass = badges[status] || 'bg-warning';
    return `<span class="badge ${badgeClass}">${status}</span>`;
}
