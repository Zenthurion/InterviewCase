import express from 'express';
import https from 'https';
import fs from 'fs';
import IFacilityInformation from './IFacilityInformation';
import ParkingArea, { IAddress } from './ParkingArea';
import ParkingProvider from './ParkingProvider';

const app: express.Application = express();

const parkingAreasURL =
    'https://www.vegvesen.no/ws/no/vegvesen/veg/parkeringsomraade/parkeringsregisteret/v1/parkeringsomraade';
const parkingProvidersURL =
    'https://www.vegvesen.no/ws/no/vegvesen/veg/parkeringsomraade/parkeringsregisteret/v1/parkeringstilbyder';

var parkingAreasObj: any[] = [];
var parkingProvidersObj: any[] = [];

var parkingAreas: ParkingArea[] = [];
var parkingProviders: ParkingProvider[] = [];

// localhost:3000/?sizeCategory=2&showers=yes&....
app.get('/', (req: express.Request, res: express.Response) => {
    const sizeCategory = parseInt(req.query.size_category as string);
    const showers = new Boolean(req.query.showers);

    res.send(
        parkingAreas.filter((area) => {
            return (
                area.parkingSizeCategory === sizeCategory &&
                (showers
                    ? area.facilityInformation.showers > 0
                    : area.facilityInformation.showers === 0)
            );
        })
    );

    // 1. iterate over all params
    // 2. validate parameter and value
    // 3. compose query from valid parameters
    // 4. return result
});

getParkingProviders();
getParkingAreas();

function getParkingAreas() {
    if (fs.existsSync('./parkingAreas.json')) {
        const raw = fs.readFileSync('./parkingAreas.json');
        parkingAreasObj = JSON.parse(raw.toString());

        if (parkingProvidersObj.length > 0 && parkingAreasObj.length > 0) {
            populate();
        }
    } else {
        https.get(parkingAreasURL, (res) => {
            var body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    parkingAreasObj = JSON.parse(body);
                } catch (err) {
                    console.error(err);
                }

                if (
                    parkingProvidersObj.length > 0 &&
                    parkingAreasObj.length > 0
                ) {
                    populate();

                    if (
                        parkingProvidersObj.length > 0 &&
                        parkingAreasObj.length > 0
                    ) {
                        populate();
                    }
                }
            });
        });
    }
}

function getParkingProviders() {
    if (fs.existsSync('./parkingProviders.json')) {
        const raw = fs.readFileSync('./parkingProviders.json');
        parkingProvidersObj = JSON.parse(raw.toString());

        if (parkingProvidersObj.length > 0 && parkingAreasObj.length > 0) {
            populate();
        }
    } else {
        https.get(parkingProvidersURL, (res) => {
            var body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    parkingProvidersObj = JSON.parse(body);
                } catch (err) {
                    console.error(err);
                }
            });

            if (parkingProvidersObj.length > 0 && parkingAreasObj.length > 0) {
                populate();
            }
        });
    }
}

function getFacilityInformation(parkingAreaId: number): IFacilityInformation {
    const info: IFacilityInformation = {
        accommodations: Math.floor(
            Math.random() > 0.8 ? Math.random() * 20 : 0
        ),
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
function getParkingSizeCategory(parkingAreaId: number) {
    return Math.floor(Math.random() * 3);
}

function populate() {
    parkingProvidersObj.forEach((provider) => {
        parkingProviders.push(
            new ParkingProvider(
                provider.id,
                provider.organisasjonsnummer,
                provider.navn
            )
        );
    });

    parkingAreasObj.forEach((area: any) => {
        const address: IAddress = {
            name: area.navn,
            address: area.adresse,
            postCode: area.postnummer,
            postArea: area.poststed,
        };

        parkingAreas.push(
            new ParkingArea(
                area.id,
                parkingProviders.filter(
                    (provider) => provider.name === area.parkeringstilbyderNavn
                )[0],
                area.breddegrad,
                area.lengdegrad,
                area.deaktivert,
                area.versjonsnummer,
                address,
                area.aktiveringstidspunkt,
                getParkingSizeCategory(area.id),
                getFacilityInformation(area.id)
            )
        );
    });
}

app.listen(3000, () => console.log('Listening on 3000'));
