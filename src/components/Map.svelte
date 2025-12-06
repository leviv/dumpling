<script lang="ts">
	import { onMount } from 'svelte';
	import worlddata from '$lib/assets/countries-50m.json';
	import * as d3 from 'd3';
	import * as t from 'topojson-client';

	const width = 900;
	const height = 600;

	const projection = d3.geoMercator().translate([width / 2, height / 1.4]);
	const countries = t.feature(worlddata as any, (worlddata as any).objects.countries) as any;

	export let selectedCountry: string;

	let zoomLevel = 1;
	let g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

	// Panning and zooming functionality
	const zoom = d3
		.zoom()
		.on('zoom', function (event) {
			g.attr('transform', event.transform);
			zoomLevel = event.transform.k;
		})
		.on('start', function () {
			d3.select(this).classed('dragging', true);
		})
		.on('end', function () {
			d3.select(this).classed('dragging', false);
		});

	function mouseClick(event: any, d: any) {
		// Animate all other countries to the default state
		d3.selectAll('.country').transition().duration(200).style('opacity', 0.8);
		d3.selectAll('.country').transition().duration(200).style('stroke', '#A49478');

		// Highlight the selected country
		d3.select(event.currentTarget)
			.transition()
			.duration(200)
			.style('opacity', 1)
			.style('stroke', '#A49478')
			.style('fill', '#DCD485');

		// Get the country name
		const countryName = d.properties?.name;

		// Pass the selected country name to the parent component
		selectedCountry = countryName;
	}

	onMount(() => {
		const chart = d3
			.select('#map')
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('fill', '#FBDDA4')
			.attr('stroke', '#A49478');

		g = chart.append('g');
		const svg = d3.select('svg') as any;

		g.selectAll('path')
			.data(countries.features)
			.enter()
			.append('path')
			.attr('d', d3.geoPath().projection(projection) as any)
			.style('stroke', '#A49478')
			.style('stroke-opacity', 0.7)
			.attr('class', 'country')
			.style('opacity', 0.8)
			.on('click', mouseClick);

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
