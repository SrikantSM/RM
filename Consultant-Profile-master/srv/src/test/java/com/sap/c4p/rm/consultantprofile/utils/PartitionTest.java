package com.sap.c4p.rm.consultantprofile.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.AbstractList;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class PartitionTest {
    /** object under test */
    private Partition<Object> cut;
    private List<Object> mockList;
    private int mockBatchSize;
    private Object mockObj;

    /**
     * initialize object under test
     */
    @BeforeEach
    public void beforeEach() {
        // init class under test
        mockList = new ArrayList<>();
        this.cut = new Partition<Object>(mockList, mockBatchSize);
    }

    @Test
    @DisplayName("Check index get method for failure case")
    public void testFailIndex() {
        mockList.add(3);
        mockBatchSize = -1;
        final Partition<Object> cut2 = new Partition<Object>(mockList, mockBatchSize);
        assertThrows(IndexOutOfBoundsException.class, () -> {
            cut2.get(1);
        });
    }

    @Test
    @DisplayName("Check hashCode method")
    public void testHashCode() {
        final Partition<Object> cut2 = new Partition<Object>(mockList, mockBatchSize);
        mockList.add(3);
        assert (cut.hashCode() == cut2.hashCode());
    }

    @Test
    @DisplayName("Test if false is returned when object is null")
    public void testNullObject() {
        Object obj = null;
        assertEquals(false, cut.equals(obj));
    }

    @Test
    @DisplayName("Test if false is returned when object is not same as class")
    public void testnonNullObject() {
        Object obj = new Object();
        assertEquals(false, cut.equals(obj));
    }

    @Test
    @DisplayName("Test if true is returned when object is same as class")
    public void testSameObject() {
        Object obj = this.cut;
        assertEquals(true, cut.equals(obj));
    }

    @Test
    @DisplayName("Test if false is returned when getClass is different")
    public void testGetClass() {
        Object obj = new Object();
        final AbstractList<Object> cut2 = null;
        assertEquals(false, cut.equals(cut2));
    }

    @Test
    @DisplayName("Test if false is returned when batchsize is different")
    public void testBatchSize() {
        final Partition<Object> cut2 = new Partition<Object>(mockList, 10);
        assertEquals(false, cut.equals(cut2));
    }

    @Test
    @DisplayName("Test if false is returned when List is null")
    public void testList() {
        List<Object> listInt = new ArrayList<>();
        listInt.add("Test");
        final Partition<Object> cut2 = new Partition<Object>(listInt, mockBatchSize);
        assertEquals(false, cut.equals(cut2));
    }

    @Test
    @DisplayName("Test if true is returned when objects are equal")
    public void testSuccess() {
        final Partition<Object> cut2 = new Partition<Object>(mockList, mockBatchSize);
        assertEquals(true, cut.equals(cut2));
    }

}
