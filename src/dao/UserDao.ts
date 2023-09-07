import { UserModel } from "../models";
import { AbstractDao } from "./AbstractDao";
import { FileData, User } from "../types";
export class UserDao extends AbstractDao {
    #model: typeof UserModel
    #s3FolderName: string
    constructor() {
        super()
        this.#model = UserModel
        this.#s3FolderName = 'userProfileImg'
    }

    private async add(user: User) {
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
    private async update(user: User) {
        try {
            const response = await this.#model.findOneAndUpdate({ id: user.id }, user)
            return response
        } catch (err) {
            console.log(`Failed to save update ---> ${user.id}` + err)
            throw err
        }
    }
    async handleSignIn(user: User, fileData: FileData) {
        let response

        try {
            const doesUserExists = await this.#model.findOne({id: user.id})
            const now = new Date()

            if (doesUserExists) {
                console.log('suppose to update', user);
                user = {...user, lastActive: now}
                response = await this.update(user)
                if (response.profileImg) {
                    const url = await this.generateAwsImageUrl(response.profileImg as string)
                    response.profileImg = url
                }

            } else {
                console.log('suppose to add:', user);

                const decideProfileImg = await this.decideImageFile(fileData ,this.#s3FolderName)
                
                const newUser = {
                    ...user,
                    profileImg: decideProfileImg,
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
            const user = await this.#model
                .findOne({ id: userId })
                .select({ firstName: 1, lastName: 1, profileImg: 1 });
            const profileImg = await this.generateAwsImageUrl(user.profileImg)
            return {
                userName: user.firstName + ' ' + user.lastName,
                profileImg: profileImg,
            }
        } catch (err) {
            console.log('Failed to get user data for post')
            throw err
        }
    }
    async generateAwsImageUrl (imageS3Name: string) {
        const url = await this.s3.read(`${this.#s3FolderName}/${imageS3Name}`)
        return url
    }
    async s3Migrate() {
        try {
            const url = await this.s3.read(`${this.#s3FolderName}/6d22678d17f308db6083bd41f3af12051f594f3e6dca4ef08b9b5f19f33a7468`)
            console.log(url);
        } catch (err) {
            console.log(err);
            
        }
    }
    async test(fileData: FileData) {
        await this.s3.put(fileData, this.#s3FolderName)
    }
}