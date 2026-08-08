import urllib.request
import json
import time
import sys

URL = "http://localhost:8000/api/realtime/ingest"

SAMPLES = [
    {
        "title": "VoIP Vishing Syndicate",
        "victim_name": "Anil Deshmukh",
        "loss_amount": "₹4,80,000",
        "source_channel": "CYBER_HELPLINE_1930",
        "evidence_type": "AUDIO_VOIP",
        "description": "Intercepted 1930 helpline recording of automated deepfake caller impersonating HDFC Fraud Cell."
    },
    {
        "title": "Crypto Drainer Scam",
        "victim_name": "Meera Patel",
        "loss_amount": "₹15,00,000",
        "source_channel": "ETHERSCAN_WEBSOCKET_ALERT",
        "evidence_type": "DOCUMENT_TX",
        "description": "Real-time wallet tracking flagged high-velocity transfer to blacklisted liquidity pool."
    },
    {
        "title": "Phishing Portal OTP Intercept",
        "victim_name": "Rajesh Sharma",
        "loss_amount": "₹1,20,000",
        "source_channel": "ABUSE_IPDB_FEED",
        "evidence_type": "IMAGE_SCREENSHOT",
        "description": "Typosquatted bank URL screenshot captured via automated honey-client crawler."
    }
]

def trigger_ingest(sample):
    data = json.dumps(sample).encode('utf-8')
    req = urllib.request.Request(URL, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            print(f"✅ Realtime Feed Ingested: {res.get('message')}")
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")

if __name__ == "__main__":
    print("🚀 Sarthi Forensics Realtime Cybercrime Stream Generator starting...")
    idx = 0
    if len(sys.argv) > 1 and sys.argv[1] == "--loop":
        while True:
            sample = SAMPLES[idx % len(SAMPLES)]
            print(f"\n📡 Pushing Live Feed Event #{idx+1}...")
            trigger_ingest(sample)
            idx += 1
            time.sleep(5)
    else:
        sample = SAMPLES[0]
        trigger_ingest(sample)
