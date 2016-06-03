/**
* komandoJS @muri5
* TODO:
* - extend options
* - "contains" property
*/

const komando = {

	// the input where the user enters commands.
	input: undefined,

	// array of command objects with command-string and action.
	commands: undefined,

	// display of commandLine, output field.
	display: {
		panel: undefined,
		mostRecentLine: undefined,
		print(content, lineClass = 'default', robot = true) {
			if (this.panel === undefined) { return; }
			let line = document.createElement('p');
			line.className = 'line ' + lineClass + " " + (robot ? 'robot' : 'user');
			line.innerHTML = content;
			komando.display.mostRecentLine = line;
			komando.display.panel.appendChild(line);
			komando.input.value = '';
			komando.triggerEvent('displayprint', {line: line, robot: robot});
		}
	},

	// options
	options: {
		focusInput: true,
		defaultCommandNotFoundMessage: '¯\\_(ツ)_/¯'
	},

	// state properties set on runtime
	state: {
		commandsEntered: false,
		numberOfCommandsEntered: 0,
		commandHistory: [],
	},

	history: {
		cursor: undefined,
		commands: [],
		add(command) {
			this.commands.unshift(command);
			komando.triggerEvent('historyadd');
		},
		navigate(direction) {
			console.log("navigation");
			if (this.cursor === undefined && this.commands.length && direction == 'up') {
				this.cursor = 0;
			}
			if (this.cursor !== undefined) {
				komando.input.value = this.commands[this.cursor];
			}
		}
	},

	init(initParams) {
		// set props
		this.commands = initParams.commands;

		//create command map
		this.commandMap = {};
		for (var cid = 0; cid < this.commands.length; cid++) {
			this.commandMap[this.commands[cid].command] = cid;
			this.commands[cid]._commandId = cid;
		}

		// init input
		if (initParams.input) {
			this.input = initParams.input;
			this.input.addEventListener('keydown', event => {
				if (event.keyCode == 13 && this.input.value) { //Enter
					this.handleCommand(this.input.value);
				}
				if (event.keyCode == 38) { //ArrowUp
					this.history.navigate('up');
					event.preventDefault();
				}
				if (event.keyCode == 40) { //ArrowDown
					this.history.navigate('down');
					event.preventDefault();
				}
			});
			if (this.options.focusInput) {
				this.input.focus();
			}
		} else {
			warning('input not found');
		}

		// init display
		if (initParams.display) {
			this.display.panel = initParams.display;
			if (this.display.panel === undefined) {
				warning('display not found');
			}
		}
		
		// callback
		if (initParams.callback) {
			initParams.callback();
		}

		console.log(komando);
	},

	handleCommand(command){
		// first time handled
		if (this.display.panel) {
			if (!this.state.commandsEntered) {
				this.display.panel.innerHTML = "";
				this.display.panel.classList.add(['active']);
				this.state.commandsEntered = true;
			}
			this.display.print(command, 'default', false);
		}

		// check for help
		if (command == 'help' || command == '/help'){
			for (let c of this.commands) {
				let text = c.command + (c.parameterHint ? " " + c.parameterHint : "");
				this.display.print(text, 'info', true);
			}
			return;
		}

		// core functionality
		if (this.commandMap.hasOwnProperty(command)){
			// if the exact command is defined in commandMap, call the action
			this.commands[this.commandMap[command]].action(command, this.display);
		} else {
			// if not, loop through commands and filter (to check if it has paramaters)
			let commandObj = this.commands.filter(c => command.split(" ").indexOf(c.command) === 0)[0];
			if (commandObj) {
				let params = {
					string: command.slice(commandObj.command.length).trim(),
					array: command.slice(commandObj.command.length).trim().split(' ')
				}
				commandObj.action(command, this.display, params);
			} else {
				// if all fails, display print error
				this.display.print(this.options.defaultCommandNotFoundMessage, 'error', true);
			}
		}

		// put it in history
		this.history.add(command);

		// dispatch the event
		this.triggerEvent('handlecommand', {command: command});
	},

	// internal event triggering
	triggerEvent(eventName, komandoArgs) {
		var e = document.createEvent('Event');
		for (var arg in komandoArgs) {
			if (komandoArgs.hasOwnProperty(arg)) {
			  e[arg] = komandoArgs[arg];
			}
		}
		e.initEvent(eventName, true, true);
		window.dispatchEvent(e);
	},

	// trigger callbacks
	on(event, callback) {
		window.addEventListener(event, callback);
	},
}

const warning = function(content){
	console.warn(content);
}

window.komando = komando;
