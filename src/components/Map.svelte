<script lang="ts">
	import { onMount } from 'svelte';
	import worlddata from '$lib/countries-50m.json';
	import * as d3 from 'd3';
	import * as t from 'topojson-client';
	import gui from 'lil-gui';
	import rough from 'roughjs';

	let width = 900;
	let height = 600;

	const projection = d3.geoMercator().translate([width / 2, height / 1.4]);
	const countries = t.feature(worlddata as any, (worlddata as any).objects.countries) as any;

	export let selectedCountry: string;

	let zoomLevel = 1;
	let g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
	let backgroundG: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
	let labelsG: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
	let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
	let paths: d3.Selection<SVGPathElement, unknown, HTMLElement, any>;
	let roughSVG: rough.RoughSVG<SVGSVGElement>;
	let debugGUI: gui;
	const debugSettings = {
		bowing: 3,
		curveStepCount: 9,
		curveFitting: 0.2,
		fill: '#FBDDA4',
		fillStyle: 'cross-hatch',
		fillWeight: 0.5,
		hachureAngle: 77,
		hachureGap: 3,
		roughness: 0.4,
		simplification: 0,
		outlineStroke: '#A49478',
		outlineStrokeWidth: 0.66,
		highlightStroke: '#F29F7B',
		highlightFill: '#F29F7B'
	};
	const backgroundSettings = {
		bowing: 2.75,
		curveStepCount: 5,
		curveFitting: 0.73,
		fill: '#E8F4F8',
		fillStyle: 'cross-hatch',
		fillWeight: 0.5,
		hachureAngle: -118,
		hachureGap: 5,
		roughness: 2.2,
		simplification: 0
	};

	// Panning and zooming functionality
	const zoom = d3
		.zoom()
		.on('zoom', function (event: any) {
			g.attr('transform', event.transform);
			labelsG.attr('transform', event.transform);
			zoomLevel = event.transform.k;
		})
		.on('start', function (this: SVGSVGElement) {
			d3.select(this).classed('dragging', true);
		})
		.on('end', function (this: SVGSVGElement) {
			d3.select(this).classed('dragging', false);
			updateLabels();
		});

	// Reset all country styles to default
	function resetCountryStyles(resetSelected: boolean = true) {
		if (resetSelected) {
			// Deselect any previously selected country
			d3.selectAll('.country').classed('selected', false);
			d3.selectAll('.country-highlight').remove();
		}
	}

	// Handle country click events
	function mouseClick(event: any, d: any) {
		resetCountryStyles();

		// Mark the selected country
		const element = d3.select(event.currentTarget);
		element.classed('selected', true);

		// Add highlight overlay
		const pathData = element.attr('d');
		const highlightPath = g
			.append('path')
			.attr('d', pathData)
			.attr('class', 'country-highlight')
			.style('fill', debugSettings.highlightFill)
			.style('stroke', debugSettings.highlightStroke)
			.style('fill-opacity', 0.6)
			.style('pointer-events', 'none');

		zoomToCountry(event, d, () => {
			highlightPath.style('stroke-width', 2 / zoomLevel);
		});

		// Get the country name
		const countryName = d.properties?.name;

		// Pass the selected country name to the parent component
		selectedCountry = countryName;
	}

	// Zoom into the selected country based on the country bounding box
	function zoomToCountry(event: any, d: any, callback?: () => void) {
		const pathGenerator = d3.geoPath().projection(projection);
		const [[x0, y0], [x1, y1]] = pathGenerator.bounds(d);
		if (event) {
			event.stopPropagation();
		}
		const sidebarWidth = 250;
		const availableWidth = width - sidebarWidth;
		const centerX = sidebarWidth + availableWidth / 2;

		// Add adaptive padding - more padding for smaller countries
		const countryWidth = x1 - x0;
		const countryHeight = y1 - y0;
		const countrySize = Math.max(countryWidth, countryHeight);
		const paddingFactor = Math.max(0.5, 0.9 - (1 / countrySize) * 50);

		svg
			.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity
					.translate(centerX, height / 2)
					.scale(paddingFactor / Math.max(countryWidth / availableWidth, countryHeight / height))
					.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
				event ? d3.pointer(event, svg.node()) : [centerX, height / 2]
			)
			.on('end', () => {
				if (callback) callback();
			});
	}

	// Reset the map zoom when we click on the map background
	function resetZoom() {
		selectedCountry = '';
		resetCountryStyles();

		svg
			.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity,
				d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
			);
	}

	// Highlight country on mouseover
	function mouseOver(event: any, d: any) {
		const element = d3.select(event.currentTarget);
		// Don't hover over selected
		if (element.classed('selected')) {
			return;
		}

		const pathData = element.attr('d');
		g.append('path')
			.attr('d', pathData)
			.attr('class', 'country-hover')
			.style('fill', '#F29F7B')
			.style('stroke', debugSettings.highlightStroke)
			.style('stroke-width', 1.5 / zoomLevel)
			.style('fill-opacity', 0.4)
			.style('pointer-events', 'none');
	}

	// Reset country styles on mouseout
	function mouseOut(event: any, d: any) {
		d3.selectAll('.country-hover').remove();
	}

	// Update country labels based on zoom level
	function updateLabels() {
		labelsG.selectAll('.country-label').remove();
		labelsG.selectAll('.country-label-bg').remove();

		if (zoomLevel > 5) {
			paths.each(function (this: SVGPathElement, d: any) {
				const countryName = d.properties?.name;
				if (countryName) {
					const centroid = d3.geoPath().projection(projection).centroid(d);

					if (centroid && centroid[0] && centroid[1]) {
						// Create text element first to measure it
						const text = labelsG
							.append('text')
							.attr('class', 'country-label')
							.attr('x', centroid[0])
							.attr('y', centroid[1])
							.attr('text-anchor', 'middle')
							.attr('dominant-baseline', 'middle')
							.style('font-size', `${18 / zoomLevel}px`)
							.style('font-family', 'Stylish, sans-serif')
							.style('fill', '#000')
							.style('stroke-width', `${3 / zoomLevel}px`)
							.style('paint-order', 'stroke')
							.style('pointer-events', 'none')
							.style('cursor', 'pointer')
							.text(countryName)
							.on('click', mouseClick)
							.on('mouseenter', mouseOver)
							.on('mouseleave', mouseOut);

						// Get bounding box and insert rect behind text
						const bbox = (text.node() as SVGTextElement).getBBox();
						const padding = 2 / zoomLevel;

						labelsG
							.insert('rect', '.country-label')
							.attr('class', 'country-label-bg')
							.attr('x', bbox.x - padding)
							.attr('y', bbox.y - padding)
							.attr('width', bbox.width + padding * 2)
							.attr('height', bbox.height + padding * 2)
							.style('fill', '#B7D3C9')
							.style('pointer-events', 'none');
					}
				}
			});
		}
	}

	function roughDrawCountry() {
		// Clear the existing rough paths
		d3.selectAll('.rough-country').remove();
		d3.selectAll('.country-bg').remove();
		d3.selectAll('.country-outline').remove();

		// Draw rough versions for each country
		paths.each(function (this: SVGPathElement, d: any) {
			const pathData = d3.select(this).attr('d');

			if (pathData) {
				// Draw white background first
				const whiteBg = g
					.append('path')
					.attr('d', pathData)
					.attr('class', 'country-bg')
					.style('fill', 'white')
					.style('stroke', 'none')
					.style('pointer-events', 'none');

				// Draw rough country on top
				const roughPath = roughSVG.path(pathData, {
					bowing: debugSettings.bowing,
					curveStepCount: debugSettings.curveStepCount,
					curveFitting: debugSettings.curveFitting,
					fill: debugSettings.fill,
					fillStyle: debugSettings.fillStyle,
					fillWeight: debugSettings.fillWeight,
					stroke: 'none',
					hachureAngle: debugSettings.hachureAngle,
					hachureGap: debugSettings.hachureGap,
					roughness: debugSettings.roughness,
					simplification: debugSettings.simplification
				});
				roughPath.setAttribute('class', 'rough-country');
				roughPath.style.pointerEvents = 'none';
				g.node()?.appendChild(roughPath);

				// Add regular d3 stroke outline without using roughjs
				g.append('path')
					.attr('d', pathData)
					.attr('class', 'country-outline')
					.style('fill', 'none')
					.style('stroke', debugSettings.outlineStroke)
					.style('stroke-width', debugSettings.outlineStrokeWidth)
					.style('pointer-events', 'none');
			}
		});
	}

	function roughDrawBackground() {
		// Clear existing background
		d3.selectAll('.rough-background').remove();

		// Draw rectangle covering entire SVG
		const bbox = svg.node()?.getBoundingClientRect();
		if (bbox) {
			const rectPath = `M 0 0 L ${bbox.width} 0 L ${bbox.width} ${bbox.height} L 0 ${bbox.height} Z`;

			const roughBg = roughSVG.path(rectPath, {
				bowing: backgroundSettings.bowing,
				curveStepCount: backgroundSettings.curveStepCount,
				curveFitting: backgroundSettings.curveFitting,
				fill: backgroundSettings.fill,
				fillStyle: backgroundSettings.fillStyle,
				fillWeight: backgroundSettings.fillWeight,
				stroke: 'none',
				hachureAngle: backgroundSettings.hachureAngle,
				hachureGap: backgroundSettings.hachureGap,
				roughness: backgroundSettings.roughness,
				simplification: backgroundSettings.simplification
			});
			roughBg.setAttribute('class', 'rough-background');
			roughBg.style.pointerEvents = 'none';
			backgroundG.node()?.appendChild(roughBg);
		}
	}

	// Create debug GUI that floats on the top right of the map
	function createDebugGUI() {
		debugGUI = new gui();

		// Map/Countries folder
		const mapFolder = debugGUI.addFolder('Map Countries');
		mapFolder.add(debugSettings, 'bowing', 0, 10).onChange(() => roughDrawCountry());
		mapFolder
			.add(debugSettings, 'curveStepCount', 1, 20)
			.step(1)
			.onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'curveFitting', 0.1, 1).onChange(() => roughDrawCountry());
		mapFolder.addColor(debugSettings, 'fill').onChange(() => roughDrawCountry());
		mapFolder
			.add(debugSettings, 'fillStyle', [
				'hachure',
				'solid',
				'zigzag',
				'cross-hatch',
				'dots',
				'sunburst'
			])
			.onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'fillWeight', 0, 5).onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'hachureAngle', -360, 360).onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'hachureGap', 0, 20).onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'roughness', 0, 5).onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'simplification', 0, 1).onChange(() => roughDrawCountry());
		mapFolder.addColor(debugSettings, 'outlineStroke').onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'outlineStrokeWidth', 0, 5).onChange(() => roughDrawCountry());
		mapFolder.addColor(debugSettings, 'highlightStroke');
		mapFolder.addColor(debugSettings, 'highlightFill');
		mapFolder.open();

		// Background folder
		const bgFolder = debugGUI.addFolder('Map Background');
		bgFolder.add(backgroundSettings, 'bowing', 0, 10).onChange(() => roughDrawBackground());
		bgFolder
			.add(backgroundSettings, 'curveStepCount', 1, 20)
			.step(1)
			.onChange(() => roughDrawBackground());
		bgFolder.add(backgroundSettings, 'curveFitting', 0.1, 1).onChange(() => roughDrawBackground());
		bgFolder.addColor(backgroundSettings, 'fill').onChange(() => roughDrawBackground());
		bgFolder
			.add(backgroundSettings, 'fillStyle', [
				'hachure',
				'solid',
				'zigzag',
				'cross-hatch',
				'dots',
				'sunburst'
			])
			.onChange(() => roughDrawBackground());
		bgFolder.add(backgroundSettings, 'fillWeight', 0, 5).onChange(() => roughDrawBackground());
		bgFolder
			.add(backgroundSettings, 'hachureAngle', -360, 360)
			.onChange(() => roughDrawBackground());
		bgFolder.add(backgroundSettings, 'hachureGap', 0, 20).onChange(() => roughDrawBackground());
		bgFolder.add(backgroundSettings, 'roughness', 0, 5).onChange(() => roughDrawBackground());
		bgFolder.add(backgroundSettings, 'simplification', 0, 1).onChange(() => roughDrawBackground());
		bgFolder.open();

		return debugGUI;
	}

	onMount(() => {
		width = window.innerWidth;
		height = window.innerHeight;
		const chart = d3.select('#map').append('svg').attr('width', '100%').attr('height', '100%');

		// Create background group (bottom layer)
		backgroundG = chart.append('g').attr('class', 'background-layer');

		// Create countries group
		g = chart.append('g');

		// Create labels group (top layer)
		labelsG = chart.append('g').attr('class', 'labels-layer');

		svg = d3.select('svg').on('click', resetZoom);
		roughSVG = rough.svg(svg.node());
		const pathGenerator = d3.geoPath().projection(projection);
		debugGUI = createDebugGUI();
		debugGUI.hide();

		// Listen for 'd' key press to toggle debug GUI
		window.addEventListener('keydown', (e) => {
			if (e.key === 'd' || e.key === 'D') {
				if (debugGUI._hidden) {
					debugGUI.show();
				} else {
					debugGUI.hide();
				}
			}
		});

		// Draw background first
		roughDrawBackground();

		// Create invisible paths for interaction
		paths = g
			.selectAll('path')
			.data(countries.features)
			.enter()
			.append('path')
			.style('cursor', 'pointer')
			.style('opacity', 0)
			.style('pointer-events', 'all')
			.attr('d', pathGenerator as any)
			.attr('class', 'country')
			.on('click', mouseClick)
			.on('mouseover', mouseOver)
			.on('mouseout', mouseOut);

		// Draw rough countries
		roughDrawCountry();

		const initialTransform = d3.zoomIdentity.scale(1.5);
		svg.call(zoom).call(zoom.transform, initialTransform);
	});
</script>

<div id="map"></div>

<style>
	:global(.country) {
		stroke-width: 0.5;
		stroke: #a49478;
		stroke-opacity: 1;
	}

	:global(.dragging) {
		cursor: all-scroll;
	}

	#map {
		width: 100%;
		height: 100%;
	}
</style>
