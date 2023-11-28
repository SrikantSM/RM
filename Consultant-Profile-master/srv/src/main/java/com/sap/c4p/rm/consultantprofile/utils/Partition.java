package com.sap.c4p.rm.consultantprofile.utils;

import java.util.AbstractList;
import java.util.ArrayList;
import java.util.List;

/**
 * Partitioning class transforms a collection of elements into a collection of
 * chunks of a given size.
 */
public final class Partition<T> extends AbstractList<List<T>> {

    private final List<T> list;
    private final int batchSize;

    public Partition(List<T> list, int batchSize) {
        this.list = new ArrayList<>(list);
        this.batchSize = batchSize;
    }

    /**
     * Returns consecutive {@linkplain List#subList(int, int) sublists} of a list,
     * each of the same size (the final list may be smaller). For example,
     * partitioning a list containing {@code [a, b, c, d, e]} with a partition size
     * of 3 yields {@code [[a, b, c], [d, e]]} -- an outer list containing two inner
     * lists of three and two elements, all in the original order.
     *
     * <p>
     * The outer list is unmodifiable, but reflects the latest state of the source
     * list. The inner lists are sublist views of the original list, produced on
     * demand using {@link List#subList(int, int)}, and are subject to all the usual
     * caveats about modification as explained in that API.
     *
     * * Adapted from http://code.google.com/p/google-collections/
     *
     * @param list the list to return consecutive sublists of
     * @param size the desired size of each sublist (the last may be smaller)
     * @return a list of consecutive sublists
     * @throws IllegalArgumentException if {@code partitionSize} is nonpositive
     */
    public static <T> Partition<T> ofSize(List<T> list, int batchSize) {
        return new Partition<>(list, batchSize);
    }

    @Override
    public List<T> get(int index) {
        int start = index * batchSize;
        int end = Math.min(start + batchSize, list.size());

        if (start > end) {
            throw new IndexOutOfBoundsException(
                    "Index " + index + " is out of the list range <0," + (size() - 1) + ">");
        }

        return new ArrayList<>(list.subList(start, end));
    }

    @Override
    public int size() {
        return (int) Math.ceil((double) list.size() / (double) batchSize);
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        return (prime * (prime * result + batchSize)) + ((list == null) ? 0 : list.hashCode());
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null)
            return false;
        if (this == obj)
            return true;
        if (getClass() != obj.getClass())
            return false;
        if (!super.equals(obj))
            return false;
        Partition<T> other = (Partition<T>) obj;
        if (batchSize != other.batchSize)
            return false;
        if (list == null) {
            if (other.list != null) {
                return false;
            }
        } else if (!list.equals(other.list)) {
            return false;
        }
        return true;
    }

}
