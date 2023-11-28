package com.sap.c4p.rm.consultantprofile.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class NullUtilsTest {

    @Test
    @DisplayName("Test if true is returned when object is null")
    public void testNullObject() {
        Object obj = null;
        assertEquals(true, NullUtils.isNullOrEmpty(obj));
    }

    @Test
    @DisplayName("Test if false is returned when object is not null")
    public void testnonNullObject() {
        Object obj = new Object();
        assertEquals(false, NullUtils.isNullOrEmpty(obj));
    }

    @Test
    @DisplayName("Test if true is returned when string is null")
    public void testNullString() {
        String str = null;
        assertEquals(true, NullUtils.isNullOrEmpty(str));
    }

    @Test
    @DisplayName("Test if true is returned when string is empty")
    public void testEmptyString() {
        String str = "";
        assertEquals(true, NullUtils.isNullOrEmpty(str));
    }

    @Test
    @DisplayName("Test if false is returned when string is not empty")
    public void testNonEmptyString() {
        String str = "Test";
        assertEquals(false, NullUtils.isNullOrEmpty(str));
    }

    @Test
    @DisplayName("Test if true is returned when collection is null")
    public void testNullCollection() {
        Collection<String> collection = null;
        assertEquals(true, NullUtils.isNullOrEmpty(collection));
    }

    @Test
    @DisplayName("Test if true is returned when collection is empty")
    public void testEmptyCollection() {
        List<String> list = Collections.emptyList();
        assertEquals(true, NullUtils.isNullOrEmpty(list));
    }

    @Test
    @DisplayName("Test if false is returned when collection is not empty")
    public void testNonEmptyCollection() {
        List<String> list = Arrays.asList("Test");
        assertEquals(false, NullUtils.isNullOrEmpty(list));
    }

    @Test
    @DisplayName("Test if true is returned when iterable is null")
    public void testNullIterable() {
        Iterable<String> it = null;
        assertEquals(true, NullUtils.isNullOrEmpty(it));
    }

    @Test
    @DisplayName("Test if true is returned when iterable is empty")
    public void testEmptyIterable() {
        List<String> list = new ArrayList<>();
        assertEquals(true, NullUtils.isNullOrEmpty((Iterable<String>) list));
    }

    @Test
    @DisplayName("Test if false is returned when iterable is not empty")
    public void testNonEmptyIterable() {
        List<String> list = new ArrayList<>();
        list.add("TestString");
        assertEquals(false, NullUtils.isNullOrEmpty((Iterable<String>) list));
    }

    @Test
    @DisplayName("Test if true is returned when array is null")
    public void testNullArray() {
        Integer[] intArray = null;
        assertEquals(true, NullUtils.isNullOrEmpty(intArray));
    }

    @Test
    @DisplayName("Test if true is returned when array is empty")
    public void testEmptyArray() {
        Integer[] intArray = {};
        assertEquals(true, NullUtils.isNullOrEmpty(intArray));
    }

    @Test
    @DisplayName("Test if false is returned when array is not empty")
    public void testNonEmptyArray() {
        Integer[] intArray = { 1 };
        assertEquals(false, NullUtils.isNullOrEmpty(intArray));
    }

    @Test
    @DisplayName("Test if true is returned when map is null")
    public void testNullMap() {
        Map<String, Integer> m = null;
        assertEquals(true, NullUtils.isNullOrEmpty(m));
    }

    @Test
    @DisplayName("Test if true is returned when map is empty")
    public void testEmptyMap() {
        Map<String, Integer> m = new HashMap<String, Integer>();
        assertEquals(true, NullUtils.isNullOrEmpty(m));
    }

    @Test
    @DisplayName("Test if false is returned when map is not empty")
    public void testNonEmptyMap() {
        Map<String, Integer> m = new HashMap<String, Integer>();
        m.put("k1", 1);
        assertEquals(false, NullUtils.isNullOrEmpty(m));
    }
}
