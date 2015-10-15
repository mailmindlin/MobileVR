package com.mindlin.util;

import java.util.AbstractMap;
import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.function.BinaryOperator;
import java.util.function.Supplier;
import java.util.stream.Collectors;


public class MultiValueMap<K, V, L extends Collection<V>> implements Map<K, L> {
	protected final Map<K, L> map;
	protected final Supplier<L> collectionGenerator;
	public MultiValueMap(Map<K, L> map, Supplier<L> collectionSupplier) {
		this.map = map;
		this.collectionGenerator = collectionSupplier;
	}
	@Override
	public void clear() {
		map.clear();
		map.entrySet().stream();
	}

	@Override
	public boolean containsKey(Object key) {
		return map.containsKey(key);
	}

	@Override
	public boolean containsValue(Object value) {
		return map.values().stream().filter((c)->(c.contains(value))).findFirst().isPresent();
	}

	@Override
	public Set<Map.Entry<K, L>> entrySet() {
		return map.entrySet();
	}
	
	public Set<Map.Entry<K, V>> flatEntrySet() {
		return entrySet().stream()
			.flatMap((entry->(entry.getValue().stream().map((v)->(new AbstractMap.SimpleEntry<>(entry.getKey(), v))))))
			.collect(Collectors.toSet());
	}
	
	public Map<K, V> flatten(Supplier<Map<K, V>> mapSupplier, BinaryOperator<V> mergeFunction) {
		return entrySet().stream()
			.flatMap((entry)->(entry.getValue().stream().map((v)->(new AbstractMap.SimpleEntry<K, V>(entry.getKey(), v)))))
			.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, mergeFunction, mapSupplier));
	}

	@Override
	public L get(Object key) {
		return map.get(key);
	}
	
	public V getFirst(K key) {
		Collection<V> values = get(key);
		if (values == null || values.isEmpty())
			return null;
		return values.iterator().next();
	}

	@Override
	public boolean isEmpty() {
		return map.isEmpty();
	}

	@Override
	public Set<K> keySet() {
		return map.keySet();
	}

	@Override
	public L put(K key, L value) {
		return map.put(key, value);
	}
	
	public Collection<V> put(K key, V value) {
		L list = collectionGenerator.get();
		list.add(value);
		return put(key, list);
	}
	
	public void add(K key, V value) {
		map.computeIfAbsent(key, (x)->(collectionGenerator.get())).add(value);
	}

	@Override
	public void putAll(Map<? extends K, ? extends L> m) {
		map.putAll(m);
	}
	
	public <M extends Collection<? extends V>> void addAll(K key, M values) {
		map.computeIfAbsent(key, (x)->(collectionGenerator.get())).addAll(values);
	}
	
	public void assimilate(Map<? extends K, ? extends Collection<? extends V>> m) {
		for (Map.Entry<? extends K, ? extends Collection<? extends V>> entry : m.entrySet())
			addAll(entry.getKey(), entry.getValue());
	}

	@Override
	public L remove(Object key) {
		return map.remove(key);
	}

	@Override
	public int size() {
		return map.size();
	}
	
	public int size(String key) {
		return map.containsKey(key)?map.get(key).size():0;
	}

	@Override
	public Collection<L> values() {
		return map.values();
	}
	
	public Collection<V> values(String key) {
		return map.containsKey(key) ? map.get(key) : null;
	}
}
