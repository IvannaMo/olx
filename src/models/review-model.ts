import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";
import { Advertisement } from "./advertisement-model.js";
import { User } from "./user-model.js";


@Table({
    tableName: "reviews",
    timestamps: false,
})
export class Review extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: "review_id",
    })
    reviewId!: string;

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

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    rating!: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    comment!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: "publish_date",
    })
    publishDate!: Date;
}