package com.mindlin.http;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;

import com.mindlin.util.MultiValueHashMap;

public class HttpResponse {
	public HttpResponse genericServerError(String message) {
		return null;
	}
	public HttpResponse redirectTo(String newPath, boolean permanent) {
		return null;
	}
	protected final MultiValueHashMap<String, String> headers;
	public final InputStream responseData;
	public HttpResponse(MultiValueHashMap<String, String> headers, InputStream response) {
		this.headers = headers;
		this.responseData = response;
	}
	
}
