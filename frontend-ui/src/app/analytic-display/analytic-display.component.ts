import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FilterService } from '../services/filter.service';
import { LoaderService } from '../services/loader.service';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';
import { HealthService } from '../services/health.service';

@Component({
  selector: 'app-analytic-display',
  templateUrl: './analytic-display.component.html',
  styleUrls: ['./analytic-display.component.css']
})
export class AnalyticDisplayComponent implements OnInit {

  public filterData: any = {};
  public filterOptions: any = {};
  public apiHealthReady: Boolean = false;
  public analytics = [];

  constructor(
    private filterService: FilterService,
    private loaderService: LoaderService,
    private healthService: HealthService
  ) { }

  ngOnInit() {
    this.healthService.getAnalyticsApiHealth().subscribe((response) => {
      console.log(response)
      this.apiHealthReady = true;

      this.loaderService.startLoading();
      this.filterData = this.initFilterData();
      this.loadFilterOptions();
      this.analytics = [
        { title: "Creating visualizations ...", chart: {} },
        { title: "Creating visualizations ...", chart: {} },
        { title: "Creating visualizations ...", chart: {} },
        { title: "Creating visualizations ...", chart: {} },
        { title: "Creating visualizations ...", chart: {} }
      ];
      this.searchAnalytics();
    });
  }

  loadFilterOptions() {
    this.loaderService.startLoading();
    this.filterService.getFilterGroups().subscribe((response) => {
      this.filterOptions = response.data;
      console.log(this.filterOptions);
      this.loaderService.stopLoading();
    })
  }

  initFilterData() {
    return {
      dateStart: new Date('01/01/1900'),
      dateEnd: new Date('12/31/2099'),
      status: 'all',
      result: 'all',
      category: 'all',
      product: 'all'

      // dateStart: new FormControl('01/01/1900', [Validators.required]),
      // dateEnd: new FormControl('31/31/2099', [Validators.required]),
      // status: new FormControl('all', [Validators.required]),
      // result: new FormControl('all', [Validators.required]),
      // category: new FormControl('all', [Validators.required]),
      // product: new FormControl('all', [Validators.required])
    };
  }

  searchAnalytics() {
    console.log('searchAnalytics function ')
    console.log(this.filterData);

    this.loaderService.startLoading();
    this.filterService.postSearchAnalytics(this.filterData).subscribe((responseData) => {
      console.log(responseData);

      let chartData = null;
      this.analytics[0].title = "Category Distribution";
      chartData = responseData.data["Category Distribution"].map((datum) => {
        return { name: datum.category, value: datum.count }
      })
      this.analytics[0].chart = this.generateMultiGaugeChartOptions1(chartData);

      chartData = null;
      this.analytics[1].title = "Result Distribution";
      chartData = responseData.data["Result Distribution"].map((datum) => {
        return { name: datum.result, value: datum.count }
      })
      this.analytics[1].chart = this.generateHorizontalBarChartOptions1(chartData);

      chartData = null;
      this.analytics[2].title = "Market Distribution";
      chartData = responseData.data["Market Distribution"].map((datum) => {
        return { name: datum.market, value: datum.count }
      })
      this.analytics[2].chart = this.generateNightingleChartOptions1(chartData, 'Market');

      chartData = null;
      this.analytics[3].title = "Customer Distribution";
      chartData = responseData.data["Customer Distribution"].map((datum) => {
        return { name: datum.customer, value: datum.count }
      })
      this.analytics[3].chart = this.generateVerticalBarChartOptions1(chartData);

      chartData = null;
      this.analytics[4].title = "Status Distribution";
      chartData = responseData.data["Status Distribution"].map((datum) => {
        return { name: datum.status, value: datum.count }
      })
      this.analytics[4].chart = this.generateDonutChartOptions1(chartData, 'Status');

      this.loaderService.stopLoading();
    })
  }

