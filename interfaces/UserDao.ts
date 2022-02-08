import User from "../models/User";

// The interface declares CRUD operations the DAO must implement
export default interface UesrDao {
    findAllUsers(): Promise<User[]>;
    findUserById(uid: string): Promise<User>;
    createUser(user: User): Promise<User>;
    updateUser(uid: string, user: User): Promise<any>;
    deleteUser(uid: string, user: User): Promise<any>;
}