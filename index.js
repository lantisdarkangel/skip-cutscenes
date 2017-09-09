const format = require('./format.js');

module.exports = function SkipCutscenes(dispatch) {
	let enabled = true;
	
	const chatHook = event => {		
		let command = format.stripTags(event.message).split(' ');
		
		if (['!sc', '!cgi'].includes(command[0].toLowerCase())) {
			toggleModule();
			return false;
		}
	}
	dispatch.hook('C_CHAT', 1, chatHook)	
	dispatch.hook('C_WHISPER', 1, chatHook)
	
	// slash support
	try {
		const Slash = require('slash')
		const slash = new Slash(dispatch)
		slash.on('sc', args => toggleModule())
		slash.on('cgi', args => toggleModule())
	} catch (e) {
		// do nothing because slash is optional
	}
	
	function toggleModule() {
		enabled = !enabled;
		systemMessage((enabled ? 'Cutscene Enabled' : 'Cutscene Disabled'));
	}
	
	function systemMessage(msg) {
	dispatch.toClient('S_CHAT', 1, {
		channel: 24, //21 = p-notice, 24 = system
		authorName: 'CGI',
		message: msg
	});
	}
	
	dispatch.hook('sPlayMovie', (event) => {
		if (!enabled) return;
	dispatch.toServer('cEndMovie', Object.assign({ unk: true }, event));
	return false;
	});
};
