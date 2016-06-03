# komandojs
command line in browser.

## usage
```html
<script type="text/javascript">
  komando.init({
    input: document.getElementById('komando-input'),
    display: document.getElementById('komando-display'),
    commands: [
      {
        command: "hello",
        action: function(command, display, parameters){
          display.print("hello to you");
        }
      },
      {
        command: 'goodbye',
        parameterHint: '(name)',
        action: function(command, display, parameters){
          if (parameters) {
            display.print("see you soon " + parameters.string);
          } else {
            display.print("güle güle");
          }

        }
      },
      {
        command: 'open',
        parameterHint: '(url)',
        action: function(command, display, parameters){
          if (parameters) {
            display.print("opening", true, 'info');
            window.open("//" + parameters.string, '_blank');
          } else {
            display.print('url missing', 'error');
          }
        }
      }
    ],
    callback: function(){
      console.log("komando initialized");
    }
  });
</script>
```
