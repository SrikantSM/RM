using ManageResourceRequestService from '../../services/manage';
annotate ManageResourceRequestService.CatalogsConsumption with {
    // Name Filter
    name
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>SKILL_CATALOGS}',
            FieldControl : #ReadOnly,
        }
    );
    // Value Help
    ID
    @(
        Common : {
            Label : '{i18n>NAME}',
            Text : name,
            TextArrangement : #TextOnly
        }
    );
    description
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>DESCRIPTION}',
            FieldControl : #ReadOnly,
        }
    );
}

