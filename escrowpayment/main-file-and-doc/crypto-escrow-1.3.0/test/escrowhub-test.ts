import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers, upgrades } from "hardhat";
import { EscrowHub } from "../types/EscrowHub";
import { ContractReceipt } from "ethers";
import { EscrowState } from "../types/general";

const eventFired = (eventName: string, receipt: ContractReceipt) => receipt.events?.find((ev) => ev.event === eventName)??undefined

describe("EscrowHub Contract", () => {
	const setupEscrowHub = async () => {
		const contractFactory = await ethers.getContractFactory("EscrowHub");
		const [owner, address1, address2] = await ethers.getSigners();
		const EscrowHubProxy = await upgrades.deployProxy(contractFactory, {
			kind: "uups",
		});

		let escrowHub: EscrowHub =
			(await EscrowHubProxy.deployed()) as unknown as EscrowHub;

		return { contractFactory, escrowHub, owner, address1, address2 };
	};

	describe("Deployment", () => {
		it("Must match the owner", async () => {
			const { escrowHub, owner } = await loadFixture(setupEscrowHub);
			expect(await escrowHub.owner()).to.equal(owner.address);
		});

		it("Should Return 0 Escrows", async () => {
			const { escrowHub } = await loadFixture(setupEscrowHub);
			const escrows = await escrowHub.fetchMyEscrows();
			expect(escrows.length).to.equal(0);
		});
	});

	describe("Methods", () => {
		it("Should Create Escrow & Emit EscrowCreated event", async () => {
			const { escrowHub, owner, address1, address2 } = await loadFixture(
				setupEscrowHub
			);

			//@ts-ignore
			const newInteraction = escrowHub.connect(
				address1
			) as unknown as EscrowHub;

			const trx = await newInteraction.newEscrow(
				address2.address,
				"NO_CID",
				Math.round(
					new Date().getTime() / 1000 + 24 * 3600 // Add 1 day with today in seconds
				),
				{
					value: ethers.utils.parseEther(`${10}`),
				}
			);
			const receipt = await trx.wait();

            const escrowCreatedEvent = eventFired('EscrowCreated', receipt)

            expect(escrowCreatedEvent?.args?.escrowId.toString()).to.equal('1')
            expect(escrowCreatedEvent?.args?.cid).to.equal('NO_CID')
            expect(escrowCreatedEvent?.args?.buyer).to.equal(address1.address)
            expect(escrowCreatedEvent?.args?.seller).to.equal(address2.address)
            expect(escrowCreatedEvent?.args?.state).to.equal(EscrowState.AWAITING_DELIVERY)

            const escrows = await newInteraction.fetchMyEscrows()

            expect(escrows.length).to.equal(1)

            // @ts-ignore
            const escrowsAsSeller = await (escrowHub.connect(address2) as unknown as EscrowHub).fetchMyEscrows()

            expect(escrowsAsSeller.length).to.equal(1)
            expect(escrows.length).to.equal(1)

            // @ts-ignore
            const escrowsAsOwner = await (escrowHub.connect(owner) as unknown as EscrowHub).fetchMyEscrows()

            expect(escrowsAsOwner.length).to.equal(1)
		});
	});
});
