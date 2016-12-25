import { observable } from "mobx";

export class ConfigurableDate {
    @observable isManual = true;
    @observable date = new Date();
}

export class Role {
    @observable isPublic = false;
    @observable members = [];
}

export class Candidate {
    @observable title = '';
    @observable subtitle = '';
    @observable description = '';
}

export class ElectionModel {
    @observable id = '';
    @observable title = '';
    @observable subtitle = '';
    @observable description = '';
    @observable state = '';

    @observable start = new ConfigurableDate();
    @observable end = new ConfigurableDate();
    
    @observable candidates = [];
    @observable roles = {
        voters : new Role(),
        admins : new Role(),
    };
    @observable votes = {
        count : 0,
        percentage : 0,
        trend : [],
    };
    @observable results = [];
}
