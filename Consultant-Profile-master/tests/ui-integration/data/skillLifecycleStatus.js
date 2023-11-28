const skillLifecycleStatusUnRestricted = {
    code: 0,
    name: 'UnRestricted',
    descr: 'Unrestricted',
};

const skillLifecycleStatusRestricted = {
    code: 1,
    name: 'Restricted',
    descr: 'Restricted',
};

const skillLifecycleStatus = [
    skillLifecycleStatusUnRestricted,
    skillLifecycleStatusRestricted,
];

module.exports = {
    skillLifecycleStatus,
    skillLifecycleStatusUnRestricted,
    skillLifecycleStatusRestricted,
};
