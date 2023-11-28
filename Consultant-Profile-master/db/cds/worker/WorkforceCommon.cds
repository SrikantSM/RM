namespace com.sap.resourceManagement.workforce.workforceCommon;

using { cuid, managed} from '@sap/cds/common';

aspect trackParent : managed {
    parent : cds.UUID;
}

aspect temporal {
    validFrom : Date @cds.valid.from;
    validTo   : Date @cds.valid.to;
}

aspect temporalWithoutAnnotation {
    validFrom : Date;
    validTo   : Date;
}

aspect composites : cuid, trackParent {}

aspect temporalComposites : temporal, trackParent {
    key ID : cds.UUID @cds.valid.key;
}

aspect temporalCompositesWithoutAnnotation : temporalWithoutAnnotation, trackParent {
    key ID : cds.UUID;
}
