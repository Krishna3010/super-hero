// Copyright (C) 2019-2020 NSEIT Limited, Mumbai. All rights reserved.
//
// This program and the accompanying materials are made available
// under the terms described in the LICENSE file which accompanies
// this distribution. If the LICENSE file was not attached to this
// distribution or for further clarifications, please contact
// legal@nseit.com.

// export const API_CONF = window.location.origin + '/';
export const getApiLoginEndPoint = '/api/login';
export const getApiLogoutEndPoint = '/api/logout';
export const getApiWhoAmIEndPoint = '/api/whoami';
export const getApiChangePasswordEndPoint = '/api/change_password';

export const getApiUserCollectionEndPoint = '/user_collection';
export const getApiUserEndPoint = (userId: number) => {
  return `/user/${userId}`;
};

export const getApiVenueCollectionEndPoint =
  '/ui/venue_manager/venues';

export const getApiVenueDetailsCollectionEndPoint = (venueId: number) => {
  return `/ui/venue_manager/venues/${venueId}`;
};
export const getApiVenueEndPoint = (venueId: number) => {
  return `/venue/${venueId}`;
};
export const getApiVenueByCodeEndPoint = (venueCode: string) => {
  return `/ui/venue_manager/venue_by_code/${venueCode}`;
};
export const getApiAuditHistoryEndPoint = (venueId: number) => {
  return `/ui/venue_manager/venues/${venueId}/audit_history`;
};
export const getApiAuditMachinesEndPoint = (auditId: number) => {
  return `/ui/venue_manager/audit/${auditId}/machines`;
};
export const getApiAuditInstanceDetailsEndPoint = (auditId: number) => {
  return `/ui/venue_manager/audit/${auditId}`;
};

export const getApiVenueMachinesEndPoint = (venueId: number) => {
  return `/ui/venue_manager/venues/${venueId}/machines`;
};

export const getApiVenuePlanEndPoint = (auditInstanceId: number) => {
  return `/ui/venue_manager/audit/${auditInstanceId}/plan`;
};

export const getApiVenueFlatMachinesEndPoint = (auditInstanceId: number) => {
  return `/ui/venue_manager/audit/${auditInstanceId}/flat_machines`;
};


//Role Management URL's
export const getApiRolesCollectionEndPoint = '/ui/role_manager/roles';
export const getApiApplicationsCollectionEndPoint =
  '/ui/role_manager/applications';

export const getApiRoleByNameEndPoint = (roleName: string) => {
  return `/ui/role_manager/role_by_name/${roleName}`;
};
export const getApiRoleDetailsEndPoint = (roleId: number) => {
  return `/ui/role_manager/roles/${roleId}`;
};
//User Management URL's
export const getApiUsersCollectionEndPoint = '/ui/user_manager/users';
export const getApiUserByLoginEndPoint = (login: string) => {
  return `/ui/user_manager/user_by_login/${login}`;
};
export const getApiUserByEmailEndPoint = (email: string) => {
  return `/ui/user_manager/user_by_email/${email}`;
};
export const getApiUserDetailsCollectionEndPoint = (userId: number) => {
  return `/ui/user_manager/users/${userId}`;
};
export const getApiAssignRolesCollectionEndPoint =  '/ui/user_manager/users/add_roles';
export const getApiRemoveRolesCollectionEndPoint =  '/ui/user_manager/users/remove_roles';
export const getApiSetPasswordCollectionEndPoint =  '/ui/user_manager/set_password';


