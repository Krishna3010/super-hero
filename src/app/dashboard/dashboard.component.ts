import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Form, FormControl} from '@angular/forms';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, startWith} from 'rxjs/operators';
import {HeroService} from '../hero.service';
import {Hero} from '../model/hero';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {PowerStats} from '../model/power-stats';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectable: boolean = true;
  heroCtrl: FormControl = new FormControl();
  powerStats: PowerStats = new PowerStats();
  filteredHeros: Observable<Hero[]>;
  heros: Hero[] = [];
  favoriteHeros: Hero[] = [];
  allHeroes: Hero[] = [];
  palette: string[] = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2'];
  @ViewChild('heroInput', {static: true}) heroInput: ElementRef;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private service: HeroService) {
  }

  async ngOnInit() {
    this.filteredHeros = this.heroCtrl.valueChanges.pipe(
      startWith(null),
      map((hero: string | null) => hero ? this._filter(hero) : this.allHeroes.slice()));
    fromEvent(this.heroInput.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2)
      // Time in milliseconds between key events
      , debounceTime(100)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe((text: string) => {
      this.fetchHeroListByName();
    });
  }

  async fetchHeroListByName() {
    const fetchString = this.heroCtrl.value;
    const rel = await this.service.fetchHeroList(fetchString);
    if (rel) {
      this.allHeroes = this.service.getHeroList;
      this.detectValueChanges();
      return;
    }
    alert(this.service.httpErrorMessage);
    return;
  }

  detectValueChanges() {
    this.filteredHeros = this.heroCtrl.valueChanges.pipe(
      startWith(null),
      map((hero: string | null) => hero ? this._filter(hero) : this.allHeroes.slice()));
  }

  selected(): void {
    this.heroInput.nativeElement.value = '';
    this.heroCtrl.setValue(null);
  }

  optionClicked(event: Event, fh: Hero) {
    event.stopPropagation();
    this.toggleSelection(fh);
  }

  toggleSelection(fh: Hero) {
    console.log('fh.selected');
    console.log(fh.selected);
    if (this.heros.length <= 4 || fh.selected) {
      fh.selected = !fh.selected;
      if (fh.selected) {
        this.heros.push(fh);
      } else {
        const i = this.heros.findIndex(value => value.id === fh.id);
        this.heros.splice(i, 1);
      }
    } else {
      alert('Maximum 4 heroes can be selected');
    }
  }

  toggleFavorite(item: Hero, action: string) {
    console.log(item);
    console.log(action);
    if (action === 'add_fav') {
      item.selectedAsFavorite = true;
    } else {
      item.selectedAsFavorite = false;
    }
    if (item.selectedAsFavorite) {
      this.favoriteHeros.push(item);
    } else {
      const index = this.favoriteHeros.indexOf(item);
      if (index >= 0) {
        this.favoriteHeros.splice(index, 1);
      }
    }
    console.log('this.favoriteHeros');
    console.log(this.favoriteHeros);
  }

  deleteFavorite(hero: Hero) {
    const index = this.favoriteHeros.indexOf(hero);
    if (index >= 0) {
      this.favoriteHeros.splice(index, 1);
    }
    const indexHero = this.heros.indexOf(hero);
    if (indexHero >= 0) {
      this.heros[indexHero].selectedAsFavorite = false;
    }
  }

  exists(item) {
    return this.favoriteHeros.indexOf(item) > -1;
  }


  private _filter(value: string): Hero[] {
    const filterValue = value.toLowerCase();
    return this.allHeroes.filter(h => h.name.toLowerCase().indexOf(filterValue) === 0);
  }

  generateChart() {
    let series;
    const chart = am4core.create('chartdiv', am4charts.RadarChart);
    const data = [];
    let object;
    for (const p in this.powerStats) {
      object = {};
      object.powerstats = p.toLocaleUpperCase();
      this.heros.forEach((hero, index) => {
        object['value' + (index + 1)] = hero.powerStats[p];
      });
      data.push(object);
    }
    chart.data = data;
    /* Create axes */
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererCircular>());
    categoryAxis.dataFields.category = 'powerstats';

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererRadial>());
    valueAxis.extraMin = 0.2;
    valueAxis.extraMax = 0.2;
    valueAxis.tooltip.disabled = true;

    /* Create and configure series */
    this.heros.forEach((hero, index) => {
      console.log(hero);
      series = chart.series.push(new am4charts.RadarSeries());
      series.dataFields.valueY = ['value' + (index + 1)];
      series.dataFields.categoryX = 'powerstats';
      series.strokeWidth = 3;
      series.tooltipText = '{valueY}';
      series.name = hero.name;
      series.bullets.create(am4charts.CircleBullet);
      series.dataItems.template.locations.categoryX = 0.5;
      series.stroke = am4core.color(this.palette[index]);
    });

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarY = new am4core.Scrollbar();
    chart.cursor = new am4charts.RadarCursor();
    chart.legend = new am4charts.Legend();
  }

  resetChart() {
    this.heros = [];
    this.allHeroes = [];
    this.heroInput.nativeElement.value = '';
    this.filteredHeros = new Observable<[]>();
    this.generateChart();
  }
}
