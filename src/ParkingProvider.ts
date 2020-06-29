export default class ParkingProvider {
    id: number;
    organisationNumber: number;
    name: string;

    constructor(id: number, organisationNumber: number, name: string) {
        this.id = id;
        this.organisationNumber = organisationNumber;
        this.name = name;
    }
}
