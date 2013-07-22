// JQuery plugin discographyJQuery.js 
(function($){

	var baseUrls={
		'_artistBaseUrl':'http://pcampbellem-test.nodejitsu.com/api/v1/albums.json?artist_id=',
		'_baseApiUrl':'http://pcampbellem-test.nodejitsu.com/api/v1/artists.json',
		'_albumsBaseUrl':'http://pcampbellem-test.nodejitsu.com',
	};
	
	// This function takes the url specific to an artist and adds the artist's albums list to the dom
	$.fn.getAlbumsList=function(artistId){
		var albumsListDom=this;
		$.ajax({
                type: 'GET',
				headers:'Access-Control-Allow-Origin',
                url: baseUrls._artistBaseUrl+artistId,
				crossDomain: true,
                data: {},
                dataType: 'jsonp',
                success: function(albumsList) 
                { 
					var htmlContent="<h2>List of albums: </h2>";
					$.each(albumsList.albums,function(index,album){
						htmlContent=htmlContent+"<li>"+album.title+", "+album.year+"</li>";
					});
					htmlContent=htmlContent+"</ol></div>";
					albumsListDom.html(htmlContent);
				},
                error: function() {  alert('Unable to fetch the list of albums');  }
                });
	}
	
	// This function takes the url specific to an artist and allows the user to add wikiUrl to that artist
	$.fn.addWikiUrl=function(artistId){
		var wikiUrl='';
		wikiUrl=prompt("Add url to this Artist");
		if(wikiUrl==null || wikiUrl=='')
		{	
			alert("No Url Added");
			return;
		}
		var jsonData=[];
		$.ajax(
			{
				type: "GET",
				url: baseUrls._artistBaseUrl+artistId,
				crossDomain: true,
				contentType: "application/json; charset=utf-8",
				dataType: "jsonp", 
				success: function(data)
				{
					jsonData=data;
					jsonData.WikiUrl=wikiUrl;	
					$.ajax(
					{
						type: "PUT",
						url: baseUrls._artistBaseUrl+artistId,
						data:{"newJson":jsonData},
						crossDomain: true,
						contentType: "application/json; charset=utf-8",
						dataType: "jsonp", 
						success: function(data)
						{
							alert("Url has been added");
						}
					});			
				}
			});
			
	}
	
	// This function gets the list of all artists.
	$.fn.getArtistsList=function(){
		var artistsListDom=this;
		var htmlContent='';
        $.ajax({
			type: 'GET',
			headers:'Access-Control-Allow-Origin',
            url: baseUrls._baseApiUrl,
			crossDomain: true,
            data: {},
            dataType: 'jsonp',
            success: function(data){ 
					$.each(data.artists,function(index,artist){
						htmlContent=htmlContent+"<li><a href='#' id='"+artist.id+"'>"+artist.name+"</a>&nbsp&nbsp<button id="+artist.id+">add wiki url</button></li>";
					});
					artistsListDom.append(htmlContent+"</ul></div><div id='albumsDivision'><ol id='albumsListContainer'>");
					
					$('#artistsListContainer li a').click(function(){
						$('#albumsListContainer').getAlbumsList(this.id);
					});
					
					$('#artistsListContainer li button').click(function(){
						$('#albumsListContainer').addWikiUrl(this.id);
					});
				},
            error: function() {  alert('Unable to fetch the list of artists');  }
        });
	}
	
	$.fn.discographyJQuery=function(){
		this.append(" <div id='artistsDivision'><h2>List of artists</h2><ul id='artistsListContainer'>");
		$('#artistsListContainer').getArtistsList();
	}	
})(jQuery);
