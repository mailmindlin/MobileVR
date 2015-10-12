package com.mindlin.util;

import java.net.URI;
import java.util.function.Predicate;

@FunctionalInterface
public interface URIFilter extends Predicate<URI> {
	public static URIFilter not(URIFilter f) {
		return f.not();
	}
	public static URIFilter and(URIFilter...filters) {
		return new AndURIFilter(filters);
	}
	
	@Override
	boolean test(URI t);
	
	default URIFilter and(URIFilter other) {
		return new AndURIFilter(this, other);
	}
	default URIFilter or(URIFilter other) {
		return new OrURIFilter(this, other);
	}
	default URIFilter not() {
		return (uri)->(!test(uri));
	}
	static class AndURIFilter implements URIFilter {
		protected final URIFilter[] filters;
		public AndURIFilter(URIFilter...filters) {
			this.filters = filters;
		}
		@Override
		public boolean test(URI uri) {
			for (URIFilter filter : filters)
				if (!filter.test(uri))
					return false;
			return true;
		}
		public AndURIFilter and(AndURIFilter other) {
			URIFilter[] filterArr = new URIFilter[this.filters.length + other.filters.length];
			System.arraycopy(this.filters, 0, filterArr, 0, this.filters.length);
			System.arraycopy(other.filters, 0, filterArr, this.filters.length, other.filters.length);
			return new AndURIFilter(filterArr);
		}
		@Override
		public AndURIFilter and(URIFilter other) {
			URIFilter[] filterArr = new URIFilter[this.filters.length + 1];
			filterArr[0] = other;
			System.arraycopy(this.filters, 0, filterArr, 1, this.filters.length);
			return new AndURIFilter(filterArr);
		}
		@Override
		public URIFilter not() {
			//just a bit more efficient
			return (uri) -> {
				for (URIFilter filter : filters)
					if (!filter.test(uri))
						return true;
				return false;
			};
		}
	}
	static class OrURIFilter implements URIFilter {
		protected final URIFilter[] filters;
		public OrURIFilter(URIFilter...filters) {
			this.filters = filters;
		}
		@Override
		public boolean test(URI uri) {
			for (URIFilter filter : filters)
				if (filter.test(uri))
					return true;
			return false;
		}
		public OrURIFilter or(OrURIFilter other) {
			URIFilter[] filterArr = new URIFilter[this.filters.length + other.filters.length];
			System.arraycopy(this.filters, 0, filterArr, 0, this.filters.length);
			System.arraycopy(other.filters, 0, filterArr, this.filters.length, other.filters.length);
			return new OrURIFilter(filterArr);
		}
		@Override
		public OrURIFilter or(URIFilter other) {
			URIFilter[] filterArr = new URIFilter[this.filters.length + 1];
			filterArr[0] = other;
			System.arraycopy(this.filters, 0, filterArr, 1, this.filters.length);
			return new OrURIFilter(filterArr);
		}
		@Override
		public URIFilter not() {
			//just a *bit* more efficient
			return (uri) -> {
				for (URIFilter filter : filters)
					if (filter.test(uri))
						return false;
				return true;
			};
		}
	}
	
}
