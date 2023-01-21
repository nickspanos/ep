import { settings } from "./settings";
import { EscrowContext } from "./../contexts/EscrowContext";
import { useContext } from "react";
import { BigNumberish } from "@ethersproject/bignumber";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
	TransactionReceipt,
	TransactionResponse,
} from "@ethersproject/providers";
import { BigNumber, ContractReceipt, ethers, Event } from "ethers";
import { EscrowDoc, EscrowMeta, NewEscrowInputs } from "../types/general";
import { useWeb3Storage } from "../hooks/web3";
import {
	EscrowResponse,
	FetchEscrowsPaginatedResponse,
} from "../types/EscrowHub";
import axios from "axios";
import { sprintf } from "sprintf-js";

const toastQuery = <TData>(resolver: Promise<TData>, options = {}) =>
	toast.promise<TData>(resolver, {
		loading: "Fetching...",
		success: "Fetched!",
		error: "Error!",
		...options,
	});

/* All Queries */
export const useBalanceQuery = (options = {}) => {
	const { provider, signerAddress } = useContext(EscrowContext);
	return useQuery<BigNumberish>(
		["getBalance", signerAddress],
		() => {
			return toastQuery<BigNumberish>(
				provider.getBalance(signerAddress),
				{
					loading: "Fetching balance...",
					success: "Fetched balance!",
					error: (e: any) => `Error fetching balance: ${e.message}`,
				}
			);
		},
		options
	);
};

export const useMyEscrowsQuery = (options = {}) => {
	const { escrowContract, signerAddress } = useContext(EscrowContext);
	return useQuery<Array<EscrowResponse>>(
		["fetchMyEscrows", signerAddress],
		() => {
			if (!escrowContract) return Promise.resolve([]);
			return toastQuery<Array<EscrowResponse>>(
				escrowContract.fetchMyEscrows(),
				{
					loading: "Fetching escrows...",
					success: "Fetched escrows!",
					error: (e: any) => `Error fetching escrows: ${e.message}`,
				}
			);
		},
		options
	);
};

export const useEscrowsPaginatedQuery = (perPage = 12, options = {}) => {
	const { escrowContract } = useContext(EscrowContext);
	return useInfiniteQuery<FetchEscrowsPaginatedResponse>(
		["escrowPaginated", perPage],
		(metaData) => {
			if (!escrowContract)
				return Promise.resolve({} as FetchEscrowsPaginatedResponse);
			return toastQuery<FetchEscrowsPaginatedResponse>(
				escrowContract.fetchEscrowsPaginated(
					metaData?.pageParam?.cursor ?? 0,
					perPage
				),
				{
					loading: "Fetching escrows...",
					success: "Fetched escrows!",
					error: (e: any) => `Error fetching escrows: ${e.message}`,
				}
			);
		},
		{
			getNextPageParam: (q) => {
				if (q?.hasNextPage) {
					return {
						cursor: q?.nextCursor,
					};
				}
				return undefined;
			},
			keepPreviousData: true,
			...options,
		}
	);
};

export const useEscrowMetaQuery = (cid: string, options = {}) => {
	return useQuery<EscrowMeta>(
		["escrowMeta", cid],
		async () => {
			const meta: EscrowMeta = {
				title: "",
				description: "",
				attachments: [],
			};
			if (!cid || cid === "NO_CID") return meta;

			try {
				const metaDataFromLocalStorage = localStorage.getItem(
					`escrow-meta-${cid}`
				);
				if (metaDataFromLocalStorage) {
					const metaData: EscrowMeta = JSON.parse(
						metaDataFromLocalStorage
					);

					if (metaData) {
						meta.title = metaData.title;
						meta.description = metaData.description;
						meta.attachments = metaData.attachments;
					}
				} else {
					let dataFromRequest,
						gatewayIndex = 0;
					while (
						!dataFromRequest &&
						gatewayIndex < settings.ipfsGateways.length
					) {
						try {
							const { data: metaData } =
								await axios.get<EscrowMeta>(
									sprintf(
										settings.ipfsGateways[gatewayIndex],
										cid,
										"meta.json"
									),
									{
										headers: {
											Accept: "application/json",
										},
									}
								);
							dataFromRequest = metaData;
							dataFromRequest.attachments =
								dataFromRequest.attachments.map((fileName) =>
									sprintf(
										settings.ipfsGateways[gatewayIndex],
										cid,
										fileName
									)
								);
							localStorage.setItem(
								`escrow-meta-${cid}`,
								JSON.stringify(dataFromRequest)
							);
							break;
						} catch (e) {
							gatewayIndex++;
						}
					}

					if (dataFromRequest) {
						meta.title = dataFromRequest.title;
						meta.description = dataFromRequest.description;
						meta.attachments = dataFromRequest.attachments;
					}
				}
			} catch (e) {
				console.log(e);
			}

			return meta;
		},
		options
	);
};

export const useSingleEscrowQuery = (
	escrowId: string | number,
	options = {}
) => {
	const { escrowContract } = useContext(EscrowContext);
	return useQuery<EscrowResponse | null>(
		["singleEscrow", escrowId],
		() => {
			if (!escrowId || !escrowContract) return Promise.resolve(null);
			return toastQuery(escrowContract.fetchEscrow(escrowId), {
				loading: "Getting Escrow Details...",
				success: "Escrow Retrieved",
				error: "Not Found",
			});
		}
	);
};

