package com.mindlin.http;

import java.lang.ref.WeakReference;
import java.net.Socket;
import java.util.Optional;
import java.util.function.Function;

public class SimpleHttpRequestHandler implements Function<HttpRequest, HttpResponse> {
	protected HttpUpgradeRequestHandler onUpgradeRequest;
	public SimpleHttpRequestHandler onUpgradeRequest(HttpUpgradeRequestHandler handler) {
		this.onUpgradeRequest = handler;
		return this;
	}
	@Override
	public HttpResponse apply(HttpRequest request) {
		if (this.onUpgradeRequest != null && request.hasHeader("Upgrade")) {
			HttpResponse result = this.onUpgradeRequest.apply(request.getProtocol(), request.getFirstHeader("Upgrade"), request, request.getSocket());
		}
		return null;
	}
	
	@FunctionalInterface
	public static interface HttpUpgradeRequestHandler {
		Optional<HttpResponse> apply(String protocolFrom, String protocolTo, HttpRequest request, WeakReference<Socket> socket);
	}
}
