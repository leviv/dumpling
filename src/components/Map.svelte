<script lang="ts">
	import { onMount } from 'svelte';
	import worlddata from '$lib/assets/countries-50m.json';
	import * as d3 from 'd3';
	import * as t from 'topojson-client';

	const width = 900;
	const height = 600;

	const projection = d3.geoMercator().translate([width / 2, height / 1.4]);
	const countries = t.feature(worlddata as any, (worlddata as any).objects.countries);

	export let selectedCountry: string;

	let mouseClick = function (event: any, d: any) {
		// Animate all other countries to the default state
		d3.selectAll('.country').transition().duration(200).style('opacity', 0.8);
		d3.selectAll('.country').transition().duration(200).style('stroke', 'transparent');

		// Highlight the selected country
		d3.select(event.currentTarget)
			.transition()
			.duration(200)
			.style('opacity', 1)
			.style('stroke', 'black');

		// Get the country name
		const countryName = d.properties?.name;

		// Pass the selected country name to the parent component
		selectedCountry = countryName;
	};

	onMount(() => {
		let svg = d3
			.select('#map')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('fill', '#FBDDA4')
			.attr('stroke', '#A49478');

		const g = svg.append('g');

		g.selectAll('path')
			.data(countries.features)
			.enter()
			.append('path')
			.attr('d', d3.geoPath().projection(projection))
			.style('stroke', 'transparent')
			.attr('class', 'country')
			.style('opacity', 0.8)
			.on('click', mouseClick);
	});
</script>

<div id="map"></div>

<style>
	:global(.country) {
		stroke-width: 0.5;
	}
</style>
