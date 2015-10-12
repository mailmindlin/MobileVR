package com.mindlin.websocket;

import com.mindlin.http.HttpRequest;
import com.mindlin.http.HttpResponse;
import com.mindlin.util.IHandler;

@FunctionalInterface
public interface WebSocketBeforeUpgradeHandler extends IHandler<HttpRequest, HttpResponse> {
	@Override
	HttpResponse apply(HttpRequest request);
	@Override
	default boolean test(HttpRequest request) {
		return true;
	}
	@Override
	default HttpResponse invoke(HttpRequest request) {
		return test(request)?null:apply(request);
	}
}
