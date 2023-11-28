package com.sap.c4p.rm.assignment.simulation;

public class AssignmentSimulatorData {

  // public static Instant convertStringToInstant(String dateStr) {

  // Instant instant = Instant.parse(dateStr);

  // return instant;

  // }

  // public static Result getListOfRows() {

  // List<HashMap<String, Object>> list = new ArrayList<HashMap<String,
  // Object>>();

  // HashMap<String, Object> map = new HashMap<>();

  // Object obj = convertStringToInstant("2018-01-01T00:00:00Z");
  // map.put("startTime", obj);
  // map.put("endTime", obj);
  // map.put("requestedCapacityInMinutes", 60);
  // map.put("workingTimeInMinutes", 480);

  // list.add(map);

  // HashMap<String, Object> map2 = new HashMap<>();

  // Object obj2 = convertStringToInstant("2018-01-01T00:00:00Z");
  // map2.put("startTime", obj2);
  // map2.put("endTime", obj2);
  // map2.put("requestedCapacityInMinutes", 60);
  // map2.put("workingTimeInMinutes", 480);

  // list.add(map2);

  // HashMap<String, Object> map3 = new HashMap<>();

  // Object obj3 = convertStringToInstant("2018-01-01T00:00:00Z");
  // map3.put("startTime", obj3);
  // map3.put("endTime", obj3);
  // map3.put("requestedCapacityInMinutes", 60);
  // map3.put("workingTimeInMinutes", 480);

  // list.add(map3);

  // Result result = ResultBuilder.selectedRows(list).result();

  // return result;

  // }

  // public static Result getListOfRowsOfResourceCapacityUnavailabilityCase() {
  // List<HashMap<String, Object>> list = new ArrayList<HashMap<String,
  // Object>>();

  // HashMap<String, Object> map = new HashMap<>();

  // Object objStart = convertStringToInstant("2018-01-01T00:00:00Z");
  // Object objEnd = convertStringToInstant("2018-01-02T00:00:00Z");
  // map.put("startTime", objStart);
  // map.put("endTime", objEnd);
  // map.put("requestedCapacityInMinutes", 60);
  // map.put("workingTimeInMinutes", 480);

  // list.add(map);
  // Result result = ResultBuilder.selectedRows(list).result();

  // return result;
  // }

  // public static Result getListOfRowsOfResourceCapacity() {
  // List<HashMap<String, Object>> list = new ArrayList<HashMap<String,
  // Object>>();

  // HashMap<String, Object> map = new HashMap<>();

  // Object objStart = convertStringToInstant("2018-01-01T00:00:00Z");
  // Object objEnd = convertStringToInstant("2018-01-02T00:00:00Z");
  // map.put("startTime", objStart);
  // map.put("endTime", objEnd);
  // map.put("requestedCapacityInMinutes", 60);
  // map.put("workingTimeInMinutes", 480);

  // list.add(map);

  // HashMap<String, Object> map2 = new HashMap<>();

  // Object obj2Start = convertStringToInstant("2018-01-02T00:00:00Z");
  // Object obj2End = convertStringToInstant("2018-01-03T00:00:00Z");
  // map2.put("startTime", obj2Start);
  // map2.put("endTime", obj2End);
  // map2.put("requestedCapacityInMinutes", 60);
  // map2.put("workingTimeInMinutes", 480);

  // list.add(map2);

  // HashMap<String, Object> map3 = new HashMap<>();

  // Object obj3Start = convertStringToInstant("2018-01-05T00:00:00Z");
  // Object obj3End = convertStringToInstant("2018-01-06T00:00:00Z");
  // map3.put("startTime", obj3Start);
  // map3.put("endTime", obj3End);
  // map3.put("requestedCapacityInMinutes", 60);
  // map3.put("workingTimeInMinutes", 480);

  // list.add(map3);
  // Result result = ResultBuilder.selectedRows(list).result();

  // return result;
  // }

  // public static List<AssignmentDistributionContainer> expectedList(int
  // workingTimeInMinutes) {
  // List<AssignmentDistributionContainer> assignmentBuckets = new
  // ArrayList<AssignmentDistributionContainer>();
  // AssignmentDistributionContainer assignmentDistributionContainer1 = new
  // AssignmentDistributionContainer(
  // convertStringToInstant("2018-01-01T00:00:00Z"), workingTimeInMinutes, 60);
  // AssignmentDistributionContainer assignmentDistributionContainer2 = new
  // AssignmentDistributionContainer(
  // convertStringToInstant("2018-01-02T00:00:00Z"), workingTimeInMinutes, 60);
  // AssignmentDistributionContainer assignmentDistributionContainer3 = new
  // AssignmentDistributionContainer(
  // convertStringToInstant("2018-01-05T00:00:00Z"), workingTimeInMinutes, 60);

  // assignmentBuckets.add(assignmentDistributionContainer1);
  // assignmentBuckets.add(assignmentDistributionContainer2);
  // assignmentBuckets.add(assignmentDistributionContainer3);

  // return assignmentBuckets;
  // }

  // public static List<AssignmentDistributionContainer> expectedMapRowList() {
  // List<AssignmentDistributionContainer> capacityContainerList = new
  // ArrayList<AssignmentDistributionContainer>();
  // AssignmentDistributionContainer assignmentDistributionContainer1 = new
  // AssignmentDistributionContainer(
  // convertStringToInstant("2018-01-01T00:00:00Z"), 480, 0);
  // AssignmentDistributionContainer assignmentDistributionContainer2 = new
  // AssignmentDistributionContainer(
  // convertStringToInstant("2018-01-01T00:00:00Z"), 480, 0);
  // AssignmentDistributionContainer assignmentDistributionContainer3 = new
  // AssignmentDistributionContainer(
  // convertStringToInstant("2018-01-01T00:00:00Z"), 480, 0);

  // capacityContainerList.add(assignmentDistributionContainer1);
  // capacityContainerList.add(assignmentDistributionContainer2);
  // capacityContainerList.add(assignmentDistributionContainer3);

  // return capacityContainerList;
  // }

}
