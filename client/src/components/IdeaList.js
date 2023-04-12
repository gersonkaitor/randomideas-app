import IdeasApi from '../services/ideasApi';
import Modal from './Modal';
import IdeaForm from './IdeaForm';

class IdeaList {
  constructor() {
    this._ideaListEl = document.querySelector('#idea-list');
    this._ideas = [];
    this.getIdeas();

    this._validTags = new Set();
    this._validTags.add('technology');
    this._validTags.add('software');
    this._validTags.add('business');
    this._validTags.add('education');
    this._validTags.add('health');
    this._validTags.add('inventions');
  }

  addEventListeners() {
    this._ideaListEl.addEventListener('click', (e) => {
      if (e.target.classList.contains('fa-times')) {
        e.stopImmediatePropagation();
        const ideaId = e.target.parentElement.parentElement.dataset.id;

        this.deleteIdea(ideaId);
      }

      if (e.target.classList.contains('edit-idea')) {
        e.stopImmediatePropagation();
        const modal = new Modal();
        modal.open();
        this.editIdea(e);
      }
    });
  }

  async getIdeas() {
    try {
      const res = await IdeasApi.getIdeas();
      this._ideas = res.data.data;
      this.render();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteIdea(ideaId) {
    try {
      const res = await IdeasApi.deleteIdea(ideaId);
      this._ideas.filter((idea) => idea._id !== ideaId);
      this.getIdeas();
    } catch (error) {
      alert('You can not delete this resource');
    }
  }

  editIdea(e) {
    const ideaId = e.target.parentElement.dataset.id;
    if (e.target.classList.contains('edit-idea')) {
      const data = {
        id: ideaId,
        text: document.querySelector('.edit-idea').textContent,
        tag: document.querySelector('.edit-idea').nextElementSibling
          .textContent,
      };
      const ideaForm = new IdeaForm();
      ideaForm.editIdea(data);
    }
  }

  addIdeaToList(idea, edit) {
    if (edit) {
      this._ideas.filter((ideas) => {
        ideas._id !== idea._id;
      });
      this.getIdeas();
    }
    this._ideas.push(idea);
    this.render();
  }

  getTagClass(tag) {
    tag = tag.toLowerCase();
    let tagClass = '';
    if (this._validTags.has(tag)) {
      tagClass = `tag-${tag}`;
    } else {
      tagClass = '';
    }
    return tagClass;
  }

  render() {
    this._ideaListEl.innerHTML = this._ideas
      .map((idea) => {
        const tagClass = this.getTagClass(idea.tag);
        const deleteBtn =
          idea.username === localStorage.getItem('username')
            ? '<button class="delete"><i class="fas fa-times"></i></button>'
            : '';
        const editIdea =
          idea.username === localStorage.getItem('username')
            ? `class="edit-idea"`
            : '';

        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        const date = new Date(idea.date);
        const m = monthNames[date.getMonth()];
        const d = date.getDate();
        const y = date.getFullYear();
        const dateFormat = `${m} ${d}, ${y}`;

        return `
        <div class="card" data-id="${idea._id}" >
            ${deleteBtn}
            <h3 ${editIdea} >${idea.text}</h3>
            <p class="tag ${tagClass}">${idea.tag.toUpperCase()}</p>
            <p>
                Posted on <span class="date">${dateFormat} </span> by
                <span class="author">${idea.username}</span>
            </p>
        </div>
        `;
      })
      .join('');

    this.addEventListeners();
  }
}

export default IdeaList;
