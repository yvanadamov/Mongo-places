function init() {
	var map = new Map('sample', 'objects');

	// set map center to user's current
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(pos) {
			var lat = pos.coords.latitude,
				lng = pos.coords.longitude;

			map.setCenter(lat, lng);
		});
	}

	// get user information if is logged
	$.get('users/', function(response) {
		var isLogged = (response.user.isLogged);
		var all = {};
		var favs = {};

		var id;

		for(var j in response.pois) {
			id = response.pois[j]._id;

			all[id] = response.pois[j];
		}
		
		if(isLogged) {
			for(var i in response.user.favs) {
				id = response.user.favs[i]._id;

				favs[id] = response.user.favs[i];
			}
		}

		map.setInitialState(all, isLogged, favs);
		map.addMarkers(all);
		updateLikes();
	});

	// add poi to user favorites
	$(document).on('click', '.addfav', function() {
		var button		= this,
			buttonData	= $(button).data(),
			id			= buttonData.poi_id;

		$.post('/users/favs/add/', {id: id}, function(res) {
			if(res.success) {
				map.user.favs[id] = map.allObjects[id];

				// prompt success to user and remove adding button
				alert('Object was successfully added to your favorites');
				button.remove();
				updateLikes();
			}
		});
	});

	// del poi from user favorites
	$(document).on('click', '.delfav', function() {
		var li			= $(this).parent(),
			parentData	= $(li).data(),
			poiID		= parentData.poi_id;
		
		$.post('/users/favs/delete/', {poiID: poiID}, function(res) {
			if(res.success) {
				map.pois[poiID].marker.setMap(null);
				delete map.pois[poiID];
				delete map.user.favs[poiID];
				
				// prompt success to user and remove adding button
				alert('Object was successfully deleted from your favorites');
				li.remove();
				updateLikes();
			}
		});
	});

	// to make links in info windows asynch requests
	$(document).on('click', '.mapLink', function(event){
		event.preventDefault();

		$.get(this.href, function(pois) {
			map.addMarkers(pois);
		});
	});

	// to return favs from user object instead of sending request
	$(document).on('click', '.favs', function(event) {
		event.preventDefault();
		map.addMarkers(map.user.favs);
		$('.poili').append('<button class="delfav">Remove</button>');
	});

	// to return all objects from frontend instead of sending request 
	$(document).on('click', '.all', function(event){
		event.preventDefault();
		map.addMarkers(map.allObjects);
	});
}

function updateLikes() {
	$('#likes').html('<h3>Most liked objects by types</h3>');

	$.get('/pois/all/likes/', function(categories) {
		categories.forEach(function(category) {
			var title = Object.keys(category)[0];

			var list = category[title].reduce(function(prev, cur) {
				return prev+'<li>'+cur.name+' - '+cur.likes+'</li>';
			}, '');

			$('#likes').append('<div><h4>'+title+'</h4><ol>'+list+'</ol></div>');
		});
	});
}