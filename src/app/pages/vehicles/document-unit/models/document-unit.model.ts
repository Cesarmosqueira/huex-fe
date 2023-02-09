import { TruckFleet } from "../../truck-fleet/models/truck-fleet.model";

export class DocumentUnit {
    id: number;
    truckFleet: TruckFleet;
    fireExtinguisherExpiration: Date;
    firstAidKitExpiration: Date;
    technicalReviewExpiration: Date;
    namePhotoTechnicalReview: string;
    photoTechnicalReview: string;
    soatExpiration: Date;
    nameSoatPhoto: string;
    photoSoat: string;
    mtcExpiration: Date;
    namePhotoMtc: string;
    photoMtc: string;
    policy: string;
    expirationPolicy: Date;
    namePhotoPolicy: string;
    photoPolicy: string;
}