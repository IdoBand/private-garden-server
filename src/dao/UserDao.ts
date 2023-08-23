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
            ...user
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
    async handleSignIn(user: User, imageFileName: string) {
        let response

        try {
            const doesUserExists = await this.model.findOne({id: user.id})
            const now = new Date()
            // console.log('does user exists:' ,doesUserExists);
            if (doesUserExists) {
                console.log('suppose to update', user);
                user = {...user, lastActive: now}
                response = await this.update(user)
            } else {
                console.log('suppose to add:', user);
                
                const newUser = {
                    ...user,
                    profileImg: this.deicideImage(imageFileName),
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
    async getUserDataForPost(userId: string) {
        try {            
            const response = await this.model
                .findOne({ id: userId })
                .select({ firstName: 1, lastName: 1, profileImg: 1 });
            return {
                userName: response.firstName + ' ' + response.lastName,
                profileImg: response.profileImg,
            }
        } catch (err) {
            console.log('Failed to get user data for post')
            throw err
        }
    }
    async addDummyUser(user: User, imageFileName: string) {
        let response

        try {
            const now = new Date()
            const newUser = new UserModel ({
                ...user,
                profileImg: this.deicideImage(imageFileName),
                dateAdded: now,
                lastActive: now,
                followers: [],
                following: []
            })
            response = await newUser.save()
            return response
        } catch (err) {
            console.log(`Failed to upsert user ---> ${user.id}` , err)
            throw err
        }
    }
}