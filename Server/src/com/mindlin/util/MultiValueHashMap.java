package com.mindlin.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

public class MultiValueHashMap<K, V> extends MultiValueMap<K, V, List<V>>{
	public MultiValueHashMap() {
		this(ArrayList<V>::new);
	}
	public MultiValueHashMap(Supplier<List<V>> collectionSupplier) {
		super(new HashMap<>(), collectionSupplier);
	}
	public MultiValueHashMap(Map<? extends K, ? extends Collection<? extends V>> map) {
		this(new HashMap<>());
		this.assimilate(map);
	}
	public MultiValueHashMap(HashMap<K, List<V>> map) {
		super(map, ArrayList<V>::new);
	}
	public MultiValueHashMap(HashMap<K, List<V>> map, Supplier<List<V>> collectionSupplier) {
		super(map, collectionSupplier);
	}
}
