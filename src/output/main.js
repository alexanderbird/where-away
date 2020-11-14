function navigateTo(anchor, linkFactory) {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = anchor.dataset.parameterLabel;
  input.addEventListener('keyup', event => event.stopPropagation()); /* otherwise it'll trigger keyboard shortcuts */
  input.addEventListener('change', () => { window.location.href = linkFactory(input.value) });

  const modalWindow = document.createElement('div');
  modalWindow.classList.add('modal-window');
  modalWindow.appendChild(input);
  document.querySelector('#main').appendChild(modalWindow);
  setTimeout(() => input.focus(), 0);
}

let path = '';
function addToPath(anchor) {
  const character = anchor.dataset.keyboardShortcut;
  path = path + character;
  render();
}

function removeLeafNodeFromPath() {
  path = path.slice(0, -1);
  render();
}

function render() {
  document.querySelector('#main').innerHTML = bookmarks[path];
}

document.addEventListener('keyup', ({ key }) => {
  if (key === 'Escape') {
    removeLeafNodeFromPath();
    return;
  }

  const anchor = document.querySelector(`a[data-keyboard-shortcut='${key}']`);
  if (anchor) {
    anchor.click();
  }
});

document.addEventListener('DOMContentLoaded', render);