  generateNightingleChartOptions1(data: any, tooltipName): any {
    let legendNames = [];
    for (let k in data) legendNames.push(data[k].name);
    let options = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        x: 'center',
        y: 'top',
        data: legendNames
      },
      calculable: true,
      series: [
        {
          name: tooltipName,
          type: 'pie',
          radius: [30, 110],
          roseType: 'area',
          data: data,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
        }
      ]
    };
    return options;
  }

  generateDonutChartOptions1(data: any, tooltipName): any {
    let legendNames = [];
    for (let k in data) legendNames.push(data[k].name);
    let options = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        x: 'center',
        y: 'top',
        data: legendNames
      },
      calculable: true,
      series: [
        {
          name: tooltipName,
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          data: data,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
        }
      ]
    };
    return options;
  }

  generateHorizontalBarChartOptions1(data: any): any {
    let dataAxis = [];
    let dataValues = [];

    for (let k in data) {
      dataAxis.push(data[k].name);
      dataValues.push(data[k].value)
    };

    let options = {
      // title: {
      //   text: 'Check Console for Events',
      // },
      yAxis: {
        type: 'category',
        data: dataAxis,
        axisLabel: {
          inside: true,
          color: '#080808'
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        z: 10
      },
      xAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#080808',
          },
        },
      },
      series: [
        {
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            color: new LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' },
              ]),
            }
          },
          data: dataValues,
        },
      ],
    };

    return options;
  }

  generateVerticalBarChartOptions1(data: any): any {
    let dataAxis = [];
    let dataValues = [];

    for (let k in data) {
      dataAxis.push(data[k].name);
      dataValues.push(data[k].value)
    };

    let options = {
      // title: {
      //   text: 'Check Console for Events',
      // },
      xAxis: {
        type: 'category',
        data: dataAxis,
        axisLabel: {
          inside: true,
          color: '#080808',
          rotate: 90
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        z: 10
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#080808',
          },
        },
      },
      series: [
        {
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            color: new LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' },
              ]),
            }
          },
          data: dataValues,
        },
      ],
    };

    return options;
  }

  generateMultiGaugeChartOptions1(data: any): any {

    if (data.length == 1) {
      data[0]['title'] = {
        offsetCenter: ['0%', '80%']
      };
      data[0]['detail'] = {
        offsetCenter: ['0%', '95%']
      };
    }
    else if (data.length == 2) {
      data[0]['title'] = {
        offsetCenter: ['-40%', '80%']
      };
      data[0]['detail'] = {
        offsetCenter: ['-40%', '95%']
      };
      data[1]['title'] = {
        offsetCenter: ['40%', '80%']
      };
      data[1]['detail'] = {
        offsetCenter: ['40%', '95%']
      };
    }
    else if (data.length == 3) {
      data[0]['title'] = {
        offsetCenter: ['-40%', '80%']
      };
      data[0]['detail'] = {
        offsetCenter: ['-40%', '95%']
      };
      data[1]['title'] = {
        offsetCenter: ['0%', '80%']
      };
      data[1]['detail'] = {
        offsetCenter: ['0%', '95%']
      };
      data[2]['title'] = {
        offsetCenter: ['40%', '80%']
      };
      data[2]['detail'] = {
        offsetCenter: ['40%', '95%']
      };
    }
    else if (data.length == 4) {
      data[0]['title'] = {
        offsetCenter: ['-60%', '80%']
      };
      data[0]['detail'] = {
        offsetCenter: ['-60%', '95%']
      };
      data[1]['title'] = {
        offsetCenter: ['-20%', '80%']
      };
      data[1]['detail'] = {
        offsetCenter: ['-20%', '95%']
      };
      data[2]['title'] = {
        offsetCenter: ['20%', '80%']
      };
      data[2]['detail'] = {
        offsetCenter: ['20%', '95%']
      };
      data[3]['title'] = {
        offsetCenter: ['60%', '80%']
      };
      data[3]['detail'] = {
        offsetCenter: ['60%', '95%']
      };
    }
    let options = {
      series: [{
        type: 'gauge',
        max: 15,
        anchor: {
          show: true,
          showAbove: true,
          size: 18,
          itemStyle: {
            color: '#FAC858'
          }
        },
        pointer: {
          icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
          width: 8,
          length: '80%',
          offsetCenter: [0, '8%']
        },

        progress: {
          show: true,
          overlap: true,
          roundCap: true
        },
        axisLine: {
          roundCap: true
        },
        data: data,
        title: {
          fontSize: 14
        },
        detail: {
          width: 40,
          height: 14,
          fontSize: 14,
          color: '#fff',
          backgroundColor: 'auto',
          borderRadius: 3,
          formatter: '{value}'
        }
      }]
    };

    return options;
  }
}
