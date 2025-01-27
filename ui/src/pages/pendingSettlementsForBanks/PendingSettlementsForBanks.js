/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger } from "@daml/react";

import { AuctionParticipantSettleRequest } from "@daml.js/bond-issuance-2.0.0/lib/DA/RefApps/Bond/Auction";

export default function Report() {

  const ledger = useLedger();
  const settlementRequests = useStreamQuery(AuctionParticipantSettleRequest);

  const doSettle = function(c) {
    ledger.exercise(AuctionParticipantSettleRequest.AuctionParticipantSettleRequest_Settle, c.contractId, {})
  }

  return (<Contracts contracts={settlementRequests.contracts}
    columns=
    {[["Contract Id", "contractId"],
    ["Seller", "payload.issuer"],
    ["Auction Name", "payload.auctionName"],
    ]}
    actions=
    {[
      ["Settle", doSettle]
    ]}
  />);
}
