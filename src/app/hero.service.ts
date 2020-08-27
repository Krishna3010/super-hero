// Copyright (C) 2019-2020 NSEIT Limited, Mumbai. All rights reserved.
//
// This program and the accompanying materials are made available
// under the terms described in the LICENSE file which accompanies
// this distribution. If the LICENSE file was not attached to this
// distribution or for further clarifications, please contact
// legal@nseit.com.

import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import * as apiUrl from '../api_urls';
import {Venue} from './model/Venue';
import {User} from './model/User';
import {AuditInstance} from './model/AuditInstance';
import {ResponseResult} from '../utils/utils';
import {AuditMachine} from './model/AuditMachine';
import {Machine} from './model/Machines';
import {VenuePlan} from "./model/VenuePlan";
import {FlatMachines} from "./model/FlatMachines";

@Injectable({
  providedIn: 'root'
})
export class VenuesService {
  httpErrorMessage: string = '';
  errorStatus: number;
  private auditedTime: string;

  get getAuditedTime(): string {
    return this.auditedTime;
  }

  private existCodeId: number;

  get getExistCodeId(): number {
    return this.existCodeId;
  }

  private users: User[] = [];

  get userList(): User[] {
    return this.users;
  }

  private venues: Venue[] = [];

  get venueList(): Venue[] {
    return this.venues;
  }

  private venue: Venue;

  get getVenue(): Venue {
    return this.venue;
  }

  private auditInstance: AuditInstance[] = [];

  get auditInstanceList(): AuditInstance[] {
    return this.auditInstance;
  }

  private auditMachines: AuditMachine[] = [];

  get auditMachineList(): AuditMachine[] {
    return this.auditMachines;
  }

  private venueMachines: Machine[] = [];

  get getVenueMachineList(): Machine[] {
    return this.venueMachines;
  }

  private venuePlan: VenuePlan = new VenuePlan();

  get getVenuePlans(): VenuePlan {
    return this.venuePlan;
  }

  private machineAuditTimeArray: string[];

  get getMachineListArray(): string[] {
    return this.machineAuditTimeArray;
  }

  get getErrorMessage(): string {
    return this.httpErrorMessage;
  }

  get getErrorStatus(): number {
    return this.errorStatus;
  }

  private flatMachines: FlatMachines[];

  get getFlatMachines(): FlatMachines[] {
    return this.flatMachines;
  }

  constructor(private http: HttpClient) {
  }

  async fetchVenuesList(): Promise<boolean> {
    return await this.http.get(
      apiUrl.getApiVenueCollectionEndPoint).toPromise()
      .then((response) => {
        const result = ResponseResult.fromJson(response).result;
        this.venues = [];
        if (result !== null) {
          for (let i of result) {
            this.venues.push(Venue.fromJson(i));
          }
        }
        return true;
      }).catch(error => this.errorHandler(error));
  }

  async addVenue(venue: Venue): Promise<boolean> {
    return await this.http.post(
      apiUrl.getApiVenueCollectionEndPoint, venue.toJSON()).toPromise()
      .then((response) => {
        this.httpErrorMessage = 'Venue added';
        return true;
      }).catch(error => this.errorHandler(error));
  }

  async updateVenue(venue: Venue): Promise<boolean> {
    return await this.http.put(
      apiUrl.getApiVenueDetailsCollectionEndPoint(venue.id), venue.toJSON()
    ).toPromise()
      .then((response) => {
        this.httpErrorMessage = 'Venue saved';
        return true;
      }).catch(error => this.errorHandler(error));
  }

  async deleteVenue(venueId: number): Promise<boolean> {
    return await this.http.delete(
      apiUrl.getApiVenueDetailsCollectionEndPoint(venueId)
    ).toPromise()
      .then((response) => {
        this.httpErrorMessage = ' Venue deleted';
        return true;
      }).catch(error => this.errorHandler(error));
  }

  async getAuditHistory(venueId): Promise<boolean> {
    this.errorStatus = 0;
    return await this.http.get(
      apiUrl.getApiAuditHistoryEndPoint(venueId)).toPromise()
      .then((response) => {
        const result = ResponseResult.fromJson(response).result;
        this.venue = new Venue();
        this.users = [];
        this.auditInstance = [];
        this.venue = Venue.fromJson(result['venue_info']);
        if (result['applicable_users'] !== null) {
          for (const u of result['applicable_users']) {
            this.users.push(User.fromJson(u));
          }
        }
        if (result['audit_instance_list'] !== null) {
          for (const a of result['audit_instance_list']) {
            a.user_name = this.users.find(u => u.id = a.user_id).name;
            this.auditInstance.push(AuditInstance.fromJson(a));
          }
        }
        return true;
      }).catch(error => this.errorHandler(error));
  }

