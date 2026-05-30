/**
 * Custom Dropdown System
 * Reemplaza select nativos por dropdowns personalizados con estilo consistente
 */

class CustomDropdown {
  constructor(selectElement) {
    this.selectElement = selectElement;
    this.container = null;
    this.button = null;
    this.menu = null;
    this.isOpen = false;
    this.selectedValue = selectElement.value;
    this.selectedLabel = this.getSelectedLabel();
    
    this.init();
  }

  init() {
    // Si ya existe un container, destruirlo
    if (this.selectElement._customDropdownContainer) {
      this.selectElement._customDropdownContainer.remove();
    }

    // Crear estructura HTML del dropdown custom
    this.container = document.createElement('div');
    this.container.className = 'custom-dropdown-container';
    this.container.setAttribute('data-select-id', this.selectElement.id);

    // Botón que actúa como trigger
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'custom-dropdown-button';
    this.button.innerHTML = `
      <span class="dropdown-label">${this.selectedLabel}</span>
      <svg class="dropdown-icon" viewBox="0 0 12 8" width="12" height="8">
        <path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Menú desplegable
    this.menu = document.createElement('div');
    this.menu.className = 'custom-dropdown-menu';
    this.renderOptions();

    // Agregar elementos al contenedor
    this.container.appendChild(this.button);
    this.container.appendChild(this.menu);

    // Insertar el contenedor personalizado antes del select original
    this.selectElement.parentNode.insertBefore(this.container, this.selectElement);
    this.selectElement.style.display = 'none';

    // Guardar referencia al contenedor
    this.selectElement._customDropdownContainer = this.container;
    this.selectElement._customDropdown = this;

    // Event listeners
    this.attachEventListeners();
  }

  renderOptions() {
    this.menu.innerHTML = '';
    const options = Array.from(this.selectElement.querySelectorAll('option'));
    
    options.forEach((option, index) => {
      const item = document.createElement('div');
      item.className = 'custom-dropdown-item';
      if (option.value === this.selectedValue) {
        item.classList.add('selected');
      }
      item.setAttribute('data-value', option.value);
      item.textContent = option.textContent;
      item.tabIndex = 0;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectOption(option.value, option.textContent);
      });

      this.menu.appendChild(item);
    });
  }

  selectOption(value, label) {
    // Actualizar el select original
    this.selectElement.value = value;
    this.selectedValue = value;
    this.selectedLabel = label;

    // Actualizar UI
    this.button.querySelector('.dropdown-label').textContent = label;
    
    // Actualizar visual de selección en el menú
    document.querySelectorAll(`[data-select-id="${this.selectElement.id}"] .custom-dropdown-item`).forEach(item => {
      item.classList.remove('selected');
    });
    document.querySelector(`[data-select-id="${this.selectElement.id}"] .custom-dropdown-item[data-value="${value}"]`)?.classList.add('selected');

    // Disparar evento change en el select original para que app.js lo detecte
    const event = new Event('change', { bubbles: true });
    this.selectElement.dispatchEvent(event);

    // Cerrar menú
    this.close();
  }

  getSelectedLabel() {
    const selectedOption = this.selectElement.querySelector(`option[value="${this.selectElement.value}"]`);
    return selectedOption ? selectedOption.textContent : 'Seleccionar...';
  }

  open() {
    if (this.isOpen) return;
    
    // Cerrar otros dropdowns
    document.querySelectorAll('.custom-dropdown-container').forEach(container => {
      const dropdown = container._customDropdown;
      if (dropdown && dropdown !== this) {
        dropdown.close();
      }
    });

    this.isOpen = true;
    this.menu.classList.add('active');
    this.button.classList.add('active');
    
    // Asegurar que el menú sea visible dentro del viewport
    setTimeout(() => this.adjustMenuPosition(), 0);
  }

  close() {
    this.isOpen = false;
    this.menu.classList.remove('active');
    this.button.classList.remove('active');
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  attachEventListeners() {
    // Guardar referencia al dropdown en el contenedor
    this.container._customDropdown = this;

    // Click en el botón
    this.button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Click fuera del dropdown
    const outsideClickHandler = (e) => {
      if (!this.container.contains(e.target)) {
        this.close();
      }
    };
    document.addEventListener('click', outsideClickHandler);

    // Tecla Escape
    const escapeKeyHandler = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };
    document.addEventListener('keydown', escapeKeyHandler);

    // Navegación con teclado en el botón
    this.button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.open();
        setTimeout(() => this.focusFirstItem(), 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.open();
        setTimeout(() => this.focusLastItem(), 0);
      }
    });

    // Navegación en el menú
    this.menu.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.focusNextItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.focusPreviousItem();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const focused = this.menu.querySelector('.custom-dropdown-item:focus');
        if (focused) {
          focused.click();
        }
      }
    });

    // Guardar handlers para posible limpieza futura
    this._outsideClickHandler = outsideClickHandler;
    this._escapeKeyHandler = escapeKeyHandler;
  }

  focusFirstItem() {
    const firstItem = this.menu.querySelector('.custom-dropdown-item');
    firstItem?.focus();
  }

  focusLastItem() {
    const items = Array.from(this.menu.querySelectorAll('.custom-dropdown-item'));
    items[items.length - 1]?.focus();
  }

  focusNextItem() {
    const items = Array.from(this.menu.querySelectorAll('.custom-dropdown-item'));
    const currentIndex = items.findIndex(item => item === document.activeElement);
    const nextIndex = currentIndex + 1 < items.length ? currentIndex + 1 : 0;
    items[nextIndex]?.focus();
  }

  focusPreviousItem() {
    const items = Array.from(this.menu.querySelectorAll('.custom-dropdown-item'));
    const currentIndex = items.findIndex(item => item === document.activeElement);
    const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : items.length - 1;
    items[prevIndex]?.focus();
  }

  adjustMenuPosition() {
    const buttonRect = this.button.getBoundingClientRect();
    const menuRect = this.menu.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Si el menú se sale por abajo, ponerlo arriba
    if (buttonRect.bottom + menuRect.height > viewportHeight - 20) {
      this.menu.style.bottom = `calc(100% + 8px)`;
      this.menu.style.top = 'auto';
    } else {
      this.menu.style.top = 'calc(100% + 8px)';
      this.menu.style.bottom = 'auto';
    }
  }

  updateOptions() {
    // Actualizar las opciones del menú si cambiaron en el select original
    this.selectedValue = this.selectElement.value;
    this.selectedLabel = this.getSelectedLabel();
    this.renderOptions();
    this.button.querySelector('.dropdown-label').textContent = this.selectedLabel;
  }

  reinitialize() {
    // Destruir y recrear completamente el dropdown
    this.destroy();
    this.init();
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.remove();
    }
    this.selectElement.style.display = '';
    this.selectElement._customDropdownContainer = null;
    this.selectElement._customDropdown = null;
  }
}

// Gestor global de dropdowns
const DropdownManager = {
  dropdowns: new Map(),

  init() {
    this.initializeAll();
  },

  initializeAll() {
    const selects = document.querySelectorAll('.filter-group select');
    selects.forEach(select => {
      if (!this.dropdowns.has(select.id)) {
        const dropdown = new CustomDropdown(select);
        this.dropdowns.set(select.id, dropdown);
      }
    });
  },

  reinitializeSelect(selectId) {
    if (this.dropdowns.has(selectId)) {
      this.dropdowns.get(selectId).reinitialize();
    }
  },

  updateSelect(selectId) {
    if (this.dropdowns.has(selectId)) {
      this.dropdowns.get(selectId).updateOptions();
    }
  },

  destroy() {
    this.dropdowns.forEach(dropdown => dropdown.destroy());
    this.dropdowns.clear();
  }
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DropdownManager.init());
} else {
  DropdownManager.init();
}

// Exportar para uso en app.js si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CustomDropdown, DropdownManager };
}
