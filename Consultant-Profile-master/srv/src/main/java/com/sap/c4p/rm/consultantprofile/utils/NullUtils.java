package com.sap.c4p.rm.consultantprofile.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Utility class to provide some generic null checks
 */
public final class NullUtils {

    private NullUtils() {

    }

    /**
     * This API checks whether the Object is null or not.
     *
     * @param obj This is the object to be check.
     * @return boolean
     *         <code> true, if the input object is null, otherwise false </code>.
     */
    public static boolean isNullOrEmpty(Object obj) {
        return (obj == null);
    }

    /**
     * This API checks whether the String is null/empty or not.
     *
     * @param str This is the string object to be check.
     * @return boolean
     *         <code> true, if the input string object is null or empty, otherwise false </code>.
     */
    public static boolean isNullOrEmpty(String str) {
        return !(str != null && !str.trim().isEmpty());
    }

    /**
     * This API checks whether the Collection object is null/empty or not.
     *
     * @param collection This is the collection object to be check.
     * @return boolean
     *         <code> true, if the input collection object is null or size of the input collection object is 0, otherwise false </code>.
     */
    public static <E> boolean isNullOrEmpty(Collection<E> collection) {
        return !(collection != null && !collection.isEmpty());
    }

    /**
     * This API checks whether the Iterable object is null/empty or not.
     *
     * @param <E>
     * @param collection This is the Iterable object to be check.
     * @return boolean
     *         <code> true, if the input Iterable object is null or size of the input Iterable object is 0, otherwise false </code>.
     */
    public static <E> boolean isNullOrEmpty(Iterable<E> iterable) {
        if (iterable != null) {
            List<E> list = new ArrayList<>();
            Iterator<E> iterator = iterable.iterator();
            while (iterator.hasNext()) {
                list.add(iterator.next());
                break;
            }
            if (!list.isEmpty()) {
                return false;
            }
        }
        return true;
    }

    /**
     * This API checks whether the Array object is null/empty or not.
     *
     * @param <E>
     * @param collection This is the Iterable object to be check.
     * @return boolean
     *         <code> true, if the input Iterable object is null or size of the input Iterable object is 0, otherwise false </code>.
     */
    public static <E> boolean isNullOrEmpty(E[] array) {
        if (array != null) {
            List<E> list = Arrays.asList(array);
            if (list != null && !list.isEmpty()) {
                return false;
            }
        }
        return true;
    }

    /**
     * This API checks whether the Map object is null or not.
     *
     * @param <E>
     *
     * @param Map This is the Map object to be check.
     * @return boolean
     *         <code> true, if the input object is null, otherwise false </code>.
     */
    public static <E> boolean isNullOrEmpty(Map<String, E> map) {
        return (map == null || map.isEmpty());
    }

}
