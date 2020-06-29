"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var ParkingArea_1 = __importDefault(require("./ParkingArea"));
var ParkingProvider_1 = __importDefault(require("./ParkingProvider"));
var app = express_1.default();
var parkingAreasURL = 'https://www.vegvesen.no/ws/no/vegvesen/veg/parkeringsomraade/parkeringsregisteret/v1/parkeringsomraade';
var parkingProvidersURL = 'https://www.vegvesen.no/ws/no/vegvesen/veg/parkeringsomraade/parkeringsregisteret/v1/parkeringstilbyder';
var parkingAreasObj = [];
var parkingProvidersObj = [];
var parkingAreas = [];
var parkingProviders = [];
// localhost:3000/?sizeCategory=2&showers=yes&....
app.get('/', function (req, res) {
    var sizeCategory = parseInt(req.query.size_category);
    var showers = new Boolean(req.query.showers);
    res.send(parkingAreas.filter(function (area) {
        return (area.parkingSizeCategory === sizeCategory &&
            (showers
                ? area.facilityInformation.showers > 0
                : area.facilityInformation.showers === 0));
    }));
    // 1. iterate over all params
    // 2. validate parameter and value
    // 3. compose query from valid parameters
    // 4. return result
});
getParkingProviders();
getParkingAreas();
function getParkingAreas() {
    if (fs_1.default.existsSync('./parkingAreas.json')) {
        var raw = fs_1.default.readFileSync('./parkingAreas.json');
        parkingAreasObj = JSON.parse(raw.toString());
        if (parkingProvidersObj.length > 0 && parkingAreasObj.length > 0) {
            populate();
        }
    }
    else {
        https_1.default.get(parkingAreasURL, function (res) {
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                try {
                    parkingAreasObj = JSON.parse(body);
                }
                catch (err) {
                    console.error(err);
                }
                if (parkingProvidersObj.length > 0 &&
                    parkingAreasObj.length > 0) {
                    populate();
                    if (parkingProvidersObj.length > 0 &&
                        parkingAreasObj.length > 0) {
                        populate();
                    }
                }
            });
        });
    }
}
function getParkingProviders() {
    if (fs_1.default.existsSync('./parkingProviders.json')) {
        var raw = fs_1.default.readFileSync('./parkingProviders.json');
        parkingProvidersObj = JSON.parse(raw.toString());
        if (parkingProvidersObj.length > 0 && parkingAreasObj.length > 0) {
            populate();
        }
    }
    else {
        https_1.default.get(parkingProvidersURL, function (res) {
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                try {
                    parkingProvidersObj = JSON.parse(body);
                }
                catch (err) {
                    console.error(err);
                }
            });
            if (parkingProvidersObj.length > 0 && parkingAreasObj.length > 0) {
                populate();
            }
        });
    }
}
function getFacilityInformation(parkingAreaId) {
    var info = {
        accommodations: Math.floor(Math.random() > 0.8 ? Math.random() * 20 : 0),
        kiosk: Math.random() > 0.6,
        laundry: Math.floor(Math.random() > 0.8 ? Math.random() * 10 : 0),
        showers: Math.floor(Math.random() > 0.8 ? Math.random() * 4 : 0),
    };
    return info;
}
/**
 * 0 : personbil
 * 1 : lastebil
 * 2 : tungtransport
 */
function getParkingSizeCategory(parkingAreaId) {
    return Math.floor(Math.random() * 3);
}
function populate() {
    parkingProvidersObj.forEach(function (provider) {
        parkingProviders.push(new ParkingProvider_1.default(provider.id, provider.organisasjonsnummer, provider.navn));
    });
    parkingAreasObj.forEach(function (area) {
        var address = {
            name: area.navn,
            address: area.adresse,
            postCode: area.postnummer,
            postArea: area.poststed,
        };
        parkingAreas.push(new ParkingArea_1.default(area.id, parkingProviders.filter(function (provider) { return provider.name === area.parkeringstilbyderNavn; })[0], area.breddegrad, area.lengdegrad, area.deaktivert, area.versjonsnummer, address, area.aktiveringstidspunkt, getParkingSizeCategory(area.id), getFacilityInformation(area.id)));
    });
}
app.listen(3000, function () { return console.log('Listening on 3000'); });
