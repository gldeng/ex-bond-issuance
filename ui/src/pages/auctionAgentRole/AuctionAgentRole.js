/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery } from "@daml/react";

import { AuctionAgentRole } from "@daml.js/bond-issuance-2.0.0/lib/DA/RefApps/Bond/Roles/AuctionAgentRole";

export default function Report() {

  const roles = useStreamQuery(AuctionAgentRole);
  return (
    <Contracts
      contracts={roles.contracts}
      columns={[["Contract Id", "contractId"],

      ["Auction Agent", "payload.auctionAgent"],
      ["Regulators", "payload.regulators"],
      ]} />);
}
