<script lang="ts">
    import { onMount } from 'svelte';
    import worlddata from '$lib/assets/countries-50m.json';
    import * as d3 from 'd3';
    import * as t from 'topojson-client';

    const width = 900;
    const height = 600;

    const projection = d3.geoMercator().translate([width/2, height/1.4]);
    const path = d3.geoPath(projection);

    const countries = t.feature(worlddata as any, (worlddata as any).objects.countries);

    onMount(()=>{
        let svg = d3.select('body').append('svg').attr('width', width).attr('height', height);
        const g = svg.append('g');

        g.selectAll('path').data(countries.features).enter().append('path').attr('class', 'countries').attr('d', path as any);
    })
</script>