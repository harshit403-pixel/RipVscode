// Importing modules 
import Session from '../models/session.model.js';
import mongoose from 'mongoose';

// class to communicate with the sessions from database 
class SessionRepository {

    constructor() {

        // setting the session model
        this.sessionModel = Session;

    }

    // method to get a session id
    getSessionId() {

        // return a session id
        return new mongoose.Types.ObjectId();
    }

    // method to create a session
    async createSession(sessionData) {

        // creating the session
        const session = await this.sessionModel.create(sessionData);

        // returning the sessions
        return session;
    }

    // find one sessions
async findOneSession(data) {
  return this.sessionModel.findOne(data);
}

    // find many sessions 
    async findSessions(data) {

        // finding the sessions
        const sessions = await this.sessionModel.find(data);

        //returning the sessions
        return sessions;
    }

    // method to delete one session
    async deleteSessions(data) {

        // deleting the session
        const sessions = await this.sessionModel.deleteOne(data);

        // returning the deleted session
        return sessions;
    }

    async deleteManySessions(data) {
        // deleting the sessions
        const sessions = await this.sessionModel.deleteMany(data);

        // returning the deleted sessions
        return sessions;
    }
}

export default SessionRepository;