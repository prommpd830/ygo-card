
		var api_url = "https://db.ygoprodeck.com/api/v7";

		// AjaxStart
		$(document).ajaxStart(function() {
			$('#loading-cards').removeClass('d-none');
		});
		// AjaxStop
		$(document).ajaxStop(function() {
			$('#loading-cards').addClass('d-none');
		});
		
		// ----
		function removeForbiddenCharacters(string) {
			let forbiddenChars = [' ']

			for (let char of forbiddenChars){
			    string = string.split(char).join('/');
			}
			return string
		}

		function isMobile() {
			return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|Mobile/i.test(navigator.userAgent);
		}

		// ----
		

		function loadLightbox() {
			$('.lightbox-container img').simpleLightbox({
				// default source attribute
				sourceAttr: 'src',
				// shows fullscreen overlay
				overlay: true,
				// shows loading spinner
				spinner: true,
				// shows navigation arrows
				nav: (isMobile()) ? false : true,
				// text for navigation arrows
				navText: ['<i class="fa fa-arrow-left"></i>','<i class="fa fa-arrow-right"></i>'],
				// shows image captions
				captions: false,
				captionDelay: 0,
				captionSelector: 'img',
				captionType: 'attr',
				captionPosition: 'bottom',
				captionClass: '',
				captionHTML: false,
				// captions attribute (title or data-title)
				captionsData: 'title',
				// shows close button
				close: true,
				// text for close button
				closeText: '<i class="fas fa-times"></i>',
				// swipe up or down to close gallery
				swipeClose: true,
				// show counter
				showCounter: true,
				// file extensions
				fileExt: 'png|jpg|jpeg|gif',
				// weather to slide in new photos or not, disable to fade
				animationSlide: true,
				// animation speed in ms
				animationSpeed: 100,
				// image preloading
				preloading: true,
				// keyboard navigation
				enableKeyboard: true,
				// endless looping
				loop:  true,
				// group images by rel attribute of link with same selector
				rel: false,
				// closes the lightbox when clicking outside
				docClose: false,
				// how much pixel you have to swipe
				swipeTolerance: 50,
				// lightbox wrapper Class
				className: 'simple-lightbox',
				// width / height ratios
				widthRatio: 0.8,
				heightRatio: 0.9,
				// scales the image up to the defined ratio size
				scaleImageToRatio: false,
				// disable right click
				disableRightClick: false,
				// show an alert if image was not found
				alertError:  true,
				// alert message
				alertErrorMessage: 'Image not found, next image will be loaded',
				// additional HTML showing inside every image
				additionalHtml: false,
				// enable history back closes lightbox instead of reloading the page
				history: true,
				// time to wait between slides
				throttleInterval: 0,
				// Pinch to <a href="https://www.jqueryscript.net/zoom/">Zoom</a> feature for touch devices
				doubleTapZoom: 2,
				maxZoom: 10,
				// adds class to html element if lightbox is open
				htmlClass: 'has-lightbox',
				// RTL mode
				rtl: false,
				// elements with this class are fixed and get the right padding when lightbox opens
				fixedClass: 'sl-fixed',
				// fade speed in ms
				fadeSpeed: 100,
				// whether to uniqualize images
				uniqueImages: true,
				// focus the lightbox on open to enable tab control
				focus: true,
			});
		}

		// load click
		function loadClick() {
			// Get name card
			$('#ygo .card-ygo').off('click');
			$('#ygo .card-ygo').click(function () {
				// let url = $(this).data('url');
				let url = $(this).parent().find('span').text();
				$('#ygo').html('');
				loadGetName(url);
				$('.container-btn-back').removeClass('d-none');
			})
		}

		// load more click
		function moreClick(action, num, keyword, type, attribute, format){
			// Button See more
			$('.more').off('click');
			$('.more').click(function (e) {
				e.preventDefault();

				num += 60;
				if(action == 'loadAllCard'){
					loadAllCard(num, type, attribute, format);
				}else if(action == 'loadName'){
					if(keyword === ''){
						loadAllCard();
					}else {
						loadName(num, keyword, type, attribute, format);
					}
				}else if(action == 'loadArchetype'){
					if(keyword === ''){
						loadAllCard()
					}else {
						loadArchetype(keyword);
					}
				}else {
					loadAllCard();
				}
			});
		}

		// Get All Cards
		function loadAllCard(num = 60, type = '', attribute = '', format = '') {
			$('#result-length').parent().removeClass('d-none');

			// Filter Type
			let optionType = '';
			optionType += 'type='+ type +'&';
			if (optionType == 'type=&') {
				optionType = '';
			}

			// Filter Attribute
			let optionAttribute = '';
			optionAttribute += 'attribute='+ attribute +'&';
			if (optionAttribute == 'attribute=&') {
				optionAttribute = '';
			}

			// Filter Format
			let optionFormat = '';
			optionFormat += 'format='+ format +'&';
			if (optionFormat == 'format=&') {
				optionFormat = '';
			}

			$.ajax({
				url: `${api_url}/cardinfo.php?${optionType}${optionAttribute}${optionFormat}num=${num}&offset=0`,
				type: 'get',
				dataType: 'json',
				success: (result) => {
					$('#result-length').html(result.data.length);
					$('#ygo').html('');
					$.each(result.data, function (i, val) {
						if (i >= num - 1) {
							$('.more').parent().removeClass('d-none');
						} else {
							$('.more').parent().addClass('d-none');
						}
						let url = `${api_url}/cardinfo.php?name=${val.name}`;
						$.each(val.card_images, function (i, val) {
							$('#ygo').append(`
								<div class="col-lg-2 col-md-3 col-6">
									<span class="visually-hidden">${url}</span>
									<img src="${val.image_url}" class="img-fluid my-2 card-ygo">
								</div>
								`)

							if (i == 0) {
								return false
							}
						})
					})

					moreClick('loadAllCard', num, '', type, attribute, format);
					loadClick();
				},
				error: (result) => {
					$('#result-length').parent().addClass('d-none');
					$('#ygo').html('');
					$('#ygo').append(`
								<div class="col-12 text-center">
									<p class="fw-bold text-muted my-5 text-uppercase">Cards is not found</p>
								</div>
								`);
				}
			})
		}

		// Search by Name card
		function loadName(num = 60, keyword, type = '', attribute = '', format = '') {
			$('#result-length').parent().removeClass('d-none');

			// Filter Type
			let optionType = '';
			optionType += 'type='+ type +'&';
			if (optionType == 'type=&') {
				optionType = '';
			}

			// Filter Attribute
			let optionAttribute = '';
			optionAttribute += 'attribute='+ attribute +'&';
			if (optionAttribute == 'attribute=&') {
				optionAttribute = '';
			}

			// Filter Format
			let optionFormat = '';
			optionFormat += 'format='+ format +'&';
			if (optionFormat == 'format=&') {
				optionFormat = '';
			}

			$.ajax({
				url: `${api_url}/cardinfo.php?${optionType}${optionAttribute}${optionFormat}fname=${keyword}&num=${num}&offset=0`,
				type: 'get',
				asyn: true,
				dataType: 'json',
				success: (result) => {
					$('#result-length').html(result.data.length);
					$.each(result.data, function (i, val) {
						if (i >= num - 1) {
							$('.more').parent().removeClass('d-none');
						} else {
							$('.more').parent().addClass('d-none');
						}
						let url = `${api_url}/cardinfo.php?name=${val.name}`;
						
						$.each(val.card_images, function (i, val) {

							$('#ygo').append(`
								<div class="col-lg-2 col-md-3 col-6">
									<span class="visually-hidden">${url}</span>
									<img src="${val.image_url}" class="img-fluid my-2 card-ygo">
								</div>
								`);
							
							if (i == 0) {
								return false
							}
						})
					})

					moreClick('loadName', num, keyword, type, attribute, format);	
					loadClick();
				},
				error: (result) => {
					$('#result-length').parent().addClass('d-none');
					$('#ygo').html('');
					$('#ygo').append(`
								<div class="col-12 text-center">
									<p class="fw-bold text-muted my-5 text-uppercase">Name "<b>${keyword}</b>" is not found</p>
								</div>
								`);
				}
			})
		}

		// Search by Archetype card
		function loadArchetype(keyword) {
			$('#result-length').parent().removeClass('d-none');
			$('.more').parent().addClass('d-none');
			$.ajax({
				url: `${api_url}/cardinfo.php?archetype=${keyword}`,
				type: 'get',
				asyn: true,
				dataType: 'json',
				success: (result) => {
					$('#result-length').html(result.data.length);
					$.each(result.data, function (i, val) {
						let url = `${api_url}/cardinfo.php?name=${val.name}`;
						$.each(val.card_images, function (i, val) {
							$('#ygo').append(`
								<div class="col-lg-2 col-md-3 col-6">
									<span class="visually-hidden">${url}</span>
									<img src="${val.image_url}" class="img-fluid my-2 card-ygo">
								</div>
								`)

							if (i == 0) {
								return false
							}
						})
					})

					loadClick();
				},
				error: (result) => {
					$('#result-length').parent().addClass('d-none');
					$('#ygo').html('');
					$('#ygo').append(`
								<div class="col-12 text-center">
									<p class="fw-bold text-muted my-5 text-uppercase">Archetype "<b>${keyword}</b>" is not found</p>
								</div>
								`);
				}
			})
		}

		// Search by Get Name card
		function loadGetName(url) {
			$('#result-length').parent().addClass('d-none');
			$('.more').parent().addClass('d-none');
			$.ajax({
				url: url,
				type: 'get',
				asyn: true,
				dataType: 'json',
				success: (result) => {
					$.each(result.data, function (i, val) {
						let name = val.name;
						let type = val.type;
						let attribute = val.attribute;
						if (type == 'Spell Card') {
							attribute = '<img src="img/attribute/spell.png" class="ms-2 attribute">'
						}
						if (type == 'Trap Card') {
							attribute = '<img src="img/attribute/trap.png" class="ms-2 attribute">'
						}
						if (attribute == 'DARK') {
							attribute = '<img src="img/attribute/dark.png" class="ms-2 attribute">'
						}
						if (attribute == 'LIGHT') {
							attribute = '<img src="img/attribute/light.png" class="ms-2 attribute">'
						}
						if (attribute == 'WIND') {
							attribute = '<img src="img/attribute/wind.png" class="ms-2 attribute">'
						}
						if (attribute == 'EARTH') {
							attribute = '<img src="img/attribute/earth.png" class="ms-2 attribute">'
						}
						if (attribute == 'FIRE') {
							attribute = '<img src="img/attribute/fire.png" class="ms-2 attribute">'
						}
						if (attribute == 'WATER') {
							attribute = '<img src="img/attribute/water.png" class="ms-2 attribute">'
						}
						if (attribute == 'DIVINE') {
							attribute = '<img src="img/attribute/divine.png" class="ms-2 attribute">'
						}
						if(attribute === undefined) {
							attribute = '';
						}
						let race = val.race;
						let level = val.level;
						let linkval = val.linkval;
						let markLevel = '';
						if (type == 'XYZ Monster' || type == 'XYZ Pendulum Effect Monster') {
							for (let a = 0; a < level; a++) {
						       markLevel += '<img src="img/level/level-xyz.png" class="me-1 mark-level">';
						    }
						} else {
							for (let a = 0; a < level; a++) {
						       markLevel += '<img src="img/level/level.png" class="me-1 mark-level">';
						    }
						}
						let symbol = '';
						if (race == 'Normal') {
							symbol = '';
						}
						if (race == 'Equip') {
							symbol = '<img src="img/symbol/equip.png" style="width: 23px; height: 23px;">';
						}
						if (race == 'Quick-Play') {
							symbol = '<img src="img/symbol/quick-play.png" style="width: 23px; height: 23px;">';
						}
						if (race == 'Continuous') {
							symbol = '<img src="img/symbol/continuous.png" style="width: 23px; height: 23px;">';
						}
						if (race == 'Field') {
							symbol = '<img src="img/symbol/field.png" style="width: 23px; height: 23px;">';
						}
						if (race == 'Counter') {
							symbol = '<img src="img/symbol/counter.png" style="width: 23px; height: 23px;">';
						}
						if (type == 'Skill Card') {
							type = race;
							symbol = '<img src="img/symbol/skill.png" style="width: 23px; height: 30px;">';
						}
						// if (type != 'Spell Card' || type != 'Trap Card') {
						// 	let forbiddenChars = [' ']
						// 	for (let char of forbiddenChars){
						// 		console.log(type);
						// 	    type = type.split(char).join(' / ');
						// 	}
						// }
						let scale = val.scale;
						let desc = val.desc.replace('----------------------------------------', '').replaceAll('[ Monster Effect ]', '<br><br/>[ Monster Effect ]');
						let atk = val.atk;
						let def = val.def;
						let archetype = val.archetype;
						
						let variant_img = ``;
						$.each(val.card_images, function (i, card) {
							if (i == 0) {
								return;
							}

							variant_img += `<img src="${card.image_url}" class="mx-1 card-ygo-small" >`;
						})

						let container_variant_img = `
							<div class="d-flex flex-nowrap overflow-auto my-2">
								${variant_img}
							</div>
						`;

						$.each(val.card_images, function (i, card) {
							if (level) {
								if(type.includes('Pendulum')) {

									let splitDesc = desc.split('<br><br/>');
									splitDesc[0] = splitDesc[0].replaceAll('[ Pendulum Effect ]', '');

									// desc for pendulum normal moster
									if(splitDesc[1] === undefined) {
										splitDesc[1] = val.desc.replace('----------------------------------------', '').replaceAll('[ Flavor Text ]', '<br><br/>[ Flavor Text ]').split('<br><br/>')[1].replaceAll('[ Flavor Text ]', '');
									} else {
										splitDesc[1] = splitDesc[1].replaceAll('[ Monster Effect ]', '');
										splitDesc[1] = splitDesc[1] === undefined ? '' : splitDesc[1];
									}


									$('#ygo').append(`
									<div class="col-lg-3 col-md-4 col-12 mb-4 lightbox-container">
										<span class="visually-hidden">${url}</span>
										<img src="${card.image_url}" class="img-fluid d-block mx-auto">
										${container_variant_img}
									</div>
									<div class="col-lg-9 col-md-8 col-12 px-md-4 px-3 mb-4">
										<h2 class="display-6 fw-bold text-prompt text-hidden text-primary d-flex justify-content-between align-items-center">${name} ${attribute}</h2>
										<hr class="border border-primary border-2 my-0">
										<div class="row">
											<div class="col-12"><h2 class="text-hidden">${markLevel}</h2></div>
											<div class="col-lg-8 col-12">
												<h2 class="fw-bold fs-5 text-muted text-hidden text-prompt" type>[ ${race} / ${type} ]</h2>
											</div>
											<div class="col-lg-4 col-12">
												<span class="d-inline-block fw-bold fs-6 text-muted text-hidden float-lg-end">ATK/${atk}  DEF/${def}</span>
											</div>
										</div>
										<div class="border border-2 border-primary p-2 col-pendulum">
											<div class="d-flex justify-content-between align-items-center">
												<div class="d-flex flex-column text-center px-1">
													<img src="img/symbol/pendulum_scale_blue.png" style="width: 28px; height: 18px;">
													<span>${scale}</span>
												</div>
												<div class="border border-2 border-primary p-2 overflow-auto desc-pendulum">${splitDesc[0]}</div>
												<div class="d-flex flex-column text-center px-1">
													<img src="img/symbol/pendulum_scale_red.png" style="width: 28px; height: 18px;">
													<span>${scale}</span>
												</div>
											</div>
										</div>
										<div class="border border-2 border-primary p-2 desc">${splitDesc[1]}</div>
									</div>
									`);
								} else {
									$('#ygo').append(`
									<div class="col-lg-3 col-md-4 col-12 mb-4 lightbox-container">
										<span class="visually-hidden">${url}</span>
										<img src="${card.image_url}" class="img-fluid d-block mx-auto">
										${container_variant_img}
									</div>
									<div class="col-lg-9 col-md-8 col-12 px-md-4 px-3 mb-4">
										<h2 class="display-6 fw-bold text-prompt text-hidden text-primary d-flex justify-content-between align-items-center">${name} ${attribute}</h2>
										<hr class="border border-primary border-2 my-0">
										<div class="row">
											<div class="col-12"><h2 class="text-hidden">${markLevel}</h2></div>
											<div class="col-lg-8 col-12">
												<h2 class="fw-bold fs-5 text-muted text-hidden text-prompt" type>[ ${race} / ${type} ]</h2>
											</div>
											<div class="col-lg-4 col-12">
												<span class="d-inline-block fw-bold fs-6 text-muted text-hidden float-lg-end">ATK/${atk}  DEF/${def}</span>
											</div>
										</div>
										<div class="border border-2 border-primary p-2 desc">${desc}</div>
									</div>
									`);
								}
							} else {
								if(linkval) {

									$('#ygo').append(`
										<div class="col-lg-3 col-md-4 col-12 mb-4 lightbox-container">
											<span class="visually-hidden">${url}</span>
											<img src="${card.image_url}" class="img-fluid d-block mx-auto">
											${container_variant_img}
										</div>
										<div class="col-lg-9 col-md-8 col-12 px-md-4 px-3 mb-4">
											<h2 class="display-6 fw-bold text-prompt text-hidden text-primary d-flex justify-content-between align-items-center">${name} ${attribute}</h2>
											<hr class="border border-primary border-2 my-0">
											<div class="row mt-3">
												<div class="col-lg-8 col-12">
													<h2 class="fw-bold fs-5 text-muted text-hidden text-prompt" type>[ ${race} / ${type} ]</h2>
												</div>
												<div class="col-lg-4 col-12">
													<span class="d-inline-block fw-bold fs-6 text-muted text-hidden float-lg-end">ATK/${atk}  <span class="text-uppercase font-jetbrains-mono fw-bolder text-primary text-mono">LINK - ${linkval}</span></span>
												</div>
											</div>
											<div class="border border-2 border-primary p-2 desc">${desc}</div>
										</div>
										`);
								} else {
									$('#ygo').append(`
										<div class="col-lg-3 col-md-4 col-12 mb-4 lightbox-container">
											<span class="visually-hidden">${url}</span>
											<img src="${card.image_url}" class="img-fluid d-block mx-auto">
											${container_variant_img}
										</div>
										<div class="col-lg-9 col-md-8 col-12 px-md-4 px-3 mb-4 position-relative">
											<h2 class="display-6 fw-bold text-prompt text-hidden text-primary d-flex justify-content-between align-items-center">${name} ${attribute}</h2>
											<hr class="border border-primary border-2">
											<div class="fw-bold fs-5 text-muted text-hidden text-prompt">[ ${type} ${symbol} ]</div>
											<div class="border border-2 border-primary p-2 desc">${desc}</div>
										</div>
										`);
								}
							}

							if (i == 0) {
								return false
							}
						})

					})
					
					loadLightbox();
				},
				error: (result) => {
					$('#result-length').parent().addClass('d-none');
					$('#ygo').html('');
					$('#ygo').append(`
								<div class="col-12 text-center">
									<p class="my-5 text-muted fw-bold text-uppercase">Card is not found</p>
								</div>
								`);
				}
			})
		}

		// Search For
		$('.data-search').click(function () {
			let search = $(this).data('search');
			let placeholder = $(this).data('placeholder');

			$('input[name="keyword"]').data('keyword', search)
			.attr('placeholder', placeholder)
			.val('');

			if (search == 'archetype') {
				$('#filter').addClass('d-none');
			} else {
				$('#filter').removeClass('d-none');
			}
		})

		// Form Keyword Submit
		$('#search').submit(function (e) {
			e.preventDefault();

			$('#ygo').html('');
			let keyword = $(this).find('input[name="keyword"]').val();
			let search = $(this).find('input[name="keyword"]').data('keyword');

			let attribute = '';
			$('#form-filter input[name="attribute"]:checked').each(function () {
				attribute += $(this).val() +',';
			})
			let remakeAttribute = attribute.slice(0, attribute.length - 1);

			let type = '';
			$('#form-filter input[name="type"]:checked').each(function () {
				type += $(this).val() +',';
			})
			let remakeType = type.slice(0, type.length - 1);

			let format = '';
			$('#form-filter input[name="format"]:checked').each(function () {
				format += $(this).val() +',';
			})
			let remakeFormat = format.slice(0, format.length - 1);

			$('.container-btn-back').addClass('d-none');

			// If keyword null
			if (keyword === "") {
				loadAllCard(60, remakeType, remakeAttribute, remakeFormat);
				return false;
			}
			// Search for Name
			if (search == 'name') {
				loadName(60, keyword, remakeType, remakeAttribute, remakeFormat);
			}
			// Search fo Archtype
			if (search == 'archetype') {
				loadArchetype(keyword);
			}

		})
		
		// Form Filter Submit
		$('.filter-submit').on('click', function(e) {
			e.preventDefault();

			$('#search').trigger('submit');
		})

		var timerSearch;
		$('input[type="search"]').on('keyup', function(e){
			clearTimeout(timerSearch);
			timerSearch = setTimeout(() => {
				$('#ygo').html('');
				let keyword = $(this).val();
				let search = $(this).data('keyword');

				let attribute = '';
				$('#form-filter input[name="attribute"]:checked').each(function () {
					attribute += $(this).val() +',';
				})
				let remakeAttribute = attribute.slice(0, attribute.length - 1);

				let type = '';
				$('#form-filter input[name="type"]:checked').each(function () {
					type += $(this).val() +',';
				})
				let remakeType = type.slice(0, type.length - 1);

				let format = '';
				$('#form-filter input[name="format"]:checked').each(function () {
					format += $(this).val() +',';
				})
				let remakeFormat = format.slice(0, format.length - 1);

				$('.container-btn-back').addClass('d-none');
				// If keyword null
				if (keyword === "") {
					loadAllCard(60, remakeType, remakeAttribute, remakeFormat);
					return false;
				}
				// Search for Name
				if (search == 'name') {
					loadName(60, keyword, remakeType, remakeAttribute, remakeFormat);
				}
				// Search fo Archtype
				if (search == 'archetype') {
					loadArchetype(keyword);
				}

			}, 700);
		})

		$('.btn-back').on('click', function(e){
			e.preventDefault();

			$('#search').trigger('submit');
		})

		// Change Logo YGO
		// $('#form-filter input[name="format"]').on('change', function(e){

		// 	let logo_url = $(this).parent().find('img').attr('src');

		// 	$('.logo-ygo').attr('src', logo_url);
		// })

		loadAllCard();


