const LANGUAGES = ['ENG', 'POL', 'KOR'];

function fnAddButtons() {
	let btn = document.createElement('div');

	btn.id = 'buttonID';
	btn.className = 'ets-button';
	btn.type = 'actionButton';

	let menuHeader = document.createElement('ul');
	menuHeader.appendChild(document.createTextNode('ETS Button'));
	menuHeader.className = 'ets-header';
	btn.appendChild(menuHeader);

	//later turn into function and tie into n-number of actuall languages
	//first create them

	// for (let i = 0; i < LANGUAGES.length; i++) {
	// 	let option = optionCreator(i);
	// 	btn.appendChild(option);
	// }

	menuHeader.addEventListener('click', function handleClick(event) {
		oneTranslate(event);
	});

	let selectedDivs = document.getElementsByClassName(
		'interactions slds-grid slds-var-m-top_large'
	);
	for (let i = 0; i < selectedDivs.length; i++) {
		if (!hasButton(selectedDivs[i])) {
			selectedDivs[i].appendChild(btn);
		}
	}
}

function hasButton(HTMLColletion) {
	for (let i = 0; i < HTMLColletion.children.length; i++) {
		let localCollection = HTMLColletion.children[i];
		if (localCollection.className == 'ets-button') {
			return true;
		}
	}
	return false;
}

function menuToggle(event) {
	//console.error("error");
	//Open
	if (event.target.nextSibling.className == 'ets-option') {
		recursiveOpen(event.target.nextSibling);
	} else if (event.target.nextSibling.className == 'ets-option-show') {
		recursiveClose(event.target.nextSibling);
	} else {
		return;
	}

	//close
	// let options = document.getElementsByClassName("ets-option");
	// for (let i = options.length - 1; i > -1; i--) {
	// 	options[i].className = "ets-option-show";
	// }
}

function recursiveOpen(object) {
	if (object.nextSibling) {
		recursiveOpen(object.nextSibling);
	}
	object.className = 'ets-option-show';
}

function recursiveClose(object) {
	if (object.nextSibling) {
		recursiveClose(object.nextSibling);
	}
	object.className = 'ets-option';
}

//menu click anywhere else closer:
function optionCreator(languageID) {
	//later to be added diffrent functionality and stuff

	let option = document.createElement('ul');
	option.id = LANGUAGES[languageID];
	option.className = 'ets-option';
	option.appendChild(document.createTextNode(LANGUAGES[languageID]));

	addEventListener('click', function handleClick(event) {
		if (
			event.target.className != 'ets-option' &&
			event.target.className != 'ets-option-show'
		) {
			return;
		}
		fnAddTextDiv(event, languageID);
	});
	return option;
}

document.onclick = function (event) {
	// Compensate for IE<9's non-standard event model
	//
	if (event === undefined) event = window.event;
	var target = 'target' in event ? event.target : event.srcElement;
	fnAddButtons();
};

//for on load refer to code later also  i assume it wont work as load nad full load are probbalby two diffrent things

// 8 pozycji jezykowych

async function fnAddTextDiv(event) {
	//check
	//console.log(event.target, languageID);
	//ID is of language option basing on that you can later select the correct option languageID does not work, also 9 calls cause why not. (may probably check by does exists and if exists then leave)

	//TODO: Deal with repetitions

	//console.log(event)
	let customerDiv = getCostumerDiv(event);
	let customerText = getText(customerDiv);
	//Detecing Language first api call
	detectLang(customerText).then((lang) => {
		console.log(lang);
	});
	console.log(customerLang);
	//SECOND API CALL
	// let translateCall = translateArray(customerText);
	// console.log(translateCall)

	let textDiv = TextDivBuilder(customerText);
	let targetedSubDiv = customerDiv.children[0];
	// delete if exitsts
	deleteAllGeneratedTextDivs(targetedSubDiv);
	targetedSubDiv.appendChild(textDiv);
	console.log(document.getElementsByClassName('ets-text').length);
	//console.log(customerText);
}

