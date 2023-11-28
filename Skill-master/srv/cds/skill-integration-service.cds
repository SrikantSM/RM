
service SkillIntegrationService @(restrict: [
  { grant: 'READ', to: 'authenticated-user' },
  { grant: 'isSkillMDIReplicationAllowed', to: 'ReplicationSchedules.Edit' }
]){

    function isSkillMDIReplicationAllowed() returns Boolean;
}
