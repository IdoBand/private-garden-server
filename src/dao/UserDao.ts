import { UserModel } from "../models";
import { AbstractDao } from "./AbstractDao";
import { User } from "../types";
export class UserDao extends AbstractDao {
    readonly model: typeof UserModel

    constructor() {
        super()
        this.model = UserModel
    }

    async upsert(user: User) {
        try {
            const filter = { id: user.id }
            const options = { upsert: true, new: true }
            const response = await this.model.findOneAndUpdate(filter, {...user}, options)
            console.log('upsert response', response);
            
            return response
        } catch (err) {
            console.log(`Failed to upsert user ---> ${user.id}` , err)
            throw err
        }
    }
    async add(user: User) {
        const saveUser = new UserModel({
            id: user.id,
            firstName: user.firstName,
            LastName: user.lastName,
            dateAdded: user.dateAdded,
            lastActive: user.lastActive,
            followers: user.followers,
            following: user.following
        })
        try {
            const response = await saveUser.save()
            return response 
        } catch (err) {
            console.log(`Failed to save user ---> ${user.id}` + err)
            throw err
        }
    }
    async update(user: User) {
        try {
            const response = await this.model.findOneAndUpdate({ id: user.id }, user)
            return response
        } catch (err) {
            console.log(`Failed to save update ---> ${user.id}` + err)
            throw err
        }
    }
    async handleSignIn(user: User) {
        let response
        console.log(user);
        
        try {
            const doesUserExists = await this.model.findOne({id: user.id}).exec()
            const now = new Date()
            console.log('does user exists:' ,doesUserExists);
            if (doesUserExists) {
                user = {...user, lastActive: now}
                response = await this.update(user)
                console.log('suppose to update');
            } else {
                console.log('suppose to add');
                
                const newUser = {
                    ...user,
                    dateAdded: now,
                    lastActive: now,
                    followers: [],
                    following: []
                }
                response = await this.add(newUser)
            }
            return response
        } catch (err) {
            console.log(`Failed to upsert user ---> ${user.id}` , err)
            throw err
        }
    }
}