import ParkingProvider from './ParkingProvider';
import IFacilityInformation from './IFacilityInformation';

export default class ParkingArea {
    id: number;
    parkingProvider: ParkingProvider;
    lattitude: number;
    longitude: number;
    deactivated: boolean;
    version: number;
    address: IAddress;
    activationTime: Date;
    parkingSizeCategory: number;
    facilityInformation: IFacilityInformation;

    constructor(
        id: number,
        parkingProvider: ParkingProvider,
        lattitude: number,
        longitude: number,
        deactivated: boolean,
        version: number,
        address: IAddress,
        activationTime: Date,
        parkingSizeCategory: number,
        facilityInformation: IFacilityInformation
    ) {
        this.id = id;
        this.parkingProvider = parkingProvider;
        this.lattitude = lattitude;
        this.longitude = longitude;
        this.deactivated = deactivated;
        this.version = version;
        this.address = address;
        this.activationTime = activationTime;
        this.parkingSizeCategory = parkingSizeCategory;
        this.facilityInformation = facilityInformation;
    }
}

export interface IAddress {
    name: string;
    address: string;
    postCode: string;
    postArea: string;
}
