import _ from 'lodash'
import q from 'q'
import {Election, Candidate, ConfigurableDate} from '../models/election'
import {Ballot} from '../models/ballot'

const delay = 1 * 10


const votr = new Candidate()
votr.id = 0
votr.title = 'AIE Log Attribution'
votr.subtitle = 'John Ryden, Mario Amato, Phil Barilla'
votr.description = 'Associates logs with aie alarms at the time they are produced.'

const netmon = new Candidate()
netmon.id = 1
netmon.title = 'Netmon 20k'
netmon.subtitle = 'Kjell Hedstrom, Alex Weltman'
netmon.description = 'Much higher throughput at the netmon parsing layer.'

const wcui = new Candidate()
wcui.id = 2
wcui.title = 'Web Console Twilight Mode'
wcui.subtitle = 'Matt Petersen, Jamie Ottersetter, Nicholas Boll'
wcui.description = 'A framework for adding extensible color palettes to the web console.'

const long = new Candidate()
long.id = 3
long.title = 'An election with a very very long title that is super duper ultra long god damn it is so long its not even a joke'
long.subtitle = 'It also has a subtitle that just seems to go on and on forever without an perceivable end, because it just wont quit UGH'
long.description = 'I guess it has a description though'

const candidates = [
    votr, netmon, wcui, long
]

//states: edit, running, complete

class ElectionService {

    create() {
        return new Promise((resolve, reject) => {

        });
    }

    getMine() {
        return q.delay(delay).then(() => {
            return [
                Election.mock(),
                Election.mock(),
                Election.mock(),
            ]
        })
    }

    getById(electionId) {
        return q.delay(delay).then(() => {
            const election = new Election()
            election.id = electionId
            election.title = "LogRhythm Hackathon"
            election.subtitle = "Q1 2017"
            election.description = "The best and brightest of logrhythm compete in a hackathon for cash money."
            election.state = "running"

            election.candidates = candidates;

            return election
        })
    }

    getBallot(electionId, userId) {
        return q.delay(delay).then(() => {
            const ballot = new Ballot()
            ballot.votes = candidates;
            return ballot;
        })
    }

    getFromHash(hash) {
        return q.all([
           this.getById(),
           this.getBallot(),
        ]).spread((election, ballot) => {
            return { election, ballot }
        });
    }

    save(election) {
        return new Promise((resolve, reject) => {

        });
    }

    delete(electionId) {
        return new Promise((resolve, reject) => {

        });
    }

    start(electionId) {
        return new Promise((resolve, reject) => {

        });
    }

    end(electionId) {
        return new Promise((resolve, reject) => {

        });
    }

}

export default new ElectionService()
