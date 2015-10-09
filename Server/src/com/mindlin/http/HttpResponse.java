package com.mindlin.http;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;

public class HttpResponse {
	public String statusLine;
	protected final HashMap<String, List<String>> headers;
	public final ByteArrayOutputStream responseData;
	
}
