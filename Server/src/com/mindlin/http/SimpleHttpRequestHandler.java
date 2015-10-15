package com.mindlin.http;

import java.lang.ref.WeakReference;
import java.net.Socket;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import com.mindlin.util.MultiValueHashMap;
import com.mindlin.util.MultiValueMap;

public class SimpleHttpRequestHandler implements Function<HttpRequest, HttpResponse> {
	protected HttpUpgradeRequestHandler onUpgradeRequest;
	public SimpleHttpRequestHandler onUpgradeRequest(HttpUpgradeRequestHandler handler) {
		this.onUpgradeRequest = handler;
		return this;
	}
	@Override
	public HttpResponse apply(HttpRequest request) {
		MultiValueMap<String, String, LinkedList<String>> headersToAdd = new MultiValueMap<>(new HashMap<>(), LinkedList<String>::new);
		HashMap<String, String> headersToSet = new HashMap<>();
		if (this.onUpgradeRequest != null && request.hasHeader("Upgrade")) {
			
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	protected Optional<HttpResponse> attemptUpgrade(HttpRequest request) {
		
		MultiValueHashMap<String, String> headersToAdd = new MultiValueHashMap<>();
		HashMap<String, String> headersToSet = new HashMap<>();
		
		do {
			switch (result.getType()) {
			case CANCEL:
				return HttpEventHandlerResponse.cancel();
			case SET_HEADER:
				headersToSet.putAll((Map<String, String>)result.getArg());
				continue;
			case ADD_HEADER:
				headersToAdd.assimilate((Map<String, ? extends Collection<String>>)result.getArg());
			case CONTINUE:
				break;
			case SET_RESPONSE:
				HttpResponse response = (HttpResponse) result.getArg();
				break;
			default:
				break;
			}
		} while ((result = result.next()) != null);
		return null;
	}
	
	protected Optional<HttpResponse> applyHandlerResponses(HttpEventHandlerResponse<?> response, Map<String, List<String>> toAdd, Map<String, String> toSet) {
		return null;
	}
	
	@FunctionalInterface
	public static interface HttpUpgradeRequestHandler {
		HttpEventHandlerResponse<?> apply(String protocolFrom, String protocolTo, HttpRequest request, WeakReference<Socket> socket);
	}
}
