"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParkingArea = /** @class */ (function () {
    function ParkingArea(id, parkingProvider, lattitude, longitude, deactivated, version, address, activationTime, parkingSizeCategory, facilityInformation) {
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
    return ParkingArea;
}());
exports.default = ParkingArea;
