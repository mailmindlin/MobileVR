package com.mindlin.http;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

public class HttpRequest {
	public String method;
	public final String path;
	public final String httpv;
	protected final HashMap<String, List<String>> headers;
	protected final HashMap<String, String> getFields, postFields, cookies, multipartData;
	public HttpRequest(String method, String path, String httpv, HashMap<String, List<String>> headers, HashMap<String, String> getFields, HashMap<String, String> postFields, HashMap<String, String> cookies, HashMap<String, String> multipartData) {
		this.method = method;
		this.path = path;
		this.httpv = httpv;
		//because final
		this.headers = (headers == null || headers.isEmpty())?null:headers;
		this.getFields = (getFields == null || getFields.isEmpty())?null:getFields;
		this.postFields = (postFields == null || postFields.isEmpty())?null:postFields;
		this.cookies = (cookies == null || cookies.isEmpty())?null:cookies;
		this.multipartData = (multipartData == null || multipartData.isEmpty())?null:multipartData;
	}
	public List<String> getHeaderValues(String name) {
		return headers.get(name);
	}
	public String getFirstHeader(String name) {
		List<String> values = getHeaderValues(name);
		if (values == null || values.isEmpty())
			return null;
		return values.get(0);
	}
	public static class HttpRequestBuilder {
		protected String method, path, httpv;
		protected HashMap<String, List<String>> headers = new HashMap<>();
		protected final HashMap<String, String> getFields = new HashMap<>(),
				postFields = new HashMap<>(),
				cookies = new HashMap<>(),
				multipartData = new HashMap<>();
		public HttpRequestBuilder setMethod(String method) {
			this.method = method;
			return this;
		}
		public HttpRequestBuilder setPath(String path) {
			this.path = path;
			return this;
		}
		public HttpRequestBuilder setHttpv(String httpv) {
			this.httpv = httpv;
			return this;
		}
		public HttpRequestBuilder addHeader(String name, String value) {
			List<String> values = headers.computeIfAbsent(name, (a)->(new ArrayList<String>()));
			values.add(value);
			return this;
		}
		public HttpRequestBuilder addHeader(String name, String...values) {
			headers.computeIfAbsent(name, (a)->(new ArrayList<String>())).addAll(Arrays.asList(values));
			return this;
		}
		public HttpRequestBuilder setGetField(String key, String value) {
			getFields.put(key, value);
			return this;
		}
		public HttpRequestBuilder setPostField(String key, String value) {
			postFields.put(key, value);
			return this;
		}
		public HttpRequestBuilder setCookie(String key, String value) {
			cookies.put(key, value);
			return this;
		}
		public HttpRequestBuilder setMultipart(String name, String value) {
			multipartData.put(name, value);
			return this;
		}
		public HttpRequest build() {
			return new HttpRequest(method, path, httpv, headers, getFields, postFields, cookies, multipartData);
		}
	}
}
