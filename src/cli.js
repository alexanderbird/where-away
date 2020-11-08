#!/usr/bin/env node

console.log(`
<html>
  <head>
  </head>
  <body>
    <div id='main'>
      <a>External Link</a>
      <a>External Link with Parameter</a>
      <a onclick='appleSauce()'>Child Page</a>
    </div>
    <script>
      function appleSauce() {
        document.querySelector('#main').innerHTML = \`
          <a>Another External Link</a>
          <a>Another External Link with Parameter</a>
          
        \`
      }
    </script>
  </body>
</html>
`);
