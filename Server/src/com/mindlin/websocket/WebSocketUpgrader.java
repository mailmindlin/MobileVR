package com.mindlin.websocket;

import java.lang.ref.WeakReference;
import java.net.Socket;
import java.util.Optional;
import java.util.function.Function;

import org.javatuples.Tuple;

import com.mindlin.http.HttpRequest;
import com.mindlin.http.HttpResponse;
import com.mindlin.http.SimpleHttpRequestHandler.HttpUpgradeRequestHandler;

public class WebSocketUpgrader implements HttpUpgradeRequestHandler {
	protected Function<HttpRequest, Optional<HttpResponse>> onBeforeUpgrade = null;
	public WebSocketUpgrader() {
		
	}

	@Override
	public HttpResponse apply(String protocolFrom, String protocolTo, HttpRequest request, WeakReference<Socket> socket) {
		if (protocolTo.equalsIgnoreCase("websocket")) {
			Socket hrsock = socket.get();
			if (onBeforeUpgrade != null) {
				Optional<HttpResponse> result = onBeforeUpgrade.apply(request);
				if (result.isPresent()) {
					if (result.get() != null)
						//TODO finish
				}
			}
			
		}
		return null;
	}
}
