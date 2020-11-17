class State {
  getPath() {
    return window.location.hash.slice(1);
  }

  setPath(path) {
    const url = new URL(window.location);
    url.hash = path;
    window.history.pushState({}, '', url);
  }
}

const state = new State();

function addToPath(anchor) {
  const character = anchor.dataset.keyboardShortcut;
  state.setPath(state.getPath() + character);
  render();
}

function removeLeafNodeFromPath() {
  state.setPath(state.getPath().slice(0, -1));
  render();
}

function render() {
  const container = document.querySelector('#main');
  container.innerHTML = bookmarks[state.getPath()];
  attachUnobtrusiveJavascript(container);
  chooseCorrectFocus(container);
}

function chooseCorrectFocus(container) {
  const textInput = container.querySelector('input[type="text"]');
  if (textInput) {
    textInput.focus()
  } else {
    document.querySelector('#tab-index-reset').focus();
  }
}

function attachUnobtrusiveJavascript(container) {
  Array.from(container.querySelectorAll('[data-on-change-navigate-to]')).forEach(element => {
    function navigate() {
      window.location.href = element.dataset.onChangeNavigateTo.replace('{{VALUE}}', element.value);
    }
    element.addEventListener('change', navigate)
  });
}

function onKeyUp({ key }) {
  Array.from(document.querySelectorAll('.keydown'))
    .forEach(e => e.classList.remove('keydown'));

  if (key === 'Escape') {
    removeLeafNodeFromPath();
    return;
  }

  const bookmark = document.querySelector(`.bookmark[data-keyboard-shortcut='${key}']`);
  if (bookmark) {
    bookmark.click();
  }
}

function onKeyDown({ key }) {
  const bookmark = document.querySelector(`.bookmark[data-keyboard-shortcut='${key}']`);
  if (bookmark) {
    bookmark.classList.add('keydown');
  }
}

document.addEventListener('keyup', onKeyUp);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('DOMContentLoaded', render);
window.addEventListener('hashchange', render);
