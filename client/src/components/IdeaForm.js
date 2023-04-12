import IdeasApi from '../services/ideasApi';
import IdeaList from './IdeaList';
import Modal from './Modal';

class IdeaForm {
  constructor() {
    this._formModal = document.querySelector('#form-modal');
    this._form = document.querySelector('#idea-form');
    this._tagSelect = document.querySelector('#tag');
    this._ideaList = new IdeaList();
    this._id = '';
    this._data = {};

    this._optionValue = [
      'Technology',
      'Software',
      'Business',
      'Education',
      'Health',
      'Inventions',
    ];
  }

  addEventListeners() {
    this._form.addEventListener('submit', this.handleSubmit.bind(this));
    document.querySelector('#close-btn').addEventListener('click', () => {
      const modal = new Modal();
      modal.close();
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (
      !this._form.elements.text.value ||
      !this._form.elements.tag.value ||
      !this._form.elements.username.value
    ) {
      alert('Please enter all fields');
      return;
    }

    // Save user to local storage
    localStorage.setItem('username', this._form.elements.username.value);

    const idea = {
      text: this._form.elements.text.value,
      tag: this._form.elements.tag.value,
      username: this._form.elements.username.value,
    };

    if (document.querySelector('#submit').classList.contains('update')) {
      const updateIdea = await IdeasApi.updateIdea(e.target.dataset.id, idea);
      this._ideaList.addIdeaToList(updateIdea.data.data, true);
      this._form.removeAttribute('data-id');
    } else {
      // Add idea to server
      const newIdea = await IdeasApi.createIdea(idea);

      // Add idea to list
      this._ideaList.addIdeaToList(newIdea.data.data);
    }

    // Clear fields
    this._form.elements.text.value = '';
    this._form.elements.tag.value = '';
    this._form.elements.username.value = '';

    this.render();

    document.dispatchEvent(new Event('closemodal'));
  }

  editIdea(data) {
    this._form.setAttribute('data-id', data.id);
    this._form.elements.username.disabled = true;
    this._form.elements.text.value = data.text;
    this._form.elements.tag.value =
      data.tag.charAt(0) + data.tag.slice(1).toLowerCase();

    this.formBtn('update', 'Update');
  }

  formBtn(className, text) {
    const formBtn = document.querySelector('#submit');
    formBtn.textContent = text;
    if (className === 'update') {
      formBtn.classList.add('update');
    } else {
      formBtn.classList.remove('update');
    }
  }

  render() {
    this._formModal.innerHTML = `   
        <form id="idea-form">
          <div class="form-control">
            <button type="button" id="close-btn" class="btn-close">X</button>
          </div>
            <div class="form-control">
                <label for="idea-text">Enter a Username</label>
               
                <input type="text" name="username" id="username" 
                  value="${
                    localStorage.getItem('username')
                      ? localStorage.getItem('username')
                      : ''
                  }"
                />
            </div>
                <div class="form-control">
                <label for="idea-text">What's Your Idea?</label>
                <textarea name="text" id="idea-text"></textarea>
            </div>
                <div class="form-control">
                <label for="tag">Tag</label>
                <select name="tag" id="tag">
                  ${this._optionValue
                    .map((option) => {
                      return `<option value="${option}">${option}</option>`;
                    })
                    .join('')}
                </select>
            </div>
            <button class="btn" type="submit" id="submit">Submit</button>
        </form>
    `;

    this._form = document.querySelector('#idea-form');
    this.formBtn = document.querySelector('#submit');
    this.addEventListeners();
  }
}

export default IdeaForm;
