export type EscrowDoc = {
	name: string;
	description: string | null | undefined;
};

export type NewEscrowInputs = {
	sellerAddress: string;
	amount: number;
	expire_at: string;
	doc: FileList | null | undefined;
	contractTitle: string;
	contractDescription: string | null | undefined;
};

export enum EscrowState {
	AWAITING_DELIVERY,
	COMPLETED,
	CLAIMED_ON_EXPIRE,
	REFUNDED,
};

export type EscrowMeta = {
	title: string;
	description: string | null | undefined;
	attachments: Array<string>
}