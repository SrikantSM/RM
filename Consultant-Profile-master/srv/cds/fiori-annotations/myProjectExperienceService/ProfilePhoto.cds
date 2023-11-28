using MyProjectExperienceService from '../../myProjectExperienceService';

annotate MyProjectExperienceService.ProfilePhoto with @(
    Common.SemanticKey : [ ID ],
    UI : {
        HeaderInfo : {
            TypeName: '{i18n>PROFILE_PHOTO}',
            TypeNamePlural : '{i18n>PROFILE_PHOTO}'
        },
    },
);

// Field Level annotations
annotate MyProjectExperienceService.ProfilePhoto with {
    ID                      @UI.Hidden: true ;
    employee_ID             @UI.Hidden: true ;
    profileImage            ;
};


annotate MyProjectExperienceService.ProfilePhoto with @(
    Common : {
        SideEffects #ProfilePhotoChange : {
            SourceProperties : [profileImage],
            TargetProperties : ['profileImage']
        }
    }
);
