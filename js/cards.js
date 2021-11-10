
		// AjaxStart
		$(document).ajaxStart(function() {
			$('#loading-cards').removeClass('d-none');
		});
		// AjaxStop
		$(document).ajaxStop(function() {
			$('#loading-cards').addClass('d-none');
		});

		function loadClick() {
			// Get name card
			$('#ygo .card-ygo').click(function () {
				// let url = $(this).data('url');
				let url = $(this).parent().find('span').text();
				$('#ygo').html('');
				loadGetName(url);
			})
		}

		function removeForbiddenCharacters(string) {
			let forbiddenChars = [' ']

			for (let char of forbiddenChars){
			    string = string.split(char).join('/');
			}
			return string
		}

		// Get All Cards
		function loadAllCard(num = 60, type = '') {
			$('#result-length').parent().removeClass('d-none');

			// Filter Type
			let optionType = '';
			optionType += 'type='+ type +'&';
			if (optionType == 'type=&') {
				optionType = '';
			}

			// Button See more
			$('.more').click(function (e) {
				e.preventDefault();
				num = num + 60;
				loadAllCard(num, type);
			});

			$.ajax({
				url: `https://db.ygoprodeck.com/api/v7/cardinfo.php?${optionType}num=${num}&offset=0`,
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
						let url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${val.name}`;
						$.each(val.card_images, function (i, val) {
							$('#ygo').append(`
								<div class="col-lg-2 col-md-3 col-6">
									<span class="visually-hidden">${url}</span>
									<img src="${val.image_url}" class="img-fluid my-2 card-ygo">
								</div>
								`)
						})
					})

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
		function loadName(num = 60, keyword, type = '') {
			$('#result-length').parent().removeClass('d-none');

			// Filter Type
			let optionType = '';
			optionType += 'type='+ type +'&';
			if (optionType == 'type=&') {
				optionType = '';
			}

			$.ajax({
				url: `https://db.ygoprodeck.com/api/v7/cardinfo.php?${optionType}fname=${keyword}&num=${num}&offset=0`,
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
						let url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${val.name}`;
						$.each(val.card_images, function (i, val) {
							$('#ygo').append(`
								<div class="col-lg-2 col-md-3 col-6">
									<span class="visually-hidden">${url}</span>
									<img src="${val.image_url}" class="img-fluid my-2 card-ygo">
								</div>
								`)
						})
					})

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
				url: `https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=${keyword}`,
				type: 'get',
				asyn: true,
				dataType: 'json',
				success: (result) => {
					$('#result-length').html(result.data.length);
					$.each(result.data, function (i, val) {
						let url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${val.name}`;
						$.each(val.card_images, function (i, val) {
							$('#ygo').append(`
								<div class="col-lg-2 col-md-3 col-6">
									<span class="visually-hidden">${url}</span>
									<img src="${val.image_url}" class="img-fluid my-2 card-ygo">
								</div>
								`)
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
						let race = val.race;
						let level = val.level;
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
						if (type == 'Spell Card' || type == 'Trap Card') {
						
						} else {
							let forbiddenChars = [' ']
							for (let char of forbiddenChars){
							    type = type.split(char).join(' / ');
							}
						}
						let desc = val.desc;
						let atk = val.atk;
						let def = val.def;
						let archetype = val.archetype;
						$.each(val.card_images, function (i, val) {
							if (level) {
								$('#ygo').append(`
								<div class="col-lg-3 col-md-4 col-12 mb-4">
									<span class="visually-hidden">${url}</span>
									<img src="${val.image_url}" class="img-fluid d-block mx-auto card-ygo">
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
									<p class="border border-2 border-primary p-2 desc">${desc}
									</p>
								</div>
								`);
							} else {
								$('#ygo').append(`
									<div class="col-lg-3 col-md-4 col-12 mb-4">
										<span class="visually-hidden">${url}</span>
										<img src="${val.image_url}" class="img-fluid d-block mx-auto card-ygo">
									</div>
									<div class="col-lg-9 col-md-8 col-12 px-md-4 px-3 mb-4 position-relative">
										<h2 class="display-6 fw-bold text-prompt text-hidden text-primary d-flex justify-content-between align-items-center">${name} ${attribute}</h2>
										<hr class="border border-primary border-2">
										<p class="fw-bold fs-5 text-muted text-hidden text-prompt">[ ${type} ${symbol} ]</p>
										<p class="border border-2 border-primary p-2 desc">${desc}
										</p>
									</div>
									`);
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
		})

		// Form Keyword Submit
		$('#search').submit(function (e) {
			e.preventDefault();

			$('#ygo').html('');
			let keyword = $(this).find('input[name="keyword"]').val();
			let search = $(this).find('input[name="keyword"]').data('keyword');
			let type = '';
			$('#form-filter input[name="type"]:checked').each(function () {
				type += $(this).val() +',';
			})
			let remakeType = type.slice(0, type.length - 1);

			// If keyword null
			if (keyword === "") {
				loadAllCard(60, remakeType);
				return false;
			}
			// Search for Name
			if (search == 'name') {
				loadName(60, keyword, remakeType);
			}
			// Search fo Archtype
			if (search == 'archetype') {
				loadArchetype(keyword);
			}
		})

		// $('#form-filter').submit(function (e) {
		// 	e.preventDefault();
		// 	let type = '';
		// 	$('#form-filter input[name="type"]:checked').each(function () {
		// 		type += $(this).val()+',';
		// 	})
		// 	let remakeType = type.slice(0, type.length - 1);

		// 	loadAllCard(60, remakeType);
		// })

		loadAllCard();

