<script lang="ts">
	import type { EChartsOption } from 'echarts';
	import { Chart } from '$lib/components/echarts-excalichart';
	// import {Chart } from 'svelte-echarts'
	import {Activity,CreditCard,DollarSign,	Download,Users, Hourglass} from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";
	import {Overview, RecentSales	} from "$lib/components/dashboard";
	import { DataTable, Column, ECharts, AreaChart, LineChart} from '@evidence-dev/core-components';
	export let data;

	let get_overview_per_quarter = data.entries_get_overview_per_quarter;

	let test = get_overview_per_quarter.map(item => [
			new Date(item.quarter_end_date),
			item.total_value_per_quarter_usd])

$: {console.log(test.slice(0, 2)); }// Output: false

	let quarters = get_overview_per_quarter.map(item => (item.quarter)).reverse();
	let sliderValue = quarters.length -1;
	$: inputYearQuater = quarters[sliderValue];

	const [ total_cusips, total_years, total_quarters, 
        total_ciks,
        last_reporting_date, last_quarter_ciks, last_quarter_cusips] = get_overview_per_quarter.map(q => [q.total_cusip_num0,
		q.total_years, q.total_quarters, q.total_ciks_num0,
		q.last_reporting_date.toISOString().slice(0, 10), q.num_ciks_per_quarter_num0, q.num_cusip_per_quarter_num0])[0];
	let chartAreaHeight = 300;

	let cusip = '';
	// type DataRecord = { x: number, y: number }
	// export let data_unovis = [
	// 	{ x: 0, y: 0 },
	// 	{ x: 1, y: 2 },
	// 	{ x: 2, y: 1 },
	// ];

// let test = 3;
// let options2 = {	
//     title: {
//             text: `Value by Asset ${test}`,
//             left: 'center'
//         },
//         tooltip: {
//             formatter: function (params: any) {
//                 let value = params.data.value;
//                 let formattedValue = '';
//                 if (value >= 1e12) {
//                     formattedValue = (value / 1e12).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'T';
//                 } else if (value >= 1e9) {
//                     formattedValue = (value / 1e9).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
//                 } else if (value >= 1e6) {
//                     formattedValue = (value / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
//                 } else {
//                     formattedValue = value.toLocaleString('en-US', { maximumFractionDigits: 2 });
//                 }
//                 return `${params.data.name}<br/>
//                     $${formattedValue}<br/>
//                     ${(params.data.pct_pct * 100).toFixed(2)}% `;
//             },
//         },
//         series: [
//             {
//                 name: 'All Assets',
//                 type: 'treemap',
//                 data: cusip.map(item => ({
//                     value: item.value,
//                     name: item.cusip_ticker,
//                     pct_pct: item.value * 0.05
//                 })),
//                 label: {
//                     fontWeight: 'bold',
//                     position: 'insideTopLeft',
//                     show: true,
//                     formatter: '{b}'
//                 },
//                 emphasis: {
//                     label: {
//                         show: true,
//                         fontSize: '14',
//                         fontWeight: 'bold'
//                     }
//                 },
//                 itemStyle: {
//                     gapWidth: 3,
//                     borderColor: 'white',
//                 },
//             }
//         ]
//                     } satisfies EChartsOption;

