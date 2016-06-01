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
		print(content, robot = true, lineClass = 'default') {
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
		displayLines: true,
		autoAddLines: false, 
		panelId: 'komando-display',
		focusInput: true,
		defaultCommandNotFoundMessage: 'No comprende'
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

	init(inputId, commands = {}, options = this.options, callback) {
		// set props
		this.commands = commands;

		//create command map
		this.commandMap = {};
		for (var cid = 0; cid < this.commands.length; cid++) {
			this.commandMap[this.commands[cid].command] = cid;
			this.commands[cid]._commandId = cid;
		}

		// init input
		let input = document.getElementById(inputId);
		if (input) {
			this.input = input;
			this.input.addEventListener('keydown', event => {
				if (event.key == 'Enter' && input.value) {
					this.handleCommand(input.value);
				}
				if (event.key == 'ArrowUp') {
					this.history.navigate('up');
					event.preventDefault();
				}
				if (event.key == 'ArrowDown') {
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
		if (this.options.displayLines) {
			this.display.panel = document.getElementById(this.options.panelId);
			if (this.display.panel == undefined) {
				warning('display not found');
			}
		}
		
		if (callback) {
			callback();
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
			this.display.print(command, false);
		}

		// check for help
		if (command == 'help' || command == '/help'){
			if (this.display.panel) {
				for (var c = 0; c < this.commands.length; c++){
					this.display.print(this.commands[c].command, true, 'info');
				}
				this.triggerEvent('handlecommand', {command: command});
				return;
			}
		}

		// check commandMap, call action
		if (this.commandMap[command] !== undefined){
			this.commands[this.commandMap[command]].action(command, this.display);
		} else {
			let commandObj;
			let parameters = {};
			for (var c = 0; c < this.commands.length; c++) {
				if (command.indexOf(this.commands[c].command) == 0) {
					commandObj = this.commands[c];
					parameters.string = command.slice(this.commands[c].command.length).trim();
					parameters.array = parameters.string.split(' ');
					commandObj.action(command, this.display, parameters);
					console.log(parameters);
					break;
				}
			}
			if (commandObj === undefined) {
				this.display.print(this.options.defaultCommandNotFoundMessage, true, 'error');
			}
			
		}

		// put it in history
		this.history.add(command);

		// dispatch the event
		this.triggerEvent('handlecommand', {command: command});
	},

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
