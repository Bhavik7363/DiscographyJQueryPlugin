'use strict';

var artistsListJson={"artists":[{"id":"1","name":"Radiohead","website":"http://radiohead.com/","href":"/api/v1/artists/1.json"},{"id":"2","name":"Nick Cave & The Bad Seeds","website":"http://www.nickcave.com/","href":"/api/v1/artists/2.json"},{"id":"3","name":"John Frusciante","website":"http://johnfrusciante.com/","href":"/api/v1/artists/3.json"}],"meta":{"artists":{"page":1,"page_size":10,"count":3,"includes":[],"page_count":1,"previous_page":null,"next_page":null,"previous_href":null,"next_href":null}},"links":{"artists.albums":{"href":"/api/v1/albums.json?artist_id={artists.id}","type":"albums"}}};
var artistsDataJson={"albums":[{"id":"1","title":"Kid A","year":2000,"href":"/api/v1/albums/1.json","links":{"artist":"1"}},{"id":"2","title":"Amnesiac","year":2001,"href":"/api/v1/albums/2.json","links":{"artist":"1"}}],"meta":{"albums":{"page":1,"page_size":10,"count":2,"includes":[],"page_count":1,"previous_page":null,"next_page":null,"previous_href":null,"next_href":null}},"links":{"albums.artist":{"href":"/api/v1/artists/{albums.artist}.json","type":"artists"}}};

describe("Testing the discographyJQuer plug-in ",function(){
		
	beforeEach(function(){
		setFixtures('<div id="dummyDivForTestingDom"></div>');
		spyOn(jQuery,'ajax');
		$('#dummyDivForTestingDom').discographyJQuery(); 
	});
	
	it("Should not display the list of artists on load, on failure of the ajax call",function(){  
		spyOn(window,'alert');
		$.ajax.mostRecentCall.args[0].error();  
		expect($('dummyDivForTestingDom')).not.toHaveId('artistsListContainer');
		expect($('#artistsListContainer li').length).toBe(0);  
	});
	
	it("Should fetch and display the list of artists on load, on success of the ajax call",function(){ 
		$.ajax.mostRecentCall.args[0].success(artistsListJson);  
		expect($('#artistsListContainer li').length).toBe(3);  
	}); 
	
	it("Should not fetch and display the list of albums of an artist on clicking the artist on failure of an ajax call",function(){
		spyOn(window,'alert');
		$.ajax.mostRecentCall.args[0].success(artistsListJson); 
		$('#1').click();
		$.ajax.mostRecentCall.args[0].error(); 
		expect($('#albumsListContainer li').length).toBe(0);
	});

	it("Should fetch and display the list of albums of an artist on clicking the artist, on success of the ajax call",function(){
		$.ajax.mostRecentCall.args[0].success(artistsListJson); 
		$('#1').click();
		$.ajax.mostRecentCall.args[0].success(artistsDataJson);
		expect($('#albumsListContainer li').length).toBe(2);
	});

	it("Should be able to Append the wiki url to the json file",function(){  
		var wikiUrl=spyOn(window,'prompt').andReturn('Google.com');
		$('dummyDivForTestingDom').addWikiUrl(1);
		artistsListJson.WikiUrl=wikiUrl;
		expect($.ajax.mostRecentCall.args[0]["type"]).toEqual("GET"); 
		expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://pcampbellem-test.nodejitsu.com/api/v1/albums.json?artist_id=1");
		$.ajax.mostRecentCall.args[0].success(artistsListJson);
		expect($.ajax.mostRecentCall.args[0]["type"]).toEqual("PUT");
		expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://pcampbellem-test.nodejitsu.com/api/v1/albums.json?artist_id=1");
		expect($.ajax.mostRecentCall.args[0]["data"]).toEqual({newJson:artistsListJson});
	});
});