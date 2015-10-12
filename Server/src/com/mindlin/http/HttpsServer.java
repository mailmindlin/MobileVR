package com.mindlin.http;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLServerSocket;

public class HttpsServer extends HttpServer {
	public static HttpsServer loadFromJKS(int port, Path keystorePath, char[] keystorePassword, char[] ctPass) throws NoSuchAlgorithmException, CertificateException, IOException, KeyStoreException, UnrecoverableKeyException, KeyManagementException {
		KeyStore keystore = KeyStore.getInstance("JKS");
		//load KeyStore from file
		keystore.load(Files.newInputStream(keystorePath), keystorePassword);
		KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
		kmf.init(keystore, ctPass);
		SSLContext ctx = SSLContext.getInstance("TLS");
		ctx.init(kmf.getKeyManagers(), null, null);
		return new HttpsServer(port, ctx);
	}
	protected final SSLContext ctx;
	public HttpsServer(int port, SSLContext ctx) {
		super(port);
		this.ctx = ctx;
	}
	
	@Override
	public SSLServerSocket makeSocket(int port) throws IOException {
		return (SSLServerSocket)ctx.getServerSocketFactory().createServerSocket(port);
	}
	
}
