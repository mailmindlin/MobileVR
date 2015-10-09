package com.mindlin.http;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

public class HttpServer implements Runnable, Consumer<Socket> {
	protected final int port;
	protected ExecutorService executor;
	public HttpServer() {
		this(1234, Executors.newCachedThreadPool());
	}
	public HttpServer(int port) {
		this(port, Executors.newCachedThreadPool());
	}
	public HttpServer(ExecutorService exec) {
		this(1234, exec);
	}
	public HttpServer(int port, ExecutorService exec) {
		this.executor = exec;
		this.port = port;
	}
	public void run() {
		try (ServerSocket ssocket = new ServerSocket(this.port)) {
			System.out.println("Bound http server to "+port);
			while (!Thread.interrupted()) {
				Socket connection = ssocket.accept();
				executor.submit((Runnable)()->(this.accept(connection)));
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	@Override
	public void accept(Socket connection) {
		try {
			System.out.println("Recieved connection from "+connection.getInetAddress().toString());
			
			BufferedInputStream from = new BufferedInputStream(connection.getInputStream());
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			byte[] buffer = new byte[1024*16];//16kb buffer
			int len;
			while ((len = from.read(buffer, 0, buffer.length))>-1)
				baos.write(buffer, 0, len);
			
			String s = new String(baos.toByteArray());
			System.out.println(s);
			
		}catch (IOException e) {
			e.printStackTrace();
		}
	}
}
