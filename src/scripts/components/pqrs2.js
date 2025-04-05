<script>
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
            console.log("loaded")
        });
        // Initialize tooltips and modal
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize tooltips
            let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            });
        });
    
        function toggleResponse(button) {
            const responseForm = document.getElementById('responseForm');
            const responseFormContent = document.getElementById('responseFormContent');
            const state = button.getAttribute('data-state');
            
            if (state === 'initial') {
                // Show the form
                new bootstrap.Collapse(responseForm).show();
                button.setAttribute('data-state', 'responding');
                button.textContent = 'Enviar';
            } else {
                // Handle form submission
                const textarea = document.getElementById('responseText');
                
                if (!responseFormContent.checkValidity()) {
                    responseFormContent.classList.add('was-validated');
                    return;
                }

                // Using SweetAlert2 for confirmation
                Swal.fire({
                    title: '¿Está seguro?',
                    text: '¿Desea enviar esta respuesta?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, enviar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Respuesta enviada correctamente',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            // Close the modal after success
                            const modal = document.getElementById('viewModal');
                            const modalInstance = bootstrap.Modal.getInstance(modal);
                            modalInstance.hide();
                        });
                    }
                });
            }
        }
    </script>