/* All Mutations */
export const useDeliverFundMutation = () => {
	const queryClient = useQueryClient();
	const { escrowContract, signerAddress } = useContext(EscrowContext);
	return useMutation(
		["deliverFund", signerAddress],
		(escrowId: BigNumber) => {
			if (!escrowContract) return Promise.resolve([]);
			const promise1: Promise<TransactionResponse> =
				escrowContract.deliver(escrowId);
			const promise2: Promise<TransactionReceipt> = promise1.then(
				(trx: TransactionResponse) => trx.wait()
			);
			return toastQuery<Array<TransactionResponse | TransactionReceipt>>(
				Promise.all([promise1, promise2]),
				{
					loading: "Delivering funds...",
					success: "Delivered funds!",
					error: (e: any) => `Error delivering funds: ${e.message}`,
				}
			);
		},
		{
			onSuccess(data, variables, context) {
				queryClient.invalidateQueries(["escrowPaginated"], {
					refetchType: "all",
				});
			},
		}
	);
};

export const useClaimFundMutation = () => {
	const queryClient = useQueryClient();
	const { escrowContract, signerAddress } = useContext(EscrowContext);
	return useMutation(
		["claimFund", signerAddress],
		(escrowId: BigNumber) => {
			if (!escrowContract) return Promise.resolve([]);
			const promise1: Promise<TransactionResponse> =
				escrowContract.claimAfterExpire(escrowId);
			const promise2: Promise<TransactionReceipt> = promise1.then(
				(trx: TransactionResponse) => trx.wait()
			);
			return toastQuery<Array<TransactionResponse | TransactionReceipt>>(
				Promise.all([promise1, promise2]),
				{
					loading: "Claiming funds...",
					success: "Claimed funds!",
					error: (e: any) => `Error claiming funds: ${e.message}`,
				}
			);
		},
		{
			onSuccess(data, variables, context) {
				queryClient.invalidateQueries(["escrowPaginated"], {
					refetchType: "all",
				});
			},
		}
	);
};

export const useRefundMutation = () => {
	const queryClient = useQueryClient();
	const { escrowContract, signerAddress } = useContext(EscrowContext);
	return useMutation(
		["refund", signerAddress],
		(escrowId: BigNumber) => {
			if (!escrowContract) return Promise.resolve([]);
			const promise1: Promise<TransactionResponse> =
				escrowContract.refund(escrowId);
			const promise2: Promise<TransactionReceipt> = promise1.then(
				(trx: TransactionResponse) => trx.wait()
			);
			return toastQuery<Array<TransactionResponse | TransactionReceipt>>(
				Promise.all([promise1, promise2]),
				{
					loading: "Refunding Escrow...",
					success: "Refunded Successfully!",
					error: (e: any) => `Error refunding: ${e.message}`,
				}
			);
		},
		{
			onSuccess(data, variables, context) {
				queryClient.invalidateQueries(["escrowPaginated"], {
					refetchType: "all",
				});
			},
		}
	);
};

export const useStoreEscrowMutation = () => {
	const queryClient = useQueryClient();
	const { escrowContract, signerAddress } = useContext(EscrowContext);
	const web3StorageClient = useWeb3Storage();

	return useMutation(
		["storeEscrow", signerAddress],
		(data: NewEscrowInputs) => {
			const storeEscrow = async () => {
				if (!escrowContract)
					throw new Error("Escrow contract not found");

				let cid = "NO_CID";
				const files = [];
				if (data.doc instanceof FileList && data.doc.length) {
					files.push(...data.doc);
				}
				const obj: EscrowMeta = {
					title: data.contractTitle,
					description: data.contractDescription,
					attachments: files.map((file) => file.name),
				};
				const blob = new Blob([JSON.stringify(obj)], {
					type: "application/json",
				});
				cid = await web3StorageClient.put([
					new File([blob], "meta.json"),
					...files,
				]);

				const expireInSeconds = Math.round(
					new Date(data.expire_at).getTime() / 1000
				);
				const interaction = await escrowContract.newEscrow(
					data.sellerAddress,
					cid,
					expireInSeconds,
					{
						value: ethers.utils.parseEther(`${data.amount}`),
					}
				);

				return interaction.wait();
			};
			return toastQuery<ContractReceipt>(storeEscrow(), {
				loading: "Creating Escrow...Please don't close your browser",
				success: "Created Escrow Successfully!",
				error: (e: any) => `Error creating Escrow: ${e.message}`,
			});
		},
		{
			onSuccess(data, variables, context) {
				const event = data?.events?.length
					? data?.events[0]
					: undefined;
				queryClient.invalidateQueries(["escrowPaginated"], {
					refetchType: "all",
				});
				if (event?.args?.length) {
					queryClient.setQueriesData<EscrowMeta>(
						["escrowMeta", event?.args[1]],
						{
							title: variables.contractTitle,
							description: variables.contractDescription,
							attachments: (
								variables.doc as unknown as Array<File>
							)?.map((file: File) => file.name),
						}
					);
				}
			},
		}
	);
};
