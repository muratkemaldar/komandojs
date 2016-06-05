# komandojs
command line-like interface for custom commands only in browser.

## demo page
http://muratkemaldar.github.io/komandojs/

## usage / setup
Just call the init method of the window.komando object, and pass parameters.

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
    options: {
  		focusInput: false,
  		defaultCommandNotFoundMessage: '¯\\_(ツ)_/¯'
  	},
    callback: function(){
      console.log("komando initialized");
    }
  });
</script>
```

### options

#### focusInput
boolean, default false. true if you want to focus input on komando.init.

#### defaultCommandNotFoundMessage
string, default '¯\\_(ツ)_/¯'. message which is displayed when user enters a command unknown.
