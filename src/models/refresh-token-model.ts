import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";
import { User } from "./user-model.js";


@Table({
    tableName: "refresh_tokens",
    timestamps: false,
})
export class RefreshToken extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: "refresh_token_id",
    })
    refreshTokenId!: string;

    @ForeignKey(() => User) 
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: "user_id",
    })
    userId!: string;
    
    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    token!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "creation_date",
        defaultValue: DataType.NOW,
    })
    creationDate!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "expiry_date",
    })
    expiryDate!: Date;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    revoked!: boolean;
}