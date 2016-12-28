import { observable } from "mobx";

export class Ballot {
    @observable id = '';
    @observable electionId = '';
    @observable voter = null;
    @observable isSubmitted = false;
    @observable votes = [];
}