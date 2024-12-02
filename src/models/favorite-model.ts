import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";
import { Advertisement } from "./advertisement-model.js";
import { User } from "./user-model.js";


@Table({
    tableName: "favorites",
    timestamps: false,
})
export class Favorite extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: "favorite_id",
    })
    favoriteId!: string;

    @ForeignKey(() => User) 
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: "user_id",
    })
    userId!: string;

    @ForeignKey(() => Advertisement) 
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: "advertisement_id",
    })
    advertisementId!: string;
}