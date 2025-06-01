import httpx

client = httpx.Client(proxy="socks5://127.0.0.1:9150/")

resp = client.get("https://api.ipify.org?format=json")
