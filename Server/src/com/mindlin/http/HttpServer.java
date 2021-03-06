package com.mindlin.http;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.LinkedList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.function.Function;

import javax.net.ServerSocketFactory;

public class HttpServer extends Server implements Consumer<Socket> {
	protected final int port;
	protected AtomicInteger threadsRunning = new AtomicInteger(0);
	protected ExecutorService executor;
	protected LinkedList<Function<HttpRequest, HttpEventHandlerResponse<?>>> requestHandlers = new LinkedList<>();
	public HttpServer() throws IOException {
		this(1234, Executors.newCachedThreadPool());
	}
	public HttpServer(int port) throws IOException {
		this(port, Executors.newCachedThreadPool());
	}
	public HttpServer(ExecutorService exec) throws IOException {
		this(1234, exec);
	}
	public HttpServer(int port, ExecutorService exec) throws IOException {
		super(port);
		this.executor = exec;
		this.port = port;
	}
	protected ServerSocket makeSocket(int port) throws IOException {
		return ServerSocketFactory.getDefault().createServerSocket(this.port);
	}
	public HttpServer onRequest(Function<HttpRequest, HttpEventHandlerResponse<?>> handler) {
		requestHandlers.add(handler);
		return this;
	}
	public void start() {
		if (executor == null)
			run();
		else
			executor.submit(this);
	}
	public void run() {
		if (executor !=null)
			threadsRunning.incrementAndGet();
		
		try (ServerSocket ssocket = makeSocket(this.port)) {
			System.out.println("Bound http server to "+port);
			while (!Thread.interrupted()) {
				Socket connection = ssocket.accept();
				if (executor != null)
					executor.submit(((Runnable)()->{
						threadsRunning.incrementAndGet();
						this.accept(connection);
						threadsRunning.decrementAndGet();
					}));
				else
					this.accept(connection);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (executor != null)
				threadsRunning.decrementAndGet();
		}
	}
	@Override
	public void accept(Socket connection) {
		try {
			System.out.println("Recieved connection from "+connection.getInetAddress().toString());
			
			BufferedInputStream from = new BufferedInputStream(connection.getInputStream());
			HttpRequest request = HttpRequest.HttpRequestBuilder.fromStream(from);
			System.out.println(request.toString());
			
			for (Function<HttpRequest, HttpEventHandlerResponse<?>> handler : requestHandlers) {
//				HttpEventHandlerResponse<?> result = 
			}
		}catch (IOException e) {
			e.printStackTrace();
		}
	}
}
