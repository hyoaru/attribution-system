open-tunnel:
	curl https://tunnel.pyjam.as/8001 > tunnel.conf && wg-quick up ./tunnel.conf 

close-tunnel:
	wg-quick down ./tunnel.conf; rm ./tunnel.conf
