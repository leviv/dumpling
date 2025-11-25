<script lang="ts">
	import { onMount } from 'svelte';
	import worlddata from '$lib/assets/countries-50m.json';
	import * as d3 from 'd3';
	import * as t from 'topojson-client';

	const width = 900;
	const height = 600;

	const projection = d3.geoMercator().translate([width / 2, height / 1.4]);
	const countries = t.feature(worlddata as any, (worlddata as any).objects.countries);

	let mouseOver = function (this: any, d: any) {
		d3.selectAll('.country').transition().duration(200).style('opacity', 0.5);
		d3.select(this).transition().duration(200).style('opacity', 1).style('stroke', 'black');
		console.log(d);
	};

	let mouseLeave = function (this: any, d: any) {
		d3.selectAll('.country').transition().duration(200).style('opacity', 0.8);
		d3.select(this).transition().duration(200).style('stroke', 'transparent');
	};

	onMount(() => {
		let svg = d3
			.select('body')
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
			.attr('class', function (d: any) {
				console.log(d.properties.name);
				return 'country';
			})
			.style('opacity', 0.8)
			.on('mouseover', mouseOver)
			.on('mouseleave', mouseLeave);
	});
</script>

<svelte:head>
	<title>World Dumpling Index</title>
</svelte:head>

<style>
	.countries {
		stroke-width: 0.5;
	}
</style>
