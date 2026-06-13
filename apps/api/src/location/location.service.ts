import { Injectable } from '@nestjs/common';
import { Country, State, City } from 'country-state-city';

@Injectable()
export class LocationService {
  getCountries() {
    return Country.getAllCountries().map((country) => ({
      name: country.name,
      isoCode: country.isoCode,
      phonecode: country.phonecode,
      currency: country.currency,
      flag: country.flag,
    }));
  }

  getStates(countryCode: string) {
    return State.getStatesOfCountry(countryCode).map((state) => ({
      name: state.name,
      isoCode: state.isoCode,
      countryCode: state.countryCode,
    }));
  }

  getCities(countryCode: string, stateCode: string) {
    return City.getCitiesOfState(countryCode, stateCode).map((city) => ({
      name: city.name,
      countryCode: city.countryCode,
      stateCode: city.stateCode,
    }));
  }
}