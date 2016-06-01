'use strict';

/**
* komandoJS @muri5
* TODO:
* - extend options
* - "contains" property
*/

var komando = {

	// the input where the user enters commands.
	input: undefined,

	// array of command objects with command-string and action.
	commands: undefined,

	// display of commandLine, output field.
	display: {
		panel: undefined,
		mostRecentLine: undefined,
		print: function print(content) {
			var robot = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
			var lineClass = arguments.length <= 2 || arguments[2] === undefined ? 'default' : arguments[2];

			var line = document.createElement('p');
			line.className = 'line ' + lineClass + " " + (robot ? 'robot' : 'user');
			line.innerHTML = content;
			komando.display.mostRecentLine = line;
			komando.display.panel.appendChild(line);
			komando.input.value = '';
			komando.triggerEvent('displayprint', { line: line, robot: robot });
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
		commandHistory: []
	},

	history: {
		cursor: undefined,
		commands: [],
		add: function add(command) {
			this.commands.unshift(command);
			komando.triggerEvent('historyadd');
		},
		navigate: function navigate(direction) {
			console.log("navigation");
			if (this.cursor === undefined && this.commands.length && direction == 'up') {
				this.cursor = 0;
			}
			if (this.cursor !== undefined) {
				komando.input.value = this.commands[this.cursor];
			}
		}
	},

	init: function init(inputId) {
		var commands = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		var _this = this;

		var options = arguments.length <= 2 || arguments[2] === undefined ? this.options : arguments[2];
		var callback = arguments[3];

		// set props
		this.commands = commands;

		//create command map
		this.commandMap = {};
		for (var cid = 0; cid < this.commands.length; cid++) {
			this.commandMap[this.commands[cid].command] = cid;
			this.commands[cid]._commandId = cid;
		}

		// init input
		var input = document.getElementById(inputId);
		if (input) {
			this.input = input;
			this.input.addEventListener('keydown', function (event) {
				if (event.key == 'Enter' && input.value) {
					_this.handleCommand(input.value);
				}
				if (event.key == 'ArrowUp') {
					_this.history.navigate('up');
					event.preventDefault();
				}
				if (event.key == 'ArrowDown') {
					_this.history.navigate('down');
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
	handleCommand: function handleCommand(command) {
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
		if (command == 'help' || command == '/help') {
			if (this.display.panel) {
				for (var c = 0; c < this.commands.length; c++) {
					this.display.print(this.commands[c].command, true, 'info');
				}
				this.triggerEvent('handlecommand', { command: command });
				return;
			}
		}

		// check commandMap, call action
		if (this.commandMap[command] !== undefined) {
			this.commands[this.commandMap[command]].action(command, this.display);
		} else {
			var commandObj = void 0;
			var parameters = {};
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
		this.triggerEvent('handlecommand', { command: command });
	},
	triggerEvent: function triggerEvent(eventName, komandoArgs) {
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
	on: function on(event, callback) {
		window.addEventListener(event, callback);
	}
};

var warning = function warning(content) {
	console.warn(content);
};

window.komando = komando;