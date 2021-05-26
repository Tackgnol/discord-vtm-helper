import { RequestInit } from 'node-fetch';
import { Auth } from '../config/access';

const getHeaders = () => ({
	Authorization: `Bot ${Auth.token}`,
	'Content-Type': 'application/json',
});

export const getOptions = (): RequestInit => ({
	method: 'GET',
	headers: getHeaders(), // request headers. format is the identical to that accepted by the Headers constructor (see below)
	redirect: 'error', // set to `manual` to extract redirect headers, `error` to reject redirect
	timeout: 0, // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
	compress: true, // support gzip/deflate content encoding. false to disable
	size: 0, // maximum response body size in bytes. 0 to disable
	agent: undefined,
});

export const postOptions = (payload: object): RequestInit => ({
	method: 'POST',
	headers: getHeaders(), // request headers. format is the identical to that accepted by the Headers constructor (see below)
	body: JSON.stringify(payload), // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
	redirect: 'error', // set to `manual` to extract redirect headers, `error` to reject redirect
	timeout: 0, // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
	compress: false, // support gzip/deflate content encoding. false to disable
	size: 0, // maximum response body size in bytes. 0 to disable
	agent: undefined,
});

export const putOptions = (payload: object): RequestInit => ({
	method: 'PUT',
	headers: getHeaders(), // request headers. format is the identical to that accepted by the Headers constructor (see below)
	body: JSON.stringify(payload), // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
	redirect: 'error', // set to `manual` to extract redirect headers, `error` to reject redirect
	timeout: 0, // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
	compress: true, // support gzip/deflate content encoding. false to disable
	size: 0, // maximum response body size in bytes. 0 to disable
	agent: undefined,
});

export const patchOptions = (payload: object): RequestInit => ({
	method: 'PATCH',
	headers: getHeaders(), // request headers. format is the identical to that accepted by the Headers constructor (see below)
	body: JSON.stringify(payload), // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
	redirect: 'error', // set to `manual` to extract redirect headers, `error` to reject redirect
	timeout: 0, // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
	compress: true, // support gzip/deflate content encoding. false to disable
	size: 0, // maximum response body size in bytes. 0 to disable
	agent: undefined,
});

export const deleteOptions = (payload: object): RequestInit => ({
	method: 'DELETE',
	headers: getHeaders(), // request headers. format is the identical to that accepted by the Headers constructor (see below)
	body: JSON.stringify(payload), // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
	redirect: 'error', // set to `manual` to extract redirect headers, `error` to reject redirect
	timeout: 0, // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
	compress: true, // support gzip/deflate content encoding. false to disable
	size: 0, // maximum response body size in bytes. 0 to disable
	agent: undefined,
});
