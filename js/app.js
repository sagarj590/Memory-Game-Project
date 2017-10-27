const APP = (function ($, swal, AC, stopwatch) {
	let opened = [],
			cards = $('.card'),
			totalCards = cards.length,
			cardMatched = 0,
			moves = 0, 
			rating = 3,
			timeRunning = false;
	
	const deck = $('.deck'), 
				moveCounter = $('.moves'),
				stars = $('.stars'),
				starsDefault = $('.stars').html(),
				ratingThreeStar = 16, 
				ratingTwoStar = 30, 
				classOpen = 'open show', 
				classMatch = 'match',
				classMisMatch = 'mismatch',
				classRatingIcon = 'fa',
				classRatingFill = 'fa-star',
				classRatingBlank = 'fa-star-o',
				time = $('.stopwatch'),
				timeDefault = $('.stopwatch').html();
	
	//*initialize the app*
	const init = function () {
		resetDeck();
	};
	
	const shuffle = function (array) {
		let currentIndex = array.length,
			temporaryValue, randomIndex;

		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};
	
	// *reset the deck of cards*
	const resetDeck  = function () {
		opened = [];
		cardMatched = 0;
		cards.removeClass(`${classMatch} ${classMisMatch} ${classOpen}`);
		resetMove(); //*reset the moves counter*
		resetRating(); //*reset the ratings counter*
		
		//*stop and reset the timer*
		timeRunning = false;
		stopwatch.restart();
		stopwatch.stop();
		time.html(timeDefault);
		
		//*shuffle cards and clear the deck.*
		cards = shuffle(cards); 
		deck.empty(); 
		
		//*add cards to deck*
		cards.each( function(card) {
			deck.append($(this));
		});
	};
	
	//*function for flipping and checking cards*
	const openCard = function (current) {
		if (!timeRunning) {
			timeRunning = true;
			stopwatch.start();
		}

		//*check wether the cards are different or not*
		if ( current.hasClass(classOpen) || current.hasClass(classMatch) ) {
			return;
		}
		
		//*flip the card*
		current.addClass(classOpen);
		countMove(); //*increase the number of moves*
		ratingCount();
		
		//*check card after flipping*
		const transitionEvent = AC.whichTransitionEvent();
		current.one(transitionEvent, function(e) {
				cardChecker(current);
		});
		
	};
	
	//*check the currently opened cards and compare them with each other from data-card attributes.*
	const cardChecker = function (current) {
		opened.push(current);
		if (opened.length === 2) {
			const firstOpened = opened[0],
						secondOpened = opened[1];
			if ( firstOpened.attr('data-card') === secondOpened.attr('data-card') ) {
				correctMatch(firstOpened, secondOpened);
			}
			else {
				wrongMatch(firstOpened, secondOpened);
			}
			
			opened = [];
		}
		
	};
	
	//*function to set class when the cards match with each other.*
	const correctMatch = function (firstCard, secondCard) {
		cardMatched += 2;
		winChecker();
		firstCard.addClass(classMatch).removeClass(classOpen);
		secondCard.addClass(classMatch).removeClass(classOpen);
	};
	
	//*function to set class when the cards mis-match with each other.*
	const wrongMatch = function (firstCard, secondCard) {
		firstCard.addClass(classMisMatch);
		secondCard.addClass(classMisMatch);
		const animationEvent = AC.whichAnimationEvent();
		firstCard.one(animationEvent, function(e) {
				firstCard.removeClass(`${classMisMatch} ${classOpen}`);
		});
		secondCard.one(animationEvent, function(e) {
				secondCard.removeClass(`${classMisMatch} ${classOpen}`);
		});
		
	};

	//*function to check wether game is won.*
	const winChecker = function () {
		if (cardMatched === totalCards) {
			timeRunning = false;
			stopwatch.stop();
			const totalTime = time.html();
			
			swal({
				title: 'You won the game!!!',
				text: `Your rating is: ${rating} star. Your total time is: ${totalTime}`,
				icon: 'success',
				buttons: ["Cancel", "Play again"]
			})
			.then((playAgain) => {
				if (playAgain) {
					resetDeck();
				}
			});
		}
	};
	
	//*increment move counter, reset it.*
	const countMove = function () {
		moves++;
		moveCounter.html(moves);
	};
	const resetMove = function () {
		moves = 0;
		moveCounter.html(moves);
	};
	
	const ratingCount = function () {
		if ( ( (moves > ratingThreeStar) && (rating === 3) ) ||
				( (moves > ratingTwoStar) && (rating === 2) ) ) {
			stars.children(`:nth-child(${rating})`).find(`.${classRatingIcon}`).removeClass(classRatingFill).addClass(classRatingBlank);
			rating--;
		}
	};
	
	//*reset the rating counter.*
	const resetRating = function () {
		rating = 3;
		stars.html(starsDefault);
	};
	return {
		init: init,
		resetDeck: resetDeck,
		openCard: openCard
	};
	
}(jQuery, swal, ANIMCALLBACK, stopwatch)); 



$(document).ready( function () {
	
	APP.init();
	//*restarts the entire game.*
	$('.restart').click( function () {
		APP.resetDeck();
	});
	
	//*card flipping and checking.*
	$('.deck').on( 'click', '.card', function () {
		APP.openCard( $(this) );
	});
	
});
