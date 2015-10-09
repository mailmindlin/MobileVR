package com.mindlin.http;

import java.io.IOException;
import java.io.InputStream;

public class LongByteArrayOutputStream {
	public static final int MAX_BUFFER_SIZE = Integer.MAX_VALUE;
	public static final long LMAX_BUFFER_SIZE = (long)Integer.MAX_VALUE;
	protected long pos, capacity;
	protected int topArrSize;
	protected byte[][] bufarr;
	
	public LongByteArrayOutputStream(long initCap) {
		this.capacity = initCap;
		this.topArrSize = (int)(initCap % (long)MAX_BUFFER_SIZE);
		
	}
	public InputStream toInputStream() {
		return new InputStream() {
			protected long ispos = 0;
			@Override
			public int read() throws IOException {
				byte[] tmp = new byte[1];
				if (read(tmp) < 1)
					throw new IOException("Out of bytes");
				return tmp[0] & 0xFF;
			}
			public int available() {
				return (int) Math.min(pos, (long)Integer.MAX_VALUE);
			}
			public int read(byte[] buf, int off, int len) {
				int read = 0;//how many bytes have been read so far
				while (read < len) {
					int cbindex = (int)((ispos + read)/LMAX_BUFFER_SIZE);
					if (cbindex >= bufarr.length || cbindex < 0)//return if it ran out of space
						return len;
					byte[] cbuf = bufarr[cbindex];//get current buffer
					int cboff = (int)((ispos + read) % LMAX_BUFFER_SIZE);//get offset for current buffer
					if (cboff > cbuf.length)
						return len;//we went past the end of the lbaos
					int toRead = Math.min(cbuf.length - cboff, len - read);//calculate how much many bytes it can read
					System.arraycopy(cbuf, cboff, buf, off + read, toRead);//copy arrays
					read+=toRead;
				}
				ispos+=read;//increment position
				return read;
			}
		};
	}
}
