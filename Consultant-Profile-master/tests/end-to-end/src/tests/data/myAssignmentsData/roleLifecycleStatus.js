const roleLifecycleStatusUnRestricted = {
    code: 0,
    name: 'UnRestricted',
    descr: 'Unrestricted',
};

const roleLifecycleStatusRestricted = {
    code: 1,
    name: 'Restricted',
    descr: 'Restricted',
};

const roleLifecycleStatus = [
    roleLifecycleStatusUnRestricted,
    roleLifecycleStatusRestricted,
];

module.exports = {
    roleLifecycleStatus,
    roleLifecycleStatusUnRestricted,
    roleLifecycleStatusRestricted,
};
