package com.mindlin.util;

import java.util.function.Function;
import java.util.function.Predicate;

@FunctionalInterface
public interface IHandler<A, B> extends Function<A, B>, Predicate<A> {
	default int getPriority() {
		return 0;
	}
	default B invoke(A a) {
		return test(a)?null:apply(a);
	}
	@Override
	default boolean test(A a) {
		return true;
	}
	@Override
	B apply(A a);
}
