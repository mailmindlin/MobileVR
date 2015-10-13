package com.mindlin.http;

public enum HttpEventHandlerResponseType {
	/**
	 * Cancels event.
	 * If this is returned in a sequence, no other HttpEventHandlerResponse's may follow it.
	 * This event type means that no other event handlers should be called either (even default ones).
	 */
	CANCEL,
	/**
	 * Adds a http header to any HttpResponse generated by this event. This may be ignored if the event is later canceled.
	 */
	ADD_HEADER,
	SET_HEADER,
	SET_RESPONSE,
	CONTINUE;
}
