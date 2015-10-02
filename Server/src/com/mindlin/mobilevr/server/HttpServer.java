package com.mindlin.mobilevr.server;

public class HttpServer implements Runnable {
	protected int port = 1234;
	public HttpServer() {
		
	}
	public HttpServer(int port) {
		this.port = port;
	}
	public void run() {
		try (ServerSocket ssocket = new ServerSocket(this.port)) {
			
		}
	}
}
