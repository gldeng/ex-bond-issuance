#!/usr/bin/env bash
#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#

set -e

cleanup() {
    pids=$(jobs -p)
    echo Killing "$pids"
    [ -n "$pids" ] && kill $pids
}

trap "cleanup" INT QUIT TERM

if [ $# -lt 2 ]; then
    echo "${0} SANDBOX_HOST SANDBOX_PORT [DAR_FILE]"
    exit 1
fi

SANDBOX_HOST="${1}"
SANDBOX_PORT="${2}"
DAR_FILE="${3:-/home/daml/bond-issuance.dar}"

LIST_PARTIES_RESPONSE="$(daml ledger list-parties --host "${SANDBOX_HOST}" --port "${SANDBOX_PORT}" | tail -n +2)"
PARTIES="$(echo "${LIST_PARTIES_RESPONSE}" | cut -d"{" -f2 | cut -d" " -f3 | cut -d"'" -f2)"

run_trigger() {
  local trigger_name="$1"
  local party="$(get_party "$2")"
  daml trigger \
      --wall-clock-time \
      --dar "${DAR_FILE}" \
      --trigger-name "$trigger_name" \
      --ledger-host "${SANDBOX_HOST}" \
      --ledger-port "${SANDBOX_PORT}" \
      --ledger-party "$party"
}

get_party() {
    echo "$PARTIES" | grep "${1}"
}

run_trigger DA.RefApps.Bond.Triggers.InvestorSettlementTrigger:investorSettlementTrigger Bank1 &
run_trigger DA.RefApps.Bond.Triggers.PlaceBidTrigger:placeBidTrigger Bank1 &
run_trigger DA.RefApps.Bond.Triggers.InvestorSettlementTrigger:investorSettlementTrigger Bank2 &
run_trigger DA.RefApps.Bond.Triggers.PlaceBidTrigger:placeBidTrigger Bank2 &
run_trigger DA.RefApps.Bond.Triggers.InvestorSettlementTrigger:investorSettlementTrigger Bank3 &
run_trigger DA.RefApps.Bond.Triggers.PlaceBidTrigger:placeBidTrigger Bank3 &
run_trigger DA.RefApps.Bond.Triggers.CommissionTrigger:commissionTrigger Issuer &
run_trigger DA.RefApps.Bond.Triggers.RedemptionFinalizeTrigger:redemptionFinalizeTrigger Issuer &
run_trigger DA.RefApps.Bond.Triggers.AuctionFinalizeTrigger:auctionFinalizeTrigger AuctionAgent &
run_trigger DA.RefApps.Bond.Triggers.RedemptionCalculationTrigger:redemptionCalculationTrigger CSD &

sleep 2
pids=$(jobs -p)
echo Waiting for $pids
wait $pids
