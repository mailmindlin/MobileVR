package com.mindlin.mobilevr;

import com.mindlin.mobilevr.server.HttpServerRunner;

public class Main {
	public static void main(String...fred) {
		HttpServerRunner server = new HttpServerRunner();
		server.run();
	}
}
