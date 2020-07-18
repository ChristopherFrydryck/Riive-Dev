import {observable, computed, action} from 'mobx'


class ComponentStore {
    @observable vehiclesLoaded = false;
    @observable paymentsLoaded = false;
    @observable spotsLoaded = false;
    @observable selectedVehicle = [];
    @observable selectedPayment = [];
   




}

export default new ComponentStore();