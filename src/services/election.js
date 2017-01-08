import _ from 'lodash'
import q from 'q'
import {Election, Candidate, ConfigurableDate} from '../models/election'
import {Ballot} from '../models/ballot'

const delay = 1 * 10


const votr = new Candidate()
votr.id = 0
votr.title = 'Votr'
votr.subtitle = 'Chris Langager, Erin Noe-Payne'
votr.description = 'The worlds best voting website'

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

const candidates = [
    votr, netmon, wcui
]

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
            election.title = "Test election"
            election.subtitle = "2017"
            election.description = "The best and brightest of logrhythm compete in a hackathon for cash money."
            election.state = "running"

            const votr = new Candidate()
            votr.id = 0
            votr.title = 'Votr'
            votr.subtitle = 'Chris Langager, Erin Noe-Payne'
            votr.description = 'The worlds best voting website'

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
