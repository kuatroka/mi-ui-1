<script lang="ts">
    import {scaleOrdinal, scaleTime } from 'd3-scale';
    import { flatGroup } from 'd3-array';
    import { stack } from 'd3-shape';
    import { format as formatDate } from 'date-fns';
    import { PeriodType, format } from 'svelte-ux';
    import {Chart,  Svg, Axis, Area, Tooltip, TooltipItem, Highlight, Point, Text,
    LinearGradient, RectClipPath, AreaStack } from 'layerchart'
    import { createDateSeries } from '../../../node_modules/layerchart/dist/utils/genData';
    import { pivotLonger } from '../../../node_modules/layerchart/dist/utils/pivot';
    import { flatten } from '../../../node_modules/svelte-ux/dist/utils/array';
    import { appleStock } from './dateSeries';
    const data = createDateSeries({ count: 30, min: 50, max: 100, value: 'integer' });
    const keys = ['apples', 'bananas', 'oranges'];
    const multiSeriesData = createDateSeries({
        count: 30,
        min: 10,
        max: 100,
        value: 'integer',
        keys,
    });
    const multiSeriesFlatData = pivotLonger(multiSeriesData, keys, 'fruit', 'value');

    const dataByFruit = flatGroup(multiSeriesFlatData, (d: { fruit: string }) => d.fruit);
    // const fruitColors = {
    // apples: 'var(--color-blue-500)',
    // bananas: 'var(--color-purple-500)',
    // oranges: 'var(--color-green-500)', };


    const fruitColors = {
        apples: 'gold',
        bananas: 'indigo',
        oranges: 'green',
    };


</script>

<h1>Examples</h1>

<h2>Area</h2>

<div class="h-[300px] p-4 border rounded">
<Chart
    {data}
    x="date"
    xScale={scaleTime()}
    y="value"
    yDomain={[0, null]}
    yNice
    padding={{ left: 16, bottom: 24 }}
    tooltip
>
    <Svg>
    <Axis placement="left" grid rule />
    <Axis
        placement="bottom"
        format={(d) => format(d, PeriodType.Day, "short")}
        rule
    />
    <Area
        line={{ class: "stroke-2 stroke-accent-500" }}
        class="fill-accent-500/30"
    />
    <Highlight points lines />
    </Svg>
    <Tooltip header={(data) => formatDate(data.date, "eee, MMMM do")} let:data>
    <TooltipItem label="value" value={data.value} />
    </Tooltip>
</Chart>
</div>


<h2>Multiple series (highlight on hover)</h2>
<div class="h-[300px] p-4 border rounded">
<Chart
    data={multiSeriesFlatData}
    x="date"
    xScale={scaleTime()}
    y="value"
    yDomain={[0, null]}
    yNice
    r="fruit"
    rScale={scaleOrdinal()}
    rDomain={Object.keys(fruitColors)}
    rRange={Object.values(fruitColors)}
    padding={{ left: 16, bottom: 24, right: 48 }}
    tooltip={{ mode: "voronoi" }}
    let:tooltip
    let:rScale
>
    <Svg>
    <Axis placement="left" grid rule />
    <Axis
        placement="bottom"
        format={(d) => format(d, PeriodType.Day, "short")}
        rule
    />
    {#each dataByFruit as [fruit, data]}
        {@const color =
        tooltip.data == null || tooltip.data.fruit === fruit
            ? rScale(fruit)
            : "#ddd"}
        <Area
        {data}
        fill={color}
        fill-opacity={0.3}
        line={{ class: "stroke-2", stroke: color }}
        />
        <Point d={data[data.length - 1]} let:x let:y>
        <circle cx={x} cy={y} r={4} fill={color} />
        <Text
            {x}
            {y}
            value={fruit}
            verticalAnchor="middle"
            dx={6}
            dy={-2}
            class="text-xs"
            fill={color}
        />
        </Point>
    {/each}
    <Highlight points lines />
    </Svg>
    <Tooltip header={(data) => formatDate(data.date, "eee, MMMM do")} let:data>
    <TooltipItem label={data.fruit} value={data.value} />
    </Tooltip>
</Chart>
</div>


<h1>Apple Stock</h1>

<div class="h-[300px] border rounded">
    <Chart
      data={appleStock}
      x="date"
      xScale={scaleTime()}
      y="value"
      yDomain={[0, null]}
      yNice
      padding={{ top: 48, bottom: 24 }}
      tooltip
      let:width
      let:height
      let:padding
      let:tooltip
    >
      <Svg>
        <LinearGradient
          class="from-accent-500/50 to-accent-500/0"
          vertical
          let:url
        >
          <Area
            line={{ class: "stroke-2 stroke-accent-500 opacity-20" }}
            fill={url}
          />
          <RectClipPath
            x={0}
            y={0}
            width={tooltip.data ? tooltip.x : width}
            {height}
            spring
          >
            <Area line={{ class: "stroke-2 stroke-accent-500" }} fill={url} />
          </RectClipPath>
        </LinearGradient>
        <Highlight
          points
          lines={{ class: "stroke-accent-500 [stroke-dasharray:unset]" }}
        />
        <Axis placement="bottom" />
      </Svg>
  
      <Tooltip
        y={48}
        xOffset={4}
        variant="none"
        class="text-sm font-semibold text-accent-700 leading-3"
        let:data
      >
        {format(data.value, "currency")}
      </Tooltip>
  
      <Tooltip
        x={4}
        y={4}
        variant="none"
        class="text-sm font-semibold leading-3"
        let:data
      >
        {format(data.date, PeriodType.Day)}
      </Tooltip>
  
      <Tooltip
        x="data"
        y={height + padding.top + 2}
        anchor="top"
        variant="none"
        class="text-sm font-semibold bg-accent-500 text-white leading-3 px-2 py-1 rounded whitespace-nowrap"
        let:data
      >
        {format(data.date, PeriodType.Day)}
      </Tooltip>
    </Chart>
  </div>
