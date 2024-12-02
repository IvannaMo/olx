import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { Advertisement } from "./advertisement-model.js";
import { Review } from "./review-model.js";
import { Favorite } from "./favorite-model.js";
import { Notification } from "./notification-model.js";
import { RefreshToken } from "./refresh-token-model.js";


export enum UserType {
    ADMIN = "admin",
    MODERATOR = "moderator",
    USER = "user",
}

export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offline",
}


@Table({
    tableName: "users",
    timestamps: false,
})
export class User extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: "user_id",
    })
    userId!: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING(255),
        unique: true,
        allowNull: false,
    })
    email!: string;

    @Column({
        type: DataType.STRING(15),
        unique: true,
    })
    phone!: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING(255),
        field: "profile_image_url",
    })
    profileImageUrl!: string;

    @Column({
        type: DataType.STRING(100),
    })
    location!: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserType)),
        allowNull: false,
        defaultValue: UserType.USER,
    })
    type!: UserType;

    @Column({
        type: DataType.ENUM(...Object.values(UserStatus)),
        allowNull: false,
        defaultValue: UserStatus.OFFLINE,
    })
    status!: UserStatus;

    @Column({
        type: DataType.INTEGER,
    })
    rating!: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: "registration_date",
    })
    registrationDate!: Date;

    @Column({
        type: DataType.DATE,
        field: "online_date",
    })
    onlineDate!: Date;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        field: "newsletter_subscription",
    })
    newsletterSubscription?: boolean;

    @HasMany(() => RefreshToken)
    refreshTokens!: RefreshToken[];

    @HasMany(() => Advertisement)
    advertisements!: Advertisement[];

    @HasMany(() => Review)
    reviews!: Review[];

    @HasMany(() => Favorite)
    favorites!: Favorite[];

    @HasMany(() => Notification, { foreignKey: "senderId" })
    sentNotifications!: Notification[];

    @HasMany(() => Notification, { foreignKey: "receiverId" })
    receivedNotifications!: Notification[];
}