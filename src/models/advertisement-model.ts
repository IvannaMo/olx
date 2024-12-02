import { Table, Model, Column, DataType, ForeignKey, HasMany, BelongsTo } from "sequelize-typescript";
import { Category } from "./category-model.js";
import { User } from "./user-model.js";
import { Tag } from "./tag-model.js";
import { Review } from "./review-model.js";
import { Image } from "./image-model.js";


export enum AdvertisementStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    SOLD = "sold",
    REMOVED = "removed",
}


@Table({
    tableName: "advertisements",
    timestamps: false,
})
export class Advertisement extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: "advertisement_id",
    })
    advertisementId!: string;

    @ForeignKey(() => User) 
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: "user_id",
    })
    userId!: string;

    @BelongsTo(() => User, { foreignKey: "user_id" })
    user!: User;

    @ForeignKey(() => Category) 
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: "category_id",
    })
    categoryId!: string;

    @BelongsTo(() => Category, { foreignKey: "category_id" })
    category!: Category;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    title!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description!: string;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false,
    })
    price!: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        field: "is_vip",
    })
    isVip?: boolean;

    @Column({
        type: DataType.ENUM(...Object.values(AdvertisementStatus)),
        allowNull: false,
        defaultValue: AdvertisementStatus.ACTIVE,
    })
    status!: AdvertisementStatus;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    location!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    views!: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: "publish_date",
    })
    publishDate!: Date;

    @HasMany(() => Tag)
    tags!: Tag[];

    @HasMany(() => Image)
    images!: Image[];

    @HasMany(() => Review)
    reviews!: Review[];
}