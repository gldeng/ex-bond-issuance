/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery } from "@daml/react";

import { BidderParticipation } from "@daml.js/bond-issuance-2.0.0/lib/DA/RefApps/Bond/Auction";

export default function Report() {

  const reviews = useStreamQuery(BidderParticipation);

  return (<Contracts contracts={reviews.contracts}
    columns={[["Contract Id", "contractId"],

    ["Auction Agent", "payload.auctionAgent"],
    ["Auction Name", "payload.auctionName"],
    ["Bidder", "payload.bidder"],
    ["Issuer", "payload.issuer"],
    ["Size", "payload.size"],
    ["Start Date", "payload.startDate"],
    ["End Date", "payload.endDate"],
    ]} />);
}
