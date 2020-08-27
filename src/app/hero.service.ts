import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import * as apiUrl from './api_urls';
import {Hero} from './model/hero';
import {LoaderService} from './loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  httpErrorMessage = '';
  private heroList: Hero[];

  get getHeroList(): Hero[] {
    return this.heroList;
  }

  constructor(private http: HttpClient, public loaderService: LoaderService) {
  }


  async fetchHeroList(name: string): Promise<boolean> {
    this.loaderService.show();
    return await this.http.get(
      apiUrl.getApiHeroByNameEndPoint(name)).toPromise()
      .then((response) => {
        if (response['response'] === 'success') {
          const result = response['results'];
          this.heroList = [];
          for (const i of result) {
            this.heroList.push(Hero.fromJson(i));
          }
        }
        this.loaderService.hide();
        return true;
      }).catch(error => this.errorHandler(error));
  }

  errorHandler(error: HttpErrorResponse): boolean {
    console.log(error);
    this.httpErrorMessage = 'Server Error!!';
    return false;
  }
}
