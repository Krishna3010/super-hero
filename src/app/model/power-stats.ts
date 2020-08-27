export class PowerStats {
  intelligence: number = 0;
  strength: number = 0;
  speed: number = 0;
  durability: number = 0;
  power: number = 0;
  combat: number = 0;
  static fromJson(data: Map<string, any>): PowerStats {
    const p: PowerStats = new PowerStats();
    p.intelligence = data['intelligence'];
    p.strength = data['strength'];
    p.speed = data['speed'];
    p.durability = data['durability'];
    p.power = data['power'];
    p.combat = data['combat'];
    return p;
  }
}
