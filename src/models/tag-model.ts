import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";
import { Advertisement } from "./advertisement-model.js";


@Table({
    tableName: "tags",
    timestamps: false,
})
export class Tag extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: "tag_id",
    })
    tagId!: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    name!: string;

    @ForeignKey(() => Advertisement) 
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: "advertisement_id",
    })
    advertisementId!: string;
}