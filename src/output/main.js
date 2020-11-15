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
  const container = document.querySelector('#main');
  container.innerHTML = bookmarks[path];
  focusTextInput(container);
  attachUnobtrusiveJavascript(container);
}

function focusTextInput(container) {
  setTimeout(() => {
    const textInput = document.querySelector('input[type="text"]');
    if (textInput) {
      textInput.focus()
    }
  }, 0);
}

function attachUnobtrusiveJavascript(container) {
  Array.from(container.querySelectorAll('[data-on-change-navigate-to]')).forEach(element => {
    function navigate() {
      window.location.href = element.dataset.onChangeNavigateTo.replace('{{VALUE}}', element.value);
    }
    element.addEventListener('change', navigate)
  });
}

document.addEventListener('keyup', ({ key }) => {
  if (key === 'Escape') {
    removeLeafNodeFromPath();
    return;
  }

  const anchor = document.querySelector(`.bookmark[data-keyboard-shortcut='${key}']`);
  if (anchor) {
    anchor.click();
  }
});

document.addEventListener('DOMContentLoaded', render);
