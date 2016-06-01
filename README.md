# komandojs
command line in browser.

## usage
```html
<script type="text/javascript">

  komando.init({
    input: document.getElementById('komando-input'), // required
    display: document.getElementById('komando-display'), // optional
    commands: [
      {
        command: "hello",
        action: function(command, display, parameters){
          display.print("hello to you");
        }
      },
      {
        command: 'goodbye',
        action: function(command, display, parameters){
          display.print("see you soon " + parameters.string);
        }
      }
    ],
    callback: function(){
      console.log("komando initialized");
    }
  });

</script>
```