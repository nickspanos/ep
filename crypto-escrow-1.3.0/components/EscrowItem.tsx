import { useCallback, useContext, useMemo, useState } from "react";
import { CopyAbleAddress } from "./CopyAbleAddress";
import { BigNumber, ethers } from "ethers";
import Skeleton from "react-loading-skeleton";
import { EscrowContext } from "../contexts/EscrowContext";
import { useCountdown } from "../hooks/useCountdown";
import {
	useClaimFundMutation,
	useDeliverFundMutation,
	useEscrowMetaQuery,
	useRefundMutation,
} from "../lib/queries";
import { EscrowResponse } from "../types/EscrowHub";
import { EscrowState } from "../types/general";
import { QRCode } from 'react-qrcode-logo';
import {  Modal } from "react-bootstrap";
import LogoImage from "../images/logo.png"

const toDate = (timestamp: BigNumber) => {
	return new Date(timestamp.toNumber() * 1000);
};

export const EscrowItem = ({
	escrow,
}: {
	escrow: EscrowResponse;
}) => {
	const { symbol, signerAddress } = useContext(EscrowContext);

	const [detailsModal, setDetailsModal] = useState(false)
	
	const { mutate: mutateDeliverFund } = useDeliverFundMutation();
	const { mutate: mutateClaimFund } = useClaimFundMutation();
	const { mutate: mutateRefund } = useRefundMutation();

	const { data: meta, isLoading: metaLoading } = useEscrowMetaQuery(
		escrow.cid
	);
	const { timer, isExpired } = useCountdown(toDate(escrow.expireAt));

	const meAs = useMemo(() => {
		const address = signerAddress?.toLowerCase();
		switch (address) {
			case escrow.buyer.toLowerCase():
				return "buyer";
			case escrow.seller.toLowerCase():
				return "seller";
			case (process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS??'').toLowerCase():
				return "owner";
			default:
				return "unknown";
		}
	}, [signerAddress, escrow.buyer, escrow.seller]);

	const contextualClass = useMemo(() => {
		const state = escrow.state as EscrowState;
		switch (state) {
			case EscrowState.AWAITING_DELIVERY:
				return "warning";
			case EscrowState.COMPLETED:
				return "success";
			case EscrowState.CLAIMED_ON_EXPIRE:
				return "primary";
			case EscrowState.REFUNDED:
				return "danger";
			default:
				return "warning";
		}
	}, [escrow.state]);
	const statusText = useMemo(() => {
		const state = escrow.state as EscrowState;
		switch (state) {
			case EscrowState.AWAITING_DELIVERY:
				return "Pending";
			case EscrowState.COMPLETED:
				return "Completed";
			case EscrowState.CLAIMED_ON_EXPIRE:
				return "Claimed on Expire";
			case EscrowState.REFUNDED:
				return "Refunded";
		}
	}, [escrow.state]);

	const QrcodeImage = useMemo(() => {
		let value = meta?.title??""
		value += `\nID: ${escrow.id}`
		value += `\nAmount: ${ethers.utils.formatEther(escrow.amount)} ${symbol}`
		value += `\nFee: ${ethers.utils.formatEther(escrow.fee)} ${symbol}`
		value += `\nFrom: ${escrow.buyer}`
		value += `\nTo: ${escrow.seller}`
		value += `\nCreated: ${toDate(escrow.createdAt).toDateString()}`
		value += `\nExpire: ${toDate(escrow.expireAt).toDateString()}`
		value += `\nStatus: ${statusText}`

		return <QRCode id={`react-qrcode-logo-${escrow.id}`} logoImage={LogoImage.src} removeQrCodeBehindLogo={true} value={value} size={300} fgColor="#000" />
	}, [escrow.amount, escrow.buyer, escrow.createdAt, escrow.expireAt, escrow.fee, escrow.id, escrow.seller, meta?.title, statusText, symbol])

	const claimOnExpire = useCallback(() => {
		if (confirm("Are you sure to claim escrow?")) {
			mutateClaimFund(escrow.id);
		}
	}, [escrow.id, mutateClaimFund]);

	const deliverFund = useCallback(() => {
		if (confirm("Are you sure to deliver fund?")) {
			mutateDeliverFund(escrow.id);
		}
	}, [escrow.id, mutateDeliverFund]);

	const refund = useCallback(() => {
		if (confirm("Are you sure to refund?")) {
			mutateRefund(escrow.id);
		}
	}, [escrow.id, mutateRefund]);

	return (
		<div
			className={`escrow-card border border-1 border-${contextualClass}`}
		>
			<span
				className={`escrow-status badge bg-${contextualClass}`}
			>
				{statusText}
			</span>
			<h3>
				{ethers.utils.formatEther(escrow.amount)} {symbol}
			</h3>
			<h4>{metaLoading ? <Skeleton /> : meta?.title}</h4>
			{metaLoading ? <Skeleton /> : <a href="#" className="text-dark underline" onClick={() => setDetailsModal(true)}>QR & Details</a>}
			<ul className="list-group mt-3">
				<li className="list-group-item d-flex justify-content-between">
					<span className="font-weight-bold">From</span>
					<CopyAbleAddress
						address={escrow.buyer}
						signerAddress={signerAddress}
					/>
				</li>
				<li className="list-group-item d-flex justify-content-between">
					<span className="font-weight-bold">To</span>
					<CopyAbleAddress
						address={escrow.seller}
						signerAddress={signerAddress}
					/>
				</li>
				<li className="list-group-item d-flex justify-content-between">
					<span className="font-weight-bold">Fee</span>
					<span>
						{ethers.utils.formatEther(escrow.fee)} {symbol}
					</span>
				</li>
				{metaLoading ? (
					<Skeleton />
				) : (
					<li className="list-group-item d-flex justify-content-between">
						<span className="font-weight-bold">Attachments</span>
						<span>
							{meta?.attachments?.map((fileUrl, fileUrlIndex) => (
								<a className="ms-3"
									key={fileUrlIndex}
									href={fileUrl}
									target="_blank"
									rel="noreferrer"
								>
									⇓
								</a>
							))}
						</span>
					</li>
				)}
				<li className="list-group-item d-flex justify-content-between">
					<span className="font-weight-bold">Created At</span>
					<span>{toDate(escrow.createdAt).toDateString()}</span>
				</li>
				{
					escrow.state === EscrowState.AWAITING_DELIVERY && 
					<li className="list-group-item d-flex justify-content-between">
						<span className="font-weight-bold">
							{isExpired ? "Expired At" : "Remaining"}
						</span>
						<span>
							{isExpired
								? toDate(escrow.expireAt).toDateString()
								: timer.formatted}
						</span>
					</li>
				}
				{escrow.state !== EscrowState.AWAITING_DELIVERY && (
					<li className="list-group-item d-flex justify-content-between">
						<span className="font-weight-bold">Delivered At</span>
						<span>{toDate(escrow.clearAt).toDateString()}</span>
					</li>
				)}
				{escrow.state === EscrowState.AWAITING_DELIVERY &&
					meAs === "buyer" && (
						<li className="list-group-item">
							<button
								className="btn btn-warning btn-sm w-100"
								type="button"
								onClick={deliverFund}
							>
								Deliver Fund
							</button>
						</li>
					)}
				{escrow.state === EscrowState.AWAITING_DELIVERY &&
					["seller", "owner"].includes(meAs) && (
						<li className="list-group-item">
							<div
								className="btn-group btn-group-sm"
								role="group"
							>
								{isExpired && meAs === "seller" && (
									<button
										className="btn btn-warning"
										type="button"
										onClick={claimOnExpire}
									>
										Claim Fund
									</button>
								)}
								<button
									className="btn btn-danger"
									type="button"
									onClick={refund}
								>
									Refund
								</button>
							</div>
						</li>
					)}
			</ul>
			<Modal
				show={detailsModal}
				onHide={() => setDetailsModal(false)}
			>
				<Modal.Header closeButton>
						<Modal.Title>QR & Details</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="qr-image text-center">{QrcodeImage}</div>
						<article className="mt-3 px-3">
							<h4 className="text-center">{meta?.title??'NO TITLE'}</h4>
							<p>{meta?.description}</p>
						</article>
					</Modal.Body>
			</Modal>
		</div>
	);
};

export const EscrowCardLoader = () => (
	<div className="escrow-card-loader">
		<Skeleton count={4} />
	</div>
);
