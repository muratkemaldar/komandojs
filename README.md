# komandojs
command line in browser.

## usage
```html
<script type="text/javascript">

  // accepted commands
  var commands = [
    {
      command: 'hello', // base command
      action: function(command, display){
        display.print('hello to you'); // prints a new line to display
      }
    },
    {
      command: 'goodbye', 
      action: function(command, display, parameters){
        display.print('see you soon ' + parameters.string); 
        // parameters.string; all which comes after goodbye (trimmed)
        // parameters.array: all words split by ' '
      }
    }
  ];

  // init komandojs
  komando.init('komando-input', commands);

</script>
```