import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user-model.js";


@Table({
    tableName: "notifications",
    timestamps: false,
})
export class Notification extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: "notification_id",
    })
    notificationId!: string;

    @ForeignKey(() => User) 
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: "sender_id",
    })
    senderId!: string;

    @BelongsTo(() => User, { foreignKey: "senderId", as: "sender" })
    sender!: User;

    @ForeignKey(() => User) 
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: "receiver_id",
    })
    receiverId!: string;

    @BelongsTo(() => User, { foreignKey: "receiverId", as: "receiver" })
    receiver!: User;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    message!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        field: "is_read",
    })
    isRead!: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "send_date",
        defaultValue: DataType.NOW,
    })
    sendDate!: Date;
}