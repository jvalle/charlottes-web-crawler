module.exports.getUrlParts = function (baseUrl) {
	var url = {
		protocol: 'http://',
		server: '',
		port: 80,
		path: '/'
	};

	// remove the protocol if it exists
	if (baseUrl.indexOf('http') === 0 && baseUrl.indexOf(':') < 6) {
		url.protocol = baseUrl.slice(0, baseUrl.indexOf(':') + 3);
		baseUrl = baseUrl.slice(baseUrl.indexOf(':') + 3, baseUrl.length);
	}

	// remove the path
	if (baseUrl.indexOf('/') > -1) {
		url.path = baseUrl.slice(baseUrl.indexOf('/'), baseUrl.length);
		baseUrl = baseUrl.slice(0, baseUrl.indexOf('/'));
	}

	// remove the port
	if (baseUrl.indexOf(':') > -1) {
		url.port = parseInt(baseUrl.slice(baseUrl.indexOf(':') + 1, baseUrl.length), 10);
		baseUrl = baseUrl.slice(0, baseUrl.indexOf(':'));
	}

	url.server = baseUrl;
	return url;
};