export const postOptions = (payload: object) => ({
	method: 'POST',
	headers: {}, // request headers. format is the identical to that accepted by the Headers constructor (see below)
	body: payload, // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
	redirect: 'error', // set to `manual` to extract redirect headers, `error` to reject redirect
	timeout: 0, // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
	compress: true, // support gzip/deflate content encoding. false to disable
	size: 0, // maximum response body size in bytes. 0 to disable
	agent: null,
});

export const putOptions = (payload: object) => ({
	method: 'PUT',
	headers: {}, // request headers. format is the identical to that accepted by the Headers constructor (see below)
	body: payload, // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
	redirect: 'error', // set to `manual` to extract redirect headers, `error` to reject redirect
	timeout: 0, // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
	compress: true, // support gzip/deflate content encoding. false to disable
	size: 0, // maximum response body size in bytes. 0 to disable
	agent: null,
});
