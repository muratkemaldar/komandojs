# komandojs
command line-like interface for custom commands only in browser.

## demo page
http://muratkemaldar.github.io/komandojs/

## usage / setup
Just call the init method of the window.komando object, and pass parameters.
```html
<script type="text/javascript">

  komando.init({

    // input for entering commands, required
    input: document.getElementById('komando-input'),

    // display for displaying user-input and reactions, optional, but recommended
    display: document.getElementById('komando-display'),

    // array of custom commands
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
      }
    ],

    // options, these are the defaults
    options: {
  		focusInput: false,
  		defaultCommandNotFoundMessage: '¯\\_(ツ)_/¯'
  	},

    // after init callback
    callback: function(){
      console.log("komando initialized");
    }

  });

</script>
```

### input
the input DOM element, which the user uses to enter commands. required.

### display
the DOM element for containing lines rendered by komando. will be cleaned after first command, so you can put hints in there if you want.

### commands
an array of command objects, to which komando will react to.
a command has following built-in properties:

**command** `string` <br/>
the base command. when the user enters this command, regardless if the command has follow up, the corresponding action will be called.

**parameterHint** `string` <br/>
the hint which will be shown after the command property when user types 'help'

**action** `function (command, display, parameters)` <br/>
the action which will be called when user enters the corresponding command. this gets called by komando, and it gets following arguments:

* **command** `string` <br/> the command string of the command object

* **display** `object` <br/> an object with special methods and properties to react on a command (todo)

* **parameters** `object` <br/> object containing the words entered after the base command. contains a `string` and `array` property, first being everything after the accepted base command, the second being the same, but split by spaces.

### options
some options to change behavior of komando.
these are defaults:

**focusInput** `boolean, default false` <br/>
true if you want to focus input on komando.init().

**defaultCommandNotFoundMessage** `string, default ¯\\_(ツ)_/¯` <br/>
message which is displayed when user enters a command unknown.

### callback
callback method which will be called after komando has initialized.
