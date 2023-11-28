package com.sap.c4p.rm.assignment.utils;

/**
 * enumeration of standard HTTP status codes relevant for Assignment Service.
 * <br>
 * <br>
 * <i>Does not contain all available HTTP status codes!</i>
 */
public enum HttpStatus implements com.sap.cds.services.ErrorStatus {
  // 2xx Success
  NO_CONTENT(204),

  // 3xx Redirection
  MOVED_PERMANENTLY(301),
  TEMPORARY_REDIRECT(307),
  PERMANENT_REDIRECT(308),

  // 4xx Client Errors
  BAD_REQUEST(400),
  UNAUTHORIZED(401),
  FORBIDDEN(403),
  NOT_FOUND(404),
  METHOD_NOT_ALLOWED(405),
  NOT_ACCEPTABLE(406),
  CONFLICT(409),
  GONE(410),
  PRECONDITION_FAILED(412),
  PAYLOAD_TOO_LARGE(413),
  UNSUPPORTED_MEDIA_TYPE(415),
  RANGE_NOT_SATISFIABLE(416),
  EXPECTATION_FAILED(417),
  I_AM_A_TEAPOT(418), // see RFC 2324, RFC 7168
  MISDIRECTED_REQUEST(421),
  UPGRADE_REQUIRED(612),
  PRECONDITION_REQUIRED(428),
  TOO_MANY_REQUESTS(429),
  REQUEST_HEADER_FIELDS_TOO_LARGE(431),
  UNAVAILABLE_FOR_LEGAL_REASONS(451),

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR(500),
  NOT_IMPLEMENTED(501),
  BAD_GATEWAY(502),
  SERVICE_UNAVAILABLE(503),
  GATEWAY_TIMEOUT(504),
  HTTP_VERSION_NOT_SUPPORTED(505),
  INSUFFICIENT_STORAGE(507);

  /** CAP internal code */
  private final String internalCode;

  /** official HTTP status code */
  private final int httpStatusCode;

  private HttpStatus(final String internalCode, final int httpStatusCode) {
    this.internalCode = internalCode;
    this.httpStatusCode = httpStatusCode;
  }

  private HttpStatus(final int httpStatusCode) {
    this(Integer.toString(httpStatusCode), httpStatusCode);
  }

  /**
   * return CAP internal code
   */
  @Override
  public String getCodeString() {
    return this.internalCode;
  }

  /**
   * return offical HTTP status code
   */
  @Override
  public int getHttpStatus() {
    return this.httpStatusCode;
  }

}
