(function () {
  'use strict';

  angular
    .module('ngTicket')
    .factory('organizationServer', organizationServer)

  /////////

  /* @ngInject */
  function organizationServer($httpApi, $config, $dialogs) {

    return {
      getCompanyList: resolveGet($config.api3.organization.list),
      createCompany: resolve($config.api3.organization.createCompany),
      createApart: resolve($config.api3.organization.createApart),
      getCompanyDetail: resolveGet($config.api3.organization.companyDetail),
      getApartmentDetail: resolveGet($config.api3.organization.apartmentDetail),
      companyList: resolveGet($config.api3.organization.companyList),
      elitCompany: resolve($config.api3.organization.elitCompany),
      editApartment: resolve($config.api3.organization.editApartment),
      getAreaList: resolveGet($config.api3.organization.areaTreeList),
      userlist: resolveGet($config.api3.organization.userlist),
      stationlist: resolveGet($config.api3.organization.stationlist),
      addUser: resolve($config.api3.organization.addUser),
      stationuserlist: resolveGet($config.api3.organization.stationuserlist),
      stationUserAdd: resolve($config.api3.organization.stationUserAdd),
      stationUserAddUser: resolve($config.api3.organization.stationUserAddUser),

      deleteList:function(item){ //删除列表一数据
        return $dialogs.create('/app/organization/company/deleteList.dialog.html', 'deleteOrganizationListCtrl', item);
      },
      addUserDialog:function(item){ 
        return $dialogs.create('/app/organization/users/addUser.dialog.html', 'addUserCtrl', item);
      },
      addStationsDialog:function(item){ 
        return $dialogs.create('/app/organization/stations/addStations.dialog.html', 'addStationsCtrl', item);
      },
      addStationsUserDialog:function(item){ 
        return $dialogs.create('/app/organization/stations/addStationsUser.dialog.html', 'addStationsUserCtrl', item);
      },
    };
    function resolve(url) {
      return function (item) {
        return $httpApi.post(url, item, {});
      }
    }
    function resolveGet(url) {
      return function (item) {
        return $httpApi.get(url, item, {});
      }
    }
  }
})();
