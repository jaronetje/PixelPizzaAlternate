import { Model } from "../pieces/ModelManager";

interface UserTypes {
	id: string;
    deliveryMessage: string | null;
}

interface UserCreateTypes {
	id: string;
}

export class User extends Model<UserTypes, UserCreateTypes> {
    public get id() {
        return this.getDataValue("id");
    }

    public get deliveryMessage() {
        return this.getDataValue("deliveryMessage");
    }
}