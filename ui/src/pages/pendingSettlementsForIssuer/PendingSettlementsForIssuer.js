/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery } from "@daml/react";

import { AuctionSettleRequest } from "@daml.js/bond-issuance-2.0.0/lib/DA/RefApps/Bond/Settlement";

export default function Report() {

  const reviews = useStreamQuery(AuctionSettleRequest);


  return (<Contracts contracts={reviews.contracts}
    columns={[["Contract Id", "contractId"],

    ["Buyer", "payload.investor"],
    ["Bond", "payload.issuerBondAssetDeposit.asset.id.label"],
    ["Quantity", "payload.issuerBondAssetDeposit.asset.quantity"],
    ["Price", "payload.cashAmountToPay / payload.issuerBondAssetDeposit.asset.quantity"],
    ["Consideration", "payload.cashAmountToPay"],
    ["Currency", "payload.cashAssetId.label"],
    ]}

  />);
}
