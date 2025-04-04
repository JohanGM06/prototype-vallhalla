// Función ultra-simplificada de búsqueda con sugerencias
function showSuggestions(query) {
    query = query.toLowerCase().trim();
    const resultsBox = document.getElementById('searchResults');
    const cards = document.querySelectorAll('.card');
    
    if (query.length < 2) {
      resultsBox.style.display = 'none';
      cards.forEach(card => card.closest('.col').style.display = '');
      return;
    }
    
    let html = '';
    let count = 0;
    
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const title = card.querySelector('.card-header').textContent;
      const cardCol = card.closest('.col');
      
      if (text.includes(query)) {
        cardCol.style.display = '';
        
        if (count < 3) {
          // Color simplificado basado en el texto del encabezado
          const bgClass = count === 0 ? 'bg-light' : (count === 1 ? 'bg-primary text-white' : 'bg-info text-white');
          
          html += `<div class="p-2 border-bottom ${bgClass}" onclick="document.querySelector('${card.getAttribute('data-bs-target')}').classList.add('show'); document.getElementById('searchResults').style.display='none';" style="cursor:pointer;">
            ${title}
          </div>`;
          count++;
        }
      } else {
        cardCol.style.display = 'none';
      }
    });
    
    resultsBox.innerHTML = html;
    resultsBox.style.display = count > 0 ? 'block' : 'none';
    
    // Cerrar sugerencias al hacer clic fuera
    document.onclick = function(e) {
      if (e.target.id !== 'searchAnnouncements' && e.target.id !== 'searchResults') {
        resultsBox.style.display = 'none';
      }
    };
  }