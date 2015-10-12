package com.mindlin.websocket;

import java.util.function.Function;

import com.mindlin.http.HttpRequest;
import com.mindlin.http.HttpResponse;
import com.mindlin.http.HttpServer;

public class WebSocketServer {
	protected Function<HttpRequest, HttpResponse> beforeUpgradeHandler = null;
	public WebSocketServer() {
		
	}
	public WebSocketServer(HttpServer httpserver) {
		
	}
	public WebSocketServer onBeforeUpgrade(Function<HttpRequest, HttpResponse> handler) {
		this.beforeUpgradeHandler = handler;
		return this;
	}
	public WebSocket upgrade(HttpRequest request) {
		if (this.beforeUpgradeHandler != null && this.beforeUpgradeHandler.apply(request)) {
			
		}
	}
}
