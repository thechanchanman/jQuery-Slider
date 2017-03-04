// temporary debugging
var currentPanel = 1,
		totalPanels = 0,
		autoPlay = true,
		timePassed = 0,
		timeToChange = 3;

function setCaption() {
	var captionHeight = $('.slider-caption').height();
	var sliderHeight = $('.slider-container').height();
	var newCaptionHeight = sliderHeight - captionHeight - 15;
	$('.slider-caption').delay(100).animate({top: newCaptionHeight}, 500);
}

function initializeSlider() {
	$('.slider-caption-content').html(
		$('.slider-panels .slider-panel:first .slider-panel-caption').html()
	);
	$('.slider-nav button.slider-nav-item:first').addClass('selected');
	$('.slider-photos').fadeIn(1500);
	setCaption();
}

function autoAdvance() {
	if (window.timePassed === window.timeToChange) {
		window.timePassed = 0;
		$('.progress').animate({width: 0}, 100);
		if (window.currentPanel === window.totalPanels) {
			window.currentPanel = 0;
		}
		if (window.autoPlay === true) {
			$('.slider-nav button.slider-nav-item:nth-child(' + (window.currentPanel + 1) + ')').trigger('click');
			$('.progress').animate({width: "100%"}, (timeToChange * 1000) + 800);
		}
	} else {
		window.timePassed += 1;
	}
	/* debug */ $('.timePassed').html("timePassed = " + window.timePassed);
	/* debug */ $('.autoPlay').html("autoPlay = " + window.autoPlay);
}


$(document).ready(function() {
	
	// temporary debugging
	$('.autoPlay').html("autoPlay = " + window.autoPlay);
	$('.timePassed').html("timePassed = " + window.timePassed);
	$('.timeToChange').html("timeToChange = " + window.timeToChange);
	$('.currentPanel').html("currentPanel = " + window.currentPanel);
	
	// Autoplay
	if (window.autoPlay) {
		$('.slider-container').addClass('autoplay');
		setInterval(autoAdvance, 1000);
		$('.progress').animate({width: "100%"}, (timeToChange * 1000) + 800);
	}
	
	$('.slider-container').hover(function() {
		window.autoPlay = false;
		$(this).removeClass('autoplay');
		$('.progress').stop();
		$('.progress').animate({width: "0%"}, 0);
	}, function() {
			window.autoPlay = true;
			window.timePassed = 0;
			$(this).addClass('autoplay');
			$('.progress').animate({width: "100%"}, (timeToChange * 1000) + 800);
	});
	
	// Preload
	$('.slider-panels img').imgpreload(function() {
		initializeSlider();
	});
	
	// Generate photos
	$('img.slider-panel-photo').each(function(index) {
		var photoWidth = $('.slider-container').width();
		var photoPosition = index * photoWidth;
		$('.slider-photos').append('<img class="slider-photo" style="left:' + photoPosition + "px;" + '" src="' + $(this).attr('src') + '" alt="' + $(this).attr('alt') + '" width="' + photoWidth + '" height="400" />');
		$('.slider-photos').css('width', photoPosition + photoWidth);
	});
	
	// Generate navigation links
	$('.slider-panels .slider-panel').each(function(index) {
		$('.slider-nav').append('<button class="slider-nav-item"></button>');
		/* debug */ window.totalPanels = index + 1;
		/* debug */ $('.totalPanels').html("totalPanels = " + window.totalPanels);
	});
	
	// Set up navigation links
	$('.slider-nav button.slider-nav-item').click(function() {
		$('.slider-nav button.slider-nav-item').removeClass('selected');
		$(this).addClass('selected');
		
		var navClicked = $(this).index(); // get the index
		var sliderWidth = $('.slider-container').width(); // get the slider's width
		var distanceToMove = sliderWidth * (-1); // negate width
		var newPhotoPosition = navClicked * distanceToMove + "px"; // eg. 2 * (-600) = -1200px distance to left
		var newCaption = $('.slider-panel-caption').get(navClicked); // get the corresponding caption
		/* debug */ window.currentPanel = navClicked + 1;
		/* debug */ $('.currentPanel').html("currentPanel = " + window.currentPanel);
		
		$('.slider-photos').animate({left: newPhotoPosition}, 1000);
		$('.slider-caption').animate({top: '400px'}, 500, function() {
			var newHTML = $(newCaption).html();
			$('.slider-caption-content').html(newHTML);
			setCaption();
		});
	});
});