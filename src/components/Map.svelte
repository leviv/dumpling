<script lang="ts">
	import { onMount } from 'svelte';
	import worlddata from '$lib/countries-50m.json';
	import * as d3 from 'd3';
	import * as t from 'topojson-client';
	import gui from 'lil-gui';
	import rough from 'roughjs';

	const width = 900;
	const height = 600;

	const projection = d3.geoMercator().translate([width / 2, height / 1.4]);
	const countries = t.feature(worlddata as any, (worlddata as any).objects.countries) as any;

	export let selectedCountry: string;

	let zoomLevel = 1;
	let g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
	let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
	let paths: d3.Selection<SVGPathElement, unknown, HTMLElement, any>;
	let roughSVG: rough.RoughSVG<SVGSVGElement>;
	let debugGUI: gui;
	const debugSettings = {
		bowing: 1,
		curveStepCount: 9,
		curveFitting: 0.95,
		fill: '#FBDDA4',
		fillStyle: 'hachure',
		fillWeight: 0.5,
		stroke: '#A49478',
		strokeWidth: 1,
		hachureAngle: -41,
		hachureGap: 8,
		roughness: 0.5,
		simplification: 0
	};

	// Panning and zooming functionality
	const zoom = d3
		.zoom()
		.on('zoom', function (event: any) {
			g.attr('transform', event.transform);
			zoomLevel = event.transform.k;
		})
		.on('start', function (this: SVGSVGElement) {
			d3.select(this).classed('dragging', true);
		})
		.on('end', function (this: SVGSVGElement) {
			d3.select(this).classed('dragging', false);
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
		g.append('path')
			.attr('d', pathData)
			.attr('class', 'country-highlight')
			.style('fill', '#DCD485')
			.style('stroke', 'red')
			.style('stroke-width', 2)
			.style('fill-opacity', 0.6)
			.style('pointer-events', 'none');

		zoomToCountry(event, d);

		// Get the country name
		const countryName = d.properties?.name;

		// Pass the selected country name to the parent component
		selectedCountry = countryName;
	}

	// Zoom into the selected country based on the country bounding box
	function zoomToCountry(event: any, d: any) {
		const pathGenerator = d3.geoPath().projection(projection);
		const [[x0, y0], [x1, y1]] = pathGenerator.bounds(d);
		event.stopPropagation();
		svg
			.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity
					.translate(width / 2, height / 2)
					.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
					.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
				d3.pointer(event, svg.node())
			);
	}

	// Reset the map zoom when we click on the map background
	function resetZoom() {
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
		if (element.classed('selected')) return; // Don't hover over selected

		const pathData = element.attr('d');
		g.append('path')
			.attr('d', pathData)
			.attr('class', 'country-hover')
			.style('fill', '#F29F7B')
			.style('stroke', 'red')
			.style('stroke-width', 1.5)
			.style('fill-opacity', 0.4)
			.style('pointer-events', 'none');
	}

	// Reset country styles on mouseout
	function mouseOut(event: any, d: any) {
		d3.selectAll('.country-hover').remove();
	}

	function roughDrawCountry() {
		// Clear the existing rough paths
		d3.selectAll('.rough-country').remove();

		// Draw rough versions for each country
		paths.each(function (this: SVGPathElement, d: any) {
			const pathData = d3.select(this).attr('d');

			if (pathData) {
				const roughPath = roughSVG.path(pathData, {
					bowing: debugSettings.bowing,
					curveStepCount: debugSettings.curveStepCount,
					curveFitting: debugSettings.curveFitting,
					fill: debugSettings.fill,
					fillStyle: debugSettings.fillStyle,
					fillWeight: debugSettings.fillWeight,
					stroke: debugSettings.stroke,
					strokeWidth: debugSettings.strokeWidth,
					hachureAngle: debugSettings.hachureAngle,
					hachureGap: debugSettings.hachureGap,
					roughness: debugSettings.roughness,
					simplification: debugSettings.simplification
				});
				roughPath.setAttribute('class', 'rough-country');
				roughPath.style.pointerEvents = 'none';
				g.node()?.appendChild(roughPath);
			}
		});
	}

	function createDebugGUI() {
		debugGUI = new gui();
		const mapFolder = debugGUI.addFolder('Map Settings');
		mapFolder.add(debugSettings, 'bowing', 0, 10);
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
		mapFolder.addColor(debugSettings, 'stroke').onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'strokeWidth', 0.1, 5).onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'hachureAngle', -360, 360).onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'hachureGap', 0, 20).onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'roughness', 0, 5).onChange(() => roughDrawCountry());
		mapFolder.add(debugSettings, 'simplification', 0, 1).onChange(() => roughDrawCountry());
		mapFolder.open();

		return debugGUI;
	}

	onMount(() => {
		const chart = d3.select('#map').append('svg').attr('width', '100%').attr('height', '100%');
		g = chart.append('g');
		svg = d3.select('svg').on('click', resetZoom);
		roughSVG = rough.svg(svg.node());
		const pathGenerator = d3.geoPath().projection(projection);

		debugGUI = createDebugGUI();

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

		const initialTransform = d3.zoomIdentity.translate(0, 90);
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
