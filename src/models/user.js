import { observable } from "mobx";

class User {
    @observable email = '';
    @observable password = '';
    @observable hasAccount = false;
}