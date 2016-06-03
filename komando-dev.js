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
			var lineClass = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];
			var robot = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

			if (this.panel === undefined) {
				return;
			}
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
		focusInput: true,
		defaultCommandNotFoundMessage: '¯\\_(ツ)_/¯'
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

	init: function init(initParams) {
		var _this = this;

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
				var params = {
					string: command.slice(commandObj.command.length).trim(),
					array: command.slice(commandObj.command.length).trim().split(' ')
				};
				commandObj.action(command, this.display, params);
			} else {
				// if all fails, display print error
				this.display.print(this.options.defaultCommandNotFoundMessage, 'error', true);
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

var warning = function warning(content) {
	console.warn(content);
};

window.komando = komando;