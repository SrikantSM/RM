package com.sap.c4p.rm.consultantprofile.projectroleservice.pojo;

/***
 * This class is used to get and set Role LifecycleStatus code
 * UNRESTRICTED(0),RESTRICTED(1)
 */
public enum RoleLifecycleStatusCode {
    UNRESTRICTED(0),
    RESTRICTED(1);

    Integer code;

    private RoleLifecycleStatusCode(Integer code) {
        this.code = code;
    }

    public Integer getCode() {
        return this.code;
    }
}
