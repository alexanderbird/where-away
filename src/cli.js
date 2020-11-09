#!/usr/bin/env node

console.log(`
<html>
  <head>
  </head>
  <body>
    <div id='main'>
    </div>
    <script>
      function navigateTo(linkFactory) {
        const input = document.createElement('input');
        input.type = 'text';
        input.addEventListener('keyup', event => event.stopPropagation()); /* otherwise it'll trigger keyboard shortcuts */
        input.addEventListener('change', () => { window.location.href = linkFactory(input.value) });
        document.querySelector('#main').appendChild(input);
      }

      let path = '';
      function addToPath(anchor) {
        const character = anchor.dataset.keyboardShortcut;
        path = path + character;
        render();
      }

      const manifest = {
        "": \`
          <a data-keyboard-shortcut='e' href='./fake_external_link.html'>External Link</a>
          <a data-keyboard-shortcut='p' onclick='navigateTo(param => \\\`./fake_external_link.html?param=\\\${param}&more=true\\\`)'>External Link with Parameter</a>
          <a data-keyboard-shortcut='c' onclick='addToPath(this)'>Child Page</a>
        \`,
        "c": \`
          <a data-keyboard-shortcut='a' href='./fake_external_link.html?another=true'>Another External Link</a>
          <a data-keyboard-shortcut='p' onclick='navigateTo(param => \\\`./fake_external_link.html?param=\\\${param}&another=true&yes=please\\\`)'>
            Another External Link with Parameter
          </a>
          
        \`
      }

      function render() {
        document.querySelector('#main').innerHTML = manifest[path];
      }

      document.addEventListener('keyup', ({ key }) => {
        console.error('keyup', key);
        const anchor = document.querySelector(\`a[data-keyboard-shortcut='\${key}']\`);
        if (anchor) {
          anchor.click();
        }
      });

      document.addEventListener('DOMContentLoaded', render);
    </script>
  </body>
</html>
`);
