import { useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useEscrowsPaginatedQuery, useSingleEscrowQuery } from "../lib/queries";
import {
	EscrowResponse,
	FetchEscrowsPaginatedResponse,
} from "../types/EscrowHub";
import { EscrowState } from "../types/general";
import { EscrowItem } from "./EscrowItem";
import { NewEscrow } from "./NewEscrow";

export const AllEscrows = () => {
	const {
		data: paginatedResult,
		fetchNextPage,
		hasNextPage,
		isLoading: escrowLoading,
	} = useEscrowsPaginatedQuery();

	const [searchKey, setSearchKey] = useState<string>("");
	const [type, setType] = useState("-1");

	const allMyEscrows = useMemo(
		() =>
			paginatedResult?.pages.reduce(
				(
					accumulator: Array<EscrowResponse>,
					current: FetchEscrowsPaginatedResponse
				) => {
					accumulator.push(...(current?.data ?? []));
					return accumulator;
				},
				[]
			) ?? [],
		[paginatedResult]
	);

	const allMyEscrowsFiltered = useMemo(() => {
		if (!allMyEscrows) return [];
		if (parseInt(type) === -1) return allMyEscrows;
		return allMyEscrows?.filter(
			(escrow) => escrow.state === parseInt(type)
		);
	}, [type, allMyEscrows]);

	const { data: searchResultEscrow, isLoading: searchResultLoading } =
		useSingleEscrowQuery(searchKey);

	return (
		<>
			<div className="row g-3 align-items-center justify-content-between mb-4">
				<div className="col-md d-flex align-items-center justify-content-between justify-content-md-start">
					<h2>{searchKey ? "Search Result" : "All Your Escrows"}</h2>
					<NewEscrow className="ms-3" />
				</div>
				<div className="col-md d-flex flex-md-nowrap flex-wrap align-items-center justify-content-between justify-content-md-end">
					<Form.Control
						type="search"
						placeholder="Search By Escrow ID"
						className="w-auto me-3 mb-3"
						value={searchKey}
						onInput={(e) =>
							setSearchKey((e.target as HTMLInputElement).value)
						}
					/>
					<Form.Select
						className="w-auto mb-3"
						onInput={(e) =>
							setType(
								(e.target as HTMLInputElement).value ?? "-1"
							)
						}
					>
						<option value={-1}>All</option>
						<option value={EscrowState.AWAITING_DELIVERY}>
							Pending
						</option>
						<option value={EscrowState.COMPLETED}>Cleared</option>
						<option value={EscrowState.CLAIMED_ON_EXPIRE}>
							Seller Claimed
						</option>
						<option value={EscrowState.REFUNDED}>Refunded</option>
					</Form.Select>
				</div>
			</div>
			{!searchKey && (
				<>
					{!!allMyEscrows?.length && (
						<div className="row">
							{allMyEscrowsFiltered.length ? (
								allMyEscrowsFiltered.map(
									(escrowItem: any, escrowIndex: any) => (
										<div
											className="col-xl-3 col-lg-4 col-md-6"
											key={escrowIndex}
										>
											<EscrowItem escrow={escrowItem} />
										</div>
									)
								)
							) : (
								<h2 className="text-center mb-3">
									You have no escrows
								</h2>
							)}
						</div>
					)}
					{!allMyEscrows?.length ? (
						<div className="my-5">
							<h2 className="text-center mb-3">
								You have no escrows
							</h2>
							<div className="text-center">
								<NewEscrow className="btn-lg">
									Create One
								</NewEscrow>
							</div>
						</div>
					) : null}
					{hasNextPage && (
						<div className="my-3 text-center">
							<button
								type="button"
								className="btn btn-lg btn-warning"
								disabled={escrowLoading}
								onClick={() => fetchNextPage()}
							>
								{escrowLoading ? "Loading..." : "Load More"}
							</button>
						</div>
					)}
				</>
			)}
			{searchKey && (
				<>
					{searchResultEscrow && searchResultEscrow?.id?.toNumber() > 0 && (
						<div className="row mt-4">
							<div className="col-xl-3 col-lg-4 col-md-6">
								<EscrowItem escrow={searchResultEscrow} />
							</div>
						</div>
					)}
					{!searchResultLoading && (!searchResultEscrow || searchResultEscrow?.id?.toNumber() < 1) && (
						<h2 className="text-center mb-3">No Search Result</h2>
					)}
				</>
			)}
		</>
	);
};
