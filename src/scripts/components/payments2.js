document.addEventListener("DOMContentLoaded", function () {
    // Código de ordenación y búsqueda existente
    // ... existing code ...

    // Botón de editar desde el modal de vista
    document
      .getElementById("btnEditarDesdeVista")
      .addEventListener("click", function () {
        // Cerrar el modal de vista
        const viewModal = bootstrap.Modal.getInstance(
          document.getElementById("viewModal")
        );
        viewModal.hide();

        // Obtener el ID del pago
        const paymentId =
          document.getElementById("viewPaymentId").textContent;

        // Buscar la fila correspondiente en la tabla
        const table = document.getElementById("paymentsTable");
        let targetRow = null;

        for (let i = 1; i < table.rows.length; i++) {
          if (table.rows[i].cells[1].textContent === paymentId) {
            targetRow = table.rows[i];
            break;
          }
        }

        if (targetRow) {
          // Obtener datos de la fila
          const cells = targetRow.cells;
          const nombre = cells[2].textContent;
          const apellido = cells[3].textContent;
          const torre = cells[4].textContent;
          const casa = cells[5].textContent;
          const celular = cells[6].textContent;
          const estadoServicio =
            cells[7].querySelector(".badge").textContent;
          const email = cells[8].textContent;
          const estadoPago = cells[9].querySelector(".badge").textContent;

          // Llenar el modal de edición con los datos
          document.getElementById("editPaymentId").textContent = paymentId;
          document.getElementById("editNombre").value = nombre;
          document.getElementById("editApellido").value = apellido;
          document.getElementById("editTorre").value = torre;
          document.getElementById("editCasa").value = casa;
          document.getElementById("editCelular").value = celular;
          document.getElementById("editCorreo").value = email;

          // Seleccionar las opciones correctas en los selects
          document.getElementById("editEstadoServicio").value =
            estadoServicio;
          document.getElementById("editEstadoPago").value = estadoPago;

          // Guardar referencia a la fila para actualizar después
          document.getElementById("btnConfirmar").dataset.rowIndex =
            targetRow.rowIndex;

          // Mostrar el modal de edición
          const editModal = new bootstrap.Modal(
            document.getElementById("editModal")
          );
          editModal.show();
        }
      });

    // Funcionalidad para los botones de ver y editar
    const viewButtons = document.querySelectorAll(".btn-outline-secondary");
    const editButtons = document.querySelectorAll(".btn-outline-primary");

    // Modal de vista
    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const row = this.closest("tr");
        const cells = row.cells;

        // Obtener datos de la fila
        const paymentId = cells[1].textContent;
        const nombre = cells[2].textContent;
        const apellido = cells[3].textContent;
        const torre = cells[4].textContent;
        const casa = cells[5].textContent;
        const celular = cells[6].textContent;
        const estadoServicio = cells[7].querySelector(".badge").textContent;
        const email = cells[8].textContent;
        const estadoPago = cells[9].querySelector(".badge").textContent;

        // Llenar el modal con los datos
        document.getElementById("viewPaymentId").textContent = paymentId;
        document.getElementById("viewNombre").value = nombre;
        document.getElementById("viewApellido").value = apellido;
        document.getElementById("viewTorre").value = torre;
        document.getElementById("viewCasa").value = casa;
        document.getElementById("viewCelular").value = celular;
        document.getElementById("viewCorreo").value = email;

        // Configurar los estados con clases de estilo
        const estadoServicioElement =
          document.getElementById("viewEstadoServicio");
        estadoServicioElement.textContent = estadoServicio;
        estadoServicioElement.className = "estado-badge";
        estadoServicioElement.classList.add(
          estadoServicio === "activo" ? "estado-activo" : "estado-inactivo"
        );

        const estadoPagoElement = document.getElementById("viewEstadoPago");
        estadoPagoElement.textContent = estadoPago;
        estadoPagoElement.className = "estado-badge";
        estadoPagoElement.classList.add(
          estadoPago === "Pagado" ? "estado-pagado" : "estado-pendiente"
        );

        // Mostrar el modal
        const viewModal = new bootstrap.Modal(
          document.getElementById("viewModal")
        );
        viewModal.show();
      });
    });

    // Modal de edición
    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const row = this.closest("tr");
        const cells = row.cells;

        // Obtener datos de la fila
        const paymentId = cells[1].textContent;
        const nombre = cells[2].textContent;
        const apellido = cells[3].textContent;
        const torre = cells[4].textContent;
        const casa = cells[5].textContent;
        const celular = cells[6].textContent;
        const estadoServicio = cells[7].querySelector(".badge").textContent;
        const email = cells[8].textContent;
        const estadoPago = cells[9].querySelector(".badge").textContent;

        // Llenar el modal con los datos
        document.getElementById("editPaymentId").textContent = paymentId;
        document.getElementById("editNombre").value = nombre;
        document.getElementById("editApellido").value = apellido;
        document.getElementById("editTorre").value = torre;
        document.getElementById("editCasa").value = casa;
        document.getElementById("editCelular").value = celular;
        document.getElementById("editCorreo").value = email;

        // Seleccionar las opciones correctas en los selects
        document.getElementById("editEstadoServicio").value =
          estadoServicio;
        document.getElementById("editEstadoPago").value = estadoPago;

        // Guardar referencia a la fila para actualizar después
        document.getElementById("btnConfirmar").dataset.rowIndex =
          row.rowIndex;

        // Mostrar el modal
        const editModal = new bootstrap.Modal(
          document.getElementById("editModal")
        );
        editModal.show();
      });
    });

    // Botón de confirmar en el modal de edición
    document
      .getElementById("btnConfirmar")
      .addEventListener("click", function () {
        // Obtener los valores actualizados
        const estadoServicio =
          document.getElementById("editEstadoServicio").value;
        const estadoPago = document.getElementById("editEstadoPago").value;

        // Obtener la fila a actualizar
        const rowIndex = this.dataset.rowIndex;
        const table = document.getElementById("paymentsTable");
        const row = table.rows[rowIndex];

        // Actualizar los valores en la tabla
        const estadoServicioCell = row.cells[7];
        estadoServicioCell.innerHTML = `<span class="badge ${
          estadoServicio === "activo" ? "bg-success" : "bg-secondary"
        }">${estadoServicio}</span>`;

        const estadoPagoCell = row.cells[9];
        estadoPagoCell.innerHTML = `<span class="badge ${
          estadoPago === "Pagado" ? "badge-pagado" : "badge-pendiente"
        } rounded-pill">${estadoPago}</span>`;

        // Cerrar el modal
        const editModal = bootstrap.Modal.getInstance(
          document.getElementById("editModal")
        );
        editModal.hide();

        // Mostrar alerta de éxito
        alert(
          `Pago #${
            document.getElementById("editPaymentId").textContent
          } actualizado correctamente.`
        );

        document
          .getElementById("sidebarToggle")
          .addEventListener("click", function () {
            document
              .getElementById("sidebar")
              .classList.toggle("collapsed");
          });

        // Sorting functionality
        document.addEventListener("DOMContentLoaded", function () {
          const table = document.getElementById("paymentsTable");
          const headers = table.querySelectorAll("th.sortable");
          const tableBody = table.querySelector("tbody");
          const rows = tableBody.querySelectorAll("tr");

          // Add click event to sortable headers
          headers.forEach((header) => {
            header.addEventListener("click", () => {
              const column = header.dataset.sort;
              const isAsc = header.classList.contains("asc");

              // Remove sorting classes from all headers
              headers.forEach((h) => {
                h.classList.remove("asc", "desc");
              });

              // Add sorting class to clicked header
              header.classList.add(isAsc ? "desc" : "asc");

              // Get column index
              const columnIndex = Array.from(
                header.parentElement.children
              ).indexOf(header);

              // Sort the rows
              const sortedRows = Array.from(rows).sort((a, b) => {
                // Get text content, handling badges
                const aCell = a.children[columnIndex];
                const bCell = b.children[columnIndex];

                // Check if cell contains a badge
                const aValue = aCell.querySelector(".badge")
                  ? aCell.querySelector(".badge").textContent.trim()
                  : aCell.textContent.trim();

                const bValue = bCell.querySelector(".badge")
                  ? bCell.querySelector(".badge").textContent.trim()
                  : bCell.textContent.trim();

                // Check if values are numbers
                const aNum = parseFloat(aValue);
                const bNum = parseFloat(bValue);

                if (!isNaN(aNum) && !isNaN(bNum)) {
                  return isAsc ? aNum - bNum : bNum - aNum;
                }

                // Sort as strings
                return isAsc
                  ? aValue.localeCompare(bValue, "es", {
                      sensitivity: "base",
                    })
                  : bValue.localeCompare(aValue, "es", {
                      sensitivity: "base",
                    });
              });

              // Append sorted rows to table
              tableBody.innerHTML = "";
              sortedRows.forEach((row) => {
                tableBody.appendChild(row);
              });
            });
          });

          // Search functionality
          const searchInput = document.getElementById("searchInput");
          searchInput.addEventListener("keyup", function () {
            const searchValue = this.value.toLowerCase();

            Array.from(rows).forEach((row) => {
              let found = false;
              Array.from(row.cells).forEach((cell) => {
                const text = cell.textContent.toLowerCase();
                if (text.includes(searchValue)) {
                  found = true;
                }
              });

              row.style.display = found ? "" : "none";
            });
          });
        });
      });
  });