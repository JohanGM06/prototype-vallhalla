<script>
// Handle notification form submission
function handleNotificationSubmit() {
    const form = document.getElementById('notificationForm');
    const formData = {
        title: document.getElementById('notificationTitle').value,
        type: document.getElementById('notificationType').value,
        body: document.getElementById('notificationBody').value,
        recipients: document.getElementById('notificationRecipients').value
    };

    // Here you would typically send the data to your backend
    console.log('Notification data:', formData);

    // Show success message
    alert('Notificación creada exitosamente');

    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('createNotificationModal'));
    modal.hide();
    form.reset();
}

// Load notifications table data (example)
document.addEventListener('DOMContentLoaded', function () {
    const mockNotifications = [
        { title: 'Mantenimiento ascensores', type: 'maintenance', date: '2024-03-15', status: 'active' },
        { title: 'Reunión de copropietarios', type: 'info', date: '2024-03-14', status: 'scheduled' }
    ];

    const tbody = document.getElementById('notificationsTableBody');
    mockNotifications.forEach(notification => {
        tbody.innerHTML += `
            <tr>
                <td>${notification.title}</td>
                <td><span class="badge bg-${notification.type === 'maintenance' ? 'warning' : 'info'}">${notification.type}</span></td>
                <td>${notification.date}</td>
                <td><span class="badge bg-${notification.status === 'active' ? 'success' : 'primary'}">${notification.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" title="Editar"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" title="Eliminar"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });
});

// Toggle Script
document.getElementById('sidebarToggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('collapsed');
});
window.addEventListener('resize', () => {
    if (window.innerWidth < 992) { // Less than lg
        const sidebar = document.getElementById('sidebar');
        if (!sidebar.classList.contains('collapsed')) {
            sidebar.classList.toggle('collapsed');
        }
    }
});
</script>