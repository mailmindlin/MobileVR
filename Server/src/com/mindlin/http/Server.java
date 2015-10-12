package com.mindlin.http;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.channels.spi.SelectorProvider;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

public class Server implements Runnable {
	protected final InetAddress address;
	protected final int port;
	
	protected ServerSocketChannel serverChannel;
	
	protected final Selector selector;
	
	protected ByteBuffer readBuffer = ByteBuffer.allocate(1024 * 8);
	
	//SSL stuff
	protected HashMap<Socket, SSLSocket> sslSocketMap;
	protected SSLSocketFactory sslFactory;
	
	public Server(int port) throws IOException {
		this(null, port);
	}
	public Server(InetAddress address, int port) throws IOException {
		this.address = address;
		this.port = port;
		
		this.selector = SelectorProvider.provider().openSelector();
	}
	
	public void start() throws IOException {
		open();
		run();
	}
	
	protected void open() throws IOException {
		this.serverChannel = ServerSocketChannel.open();
		this.serverChannel.configureBlocking(false);
		this.serverChannel.socket().bind(new InetSocketAddress(address, port));
		this.serverChannel.register(selector,  SelectionKey.OP_ACCEPT);
	}
	
	@Override
	public void run() {
		while (!Thread.interrupted()) {
			try {
				this.selector.select();
				
				Set<SelectionKey> selectedKeys = this.selector.selectedKeys();
				Iterator<SelectionKey> keyIterator = selectedKeys.iterator();
				while (keyIterator.hasNext()) {
					SelectionKey key = keyIterator.next();
					keyIterator.remove();
					if (!key.isValid())
						continue;
					if (key.isAcceptable()) {
						accept(key);
					} else if (key.isReadable()) {
						
					}
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	protected void accept(SelectionKey key) {
		try {
			ServerSocketChannel serverChannel = (ServerSocketChannel) key.channel();
			SocketChannel socketChannel = serverChannel.accept();
			socketChannel.configureBlocking(false);
			Socket socket = socketChannel.socket();
			this.registerSocket(socket, this.address.getHostAddress(), this.port);
			socketChannel.register(this.selector, SelectionKey.OP_READ);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	protected void read(SelectionKey key) throws IOException {
		this.readBuffer.clear();
		SocketChannel socketChannel = (SocketChannel)key.channel();
		try {
			int read = socketChannel.read(this.readBuffer);
			
			if (read == -1) {
				key.channel().close();
				key.cancel();
			} else {
				byte[] buf = new byte[read];
				this.readBuffer.position(0);
				this.readBuffer.get(buf);
				//TODO use read data
			}
		} catch (IOException e) {
			key.cancel();
			socketChannel.close();
		}
	}
	protected void readSSL(SelectionKey key) {
		SocketChannel socketChannel = (SocketChannel) key.channel();
		Socket socket = socketChannel.socket();
		
		SSLSocket sslSocket = (SSLSocket) this.sslSocketMap.get(socket);
		key.cancel();
		key.channel().configureBlocking(true);
		
		this.configureSSLSocket(socket, sslSocket);
		
		byte[] buf = new byte[0];//TODO fix
		int read;
		try {
			read = sslSocket.getInputStream().read(buf, 0, buf.length);
		} catch (SocketTimeoutException e) {
			read = 0;
		} catch (IOException e) {
			this.deregisterSocket(socket);
			return;
		}
	}
	protected void registerSocket(Socket socket, String hostAddress, int port) throws IOException {
		if (this.sslFactory == null)
			return;
		
		SSLSocket sslSocket = (SSLSocket) this.sslFactory.createSocket(socket, hostAddress, port, true);
		sslSocket.setUseClientMode(false);
		this.sslSocketMap.put(socket, sslSocket);
	}
	protected void deregisterSocket(Socket socket) {
		if (this.sslSocketMap != null)
			this.sslSocketMap.remove(socket);
	}
	
}
