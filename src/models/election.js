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

export class Election {
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

    //TODO: placeholders
    @observable votes = {};
    @observable results = {};

    static mock() {
        const model = new Election()

        model.id = randomString()
        model.title = randomString()
        model.subtitle = randomString()
        model.description = randomString()

        return model;
    }
}

function randomString()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}