
function submitSurvey(surveyId) {
  const form = document.getElementById(`surveyForm${surveyId}`);
  
  // Simple validation checking required fields
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (field.type === 'radio') {
      const groupName = field.name;
      const checked = form.querySelector(`input[name="${groupName}"]:checked`);
      if (!checked) {
        isValid = false;
        field.closest('.card').classList.add('border-danger');
      } else {
        field.closest('.card').classList.remove('border-danger');
      }
    } else if (!field.value.trim()) {
      isValid = false;
      field.classList.add('is-invalid');
    } else {
      field.classList.remove('is-invalid');
    }
  });

  if (!isValid) {
    Swal.fire({
      icon: 'error',
      title: 'Por favor complete todos los campos requeridos',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  Swal.fire({
    title: '¿Enviar encuesta?',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const modal = bootstrap.Modal.getInstance(document.getElementById(`surveyModal${surveyId}`));
      modal.hide();
      
      // Update card state after successful submission
      const card = document.getElementById(`surveyCard${surveyId}`);
      const badge = document.getElementById(`surveyBadge${surveyId}`);
      const button = document.getElementById(`surveyButton${surveyId}`);
      
      // Change badge state
      badge.className = 'badge bg-secondary';
      badge.textContent = 'Ya respondida';
      
      // Disable button and change its appearance
      button.className = 'btn btn-secondary';
      button.textContent = 'Respondida';
      button.disabled = true;
      button.removeAttribute('data-bs-toggle');
      button.removeAttribute('data-bs-target');
      
      // Add visual indication that the card is completed
      card.classList.add('opacity-75');
      
      Swal.fire('¡Gracias por completar la encuesta!', '', 'success');
    }
  });
}
