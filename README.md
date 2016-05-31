# komandojs
command line in browser.

## usage
```html
<script type="text/javascript">
	<!-- scripts, init called on bottom -->
	<script type="text/javascript">
		var commands = [
			{
				command: 'hello',
				action: function(command, display){
					display.print('hello to you');
				}
			},
			{
				command: ['hello salla'],
				action: function(command, display){
					display.print('hello murat');
				}
			}
		];
		// init komandojs
		komando.init("komando-input", commands);
	</script>
</script>
```