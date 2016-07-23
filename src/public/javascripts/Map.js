var Map = function(mapElement, listElement) {
	// center: new google.maps.LatLng(42.6977082, 23.3218675),
	var mapOptions = {
			center: new google.maps.LatLng(0, 0), 
			zoom: 3,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

	this.mapElement		= mapElement;
	this.map			= new google.maps.Map(document.getElementById(mapElement), mapOptions);
	
	this.listElement	= listElement;
	
	this.user			= {isLogged: false, favs: {}};
	this.allObjects		= {};
	this.pois			= {};
};

Map.prototype.setCenter = function(lat, lng) {
	this.map.setCenter(new google.maps.LatLng(lat, lng));
};

Map.prototype.setInitialState = function(allObjects, isLogged, favs) {
	this.allObjects 	= allObjects;
	this.user.isLogged	= isLogged;
	this.user.favs		= favs;
};

Map.prototype.addMarkers = function(pois) {
	var id;
	var loc;
	var name;
	var marker;

	// always clear current markers before adding new ones
	this.clearMarkers();
	
	for(var i in pois) {
		id		= pois[i]._id;
		loc		= pois[i].location;
		name	= pois[i].name;

		// add marker
		this.pois[id] = {
			marker: new google.maps.Marker({
				position: new google.maps.LatLng(loc[1], loc[0]), 
				map: this.map
			}), 
			infoWindow: null
		};

		// add info window
		this.addInfoWindow(id, name)

		// populate list
		$('#'+this.listElement).append('<li class="poili" data-poi_id="'+id+'">'+name+'</li>');

	}
};

Map.prototype.clearMarkers = function() {
	for(var id in this.pois) {
		this.pois[id].marker.setMap(null);
		delete this.pois[id];
	}

	$('#'+this.listElement).html('');
};

Map.prototype.addInfoWindow = function(id, name) {
	var	poi   		= this.pois[id];
	var map   		= this.map;
	var marker  	= poi.marker;
	var canBeAdded	= (this.user.isLogged && !this.user.favs.hasOwnProperty(id));  

	marker.addListener('click', function() {
		if(poi.infoWindow != null) {
			poi.infoWindow.open(map, marker);
			return; 
		}

		$.get('/pois/'+id, function(obj) {
			var content = '<b>'+name+'</b><br/>'+
				'<b>nastilka: '+obj.ground+'</b><br/>'+
				'<b>razmeri: '+obj.size.join('/')+'</b><br/>'+
				'<b>cena na chas: '+obj.price+'lv</b><br/>'+
				'<b>info: '+obj.description+'</b><br/>'+
				
				'<a class="mapLink" href="/pois/?method=1&id='+id+'">This type objects</a><br>'+
				'<a class="mapLink" href="/pois/?method=2&id='+id+'">Nearest 5 objects</a><br>'+
				'<a class="mapLink" href="/pois/?method=3&id='+id+'">Objecs like this</a><br>';

			if(canBeAdded) {
				content += '<button data-poi_id="'+id+'" class="addfav">Add to favorites</button>';
			}

			poi.infoWindow = new google.maps.InfoWindow({content: content});
			poi.infoWindow.open(map, marker);
		});
	});
};