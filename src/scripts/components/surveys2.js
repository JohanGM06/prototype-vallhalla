  // Replace showToast with SweetAlert
  function showToast(message, type = 'success') {
    Swal.fire({
      title: type === 'success' ? 'Éxito' : 'Error',
      text: message,
      icon: type,
      confirmButtonText: 'Aceptar'
    });
  }

  // Update delete modal to use SweetAlert
  function showDeleteModal(surveyName, button) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea eliminar la encuesta "${surveyName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const card = button.closest('.col-md-4');
        card.remove();
        Swal.fire({
          title: '¡Eliminado!',
          text: 'La encuesta ha sido eliminada con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // Update close survey to use SweetAlert
  function closeSurvey(surveyId) {
    const card = document.querySelector(`[onclick="closeSurvey('${surveyId}')"]`).closest('.survey-card');
    const statusBadge = card.querySelector('.survey-status');
    
    if (statusBadge.classList.contains('active')) {
      Swal.fire({
        title: '¿Finalizar encuesta?',
        text: '¿Está seguro que desea finalizar esta encuesta?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          statusBadge.classList.remove('active');
          statusBadge.classList.add('closed');
          statusBadge.textContent = 'Cerrada';
          Swal.fire({
            title: '¡Finalizada!',
            text: 'La encuesta ha sido finalizada con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Información',
        text: 'Esta encuesta ya está cerrada',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  // Update download report to use SweetAlert
  document.getElementById('downloadReport').addEventListener('click', function() {
    Swal.fire({
      title: 'Descargando reporte',
      text: 'Por favor espere...',
      icon: 'info',
      showConfirmButton: false,
      timer: 1500
    });
  });

  // Create Survey Modal Functions
  function showCreateSurveyModal() {
    const modal = new bootstrap.Modal(document.getElementById('createSurveyModal'));
    modal.show();
  }

  function addQuestion(modalType = 'create') {
    const container = document.getElementById(modalType === 'create' ? 'questionsContainer' : 'editQuestionsContainer');
    const questionCount = container.children.length + 1;
    
    const questionTemplate = document.querySelector('.question-item').cloneNode(true);
    questionTemplate.querySelector('h6').textContent = `Pregunta #${questionCount}`;
    
    // Reset inputs
    questionTemplate.querySelectorAll('input').forEach(input => input.value = '');
    questionTemplate.querySelector('select').selectedIndex = 0;
    
    container.appendChild(questionTemplate);
  }

  function removeQuestion(button) {
    const container = button.closest('#questionsContainer, #editQuestionsContainer');
    if (container.children.length > 1) {
      button.closest('.question-item').remove();
      updateQuestionNumbers(container);
    }
  }

  function updateQuestionNumbers(container) {
    container.querySelectorAll('.question-item').forEach((item, index) => {
      item.querySelector('h6').textContent = `Pregunta #${index + 1}`;
    });
  }

  function handleQuestionTypeChange(select) {
    const questionItem = select.closest('.question-item');
    const optionsContainer = questionItem.querySelector('.options-container');
    
    optionsContainer.style.display = select.value === 'checkbox' ? 'block' : 'none';
  }

  function addOption(button) {
    const optionsList = button.previousElementSibling;
    const optionCount = optionsList.children.length + 1;
    
    const newOption = document.createElement('div');
    newOption.className = 'input-group mb-2';
    newOption.innerHTML = `
      <input type="text" class="form-control" placeholder="Opción ${optionCount}">
      <button class="btn btn-outline-danger" type="button" onclick="removeOption(this)">
        <i class="bi bi-dash-circle" aria-hidden="true"></i>
      </button>
    `;
    
    optionsList.appendChild(newOption);
  }

  function removeOption(button) {
    const optionsList = button.closest('.options-list');
    if (optionsList.children.length > 1) {
      button.closest('.input-group').remove();
    }
  }

  function saveSurvey() {
    // Collect form data
    const formData = {
      title: document.getElementById('surveyTitle').value,
      description: document.getElementById('surveyDescription').value,
      questions: []
    };

    // Collect questions data
    document.querySelectorAll('#questionsContainer .question-item').forEach((item, index) => {
      const question = {
        type: item.querySelector('.question-type').value,
        text: item.querySelector('.question-text').value,
        options: []
      };

      if (question.type === 'checkbox') {
        item.querySelectorAll('.options-list input').forEach(input => {
          question.options.push(input.value);
        });
      }

      formData.questions.push(question);
    });

    // In a real app, this would send the data to a server
    console.log('Survey Data:', formData);
    
    // Show success message
    showToast('Encuesta creada con éxito');
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('createSurveyModal')).hide();
    
    // Add new survey card
    addSurveyCard(formData);
  }

  function addSurveyCard(surveyData) {
    const container = document.querySelector('.row.mb-4');
    const newCard = document.createElement('div');
    newCard.className = 'col-md-4';
    newCard.innerHTML = `
      <article class="card survey-card h-100" data-survey-id="${surveyData.id}" data-questions='${JSON.stringify(surveyData.questions)}'>
        <div class="card-body p-4">
          <span class="survey-status active">Activa</span>
          <h2 class="card-title h5">${surveyData.title}</h2>
          <p class="card-text text-muted">${surveyData.description}</p>
          <div class="d-flex justify-content-between mt-4">
            <div>
              <button class="btn btn-sm btn-outline-primary me-2" onclick="showEditSurveyModal(${surveyData.id})">
                <i class="bi bi-pencil" aria-hidden="true"></i> Editar
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="showDeleteModal('${surveyData.title}', this)">
                <i class="bi bi-trash" aria-hidden="true"></i> Eliminar
              </button>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-info me-2" onclick="previewSurvey(${surveyData.id})">
                <i class="bi bi-eye" aria-hidden="true"></i> Vista previa
              </button>
              <button class="btn btn-sm btn-outline-success" onclick="closeSurvey(${surveyData.id})">
                <i class="bi bi-check-circle" aria-hidden="true"></i> Finalizar
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
    
    container.appendChild(newCard);
  }

  // Edit Survey Modal Functions
  function showEditSurveyModal(surveyId) {
    const card = document.querySelector(`[data-survey-id="${surveyId}"]`);
    if (!card) {
      showToast('No se encontró la encuesta', 'error');
      return;
    }

    const surveyData = {
      id: surveyId,
      title: card.querySelector('.card-title').textContent,
      description: card.querySelector('.card-text').textContent,
      questions: JSON.parse(card.dataset.questions || '[]')
    };

    const modal = new bootstrap.Modal(document.getElementById('editSurveyModal'));
    
    // Set form values
    document.getElementById('editSurveyTitle').value = surveyData.title;
    document.getElementById('editSurveyDescription').value = surveyData.description;
    
    // Clear existing questions
    const container = document.getElementById('editQuestionsContainer');
    container.innerHTML = '';
    
    // Add questions
    surveyData.questions.forEach((question, index) => {
      const questionHtml = `
        <div class="question-item border rounded p-3 mb-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="mb-0">Pregunta #${index + 1}</h6>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeQuestion(this)">
              <i class="bi bi-trash" aria-hidden="true"></i>
            </button>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Tipo de pregunta</label>
            <select class="form-select question-type" onchange="handleQuestionTypeChange(this)">
              <option value="text" ${question.type === 'text' ? 'selected' : ''}>Pregunta Abierta</option>
              <option value="checkbox" ${question.type === 'checkbox' ? 'selected' : ''}>Selección Multiple</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Pregunta</label>
            <input type="text" class="form-control question-text" value="${question.text}" required>
          </div>

          <div class="options-container" style="display: ${question.type === 'checkbox' ? 'block' : 'none'}">
            <label class="form-label">Opciones de respuesta</label>
            <div class="options-list">
              ${question.type === 'checkbox' ? question.options.map((option, optIndex) => `
                <div class="input-group mb-2">
                  <input type="text" class="form-control" value="${option}" placeholder="Opción ${optIndex + 1}">
                  <button class="btn btn-outline-danger" type="button" onclick="removeOption(this)">
                    <i class="bi bi-dash-circle" aria-hidden="true"></i>
                  </button>
                </div>
              `).join('') : ''}
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary" onclick="addOption(this)">
              <i class="bi bi-plus-circle" aria-hidden="true"></i> Agregar opción
            </button>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', questionHtml);
    });
    
    modal.show();
  }

  function updateSurvey() {
    const surveyId = document.querySelector('.survey-card[data-survey-id]').dataset.surveyId;
    const card = document.querySelector(`[data-survey-id="${surveyId}"]`);
    
    if (!card) {
      showToast('No se encontró la encuesta', 'error');
      return;
    }

    const formData = {
      title: document.getElementById('editSurveyTitle').value,
      description: document.getElementById('editSurveyDescription').value,
      questions: []
    };

    // Collect questions data
    document.querySelectorAll('#editQuestionsContainer .question-item').forEach((item, index) => {
      const question = {
        type: item.querySelector('.question-type').value,
        text: item.querySelector('.question-text').value,
        options: []
      };

      if (question.type === 'checkbox') {
        item.querySelectorAll('.options-list input').forEach(input => {
          question.options.push(input.value);
        });
      }

      formData.questions.push(question);
    });

    // Update the card data
    card.querySelector('.card-title').textContent = formData.title;
    card.querySelector('.card-text').textContent = formData.description;
    card.dataset.questions = JSON.stringify(formData.questions);

    // Show success message
    showToast('Encuesta actualizada con éxito');
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('editSurveyModal')).hide();
  }

  // Update the create survey button click handler
  document.querySelector('a[href="/src/pages/admin/surveys/crearEncuesta.html"]').onclick = function(e) {
    e.preventDefault();
    showCreateSurveyModal();
  };

  // Question Editing Functions
  let currentEditingQuestionIndex = -1;
  let currentEditingSurveyId = null;

  function showEditQuestionModal(surveyId, questionIndex) {
    currentEditingQuestionIndex = questionIndex;
    currentEditingSurveyId = surveyId;
    
    const modal = new bootstrap.Modal(document.getElementById('editQuestionModal'));
    const survey = getSurveyData(surveyId);
    const question = survey.questions[questionIndex];
    
    // Set form values
    document.getElementById('editQuestionType').value = question.type;
    document.getElementById('editQuestionText').value = question.text;
    
    // Handle options for multiple choice
    const optionsContainer = document.getElementById('editOptionsContainer');
    const optionsList = document.getElementById('editOptionsList');
    optionsList.innerHTML = '';
    
    if (question.type === 'checkbox') {
      optionsContainer.style.display = 'block';
      question.options.forEach(option => {
        addEditOption(option);
      });
    } else {
      optionsContainer.style.display = 'none';
    }
    
    modal.show();
  }

  function handleEditQuestionTypeChange() {
    const type = document.getElementById('editQuestionType').value;
    const optionsContainer = document.getElementById('editOptionsContainer');
    optionsContainer.style.display = type === 'checkbox' ? 'block' : 'none';
    
    if (type === 'checkbox' && document.getElementById('editOptionsList').children.length === 0) {
      addEditOption();
      addEditOption();
    }
  }

  function addEditOption(value = '') {
    const optionsList = document.getElementById('editOptionsList');
    const optionCount = optionsList.children.length + 1;
    
    const optionElement = document.createElement('div');
    optionElement.className = 'input-group mb-2';
    optionElement.innerHTML = `
      <input type="text" class="form-control" placeholder="Opción ${optionCount}" value="${value}">
      <button class="btn btn-outline-danger" type="button" onclick="removeEditOption(this)">
        <i class="bi bi-dash-circle" aria-hidden="true"></i>
      </button>
    `;
    
    optionsList.appendChild(optionElement);
  }

  function removeEditOption(button) {
    const optionsList = document.getElementById('editOptionsList');
    if (optionsList.children.length > 1) {
      button.closest('.input-group').remove();
    }
  }

  function saveQuestionEdit() {
    const type = document.getElementById('editQuestionType').value;
    const text = document.getElementById('editQuestionText').value;
    const options = [];
    
    if (type === 'checkbox') {
      document.querySelectorAll('#editOptionsList input').forEach(input => {
        options.push(input.value);
      });
    }
    
    const updatedQuestion = {
      type,
      text,
      options
    };
    
    // Update the question in the survey data
    updateSurveyQuestion(currentEditingSurveyId, currentEditingQuestionIndex, updatedQuestion);
    
    // Show success message
    showToast('Pregunta actualizada con éxito');
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('editQuestionModal')).hide();
  }

  function getSurveyData(surveyId) {
    // In a real app, this would fetch from a server
    // For now, we'll get it from the DOM
    const card = document.querySelector(`[data-survey-id="${surveyId}"]`);
    return {
      title: card.querySelector('.card-title').textContent,
      description: card.querySelector('.card-text').textContent,
      questions: JSON.parse(card.dataset.questions || '[]')
    };
  }

  function updateSurveyQuestion(surveyId, questionIndex, updatedQuestion) {
    const card = document.querySelector(`[data-survey-id="${surveyId}"]`);
    const surveyData = getSurveyData(surveyId);
    
    surveyData.questions[questionIndex] = updatedQuestion;
    card.dataset.questions = JSON.stringify(surveyData.questions);
    
    // Update preview if it's open
    if (document.getElementById('previewModal').classList.contains('show')) {
      previewSurvey(surveyId);
    }
  }

  // Update the preview function to show edit buttons
  function previewSurvey(surveyId) {
    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
    const previewContent = document.getElementById('previewContent');
    const survey = getSurveyData(surveyId);
    
    let questionsHtml = '';
    survey.questions.forEach((question, index) => {
      questionsHtml += `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="card-title mb-0">Pregunta #${index + 1}</h6>
              <button class="btn btn-sm btn-outline-primary" onclick="showEditQuestionModal('${surveyId}', ${index})">
                <i class="bi bi-pencil" aria-hidden="true"></i> Editar
              </button>
            </div>
            <p class="card-text">${question.text}</p>
            ${question.type === 'checkbox' ? `
              <div class="options-list">
                ${question.options.map(option => `
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" disabled>
                    <label class="form-check-label">${option}</label>
                  </div>
                `).join('')}
              </div>
            ` : `
              <input type="text" class="form-control" placeholder="Respuesta" disabled>
            `}
          </div>
        </div>
      `;
    });
    
    previewContent.innerHTML = `
      <div class="p-3">
        <h3>${survey.title}</h3>
        <p class="text-muted">${survey.description}</p>
        <div class="questions-container">
          ${questionsHtml}
        </div>
      </div>
    `;
    
    modal.show();
  }