  async deleteAuditHistory(auditId: number): Promise<boolean> {
    return await this.http.delete(
      apiUrl.getApiAuditInstanceDetailsEndPoint(auditId)
    ).toPromise()
      .then((response) => {
        this.httpErrorMessage = 'Audit Instance deleted';
        return true;
      }).catch(error => this.errorHandler(error));
  }

  async getAuditMachines(auditId): Promise<boolean> {
    this.errorStatus = 0;
    return await this.http.get(
      apiUrl.getApiAuditMachinesEndPoint(auditId)).toPromise()
      .then((response) => {
        const result = ResponseResult.fromJson(response).result;
        this.auditMachines = [];
        this.venue = Venue.fromJson(result['venue_info']);
        if (result['machine_list'] !== null) {
          for (const m of result['machine_list']) {
            this.auditMachines.push(AuditMachine.fromJson(m));
          }
        }
        this.auditedTime = result['audit_time'];
        return true;
      }).catch(error => this.errorHandler(error));
  }

  async getVenueMachines(venueId): Promise<boolean> {
    this.errorStatus = 0;
    return await this.http.get(
      apiUrl.getApiVenueMachinesEndPoint(venueId)).toPromise()
      .then((response) => {
        const result = ResponseResult.fromJson(response).result;
        this.venueMachines = [];
        this.machineAuditTimeArray = [];
        if (result['machines'] !== null) {
          for (const m of result['machines']) {
            const date = Machine.convertDate(m['machine_audit_time']);
            if (this.machineAuditTimeArray.indexOf(
              date) === -1) {
              this.machineAuditTimeArray.push(date);
            }
            this.venueMachines.push(Machine.fromJson(m));
          }
        }
        return true;
      }).catch(error => this.errorHandler(error));
  }

  async checkVenueByCode(venueCode): Promise<boolean> {
    return await this.http.get(
      apiUrl.getApiVenueByCodeEndPoint(venueCode)).toPromise()
      .then((response) => {
        const result = ResponseResult.fromJson(response).result;
        this.existCodeId = result['id'];
        this.httpErrorMessage = 'Code already exist';
        return true;
      }).catch(error => {
        console.log(error);
        if (error.status === 404) {
          return false;
        } else if (error.status === 500) {
          this.httpErrorMessage = 'Internal Server Error';
          return true;
        } else if (error.status === 0) {
          this.httpErrorMessage = 'Network Error';
          return true;
        }
      });
  }

  async getVenuePlan(auditInstanceId: number): Promise<boolean> {
    return await this.http.get(
      apiUrl.getApiVenuePlanEndPoint(auditInstanceId)).toPromise()
      .then((response) => {
        const result = ResponseResult.fromJson(response).result;
        if (result['venue_plan'] !== null) {
          this.venuePlan = VenuePlan.fromJson(result['venue_plan']);
        }
        this.auditedTime = result['audit_time'];
        return true;
      }).catch(error => this.errorHandler(error));
  }

  async getAuditFlatMachines(auditInstanceId: number): Promise<boolean> {
    this.errorStatus = 0;
    return await this.http.get(
      apiUrl.getApiVenueFlatMachinesEndPoint(auditInstanceId)).toPromise()
      .then((response) => {
        const result = ResponseResult.fromJson(response).result;
        console.log(result);
        this.flatMachines = [];
        if (result['flat_machines'] !== null) {
          for (const m of result['flat_machines']) {
            this.flatMachines.push(FlatMachines.fromJson(m));
          }
        }
        this.venue = Venue.fromJson(result['venue_info']);
        return true;
      }).catch(error => this.errorHandler(error));
  }

  errorHandler(error: HttpErrorResponse): boolean {
    console.log(error);
    this.errorStatus = error.status;
    if (error.status === 400) {
      this.httpErrorMessage = '<ul>';
      for (const i of error['error']['errors']) {
        this.httpErrorMessage +=
          '<li>' + i.description + '</li>';
      }
      this.httpErrorMessage += '</ul>';
    } else if (error.status === 403) {
      this.httpErrorMessage = 'Forbidden!!';
    } else {
      this.httpErrorMessage = 'Server Error!!';
    }
    return false;
  }
}
