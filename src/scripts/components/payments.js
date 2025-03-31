    // Simple search function
    function filterPayments(searchText) {
      const tbody = document.querySelector('table tbody');
      const rows = tbody.getElementsByTagName('tr');
      let found = false;

      for (let row of rows) {
        const idCell = row.cells[0].textContent.toLowerCase();
        const serviceCell = row.cells[0].querySelector('small').textContent.toLowerCase();
        const searchLower = searchText.toLowerCase();

        if (idCell.includes(searchLower) || serviceCell.includes(searchLower)) {
          row.style.display = '';
          found = true;
        } else {
          row.style.display = 'none';
        }
      }

      // Show message if no results found
      if (!found && searchText) {
        Swal.fire({
          icon: 'info',
          title: 'Sin Resultados',
          text: 'No se encontraron pagos que coincidan con su búsqueda',
          confirmButtonColor: '#0d6efd',
          timer: 2000
        });
      }
    }

    // Simple payment processing
    function togglePaymentForm() {
      const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
      const cardForm = document.getElementById('cardPaymentForm');
      const pseForm = document.getElementById('psePaymentForm');
      const installmentsSection = document.getElementById('installmentsSection');

      // Reset validation state when switching forms
      cardForm.classList.remove('was-validated');
      pseForm.classList.remove('was-validated');

      if (selectedMethod === 'pse') {
        cardForm.classList.add('d-none');
        pseForm.classList.remove('d-none');
      } else {
        cardForm.classList.remove('d-none');
        pseForm.classList.add('d-none');
        // Show installments only for credit card
        installmentsSection.style.display = selectedMethod === 'credit' ? 'block' : 'none';
      }
    }

    // Function to validate form fields using Bootstrap's built-in validation
    function validateForm(formElement) {
      if (!formElement.checkValidity()) {
        formElement.classList.add('was-validated');
        return false;
      }
      return true;
    }

    // Function to handle payment processing
    function procesarPago() {
      // Get the selected payment method and corresponding form
      const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
      const activeForm = selectedMethod === 'pse' 
        ? document.getElementById('psePaymentForm')
        : document.getElementById('cardPaymentForm');

      // Get the payment row that triggered the modal
      const paymentButton = document.querySelector('[data-bs-target="#payuModal"]');
      const paymentRow = paymentButton.closest('tr');
      
      // Get payment details from the row
      const paymentId = paymentRow.querySelector('td:first-child').textContent.split('\n')[0];
      const serviceType = paymentRow.querySelector('small.text-muted').textContent.replace(/[()]/g, '');
      const amount = paymentRow.querySelector('td:nth-child(2)').textContent;
      const date = paymentRow.querySelector('td:nth-child(3)').textContent;

      // Validate form before proceeding
      if (!validateForm(activeForm)) {
        Swal.fire({
          icon: 'error',
          title: 'Error de Validación',
          text: 'Por favor complete todos los campos correctamente',
          confirmButtonColor: '#dc3545'
        });
        return;
      }

      // Show loading state with Swal
      Swal.fire({
        title: 'Procesando Pago',
        html: 'Por favor espere...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Simulate payment processing
      setTimeout(() => {
        // Hide PayU modal
        const payuModal = document.getElementById('payuModal');
        if (payuModal) {
          const modal = bootstrap.Modal.getInstance(payuModal);
          if (modal) {
            modal.hide();
          }
        }

        // Update the payment row status and button
        updatePaymentStatus(paymentRow, paymentId, serviceType, amount, date);

        // Show success message
        Swal.fire({
          icon: 'success',
          title: '¡Pago Exitoso!',
          text: 'Su pago ha sido procesado correctamente',
          confirmButtonColor: '#198754'
        });
      }, 2000);
    }

    // Function to update payment status in the UI
    function updatePaymentStatus(row, id, service, amount, date) {
      // Update status badge
      const statusCell = row.querySelector('td:nth-child(4)');
      statusCell.innerHTML = '<span class="badge bg-success">Pagado</span>';

      // Update action button
      const actionCell = row.querySelector('td:last-child');
      actionCell.innerHTML = `
        <button class="btn btn-outline-success btn-sm" onclick="showReceipt('${id}', '${service}', '${amount}', '${date}')">
          <i class="bi bi-file-text"></i> Ver Comprobante
        </button>
      `;
    }

    // Function to show receipt details
    function showReceipt(id, service, amount, date) {
      // Update receipt modal with payment details
      document.getElementById('receiptId').textContent = id;
      document.getElementById('receiptService').textContent = service;
      document.getElementById('receiptAmount').textContent = amount;
      document.getElementById('receiptDate').textContent = date;

      // Show the receipt modal
      const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
      receiptModal.show();
    }

    // Function to handle receipt download
    function downloadReceipt() {
      const id = document.getElementById('receiptId').textContent;
      
      Swal.fire({
        title: 'Descargando Comprobante',
        html: 'Preparando su documento...',
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        }
      }).then(() => {
        // Get receipt details
        const service = document.getElementById('receiptService').textContent;
        const amount = document.getElementById('receiptAmount').textContent;
        const date = document.getElementById('receiptDate').textContent;

        // Create receipt content
        const receiptContent = `
          COMPROBANTE DE PAGO
          ------------------
          ID: ${id}
          Servicio: ${service}
          Monto: ${amount}
          Fecha: ${date}
          Estado: Pagado
          ------------------
        `;

        // Create blob and download link
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprobante_${id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        Swal.fire({
          icon: 'success',
          title: 'Comprobante Descargado',
          text: 'El comprobante se ha descargado exitosamente',
          confirmButtonColor: '#198754',
          timer: 2000
        });
      });
    }
    
    