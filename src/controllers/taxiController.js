// import mbxClient from "@mapbox/mapbox-sdk";
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions');
const directionsClient = mbxDirections({ accessToken: "pk.eyJ1IjoidmxhZGFuZXNlIiwiYSI6ImNrbWNud3IxZDBlcnAydm1jejgzanRjb3oifQ.yq4nrvkPPITU-hQSWs5Lew" });


class TaxiController {
    
	getRoute = async (req, res) => {
		directionsClient
			.getDirections({
				profile: "driving-traffic",
				waypoints: [
					{
						coordinates: [13.4301, 52.5109],
						approach: "unrestricted",
					},
					{
						coordinates: [13.4265, 52.508],
					},
					{
						coordinates: [13.4194, 52.5072],
						bearing: [100, 60],
					},
				],
			})
			.send()
			.then((response) => {
				const directions = response.body;
				res.status(200).json(directions);
			});
	};
}

export default new TaxiController();
