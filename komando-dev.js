'use strict';

/**
* komandoJS, by muratkemaldar
* https://github.com/muratkemaldar/komandojs
* version 1.0.0
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
			var lineClass = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];
			var robot = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

			if (this.panel === undefined) return;
			var line = document.createElement('p');
			line.className = 'line ' + lineClass + " " + (robot ? 'robot' : 'user');
			line.innerHTML = content;
			this.panel.appendChild(line);
			this.mostRecentLine = line;
			komando.input.value = '';
			komando.triggerEvent('displayprint', { line: line, robot: robot });
		}
	},

	// options
	options: {
		focusInput: false,
		defaultCommandNotFoundMessage: '¯\\_(ツ)_/¯'
	},

	// state properties set on runtime
	state: {
		commandsEntered: false,
		numberOfCommandsEntered: 0
	},

	// history, where user can use arrow keys to navigate
	history: {
		cursor: undefined,
		commands: [],
		add: function add(command) {
			this.commands.unshift(command);
			this.cursor = undefined;
			komando.triggerEvent('historyadd', { command: command });
		},
		navigate: function navigate(direction) {
			if (this.commands.length === 0) return;
			if (this.cursor === undefined && direction == 'up') {
				this.cursor = 0;
			} else if (direction == 'up' && this.cursor < this.commands.length - 1) {
				this.cursor = this.cursor + 1;
			} else if (direction == 'down' && this.cursor > 0) {
				this.cursor = this.cursor - 1;
			}
			if (this.cursor !== undefined) {
				komando.input.value = this.commands[this.cursor];
			}
		}
	},

	init: function init(initParams) {
		var _this = this;

		// set commands
		this.commands = initParams.commands;

		// extend options
		if (initParams.options) {
			for (var option in initParams.options) {
				if (this.options.hasOwnProperty(option)) {
					this.options[option] = initParams.options[option];
				}
			}
		}

		// create command map
		this.commandMap = {};
		for (var cid = 0; cid < this.commands.length; cid++) {
			this.commandMap[this.commands[cid].command] = cid;
			this.commands[cid]._commandId = cid;
		}

		// init input
		if (initParams.input) {
			this.input = initParams.input;
			this.input.addEventListener('keydown', function (event) {
				if (event.keyCode == 13 && _this.input.value) {
					//Enter
					_this.handleCommand(_this.input.value);
				}
				if (event.keyCode == 38) {
					//ArrowUp
					_this.history.navigate('up');
					event.preventDefault();
				}
				if (event.keyCode == 40) {
					//ArrowDown
					_this.history.navigate('down');
					event.preventDefault();
				}
			});
			if (this.options.focusInput) {
				this.input.focus();
			}
		} else {
			if (console) {
				console.warn('input not found, you need a DOM element in komando.init({...}).');
			}
		}

		// init display
		if (initParams.display) {
			this.display.panel = initParams.display;
		} else {
			if (console) {
				console.warn('display not found, you need a DOM element in komando.init({...}).');
			}
		}

		// callback
		if (initParams.callback) {
			initParams.callback();
		}
	},


	// called after input was entered
	handleCommand: function handleCommand(command) {
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
		if (command == 'help' || command == '/help') {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.commands[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var c = _step.value;

					var text = c.command + (c.parameterHint ? " " + c.parameterHint : "");
					this.display.print(text, 'info', true);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			this.triggerEvent('handlecommand', { command: command });
			return;
		}

		// core functionality
		if (this.commandMap.hasOwnProperty(command)) {
			// if the exact command is defined in commandMap, call the action
			this.commands[this.commandMap[command]].action(command, this.display);
		} else {
			// if not, loop through commands and filter (to check if it has paramaters)
			var commandObj = this.commands.filter(function (c) {
				return command.split(" ").indexOf(c.command) === 0;
			})[0];
			if (commandObj) {
				var paramString = command.slice(commandObj.command.length).trim();
				var paramArray = paramString.split(" ");
				commandObj.action(command, this.display, { string: paramString, array: paramArray });
			} else {
				// if all fails, display print error
				this.display.print(this.options.defaultCommandNotFoundMessage, 'error');
			}
		}

		// put it in history
		this.history.add(command);

		// dispatch the event
		this.triggerEvent('handlecommand', { command: command });
	},


	// internal event triggering
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

// attach to window
window.komando = komando;