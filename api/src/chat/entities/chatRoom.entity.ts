import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinTable
} from 'typeorm';

@Entity('chatRoom')
export class ChatRoom {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({nullable: false})
	name: string;

	@Column({nullable: true, default: null})
	password: string;
}

@Entity('chat_room_list')
export class chatRoomList {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false })
	name: string;

	@Column({ type: 'int', nullable: false })
	owner: number;

	@Column('int', { array: true, nullable: true })
	admins: number[];

	@Column('int', { array: true, nullable: true })
	banned: number[];

	@Column('jsonb', { nullable: true })
	muted: Record<number, Date>;

	@Column('int', { array: true, nullable: false })
	users: number[];

	@Column({ type: 'varchar', nullable: false })
	status: string;

	@Column({ type: 'boolean', nullable: false })
	password: boolean;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	updated: Date;

	@OneToMany(() => ChatMessage, message => message.room)
	@JoinTable()
	messages: ChatMessage[];
}

@Entity('chat_messages')
export class ChatMessage {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'text', nullable: false })
	message: string;

	@ManyToOne(() => chatRoomList, room => room.messages, { nullable: false })
	room: chatRoomList;

	@Column({ type: 'int', nullable: false })
	roomId: number;

	@Column({ type: 'varchar', nullable: false })
	room_name: string;

	@Column({ type: 'int', nullable: false })
	senderId: number;

	@Column({ type: 'varchar', nullable: false })
	sender_name: string;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	updated: Date;

	@Column({ type: 'boolean', default: false })
	game: boolean;

	@Column({ type: 'varchar', nullable: true })
	sender_avatar: string;
}