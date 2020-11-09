#!/usr/bin/env node

console.log(`
<html>
  <head>
  </head>
  <body>
    <div id='main'>
      <a data-keyboard-shortcut='e' href='./fake_external_link.html'>External Link</a>
      <a data-keyboard-shortcut='p' onclick='navigateTo(param => \`./fake_external_link.html?param=\${param}&more=true\`)'>External Link with Parameter</a>
      <a onclick='appleSauce()'>Child Page</a>
    </div>
    <script>
      function navigateTo(linkFactory) {
        const input = document.createElement('input');
        input.type = 'text';
        input.addEventListener('keyup', event => event.stopPropagation()); /* otherwise it'll trigger keyboard shortcuts */
        input.addEventListener('change', () => { window.location.href = linkFactory(input.value) });
        document.querySelector('#main').appendChild(input);
      }
      function appleSauce() {
        document.querySelector('#main').innerHTML = \`
          <a href='./fake_external_link.html?another=true'>Another External Link</a>
          <a onclick='navigateTo(param => \\\`./fake_external_link.html?param=\\\${param}&another=true&yes=please\\\`)'>
            Another External Link with Parameter
          </a>
          
        \`
      }

      document.addEventListener('keyup', ({ key }) => {
        console.error('keyup', key);
        const anchor = document.querySelector(\`a[data-keyboard-shortcut='\${key}']\`);
        if (anchor) {
          anchor.click();
        }
      });
    </script>
  </body>
</html>
`);
