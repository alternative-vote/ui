import { observable } from "mobx";

export class Ballot {
    @observable voter = null;
    @observable isSubmitted = false;
    @observable votes = [];
}