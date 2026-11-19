import json, sys
payload = json.load(sys.stdin)
expected = sys.argv[1]
if payload.get("version") != expected:
    sys.exit(f"ECHEC : version reçue {payload.get('version')}, attendue {expected}")
if not payload.get("services") or not all(s.get("actif") for s in payload["services"]):
    sys.exit("ECHEC : catalogue vide ou service inactif")
print(f"SUCCES : catalogue actif et version {expected} confirmée")
