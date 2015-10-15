package com.mindlin.http;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.net.Socket;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import com.mindlin.util.MultiValueHashMap;

public class HttpRequest {
	public String method;
	public final String path;
	public final String protocol;
	protected final HashMap<String, List<String>> headers;
	protected final HashMap<String, String> getFields, postFields, cookies, multipartData;
	protected final WeakReference<Socket> socket;
	//because php compat
	public final HashMap<String, String> $_GET, $_POST, $_COOKIE, $_FILE, $_REQUEST;
	public HttpRequest(String method, String path, String protocol, HashMap<String, List<String>> headers, HashMap<String, String> getFields, HashMap<String, String> postFields, HashMap<String, String> cookies, HashMap<String, String> multipartData, Socket socket) {
		this(method, path, protocol, headers, getFields, postFields, cookies, multipartData, new WeakReference<>(socket));
	}
	public HttpRequest(String method, String path, String protocol, Map<String, ? extends Collection<String>> headers, HashMap<String, String> getFields, HashMap<String, String> postFields, HashMap<String, String> cookies, HashMap<String, String> multipartData, WeakReference<Socket> socket) {
		this.method = method;
		this.path = path;
		this.protocol = protocol;
		this.socket = socket;
		//because final
		this.headers = (headers == null || headers.isEmpty())?null:headers;
		this.getFields = (getFields == null || getFields.isEmpty())?null:getFields;
		this.postFields = (postFields == null || postFields.isEmpty())?null:postFields;
		this.cookies = (cookies == null || cookies.isEmpty())?null:cookies;
		this.multipartData = (multipartData == null || multipartData.isEmpty())?null:multipartData;
		this.$_GET = this.getFields;
		this.$_POST = this.postFields;
		this.$_COOKIE = this.cookies;
		this.$_FILE = this.multipartData;
		this.$_REQUEST = new HashMap<>($_GET);
		$_REQUEST.putAll($_COOKIE);
		$_REQUEST.putAll($_POST);
	}
	public HttpRequest(String method, String path, String protocol, MultiValueHashMap<String, String> headers, Map<String, String> getFields, HashMap<String, String> postFields, HashMap<String, String> cookies, HashMap<String, String> multipartData, WeakReference<Socket> socket) {
		this.method = method;
		this.path = path;
		this.protocol = protocol;
		this.socket = socket;
		//because final
		this.headers = headers;
		this.getFields = getFields;
		this.postFields = postFields;
		this.cookies = cookies;
		this.multipartData = multipartData;
		this.$_GET = this.getFields;
		this.$_POST = this.postFields;
		this.$_COOKIE = this.cookies;
		this.$_FILE = this.multipartData;
		this.$_REQUEST = new HashMap<>($_GET);
		$_REQUEST.putAll($_COOKIE);
		$_REQUEST.putAll($_POST);
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
	public boolean hasHeader(String name) {
		return this.headers.containsKey(name);
	}
	public String getProtocol() {
		return this.protocol;
	}
	public String getPath() {
		return this.path;
	}
	public String getMethod() {
		return this.method;
	}
	public WeakReference<Socket> getSocket() {
		return this.socket;
	}
	public static class HttpRequestBuilder {
		public static final Pattern headerParser = Pattern.compile("(?<name>.*?): (?<value>.*?)");
		public static HttpRequest fromStream(InputStream is) throws IOException {
			return fromStream(new BufferedInputStream(is));
		}
		public static HttpRequest fromStream(BufferedInputStream bis) throws IOException {
			System.out.println("Reading bytes...");
			ByteArrayOutputStream baos = new ByteArrayOutputStream();//for character-encoding fixes
			{
				byte[] buffer = new byte[1024 * 4];
				int len;
				while ((len = bis.read(buffer, 0, Math.min(bis.available(), buffer.length)))>0)
					baos.write(buffer, 0, len);
			}
			
			//convert from byte array to string. This is kind of hard, because it might be using a different charset that is default.
			System.out.println("Stringifying...");
			List<String> lines;
			{
				String encoding = Charset.defaultCharset().name();
				String[] lineArr = new String(baos.toByteArray(), 0, baos.size(), encoding).split("\n");
				for (int i=0;i<lineArr.length;i++) {
					String line = lineArr[i] = lineArr[i].trim();
					System.out.println("LINE"+i+"\t"+line);
					if (line.startsWith("Content-Type:")) {
						int csstart = line.indexOf("charset=", 13)+8;//get start of charset name
						if (csstart>21) {
							String charset = line.substring(csstart, line.length()).trim();//get charset (meaningless if line.indexOf('charset=')<0
							if (charset.equalsIgnoreCase("cp1252"))
								charset="windows-1252";
							if (!charset.equalsIgnoreCase(encoding)) {
								System.out.println("Switching charsets from " + encoding + " to " + charset);
								encoding = charset;
								lineArr = new String(baos.toByteArray(), 0, baos.size(), encoding).split("\n");
								for (int j=0;i<lineArr.length;j++)
									System.out.println("LX "+(lineArr[j] = lineArr[j].trim()));
							}
						}
						break;
					}
				}
				System.out.println("done");
				lines = Arrays.asList(lineArr);
				System.out.println(lines);
			}
			
			//now, build the request
			HttpRequestBuilder builder = new HttpRequestBuilder();
			//TODO finish
			//for (int i=1; i<)
			return null;
		}
		protected String method, path, protocol;
		protected MultiValueHashMap<String, String> headers = new MultiValueHashMap<>();
		protected final HashMap<String, String> getFields = new HashMap<>(),
				postFields = new HashMap<>(),
				cookies = new HashMap<>(),
				multipartData = new HashMap<>();
		protected WeakReference<Socket> socket;
		/**
		 * Set method used
		 * @param method HTTP method (e.g., {@code GET} or {@code DELETE}; case-insensitive)
		 * @return self
		 */
		public HttpRequestBuilder setMethod(String method) {
			this.method = method.toUpperCase();
			return this;
		}
		/**
		 * Set requested path
		 * @param path path
		 * @return self
		 */
		public HttpRequestBuilder setPath(String path) {
			this.path = path;
			return this;
		}
		
		/**
		 * Set protocol for request (e.g., {@code HTTP/1.1})
		 * @param protocol new value
		 * @return self
		 */
		public HttpRequestBuilder setProtocol(String protocol) {
			this.protocol = protocol;
			return this;
		}
		
		/**
		 * Add header to request (don't get of any others if they already are there)
		 * @param name header name (case insensitive)
		 * @param value header value
		 * @return
		 */
		public HttpRequestBuilder addHeader(String name, String value) {
			headers.add(name.toLowerCase(), value);
			return this;
		}
		/**
		 * Add multiple headers by the same name
		 * @param name header name (case insensitive)
		 * @param values all values for the header
		 * @return self
		 */
		public HttpRequestBuilder addHeader(String name, String...values) {
			headers.addAll(name.toLowerCase(), Arrays.asList(values));
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
		public HttpRequestBuilder setSocket(Socket socket) {
			this.socket = new WeakReference<>(socket);
			return this;
		}
		public HttpRequest build() {
			return new HttpRequest(method, path, protocol, headers, getFields, postFields, cookies, multipartData, socket);
		}
	}
}
