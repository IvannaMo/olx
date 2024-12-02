import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";
import { Advertisement } from "./advertisement-model.js";


@Table({
    tableName: "images",
    timestamps: false,
})
export class Image extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: "image_id",
    })
    imageId!: string;

    @ForeignKey(() => Advertisement) 
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: "advertisement_id",
    })
    advertisementId!: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        field: "image_url",
    })
    imageUrl!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    primary?: boolean;
}