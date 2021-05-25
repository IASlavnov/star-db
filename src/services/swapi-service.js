export default class SwapiService {
  constructor() {
    this._apiBase = 'https://swapi.dev/api';
    this._imageBase = 'https://starwars-visualguide.com/assets/img';

    this._transformPlanet = this._transformPlanet.bind(this);
    this._transformPerson = this._transformPerson.bind(this);
    this._transformStarship = this._transformStarship.bind(this);
    this.getAllPeople = this.getAllPeople.bind(this);
    this.getPerson = this.getPerson.bind(this);
    this.getAllPlanets = this.getAllPlanets.bind(this);
    this.getPlanet = this.getPlanet.bind(this);
    this.getAllStarships = this.getAllStarships.bind(this);
    this.getStarship = this.getStarship.bind(this);
    this.getPersonImage = this.getPersonImage.bind(this);
    this.getPlanetImage = this.getPlanetImage.bind(this);
    this.getStarshipImage = this.getStarshipImage.bind(this);
  }

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, recieved ${res.status}`);
    }

    return await res.json();
  }

  async getAllPeople() {
    const res = await this.getResource(`/people/`);
    return res.results.map(this._transformPerson);
  }

  async getPerson(id) {
    const person = await this.getResource(`/people/${id}/`);
    return this._transformPerson(person);
  }

  async getAllPlanets() {
    const res = await this.getResource(`/planets/`);
    return res.results.map(this._transformPlanet);
  }

  async getPlanet(id) {
    const planet = await this.getResource(`/planets/${id}/`);
    return this._transformPlanet(planet);
  }

  async getAllStarships() {
    const res = await this.getResource(`/starships/`);
    return res.results.map(this._transformStarship);
  }

  async getStarship(id) {
    const starship = await this.getResource(`/starships/${id}/`);
    return this._transformStarship(starship);
  }

  getPersonImage({id}) {
    return `${this._imageBase}/characters/${id}.jpg`;
  }

  getStarshipImage({id}) {
    return `${this._imageBase}/starships/${id}.jpg`;
  };

  getPlanetImage({id}) {
    return `${this._imageBase}/planets/${id}.jpg`;
  };

  _extractId(item) {
    const idRegExp = /\/([0-9]*)\/$/;
    return item.url.match(idRegExp)[1];
  }

  _transformPlanet(planet) {
   return {
      id: this._extractId(planet),
      name: planet.name,
      population: planet.population,
      rotationPeriod: planet.rotation_period,
      diameter: planet.diameter,
    };
  }

  _transformStarship(starship) {
    return {
      id: this._extractId(starship),
      name: starship.name,
      model: starship.model,
      manufacturer: starship.manufacturer,
      costInCredits: starship.cost_in_credits,
      length: starship.length,
      crew: starship.crew,
      passengers: starship.passengers,
      cargoCapacity: starship.cargoCapacity,
    };
  }

  _transformPerson(person) {
    return {
      id: this._extractId(person),
      name: person.name,
      gender: person.gender,
      birthYear: person.birth_year,
      eyeColor: person.eye_color,
    };
  }
}
