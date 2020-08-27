import {PowerStats} from './power-stats';

export class Hero {
  id: number;
  name: string;
  powerStats: PowerStats = new PowerStats();
  selected: boolean;
  selectedAsFavorite: boolean;

  static fromJson(data: Map<string, any>): Hero {
    const h: Hero = new Hero();
    h.id = data['id'];
    h.name = data['name'];
    h.powerStats = PowerStats.fromJson(data['powerstats']);
    h.selected = false;
    h.selectedAsFavorite = false;
    return h;
  }
}
