function handleLanguageSelection(langSelection) {
	let variable;
	chrome.storage.sync.get(['lang']).then((result) => {
		variable = result.lang;
		console.log(variable);
	});

	chrome.storage.sync.set({ lang: langSelection });

	chrome.storage.sync.get(['lang']).then((result) => {
		variable = result.lang;
		console.log(variable);
	});
}

document.onclick = function (event) {
	// Compensate for IE<9's non-standard event model
	//
	if (event === undefined) event = window.event;
	var target = 'target' in event ? event.target : event.srcElement;
	if (target.nodeName !== 'IMG') {
		return;
	}
	handleLanguageSelection(target.alt);
};
