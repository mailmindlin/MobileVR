package com.mindlin.mobilevr;

import com.mindlin.http.HttpServer;

public class Main {
	public static void main(String...fred) {
		HttpServer s = new HttpServer(8081);
		s.start();
	}
}
