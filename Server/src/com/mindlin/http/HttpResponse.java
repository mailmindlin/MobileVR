package com.mindlin.http;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;

public class HttpResponse {
	protected final HashMap<String, List<String>> headers;
	public final InputStream responseData;
	public HttpResponse(HashMap<String, List<String>> headers, InputStream response) {
		this.headers = headers;
		this.responseData = response;
	}
}
