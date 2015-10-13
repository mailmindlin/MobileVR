package com.mindlin.http;

import org.javatuples.Pair;

public class HttpEventHandlerResponse<E> {
	public static HttpEventHandlerResponse<Void> cancel() {
		return new HttpEventHandlerResponse<Void>(HttpEventHandlerResponseType.CANCEL);
	}
	public static HttpEventHandlerResponse<Pair<String, String>> addHeader(String name, String value) {
		return new HttpEventHandlerResponse<>(HttpEventHandlerResponseType.ADD_HEADER, new Pair<>(name, value));
	}
	public static HttpEventHandlerResponse<Pair<String, String>> setHeader(String name, String value) {
		return new HttpEventHandlerResponse<>(HttpEventHandlerResponseType.SET_HEADER, new Pair<>(name, value));
	}
	public static HttpEventHandlerResponse<HttpResponse> setResponse(HttpResponse response) {
		return new HttpEventHandlerResponse<>(HttpEventHandlerResponseType.SET_RESPONSE, response);
	}
	public static HttpEventHandlerResponse<Void> doContinue(String name, String value) {
		return new HttpEventHandlerResponse<>(HttpEventHandlerResponseType.CONTINUE);
	}
	protected final HttpEventHandlerResponseType type;
	protected E arg;
	protected HttpEventHandlerResponse<?> next;
	public HttpEventHandlerResponse(HttpEventHandlerResponseType type) {
		this(type, null, null);
	}
	public HttpEventHandlerResponse(HttpEventHandlerResponseType type, E arg) {
		this(type, arg, null);
	}
	public HttpEventHandlerResponse(HttpEventHandlerResponseType type, E arg, HttpEventHandlerResponse<?> next) {
		this.type = type;
		this.arg = arg;
		this.next = next;
	}
	public HttpEventHandlerResponseType getType() {
		return type;
	}
	public E getArg() {
		return arg;
	}
	public HttpEventHandlerResponse<?> next() {
		return next;
	}
	public HttpEventHandlerResponse<E> then(HttpEventHandlerResponse<?> next) {
		this.next = next;
		return this;
	}
}

