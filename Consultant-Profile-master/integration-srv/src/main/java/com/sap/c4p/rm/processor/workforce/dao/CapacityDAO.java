package com.sap.c4p.rm.processor.workforce.dao;

import java.util.List;

import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.resourcemanagement.resource.Capacity;

public interface CapacityDAO {
	
	List<Capacity> read(CqnPredicate finalFilter );
	
	void save(final List<Capacity> capacity);
	
}
