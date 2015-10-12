package com.mindlin.http;

public class ServerProperties {
	protected final int port;
	public ServerProperties(int port) {
		this.port = port;
	}
	public int getPort() {
		return port;
	}
}
