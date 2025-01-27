#!/usr/bin/env python3
#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#

import logging
import sys
import time

from damlassistant import get_package_id, start_trigger_service_in_background, kill_background_process, \
    add_trigger_to_service, wait_for_port, catch_signals, DEFAULT_TRIGGER_SERVICE_PORT, DEFAULT_SANDBOX_PORT


dar = 'target/bond-issuance-triggers.dar'

triggers_with_parties = [
    ("Bank1", "DA.RefApps.Bond.Triggers.InvestorSettlementTrigger:investorSettlementTrigger"),
    ("Bank1", "DA.RefApps.Bond.Triggers.PlaceBidTrigger:placeBidTrigger"),
    ("Bank2", "DA.RefApps.Bond.Triggers.InvestorSettlementTrigger:investorSettlementTrigger"),
    ("Bank2", "DA.RefApps.Bond.Triggers.PlaceBidTrigger:placeBidTrigger"),
    ("Bank3", "DA.RefApps.Bond.Triggers.InvestorSettlementTrigger:investorSettlementTrigger"),
    ("Bank3", "DA.RefApps.Bond.Triggers.PlaceBidTrigger:placeBidTrigger"),
    ("Issuer", "DA.RefApps.Bond.Triggers.CommissionTrigger:commissionTrigger"),
    ("Issuer", "DA.RefApps.Bond.Triggers.RedemptionFinalizeTrigger:redemptionFinalizeTrigger"),
    ("AuctionAgent", "DA.RefApps.Bond.Triggers.AuctionFinalizeTrigger:auctionFinalizeTrigger"),
    ("Csd", "DA.RefApps.Bond.Triggers.RedemptionCalculationTrigger:redemptionCalculationTrigger"),
]

if len(sys.argv) < 2:
    print(f"Usage: startTriggers.py SANDBOX_PORT")
    exit(1)
sandbox_port = sys.argv[1]

logging.basicConfig(level=logging.DEBUG)

wait_for_port(port=sandbox_port, timeout=30)

service = start_trigger_service_in_background(dar = dar, sandbox_port = sandbox_port)
try:
    catch_signals()
    package_id = get_package_id(dar)
    wait_for_port(port=DEFAULT_TRIGGER_SERVICE_PORT, timeout=30)
    for party, triggerName in triggers_with_parties:
        add_trigger_to_service(party=party, package_id=package_id, trigger=triggerName)
    time.sleep(3)
    print('\nPress Ctrl+C to stop...')
    service.wait()
    logging.error(f"Trigger service died unexpectedly:\n{service.stderr}")
finally:
    kill_background_process(service)
