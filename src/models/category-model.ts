import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";


@Table({
    tableName: "categories",
    timestamps: false,
})
export class Category extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: "category_id",
    })
    categoryId!: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING(255),
        field: "image_url",
    })
    imageUrl!: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
    })
    imageColor!: string;

    @ForeignKey(() => Category) 
    @Column({
        type: DataType.UUID,
        field: "parent_category_id",
    })
    parentCategoryId!: string;
}