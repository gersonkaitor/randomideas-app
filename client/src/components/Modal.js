class Modal {
  constructor() {
    this._modal = document.querySelector('#modal');
    this._modalBtn = document.querySelector('#modal-btn');
    this.addEventListeners();
  }

  addEventListeners() {
    this._modalBtn.addEventListener('click', this.open.bind(this));
    window.addEventListener('click', this.outsideClick.bind(this));
    document.addEventListener('closemodal', () => this.close());
  }

  open() {
    this._modal.style.display = 'block';
  }

  close() {
    this._modal.style.display = 'none';
    this._formBtn = document.querySelector('#submit');
    this._formBtn.classList.remove('update');
    this._formBtn.textContent = 'Submit';
    this._modal.children[0].children[0].removeAttribute('data-id');
    this._modal.children[0].children[0].elements.username.disabled = false;
  }

  outsideClick(e) {
    if (e.target === this._modal) {
      this.close();
    }
  }
}

export default Modal;
