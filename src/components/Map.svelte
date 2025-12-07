<script lang="ts">
	import { onMount } from 'svelte';
	import worlddata from '$lib/countries-50m.json';
	import * as d3 from 'd3';
	import * as t from 'topojson-client';
	import gui from 'lil-gui';

	const width = 900;
	const height = 600;

	const projection = d3.geoMercator().translate([width / 2, height / 1.4]);
	const countries = t.feature(worlddata as any, (worlddata as any).objects.countries) as any;

	export let selectedCountry: string;

	let zoomLevel = 1;
	let g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
	let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

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
		const selector = resetSelected ? '.country' : '.country:not(.selected)';

		if (resetSelected) {
			// Deselect any previously selected country
			d3.selectAll('.country').classed('selected', false);
		}

		// Animate countries to the default state
		d3.selectAll(selector)
			.transition()
			.duration(200)
			.style('fill', '#FBDDA4')
			.style('stroke', '#A49478');
	}

	// Handle country click events
	function mouseClick(event: any, d: any) {
		resetCountryStyles();

		// Highlight the selected country
		d3.select(event.currentTarget)
			.classed('selected', true)
			.transition()
			.duration(200)
			.style('stroke', 'red')
			.style('fill', '#DCD485');

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
		d3.select(event.currentTarget)
			.transition()
			.duration(200)
			.style('stroke', 'red')
			.style('fill', '#DCD485');
	}

	// Reset country styles on mouseout
	function mouseOut(event: any, d: any) {
		resetCountryStyles(false);
	}

	onMount(() => {
		const chart = d3.select('#map').append('svg').attr('width', '100%').attr('height', '100%');

		g = chart.append('g');
		svg = d3.select('svg').on('click', resetZoom);

		g.selectAll('path')
			.data(countries.features)
			.enter()
			.append('path')
			.style('cursor', 'pointer')
			.attr('d', d3.geoPath().projection(projection) as any)
			.attr('class', 'country')
			.on('click', mouseClick)
			.on('mouseover', mouseOver)
			.on('mouseout', mouseOut);

		resetCountryStyles();

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