function TextDivBuilder(text) {
	let textDiv = document.createElement('div');
	textDiv.className = 'ets-text';
	textDiv.appendChild(document.createTextNode(text));
	return textDiv;
}

function getText(customerDiv) {
	return customerDiv.innerText;
}

function getCostumerDiv(event) {
	let bigDiv =
		event.target.parentElement.parentElement.parentElement.parentElement;
	let customerDiv = bigDiv.children[1].children[0].children[0];
	return customerDiv;
}

function deleteAllGeneratedTextDivs(HTMLColletion) {
	let children = HTMLColletion.children;
	for (let i = children.length - 1; i > -1; i--) {
		let obj = children[i];
		if (obj.className == 'ets-text') {
			obj.children[0].remove();
		}
	}
}

async function detectLang(prompt) {
	const SCHEME = 'https://';
	const HOST = 'translate.samsung.com';
	const API = '/apis/';
	const API_V1 = '/apis/v1/';

	let url = 'https://translate.sec.samsung.net/utrans/apis/v1/langDetect';
	let langDetect = fetch(url, {
		method: 'POST',

		referrer: 'https://translate.samsung.com/',

		body: JSON.stringify({
			query: prompt,
		}),
	}).then((response) => {
		if (!response.ok) {
			console.log(response);
			throw new Error(response.error);
		}
		//return langDetect.result;
		response.json().then((data) => {
			//console.log(data);
			return data.result;
		});
	});
	//console.log(langDetect);
	return langDetect.result;
}

async function translateArray(prompt) {
	let url = 'https://translate.samsung.com/apis/v1/translate/array';
	let translateArray = fetch(url, {
		crossDomain: true,
		method: 'POST',
		body: JSON.stringify({
			source: 'en',
			target: 'ko',
			type: 'salesforce',
			profile: 'universal',
			id: 'salesforce',
			querylist: [prompt],
			key: 'c2FsZXNmb3JjZS1zci0yMDIyMDUyNg==',
		}),
	}).then((response) => {
		if (!response.ok) {
			console.log(response);
			throw new Error(response.error);
		}
		console.log(response);
		_;
		return response.json();
	});
	console.log(translateArray);
	return translateArray.result;
}

function oneTranslate(event) {
	let customerDiv = getCostumerDiv(event);
	let customerText = getText(customerDiv);

	const SCHEME = 'https://';
	const HOST = 'translate.samsung.com';
	const API = '/apis/';
	const API_V1 = '/apis/v1/';

	let url = 'https://translate.samsung.com/apis/v1/langDetect';
	let langDetect = fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			query: customerText,
		}),
	}).then((response) => {
		if (!response.ok) {
			console.log(response);
			throw new Error(response.error);
		}
		//return langDetect.result;
		response.json().then((data) => {
			//console.log(data);
			let langDeteted = data.result;
			chrome.storage.sync.get(['lang']).then((result) => {
				let toLang = result.lang;
				let url2 = 'https://translate.samsung.com/apis/v1/translate/array';
				let translateArray = fetch(url2, {
					crossDomain: true,
					method: 'POST',
					body: JSON.stringify({
						source: langDeteted,
						target: toLang,
						type: 'salesforce',
						profile: 'universal',
						id: 'salesforce',
						querylist: [customerText],
						key: 'c2FsZXNmb3JjZS1zci0yMDIyMDUyNg==',
					}),
				}).then((response) => {
					if (!response.ok) {
						console.log(response);
						throw new Error(response.error);
					}
					response.json().then((data) => {
						console.log(data);
						let translated = data.resultList[0];
						let textDiv = TextDivBuilder(translated);
						let targetedSubDiv = customerDiv.children[0];
						// delete if exitsts
						deleteAllGeneratedTextDivs(targetedSubDiv);
						targetedSubDiv.appendChild(textDiv);
						return;
					});
				});
			});
		});
	});
	//console.log(langDetect);
	return langDetect.result;
}