let options3 = {	
	
    tooltip: {
		trigger: 'axis',
		show: true,
		// formatter: function (params: any) {
        //         let [name, value] = params;
        //         let formattedValue = '';
        //         // if (value >= 1e12) {
        //         //     formattedValue = (value / 1e12).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'T';
        //         // } else if (value >= 1e9) {
        //         //     formattedValue = (value / 1e9).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'B';
        //         // } else if (value >= 1e6) {
        //         //     formattedValue = (value / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
        //         // } else {
        //         //     formattedValue = value.toLocaleString('en-US', { maximumFractionDigits: 2 });
        //         // }
        //         return `
        //             $${name[0]}<br/>, ${value[0]}`;
        //     },
		
        
    },
    xAxis: {
        type: 'time',
		
    },
    yAxis: {
        type: 'value',
		axisLabel: {
            formatter: function (value: any) {
                let formattedValue = '';
                if (value >= 1e12) {
                    formattedValue = (value / 1e12).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'T';
                } else if (value >= 1e9) {
                    formattedValue = (value / 1e9).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'B';
                } else if (value >= 1e6) {
                    formattedValue = (value / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
                } else {
                    formattedValue = value.toLocaleString('en-US', { maximumFractionDigits: 2 });
                }
                return `$${formattedValue}`;
            }
        }
    },
    series: [
        {
            type: 'line',
			tooltip: {
				formatter: function (params) {
                let value = params.value;
                let formattedValue = '';
                if (value >= 1e12) {
                    formattedValue = (value / 1e12).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'T';
                } else if (value >= 1e9) {
                    formattedValue = (value / 1e9).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
                } else if (value >= 1e6) {
                    formattedValue = (value / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
                } else {
                    formattedValue = value.toLocaleString('en-US', { maximumFractionDigits: 2 });
                }
                return `${params.name}<br/>
                    $${formattedValue}<br/>`;
            },
		},
			symbol: 'none',
            data: get_overview_per_quarter.map(item => [
			new Date(item.quarter_end_date),
			item.total_value_per_quarter_usd
		]),	
            emphasis: {
                focus: 'series'
            },
            lineStyle: {
                width: 2
            },
        }
    ]
} satisfies EChartsOption;

	// console.log(get_overview_per_quarter.slice(0, 3))
</script>

<div class="flex-col flex">	

	<div class="flex-1 space-y-4 p-8 pt-6">
		
		<Tabs.Root value="overview" class="space-y-4">			
			<Tabs.List>
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="analytics" >Analytics</Tabs.Trigger
				>
				<Tabs.Trigger value="reports" >Reports</Tabs.Trigger>
				<Tabs.Trigger value="example" disabled>Example</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="overview" class="space-y-4">
				<div class="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
					<Card.Root>
							<Card.Header
								class="flex flex-row items-center justify-between space-y-0 pb-2"
							>
								<Card.Title class="text-sm font-medium "
									>Total Superinvestors</Card.Title
								>
								<Users class="h-6 w-6 text-muted-foreground" />
							</Card.Header>
							<Card.Content>
								<div class="text-2xl font-bold">{total_ciks}</div>
								<!-- <p class="text-xs text-muted-foreground">
									+180.1% from last month
								</p> -->
							</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Total Years</Card.Title
							>
							<Hourglass class="h-6 w-6 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">{total_years}</div>
							<p class="text-xs text-muted-foreground">
								Total Quarters: {total_quarters}
							</p>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Total Assets Traded</Card.Title
							>
							<DollarSign class="h-6 w-6 text-muted-foreground"  />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">{total_cusips}</div>
							<p class="text-xs text-muted-foreground">
								{last_quarter_cusips} traded in {inputYearQuater}
							</p>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Superinvestors Active Now</Card.Title
							>
							<Activity class="h-6 w-6 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">{last_quarter_ciks}</div>
							<p class="text-xs text-muted-foreground">
								Last Complete Quarter: {inputYearQuater}
							</p>
						</Card.Content>
					</Card.Root>
				</div>
				<div class="grid gap-4 lg:grid-cols-7 md:grid-cols-2 sm:grid-cols-1">
					<Card.Root class="col-span-4">
						<Card.Header>
							<Card.Title>Line Chart - Evidence</Card.Title>
						</Card.Header>
						<Card.Content>
							<!-- <DataTable data="{cusip}"
								headerColor="black"
								headerFontColor='white'
									search={true} >
								<Column id="cusip_ticker" title='cusip'/>
								<Column id="value" title='Value' contentType=colorscale/>  
							</DataTable> -->

							<!-- <LineChart {chartAreaHeight}
							data={get_overview_per_quarter}
							x=quarter_end_date 
							y=total_value_per_quarter_usd
							yAxisTitle="Value($)"
							sort=asc
						/> -->

						<!-- <VisXYContainer height={500}>
							<VisLine data={get_overview_per_quarter} x={d => d.year_as_string} y={d => d.total_value_per_quarter_usd}/>
							<VisAxis type="x"/>
							<VisAxis type="y"/>
						</VisXYContainer> -->

						<!-- <Chart options={options3} /> -->
						</Card.Content>
					</Card.Root>
					<Card.Root class="col-span-3">
						<Card.Header>
							<Card.Title>Recent Sales</Card.Title>
							<Card.Description>
								You made 265 sales this month.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<RecentSales />
						</Card.Content>
					</Card.Root>
				</div>

				<div class="grid gap-4 lg:grid-cols-7 md:grid-cols-2 sm:grid-cols-1">
					<Card.Root class="col-span-4">
						<Card.Header>
							<Card.Title>Line Chart - eCharts</Card.Title>
						</Card.Header>
						<Chart options={options3} />
					</Card.Root>
					<Card.Root class="col-span-3">
						<Card.Header>
							<Card.Title>Recent Sales</Card.Title>
							<Card.Description>
								You made 265 sales this month.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<RecentSales />
						</Card.Content>
					</Card.Root>
				</div>


			</Tabs.Content>
			<Tabs.Content value="analytics" class="space-y-4">
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Total Revenue</Card.Title
							>
							<DollarSign class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">$45,231.89</div>
							<p class="text-xs text-muted-foreground">
								+20.1% from last month
							</p>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Subscriptions</Card.Title
							>
							<Users class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">+2350</div>
							<p class="text-xs text-muted-foreground">
								+180.1% from last month
							</p>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Sales</Card.Title
							>
							<CreditCard class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">+12,234</div>
							<p class="text-xs text-muted-foreground">
								+19% from last month
							</p>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Active Now</Card.Title
							>
							<Activity class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">+573</div>
							<p class="text-xs text-muted-foreground">
								+201 since last hour
							</p>
						</Card.Content>
					</Card.Root>
				</div>
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
					<Card.Root class="col-span-4">
						<Card.Header>
							<Card.Title>Overview</Card.Title>
						</Card.Header>
						<Card.Content>
							<Overview />
						</Card.Content>
					</Card.Root>
					<Card.Root class="col-span-3">
						<Card.Header>
							<Card.Title>Recent Sales</Card.Title>
							<Card.Description>
								You made 265 sales this month.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<RecentSales />
						</Card.Content>
					</Card.Root>
				</div>
			</Tabs.Content>
			<Tabs.Content value="reports" class="space-y-4">
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Total Revenue</Card.Title
							>
							<DollarSign class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">$45,231.89</div>
							<p class="text-xs text-muted-foreground">
								+20.1% from last month
							</p>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Subscriptions</Card.Title
							>
							<Users class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">+2350</div>
							<p class="text-xs text-muted-foreground">
								+180.1% from last month
							</p>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Sales</Card.Title
							>
							<CreditCard class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">+12,234</div>
							<p class="text-xs text-muted-foreground">
								+19% from last month
							</p>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium"
								>Active Now</Card.Title
							>
							<Activity class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">+573</div>
							<p class="text-xs text-muted-foreground">
								+201 since last hour
							</p>
						</Card.Content>
					</Card.Root>
				</div>
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
					<Card.Root class="col-span-4">
						<Card.Header>
							<Card.Title>Overview</Card.Title>
						</Card.Header>
						<Card.Content>
							<Overview />
						</Card.Content>
					</Card.Root>
					<Card.Root class="col-span-3">
						<Card.Header>
							<Card.Title>Recent Sales</Card.Title>
							<Card.Description>
								You made 265 sales this month.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<RecentSales />
						</Card.Content>
					</Card.Root>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
	
</div>
