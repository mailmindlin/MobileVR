package com.mindlin.util;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * A generic event, that is cancellable
 * @author mailmindlin
 * 
 */
public class Event {
	protected final AtomicBoolean cancelled = new AtomicBoolean(false);
	protected final AtomicBoolean propogating = new AtomicBoolean(false);
	
	public void cancel() {
		cancel(true);
	}
	
	public void cancel(boolean cancel) {
		cancelled.set(cancel);
	}
	
	public boolean isCancelled() {
		return cancelled.get();
	}
	
	public boolean isPropogating() {
		return propogating.get();
	}
	
}

