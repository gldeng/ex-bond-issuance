/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery} from "@daml/react";

import { CentralBankRoleInvitation } from "@daml.js/bond-issuance-2.0.0/lib/DA/RefApps/Bond/Roles/CentralBankRole";

export default function Report() {

  const reviews = useStreamQuery(CentralBankRoleInvitation);

  return (<Contracts contracts={reviews.contracts}
    columns={[ ["Contract Id","contractId"],
		["Central Bank", "payload.centralBank"],
		["Regulators", "payload.regulators"],
	]} /> ); }
